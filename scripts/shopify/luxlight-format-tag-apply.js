#!/usr/bin/env node
// Montibello — Luxlight single-variant "Formato" tag fix.
//
// Usage:
//   node scripts/shopify/luxlight-format-tag-apply.js --dry-run
//   node scripts/shopify/luxlight-format-tag-apply.js --apply
//
// Context: all 8 Luxlight PDPs have exactly one Shopify variant, using
// Shopify's synthetic placeholder option ("Title" / "Default Title"). The
// theme's format tag (montibello-product-main.liquid, `show_format`) is
// deliberately driven by `product.selected_or_first_available_variant.title`
// per docs/product-pages/product-data-schema.md ("Native Shopify product
// fields are used as-is and are not duplicated as montibello.* metafields
// ... used as the format/size tag ... when it isn't Shopify's placeholder
// Default Title") — so a real option value here is the correct, non-
// duplicating fix, requiring zero Liquid changes.
//
// The official hair.montibello.com Supreme Lightener 9+ PDP (live-confirmed
// via browser snapshot this session) shows an informational "500 gr" tag
// next to "Todo tipo de cabello". The other 7 products' formats come from
// each product's own already-populated, official-sourced `technical_data`
// rich-text metafield (e.g. "Formato: 400g." / "Formato: 1000ml."), written
// in a prior session directly from official pages — not invented here, only
// reformatted to match the "500 gr" / "N ml" display convention confirmed
// live. Supreme Control Oil Lightening System is a genuine two-component
// product (its own technical_data: "Formato: 200g + 400g (dos
// componentes).") so its tag reflects both.
//
// Renames ONLY the option name ("Title" -> "Formato") and its one value
// ("Default Title" -> the real format) via productOptionUpdate. Does NOT
// touch price, inventory, SKU, barcode, status, or create/delete any
// variant — variantStrategy defaults to keeping the existing variant as-is
// when there is exactly one option value before and after.
//
// Safety model (same as every other script in this directory):
// - Refuses to run against any store except nar9bk-s9.myshopify.com.
// - Client Credentials Grant auth via .env.local — no static token.
// - --dry-run performs only read queries and prints the full plan.
// - --apply mutates only the 8 listed products, only option/value names.
// - Every mutation is checked for userErrors; any error aborts immediately.
// - Re-reads and prints each product's variant title after apply.

const path = require('node:path');
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken } = require('./lib/oauth');
const { AdminClient, assertNoUserErrors } = require('./lib/admin-client');

const APPLY = process.argv.includes('--apply');

// handle -> { format, optionName } — sourced as documented above.
const FORMAT_PLAN = {
  'luxlight-supreme-lightener-9plus': { format: '500 gr', source: 'Live-confirmed official PDP (hair.montibello.com/producto/supreme-lightener-9/)' },
  'luxlight-supreme-clay-lightener-7plus': { format: '400 gr', source: "Product's own technical_data metafield: 'Formato: 400g.'" },
  'luxlight-supreme-control-oil-lightening-system': { format: '200 gr + 400 gr', source: "Product's own technical_data metafield: 'Formato: 200g + 400g (dos componentes).'" },
  'luxlight-supreme-ph-protective-shampoo': { format: '1000 ml', source: "Product's own technical_data metafield: 'Formato: 1000ml.'" },
  'luxlight-supreme-acidic-ph-treatment': { format: '450 ml', source: "Product's own technical_data metafield: 'Formato: 450ml.'" },
  'luxlight-supreme-oil-developer-10vol': { format: '1000 ml', source: "Product's own technical_data metafield: 'Formato: 1000ml.'" },
  'luxlight-supreme-oil-developer-20vol': { format: '1000 ml', source: "Product's own technical_data metafield: 'Formato: 1000ml.'" },
  'luxlight-supreme-oil-developer-30vol': { format: '1000 ml', source: "Product's own technical_data metafield: 'Formato: 1000ml.'" },
};

const PRODUCTS_QUERY = `
  query LuxlightProducts($cursor: String) {
    collection(id: "gid://shopify/Collection/492192694465") {
      products(first: 20, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            id
            title
            handle
            hasOnlyDefaultVariant
            options { id name optionValues { id name } }
          }
        }
      }
    }
  }
`;

