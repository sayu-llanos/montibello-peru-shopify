// Local-only tests — no network calls, no real Shopify credentials needed.
// Run with: node --test scripts/shopify/test/operations.test.js

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const ops = require('../lib/operations');
const { parseEnvFile, REQUIRED_STORE_DOMAIN, loadShopifyEnv } = require('../lib/env');
const { parseCsvToObjects } = require('../lib/csv');
const { ADMIN_API_VERSION } = require('../lib/config');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');

function fakeProduct(overrides = {}) {
  return {
    id: 'gid://shopify/Product/1',
    title: 'HOP Ultra Repair Shampoo',
    handle: 'hop-ultra-repair-shampoo',
    status: 'DRAFT',
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/10',
          sku: 'OLD-SKU-300',
          selectedOptions: [{ name: 'Size', value: '300 ml' }],
        },
        {
          id: 'gid://shopify/ProductVariant/11',
          sku: 'HRS1F',
          selectedOptions: [{ name: 'Size', value: '1000 ml' }],
        },
      ],
    },
    metafields: { nodes: [{ id: 'gid://shopify/Metafield/1', key: 'range', type: 'single_line_text_field', value: 'HOP' }] },
    media: { nodes: [] },
    ...overrides,
  };
}

test('planVariantUpdates: flags a mismatched SKU and leaves a matching one alone', () => {
  const product = fakeProduct();
  const desired = [
    { optionName: 'Size', optionValue: '300 ml', sku: 'HRS3I' },
    { optionName: 'Size', optionValue: '1000 ml', sku: 'HRS1F' },
  ];
  const plan = ops.planVariantUpdates(product, desired);
  assert.equal(plan.toUpdate.length, 1);
  assert.equal(plan.toUpdate[0].currentSku, 'OLD-SKU-300');
  assert.equal(plan.alreadyCorrect.length, 1);
  assert.equal(plan.notFoundOnProduct.length, 0);
});

test('planVariantUpdates: reports a confirmed variant missing from the live product', () => {
  const product = fakeProduct();
  const desired = [{ optionName: 'Size', optionValue: '5000 ml', sku: 'NOPE' }];
  const plan = ops.planVariantUpdates(product, desired);
  assert.equal(plan.notFoundOnProduct.length, 1);
});

test('planMetafieldUpdates: skips a metafield whose type and value already match', () => {
  const product = fakeProduct();
  const plan = ops.planMetafieldUpdates(product, {
    range: { type: 'single_line_text_field', value: 'HOP' },
    subfamily: { type: 'single_line_text_field', value: 'Ultra Repair' },
  });
  assert.equal(plan.alreadyCorrect.length, 1);
  assert.equal(plan.toSet.length, 1);
  assert.equal(plan.toSet[0].key, 'subfamily');
});

test('planMetaobjectUpserts: an empty metaobjects config produces zero plans (no fabrication)', () => {
  const plans = ops.planMetaobjectUpserts('hop-ultra-repair-shampoo', {
    features: [],
    key_ingredients: [],
    routine: [],
    allied_store_offers: [],
  });
  assert.equal(plans.length, 0);
});

test('planMetaobjectUpserts: builds a deterministic handle from product handle + type + index', () => {
  const plans = ops.planMetaobjectUpserts('hop-ultra-repair-shampoo', {
    features: [{ title: { type: 'single_line_text_field', value: 'x' } }],
  });
  assert.equal(plans.length, 1);
  assert.equal(plans[0].handle, 'hop-ultra-repair-shampoo-montibello_feature-0');
});

test('buildAltText: factual, derived only from the confirmed title — no inferred size', () => {
  const alt = ops.buildAltText('HOP Ultra Repair Shampoo');
  assert.equal(alt, 'Botella de HOP Ultra Repair Shampoo de Montibello');
});

test('planImageUpload: detects an already-attached image by alt text (dedupe)', () => {
  const product = fakeProduct({ media: { nodes: [{ id: 'gid://shopify/MediaImage/1', alt: 'match me' }] } });
  const plan = ops.planImageUpload(product, 'match me');
  assert.equal(plan.alreadyUploaded, true);
});

test('planImageUpload: reports not-yet-uploaded when no media matches', () => {
  const product = fakeProduct();
  const plan = ops.planImageUpload(product, 'match me');
  assert.equal(plan.alreadyUploaded, false);
});

