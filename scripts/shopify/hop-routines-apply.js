#!/usr/bin/env node
// Closure sprint Step 5: creates montibello_routine_step metaobjects for
// Ultra Repair (3 steps), Colour Last (2 steps), Smooth Hydration (2 steps),
// sourced from each subfamily's official "Descubre la rutina completa"
// section (live site, raw HTML, fetched and parsed earlier this session).
//
// Ultra Repair's official routine has 4 steps; step 3 ("Trata durante la
// noche" / Overnight Serum) is omitted — Overnight Serum is OUT_OF_PERU_SCOPE
// — and the remaining 3 steps are renumbered 1-2-3 rather than left as a
// 1-2-4 gap. No replacement product is invented for the omitted step.
// Colour Last and Smooth Hydration's official routines have no out-of-Peru
// step and are used as-is (2 steps each).
//
// Writes the same ordered step list to montibello.routine on every product
// in that subfamily (matches the official site: every Ultra Repair PDP
// shows the same "Descubre la rutina completa Ultra Repair" widget).
const path = require('node:path');
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken } = require('./lib/oauth');
const { AdminClient, assertNoUserErrors } = require('./lib/admin-client');
const { PRODUCT_LOOKUP, METAOBJECT_BY_HANDLE, METAOBJECT_UPSERT, METAFIELDS_SET } = require('./lib/queries');

const APPLY = process.argv.includes('--apply');
const TYPE = 'montibello_routine_step';

const ROUTINES = [
  {
    subfamily: 'Ultra Repair',
    productHandles: ['hop-ultra-repair-shampoo', 'hop-ultra-repair-rinse', 'hop-ultra-repair-mask', 'hop-ultra-repair-sealed-ends'],
    adaptationNote: 'Official routine has 4 steps; step 3 "Trata durante la noche" (Ultra Repair Overnight Serum) omitted — OUT_OF_PERU_SCOPE. Remaining steps renumbered 1-2-3, no replacement product invented.',
    steps: [
      { handle: 'routine-step-hop-ultra-repair-1', step_number: '1', label: 'Limpia', products: ['hop-ultra-repair-shampoo'] },
      { handle: 'routine-step-hop-ultra-repair-2', step_number: '2', label: 'Trata en la ducha', products: ['hop-ultra-repair-mask', 'hop-ultra-repair-rinse'] },
      { handle: 'routine-step-hop-ultra-repair-3', step_number: '3', label: 'Trata, sella y finaliza', products: ['hop-ultra-repair-sealed-ends'] },
    ],
  },
  {
    subfamily: 'Colour Last',
    productHandles: ['hop-colour-last-shampoo', 'hop-colour-last-rinse', 'hop-colour-last-mask'],
    adaptationNote: 'No adaptation needed — official 2-step routine has no out-of-Peru product.',
    steps: [
      { handle: 'routine-step-hop-colour-last-1', step_number: '1', label: 'Limpia', products: ['hop-colour-last-shampoo'] },
      { handle: 'routine-step-hop-colour-last-2', step_number: '2', label: 'Trata', products: ['hop-colour-last-mask', 'hop-colour-last-rinse'] },
    ],
  },
  {
    subfamily: 'Smooth Hydration',
    productHandles: ['hop-smooth-hydration-shampoo', 'hop-smooth-hydration-rinse', 'hop-smooth-hydration-mask'],
    adaptationNote: 'No adaptation needed — official 2-step routine has no out-of-Peru product.',
    steps: [
      { handle: 'routine-step-hop-smooth-hydration-1', step_number: '1', label: 'Limpia', products: ['hop-smooth-hydration-shampoo'] },
      { handle: 'routine-step-hop-smooth-hydration-2', step_number: '2', label: 'Trata', products: ['hop-smooth-hydration-mask', 'hop-smooth-hydration-rinse'] },
    ],
  },
];

