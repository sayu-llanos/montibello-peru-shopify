#!/usr/bin/env node
// Manager-review closure P0 #2: DRAFT -> UNLISTED for the 24 canonical
// products still DRAFT, leaving the 3 already-UNLISTED products untouched.
// Never sets ACTIVE. Never touches sales-channel publications, variants,
// SKUs, metafields, media, prices, inventory, barcodes, handles, or titles
// — productUpdate is called with only {id, status}.
const path = require('node:path');
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken } = require('./lib/oauth');
const { AdminClient, assertNoUserErrors } = require('./lib/admin-client');

const APPLY = process.argv.includes('--apply');

const LIST_Q = `
  query($cursor: String) {
    products(first: 50, after: $cursor, query: "vendor:Montibello") {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        handle
        status
        variants(first: 25) { nodes { id sku } }
        media(first: 5) { nodes { status } }
      }
    }
  }
`;

const PRODUCT_UPDATE = `
  mutation($id: ID!, $status: ProductStatus!) {
    productUpdate(product: { id: $id, status: $status }) {
      product { id status }
      userErrors { field message }
    }
  }
`;

async function main() {
  const loaded = loadShopifyEnv(REPO_ROOT);
  if (!loaded.ok) throw new Error(loaded.reason);
  const { shop, clientId, clientSecret, apiVersion } = loaded.env;
  const { accessToken } = await fetchAccessToken({ shop, clientId, clientSecret });
  const client = new AdminClient({ storeDomain: `${shop}.myshopify.com`, accessToken, apiVersion, requiredStoreDomain: REQUIRED_STORE_DOMAIN });

  let cursor = null;
  const all = [];
  while (true) {
    const data = await client.request(LIST_Q, { cursor });
    all.push(...data.products.nodes);
    if (!data.products.pageInfo.hasNextPage) break;
    cursor = data.products.pageInfo.endCursor;
  }

  if (all.length !== 27) throw new Error(`ABORT — expected 27 products, found ${all.length}.`);

  const unlisted = all.filter((p) => p.status === 'UNLISTED');
  const draft = all.filter((p) => p.status === 'DRAFT');
  const other = all.filter((p) => p.status !== 'UNLISTED' && p.status !== 'DRAFT');

  console.log(`\n=== Visibility plan (${APPLY ? 'APPLY' : 'PLAN ONLY'}) ===`);
  console.log(`Already UNLISTED: ${unlisted.length} (left untouched)`);
  console.log(`DRAFT -> UNLISTED: ${draft.length}`);
  if (other.length > 0) {
    console.log(`ABORT — ${other.length} product(s) in unexpected status:`, JSON.stringify(other.map((p) => ({ handle: p.handle, status: p.status }))));
    process.exit(1);
  }

  // Snapshot variants/media before, to assert nothing else changes.
  const before = {};
  for (const p of all) {
    before[p.id] = {
      handle: p.handle,
      skus: p.variants.nodes.map((v) => v.sku).sort(),
      mediaStatuses: p.media.nodes.map((m) => m.status),
    };
  }

  if (!APPLY) {
    console.log('\nPlan-only run. Re-run with --apply to execute.');
    return;
  }

  console.log('\n=== APPLYING: productUpdate(status: UNLISTED) on 24 DRAFT products ===');
  for (const p of draft) {
    const result = await client.request(PRODUCT_UPDATE, { id: p.id, status: 'UNLISTED' });
    assertNoUserErrors('productUpdate (visibility)', result.productUpdate);
    console.log(`  ${p.handle}: ${p.status} -> ${result.productUpdate.product.status}`);
  }

  console.log('\n=== READ-BACK ===');
  let cursor2 = null;
  const after = [];
  while (true) {
    const data = await client.request(LIST_Q, { cursor: cursor2 });
    after.push(...data.products.nodes);
    if (!data.products.pageInfo.hasNextPage) break;
    cursor2 = data.products.pageInfo.endCursor;
  }
  if (after.length !== 27) throw new Error(`POST-CHECK ABORT — expected 27 products, found ${after.length}.`);

  const byStatus = {};
  let mismatches = 0;
  for (const p of after) {
    byStatus[p.status] = (byStatus[p.status] || 0) + 1;
    const b = before[p.id];
    const skusNow = p.variants.nodes.map((v) => v.sku).sort();
    const mediaNow = p.media.nodes.map((m) => m.status);
    if (b.handle !== p.handle) { console.log(`MISMATCH handle for ${p.id}`); mismatches++; }
    if (JSON.stringify(b.skus) !== JSON.stringify(skusNow)) { console.log(`MISMATCH skus for ${p.handle}`); mismatches++; }
    if (JSON.stringify(b.mediaStatuses) !== JSON.stringify(mediaNow)) { console.log(`MISMATCH media for ${p.handle}`); mismatches++; }
  }
  console.log('Status distribution:', JSON.stringify(byStatus));
  console.log(mismatches === 0 ? 'No side effects detected: all SKUs/media unchanged.' : `${mismatches} SIDE-EFFECT MISMATCHES DETECTED.`);
}
main().catch((e) => { console.error('ABORT:', e.message); process.exit(1); });
