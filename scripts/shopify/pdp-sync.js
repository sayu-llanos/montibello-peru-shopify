#!/usr/bin/env node
// Montibello PDP -> Shopify sync pipeline.
//
// Usage:
//   node scripts/shopify/pdp-sync.js --pilot <handle> --dry-run
//   node scripts/shopify/pdp-sync.js --pilot <handle> --apply
//
// Safety model:
// - Refuses to run against any store except nar9bk-s9.myshopify.com.
// - Authenticates via Client Credentials Grant (SHOPIFY_SHOP,
//   SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET in .env.local) — no static
//   Admin API access token is ever configured or accepted. The fetched
//   access token lives in memory for the duration of this process only:
//   it is never written to disk and never printed/logged.
// - Verifies the store the access token actually belongs to
//   (`shop { myshopifyDomain }`) matches nar9bk-s9.myshopify.com exactly,
//   not just the SHOPIFY_SHOP value we assumed when requesting the token.
// - Verifies scopes include write_products, write_metaobjects, and
//   write_files via the live `currentAppInstallation { accessScopes }`
//   query (not the OAuth token response's own `scope` field, which came
//   back empty for this Dev Dashboard app even after scopes were approved
//   on the store) before doing anything else; aborts with a clear message
//   (naming only the scope handles, never the token) if any are missing.
// - --dry-run performs real read queries (to genuinely verify store/product/
//   variant/metafield/media state) but executes ZERO mutations.
// - --apply performs the same plan, then executes only the mutations the
//   plan says are actually needed (idempotent — already-correct fields/
//   variants/images are skipped, never re-written).
// - Any GraphQL userError aborts the whole run immediately (no partial
//   silent continuation).
// - Only ever touches the ONE product named by --pilot.
// - Image attachment uses ONLY stagedUploadsCreate -> upload -> productUpdate's
//   separate `media` argument, called with `product: { id }` ONLY (never
//   title/handle/status/tags/variants/metafields/collections). productSet
//   is explicitly never used for this: its own live schema description says
//   list fields (variants, metafields, files, collections) are fully
//   reconciled against the mutation's input, deleting entries not included —
//   using it with only `files` set would risk wiping this product's real
//   variants/metafields. productUpdate's `media` argument is verified to
//   exist via live introspection (checkProductUpdateMediaAvailable) before
//   ever being called in --apply mode.

const path = require('node:path');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken, missingScopes, REQUIRED_SCOPES } = require('./lib/oauth');
const { AdminClient, ShopifyAdminError } = require('./lib/admin-client');
const { STORE_AND_SCOPES_VERIFY } = require('./lib/queries');
const ops = require('./lib/operations');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

function parseArgs(argv) {
  const args = { mode: null, pilot: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dry-run') args.mode = 'dry-run';
    else if (argv[i] === '--apply') args.mode = 'apply';
    else if (argv[i] === '--pilot') args.pilot = argv[++i];
  }
  return args;
}

function loadPilot(pilotHandle) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(path.join(__dirname, 'pilots', `${pilotHandle}.js`));
  } catch (err) {
    throw new Error(`No pilot definition found for "${pilotHandle}" in scripts/shopify/pilots/.`);
  }
}

function loadImageManifestEntry(pilotHandle) {
  const manifestPath = path.join(REPO_ROOT, 'data', 'shopify', 'image-manifest.json');
  const manifest = require(manifestPath);
  const entry = manifest[pilotHandle];
  if (!entry) {
    throw new Error(`No image-manifest.json entry for "${pilotHandle}".`);
  }
  return entry;
}

