#!/usr/bin/env node
// Phase 5 closure sprint — Step 1 complete product audit + Step 2 template
// routing check. Read-only.
const path = require('node:path');
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken } = require('./lib/oauth');
const { AdminClient } = require('./lib/admin-client');

const QUERY = `
  query($cursor: String) {
    products(first: 50, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        handle
        title
        status
        templateSuffix
        featuredImage { url }
        media(first: 10) { nodes { id } }
        variants(first: 25) { nodes { id sku title } }
        metafields(namespace: "montibello", first: 50) { nodes { key type value } }
      }
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
  let all = [];
  while (true) {
    const data = await client.request(QUERY, { cursor });
    all = all.concat(data.products.nodes);
    if (!data.products.pageInfo.hasNextPage) break;
    cursor = data.products.pageInfo.endCursor;
  }

  const rows = all.map((p) => {
    const mf = {};
    for (const m of p.metafields.nodes) mf[m.key] = m;
    const skus = p.variants.nodes.map((v) => v.sku).filter(Boolean);
    return {
      handle: p.handle,
      id: p.id,
      status: p.status,
      templateSuffix: p.templateSuffix,
      variants: p.variants.nodes.length,
      skus: skus.length,
      mediaCount: p.media.nodes.length,
      primaryImage: !!p.featuredImage,
      range: mf.range?.value || '',
      subfamily: mf.subfamily?.value || '',
      functional_subtitle: mf.functional_subtitle?.value || '',
      hair_type: mf.hair_type?.value || '',
      professional_only: mf.professional_only?.value || '',
      how_to_use: !!mf.how_to_use?.value,
      full_ingredients: !!mf.full_ingredients?.value,
      interest_data: !!mf.interest_data?.value,
      technical_data: !!mf.technical_data?.value,
      technology_heading: !!mf.technology_heading?.value,
      features: mf.features?.value ? JSON.parse(mf.features.value).length : 0,
      key_ingredients: mf.key_ingredients?.value ? JSON.parse(mf.key_ingredients.value).length : 0,
      routine: mf.routine?.value ? JSON.parse(mf.routine.value).length : 0,
      shades: mf.shades?.value ? JSON.parse(mf.shades.value).length : 0,
    };
  });

  console.log(JSON.stringify(rows, null, 2));
}
main().catch((e) => { console.error(e); process.exit(1); });
