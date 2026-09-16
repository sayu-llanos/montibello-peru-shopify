#!/usr/bin/env node
// Final Montibello data apply: writes only MISSING_SOURCE_AVAILABLE and
// WRONG_SOURCE_AVAILABLE fields from data/shopify/final-product-content-research.json,
// excluding the 2 explicit REVIEW_REQUIRED exceptions (Clay Lightener 7+ and
// Control Oil System technical_data, where the website and PDF catalogue
// disagree on units/ratio and neither is auto-resolved).
//
// CORRECT / EXPECTED_EMPTY / BLOCKED_BY_SOURCE fields are never touched.
// Scalar/rich-text values are read fresh from the untruncated research-*.json
// files (the final-product-content-research.json/.csv deliverable truncates
// values at 600 chars for readability and must not be used as apply source).
//
// Usage: node scripts/shopify/final-data-apply.js [--apply]
const path = require('node:path');
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken } = require('./lib/oauth');
const { AdminClient, assertNoUserErrors } = require('./lib/admin-client');
const { PRODUCT_LOOKUP, METAFIELDS_SET, METAOBJECT_UPSERT, METAOBJECT_BY_HANDLE } = require('./lib/queries');

const APPLY = process.argv.includes('--apply');
const SP = '/private/tmp/claude-501/-Users-sayurillanos-Projects-montibello-peru-shopify/d00bcbed-c58e-46ac-9733-7f26db33a042/scratchpad';

const hopR = require(`${SP}/research-hop.json`);
const luxR = require(`${SP}/research-luxlight.json`);
const undR = require(`${SP}/research-under.json`);
const kerR = require(`${SP}/research-keratin.json`);

function rt(text) {
  // Wraps plain text into the same rich_text_field JSON shape already used
  // by every existing montibello rich-text metafield/metaobject description
  // in this store (root -> paragraph(s) -> text), splitting on blank lines
  // or leading "-"/"–" bullet markers into separate paragraphs.
  const parts = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const paragraphs = (parts.length ? parts : [text.trim()]).map((p) => ({
    type: 'paragraph',
    children: [{ type: 'text', value: p }],
  }));
  return JSON.stringify({ type: 'root', children: paragraphs });
}

// ---------------------------------------------------------------------
// Scalar/rich-text field plan: { handle: { field: { type, value } } }
// type is one of: text (single_line_text_field), richtext (rich_text_field),
// multiline (multi_line_text_field), boolean.
// ---------------------------------------------------------------------
const FIELD_PLAN = {};
function setField(handle, field, type, value) {
  FIELD_PLAN[handle] = FIELD_PLAN[handle] || {};
  FIELD_PLAN[handle][field] = { type, value };
}

// ---- HOP (10): description only ----
const HOP_DESC = {
  'hop-ultra-repair-shampoo': hopR['hop-ultra-repair-shampoo'].hero.description,
  'hop-ultra-repair-rinse': hopR['hop-ultra-repair-rinse'].hero.description,
  'hop-ultra-repair-mask': hopR['hop-ultra-repair-mask'].hero.description,
  'hop-ultra-repair-sealed-ends': hopR['hop-ultra-repair-sealed-ends'].hero.description,
  'hop-colour-last-shampoo': hopR['hop-colour-last-shampoo'].hero.description,
  'hop-colour-last-rinse': hopR['hop-colour-last-rinse'].hero.description,
  'hop-colour-last-mask': hopR['hop-colour-last-mask'].hero.description,
  'hop-smooth-hydration-shampoo': hopR['hop-smooth-hydration-shampoo'].hero.description,
  'hop-smooth-hydration-rinse': hopR['hop-smooth-hydration-rinse'].hero.description,
  'hop-smooth-hydration-mask': hopR['hop-smooth-hydration-mask'].hero.description,
};
for (const [h, desc] of Object.entries(HOP_DESC)) setField(h, 'description', 'text', desc);

// ---- HOP Keratin (2) ----
setField('hop-keratin-shampoo', 'description', 'text', kerR['hop-keratin-shampoo'].hero.description_es_verbatim);
setField('hop-keratin-shampoo', 'hair_type', 'text', 'Para todo tipo de cabellos.');
setField('hop-keratin-shampoo', 'professional_only', 'boolean', 'true');
setField('hop-keratin-shampoo', 'how_to_use', 'richtext', rt(kerR['hop-keratin-shampoo'].usage.text_verbatim));
setField('hop-keratin-shampoo', 'full_ingredients', 'multiline', kerR['hop-keratin-shampoo'].ingredients.full_inci_verbatim);
setField('hop-keratin-shampoo', 'interest_data', 'richtext', rt(kerR['hop-keratin-shampoo'].interest_data.text_verbatim));
setField('hop-keratin-shampoo', 'technology_description', 'richtext', rt(kerR['hop-keratin-shampoo'].technology.ph_note_verbatim));

