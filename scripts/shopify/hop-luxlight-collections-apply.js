#!/usr/bin/env node
// Manager-review sprint: creates the Collections needed for HOP landing +
// 3 HOP subfamily pages + LUXLIGHT range page (Pages are unavailable — this
// app's granted scopes are write_files/write_metaobjects/write_products
// [+read equivalents], with no read_content/write_content, so the Shopify
// "Page" resource is inaccessible; Collections fall under write_products
// and are already the working pattern for UNDER's range page).
//
// Usage: node scripts/shopify/hop-luxlight-collections-apply.js [--apply]
//
// Never touches: product status/variants/SKUs/prices, UNDER's existing
// collection beyond reading it, LUXLIGHT/HOP product data, metaobjects.

const path = require('node:path');
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken } = require('./lib/oauth');
const { AdminClient, assertNoUserErrors } = require('./lib/admin-client');

const APPLY = process.argv.includes('--apply');

const COLLECTION_CREATE = `
  mutation CollectionCreate($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection { id title handle templateSuffix }
      userErrors { field message }
    }
  }
`;
const COLLECTION_UPDATE = `
  mutation CollectionUpdate($input: CollectionInput!) {
    collectionUpdate(input: $input) {
      collection { id title handle templateSuffix }
      userErrors { field message }
    }
  }
`;
const COLLECTION_ADD_PRODUCTS = `
  mutation CollectionAddProducts($id: ID!, $productIds: [ID!]!) {
    collectionAddProducts(id: $id, productIds: $productIds) {
      collection { id }
      userErrors { field message }
    }
  }
`;
const COLLECTION_BY_HANDLE = `
  query CollectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) {
      id title handle templateSuffix
      products(first: 10) { nodes { handle } }
    }
  }
`;

const PLAN = [
  {
    handle: 'hop',
    title: 'HOP',
    templateSuffix: 'hop',
    productHandles: [],
  },
  {
    handle: 'hop-ultra-repair',
    title: 'HOP / Ultra Repair',
    templateSuffix: 'hop-ultra-repair',
    productHandles: ['hop-ultra-repair-shampoo', 'hop-ultra-repair-rinse', 'hop-ultra-repair-mask', 'hop-ultra-repair-sealed-ends'],
  },
  {
    handle: 'hop-colour-last',
    title: 'HOP / Colour Last',
    templateSuffix: 'hop-colour-last',
    productHandles: ['hop-colour-last-shampoo', 'hop-colour-last-rinse', 'hop-colour-last-mask'],
  },
  {
    handle: 'hop-smooth-hydration',
    title: 'HOP / Smooth Hydration',
    templateSuffix: 'hop-smooth-hydration',
    productHandles: ['hop-smooth-hydration-shampoo', 'hop-smooth-hydration-rinse', 'hop-smooth-hydration-mask'],
  },
  {
    handle: 'luxlight',
    title: 'Luxlight',
    templateSuffix: 'luxlight',
    productHandles: [
      'luxlight-supreme-lightener-9plus',
      'luxlight-supreme-clay-lightener-7plus',
      'luxlight-supreme-control-oil-lightening-system',
      'luxlight-supreme-oil-developer-10vol',
      'luxlight-supreme-oil-developer-20vol',
      'luxlight-supreme-oil-developer-30vol',
      'luxlight-supreme-ph-protective-shampoo',
      'luxlight-supreme-acidic-ph-treatment',
    ],
  },
];

async function main() {
  const loaded = loadShopifyEnv(REPO_ROOT);
  if (!loaded.ok) throw new Error(loaded.reason);
  const { shop, clientId, clientSecret, apiVersion } = loaded.env;
  const { accessToken } = await fetchAccessToken({ shop, clientId, clientSecret });
  const client = new AdminClient({ storeDomain: `${shop}.myshopify.com`, accessToken, apiVersion, requiredStoreDomain: REQUIRED_STORE_DOMAIN });

  console.log(`\n=== Collections plan (${APPLY ? 'APPLY' : 'PLAN ONLY'}) ===\n`);
  const existing = {};
  for (const spec of PLAN) {
    const data = await client.request(COLLECTION_BY_HANDLE, { handle: spec.handle });
    existing[spec.handle] = data.collectionByHandle;
    const action = data.collectionByHandle ? 'UPDATE (exists)' : 'CREATE';
    console.log(`${spec.handle}: ${action} — templateSuffix -> "${spec.templateSuffix}", products -> [${spec.productHandles.join(', ') || '(none)'}]`);
    if (data.collectionByHandle) {
      console.log(`  current members: [${data.collectionByHandle.products.nodes.map((p) => p.handle).join(', ')}]`);
    }
  }

  if (!APPLY) {
    console.log('\nPlan-only run. Re-run with --apply to execute.');
    return;
  }

  console.log('\n=== APPLYING ===\n');
  for (const spec of PLAN) {
    const current = existing[spec.handle];
    const gids = [];
    // Resolve product handles to GIDs via a lightweight lookup (reusing PRODUCT_LOOKUP would pull unneeded fields; a minimal inline query is fine here).
    for (const handle of spec.productHandles) {
      const data = await client.request(`query($h: String!){ productByHandle(handle:$h){ id } }`, { h: handle });
      if (!data.productByHandle) throw new Error(`Product not found for collection membership: ${handle}`);
      gids.push(data.productByHandle.id);
    }

    if (current) {
      const result = await client.request(COLLECTION_UPDATE, {
        input: { id: current.id, templateSuffix: spec.templateSuffix },
      });
      assertNoUserErrors('collectionUpdate', result.collectionUpdate);
      console.log(`Updated ${spec.handle} -> ${result.collectionUpdate.collection.id}`);
      const existingHandles = new Set(current.products.nodes.map((p) => p.handle));
      const toAdd = spec.productHandles.filter((h) => !existingHandles.has(h));
      if (toAdd.length > 0) {
        const gidsToAdd = [];
        for (const handle of toAdd) {
          const data = await client.request(`query($h: String!){ productByHandle(handle:$h){ id } }`, { h: handle });
          gidsToAdd.push(data.productByHandle.id);
        }
        const addResult = await client.request(COLLECTION_ADD_PRODUCTS, { id: current.id, productIds: gidsToAdd });
        assertNoUserErrors('collectionAddProducts', addResult.collectionAddProducts);
        console.log(`  added members: [${toAdd.join(', ')}]`);
      }
    } else {
      const result = await client.request(COLLECTION_CREATE, {
        input: { title: spec.title, handle: spec.handle, templateSuffix: spec.templateSuffix, products: gids },
      });
      assertNoUserErrors('collectionCreate', result.collectionCreate);
      console.log(`Created ${spec.handle} -> ${result.collectionCreate.collection.id}`);
    }
  }

  console.log('\n=== READ-BACK ===');
  for (const spec of PLAN) {
    const data = await client.request(COLLECTION_BY_HANDLE, { handle: spec.handle });
    const c = data.collectionByHandle;
    console.log(`${spec.handle}: templateSuffix=${c.templateSuffix} members=[${c.products.nodes.map((p) => p.handle).join(', ')}]`);
  }
}

main().catch((e) => {
  console.error('\nABORT:', e.message);
  process.exit(1);
});
