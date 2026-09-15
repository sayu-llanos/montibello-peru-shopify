#!/usr/bin/env node
// Montibello full-catalog Shopify dry-run (Phase 3).
//
// Usage:
//   node scripts/shopify/catalog-dry-run.js
//
// Read-only by design: this script has no --apply mode and never calls a
// mutation. It exists to answer one question — for every canonical PDP
// defined in data/shopify/product-grouping.csv, does it already exist in
// Shopify, and what would creating/updating it involve — without changing
// anything.
//
// Safety model (same as pdp-sync.js):
// - Refuses to run against any store except nar9bk-s9.myshopify.com.
// - Authenticates via Client Credentials Grant; verifies live scopes via
//   currentAppInstallation.accessScopes.
// - Only reads. MUTATIONS EXECUTED is always 0 for this script.
// - Canonical product data comes only from lib/catalog.js (product-grouping
//   .csv + asset-classification-report.json) — never from data/shopify/draft/,
//   which remains staging-only per the architecture doc's Implementation
//   Gates.

const path = require('node:path');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken, missingScopes, REQUIRED_SCOPES } = require('./lib/oauth');
const { AdminClient, ShopifyAdminError } = require('./lib/admin-client');
const { STORE_AND_SCOPES_VERIFY, PRODUCT_LOOKUP } = require('./lib/queries');
const { buildCanonicalCatalog } = require('./lib/catalog');
const fs = require('node:fs');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

function padTruncate(value, width) {
  const s = String(value);
  return s.length > width ? `${s.slice(0, width - 1)}…` : s.padEnd(width);
}

/** Diffs a canonical spec against the live product (or null if not found). */
function planProduct(spec, liveProduct) {
  if (!liveProduct) {
    return { action: 'CREATE', existingStatus: null, variantDiffs: [], metafieldDiffs: [], imageAlreadyAttached: false };
  }

  const variantDiffs = [];
  for (const desired of spec.variants) {
    if (!desired.sku) continue; // informational default variant — nothing to compare
    const match = liveProduct.variants.nodes.find((v) =>
      v.selectedOptions.some((o) => o.name === desired.optionName && o.value === desired.optionValue)
    );
    if (!match) {
      variantDiffs.push(`MISSING on live product: ${desired.optionName}=${desired.optionValue} (sku ${desired.sku})`);
    } else if (match.sku !== desired.sku) {
      variantDiffs.push(`SKU mismatch ${desired.optionName}=${desired.optionValue}: live="${match.sku || '(blank)'}" vs confirmed="${desired.sku}"`);
    }
  }

  const metafieldDiffs = [];
  for (const key of spec.metafieldsReady) {
    const desiredValue = key === 'range' ? spec.range : spec.subfamily;
    const existing = liveProduct.metafields.nodes.find((m) => m.key === key);
    if (!existing || existing.value !== desiredValue) {
      metafieldDiffs.push(`montibello.${key}: live="${existing ? existing.value : '(unset)'}" vs confirmed="${desiredValue}"`);
    }
  }

  const expectedAlt = `Botella de ${spec.title} de Montibello`;
  const imageAlreadyAttached = liveProduct.media.nodes.some((m) => m.alt === expectedAlt);
  const imageNeeded = spec.exactMatchImages.length === 1 && !imageAlreadyAttached;

  const action = variantDiffs.length === 0 && metafieldDiffs.length === 0 && !imageNeeded ? 'SKIP' : 'UPDATE';

  return { action, existingStatus: liveProduct.status, variantDiffs, metafieldDiffs, imageAlreadyAttached };
}