setField('hop-keratin-lotion', 'description', 'text', kerR['hop-keratin-lotion'].hero.description_es_verbatim);
setField('hop-keratin-lotion', 'hair_type', 'text', 'Para todo tipo de cabellos. En el caso de cabellos sensibilizados, realizar mecha test.');
setField('hop-keratin-lotion', 'professional_only', 'boolean', 'true');
setField('hop-keratin-lotion', 'how_to_use', 'richtext', rt(kerR['hop-keratin-lotion'].usage.full_text_from_pdf_ficha_verbatim));
setField('hop-keratin-lotion', 'full_ingredients', 'multiline', kerR['hop-keratin-lotion'].ingredients.full_inci_verbatim);
setField('hop-keratin-lotion', 'interest_data', 'richtext', rt(kerR['hop-keratin-lotion'].interest_data.text_verbatim));
setField('hop-keratin-lotion', 'technology_description', 'richtext', rt(kerR['hop-keratin-lotion'].technical_data_extra.how_it_works_verbatim));

// ---- UNDER Permanent Colour ----
{
  const r = undR['under-permanent-colour'];
  setField('under-permanent-colour', 'description', 'text', r.hero.description.split(/(?=INNOVADORA|DOBLE PODER|COL[AÁ]GENO)/)[0].trim());
  const htMatch = r.hero.hair_type_target.match(/"([^"]+)"/);
  setField('under-permanent-colour', 'hair_type', 'text', htMatch ? htMatch[1] : r.hero.hair_type_target);
  setField('under-permanent-colour', 'professional_only', 'boolean', 'true');
  setField('under-permanent-colour', 'how_to_use', 'richtext', rt(r.usage));
  setField('under-permanent-colour', 'full_ingredients', 'multiline', r.ingredients.inci_full);
  setField('under-permanent-colour', 'interest_data', 'richtext', rt(r.interest_data));
  const tech = r.technology;
  const techText = `Ratio de mezcla: ${tech.mixing_ratio}. Tiempo de exposición: ${tech.development_time}. Formato: ${tech.format}. ${tech.technical_warnings}`;
  setField('under-permanent-colour', 'technical_data', 'richtext', rt(techText));
}

// ---- UNDER Activators (3) ----
for (const h of ['under-activator-15vol', 'under-activator-25vol', 'under-activator-35vol']) {
  const r = undR[h];
  setField(h, 'description', 'text', r.hero.description);
  const htMatch = r.hero.hair_type_target.match(/"([^"]+)"/);
  setField(h, 'hair_type', 'text', htMatch ? htMatch[1] : r.hero.hair_type_target);
  setField(h, 'professional_only', 'boolean', 'true');
  setField(h, 'how_to_use', 'richtext', rt(r.usage));
  setField(h, 'interest_data', 'richtext', rt(r.interest_data));
  const tech = r.technology;
  const techText = `Ratio de mezcla: ${tech.mixing_ratio}. Tiempo de exposición: ${tech.development_time}. Formato: ${tech.format}. ${tech.technical_warnings}`;
  setField(h, 'technical_data', 'richtext', rt(techText));
}

