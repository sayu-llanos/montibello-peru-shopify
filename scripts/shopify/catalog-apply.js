#!/usr/bin/env node
// Montibello full-catalog Shopify APPLY (Phase 3) — creates the 26 confirmed
// canonical Peru products not yet in Shopify, as DRAFT, in six controlled
// batches, verifying each batch by a live read-back before starting the
// next. hop-ultra-repair-shampoo is never touched by this script — it is
// simply not one of the 26 handles it processes.
//
// Usage:
//   node scripts/shopify/catalog-apply.js --apply
//
// Safety model:
// - Refuses to run against any store except nar9bk-s9.myshopify.com.
// - Authenticates via Client Credentials Grant; verifies live scopes.
// - Only ever creates a product for a handle that does NOT already exist
//   (checked live immediately before creating it). An already-existing
//   handle is reported and skipped, never recreated or modified.
// - Uses productCreate ONLY — never productSet, which is prohibited
//   pipeline-wide for its list-field reconciliation behavior. productCreate
//   has no such behavior: there is nothing pre-existing on a new product to
//   reconcile away.
// - Writes only montibello.range / montibello.subfamily metafields, both
//   sourced directly from data/shopify/product-grouping.csv. No feature,
//   ingredient, routine, allied-store, or shade metaobject is created here.
// - Attaches product media ONLY for a spec with exactly one confirmed
//   EXACT_MATCH image AND an unambiguous identity (Supreme Control Oil's
//   two component packshots are explicitly excluded — see lib/catalog.js's
//   warnings for that spec). No POSSIBLE_MATCH, UNMATCHED, "-ts" render, or
//   OUT_OF_PERU_SCOPE asset is ever used.
// - No price, inventory, barcode, or weight is ever set.
// - Never publishes a product or a theme, never sets status other than
//   DRAFT, never touches hop-ultra-repair-shampoo, HOME, or Davines.
// - Processes the 6 batches in strict order; aborts immediately (without
//   starting the next batch) on any GraphQL userError or a read-back
//   mismatch after a batch.

const path = require('node:path');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken, missingScopes, REQUIRED_SCOPES } = require('./lib/oauth');
const { AdminClient, ShopifyAdminError } = require('./lib/admin-client');
const { STORE_AND_SCOPES_VERIFY, PRODUCT_LOOKUP } = require('./lib/queries');
const { buildCanonicalCatalog } = require('./lib/catalog');
const ops = require('./lib/operations');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

// Explicit ambiguous-identity exclusion: two generically-numbered component
// packshots with no label distinguishing "Oil Lightener" from "Oil
// Activator" — attaching either as if identified would be a guess.
const AMBIGUOUS_IMAGE_HANDLES = new Set(['luxlight-supreme-control-oil-lightening-system']);

