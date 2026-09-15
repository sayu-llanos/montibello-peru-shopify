#!/usr/bin/env node
// Montibello HOP PDP data fix (Phase 4F).
//
// Usage: node scripts/shopify/hop-pdp-fix-apply.js            (plan only)
//        node scripts/shopify/hop-pdp-fix-apply.js --apply
//
// For the 10 confirmed non-Keratin HOP products:
//   1. Creates 10 product-specific montibello_feature metaobjects (official
//      benefit heading + bullets, verified against hair.montibello.com raw
//      HTML and hop-guia-tecnica.pdf in the Phase 4E audit) and repoints
//      each product's montibello.features reference from the old shared
//      "wheel" feature to its own new one. The 3 wheel features
//      (feature-reparacion-antirrotura, feature-accion-antioxidante-proteccion-uv,
//      feature-hidratacion-control-frizz) are never deleted, only
//      dereferenced from these 10 products.
//   2. Creates 1 shared montibello_ingredient (LifeAlgae Bioscience) and adds
//      it as a second key_ingredients reference on all 10 products, alongside
//      their existing family ingredient (Colágeno Vegano / Ácido Ferúlico /
//      Ácido Hialurónico), which is preserved unchanged.
//   3. Fills montibello.how_to_use on the 9 products where it is currently
//      blank (Ultra Repair Shampoo's existing value already matches the
//      official source exactly and is left untouched).
//   4. Corrects montibello.interest_data on all 10 products to the verbatim
//      official "Datos de interés" accordion text (previously held
//      paraphrased or misplaced BENEFICIOS content).
//
// Never touches: SKUs, variants, prices, inventory, product status, media,
// range/subfamily/hair_type/functional_subtitle/technology_* fields, UNDER,
// LUXLIGHT, HOP Keratin, Davines. Never uses productSet. Never deletes any
// metaobject.

const path = require('node:path');
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken } = require('./lib/oauth');
const { AdminClient, assertNoUserErrors } = require('./lib/admin-client');
const { PRODUCT_LOOKUP, METAOBJECT_BY_HANDLE, METAFIELDS_SET } = require('./lib/queries');
const ops = require('./lib/operations');

const APPLY = process.argv.includes('--apply');
const NAMESPACE = 'montibello';

function toRichTextParagraphs(lines) {
  return JSON.stringify({
    type: 'root',
    children: lines.map((line) => ({ type: 'paragraph', children: [{ type: 'text', value: line }] })),
  });
}

function toRichTextValue(plainText) {
  return toRichTextParagraphs([plainText]);
}

// --- Fixed, audit-approved content (Phase 4E -> 4F decision) --------------

const EXISTING_INGREDIENT_GIDS = {
  'ingredient-colageno-vegano': 'gid://shopify/Metaobject/223958991041',
  'ingredient-acido-ferulico': 'gid://shopify/Metaobject/223959023809',
  'ingredient-acido-hialuronico': 'gid://shopify/Metaobject/223959056577',
};

const OLD_WHEEL_FEATURE_HANDLES = new Set([
  'feature-reparacion-antirrotura',
  'feature-accion-antioxidante-proteccion-uv',
  'feature-hidratacion-control-frizz',
]);

const LIFEALGAE_INGREDIENT = {
  handle: 'ingredient-lifealgae-bioscience',
  title: 'LifeAlgae Bioscience',
  description:
    'Combinación de algas que amplifica y potencia las moléculas activas, sus efectos se multiplican x4 permitiendo actuar sobre cuero cabelludo y cabello.',
};