// ---- LUXLIGHT (8) ----
const LUX_DESC_TRIMMED = {
  'luxlight-supreme-lightener-9plus': 'Polvo decolorante no volátil que aclara hasta 9 tonos. Adecuado para todas las técnicas y seguro para aplicaciones en cuero cabelludo.',
  'luxlight-supreme-clay-lightener-7plus': 'Arcila aclarante no volátil que aclara hasta 7 tonos. Diseñada específicamente para técnicas a mano alzada. Textura transformadora de cremosa a sólida.',
  'luxlight-supreme-control-oil-lightening-system': 'Sistema de aclaración controlada en dos pasos que aclara de forma homogénea, precisa y segura. Adecuado para todas las técnicas y seguro para aplicaciones en cuero cabelludo. Textura transformadora de gel a crema.',
  'luxlight-supreme-oil-developer-10vol': 'Crema activadora para procesos de aclaración con luxlight. Fórmula intensiva a base de aceites nutritivos para aportar el máximo de protección y cuidado al cuero cabelludo y cabello.',
  'luxlight-supreme-oil-developer-20vol': 'Crema activadora para procesos de aclaración con luxlight. Fórmula intensiva a base de aceites nutritivos para aportar el máximo de protección y cuidado al cuero cabelludo y cabello.',
  'luxlight-supreme-oil-developer-30vol': 'Crema activadora para procesos de aclaración con luxlight. Fórmula intensiva a base de aceites nutritivos para aportar el máximo de protección y cuidado al cuero cabelludo y cabello.',
  'luxlight-supreme-ph-protective-shampoo': 'Champú reestructurante con pH optimizado que repara y protege. Fórmula concentrada sin sulfatos que crea una espuma abundante y cremosa.',
  'luxlight-supreme-acidic-ph-treatment': 'Tratamiento reestructurante con pH ácido que recupera, fortalece y nutre el cabello. Fórmula concentrada de pH ácido y textura cremosa.',
};
for (const [h, desc] of Object.entries(LUX_DESC_TRIMMED)) {
  const r = luxR[h];
  setField(h, 'description', 'text', desc);
  setField(h, 'hair_type', 'text', r.hero.hair_type_target);
  setField(h, 'how_to_use', 'richtext', rt(r.usage));
}
setField('luxlight-supreme-lightener-9plus', 'interest_data', 'richtext', rt(luxR['luxlight-supreme-lightener-9plus'].interest_data));
setField('luxlight-supreme-oil-developer-10vol', 'functional_subtitle', 'text', 'Crema activadora');
setField('luxlight-supreme-oil-developer-20vol', 'functional_subtitle', 'text', 'Crema activadora');
setField('luxlight-supreme-oil-developer-30vol', 'functional_subtitle', 'text', 'Crema activadora');
setField('luxlight-supreme-oil-developer-10vol', 'interest_data', 'richtext', rt(luxR['luxlight-supreme-oil-developer-10vol'].interest_data));
setField('luxlight-supreme-oil-developer-20vol', 'interest_data', 'richtext', rt(luxR['luxlight-supreme-oil-developer-20vol'].interest_data));
setField('luxlight-supreme-oil-developer-30vol', 'interest_data', 'richtext', rt(luxR['luxlight-supreme-oil-developer-30vol'].interest_data));
{
  const r = luxR['luxlight-supreme-control-oil-lightening-system'];
  const combinedInci = `OIL LIGHTENER\n${r.ingredients.oil_lightener.full_inci}\n\nOIL ACTIVATOR\n${r.ingredients.oil_activator.full_inci}`;
  setField('luxlight-supreme-control-oil-lightening-system', 'full_ingredients', 'multiline', combinedInci);
}

// ---------------------------------------------------------------------
// Metaobject plan: features (montibello_feature) and key_ingredients
// (montibello_ingredient), with dedup by handle.
// ---------------------------------------------------------------------
const FEATURE_PLAN = [
  { handle: 'feature-hop-keratin-shampoo-benefits', title: kerR['hop-keratin-shampoo'].benefits.heading, description: kerR['hop-keratin-shampoo'].benefits.bullets.join('\n'), appliesTo: ['hop-keratin-shampoo'] },
  { handle: 'feature-hop-keratin-lotion-benefits', title: kerR['hop-keratin-lotion'].benefits.heading, description: kerR['hop-keratin-lotion'].benefits.bullets_sku_specific.join('\n'), appliesTo: ['hop-keratin-lotion'] },
  { handle: 'feature-under-permanent-colour-benefits', title: 'Beneficios', description: undR['under-permanent-colour'].benefits.bullets.join('\n'), appliesTo: ['under-permanent-colour'] },
  { handle: 'feature-under-activator-benefits', title: 'Beneficios', description: undR['under-activator-15vol'].benefits.bullets.join('\n'), appliesTo: ['under-activator-15vol', 'under-activator-25vol', 'under-activator-35vol'] },
  { handle: 'feature-luxlight-supreme-lightener-9plus-benefits', title: luxR['luxlight-supreme-lightener-9plus'].benefits.heading, description: luxR['luxlight-supreme-lightener-9plus'].benefits.bullets.join('\n'), appliesTo: ['luxlight-supreme-lightener-9plus'] },
  { handle: 'feature-luxlight-supreme-clay-lightener-7plus-benefits', title: luxR['luxlight-supreme-clay-lightener-7plus'].benefits.heading, description: luxR['luxlight-supreme-clay-lightener-7plus'].benefits.bullets.join('\n'), appliesTo: ['luxlight-supreme-clay-lightener-7plus'] },
  { handle: 'feature-luxlight-supreme-control-oil-lightening-system-benefits', title: luxR['luxlight-supreme-control-oil-lightening-system'].benefits.heading, description: luxR['luxlight-supreme-control-oil-lightening-system'].benefits.bullets.join('\n'), appliesTo: ['luxlight-supreme-control-oil-lightening-system'] },
  { handle: 'feature-luxlight-supreme-ph-protective-shampoo-benefits', title: luxR['luxlight-supreme-ph-protective-shampoo'].benefits.heading, description: luxR['luxlight-supreme-ph-protective-shampoo'].benefits.bullets.join('\n'), appliesTo: ['luxlight-supreme-ph-protective-shampoo'] },
  { handle: 'feature-luxlight-supreme-acidic-ph-treatment-benefits', title: luxR['luxlight-supreme-acidic-ph-treatment'].benefits.heading, description: luxR['luxlight-supreme-acidic-ph-treatment'].benefits.bullets.join('\n'), appliesTo: ['luxlight-supreme-acidic-ph-treatment'] },
];