test('resolveAssetPath: accepts a real source-assets/ file', () => {
  const resolved = ops.resolveAssetPath(
    REPO_ROOT,
    'source-assets/HOP/ULTRA-REPAIR/hop-ultra-repair-shampoo.png'
  );
  assert.ok(resolved.endsWith('hop-ultra-repair-shampoo.png'));
});

test('resolveAssetPath: refuses a local-assets/ path', () => {
  assert.throws(() => ops.resolveAssetPath(REPO_ROOT, 'local-assets/whatever.png'), /source-assets/);
});

test('resolveAssetPath: refuses a path to a file that does not exist', () => {
  assert.throws(() => ops.resolveAssetPath(REPO_ROOT, 'source-assets/HOP/does-not-exist.png'), /not found/);
});

test('config: ADMIN_API_VERSION is exactly 2026-07', () => {
  assert.equal(ADMIN_API_VERSION, '2026-07');
});

test('env: loadShopifyEnv defaults apiVersion to the single ADMIN_API_VERSION constant, not a second hardcoded string', () => {
  const fs = require('node:fs');
  const os = require('node:os');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'montibello-env-test-'));
  fs.writeFileSync(
    path.join(tmpDir, '.env.local'),
    'SHOPIFY_SHOP=nar9bk-s9\nSHOPIFY_CLIENT_ID=x\nSHOPIFY_CLIENT_SECRET=y\n'
  );
  const result = loadShopifyEnv(tmpDir);
  assert.equal(result.ok, true);
  assert.equal(result.env.apiVersion, ADMIN_API_VERSION);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('env: parseEnvFile reads KEY=VALUE lines and ignores comments/blank lines', () => {
  const parsed = parseEnvFile('# comment\nSHOPIFY_SHOP=nar9bk-s9\n\nSHOPIFY_CLIENT_SECRET="abc123"\n');
  assert.equal(`${parsed.SHOPIFY_SHOP}.myshopify.com`, REQUIRED_STORE_DOMAIN);
  assert.equal(parsed.SHOPIFY_CLIENT_SECRET, 'abc123');
});

test('csv: parseCsvToObjects handles a quoted field containing a comma', () => {
  const rows = parseCsvToObjects('a,b\n1,"x, y"\n');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].b, 'x, y');
});

test('csv: product-grouping.csv contains the confirmed HOP Ultra Repair Shampoo row', () => {
  const fs = require('node:fs');
  const text = fs.readFileSync(path.join(REPO_ROOT, 'data', 'shopify', 'product-grouping.csv'), 'utf8');
  const rows = parseCsvToObjects(text);
  const row = rows.find((r) => r.canonical_product_id === 'HOP-ULTRA-REPAIR-SHAMPOO');
  assert.ok(row, 'expected row not found');
  assert.equal(row.product_handle, 'hop-ultra-repair-shampoo');
  assert.equal(row.source_skus, 'HRS3I|HRS1F');
});

test('csv: product-grouping.csv has no row for the Overnight Serum (confirms OUT_OF_PERU_SCOPE)', () => {
  const fs = require('node:fs');
  const text = fs.readFileSync(path.join(REPO_ROOT, 'data', 'shopify', 'product-grouping.csv'), 'utf8');
  const rows = parseCsvToObjects(text);
  const row = rows.find((r) => /overnight serum/i.test(r.product_title));
  assert.equal(row, undefined);
});

function fakeClient(response) {
  return { request: async () => response };
}

function fakeClientCapture(response) {
  const calls = [];
  return {
    calls,
    request: async (query, variables) => {
      calls.push({ query, variables });
      return response;
    },
  };
}

test('needsRealOption: false for a single-variant product with the implicit Title option', () => {
  const spec = { variants: [{ optionName: 'Title', optionValue: 'Default Title', sku: 'UO15' }] };
  assert.equal(ops.needsRealOption(spec), false);
});

test('needsRealOption: true for a paired-size product', () => {
  const spec = {
    variants: [
      { optionName: 'Size', optionValue: '300 ml', sku: 'HRS3I' },
      { optionName: 'Size', optionValue: '1000 ml', sku: 'HRS1F' },
    ],
  };
  assert.equal(ops.needsRealOption(spec), true);
});

