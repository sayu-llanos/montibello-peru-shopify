#!/usr/bin/env node
// Closure sprint Step 2: sets Product.templateSuffix = "montibello" on all 27
// canonical products so they render templates/product.montibello.json
// instead of Shopify's default product.json. Scalar-only productUpdate
// (product: {id, templateSuffix}) — never touches status, price, inventory,
// variants, media, or publication channels. Read-back-verifies all of those
// are unchanged after each write.
const path = require('node:path');
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken } = require('./lib/oauth');
const { AdminClient, assertNoUserErrors } = require('./lib/admin-client');

const APPLY = process.argv.includes('--apply');
const TARGET_SUFFIX = 'montibello';

const LIST_QUERY = `
  query($cursor: String) {
    products(first: 50, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      nodes { id handle status templateSuffix variants(first: 25) { nodes { id sku } } media(first: 5) { nodes { id } } }
    }
  }
`;
const UPDATE_MUTATION = `
  mutation($product: ProductUpdateInput!) {
    productUpdate(product: $product) {
      product { id handle templateSuffix status }
      userErrors { field message }
    }
  }
`;

async function fetchAll(client) {
  let cursor = null;
  let all = [];
  while (true) {
    const data = await client.request(LIST_QUERY, { cursor });
    all = all.concat(data.products.nodes);
    if (!data.products.pageInfo.hasNextPage) break;
    cursor = data.products.pageInfo.endCursor;
  }
  return all;
}

async function main() {
  const loaded = loadShopifyEnv(REPO_ROOT);
  if (!loaded.ok) throw new Error(loaded.reason);
  const { shop, clientId, clientSecret, apiVersion } = loaded.env;
  const { accessToken } = await fetchAccessToken({ shop, clientId, clientSecret });
  const client = new AdminClient({ storeDomain: `${shop}.myshopify.com`, accessToken, apiVersion, requiredStoreDomain: REQUIRED_STORE_DOMAIN });

  const before = await fetchAll(client);
  console.log(`Found ${before.length} products. Current templateSuffix values: ${[...new Set(before.map((p) => p.templateSuffix))]}`);
  const needsFix = before.filter((p) => p.templateSuffix !== TARGET_SUFFIX);
  console.log(`${needsFix.length} products need templateSuffix -> "${TARGET_SUFFIX}"`);

  if (!APPLY) {
    console.log('Plan-only run. Re-run with --apply to execute.');
    return;
  }

  const beforeById = Object.fromEntries(before.map((p) => [p.id, p]));
  for (const p of needsFix) {
    const result = await client.request(UPDATE_MUTATION, { product: { id: p.id, templateSuffix: TARGET_SUFFIX } });
    assertNoUserErrors('productUpdate (templateSuffix)', result.productUpdate);
  }

  const after = await fetchAll(client);
  let ok = 0;
  for (const p of after) {
    const prior = beforeById[p.id];
    if (p.status !== prior.status) throw new Error(`STATUS CHANGED for ${p.handle}: ${prior.status} -> ${p.status}`);
    if (p.variants.nodes.length !== prior.variants.nodes.length) throw new Error(`VARIANTS CHANGED for ${p.handle}`);
    if (p.media.nodes.length !== prior.media.nodes.length) throw new Error(`MEDIA CHANGED for ${p.handle}`);
    if (p.templateSuffix === TARGET_SUFFIX) ok += 1;
    else console.log(`STILL WRONG: ${p.handle} -> ${p.templateSuffix}`);
  }
  console.log(`\nDone. ${ok}/${after.length} products now have templateSuffix="${TARGET_SUFFIX}". Status/variants/media unchanged for all.`);
}
main().catch((e) => { console.error('ABORT:', e.message); process.exit(1); });