// como_usar: null means "already correct on Shopify, do not write."
const PRODUCTS = [
  {
    handle: 'hop-ultra-repair-shampoo',
    existingIngredientHandle: 'ingredient-colageno-vegano',
    featureHandle: 'feature-hop-ultra-repair-shampoo-benefits',
    featureTitle: 'El primer paso en tu rutina de cuidado',
    featureBullets: [
      'Reconstruye, fortalece, repara y protege para conseguir un cabello más fuerte y resistente.',
      'Cabello suave y sedoso con una fluidez ligera.',
      'Indicado para cabellos dañados químicamente, térmicamente o por factores medioambientales.',
    ],
    interestData:
      'La fusión de la biociencia de las algas enriquecida con ingredientes cosméticos de alta eficacia para corregir los 8 signos del bienestar. Enriquecido con COLÁGENO VEGANO, un complejo de proteínas de origen vegetal que rellena, fortalece y restaura la fibra capilar a la vez que proporciona brillo, elasticidad y suavidad.',
    comoUsar: null, // already correct live — verified match, do not overwrite
  },
  {
    handle: 'hop-ultra-repair-rinse',
    existingIngredientHandle: 'ingredient-colageno-vegano',
    featureHandle: 'feature-hop-ultra-repair-rinse-benefits',
    featureTitle: 'Tratamiento diario en la ducha',
    featureBullets: [
      'Refuerza y fortifica la fibra capilar para evitar su rotura.',
      'Facilita el desenredado.',
      'Cabello reparado, ligero y brillante.',
      'Indicado para cabellos dañados maltratados química, térmicamente o por factores medioambientales.',
    ],
    interestData:
      'La fusión de la biociencia de las algas enriquecida con ingredientes cosméticos de alta eficacia para corregir los 8 signos del bienestar. Enriquecido con COLÁGENO VEGANO, un complejo de proteínas de origen vegetal que rellena, fortalece y restaura la fibra capilar a la vez que proporciona brillo, elasticidad y suavidad.',
    comoUsar: 'Aplicar sobre el cabello lavado, dejar actuar de 1 a 2 minutos y aclarar.',
  },
  {
    handle: 'hop-ultra-repair-mask',
    existingIngredientHandle: 'ingredient-colageno-vegano',
    featureHandle: 'feature-hop-ultra-repair-mask-benefits',
    featureTitle: 'Reconstruye y refuerza el cabello desde el interior',
    featureBullets: [
      'Repara profundamente el cabello dañado y seco.',
      'Protege el cabello de la sequedad.',
      'Previene roturas y ayuda a prevenir las puntas abiertas.',
      'Indicado para cabellos dañados maltratados química, térmicamente o por factores medioambientales.',
    ],
    interestData:
      'La fusión de la biociencia de las algas enriquecida con ingredientes cosméticos de alta eficacia para corregir los 8 signos del bienestar. Enriquecido con COLÁGENO VEGANO, un complejo de proteínas de origen vegetal que rellena, fortalece y restaura la fibra capilar a la vez que proporciona brillo, elasticidad y suavidad.',
    comoUsar: 'Aplicar sobre el cabello lavado, dejar actuar de 3 a 5 minutos y aclarar.',
  },
  {
    handle: 'hop-ultra-repair-sealed-ends',
    existingIngredientHandle: 'ingredient-colageno-vegano',
    featureHandle: 'feature-hop-ultra-repair-sealed-ends-benefits',
    featureTitle: 'Renueva, nutre y sella aportando flexibilidad y brillo',
    featureBullets: [
      'Nutre intensamente y sella las puntas.',
      'Controla el encrespado y facilita el secado.',
      'Protección térmica.',
      'Cabello nutrido, suave, fácil de peinar y con brillo.',
    ],
    interestData:
      'La fusión de la biociencia de las algas enriquecida con ingredientes cosméticos de alta eficacia para corregir los 8 signos del bienestar. Enriquecido con COLÁGENO VEGANO, un complejo de proteínas de origen vegetal que rellena, fortalece y restaura la fibra capilar a la vez que proporciona brillo, elasticidad y suavidad.',
    comoUsar: 'Aplicar una pequeña cantidad sobre las puntas. No aclarar.',
  },
  {
    handle: 'hop-colour-last-shampoo',
    existingIngredientHandle: 'ingredient-acido-ferulico',
    featureHandle: 'feature-hop-colour-last-shampoo-benefits',
    featureTitle: 'El primer paso para un color perfecto',
    featureBullets: [
      'Ayuda a sellar el color en el cabello por más tiempo y evita la pérdida del color.',
      'El cabello luce con un tono que perdura, más intenso y brillante.',
      'Indicado para todo tipo de cabellos, especialmente para cabellos coloreados con tendencia a la pérdida de color y del brillo.',
    ],
    interestData:
      'La fusión de la biociencia de las algas enriquecida con ingredientes cosméticos de alta eficacia para corregir los 8 signos del bienestar. Enriquecido con ÁCIDO FERÚLICO, un potente antioxidante de origen vegetal con alto poder hidratante que protege y prolonga el color y el brillo, y con una capacidad protectora que neutraliza los daños procedentes de la radiación solar.',
    comoUsar: 'Aplicar sobre el cabello mojado. Masajear, dejar actuar y aclarar. Repetir si fuese necesario.',
  },
  {
    handle: 'hop-colour-last-rinse',
    existingIngredientHandle: 'ingredient-acido-ferulico',
    featureHandle: 'feature-hop-colour-last-rinse-benefits',
    featureTitle: 'Tratamiento diario en la ducha',
    featureBullets: [
      'Sella la cutícula y protege el cabello contra la pérdida del color.',
      'Cabello ligero, manejable y con brillo.',
      'Indicado para todo tipo de cabellos, especialmente para cabellos coloreados con tendencia a la pérdida de color y del brillo.',
    ],
    interestData:
      'La fusión de la biociencia de las algas enriquecida con ingredientes cosméticos de alta eficacia para corregir los 8 signos del bienestar. Enriquecido con ÁCIDO FERÚLICO, un potente antioxidante de origen vegetal con alto poder hidratante que protege y prolonga el color y el brillo, y con una capacidad protectora que neutraliza los daños procedentes de la radiación solar.',
    comoUsar: 'Aplicar sobre el cabello lavado, dejar actuar de 1 a 2 minutos y aclarar.',
  },
  {
    handle: 'hop-colour-last-mask',
    existingIngredientHandle: 'ingredient-acido-ferulico',
    featureHandle: 'feature-hop-colour-last-mask-benefits',
    featureTitle: 'Hidratación y reparación en profundidad',
    featureBullets: [
      'Prolonga el color, hidrata y repara en profundidad.',
      'Brillo radiante e intensidad del color más duradero.',
      'Indicado para todo tipo de cabellos, especialmente para cabellos coloreados con tendencia a la pérdida de color y del brillo.',
    ],
    interestData:
      'La fusión de la biociencia de las algas enriquecida con ingredientes cosméticos de alta eficacia para corregir los 8 signos del bienestar. Enriquecido con ÁCIDO FERÚLICO, un potente antioxidante de origen vegetal con alto poder hidratante que protege y prolonga el color y el brillo, y con una capacidad protectora que neutraliza los daños procedentes de la radiación solar.',
    comoUsar: 'Aplicar sobre el cabello lavado, dejar actuar de 3 a 5 minutos y aclarar.',
  },
  {
    handle: 'hop-smooth-hydration-shampoo',
    existingIngredientHandle: 'ingredient-acido-hialuronico',
    featureHandle: 'feature-hop-smooth-hydration-shampoo-benefits',
    featureTitle: 'Hidratación profunda a cada paso',
    featureBullets: [
      'Fortalece el cabello y proporciona una alta dosis de hidratación.',
      'Elimina el frizz y aporta control.',
      'Cabello sedoso, suelto y flexible.',
      'Indicado para todo tipo de cabellos, especialmente los cabellos secos, ásperos, encrespados, con tendencia a la rotura, difíciles de controlar y sin brillo.',
    ],
    interestData:
      'La fusión de la biociencia de las algas enriquecida con ingredientes cosméticos de alta eficacia para corregir los 8 signos del bienestar. Enriquecido con ÁCIDO HIALURÓNICO, un activo altamente hidratante que repara la función barrera del cabello para mejorar la elasticidad, controlar el frizz y devolver el brillo, la suavidad y la manejabilidad.',
    // Source has a duplicated-period typo ("mojado.. Masajear... aclarar.. Repetir...necesario..") —
    // normalized to single periods (matching the identical wording used verbatim
    // elsewhere for this exact step); this is a punctuation fix, not a content change.
    comoUsar: 'Aplicar sobre el cabello mojado. Masajear, dejar actuar y aclarar. Repetir si fuese necesario.',
  },
  {
    handle: 'hop-smooth-hydration-rinse',
    existingIngredientHandle: 'ingredient-acido-hialuronico',
    featureHandle: 'feature-hop-smooth-hydration-rinse-benefits',
    featureTitle: 'Tratamiento diario en la ducha',
    featureBullets: [
      'Combate el frizz y aporta flexibilidad y suavidad sin peso.',
      'Desenreda y acondiciona.',
      'Cabello más manejable, con control y brillo.',
      'Cabello suave, sedoso y brillante.',
    ],
    interestData:
      'La fusión de la biociencia de las algas enriquecida con ingredientes cosméticos de alta eficacia para corregir los 8 signos del bienestar. Enriquecido con ÁCIDO HIALURÓNICO, un activo altamente hidratante que repara la función barrera del cabello para mejorar la elasticidad, controlar el frizz y devolver el brillo, la suavidad y la manejabilidad.',
    comoUsar: 'Aplicar sobre el cabello lavado, dejar actuar de 1 a 2 minutos y aclarar.',
  },
  {
    handle: 'hop-smooth-hydration-mask',
    existingIngredientHandle: 'ingredient-acido-hialuronico',
    featureHandle: 'feature-hop-smooth-hydration-mask-benefits',
    featureTitle: 'Hidratación y reparación profunda',
    featureBullets: [
      'Restaura, preserva y sella la hidratación en el interior del cabello.',
      'Aporta elasticidad y resistencia frente a la rotura.',
      'Protege contra el encrespamiento.',
      'Cabello suave, sedoso y brillante.',
    ],
    interestData:
      'La fusión de la biociencia de las algas enriquecida con ingredientes cosméticos de alta eficacia para corregir los 8 signos del bienestar. Enriquecido con ÁCIDO HIALURÓNICO, un activo altamente hidratante que repara la función barrera del cabello para mejorar la elasticidad, controlar el frizz y devolver el brillo, la suavidad y la manejabilidad.',
    // Same duplicated-period typo as the Smooth Hydration Shampoo case, same fix.
    comoUsar: 'Aplicar sobre el cabello lavado, dejar actuar de 3 a 5 minutos y aclarar.',
  },
];

