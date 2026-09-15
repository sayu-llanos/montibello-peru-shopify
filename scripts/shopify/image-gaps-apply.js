#!/usr/bin/env node
// Closure sprint Step 3: closes 7 of the 10 missing-media gaps with
// exact/high-confidence source-assets images, visually confirmed one at a
// time (see conversation) before this plan was written. Never invents an
// image mapping — the 3 UNDER Monodose SKUs have no confirmed asset in
// source-assets and are left blank (BLOCKED_BY_SOURCE), not filled with a
// guess.
//
// Usage: node scripts/shopify/image-gaps-apply.js [--apply]
const path = require('node:path');
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken } = require('./lib/oauth');
const { AdminClient } = require('./lib/admin-client');
const { PRODUCT_LOOKUP } = require('./lib/queries');
const ops = require('./lib/operations');

const APPLY = process.argv.includes('--apply');

const PLAN = [
  {
    handle: 'under-permanent-colour',
    images: [{ file: 'source-assets/UNDER/products/under-tubo.png', alt: 'Tubo de coloración permanente Under de Montibello' }],
    note: 'Generic Under colouring tube — EXACT_MATCH for the canonical Permanent Colour PDP (no shade-specific number on the tube itself).',
  },
  {
    handle: 'under-activator-15vol',
    images: [{ file: 'source-assets/UNDER/products/under-crema-activadora.png', alt: 'Crema activadora Under de Montibello' }],
    note: 'SHARED generic activator packshot — the bottle shows no volume-specific number in this asset, used identically for all 3 activator SKUs.',
  },
  {
    handle: 'under-activator-25vol',
    images: [{ file: 'source-assets/UNDER/products/under-crema-activadora.png', alt: 'Crema activadora Under de Montibello' }],
    note: 'SHARED (see under-activator-15vol).',
  },
  {
    handle: 'under-activator-35vol',
    images: [{ file: 'source-assets/UNDER/products/under-crema-activadora.png', alt: 'Crema activadora Under de Montibello' }],
    note: 'SHARED (see under-activator-15vol).',
  },
  {
    handle: 'hop-keratin-shampoo',
    images: [{ file: 'source-assets/HOP-KERATIN/coming-soon/hop-keratin-cleanser.jpg', alt: 'HOP Keratin Shampoo de Montibello' }],
    note: 'International bottle text reads "Cleanser / Organic Alkaline Shampoo" — Peru canonical title "HOP Keratin Shampoo" is NOT changed; documenting the naming discrepancy only.',
  },
  {
    handle: 'hop-keratin-lotion',
    images: [{ file: 'source-assets/HOP-KERATIN/coming-soon/hop-keratin-infusion.jpg', alt: 'HOP Keratin Lotion de Montibello' }],
    note: 'International bottle text reads "Infusion / Organic Keratin Therapy" — Peru canonical title "HOP Keratin Lotion" is NOT changed; documenting the naming discrepancy only.',
  },
  {
    handle: 'luxlight-supreme-control-oil-lightening-system',
    images: [
      { file: 'source-assets/LUXLIGHT/products/luxlight-supreme-control-oil-lightening-system-1.png', alt: 'Luxlight Supreme Control Oil Lightener (componente 1) de Montibello' },
      { file: 'source-assets/LUXLIGHT/products/luxlight-supreme-control-oil-lightening-system-2.png', alt: 'Luxlight Supreme Control Oil Activator (componente 2) de Montibello' },
    ],
    note: 'Both components visually confirmed: image "-1" is labeled "Oil lightener" (1), image "-2" is labeled "Oil activator" (2) — both attached per the two-component system.',
  },
];

const NOT_CLOSED = [
  { handle: 'under-monodose-15vol', reason: 'No Monodose-specific asset exists anywhere in source-assets/UNDER — left blank (clean placeholder), not guessed.' },
  { handle: 'under-monodose-25vol', reason: 'Same as above.' },
  { handle: 'under-monodose-35vol', reason: 'Same as above.' },
];

async function main() {
  const loaded = loadShopifyEnv(REPO_ROOT);
  if (!loaded.ok) throw new Error(loaded.reason);
  const { shop, clientId, clientSecret, apiVersion } = loaded.env;
  const { accessToken } = await fetchAccessToken({ shop, clientId, clientSecret });
  const client = new AdminClient({ storeDomain: `${shop}.myshopify.com`, accessToken, apiVersion, requiredStoreDomain: REQUIRED_STORE_DOMAIN });

  console.log(`\n=== IMAGE PLAN (${APPLY ? 'APPLY' : 'PLAN ONLY'}) ===\n`);
  for (const item of PLAN) {
    console.log(`${item.handle}: +${item.images.length} image(s) — ${item.note}`);
  }
  console.log('\n--- NOT CLOSED (BLOCKED_BY_SOURCE) ---');
  for (const item of NOT_CLOSED) console.log(`${item.handle}: ${item.reason}`);

  // Pre-flight: confirm every target product currently has 0 or fewer images than planned, never overwrite existing media.
  for (const item of PLAN) {
    const data = await client.request(PRODUCT_LOOKUP, { handle: item.handle });
    if (!data.productByHandle) throw new Error(`Product not found: ${item.handle}`);
    if (data.productByHandle.media.nodes.length > 0) {
      throw new Error(`ABORT — ${item.handle} already has ${data.productByHandle.media.nodes.length} media item(s). Refusing to add more without explicit review (would need dedup logic not built here).`);
    }
  }
  console.log('\nPre-flight OK: all 7 target products currently have 0 media.');

  if (!APPLY) {
    console.log('\nPlan-only run. Re-run with --apply to execute.');
    return;
  }

  console.log('\n=== APPLYING ===');
  for (const item of PLAN) {
    const data = await client.request(PRODUCT_LOOKUP, { handle: item.handle });
    const product = data.productByHandle;
    for (const img of item.images) {
      const absolutePath = path.join(REPO_ROOT, img.file);
      const filename = path.basename(img.file);
      const media = await ops.uploadAndAttachImage(client, { productId: product.id, absolutePath, filename, altText: img.alt });
      console.log(`${item.handle}: attached ${filename} -> media count now ${media.length}`);
    }
  }

  console.log('\n=== READ-BACK ===');
  for (const item of PLAN) {
    const data = await client.request(PRODUCT_LOOKUP, { handle: item.handle });
    const p = data.productByHandle;
    console.log(`${item.handle}: status=${p.status} variants=${p.variants.nodes.length} media=${p.media.nodes.length}`);
  }
}
main().catch((e) => { console.error('ABORT:', e.message); process.exit(1); });