const underPermKi = undR['under-permanent-colour'].ingredients.key_ingredients;
const INGREDIENT_PLAN = [
  { handle: 'ingredient-dimethylglucamine-dmg', title: underPermKi[0].name, description: underPermKi[0].description, appliesTo: ['under-permanent-colour'] },
  { handle: 'ingredient-vegan-collagen-complex-under', title: underPermKi[1].name, description: underPermKi[1].description, appliesTo: ['under-permanent-colour'] },
  { handle: 'ingredient-hydrogen-peroxide-45-15vol', title: undR['under-activator-15vol'].ingredients.key_ingredients[0].name, description: undR['under-activator-15vol'].ingredients.key_ingredients[0].description, appliesTo: ['under-activator-15vol'] },
  { handle: 'ingredient-hydrogen-peroxide-75-25vol', title: undR['under-activator-25vol'].ingredients.key_ingredients[0].name, description: undR['under-activator-25vol'].ingredients.key_ingredients[0].description, appliesTo: ['under-activator-25vol'] },
  { handle: 'ingredient-hydrogen-peroxide-105-35vol', title: undR['under-activator-35vol'].ingredients.key_ingredients[0].name, description: undR['under-activator-35vol'].ingredients.key_ingredients[0].description, appliesTo: ['under-activator-35vol'] },
  { handle: 'ingredient-vegan-collagen-shield-complex', title: undR['under-activator-15vol'].ingredients.key_ingredients[1].name, description: undR['under-activator-15vol'].ingredients.key_ingredients[1].description, appliesTo: ['under-activator-15vol', 'under-activator-25vol', 'under-activator-35vol'] },
];

// HOP Keratin routine: 2-step system, Shampoo (phase 1) -> Lotion (phase 2).
const KERATIN_ROUTINE = [
  { handle: 'routine-step-hop-keratin-1', step_number: '1', label: 'Lava', products: ['hop-keratin-shampoo'] },
  { handle: 'routine-step-hop-keratin-2', step_number: '2', label: 'Trata', products: ['hop-keratin-lotion'] },
];
const KERATIN_ROUTINE_APPLIES_TO = ['hop-keratin-shampoo', 'hop-keratin-lotion'];

module.exports = { FIELD_PLAN, FEATURE_PLAN, INGREDIENT_PLAN, KERATIN_ROUTINE, KERATIN_ROUTINE_APPLIES_TO, rt };

// ---------------------------------------------------------------------
// Execution (only runs when this file is invoked directly)
// ---------------------------------------------------------------------
if (require.main === module) {
  main().catch((e) => { console.error('ABORT:', e.message); process.exit(1); });
}