async function main() {
  console.log('\n=== Montibello full-catalog Shopify dry-run (Phase 3) ===\n');

  const envResult = loadShopifyEnv(REPO_ROOT);
  if (!envResult.ok) {
    console.log(`STORE VERIFIED: NO — ${envResult.reason}`);
    console.log('\nMUTATIONS EXECUTED: 0');
    process.exitCode = 1;
    return;
  }

  let client;
  try {
    const { accessToken } = await fetchAccessToken({
      shop: envResult.env.shop,
      clientId: envResult.env.clientId,
      clientSecret: envResult.env.clientSecret,
    });
    client = new AdminClient({
      storeDomain: envResult.env.storeDomain,
      accessToken,
      apiVersion: envResult.env.apiVersion,
      requiredStoreDomain: REQUIRED_STORE_DOMAIN,
    });

    const verifyData = await client.request(STORE_AND_SCOPES_VERIFY);
    const returnedDomain = verifyData.shop.myshopifyDomain;
    if (returnedDomain !== REQUIRED_STORE_DOMAIN) {
      console.log(`STORE VERIFIED: NO — token belongs to "${returnedDomain}", not "${REQUIRED_STORE_DOMAIN}".`);
      console.log('\nMUTATIONS EXECUTED: 0');
      process.exitCode = 1;
      return;
    }
    console.log(`STORE VERIFIED: YES (${returnedDomain}, API ${envResult.env.apiVersion})`);

    const grantedScopes = verifyData.currentAppInstallation.accessScopes.map((s) => s.handle);
    const missing = missingScopes(grantedScopes);
    if (missing.length > 0) {
      console.log(`SCOPES VERIFIED: NO — missing ${missing.join(', ')} (required: ${REQUIRED_SCOPES.join(', ')})`);
      console.log('\nMUTATIONS EXECUTED: 0');
      process.exitCode = 1;
      return;
    }
    console.log(`SCOPES VERIFIED: YES (${grantedScopes.join(', ')})`);
  } catch (err) {
    console.log(`STORE VERIFIED: NO — ${err.message}`);
    console.log('\nMUTATIONS EXECUTED: 0');
    process.exitCode = 1;
    return;
  }

  const catalog = buildCanonicalCatalog(REPO_ROOT);
  console.log(`\nCANONICAL PRODUCTS EXPECTED (from product-grouping.csv): ${catalog.length}`);

  const rows = [];
  for (const spec of catalog) {
    let liveProduct = null;
    try {
      const data = await client.request(PRODUCT_LOOKUP, { handle: spec.handle });
      liveProduct = data.productByHandle;
    } catch (err) {
      rows.push({ spec, error: err.message });
      continue;
    }
    const plan = planProduct(spec, liveProduct);
    rows.push({ spec, liveProduct, plan });
  }

  // --- Table ---------------------------------------------------------
  const headers = ['HANDLE', 'TITLE', 'ACTION', 'VARIANTS', 'CONFIRMED SKUS', 'PRIMARY IMAGE', 'METAFIELDS READY', 'DEPENDENCIES', 'WARNINGS'];
  const widths = [40, 34, 6, 8, 30, 13, 18, 34, 60];
  console.log('\n' + headers.map((h, i) => padTruncate(h, widths[i])).join(' | '));
  console.log(widths.map((w) => '-'.repeat(w)).join('-|-'));

  for (const r of rows) {
    const { spec } = r;
    if (r.error) {
      console.log(
        [
          padTruncate(spec.handle, widths[0]),
          padTruncate(spec.title, widths[1]),
          padTruncate('ERROR', widths[2]),
          padTruncate('-', widths[3]),
          padTruncate('-', widths[4]),
          padTruncate('-', widths[5]),
          padTruncate('-', widths[6]),
          padTruncate('-', widths[7]),
          padTruncate(r.error, widths[8]),
        ].join(' | ')
      );
      continue;
    }
    const { plan } = r;
    const primaryImage = spec.exactMatchImages.length === 1 ? 'EXACT_MATCH' : spec.exactMatchImages.length > 1 ? 'EXACT_MATCH(x' + spec.exactMatchImages.length + ')' : 'MISSING';
    const warningsCombined = [
      ...spec.warnings,
      ...(plan.variantDiffs || []),
      ...(plan.metafieldDiffs || []),
    ].join(' / ') || '-';
    console.log(
      [
        padTruncate(spec.handle, widths[0]),
        padTruncate(spec.title, widths[1]),
        padTruncate(plan.action, widths[2]),
        padTruncate(spec.variants.length, widths[3]),
        padTruncate(spec.confirmedSkus.join(',') || '(none)', widths[4]),
        padTruncate(primaryImage, widths[5]),
        padTruncate(spec.metafieldsReady.join(','), widths[6]),
        padTruncate(spec.dependencies.join('; ') || '-', widths[7]),
        padTruncate(warningsCombined, widths[8]),
      ].join(' | ')
    );
  }

  // --- Totals ----------------------------------------------------------
  const totals = {
    expected: catalog.length,
    existing: rows.filter((r) => r.liveProduct).length,
    toCreate: rows.filter((r) => r.plan && r.plan.action === 'CREATE').length,
    toUpdate: rows.filter((r) => r.plan && r.plan.action === 'UPDATE').length,
    skip: rows.filter((r) => r.plan && r.plan.action === 'SKIP').length,
    variantsPrepared: catalog.reduce((sum, s) => sum + s.variants.length, 0),
    confirmedSkus: catalog.reduce((sum, s) => sum + s.confirmedSkus.length, 0),
    exactImageMatches: catalog.filter((s) => s.exactMatchImages.length >= 1).length,
    withoutExactImage: catalog.filter((s) => s.exactMatchImages.length === 0).length,
    errors: rows.filter((r) => r.error).length,
  };

  console.log('\n=== TOTALS ===');
  console.log(`CANONICAL PRODUCTS EXPECTED: ${totals.expected}`);
  console.log(`PRODUCTS ALREADY EXISTING: ${totals.existing}`);
  console.log(`PRODUCTS TO CREATE: ${totals.toCreate}`);
  console.log(`PRODUCTS TO UPDATE: ${totals.toUpdate}`);
  console.log(`PRODUCTS ALREADY IN SYNC (SKIP): ${totals.skip}`);
  console.log(`VARIANTS PREPARED: ${totals.variantsPrepared}`);
  console.log(`CONFIRMED SKUS: ${totals.confirmedSkus}`);
  console.log(`EXACT IMAGE MATCHES: ${totals.exactImageMatches}`);
  console.log(`PRODUCTS WITHOUT EXACT IMAGE: ${totals.withoutExactImage}`);
  const assetReport = JSON.parse(
    fs.readFileSync(path.join(REPO_ROOT, 'data', 'shopify', 'asset-classification-report.json'), 'utf8')
  );
  const outOfScopeAssetCount = assetReport.assets.filter((a) => a.classification === 'OUT_OF_PERU_SCOPE').length;
  console.log(
    `OUT-OF-SCOPE PRODUCTS EXCLUDED: 1 (HOP Ultra Repair Overnight Serum — no product-grouping.csv row; ${outOfScopeAssetCount} of its asset files classified OUT_OF_PERU_SCOPE)`
  );
  console.log(`ERRORS: ${totals.errors}`);

  // --- UNDER breakdown ---------------------------------------------------
  const underRows = catalog.filter((s) => s.range === 'UNDER');
  const underColour = underRows.find((s) => s.pdpStatus === 'INFORMATIONAL');
  const underActivators = underRows.filter((s) => s.subfamily === 'Activators');
  const underMonodose = underRows.filter((s) => s.subfamily === 'Monodose');
  console.log('\n=== UNDER ===');
  console.log(`CANONICAL PDP COUNT: ${underRows.length}`);
  console.log(`CONFIRMED ACTIVATOR PRODUCTS: ${underActivators.length} (${underActivators.map((s) => s.handle).join(', ')})`);
  console.log(`CONFIRMED MONODOSE PRODUCTS: ${underMonodose.length} (${underMonodose.map((s) => s.handle).join(', ')})`);
  console.log(`57 SHADE ENTRIES: ${underColour ? underColour.shadeIdentifiers.length : 0}`);
  console.log('SHADES WITH ERP SKU CONFIRMED: 0');
  console.log(`SHADES WITHOUT ERP SKU: ${underColour ? underColour.shadeIdentifiers.length : 0}`);

  // --- HOP breakdown by subfamily -----------------------------------------
  const hopRows = catalog.filter((s) => s.range === 'HOP');
  const hopBySubfamily = {};
  for (const s of hopRows) {
    hopBySubfamily[s.subfamily] = hopBySubfamily[s.subfamily] || [];
    hopBySubfamily[s.subfamily].push(s);
  }
  const hopKeratinRows = catalog.filter((s) => s.range === 'HOP Keratin');
  console.log('\n=== HOP ===');
  for (const [subfamily, list] of Object.entries(hopBySubfamily)) {
    console.log(`${subfamily}: ${list.length} PDPs, ${list.reduce((sum, s) => sum + s.variants.length, 0)} variants (${list.map((s) => s.handle).join(', ')})`);
  }
  console.log(`Keratin: ${hopKeratinRows.length} PDPs, all COMING SOON (${hopKeratinRows.map((s) => s.handle).join(', ')})`);

  // --- LUXLIGHT breakdown --------------------------------------------------
  const luxRows = catalog.filter((s) => s.range === 'LUXLIGHT');
  console.log('\n=== LUXLIGHT ===');
  console.log(`CANONICAL PDP COUNT: ${luxRows.length}`);
  for (const s of luxRows) {
    console.log(`  ${s.handle} — ${s.confirmedSkus.join(',')} — image: ${s.exactMatchImages.length >= 1 ? 'EXACT_MATCH' : 'MISSING'}`);
  }

  console.log('\nMUTATIONS EXECUTED: 0');
}

main();