test('createCanonicalProduct: sends only range/subfamily metafields, DRAFT status, Montibello vendor, no productOptions — no speculative fields', async () => {
  const client = fakeClientCapture({
    productCreate: {
      product: { id: 'gid://shopify/Product/999', title: 'x', handle: 'x', status: 'DRAFT', variants: { nodes: [] }, media: { nodes: [] } },
      userErrors: [],
    },
  });
  const spec = {
    title: 'HOP Colour Last Rinse',
    handle: 'hop-colour-last-rinse',
    range: 'HOP',
    subfamily: 'Color Last',
    productType: 'Conditioner',
    variants: [
      { optionName: 'Size', optionValue: '200 ml', sku: 'HCB2X' },
      { optionName: 'Size', optionValue: '750 ml', sku: 'HCB7Q' },
    ],
  };
  await ops.createCanonicalProduct(client, spec, undefined);
  assert.equal(client.calls.length, 1);
  const { product } = client.calls[0].variables;
  assert.equal(product.status, 'DRAFT');
  assert.equal(product.vendor, 'Montibello');
  assert.equal(product.handle, 'hop-colour-last-rinse');
  assert.deepEqual(product.metafields, [
    { namespace: 'montibello', key: 'range', type: 'single_line_text_field', value: 'HOP' },
    { namespace: 'montibello', key: 'subfamily', type: 'single_line_text_field', value: 'Color Last' },
  ]);
  // productCreate only ever creates one initial variant regardless of
  // productOptions (per its own live mutation description) — this pipeline
  // never sends productOptions to it, to avoid implying otherwise.
  assert.equal(product.productOptions, undefined);
});

test('addConfirmedOption: sends the Size option with both confirmed values and variantStrategy CREATE', async () => {
  const client = fakeClientCapture({
    productOptionsCreate: {
      product: {
        id: 'gid://shopify/Product/999',
        title: 'x',
        handle: 'x',
        status: 'DRAFT',
        variants: {
          nodes: [
            { id: 'v1', sku: null, selectedOptions: [{ name: 'Size', value: '200 ml' }] },
            { id: 'v2', sku: null, selectedOptions: [{ name: 'Size', value: '750 ml' }] },
          ],
        },
        media: { nodes: [] },
      },
      userErrors: [],
    },
  });
  const spec = {
    variants: [
      { optionName: 'Size', optionValue: '200 ml', sku: 'HCB2X' },
      { optionName: 'Size', optionValue: '750 ml', sku: 'HCB7Q' },
    ],
  };
  const product = await ops.addConfirmedOption(client, 'gid://shopify/Product/999', spec);
  assert.equal(client.calls.length, 1);
  const { productId, options, variantStrategy } = client.calls[0].variables;
  assert.equal(productId, 'gid://shopify/Product/999');
  assert.deepEqual(options, [{ name: 'Size', values: [{ name: '200 ml' }, { name: '750 ml' }] }]);
  assert.equal(variantStrategy, 'CREATE');
  assert.equal(product.variants.nodes.length, 2);
});

test('checkProductUpdateMediaAvailable: PASS when productUpdate has a media arg resolving to CreateMediaInput', async () => {
  const client = fakeClient({
    __type: {
      fields: [
        {
          name: 'productUpdate',
          args: [
            { name: 'product', type: { name: 'ProductUpdateInput', kind: 'INPUT_OBJECT', ofType: null } },
            {
              name: 'media',
              type: {
                name: null,
                kind: 'LIST',
                ofType: { name: null, kind: 'NON_NULL', ofType: { name: 'CreateMediaInput', kind: 'INPUT_OBJECT' } },
              },
            },
          ],
        },
      ],
    },
  });
  const result = await ops.checkProductUpdateMediaAvailable(client);
  assert.equal(result.available, true);
});

test('checkProductUpdateMediaAvailable: FAIL when productUpdate has no media arg (e.g. an older API version)', async () => {
  const client = fakeClient({
    __type: {
      fields: [
        {
          name: 'productUpdate',
          args: [{ name: 'input', type: { name: 'ProductInput', kind: 'INPUT_OBJECT', ofType: null } }],
        },
      ],
    },
  });
  const result = await ops.checkProductUpdateMediaAvailable(client);
  assert.equal(result.available, false);
  assert.match(result.reason, /no "media" argument/);
});

test('checkProductUpdateMediaAvailable: FAIL when productUpdate itself is absent', async () => {
  const client = fakeClient({ __type: { fields: [] } });
  const result = await ops.checkProductUpdateMediaAvailable(client);
  assert.equal(result.available, false);
  assert.match(result.reason, /not present/);
});
