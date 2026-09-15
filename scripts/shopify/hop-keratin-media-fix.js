#!/usr/bin/env node
// Closure sprint follow-up: HOP Keratin Shampoo/Lotion media was reported
// attached (media count = 1) but a fresh live query found status: FAILED,
// image: null. Root cause: the source JPEGs are 8000x8000px (64 megapixels),
// over Shopify's product-image size limit — the Luxlight images that
// succeeded earlier were 4000x4000. Deletes the two FAILED file records
// (fileDelete — removes only the broken media, no other product field),
// then re-attaches a resized (4000x4000, same aspect, same crop) copy of
// the same already-approved source image via the established
// uploadAndAttachImage path. Never changes Peru product titles.
const path = require('node:path');
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken } = require('./lib/oauth');
const { AdminClient, assertNoUserErrors } = require('./lib/admin-client');
const { PRODUCT_LOOKUP } = require('./lib/queries');
const ops = require('./lib/operations');

const APPLY = process.argv.includes('--apply');
const RESIZED_DIR = '/private/tmp/claude-501/-Users-sayurillanos-Projects-montibello-peru-shopify/d00bcbed-c58e-46ac-9733-7f26db33a042/scratchpad/resized';

const FILE_DELETE = `
  mutation FileDelete($fileIds: [ID!]!) {
    fileDelete(fileIds: $fileIds) {
      deletedFileIds
      userErrors { field message }
    }
  }
`;
const MEDIA_STATUS_QUERY = `
  query($h: String!) {
    productByHandle(handle: $h) {
      id
      status
      variants(first: 25) { nodes { id } }
      media(first: 5) { nodes { id status mediaContentType alt } }
    }
  }
`;

const PLAN = [
  { handle: 'hop-keratin-shampoo', file: 'hop-keratin-cleanser.jpg', alt: 'HOP Keratin Shampoo de Montibello' },
  { handle: 'hop-keratin-lotion', file: 'hop-keratin-infusion.jpg', alt: 'HOP Keratin Lotion de Montibello' },
];

async function main() {
  const loaded = loadShopifyEnv(REPO_ROOT);
  if (!loaded.ok) throw new Error(loaded.reason);
  const { shop, clientId, clientSecret, apiVersion } = loaded.env;
  const { accessToken } = await fetchAccessToken({ shop, clientId, clientSecret });
  const client = new AdminClient({ storeDomain: `${shop}.myshopify.com`, accessToken, apiVersion, requiredStoreDomain: REQUIRED_STORE_DOMAIN });

  console.log(`\n=== HOP Keratin media fix (${APPLY ? 'APPLY' : 'PLAN ONLY'}) ===\n`);
  const before = {};
  for (const item of PLAN) {
    const data = await client.request(MEDIA_STATUS_QUERY, { h: item.handle });
    before[item.handle] = data.productByHandle;
    const failedIds = data.productByHandle.media.nodes.filter((m) => m.status === 'FAILED').map((m) => m.id);
    console.log(`${item.handle}: current media = ${JSON.stringify(data.productByHandle.media.nodes.map((m) => m.status))}, FAILED to delete: ${failedIds.length}`);
    item.failedIds = failedIds;
    if (failedIds.length === 0) {
      console.log(`  Nothing FAILED here — skipping (no stale media to clean up).`);
    }
  }

  if (!APPLY) {
    console.log('\nPlan-only run. Re-run with --apply to execute.');
    return;
  }

  for (const item of PLAN) {
    const product = before[item.handle];
    if (item.failedIds.length > 0) {
      const delResult = await client.request(FILE_DELETE, { fileIds: item.failedIds });
      assertNoUserErrors('fileDelete', delResult.fileDelete);
      console.log(`${item.handle}: deleted FAILED media ${JSON.stringify(delResult.fileDelete.deletedFileIds)}`);
    }
    const absolutePath = path.join(RESIZED_DIR, item.file);
    const media = await ops.uploadAndAttachImage(client, { productId: product.id, absolutePath, filename: item.file, altText: item.alt });
    console.log(`${item.handle}: attached resized ${item.file} -> media count now ${media.length}`);
  }

  console.log('\n=== READ-BACK ===');
  for (const item of PLAN) {
    const data = await client.request(MEDIA_STATUS_QUERY, { h: item.handle });
    const p = data.productByHandle;
    const priorProduct = before[item.handle];
    if (p.status !== priorProduct.status) throw new Error(`STATUS CHANGED for ${item.handle}`);
    if (p.variants.nodes.length !== priorProduct.variants.nodes.length) throw new Error(`VARIANTS CHANGED for ${item.handle}`);
    console.log(`${item.handle}: status=${p.status} variants=${p.variants.nodes.length} media=${JSON.stringify(p.media.nodes.map((m) => m.status))}`);
  }
}
main().catch((e) => { console.error('ABORT:', e.message); process.exit(1); });
