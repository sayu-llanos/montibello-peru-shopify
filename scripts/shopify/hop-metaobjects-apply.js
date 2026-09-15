#!/usr/bin/env node
// Montibello HOP feature + ingredient metaobject APPLY (Phase 4D).
//
// Usage: node scripts/shopify/hop-metaobjects-apply.js --apply
//        node scripts/shopify/hop-metaobjects-apply.js            (plan only)
//
// Creates exactly 3 montibello_ingredient + 3 montibello_feature metaobjects
// (content fixed by the Phase 4C-approved plan, hardcoded below — not
// re-derived from the audit file, since this round's exact wording was a
// specific human decision, including "feature description stays BLANK")
// and references them from the 10 confirmed non-Keratin HOP products'
// montibello.features / montibello.key_ingredients metafields.
//
// Never touches: routine, shades, LUXLIGHT, HOP Keratin, allied_store_offers,
// product status, variants, SKUs, media, any other metafield. Never uses
// productSet. Uses metaobjectUpsert (idempotent by type+handle — see
// lib/queries.js) and metafieldsSet only.

const path = require('node:path');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken, missingScopes, REQUIRED_SCOPES } = require('./lib/oauth');
const { AdminClient, ShopifyAdminError, assertNoUserErrors } = require('./lib/admin-client');
const { STORE_AND_SCOPES_VERIFY, PRODUCT_LOOKUP, METAOBJECT_BY_HANDLE, METAFIELDS_SET } = require('./lib/queries');
const ops = require('./lib/operations');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const NAMESPACE = 'montibello';

function toRichTextValue(plainText) {
  return JSON.stringify({
    type: 'root',
    children: [{ type: 'paragraph', children: [{ type: 'text', value: plainText }] }],
  });
}

// --- Fixed, human-approved content (Phase 4C decision) -------------------
const INGREDIENTS = [
  {
    handle: 'ingredient-colageno-vegano',
    title: 'Colágeno Vegano',
    description:
      'Enriquecido con Colágeno Vegano, un complejo de proteínas de origen vegetal que rellena, fortalece y restaura la fibra capilar a la vez que proporciona brillo, elasticidad y suavidad.',
  },
  {
    handle: 'ingredient-acido-ferulico',
    title: 'Ácido Ferúlico',
    description:
      'Enriquecido con Ácido Ferúlico, un potente antioxidante de origen vegetal con un alto poder hidratante que protege y prolonga el color y el brillo, y con una capacidad protectora que neutraliza los daños procedentes de la radiación solar.',
  },
  {
    handle: 'ingredient-acido-hialuronico',
    title: 'Ácido Hialurónico',
    description:
      'Enriquecido con Ácido Hialurónico, un activo altamente hidratante que repara la función barrera del cabello para mejorar la elasticidad, controlar el frizz y devolver el brillo, la suavidad y la manejabilidad.',
  },
];

const FEATURES = [
  { handle: 'feature-reparacion-antirrotura', title: 'Reparación y protección antirrotura' },
  { handle: 'feature-accion-antioxidante-proteccion-uv', title: 'Acción antioxidante y protección UV' },
  { handle: 'feature-hidratacion-control-frizz', title: 'Hidratación y control del frizz' },
];

const REFERENCE_MAP = [
  {
    subfamily: 'Ultra Repair',
    handles: ['hop-ultra-repair-shampoo', 'hop-ultra-repair-rinse', 'hop-ultra-repair-mask', 'hop-ultra-repair-sealed-ends'],
    ingredientHandle: 'ingredient-colageno-vegano',
    featureHandle: 'feature-reparacion-antirrotura',
  },
  {
    subfamily: 'Colour Last',
    handles: ['hop-colour-last-shampoo', 'hop-colour-last-rinse', 'hop-colour-last-mask'],
    ingredientHandle: 'ingredient-acido-ferulico',
    featureHandle: 'feature-accion-antioxidante-proteccion-uv',
  },
  {
    subfamily: 'Smooth Hydration',
    handles: ['hop-smooth-hydration-shampoo', 'hop-smooth-hydration-rinse', 'hop-smooth-hydration-mask'],
    ingredientHandle: 'ingredient-acido-hialuronico',
    featureHandle: 'feature-hidratacion-control-frizz',
  },
];

