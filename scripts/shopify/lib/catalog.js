// Builds the canonical Peru catalog model purely from local, already-approved
// sources — no network calls, no invented data:
//   - data/shopify/product-grouping.csv   (one row per canonical PDP)
//   - data/shopify/asset-classification-report.json (EXACT_MATCH images only)
//
// This is the single place that turns those two files into the 27 canonical
// product specs the rest of the catalog pipeline (dry-run, apply) works from.
// It never queries Shopify and never touches data/shopify/draft/ — those
// files are explicitly staging-only per docs/shopify-product-architecture.md's
// Implementation Gates and must not be imported.

const fs = require('node:fs');
const path = require('node:path');
const { parseCsvToObjects } = require('./csv');

function loadExactMatchImagesByProduct(repoRoot) {
  const reportPath = path.join(repoRoot, 'data', 'shopify', 'asset-classification-report.json');
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const byProduct = {};
  for (const asset of report.assets) {
    if (asset.classification !== 'EXACT_MATCH') continue;
    if (!byProduct[asset.canonical_product_id]) byProduct[asset.canonical_product_id] = [];
    byProduct[asset.canonical_product_id].push(asset.path);
  }
  return byProduct;
}

/**
 * Builds one canonical product spec from a single product-grouping.csv row.
 * Variant/SKU derivation rules (no fabrication):
 *  - pdp_status "INFORMATIONAL" (UNDER Permanent Colour): one non-commercial
 *    default variant with NO sku. The pipe-separated source_skus values are
 *    shade catalog identifiers, not SKUs or variants.
 *  - variant_option_1 present (e.g. "Size"): one variant per
 *    variant_values_1 entry, SKU taken from the matching source_skus token
 *    by position.
 *  - Otherwise: one default variant, SKU = the single source_skus token.
 */
function buildProductSpec(row, exactMatchImagesByProduct) {
  const isInformational = row.pdp_status === 'INFORMATIONAL';
  const hasOption = Boolean(row.variant_option_1 && row.variant_option_1.trim() !== '');
  const skuTokens = row.source_skus ? row.source_skus.split('|') : [];

  let variants;
  let confirmedSkus;
  let shadeIdentifiers = [];

  if (isInformational) {
    variants = [{ optionName: 'Title', optionValue: 'Default Title', sku: null }];
    confirmedSkus = [];
    shadeIdentifiers = skuTokens;
  } else if (hasOption) {
    const values = row.variant_values_1.split('|');
    variants = values.map((optionValue, i) => ({
      optionName: row.variant_option_1,
      optionValue,
      sku: skuTokens[i] || null,
    }));
    confirmedSkus = variants.map((v) => v.sku).filter(Boolean);
  } else {
    variants = [{ optionName: 'Title', optionValue: 'Default Title', sku: skuTokens[0] || null }];
    confirmedSkus = skuTokens.slice(0, 1);
  }

  const exactMatchImages = exactMatchImagesByProduct[row.canonical_product_id] || [];

  const warnings = [];
  if (exactMatchImages.length === 0) {
    warnings.push(
      `No EXACT_MATCH image in asset-classification-report.json (CSV image_status: "${row.image_status}") — not auto-usable; needs manual image confirmation.`
    );
  } else if (exactMatchImages.length > 1) {
    warnings.push(
      `${exactMatchImages.length} EXACT_MATCH images found (${exactMatchImages.join(', ')}) — needs explicit primary-image selection, not auto-resolved.`
    );
  }
  if (row.commercial_status === 'COMING SOON') {
    warnings.push('COMING SOON: no price, no inventory, no allied-store offers until launch approval.');
  }
  if (isInformational) {
    warnings.push(
      `${shadeIdentifiers.length} shade catalog identifiers map to montibello_under_shade metaobjects (not variants); 0 have confirmed Peru ERP SKUs.`
    );
  }
  if (row.notes) warnings.push(`CSV note: ${row.notes}`);

  const dependencies = [];
  if (isInformational) dependencies.push('57 montibello_under_shade metaobjects (not created by this dry-run)');
  if (row.canonical_product_id === 'LUX-LXLPCB42') {
    dependencies.push('Two-component system — component quantities belong in montibello.technical_data, not variants');
  }

  return {
    canonicalId: row.canonical_product_id,
    title: row.product_title,
    handle: row.product_handle,
    range: row.range,
    subfamily: row.subfamily,
    productType: row.product_type,
    variants,
    confirmedSkus,
    shadeIdentifiers,
    commercialStatus: row.commercial_status,
    pdpStatus: row.pdp_status,
    imageStatusNote: row.image_status,
    exactMatchImages,
    metafieldsReady: ['range', 'subfamily'],
    dependencies,
    warnings,
  };
}

/** Returns the 27 canonical product specs, in product-grouping.csv order. */
function buildCanonicalCatalog(repoRoot) {
  const csvPath = path.join(repoRoot, 'data', 'shopify', 'product-grouping.csv');
  const rows = parseCsvToObjects(fs.readFileSync(csvPath, 'utf8'));
  const exactMatchImagesByProduct = loadExactMatchImagesByProduct(repoRoot);
  return rows.map((row) => buildProductSpec(row, exactMatchImagesByProduct));
}

module.exports = { buildCanonicalCatalog, buildProductSpec, loadExactMatchImagesByProduct };