async function main() {
  const { mode, pilot: pilotHandle } = parseArgs(process.argv.slice(2));

  if (!pilotHandle) {
    console.error('Missing --pilot <handle>.');
    process.exitCode = 1;
    return;
  }
  if (mode !== 'dry-run' && mode !== 'apply') {
    console.error('Pass exactly one of --dry-run or --apply.');
    process.exitCode = 1;
    return;
  }

  let mutationsExecuted = 0;
  const skipped = [];

  console.log(`\n=== Montibello PDP sync — pilot: ${pilotHandle} (${mode}) ===\n`);

  // --- 1. Credentials + shop-domain check (before any network call) ------
  const envResult = loadShopifyEnv(REPO_ROOT);
  if (!envResult.ok) {
    console.log(`STORE VERIFIED: NO — ${envResult.reason}`);
    console.log('\nAborting before any Shopify API call. See .env.local.example.');
    console.log('\nMUTATIONS EXECUTED: 0');
    process.exitCode = 1;
    return;
  }

  let client;
  try {
    // --- 1a. OAuth: exchange client id/secret for an access token ------
    // The token and the client secret are only ever held in local
    // variables in this process's memory — never written to a file, never
    // logged, never included in any thrown error message (lib/oauth.js
    // redacts both from any error text it constructs).
    //
    // The token response's own `scope` field is NOT used to verify scopes:
    // for a Dev Dashboard app it came back empty in testing even after
    // scopes were approved on the store, since this app model grants
    // scopes at install time via app configuration rather than negotiating
    // them per token request. The authoritative check is the live
    // currentAppInstallation.accessScopes query below.
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

    // --- 1b. Verify the store the token belongs to + its real scopes ----
    const verifyData = await client.request(STORE_AND_SCOPES_VERIFY);
    const returnedDomain = verifyData.shop.myshopifyDomain;
    if (returnedDomain !== REQUIRED_STORE_DOMAIN) {
      console.log(
        `STORE VERIFIED: NO — access token belongs to "${returnedDomain}", not the only authorized store "${REQUIRED_STORE_DOMAIN}".`
      );
      console.log('\nAborting before any product read/mutation.');
      console.log('\nMUTATIONS EXECUTED: 0');
      process.exitCode = 1;
      return;
    }
    console.log(`STORE VERIFIED: YES (${returnedDomain}, API ${envResult.env.apiVersion})`);

    const grantedScopes = verifyData.currentAppInstallation.accessScopes.map((s) => s.handle);
    const missing = missingScopes(grantedScopes);
    if (missing.length > 0) {
      console.log(
        `SCOPES VERIFIED: NO — missing ${missing.join(', ')} (granted: ${grantedScopes.join(', ') || '(none)'}; required: ${REQUIRED_SCOPES.join(', ')})`
      );
      console.log('\nAborting before any product read/mutation.');
      console.log('\nMUTATIONS EXECUTED: 0');
      process.exitCode = 1;
      return;
    }
    console.log(`SCOPES VERIFIED: YES (${grantedScopes.join(', ')})`);
  } catch (err) {
    console.log(`STORE VERIFIED: NO — ${err.message}`);
    console.log('\nAborting before any product read/mutation.');
    console.log('\nMUTATIONS EXECUTED: 0');
    process.exitCode = 1;
    return;
  }

  try {
    // --- 2. Pilot + image manifest load -----------------------------------
    const pilot = loadPilot(pilotHandle);
    const imageManifestEntry = loadImageManifestEntry(pilotHandle);

    // --- 3. Product lookup ---------------------------------------------
    const product = await ops.findProduct(client, pilot.handle);
    if (!product) {
      console.log(`PRODUCT FOUND: NO — no product with handle "${pilot.handle}" exists in this store.`);
      console.log('This pipeline only updates an existing product for this pilot; it does not create one.');
      console.log('\nMUTATIONS EXECUTED: 0');
      process.exitCode = 1;
      return;
    }
    console.log(`PRODUCT FOUND: YES — ${product.title} (${product.id}), handle=${product.handle}, status=${product.status}`);

    console.log('EXISTING VARIANTS:');
    for (const v of product.variants.nodes) {
      const opts = v.selectedOptions.map((o) => `${o.name}=${o.value}`).join(', ');
      console.log(`  - ${v.id} (${opts}) sku=${v.sku || '(blank)'}`);
    }

    console.log('EXISTING METAFIELDS (namespace montibello):');
    if (product.metafields.nodes.length === 0) {
      console.log('  (none set yet)');
    }
    for (const m of product.metafields.nodes) {
      console.log(`  - montibello.${m.key} (${m.type}) = "${m.value}"`);
    }

    // --- 4. Variants -----------------------------------------------------
    const variantPlan = ops.planVariantUpdates(product, pilot.variants);
    console.log(
      `VARIANTS FOUND/PREPARED: ${pilot.variants.length} confirmed, ` +
        `${variantPlan.alreadyCorrect.length} already correct, ` +
        `${variantPlan.toUpdate.length} need SKU update, ` +
        `${variantPlan.notFoundOnProduct.length} not found on product`
    );
    for (const v of variantPlan.alreadyCorrect) {
      skipped.push(`Variant ${v.desired.optionValue}: SKU already ${v.desired.sku}`);
    }
    for (const v of variantPlan.toUpdate) {
      console.log(
        `  WOULD UPDATE: variant ${v.desired.optionValue} SKU "${v.currentSku || '(blank)'}" -> "${v.desired.sku}"`
      );
    }
    if (variantPlan.notFoundOnProduct.length > 0) {
      throw new Error(
        `Confirmed variant(s) not found on the live product: ${JSON.stringify(variantPlan.notFoundOnProduct)}`
      );
    }

    // --- 5. Metafields -----------------------------------------------------
    const metafieldPlan = ops.planMetafieldUpdates(product, pilot.metafields);
    console.log(
      `METAFIELDS PREPARED: ${metafieldPlan.toSet.length} to set, ${metafieldPlan.alreadyCorrect.length} already correct`
    );
    for (const m of metafieldPlan.alreadyCorrect) {
      skipped.push(`Metafield montibello.${m.key}: already "${m.value}"`);
    }
    for (const m of metafieldPlan.toSet) {
      console.log(
        `  WOULD UPDATE: metafield montibello.${m.key} "${m.previousValue ?? '(unset)'}" -> "${m.value}"`
      );
    }

    // --- 6. Metaobjects -----------------------------------------------------
    const metaobjectPlans = ops.planMetaobjectUpserts(pilot.handle, pilot.metaobjects);
    if (metaobjectPlans.length === 0) {
      console.log(
        'METAOBJECTS PREPARED: 0 — no approved feature/ingredient/routine/allied-store content exists yet for this product; nothing fabricated to fill the gap.'
      );
    } else {
      console.log(`METAOBJECTS PREPARED: ${metaobjectPlans.length}`);
      for (const plan of metaobjectPlans) {
        console.log(`  WOULD UPSERT: ${plan.type} (handle: ${plan.handle})`);
      }
    }

    // --- 7. Image -----------------------------------------------------
    const imagePath = imageManifestEntry.product_images[0];
    const absoluteImagePath = ops.resolveAssetPath(REPO_ROOT, imagePath);
    console.log(`IMAGE FOUND: YES`);
    console.log(`IMAGE PATH: ${imagePath}`);

    const altText = ops.buildAltText(product.title);
    const imagePlan = ops.planImageUpload(product, altText);
    if (imagePlan.alreadyUploaded) {
      console.log(`  SKIPPED: image already attached (matched by alt text "${altText}")`);
      skipped.push(`Image: already attached with alt "${altText}"`);
    } else {
      console.log(`  WOULD UPLOAD: ${imagePath} -> product media, alt: "${altText}"`);
    }

    // --- 7a. Schema check (read-only — runs in both dry-run and apply) ----
    // productSet is never used or checked here: it is explicitly prohibited
    // for image attachment (see lib/queries.js) because its list-field
    // reconciliation semantics risk deleting this product's real variants/
    // metafields. Only productUpdate's separate `media` argument is used.
    let mediaAvailability = { available: true };
    if (!imagePlan.alreadyUploaded) {
      mediaAvailability = await ops.checkProductUpdateMediaAvailable(client);
      console.log(`SCHEMA CHECK: productUpdate.media available: ${mediaAvailability.available ? 'YES' : 'NO'}`);
      if (!mediaAvailability.available) {
        console.log(`  ${mediaAvailability.reason}`);
      }
    }

    // --- 8. Apply (only in --apply mode) ---------------------------------
    if (mode === 'apply') {
      if (variantPlan.toUpdate.length > 0) {
        await ops.applyVariantUpdates(client, product.id, variantPlan.toUpdate);
        mutationsExecuted += 1;
        console.log(`UPDATED: ${variantPlan.toUpdate.length} variant SKU(s).`);
      }
      if (metafieldPlan.toSet.length > 0) {
        await ops.applyMetafieldUpdates(client, product.id, metafieldPlan.toSet);
        mutationsExecuted += 1;
        console.log(`UPDATED: ${metafieldPlan.toSet.length} metafield(s).`);
      }
      for (const plan of metaobjectPlans) {
        await ops.applyMetaobjectUpsert(client, plan);
        mutationsExecuted += 1;
        console.log(`UPSERTED: ${plan.type} (${plan.handle}).`);
      }
      if (!imagePlan.alreadyUploaded) {
        if (!mediaAvailability.available) {
          throw new Error(
            `Cannot upload image: ${mediaAvailability.reason} This pipeline refuses to guess an alternative mutation — update lib/queries.js and lib/operations.js once the correct current mutation is confirmed.`
          );
        }
        await ops.uploadAndAttachImage(client, {
          productId: product.id,
          absolutePath: absoluteImagePath,
          filename: path.basename(absoluteImagePath),
          altText,
        });
        mutationsExecuted += 1;
        console.log('UPLOADED and attached product image.');
      }
    }

    console.log(`\nSKIPPED (${skipped.length}):`);
    for (const s of skipped) console.log(`  - ${s}`);

    console.log(`\nMUTATIONS EXECUTED: ${mutationsExecuted}`);
    if (mode === 'dry-run' && mutationsExecuted !== 0) {
      throw new Error('Invariant violated: dry-run must never execute mutations.');
    }
  } catch (err) {
    console.error(`\nABORTED: ${err instanceof ShopifyAdminError ? err.message : err.message}`);
    console.log(`\nMUTATIONS EXECUTED: ${mutationsExecuted}`);
    process.exitCode = 1;
  }
}

main();