const ALL_TARGET_HANDLES = REFERENCE_MAP.flatMap((r) => r.handles);

async function main() {
  const apply = process.argv.slice(2).includes('--apply');
  console.log(`\n=== Montibello HOP feature+ingredient metaobject APPLY (Phase 4D) — ${apply ? 'APPLY' : 'PLAN ONLY'} ===\n`);

  const envResult = loadShopifyEnv(REPO_ROOT);
  if (!envResult.ok) {
    console.log(`STORE VERIFIED: NO — ${envResult.reason}`);
    console.log('\nMUTATIONS EXECUTED: 0');
    process.exitCode = 1;
    return;
  }
  let client;
  try {
    const { accessToken } = await fetchAccessToken({
      shop: envResult.env.shop,
      clientId: envResult.env.clientId,
      clientSecret: envResult.env.clientSecret,
    });
    client = new AdminClient({
      storeDomain: envResult.env.storeDomain,
      accessToken,
      apiVersion: envResult.env.apiVersion,
      requiredStoreDomain: REQUIRED_STORE_DOMAIN,
    });
    const verifyData = await client.request(STORE_AND_SCOPES_VERIFY);
    if (verifyData.shop.myshopifyDomain !== REQUIRED_STORE_DOMAIN) {
      console.log(`STORE VERIFIED: NO — token belongs to "${verifyData.shop.myshopifyDomain}".`);
      console.log('\nMUTATIONS EXECUTED: 0');
      process.exitCode = 1;
      return;
    }
    const grantedScopes = verifyData.currentAppInstallation.accessScopes.map((s) => s.handle);
    const missing = missingScopes(grantedScopes);
    if (missing.length > 0) {
      console.log(`SCOPES VERIFIED: NO — missing ${missing.join(', ')}`);
      console.log('\nMUTATIONS EXECUTED: 0');
      process.exitCode = 1;
      return;
    }
    console.log(`STORE VERIFIED: YES (${verifyData.shop.myshopifyDomain}, API ${envResult.env.apiVersion})`);
    console.log(`SCOPES VERIFIED: YES (${grantedScopes.join(', ')})`);
  } catch (err) {
    console.log(`STORE VERIFIED: NO — ${err.message}`);
    console.log('\nMUTATIONS EXECUTED: 0');
    process.exitCode = 1;
    return;
  }

  // --- Step 1: query existing metaobjects first ---------------------------
  console.log('\n--- Pre-flight: checking for existing metaobjects ---');
  const existing = {};
  for (const ing of INGREDIENTS) {
    const data = await client.request(METAOBJECT_BY_HANDLE, { handle: { type: 'montibello_ingredient', handle: ing.handle } });
    existing[`ingredient:${ing.handle}`] = data.metaobjectByHandle;
    console.log(`  montibello_ingredient/${ing.handle}: ${data.metaobjectByHandle ? 'EXISTS' : 'not found'}`);
  }
  for (const feat of FEATURES) {
    const data = await client.request(METAOBJECT_BY_HANDLE, { handle: { type: 'montibello_feature', handle: feat.handle } });
    existing[`feature:${feat.handle}`] = data.metaobjectByHandle;
    console.log(`  montibello_feature/${feat.handle}: ${data.metaobjectByHandle ? 'EXISTS' : 'not found'}`);
  }
  console.log(
    '  NOTE: metaobjectByHandle cannot distinguish "type does not exist" from "handle not found" — the type strings (montibello_feature / montibello_ingredient) are only conclusively verified by the first metaobjectUpsert call below succeeding without a userError.'
  );

  // Conflict check: if an entry exists, its current fields must match what
  // we intend to write, or we STOP per instruction.
  let conflict = false;
  for (const ing of INGREDIENTS) {
    const found = existing[`ingredient:${ing.handle}`];
    if (found) {
      const titleField = found.fields.find((f) => f.key === 'title');
      const descField = found.fields.find((f) => f.key === 'description');
      const expectedDesc = toRichTextValue(ing.description);
      if ((titleField && titleField.value !== ing.title) || (descField && descField.value !== expectedDesc)) {
        console.log(`  CONFLICT: ${ing.handle} exists with different content than proposed.`);
        conflict = true;
      }
    }
  }
  for (const feat of FEATURES) {
    const found = existing[`feature:${feat.handle}`];
    if (found) {
      const titleField = found.fields.find((f) => f.key === 'title');
      if (titleField && titleField.value !== feat.title) {
        console.log(`  CONFLICT: ${feat.handle} exists with a different title than proposed.`);
        conflict = true;
      }
    }
  }
  if (conflict) {
    console.log('\nSTOP: one or more target metaobjects already exist with different content. Not proceeding.');
    console.log('\nMUTATIONS EXECUTED: 0');
    process.exitCode = 1;
    return;
  }
  console.log('  No conflicts found.');

  // --- Step 2: query the 10 target products first, check for pre-existing values ---
  console.log('\n--- Pre-flight: checking the 10 target products for pre-existing features/key_ingredients ---');
  const liveByHandle = {};
  let productConflict = false;
  for (const handle of ALL_TARGET_HANDLES) {
    const data = await client.request(PRODUCT_LOOKUP, { handle });
    const product = data.productByHandle;
    if (!product) {
      console.log(`  ${handle}: NOT FOUND — aborting.`);
      productConflict = true;
      continue;
    }
    liveByHandle[handle] = product;
    const mf = Object.fromEntries(product.metafields.nodes.map((m) => [m.key, m.value]));
    if (mf.features || mf.key_ingredients) {
      console.log(`  ${handle}: CONFLICT — already has features=${mf.features ? 'set' : 'unset'}, key_ingredients=${mf.key_ingredients ? 'set' : 'unset'}.`);
      productConflict = true;
    } else {
      console.log(`  ${handle}: OK (features/key_ingredients both blank)`);
    }
  }
  if (productConflict) {
    console.log('\nSTOP: at least one target product is missing or already has features/key_ingredients set. Not proceeding.');
    console.log('\nMUTATIONS EXECUTED: 0');
    process.exitCode = 1;
    return;
  }

  console.log('\n=== PLAN ===');
  console.log('Ingredients to upsert: ' + INGREDIENTS.map((i) => i.handle).join(', '));
  console.log('Features to upsert (title only, description left blank): ' + FEATURES.map((f) => f.handle).join(', '));
  for (const r of REFERENCE_MAP) {
    console.log(`${r.subfamily}: ${r.handles.join(', ')} -> features=[${r.featureHandle}], key_ingredients=[${r.ingredientHandle}]`);
  }

  if (!apply) {
    console.log('\n(Plan-only mode — pass --apply to execute.)');
    console.log('\nMUTATIONS EXECUTED: 0');
    return;
  }

  // --- Step 3: create/upsert the 6 metaobjects, abort on first userError ---
  console.log('\n--- Creating metaobjects ---');
  let mutationsExecuted = 0;
  const gidByHandle = {};
  try {
    for (const ing of INGREDIENTS) {
      const metaobject = await ops.applyMetaobjectUpsert(client, {
        type: 'montibello_ingredient',
        handle: ing.handle,
        fields: { title: ing.title, description: toRichTextValue(ing.description) },
      });
      mutationsExecuted += 1;
      gidByHandle[ing.handle] = metaobject.id;
      console.log(`  CREATED montibello_ingredient/${ing.handle} -> ${metaobject.id}`);
    }
    for (const feat of FEATURES) {
      const metaobject = await ops.applyMetaobjectUpsert(client, {
        type: 'montibello_feature',
        handle: feat.handle,
        fields: { title: feat.title }, // description intentionally omitted — stays blank per instruction
      });
      mutationsExecuted += 1;
      gidByHandle[feat.handle] = metaobject.id;
      console.log(`  CREATED montibello_feature/${feat.handle} -> ${metaobject.id}`);
    }
  } catch (err) {
    console.log(`\nERROR creating metaobjects: ${err.message}`);
    console.log('ABORTED — no product metafields written.');
    console.log(`\nMUTATIONS EXECUTED: ${mutationsExecuted}`);
    process.exitCode = 1;
    return;
  }

  // --- Step 3b: read back each metaobject to confirm exact content --------
  console.log('\n--- Verifying metaobjects by read-back ---');
  let metaobjectVerifyFailed = false;
  for (const ing of INGREDIENTS) {
    const data = await client.request(METAOBJECT_BY_HANDLE, { handle: { type: 'montibello_ingredient', handle: ing.handle } });
    const mf = Object.fromEntries((data.metaobjectByHandle?.fields || []).map((f) => [f.key, f.value]));
    const ok = mf.title === ing.title && mf.description === toRichTextValue(ing.description);
    console.log(`  ${ok ? 'VERIFY OK' : 'VERIFY FAILED'}: ${ing.handle}`);
    if (!ok) metaobjectVerifyFailed = true;
  }
  for (const feat of FEATURES) {
    const data = await client.request(METAOBJECT_BY_HANDLE, { handle: { type: 'montibello_feature', handle: feat.handle } });
    const mf = Object.fromEntries((data.metaobjectByHandle?.fields || []).map((f) => [f.key, f.value]));
    const ok = mf.title === feat.title && !mf.description;
    console.log(`  ${ok ? 'VERIFY OK' : 'VERIFY FAILED'}: ${feat.handle} (description blank: ${!mf.description})`);
    if (!ok) metaobjectVerifyFailed = true;
  }
  if (metaobjectVerifyFailed) {
    console.log('\nABORTED: metaobject read-back verification failed. No product metafields written.');
    console.log(`\nMUTATIONS EXECUTED: ${mutationsExecuted}`);
    process.exitCode = 1;
    return;
  }

  // --- Step 4: write montibello.features / montibello.key_ingredients on the 10 products ---
  console.log('\n--- Writing product references ---');
  const metafieldsInput = [];
  for (const r of REFERENCE_MAP) {
    for (const handle of r.handles) {
      const productId = liveByHandle[handle].id;
      metafieldsInput.push({
        ownerId: productId,
        namespace: NAMESPACE,
        key: 'features',
        type: 'list.metaobject_reference',
        value: JSON.stringify([gidByHandle[r.featureHandle]]),
      });
      metafieldsInput.push({
        ownerId: productId,
        namespace: NAMESPACE,
        key: 'key_ingredients',
        type: 'list.metaobject_reference',
        value: JSON.stringify([gidByHandle[r.ingredientHandle]]),
      });
    }
  }

  let productWriteFailed = false;
  try {
    const data = await client.request(METAFIELDS_SET, { metafields: metafieldsInput });
    assertNoUserErrors('metafieldsSet', data.metafieldsSet);
    mutationsExecuted += 1;
    for (const m of data.metafieldsSet.metafields) console.log(`  WROTE: montibello.${m.key} on ${m.id}`);
  } catch (err) {
    console.log(`  ERROR: ${err.message}`);
    productWriteFailed = true;
  }

  if (productWriteFailed) {
    console.log('\nABORTED during product metafield writes.');
    console.log(`\nMUTATIONS EXECUTED: ${mutationsExecuted}`);
    process.exitCode = 1;
    return;
  }

  // --- Step 5: live read-back of all 10 products ---------------------------
  console.log('\n--- Read-back verification of all 10 products ---');
  let ingredientRefsVerified = 0;
  let featureRefsVerified = 0;
  let statusChanged = 0;
  let variantsChanged = 0;
  let imagesChanged = 0;
  let otherMetafieldsChanged = 0;

  for (const r of REFERENCE_MAP) {
    for (const handle of r.handles) {
      const before = liveByHandle[handle];
      const data = await client.request(PRODUCT_LOOKUP, { handle });
      const after = data.productByHandle;

      if (after.status !== before.status) statusChanged += 1;
      if (
        after.variants.nodes.length !== before.variants.nodes.length ||
        after.variants.nodes.some((v) => {
          const b = before.variants.nodes.find((bv) => bv.id === v.id);
          return !b || b.sku !== v.sku;
        })
      ) {
        variantsChanged += 1;
      }
      if (after.media.nodes.length !== before.media.nodes.length) imagesChanged += 1;

      const beforeMf = Object.fromEntries(before.metafields.nodes.map((m) => [m.key, m.value]));
      const afterMf = Object.fromEntries(after.metafields.nodes.map((m) => [m.key, m.value]));
      for (const key of Object.keys(afterMf)) {
        if (key === 'features' || key === 'key_ingredients') continue;
        if (beforeMf[key] !== afterMf[key]) otherMetafieldsChanged += 1;
      }

      const expectedFeatureValue = JSON.stringify([gidByHandle[r.featureHandle]]);
      const expectedIngredientValue = JSON.stringify([gidByHandle[r.ingredientHandle]]);
      const featureOk = afterMf.features === expectedFeatureValue;
      const ingredientOk = afterMf.key_ingredients === expectedIngredientValue;
      if (featureOk) featureRefsVerified += 1;
      if (ingredientOk) ingredientRefsVerified += 1;

      console.log(
        `  ${handle}: status=${after.status}, variants=${after.variants.nodes.length}, media=${after.media.nodes.length}, features=${featureOk ? 'OK' : 'MISMATCH'}, key_ingredients=${ingredientOk ? 'OK' : 'MISMATCH'}`
      );
    }
  }

  console.log('\n=== FINAL REPORT ===');
  console.log(`INGREDIENT METAOBJECTS CREATED: ${INGREDIENTS.length}`);
  console.log(`FEATURE METAOBJECTS CREATED: ${FEATURES.length}`);
  console.log(`PRODUCTS UPDATED: ${ALL_TARGET_HANDLES.length}`);
  console.log(`INGREDIENT REFERENCES VERIFIED: ${ingredientRefsVerified}/${ALL_TARGET_HANDLES.length}`);
  console.log(`FEATURE REFERENCES VERIFIED: ${featureRefsVerified}/${ALL_TARGET_HANDLES.length}`);
  console.log(`VARIANTS CHANGED: ${variantsChanged}`);
  console.log(`IMAGES CHANGED: ${imagesChanged}`);
  console.log(`OTHER METAFIELDS CHANGED: ${otherMetafieldsChanged}`);
  console.log(`PRODUCT STATUS CHANGED: ${statusChanged}`);
  console.log('USER ERRORS: 0');
  console.log(`MUTATIONS EXECUTED: ${mutationsExecuted}`);
  const success = ingredientRefsVerified === ALL_TARGET_HANDLES.length && featureRefsVerified === ALL_TARGET_HANDLES.length && statusChanged === 0 && variantsChanged === 0 && imagesChanged === 0 && otherMetafieldsChanged === 0;
  console.log(`FINAL RESULT: ${success ? 'SUCCESS — all 10 products correctly reference their approved feature and ingredient metaobjects; nothing else changed.' : 'INCOMPLETE — see mismatches above.'}`);
}

main().catch((err) => {
  console.error(`\nFATAL: ${err instanceof ShopifyAdminError ? err.message : err.message}`);
  console.log('\nMUTATIONS EXECUTED: 0');
  process.exitCode = 1;
});