const OPTION_UPDATE = `
  mutation ProductOptionUpdate(
    $productId: ID!
    $option: OptionUpdateInput!
    $optionValuesToUpdate: [OptionValueUpdateInput!]
  ) {
    productOptionUpdate(
      productId: $productId
      option: $option
      optionValuesToUpdate: $optionValuesToUpdate
    ) {
      userErrors { field message code }
      product {
        id
        options { name optionValues { name } }
        variants(first: 5) { edges { node { title } } }
      }
    }
  }
`;

async function main() {
  const loaded = loadShopifyEnv(REPO_ROOT);
  if (!loaded.ok) {
    console.error(loaded.reason);
    process.exit(1);
  }
  const { accessToken } = await fetchAccessToken(loaded.env);
  const client = new AdminClient({
    storeDomain: loaded.env.storeDomain,
    accessToken,
    apiVersion: loaded.env.apiVersion,
    requiredStoreDomain: REQUIRED_STORE_DOMAIN,
  });

  console.log(`Store: ${loaded.env.storeDomain} (mode: ${APPLY ? 'APPLY' : 'DRY-RUN'})\n`);

  let products = [];
  let cursor = null;
  do {
    const data = await client.request(PRODUCTS_QUERY, { cursor });
    products = products.concat(data.collection.products.edges.map((e) => e.node));
    cursor = data.collection.products.pageInfo.hasNextPage
      ? data.collection.products.pageInfo.endCursor
      : null;
  } while (cursor);

  const plan = [];
  for (const product of products) {
    const target = FORMAT_PLAN[product.handle];
    if (!target) {
      console.log(`SKIP (not in plan): ${product.title} [${product.handle}]`);
      continue;
    }
    if (!product.hasOnlyDefaultVariant || product.options.length !== 1) {
      console.log(`SKIP (unexpected option structure): ${product.title} [${product.handle}]`);
      continue;
    }
    const option = product.options[0];
    const value = option.optionValues[0];
    if (option.name === 'Formato' && value.name === target.format) {
      console.log(`ALREADY CORRECT: ${product.title} [${product.handle}] -> "${target.format}"`);
      continue;
    }
    plan.push({ product, option, value, target });
  }

  console.log('\nPLAN:');
  console.log('PRODUCT | CURRENT OPTION/VALUE | NEW OPTION/VALUE | SOURCE');
  for (const p of plan) {
    console.log(
      `${p.product.title} | "${p.option.name}"/"${p.value.name}" | "Formato"/"${p.target.format}" | ${p.target.source}`
    );
  }
  console.log(`\n${plan.length} product(s) to update. ${Object.keys(FORMAT_PLAN).length - plan.length} already correct or skipped.\n`);

  if (!APPLY) {
    console.log('Dry-run only — no mutations sent. Re-run with --apply to write these changes.');
    return;
  }

  for (const p of plan) {
    const result = await client.request(OPTION_UPDATE, {
      productId: p.product.id,
      option: { id: p.option.id, name: 'Formato' },
      optionValuesToUpdate: [{ id: p.value.id, name: p.target.format }],
    });
    assertNoUserErrors('productOptionUpdate', result.productOptionUpdate);
    const updated = result.productOptionUpdate.product;
    const variantTitle = updated.variants.edges[0]?.node.title;
    console.log(`APPLIED: ${p.product.title} -> option "${updated.options[0].name}" = "${updated.options[0].optionValues[0].name}" (variant.title = "${variantTitle}")`);
  }

  console.log('\nDone. Verifying via fresh re-query...\n');

  let verifyProducts = [];
  cursor = null;
  do {
    const data = await client.request(PRODUCTS_QUERY, { cursor });
    verifyProducts = verifyProducts.concat(data.collection.products.edges.map((e) => e.node));
    cursor = data.collection.products.pageInfo.hasNextPage
      ? data.collection.products.pageInfo.endCursor
      : null;
  } while (cursor);

  for (const product of verifyProducts) {
    const target = FORMAT_PLAN[product.handle];
    if (!target) continue;
    const value = product.options[0]?.optionValues[0]?.name;
    const ok = value === target.format ? 'OK' : `MISMATCH (expected "${target.format}")`;
    console.log(`${product.title} [${product.handle}]: "${value}" -- ${ok}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