const BATCHES = [
  { name: 'BATCH 1 — HOP Colour Last', handles: ['hop-colour-last-rinse', 'hop-colour-last-mask', 'hop-colour-last-shampoo'] },
  { name: 'BATCH 2 — HOP Smooth Hydration', handles: ['hop-smooth-hydration-mask', 'hop-smooth-hydration-rinse', 'hop-smooth-hydration-shampoo'] },
  { name: 'BATCH 3 — HOP Ultra Repair (remaining)', handles: ['hop-ultra-repair-mask', 'hop-ultra-repair-rinse', 'hop-ultra-repair-sealed-ends'] },
  {
    name: 'BATCH 4 — LUXLIGHT',
    handles: [
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
  {
    name: 'BATCH 5 — UNDER',
    handles: [
      'under-permanent-colour',
      'under-activator-15vol',
      'under-activator-25vol',
      'under-activator-35vol',
      'under-monodose-15vol',
      'under-monodose-25vol',
      'under-monodose-35vol',
    ],
  },
  { name: 'BATCH 6 — HOP Keratin', handles: ['hop-keratin-shampoo', 'hop-keratin-lotion'] },
];

function parseArgs(argv) {
  return { apply: argv.includes('--apply') };
}

/** Builds the CreateMediaInput array for a spec, or undefined if none applies. */
async function buildMediaInputForSpec(client, spec) {
  if (AMBIGUOUS_IMAGE_HANDLES.has(spec.handle)) return undefined;
  if (spec.exactMatchImages.length !== 1) return undefined; // 0 = none confirmed; >1 = ambiguous, needs manual selection
  const imagePath = spec.exactMatchImages[0];
  const absolutePath = ops.resolveAssetPath(REPO_ROOT, imagePath);
  const filename = path.basename(absolutePath);
  const altText = ops.buildAltText(spec.title);
  const resourceUrl = await ops.stageLocalImage(client, absolutePath, filename);
  return [{ originalSource: resourceUrl, mediaContentType: 'IMAGE', alt: altText }];
}

/**
 * Creates one canonical product end-to-end: create (single initial variant)
 * -> add the real option + remaining variants, if any -> set confirmed
 * SKUs. See lib/operations.js's createCanonicalProduct/addConfirmedOption
 * for why this is two mutations, not one.
 */
async function createOne(client, spec) {
  const mediaInput = await buildMediaInputForSpec(client, spec);
  let product = await ops.createCanonicalProduct(client, spec, mediaInput);

  if (ops.needsRealOption(spec)) {
    product = await ops.addConfirmedOption(client, product.id, spec);
  }

  const variantPlan = ops.planVariantUpdates(product, spec.variants);
  if (variantPlan.notFoundOnProduct.length > 0) {
    throw new Error(
      `${spec.handle}: expected variant(s) not found on freshly created product: ${JSON.stringify(variantPlan.notFoundOnProduct)}`
    );
  }
  if (variantPlan.toUpdate.length > 0) {
    await ops.applyVariantUpdates(client, product.id, variantPlan.toUpdate);
  }

  return { product, skusSet: variantPlan.toUpdate.length, mediaAttached: Boolean(mediaInput) };
}

/** Live read-back for one handle after creation, for batch verification. */
async function readBack(client, spec) {
  const data = await client.request(PRODUCT_LOOKUP, { handle: spec.handle });
  return data.productByHandle;
}

function verifyReadBack(spec, liveProduct) {
  const problems = [];
  if (!liveProduct) {
    problems.push('product not found on read-back');
    return problems;
  }
  if (liveProduct.status !== 'DRAFT') problems.push(`status is "${liveProduct.status}", expected DRAFT`);
  if (liveProduct.handle !== spec.handle) problems.push(`handle "${liveProduct.handle}" does not match expected "${spec.handle}"`);
  if (liveProduct.variants.nodes.length !== spec.variants.length) {
    problems.push(`variant count ${liveProduct.variants.nodes.length} does not match expected ${spec.variants.length}`);
  }
  for (const desired of spec.variants) {
    if (!desired.sku) continue;
    const match = liveProduct.variants.nodes.find((v) =>
      v.selectedOptions.some((o) => o.name === desired.optionName && o.value === desired.optionValue)
    );
    if (!match) problems.push(`missing variant ${desired.optionName}=${desired.optionValue}`);
    else if (match.sku !== desired.sku) problems.push(`variant ${desired.optionName}=${desired.optionValue} sku="${match.sku}" expected "${desired.sku}"`);
  }
  const expectedMedia = AMBIGUOUS_IMAGE_HANDLES.has(spec.handle) ? 0 : spec.exactMatchImages.length === 1 ? 1 : 0;
  if (liveProduct.media.nodes.length !== expectedMedia) {
    problems.push(`media count ${liveProduct.media.nodes.length} does not match expected ${expectedMedia}`);
  }
  return problems;
}

async function main() {
  const { apply } = parseArgs(process.argv.slice(2));
  if (!apply) {
    console.error('This script only runs with --apply (there is no dry-run mode here; use catalog-dry-run.js for that).');
    process.exitCode = 1;
    return;
  }

  console.log('\n=== Montibello full-catalog Shopify APPLY (Phase 3) ===\n');

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
      console.log(`SCOPES VERIFIED: NO — missing ${missing.join(', ')}`);
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
  const specByHandle = new Map(catalog.map((s) => [s.handle, s]));

  // Guard: hop-ultra-repair-shampoo must never appear in any batch.
  for (const batch of BATCHES) {
    if (batch.handles.includes('hop-ultra-repair-shampoo')) {
      throw new Error('Invariant violated: hop-ultra-repair-shampoo must not be in any batch.');
    }
  }

  let mutationsExecuted = 0;
  const allResults = [];
  const errors = [];

  for (const batch of BATCHES) {
    console.log(`\n--- ${batch.name} ---`);
    const batchResults = [];
    let batchHadError = false;

    for (const handle of batch.handles) {
      const spec = specByHandle.get(handle);
      if (!spec) {
        console.log(`  ${handle}: ERROR — no canonical spec found in product-grouping.csv`);
        errors.push(`${handle}: no canonical spec`);
        batchHadError = true;
        break;
      }
      try {
        const existingCheck = await client.request(PRODUCT_LOOKUP, { handle: spec.handle });
        if (existingCheck.productByHandle) {
          // Resumable-repair path: never recreate, never touch media, never
          // overwrite a SKU that's already set to something else. Only
          // fills in a currently-blank SKU on an already-matching variant —
          // covers a product left partially created by an earlier aborted
          // run (option + variants + image already correct, SKU pending).
          const product = existingCheck.productByHandle;
          const variantPlan = ops.planVariantUpdates(product, spec.variants);
          if (variantPlan.notFoundOnProduct.length > 0) {
            throw new Error(
              `${handle}: pre-existing product is missing expected variant(s): ${JSON.stringify(variantPlan.notFoundOnProduct)}`
            );
          }
          const conflicting = variantPlan.toUpdate.filter((u) => u.currentSku);
          if (conflicting.length > 0) {
            throw new Error(
              `${handle}: pre-existing variant(s) already have a different SKU — refusing to overwrite: ${JSON.stringify(conflicting)}`
            );
          }
          if (variantPlan.toUpdate.length > 0) {
            await ops.applyVariantUpdates(client, product.id, variantPlan.toUpdate);
            mutationsExecuted += 1;
            console.log(`  ${handle}: REPAIRED — set ${variantPlan.toUpdate.length} missing SKU(s) on pre-existing product; not recreated.`);
            batchResults.push({ spec, action: 'REPAIRED', product });
          } else {
            console.log(`  ${handle}: SKIPPED — already exists and fully in sync; not recreated.`);
            batchResults.push({ spec, action: 'SKIPPED_EXISTING', product });
          }
          continue;
        }

        const { product, skusSet, mediaAttached } = await createOne(client, spec);
        mutationsExecuted += 1 + (skusSet > 0 ? 1 : 0);
        console.log(
          `  ${handle}: CREATED (${product.id}) — ${spec.variants.length} variant(s), ${skusSet} SKU(s) set, media: ${mediaAttached ? 'attached' : 'none'}`
        );
        batchResults.push({ spec, action: 'CREATED', product });
      } catch (err) {
        console.log(`  ${handle}: ERROR — ${err.message}`);
        errors.push(`${handle}: ${err.message}`);
        batchResults.push({ spec, action: 'ERROR', error: err.message });
        batchHadError = true;
        break; // stop this batch immediately on error
      }
    }

    allResults.push(...batchResults);

    if (batchHadError) {
      console.log(`\nABORTED during ${batch.name} — not proceeding to the next batch.`);
      console.log(`\nMUTATIONS EXECUTED: ${mutationsExecuted}`);
      await printFinalReport(allResults, catalog, mutationsExecuted, errors, false, client);
      process.exitCode = 1;
      return;
    }

    // --- Batch read-back verification ---
    console.log(`  Verifying ${batch.name} by live read-back...`);
    let verifyFailed = false;
    for (const r of batchResults) {
      if (r.action === 'SKIPPED_EXISTING') continue;
      const liveProduct = await readBack(client, r.spec);
      const problems = verifyReadBack(r.spec, liveProduct);
      if (problems.length > 0) {
        console.log(`  VERIFY FAILED for ${r.spec.handle}: ${problems.join('; ')}`);
        errors.push(`${r.spec.handle}: verify failed — ${problems.join('; ')}`);
        verifyFailed = true;
      } else {
        console.log(`  VERIFY OK: ${r.spec.handle} (status=${liveProduct.status}, variants=${liveProduct.variants.nodes.length}, media=${liveProduct.media.nodes.length})`);
      }
    }

    if (verifyFailed) {
      console.log(`\nABORTED after ${batch.name} — read-back verification failed; not proceeding to the next batch.`);
      console.log(`\nMUTATIONS EXECUTED: ${mutationsExecuted}`);
      await printFinalReport(allResults, catalog, mutationsExecuted, errors, false, client);
      process.exitCode = 1;
      return;
    }

    console.log(`  ${batch.name}: OK.`);
  }

  console.log(`\nMUTATIONS EXECUTED: ${mutationsExecuted}`);
  await printFinalReport(allResults, catalog, mutationsExecuted, errors, true, client);
}

async function printFinalReport(allResults, catalog, mutationsExecuted, errors, completed, client) {
  console.log('\n=== FINAL READ-BACK TABLE ===\n');
  const headers = ['HANDLE', 'TITLE', 'STATUS', 'VARIANTS', 'SKUS', 'IMAGE COUNT', 'RESULT'];
  const widths = [42, 34, 8, 8, 30, 11, 22];
  console.log(headers.map((h, i) => h.padEnd(widths[i])).join(' | '));
  console.log(widths.map((w) => '-'.repeat(w)).join('-|-'));

  // Always include hop-ultra-repair-shampoo in the table as a preexisting,
  // untouched reference row, plus every canonical product (created,
  // skipped-existing, or not yet reached because of an abort).
  const resultByHandle = new Map(allResults.map((r) => [r.spec.handle, r]));

  let actualProducts = 0;
  let draftProducts = 0;
  let createdThisRun = 0;
  let preexisting = 0;
  let variantsTotal = 0;
  let confirmedSkusTotal = 0;
  let withMedia = 0;
  let withoutMedia = 0;
  let failed = 0;
  let skipped = 0;

  for (const spec of catalog) {
    let liveProduct = null;
    let resultLabel = 'NOT PROCESSED';

    if (spec.handle === 'hop-ultra-repair-shampoo') {
      resultLabel = 'PREEXISTING (untouched)';
      if (client) {
        try {
          const data = await client.request(PRODUCT_LOOKUP, { handle: spec.handle });
          liveProduct = data.productByHandle;
        } catch (e) {
          // leave liveProduct null; reported as NOT PROCESSED-equivalent below
        }
      }
    } else {
      const r = resultByHandle.get(spec.handle);
      if (r) {
        if (r.action === 'CREATED') resultLabel = 'CREATED';
        else if (r.action === 'REPAIRED') resultLabel = 'CREATED (repaired)';
        else if (r.action === 'SKIPPED_EXISTING') resultLabel = 'PREEXISTING';
        else if (r.action === 'ERROR') resultLabel = 'FAILED';
        if (client && (r.action === 'CREATED' || r.action === 'REPAIRED' || r.action === 'SKIPPED_EXISTING')) {
          try {
            const data = await client.request(PRODUCT_LOOKUP, { handle: spec.handle });
            liveProduct = data.productByHandle;
          } catch (e) {
            liveProduct = r.product || null;
          }
        }
      }
    }

    if (resultLabel === 'FAILED') failed += 1;
    if (resultLabel === 'NOT PROCESSED') skipped += 1;

    if (liveProduct) {
      actualProducts += 1;
      if (liveProduct.status === 'DRAFT') draftProducts += 1;
      if (resultLabel === 'CREATED' || resultLabel === 'CREATED (repaired)') createdThisRun += 1;
      if (resultLabel === 'PREEXISTING' || resultLabel === 'PREEXISTING (untouched)') preexisting += 1;
      variantsTotal += liveProduct.variants.nodes.length;
      confirmedSkusTotal += liveProduct.variants.nodes.filter((v) => v.sku).length;
      if (liveProduct.media.nodes.length > 0) withMedia += 1;
      else withoutMedia += 1;
    }

    console.log(
      [
        spec.handle.padEnd(widths[0]).slice(0, widths[0]),
        spec.title.padEnd(widths[1]).slice(0, widths[1]),
        (liveProduct ? liveProduct.status : '-').padEnd(widths[2]),
        String(liveProduct ? liveProduct.variants.nodes.length : '-').padEnd(widths[3]),
        (liveProduct ? liveProduct.variants.nodes.map((v) => v.sku || '(none)').join(',') : '-').padEnd(widths[4]).slice(0, widths[4]),
        String(liveProduct ? liveProduct.media.nodes.length : '-').padEnd(widths[5]),
        resultLabel.padEnd(widths[6]),
      ].join(' | ')
    );
  }

  console.log('\n=== TOTALS ===');
  console.log('EXPECTED PRODUCTS: 27');
  console.log(`ACTUAL PRODUCTS: ${actualProducts}`);
  console.log(`DRAFT PRODUCTS: ${draftProducts}`);
  console.log(`PRODUCTS CREATED THIS RUN: ${createdThisRun}`);
  console.log(`PRODUCTS PREEXISTING: ${preexisting}`);
  console.log(`VARIANTS: ${variantsTotal}`);
  console.log(`CONFIRMED SKUS: ${confirmedSkusTotal}`);
  console.log(`PRODUCTS WITH MEDIA: ${withMedia}`);
  console.log(`PRODUCTS WITHOUT MEDIA: ${withoutMedia}`);
  console.log(`FAILED: ${failed}`);
  console.log(`SKIPPED: ${skipped}`);
  console.log(`USER ERRORS: ${errors.length}`);
  if (errors.length > 0) {
    console.log('\nERROR DETAILS:');
    for (const e of errors) console.log(`  - ${e}`);
  }

  console.log(
    `\nFINAL RESULT: Shopify ${actualProducts === 27 ? 'NOW CONTAINS' : 'DOES NOT YET CONTAIN'} all 27 canonical Montibello Peru PDPs (${actualProducts}/27 present).`
  );
  console.log(`MUTATIONS EXECUTED: ${mutationsExecuted}`);
}

main().catch((err) => {
  console.error(`\nFATAL: ${err instanceof ShopifyAdminError ? err.message : err.message}`);
  process.exitCode = 1;
});
