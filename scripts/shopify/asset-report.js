#!/usr/bin/env node
// Full-catalog source-assets/ classification report. READ-ONLY — never
// uploads or modifies anything; only writes the report file itself.
//
// Usage: node scripts/shopify/asset-report.js
// Output: data/shopify/asset-classification-report.json

const fs = require('node:fs');
const path = require('node:path');
const { parseCsvToObjects } = require('./lib/csv');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const ASSETS_ROOT = path.join(REPO_ROOT, 'source-assets');

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.DS_Store') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

/** Product-relevant token derived from a canonical handle, e.g.
 * "hop-ultra-repair-shampoo" -> "ultra-repair-shampoo" (drops the leading
 * range segment, which every packshot filename also drops). */
function coreToken(handle, range) {
  const rangePrefix = range.toLowerCase().replace(/\s+/g, '-').split('-')[0]; // "hop", "under", "luxlight"
  return handle.startsWith(`${rangePrefix}-`) ? handle.slice(rangePrefix.length + 1) : handle;
}

function normalizeStem(filename) {
  return path
    .basename(filename)
    .replace(/\.[^.]+$/, '')
    .toLowerCase();
}

function classify(filePath, csvRows) {
  const rel = path.relative(REPO_ROOT, filePath).replace(/\\/g, '/');
  const stem = normalizeStem(filePath);

  // 1. International/inspiration research material from earlier QA rounds —
  //    never a Peru production asset candidate for a Shopify product image.
  if (rel.startsWith('source-assets/REFERENCE-RANGES/') || rel.startsWith('source-assets/REFERENCE-HOME/')) {
    return {
      path: rel,
      classification: 'UNMATCHED',
      reason: 'International reference/inspiration asset from an earlier design-audit round — not a Peru production packshot candidate.',
    };
  }

  // 2. Brand-level collateral, not tied to one product.
  if (rel.startsWith('source-assets/BRAND/') || rel.startsWith('source-assets/community/')) {
    return {
      path: rel,
      classification: 'UNMATCHED',
      reason: 'Brand-level or community collateral, not a single-product image.',
    };
  }

  // 3. Explicit out-of-scope: Overnight Serum has no row anywhere in
  //    product-grouping.csv.
  if (stem.includes('overnight-serum')) {
    return {
      path: rel,
      classification: 'OUT_OF_PERU_SCOPE',
      reason: 'HOP Ultra Repair Overnight Serum has no row in data/shopify/product-grouping.csv — not a confirmed Peru product.',
    };
  }

  // 4. Range-level collateral folders that are never per-product packshots.
  if (/\/(campaign|professional|video|pdf|technical|technology|gallery|family-cards)\//.test(rel)) {
    return {
      path: rel,
      classification: 'UNMATCHED',
      reason: 'Range-level campaign/technical/collateral asset, not a single confirmed product\'s packshot.',
    };
  }

  // 5. Try to match against a confirmed catalog row's core token.
  const candidates = csvRows
    .map((row) => ({ row, token: coreToken(row.product_handle, row.range) }))
    .filter(({ token }) => stem.includes(token));

  if (candidates.length === 0) {
    return {
      path: rel,
      classification: 'UNMATCHED',
      reason: 'No confirmed product handle token found in this filename.',
    };
  }

  // Prefer the longest/most specific token match if more than one candidate matches.
  candidates.sort((a, b) => b.token.length - a.token.length);
  const { row } = candidates[0];

  const isToneSwapAlt = stem.endsWith('-ts');
  const isInternationalStyleReference = stem.endsWith('-reference');

  if (isToneSwapAlt) {
    return {
      path: rel,
      classification: 'POSSIBLE_MATCH',
      canonical_product_id: row.canonical_product_id,
      reason: 'Filename ends in "-ts" (tone-swap/alternate-colorway render) — same product, but not confirmed as the real retail packaging color. Inspect visually before use, same as hop-ultra-repair-shampoo-ts.png was for this pilot.',
    };
  }
  if (isInternationalStyleReference) {
    return {
      path: rel,
      classification: 'POSSIBLE_MATCH',
      canonical_product_id: row.canonical_product_id,
      reason: 'International-reference-style filename — likely design-comparison material rather than a Peru production packshot.',
    };
  }

  return {
    path: rel,
    classification: 'EXACT_MATCH',
    canonical_product_id: row.canonical_product_id,
    product_handle: row.product_handle,
    csv_image_status: row.image_status,
    reason: `Filename token matches confirmed product handle "${row.product_handle}".`,
  };
}

function main() {
  const csvText = fs.readFileSync(path.join(REPO_ROOT, 'data', 'shopify', 'product-grouping.csv'), 'utf8');
  const csvRows = parseCsvToObjects(csvText);

  const files = walk(ASSETS_ROOT);
  const results = files.map((f) => classify(f, csvRows));

  const summary = { EXACT_MATCH: 0, POSSIBLE_MATCH: 0, UNMATCHED: 0, OUT_OF_PERU_SCOPE: 0 };
  for (const r of results) summary[r.classification]++;

  const report = {
    generated_at: new Date().toISOString().slice(0, 10),
    scope: 'Full source-assets/ inventory vs. data/shopify/product-grouping.csv confirmed Peru assortment. Report only — no uploads, no product changes.',
    summary,
    assets: results,
  };

  const outPath = path.join(REPO_ROOT, 'data', 'shopify', 'asset-classification-report.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n');

  console.log(`Classified ${results.length} files.`);
  console.log(summary);
  console.log(`Written to ${path.relative(REPO_ROOT, outPath)}`);
}

main();