async function main() {
  const loaded = loadShopifyEnv(REPO_ROOT);
  if (!loaded.ok) throw new Error(loaded.reason);
  const { shop, clientId, clientSecret, apiVersion } = loaded.env;
  const { accessToken } = await fetchAccessToken({ shop, clientId, clientSecret });
  const client = new AdminClient({ storeDomain: `${shop}.myshopify.com`, accessToken, apiVersion, requiredStoreDomain: REQUIRED_STORE_DOMAIN });

  console.log(`\n=== FINAL DATA APPLY (${APPLY ? 'APPLY' : 'PLAN ONLY'}) ===\n`);

  // ---- Pre-flight: fetch live product data for every handle we touch ----
  const allHandles = Array.from(new Set([
    ...Object.keys(FIELD_PLAN),
    ...FEATURE_PLAN.flatMap((f) => f.appliesTo),
    ...INGREDIENT_PLAN.flatMap((i) => i.appliesTo),
    ...KERATIN_ROUTINE_APPLIES_TO,
  ]));
  const products = {};
  for (const h of allHandles) {
    const data = await client.request(PRODUCT_LOOKUP, { handle: h });
    if (!data.productByHandle) throw new Error(`Product not found: ${h}`);
    products[h] = data.productByHandle;
  }
  console.log(`Pre-flight: resolved ${allHandles.length} products.`);

  // ---- Pre-flight: check for existing conflicting metaobjects ----
  const allMetaobjectPlans = [
    ...FEATURE_PLAN.map((f) => ({ ...f, type: 'montibello_feature' })),
    ...INGREDIENT_PLAN.map((i) => ({ ...i, type: 'montibello_ingredient' })),
    ...KERATIN_ROUTINE.map((s) => ({ ...s, type: 'montibello_routine_step' })),
  ];
  const existingMetaobjects = {};
  for (const m of allMetaobjectPlans) {
    const data = await client.request(METAOBJECT_BY_HANDLE, { handle: { type: m.type, handle: m.handle } });
    if (data.metaobjectByHandle) {
      existingMetaobjects[m.handle] = data.metaobjectByHandle;
      console.log(`  NOTE: ${m.handle} already exists (${m.type}) -- will reuse, not recreate.`);
    }
  }

  // ---- Print scalar field plan ----
  console.log('\n--- Scalar/rich-text field plan ---');
  let scalarCount = 0;
  for (const [h, fields] of Object.entries(FIELD_PLAN)) {
    for (const [key, spec] of Object.entries(fields)) {
      scalarCount++;
      console.log(`${h} :: ${key} (${spec.type}) -> ${String(spec.value).slice(0, 80).replace(/\n/g, ' ')}...`);
    }
  }
  console.log(`Total scalar/rich-text writes: ${scalarCount}`);
  console.log(`Total feature metaobjects to ensure: ${FEATURE_PLAN.length}`);
  console.log(`Total ingredient metaobjects to ensure: ${INGREDIENT_PLAN.length}`);
  console.log(`Total routine-step metaobjects to ensure: ${KERATIN_ROUTINE.length} (HOP Keratin)`);

  if (!APPLY) {
    console.log('\nPlan-only run. Re-run with --apply to execute.');
    return;
  }

  // ---- Apply metaobjects first (features, ingredients, routine steps) ----
  console.log('\n=== Creating/reusing metaobjects ===');
  const featureGid = {};
  for (const f of FEATURE_PLAN) {
    if (existingMetaobjects[f.handle]) { featureGid[f.handle] = existingMetaobjects[f.handle].id; continue; }
    const result = await client.request(METAOBJECT_UPSERT, {
      handle: { type: 'montibello_feature', handle: f.handle },
      metaobject: { fields: [
        { key: 'title', value: f.title },
        { key: 'description', value: rt(f.description) },
      ] },
    });
    assertNoUserErrors('metaobjectUpsert (feature)', result.metaobjectUpsert);
    featureGid[f.handle] = result.metaobjectUpsert.metaobject.id;
    console.log(`  created feature ${f.handle}`);
  }

  const ingredientGid = {};
  for (const ing of INGREDIENT_PLAN) {
    if (existingMetaobjects[ing.handle]) { ingredientGid[ing.handle] = existingMetaobjects[ing.handle].id; continue; }
    const result = await client.request(METAOBJECT_UPSERT, {
      handle: { type: 'montibello_ingredient', handle: ing.handle },
      metaobject: { fields: [
        { key: 'title', value: ing.title },
        { key: 'description', value: rt(ing.description) },
      ] },
    });
    assertNoUserErrors('metaobjectUpsert (ingredient)', result.metaobjectUpsert);
    ingredientGid[ing.handle] = result.metaobjectUpsert.metaobject.id;
    console.log(`  created ingredient ${ing.handle}`);
  }

  const routineGid = {};
  for (const step of KERATIN_ROUTINE) {
    if (existingMetaobjects[step.handle]) { routineGid[step.handle] = existingMetaobjects[step.handle].id; continue; }
    const productGids = step.products.map((h) => products[h].id);
    const result = await client.request(METAOBJECT_UPSERT, {
      handle: { type: 'montibello_routine_step', handle: step.handle },
      metaobject: { fields: [
        { key: 'step_number', value: step.step_number },
        { key: 'label', value: step.label },
        { key: 'products', value: JSON.stringify(productGids) },
      ] },
    });
    assertNoUserErrors('metaobjectUpsert (routine_step)', result.metaobjectUpsert);
    routineGid[step.handle] = result.metaobjectUpsert.metaobject.id;
    console.log(`  created routine step ${step.handle}`);
  }

  // ---- Build metafieldsSet payload ----
  console.log('\n=== Writing metafields ===');
  const metafields = [];
  for (const [h, fields] of Object.entries(FIELD_PLAN)) {
    for (const [key, spec] of Object.entries(fields)) {
      const type = spec.type === 'text' ? 'single_line_text_field'
        : spec.type === 'richtext' ? 'rich_text_field'
        : spec.type === 'multiline' ? 'multi_line_text_field'
        : spec.type === 'boolean' ? 'boolean'
        : (() => { throw new Error(`Unknown field type ${spec.type}`); })();
      if (key === 'description') continue; // handled via productUpdate, not metafieldsSet
      metafields.push({ ownerId: products[h].id, namespace: 'montibello', key, type, value: String(spec.value) });
    }
  }
  for (const f of FEATURE_PLAN) {
    for (const h of f.appliesTo) {
      metafields.push({ ownerId: products[h].id, namespace: 'montibello', key: 'features', type: 'list.metaobject_reference', value: JSON.stringify([featureGid[f.handle]]) });
    }
  }
  const ingredientsByProduct = {};
  for (const ing of INGREDIENT_PLAN) {
    for (const h of ing.appliesTo) {
      ingredientsByProduct[h] = ingredientsByProduct[h] || [];
      ingredientsByProduct[h].push(ingredientGid[ing.handle]);
    }
  }
  for (const [h, gids] of Object.entries(ingredientsByProduct)) {
    metafields.push({ ownerId: products[h].id, namespace: 'montibello', key: 'key_ingredients', type: 'list.metaobject_reference', value: JSON.stringify(gids) });
  }
  const routineGidList = KERATIN_ROUTINE.map((s) => routineGid[s.handle]);
  for (const h of KERATIN_ROUTINE_APPLIES_TO) {
    metafields.push({ ownerId: products[h].id, namespace: 'montibello', key: 'routine', type: 'list.metaobject_reference', value: JSON.stringify(routineGidList) });
  }

  for (let i = 0; i < metafields.length; i += 25) {
    const chunk = metafields.slice(i, i + 25);
    const result = await client.request(METAFIELDS_SET, { metafields: chunk });
    assertNoUserErrors('metafieldsSet (final apply)', result.metafieldsSet);
    console.log(`  chunk ${Math.floor(i / 25) + 1}: ${result.metafieldsSet.metafields.length} metafields written`);
  }

  // ---- Apply description via productUpdate (descriptionHtml) ----
  console.log('\n=== Writing product descriptions ===');
  const PRODUCT_UPDATE_DESC = `
    mutation($id: ID!, $descriptionHtml: String!) {
      productUpdate(product: { id: $id, descriptionHtml: $descriptionHtml }) {
        product { id status }
        userErrors { field message }
      }
    }
  `;
  for (const [h, fields] of Object.entries(FIELD_PLAN)) {
    if (!fields.description) continue;
    const before = products[h];
    const result = await client.request(PRODUCT_UPDATE_DESC, { id: before.id, descriptionHtml: `<p>${fields.description.value}</p>` });
    assertNoUserErrors('productUpdate (description)', result.productUpdate);
    if (result.productUpdate.product.status !== before.status) throw new Error(`STATUS CHANGED for ${h}`);
    console.log(`  ${h}: description updated`);
  }

  // ---- Read-back ----
  console.log('\n=== READ-BACK ===');
  for (const h of Object.keys(FIELD_PLAN)) {
    const data = await client.request(PRODUCT_LOOKUP, { handle: h });
    const p = data.productByHandle;
    console.log(`${h}: status=${p.status} variants=${p.variants.nodes.length} media=${p.media.nodes.length}`);
  }
  console.log('\nDone.');
}
