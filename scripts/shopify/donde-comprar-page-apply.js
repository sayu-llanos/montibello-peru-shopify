#!/usr/bin/env node
// Creates (or verifies) the /pages/donde-comprar Shopify Page — the
// non-ecommerce Peru storefront's replacement for a purchase flow. Content
// is deliberately a placeholder: no retailer is invented here.
//
// Usage:
//   node scripts/shopify/donde-comprar-page-apply.js --dry-run
//   node scripts/shopify/donde-comprar-page-apply.js --apply
//
// Idempotent: if a page with this handle already exists, no mutation runs.

const path = require('node:path');
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken } = require('./lib/oauth');
const { AdminClient, assertNoUserErrors } = require('./lib/admin-client');

const APPLY = process.argv.includes('--apply');
const HANDLE = 'donde-comprar';
const TITLE = 'Dónde comprar';
const BODY_HTML = '<p>Próximamente podrás encontrar aquí nuestros puntos de venta y tiendas aliadas.</p>';

const PAGE_LOOKUP = `
  query {
    pages(first: 5, query: "handle:${HANDLE}") {
      nodes { id title handle body }
    }
  }
`;

const PAGE_CREATE = `
  mutation PageCreate($page: PageCreateInput!) {
    pageCreate(page: $page) {
      page { id title handle }
      userErrors { field message code }
    }
  }
`;

async function main() {
  console.log(`\n=== Donde Comprar page (${APPLY ? 'apply' : 'dry-run'}) ===\n`);
  const envResult = loadShopifyEnv(REPO_ROOT);
  if (!envResult.ok) throw new Error(envResult.reason);
  const { accessToken } = await fetchAccessToken({
    shop: envResult.env.shop,
    clientId: envResult.env.clientId,
    clientSecret: envResult.env.clientSecret,
  });
  const client = new AdminClient({
    storeDomain: envResult.env.storeDomain,
    accessToken,
    apiVersion: envResult.env.apiVersion,
    requiredStoreDomain: REQUIRED_STORE_DOMAIN,
  });

  const data = await client.request(PAGE_LOOKUP);
  const existing = data.pages.nodes.find((p) => p.handle === HANDLE);
  if (existing) {
    console.log(`PAGE FOUND: YES — "${existing.title}" (${existing.id}), handle=${existing.handle}`);
    console.log(`BODY: ${existing.body}`);
    console.log('\nAlready exists — no mutation needed.');
    return;
  }

  console.log('PAGE FOUND: NO');
  console.log(`WOULD CREATE: title="${TITLE}" handle="${HANDLE}"`);
  console.log(`BODY: ${BODY_HTML}`);

  if (!APPLY) {
    console.log('\nDry-run only — no mutation executed.');
    return;
  }

  const result = await client.request(PAGE_CREATE, {
    page: { title: TITLE, handle: HANDLE, body: BODY_HTML, isPublished: true },
  });
  assertNoUserErrors('pageCreate', result.pageCreate);
  console.log(`\nCREATED: ${result.pageCreate.page.id} handle=${result.pageCreate.page.handle}`);
}

main().catch((e) => {
  console.error('\nABORTED:', e.message);
  process.exitCode = 1;
});