async function main() {
  const loaded = loadShopifyEnv(REPO_ROOT);
  if (!loaded.ok) throw new Error(loaded.reason);
  const { shop, clientId, clientSecret, apiVersion } = loaded.env;
  const { accessToken } = await fetchAccessToken({ shop, clientId, clientSecret });
  const client = new AdminClient({
    storeDomain: `${shop}.myshopify.com`,
    accessToken,
    apiVersion,
    requiredStoreDomain: REQUIRED_STORE_DOMAIN,
  });

  console.log(`\n=== Phase 4F — HOP PDP fix (${APPLY ? 'APPLY' : 'PLAN ONLY'}) ===\n`);

  // --- Pre-flight: fetch all 10 products, confirm current state -----------
  const products = [];
  for (const spec of PRODUCTS) {
    const data = await client.request(PRODUCT_LOOKUP, { handle: spec.handle });
    const product = data.productByHandle;
    if (!product) throw new Error(`Product not found: ${spec.handle} — aborting, no writes made.`);
    products.push({ spec, product });
  }

  // --- Pre-flight: confirm the 3 existing ingredients + 3 wheel features still exist unchanged ---
  for (const handle of Object.keys(EXISTING_INGREDIENT_GIDS)) {
    const data = await client.request(METAOBJECT_BY_HANDLE, { handle: { type: 'montibello_ingredient', handle } });
    if (!data.metaobjectByHandle) throw new Error(`Expected existing ingredient metaobject missing: ${handle} — aborting.`);
    if (data.metaobjectByHandle.id !== EXISTING_INGREDIENT_GIDS[handle]) {
      throw new Error(`Ingredient ${handle} GID mismatch: expected ${EXISTING_INGREDIENT_GIDS[handle]}, got ${data.metaobjectByHandle.id} — aborting.`);
    }
  }
  for (const handle of OLD_WHEEL_FEATURE_HANDLES) {
    const data = await client.request(METAOBJECT_BY_HANDLE, { handle: { type: 'montibello_feature', handle } });
    if (!data.metaobjectByHandle) throw new Error(`Expected existing wheel feature metaobject missing: ${handle} — aborting.`);
  }

  // --- Pre-flight: the 11 new metaobjects must not already exist with different content ---
  const newFeatureConflicts = [];
  for (const { spec } of products) {
    const data = await client.request(METAOBJECT_BY_HANDLE, { handle: { type: 'montibello_feature', handle: spec.featureHandle } });
    if (data.metaobjectByHandle) newFeatureConflicts.push({ handle: spec.featureHandle, existing: data.metaobjectByHandle });
  }
  const lifealgaeExisting = await client.request(METAOBJECT_BY_HANDLE, {
    handle: { type: 'montibello_ingredient', handle: LIFEALGAE_INGREDIENT.handle },
  });
  if (lifealgaeExisting.metaobjectByHandle) newFeatureConflicts.push({ handle: LIFEALGAE_INGREDIENT.handle, existing: lifealgaeExisting.metaobjectByHandle });

  if (newFeatureConflicts.length > 0) {
    console.log('ABORT — the following target metaobjects already exist:');
    console.log(JSON.stringify(newFeatureConflicts, null, 2));
    process.exit(1);
  }

  // --- Build & print APPLY PLAN --------------------------------------------
  console.log('--- PLAN: 10 new montibello_feature metaobjects ---');
  for (const { spec } of products) {
    console.log(`  ${spec.featureHandle} — "${spec.featureTitle}" (${spec.featureBullets.length} bullets)`);
  }
  console.log('\n--- PLAN: 1 new montibello_ingredient metaobject ---');
  console.log(`  ${LIFEALGAE_INGREDIENT.handle} — "${LIFEALGAE_INGREDIENT.title}"`);

  console.log('\n--- PLAN: per-product reference + field changes ---');
  let howToUseWriteCount = 0;
  let howToUsePreservedCount = 0;
  for (const { spec, product } of products) {
    const currentFeatures = JSON.parse(product.metafields.nodes.find((m) => m.key === 'features')?.value || '[]');
    const currentIngredients = JSON.parse(product.metafields.nodes.find((m) => m.key === 'key_ingredients')?.value || '[]');
    const currentHowToUse = product.metafields.nodes.find((m) => m.key === 'how_to_use');
    const currentInterestData = product.metafields.nodes.find((m) => m.key === 'interest_data');
    if (spec.comoUsar === null) {
      howToUsePreservedCount += 1;
    } else {
      howToUseWriteCount += 1;
    }
    console.log(`\n  ${spec.handle}`);
    console.log(`    features: ${JSON.stringify(currentFeatures)} -> [NEW:${spec.featureHandle}]`);
    console.log(`    key_ingredients: ${JSON.stringify(currentIngredients)} -> [${spec.existingIngredientHandle}, ${LIFEALGAE_INGREDIENT.handle}]`);
    console.log(`    how_to_use: ${spec.comoUsar === null ? 'PRESERVE (already matches source)' : `WRITE "${spec.comoUsar}"`}`);
    console.log(`    interest_data: "${(currentInterestData?.value || '').slice(0, 60)}..." -> "${spec.interestData.slice(0, 60)}..."`);
  }

  const totals = {
    featureMetaobjectsToCreate: products.length,
    ingredientMetaobjectsToCreate: 1,
    productsWithFeatureRefChange: products.length,
    productsWithIngredientRefChange: products.length,
    howToUseWrites: howToUseWriteCount,
    howToUsePreserved: howToUsePreservedCount,
    interestDataCorrections: products.length,
  };
  console.log('\n--- PLAN TOTALS ---');
  console.log(JSON.stringify(totals, null, 2));

  if (totals.featureMetaobjectsToCreate !== 10 || totals.howToUseWrites !== 9 || totals.howToUsePreserved !== 1 || totals.interestDataCorrections !== 10) {
    console.log('\nABORT — plan totals do not match the audit-approved counts (10 features / 9 how_to_use writes / 1 preserved / 10 interest_data). STOPPING.');
    process.exit(1);
  }

  if (!APPLY) {
    console.log('\nPlan-only run. Re-run with --apply to execute.');
    return;
  }

  // --- APPLY: confirm montibello_feature.description field type live ------
  console.log('\n=== APPLYING ===\n');
  const firstSpec = products[0].spec;
  let descriptionFormat = null;
  const richTextAttempt = await client.request(require('./lib/queries').METAOBJECT_UPSERT, {
    handle: { type: 'montibello_feature', handle: firstSpec.featureHandle },
    metaobject: { fields: [{ key: 'title', value: firstSpec.featureTitle }, { key: 'description', value: toRichTextParagraphs(firstSpec.featureBullets) }] },
  });
  if (!richTextAttempt.metaobjectUpsert.userErrors || richTextAttempt.metaobjectUpsert.userErrors.length === 0) {
    descriptionFormat = 'rich_text_field';
    console.log(`Confirmed montibello_feature.description accepts rich_text_field JSON (created ${firstSpec.featureHandle}).`);
  } else {
    console.log('Rich text format rejected:', JSON.stringify(richTextAttempt.metaobjectUpsert.userErrors));
    const plainAttempt = await client.request(require('./lib/queries').METAOBJECT_UPSERT, {
      handle: { type: 'montibello_feature', handle: firstSpec.featureHandle },
      metaobject: { fields: [{ key: 'title', value: firstSpec.featureTitle }, { key: 'description', value: firstSpec.featureBullets.join('\n\n') }] },
    });
    if (!plainAttempt.metaobjectUpsert.userErrors || plainAttempt.metaobjectUpsert.userErrors.length === 0) {
      descriptionFormat = 'plain_multiline';
      console.log(`Confirmed montibello_feature.description accepts plain multi-line text (created ${firstSpec.featureHandle}).`);
    } else {
      console.log('ABORT — montibello_feature.description cannot safely hold the audited multi-sentence content in either format.');
      console.log(JSON.stringify(plainAttempt.metaobjectUpsert.userErrors));
      process.exit(1);
    }
  }

  // --- Create the remaining 9 feature metaobjects using the confirmed format ---
  const featureGidByHandle = { [firstSpec.featureHandle]: richTextAttempt.metaobjectUpsert.metaobject?.id };
  for (const { spec } of products.slice(1)) {
    const value = descriptionFormat === 'rich_text_field' ? toRichTextParagraphs(spec.featureBullets) : spec.featureBullets.join('\n\n');
    const result = await client.request(require('./lib/queries').METAOBJECT_UPSERT, {
      handle: { type: 'montibello_feature', handle: spec.featureHandle },
      metaobject: { fields: [{ key: 'title', value: spec.featureTitle }, { key: 'description', value }] },
    });
    assertNoUserErrors('metaobjectUpsert (feature)', result.metaobjectUpsert);
    featureGidByHandle[spec.featureHandle] = result.metaobjectUpsert.metaobject.id;
    console.log(`Created ${spec.featureHandle} -> ${result.metaobjectUpsert.metaobject.id}`);
  }

  // --- Create LifeAlgae ingredient metaobject ------------------------------
  const lifealgaeResult = await client.request(require('./lib/queries').METAOBJECT_UPSERT, {
    handle: { type: 'montibello_ingredient', handle: LIFEALGAE_INGREDIENT.handle },
    metaobject: { fields: [{ key: 'title', value: LIFEALGAE_INGREDIENT.title }, { key: 'description', value: toRichTextValue(LIFEALGAE_INGREDIENT.description) }] },
  });
  assertNoUserErrors('metaobjectUpsert (lifealgae ingredient)', lifealgaeResult.metaobjectUpsert);
  const lifealgaeGid = lifealgaeResult.metaobjectUpsert.metaobject.id;
  console.log(`Created ${LIFEALGAE_INGREDIENT.handle} -> ${lifealgaeGid}`);

  // --- Read back all 6+... 11 metaobjects for verification -----------------
  for (const { spec } of products) {
    const check = await client.request(METAOBJECT_BY_HANDLE, { handle: { type: 'montibello_feature', handle: spec.featureHandle } });
    if (!check.metaobjectByHandle) throw new Error(`Read-back failed for ${spec.featureHandle}`);
  }
  const lifealgaeCheck = await client.request(METAOBJECT_BY_HANDLE, { handle: { type: 'montibello_ingredient', handle: LIFEALGAE_INGREDIENT.handle } });
  if (!lifealgaeCheck.metaobjectByHandle) throw new Error('Read-back failed for lifealgae ingredient');

  // --- Write product-level metafields (features, key_ingredients, how_to_use, interest_data) ---
  const metafieldEntries = [];
  for (const { spec, product } of products) {
    metafieldEntries.push({
      ownerId: product.id,
      namespace: NAMESPACE,
      key: 'features',
      type: 'list.metaobject_reference',
      value: JSON.stringify([featureGidByHandle[spec.featureHandle]]),
    });
    metafieldEntries.push({
      ownerId: product.id,
      namespace: NAMESPACE,
      key: 'key_ingredients',
      type: 'list.metaobject_reference',
      value: JSON.stringify([EXISTING_INGREDIENT_GIDS[spec.existingIngredientHandle], lifealgaeGid]),
    });
    metafieldEntries.push({
      ownerId: product.id,
      namespace: NAMESPACE,
      key: 'interest_data',
      type: 'rich_text_field',
      value: toRichTextValue(spec.interestData),
    });
    if (spec.comoUsar !== null) {
      metafieldEntries.push({
        ownerId: product.id,
        namespace: NAMESPACE,
        key: 'how_to_use',
        type: 'rich_text_field',
        value: toRichTextValue(spec.comoUsar),
      });
    }
  }

  console.log(`\nWriting ${metafieldEntries.length} product metafields in chunks of 25...`);
  for (let i = 0; i < metafieldEntries.length; i += 25) {
    const chunk = metafieldEntries.slice(i, i + 25);
    const result = await client.request(METAFIELDS_SET, { metafields: chunk });
    assertNoUserErrors('metafieldsSet', result.metafieldsSet);
    console.log(`  chunk ${Math.floor(i / 25) + 1}: ${result.metafieldsSet.metafields.length} metafields written`);
  }

  // --- Live read-back on all 10 products -----------------------------------
  console.log('\n=== LIVE READ-BACK ===');
  let featureRefsCorrect = 0;
  let ingredientRefsCorrect = 0;
  let howToUseCorrect = 0;
  let interestDataCorrect = 0;
  for (const { spec, product: before } of products) {
    const data = await client.request(PRODUCT_LOOKUP, { handle: spec.handle });
    const after = data.productByHandle;
    if (after.status !== before.status) throw new Error(`STATUS CHANGED for ${spec.handle}: ${before.status} -> ${after.status}`);
    if (after.variants.nodes.length !== before.variants.nodes.length) throw new Error(`VARIANT COUNT CHANGED for ${spec.handle}`);
    if (after.media.nodes.length !== before.media.nodes.length) throw new Error(`MEDIA COUNT CHANGED for ${spec.handle}`);

    const featuresVal = JSON.parse(after.metafields.nodes.find((m) => m.key === 'features')?.value || '[]');
    const ingredientsVal = JSON.parse(after.metafields.nodes.find((m) => m.key === 'key_ingredients')?.value || '[]');
    const howToUseVal = after.metafields.nodes.find((m) => m.key === 'how_to_use')?.value || '';
    const interestDataVal = after.metafields.nodes.find((m) => m.key === 'interest_data')?.value || '';

    if (featuresVal.length === 1 && featuresVal[0] === featureGidByHandle[spec.featureHandle]) featureRefsCorrect += 1;
    if (
      ingredientsVal.length === 2 &&
      ingredientsVal.includes(EXISTING_INGREDIENT_GIDS[spec.existingIngredientHandle]) &&
      ingredientsVal.includes(lifealgaeGid)
    ) {
      ingredientRefsCorrect += 1;
    }
    if (interestDataVal.includes(spec.interestData.slice(0, 40))) interestDataCorrect += 1;
    if (spec.comoUsar === null || howToUseVal.includes(spec.comoUsar.slice(0, 30))) howToUseCorrect += 1;

    console.log(`  ${spec.handle}: status=${after.status} variants=${after.variants.nodes.length} media=${after.media.nodes.length} features_ok=${featuresVal.length === 1} ingredients_ok=${ingredientsVal.length === 2}`);
  }

  console.log('\n=== FINAL REPORT (data) ===');
  console.log(JSON.stringify({
    featureMetaobjectsCreated: products.length,
    lifealgaeMetaobjectCreated: 1,
    productsWithProductSpecificFeatures: featureRefsCorrect,
    productsWith2KeyIngredients: ingredientRefsCorrect,
    howToUseFilled: howToUseWriteCount,
    howToUsePreserved: howToUsePreservedCount,
    howToUseVerified: howToUseCorrect,
    interestDataCorrected: interestDataCorrect,
    descriptionFieldFormatUsed: descriptionFormat,
  }, null, 2));
}

main().catch((e) => {
  console.error('\nABORT:', e.message);
  process.exit(1);
});
