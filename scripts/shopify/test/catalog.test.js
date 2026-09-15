// Local-only tests for the canonical catalog builder — no network calls.
// Run with: node --test scripts/shopify/test/catalog.test.js

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { buildCanonicalCatalog } = require('../lib/catalog');
const ops = require('../lib/operations');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');

test('buildCanonicalCatalog: produces exactly the 27 canonical PDPs from product-grouping.csv', () => {
  const catalog = buildCanonicalCatalog(REPO_ROOT);
  assert.equal(catalog.length, 27);
});

test('buildCanonicalCatalog: HOP Ultra Repair Shampoo has two Size variants with confirmed SKUs', () => {
  const catalog = buildCanonicalCatalog(REPO_ROOT);
  const spec = catalog.find((s) => s.handle === 'hop-ultra-repair-shampoo');
  assert.ok(spec);
  assert.deepEqual(
    spec.variants.map((v) => [v.optionName, v.optionValue, v.sku]),
    [
      ['Size', '300 ml', 'HRS3I'],
      ['Size', '1000 ml', 'HRS1F'],
    ]
  );
  assert.deepEqual(spec.confirmedSkus, ['HRS3I', 'HRS1F']);
  assert.equal(spec.exactMatchImages.length, 1);
});

test('buildCanonicalCatalog: UNDER Permanent Colour is one informational product with no SKU and 57 shade identifiers', () => {
  const catalog = buildCanonicalCatalog(REPO_ROOT);
  const spec = catalog.find((s) => s.handle === 'under-permanent-colour');
  assert.ok(spec);
  assert.equal(spec.variants.length, 1);
  assert.equal(spec.variants[0].sku, null);
  assert.equal(spec.confirmedSkus.length, 0);
  assert.equal(spec.shadeIdentifiers.length, 57);
});

test('buildCanonicalCatalog: UNDER activator/monodose products are single-SKU, single-variant, no default option', () => {
  const catalog = buildCanonicalCatalog(REPO_ROOT);
  const spec = catalog.find((s) => s.handle === 'under-activator-15vol');
  assert.ok(spec);
  assert.equal(spec.variants.length, 1);
  assert.equal(spec.variants[0].sku, 'UO15');
  assert.equal(spec.confirmedSkus.length, 1);
});

test('buildCanonicalCatalog: HOP Keratin products are COMING SOON and flagged with no EXACT_MATCH image', () => {
  const catalog = buildCanonicalCatalog(REPO_ROOT);
  const shampoo = catalog.find((s) => s.handle === 'hop-keratin-shampoo');
  assert.ok(shampoo);
  assert.equal(shampoo.commercialStatus, 'COMING SOON');
  assert.equal(shampoo.exactMatchImages.length, 0);
  assert.ok(shampoo.warnings.some((w) => w.includes('No EXACT_MATCH image')));
});

test('buildCanonicalCatalog: LUXLIGHT Supreme Control Oil System has two EXACT_MATCH component images flagged for manual selection', () => {
  const catalog = buildCanonicalCatalog(REPO_ROOT);
  const spec = catalog.find((s) => s.handle === 'luxlight-supreme-control-oil-lightening-system');
  assert.ok(spec);
  assert.equal(spec.exactMatchImages.length, 2);
  assert.ok(spec.warnings.some((w) => w.includes('EXACT_MATCH images found')));
});

test('buildCanonicalCatalog: HOP Ultra Repair Overnight Serum has no row (confirms OUT_OF_PERU_SCOPE exclusion)', () => {
  const catalog = buildCanonicalCatalog(REPO_ROOT);
  const found = catalog.find((s) => /overnight serum/i.test(s.title));
  assert.equal(found, undefined);
});

test('buildCanonicalCatalog: every canonical product carries range/subfamily as the only universally-ready metafields', () => {
  const catalog = buildCanonicalCatalog(REPO_ROOT);
  for (const spec of catalog) {
    assert.deepEqual(spec.metafieldsReady, ['range', 'subfamily']);
    assert.ok(spec.range, `expected a range for ${spec.handle}`);
  }
});

// Integration check across the module boundary: lib/catalog.js's variant
// field names (optionName/optionValue) must match what lib/operations.js's
// planVariantUpdates actually reads. A live run once created
// hop-colour-last-rinse with the right option/variants but then reported
// "expected variant(s) not found" because the two modules disagreed on
// field names (option/value vs. optionName/optionValue) — this test fails
// loudly if that mismatch is ever reintroduced.
test('buildCanonicalCatalog + planVariantUpdates: a paired-size spec matches a freshly created product by option name/value', () => {
  const catalog = buildCanonicalCatalog(REPO_ROOT);
  const spec = catalog.find((s) => s.handle === 'hop-colour-last-rinse');
  assert.ok(spec);
  const fakeCreatedProduct = {
    variants: {
      nodes: spec.variants.map((v, i) => ({
        id: `gid://shopify/ProductVariant/${i}`,
        sku: null,
        selectedOptions: [{ name: v.optionName, value: v.optionValue }],
      })),
    },
  };
  const plan = ops.planVariantUpdates(fakeCreatedProduct, spec.variants);
  assert.equal(plan.notFoundOnProduct.length, 0);
  assert.equal(plan.toUpdate.length, spec.variants.length);
});

test('buildCanonicalCatalog + needsRealOption: single-SKU and informational specs never need a real option', () => {
  const catalog = buildCanonicalCatalog(REPO_ROOT);
  for (const spec of catalog) {
    if (spec.variants.length === 1) {
      assert.equal(ops.needsRealOption(spec), false, `${spec.handle} should not need a real option`);
    } else {
      assert.equal(ops.needsRealOption(spec), true, `${spec.handle} should need a real option`);
    }
  }
});