async function main() {
  const loaded = loadShopifyEnv(REPO_ROOT);
  if (!loaded.ok) throw new Error(loaded.reason);
  const { shop, clientId, clientSecret, apiVersion } = loaded.env;
  const { accessToken } = await fetchAccessToken({ shop, clientId, clientSecret });
  const client = new AdminClient({ storeDomain: `${shop}.myshopify.com`, accessToken, apiVersion, requiredStoreDomain: REQUIRED_STORE_DOMAIN });

  console.log(`\n=== HOP routines (${APPLY ? 'APPLY' : 'PLAN ONLY'}) ===\n`);
  const productGidByHandle = {};
  for (const routine of ROUTINES) {
    console.log(`${routine.subfamily}: ${routine.steps.length} steps — ${routine.adaptationNote}`);
    for (const step of routine.steps) {
      console.log(`  ${step.handle}: "${step.label}" -> [${step.products.join(', ')}]`);
    }
    for (const h of routine.productHandles) {
      const data = await client.request(PRODUCT_LOOKUP, { handle: h });
      if (!data.productByHandle) throw new Error(`Product not found: ${h}`);
      productGidByHandle[h] = data.productByHandle;
    }
  }

  console.log('\nPre-flight: checking for existing conflicting routine-step metaobjects...');
  const allSteps = ROUTINES.flatMap((r) => r.steps);
  for (const step of allSteps) {
    const data = await client.request(METAOBJECT_BY_HANDLE, { handle: { type: TYPE, handle: step.handle } });
    if (data.metaobjectByHandle) {
      console.log(`ABORT — ${step.handle} already exists:`, JSON.stringify(data.metaobjectByHandle));
      process.exit(1);
    }
  }
  console.log(`No conflicts — all ${allSteps.length} step handles are new.`);

  console.log('\nPre-flight: confirming current montibello.routine is blank on all target products...');
  for (const routine of ROUTINES) {
    for (const h of routine.productHandles) {
      const p = productGidByHandle[h];
      const existing = p.metafields.nodes.find((m) => m.key === 'routine');
      if (existing && existing.value && JSON.parse(existing.value).length > 0) {
        console.log(`ABORT — ${h} already has a non-empty routine field:`, existing.value);
        process.exit(1);
      }
    }
  }
  console.log('Confirmed blank on all target products.');

  if (!APPLY) {
    console.log('\nPlan-only run. Re-run with --apply to execute.');
    return;
  }

  console.log('\n=== APPLYING: creating routine-step metaobjects ===');
  const stepGidByHandle = {};
  for (const step of allSteps) {
    const productGids = step.products.map((h) => productGidByHandle[h].id);
    const result = await client.request(METAOBJECT_UPSERT, {
      handle: { type: TYPE, handle: step.handle },
      metaobject: {
        fields: [
          { key: 'step_number', value: step.step_number },
          { key: 'label', value: step.label },
          { key: 'products', value: JSON.stringify(productGids) },
        ],
      },
    });
    assertNoUserErrors('metaobjectUpsert (routine_step)', result.metaobjectUpsert);
    stepGidByHandle[step.handle] = result.metaobjectUpsert.metaobject.id;
    console.log(`  created ${step.handle} -> ${result.metaobjectUpsert.metaobject.id}`);
  }

  console.log('\n=== Writing montibello.routine on all target products ===');
  const metafieldEntries = [];
  for (const routine of ROUTINES) {
    const routineGids = routine.steps.map((s) => stepGidByHandle[s.handle]);
    for (const h of routine.productHandles) {
      metafieldEntries.push({
        ownerId: productGidByHandle[h].id,
        namespace: 'montibello',
        key: 'routine',
        type: 'list.metaobject_reference',
        value: JSON.stringify(routineGids),
      });
    }
  }
  const result = await client.request(METAFIELDS_SET, { metafields: metafieldEntries });
  assertNoUserErrors('metafieldsSet (routine)', result.metafieldsSet);
  console.log(`Wrote routine to ${result.metafieldsSet.metafields.length} products.`);

  console.log('\n=== READ-BACK ===');
  for (const routine of ROUTINES) {
    for (const h of routine.productHandles) {
      const data = await client.request(PRODUCT_LOOKUP, { handle: h });
      const p = data.productByHandle;
      const routineVal = JSON.parse(p.metafields.nodes.find((m) => m.key === 'routine').value);
      console.log(`${h}: status=${p.status} variants=${p.variants.nodes.length} media=${p.media.nodes.length} routine_steps=${routineVal.length}`);
    }
  }
}
main().catch((e) => { console.error('ABORT:', e.message); process.exit(1); });
