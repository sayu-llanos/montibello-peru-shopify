#!/usr/bin/env node
// Closure sprint Step 6: populates montibello.full_ingredients (Multi-line
// text) verbatim from hair.montibello.com's "Ver todos los ingredientes"
// accordion, for the 20 products where an exact INCI list exists AND the
// product mapping is unambiguous (raw HTML fetched and parsed this
// session — see /tmp/all-inci-merged.json).
//
// NOT applied (BLOCKED_BY_SOURCE, left blank, not synthesized):
//   - under-permanent-colour, under-monodose-15/25/35vol: no matching
//     product page found on the official site (UNDER's shade-tube format
//     and Monodose format are not modeled as their own INCI-bearing pages
//     there).
//   - hop-keratin-shampoo, hop-keratin-lotion: international naming
//     discrepancy (Cleanser/Infusion vs Peru's Shampoo/Lotion) makes the
//     mapping to a specific international INCI page not unambiguous enough
//     to populate verbatim.
//   - luxlight-supreme-control-oil-lightening-system: the two-component
//     system's live page only exposes ONE component's ("Oil Lightener")
//     INCI list — writing only that as "the" full ingredients would
//     misrepresent the second component as having none, so left blank.
const path = require('node:path');
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken } = require('./lib/oauth');
const { AdminClient, assertNoUserErrors } = require('./lib/admin-client');
const { PRODUCT_LOOKUP, METAFIELDS_SET } = require('./lib/queries');

const APPLY = process.argv.includes('--apply');
const INCI = require('/tmp/all-inci-merged.json');

const BLOCKED_BY_SOURCE = [
  'under-permanent-colour', 'under-monodose-15vol', 'under-monodose-25vol', 'under-monodose-35vol',
  'hop-keratin-shampoo', 'hop-keratin-lotion', 'luxlight-supreme-control-oil-lightening-system',
];

async function main() {
  const loaded = loadShopifyEnv(REPO_ROOT);
  if (!loaded.ok) throw new Error(loaded.reason);
  const { shop, clientId, clientSecret, apiVersion } = loaded.env;
  const { accessToken } = await fetchAccessToken({ shop, clientId, clientSecret });
  const client = new AdminClient({ storeDomain: `${shop}.myshopify.com`, accessToken, apiVersion, requiredStoreDomain: REQUIRED_STORE_DOMAIN });

  const handles = Object.keys(INCI);
  console.log(`\n=== full_ingredients (${APPLY ? 'APPLY' : 'PLAN ONLY'}) ===\n`);
  console.log(`${handles.length} products to fill. ${BLOCKED_BY_SOURCE.length} BLOCKED_BY_SOURCE (unchanged):`);
  for (const h of BLOCKED_BY_SOURCE) console.log(`  ${h}`);

  const products = {};
  for (const h of handles) {
    const data = await client.request(PRODUCT_LOOKUP, { handle: h });
    if (!data.productByHandle) throw new Error(`Product not found: ${h}`);
    products[h] = data.productByHandle;
    const existing = data.productByHandle.metafields.nodes.find((m) => m.key === 'full_ingredients');
    if (existing && existing.value) {
      console.log(`ABORT — ${h} already has full_ingredients set. Refusing to overwrite.`);
      process.exit(1);
    }
  }
  console.log(`\nPre-flight OK: all ${handles.length} target products currently have blank full_ingredients.`);

  if (!APPLY) {
    console.log('\nPlan-only run. Re-run with --apply to execute.');
    return;
  }

  const metafields = handles.map((h) => ({
    ownerId: products[h].id,
    namespace: 'montibello',
    key: 'full_ingredients',
    type: 'multi_line_text_field',
    value: INCI[h],
  }));

  console.log(`\n=== APPLYING: writing ${metafields.length} full_ingredients values in chunks of 25 ===`);
  for (let i = 0; i < metafields.length; i += 25) {
    const chunk = metafields.slice(i, i + 25);
    const result = await client.request(METAFIELDS_SET, { metafields: chunk });
    assertNoUserErrors('metafieldsSet (full_ingredients)', result.metafieldsSet);
    console.log(`  chunk ${Math.floor(i / 25) + 1}: ${result.metafieldsSet.metafields.length} written`);
  }

  console.log('\n=== READ-BACK ===');
  let verified = 0;
  for (const h of handles) {
    const data = await client.request(PRODUCT_LOOKUP, { handle: h });
    const p = data.productByHandle;
    const val = p.metafields.nodes.find((m) => m.key === 'full_ingredients')?.value || '';
    const ok = val === INCI[h];
    if (ok) verified += 1;
    console.log(`${h}: status=${p.status} variants=${p.variants.nodes.length} media=${p.media.nodes.length} full_ingredients_match=${ok}`);
  }
  console.log(`\n${verified}/${handles.length} verified exact match.`);
}
main().catch((e) => { console.error('ABORT:', e.message); process.exit(1); });
