#!/usr/bin/env node
// Creates (or verifies) the Peru Color landing + color category Pages.
// Pages are empty shells: content lives in theme templates
// (templates/page.<suffix>.json), so nothing renders on themes lacking them.
//
// Usage:
//   node scripts/shopify/color-pages-apply.js --dry-run
//   node scripts/shopify/color-pages-apply.js --apply
// Idempotent: existing handles are left untouched.

const path = require('node:path');
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken } = require('./lib/oauth');
const { AdminClient, assertNoUserErrors } = require('./lib/admin-client');

const APPLY = process.argv.includes('--apply');
const PAGES = [
  { handle: 'color', title: 'Color', templateSuffix: 'color' },
  { handle: 'coloracion-alta-cobertura', title: 'Coloración alta cobertura', templateSuffix: 'coloracion-alta-cobertura' },
  { handle: 'educacion', title: 'Educación', templateSuffix: 'educacion' },
  { handle: 'decoloracion', title: 'Decoloración', templateSuffix: 'decoloracion' },
  { handle: 'tratamiento-anti-rotura', title: 'Tratamiento anti rotura', templateSuffix: 'tratamiento-anti-rotura' },
];

const LOOKUP = `query($q: String!) { pages(first: 5, query: $q) { nodes { id handle title templateSuffix isPublished } } }`;
const CREATE = `
  mutation PageCreate($page: PageCreateInput!) {
    pageCreate(page: $page) {
      page { id title handle templateSuffix }
      userErrors { field message code }
    }
  }
`;

async function main() {
  console.log(`\n=== Color pages (${APPLY ? 'apply' : 'dry-run'}) ===\n`);
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

  for (const p of PAGES) {
    const data = await client.request(LOOKUP, { q: `handle:${p.handle}` });
    const existing = data.pages.nodes.find((n) => n.handle === p.handle);
    if (existing) {
      console.log(`EXISTS  ${p.handle} (suffix=${existing.templateSuffix}, published=${existing.isPublished})`);
      continue;
    }
    if (!APPLY) { console.log(`WOULD CREATE ${p.handle}`); continue; }
    const res = await client.request(CREATE, {
      page: { title: p.title, handle: p.handle, body: '', templateSuffix: p.templateSuffix, isPublished: true },
    });
    assertNoUserErrors(res.pageCreate, 'pageCreate');
    console.log(`CREATED ${res.pageCreate.page.handle} (${res.pageCreate.page.id})`);
  }
}

main().catch((e) => { console.error(e.message); process.exit(1); });
