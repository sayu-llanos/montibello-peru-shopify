#!/usr/bin/env node
// Closure sprint Step 4: creates exactly 57 montibello_under_shade
// metaobjects from the official UNDER 2026 "Carta de Color" (visually
// transcribed from source-assets/UNDER/pdf/under-2026-catalogo.pdf, page 5 —
// verified against the total of 57 to catch transcription drift), and
// references all 57 from under-permanent-colour's montibello.shades field.
//
// display_name and swatch are intentionally blank for every shade: the
// chart gives only the numeric/code identifier per shade, never a
// descriptive name, and no authoritative machine-readable swatch color
// value exists (a color sampled from a photographed chart is not
// authoritative). erp_sku is blank for all 57 — no ERP SKU is confirmed
// for any of them. active = true for all, per instruction.
//
// Does NOT create an is_elevated_warmth field or flag — explicitly
// prohibited this round, even though 7 of these 57 are marked "NEW"
// (Elevated Warmth) on the chart.
const path = require('node:path');
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken } = require('./lib/oauth');
const { AdminClient, assertNoUserErrors } = require('./lib/admin-client');
const { PRODUCT_LOOKUP, METAOBJECT_BY_HANDLE, METAOBJECT_UPSERT, METAFIELDS_SET } = require('./lib/queries');

const APPLY = process.argv.includes('--apply');
const TYPE = 'montibello_under_shade';

const FAMILIES = {
  Naturales: ['3.0/3N', '4.0/4N', '5.0/5N', '6.0/6N', '7.0/7N', '8.0/8N', '9.0/9N', '10.0/10N'],
  Marrones: [
    '4.60/4BD', '5.60/5BD', '6.60/6BD', '7.60/7BD', '9.60/9BD', '5.63/5BG', '7.63/7BG', '10.63/10BG',
    '3.61/3BA', '5.61/5BA', '8.61/8BA', '4.62/4BP', '6.62/6BP', '7.62/7BP', '9.62/9BP',
  ],
  'Cenizas e Irisados': [
    '6.10/6AD', '7.01/7NA', '8.01/8NA', '9.01/9NA', '6.13/6AG', '8.13/8AG', '10.13/10AG',
    '6.16/6AB', '8.16/8AB', '5.23/5PG', '7.23/7PG', '8.23/8PG', '9.23/9PG', '10.23/10PG',
  ],
  'Cobrizos, Rojizos y Púrpuras': [
    '7.34/7GC', '7.43/7CG', '9.43/9CG', '6.40/6CD', '7.40/7CD', '8.40/8CD',
    '5.70/5RD', '6.70/6RD', '7.70/7RD', '5.80/5VRD', '7.80/7VRD',
  ],
  Dorados: [
    '6.30/6GD', '8.30/8GD', '7.31/7GA', '9.31/9GA', '7.32/7GP', '8.32/8GP', '9.32/9GP', '10.32/10GP', '8.36/8GB',
  ],
};

const ALL_SHADES = [];
for (const [family, codes] of Object.entries(FAMILIES)) {
  for (const code of codes) ALL_SHADES.push({ family, code });
}

function handleFor(code) {
  return 'under-shade-' + code.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function main() {
  const loaded = loadShopifyEnv(REPO_ROOT);
  if (!loaded.ok) throw new Error(loaded.reason);
  const { shop, clientId, clientSecret, apiVersion } = loaded.env;
  const { accessToken } = await fetchAccessToken({ shop, clientId, clientSecret });
  const client = new AdminClient({ storeDomain: `${shop}.myshopify.com`, accessToken, apiVersion, requiredStoreDomain: REQUIRED_STORE_DOMAIN });

  console.log(`\n=== UNDER 57 shades (${APPLY ? 'APPLY' : 'PLAN ONLY'}) ===\n`);
  console.log(`Total transcribed: ${ALL_SHADES.length}`);
  for (const [family, codes] of Object.entries(FAMILIES)) {
    console.log(`  ${family}: ${codes.length}`);
  }
  if (ALL_SHADES.length !== 57) {
    console.log('\nABORT — transcribed count is not exactly 57. STOPPING before any writes.');
    process.exit(1);
  }
  const handles = ALL_SHADES.map((s) => handleFor(s.code));
  const uniqueHandles = new Set(handles);
  if (uniqueHandles.size !== 57) {
    console.log('\nABORT — handle collision detected (not 57 unique handles). STOPPING.');
    process.exit(1);
  }

  const productData = await client.request(PRODUCT_LOOKUP, { handle: 'under-permanent-colour' });
  const product = productData.productByHandle;
  if (!product) throw new Error('under-permanent-colour not found.');
  const currentShades = product.metafields.nodes.find((m) => m.key === 'shades');
  console.log(`\nunder-permanent-colour current shades: ${currentShades ? JSON.parse(currentShades.value).length : 0}`);

  console.log('\nPre-flight: checking for existing conflicting metaobjects...');
  const conflicts = [];
  for (let i = 0; i < ALL_SHADES.length; i++) {
    const handle = handles[i];
    const data = await client.request(METAOBJECT_BY_HANDLE, { handle: { type: TYPE, handle } });
    if (data.metaobjectByHandle) conflicts.push({ handle, existing: data.metaobjectByHandle });
  }
  if (conflicts.length > 0) {
    console.log(`Found ${conflicts.length} existing shade metaobjects (will be left as-is / re-upserted idempotently):`);
    console.log(JSON.stringify(conflicts.slice(0, 3), null, 2), conflicts.length > 3 ? '...' : '');
  } else {
    console.log('No conflicts — all 57 handles are new.');
  }

  if (!APPLY) {
    console.log('\nPlan-only run. Re-run with --apply to execute.');
    return;
  }

  console.log('\n=== APPLYING: creating 57 metaobjects ===');
  const gids = [];
  for (let i = 0; i < ALL_SHADES.length; i++) {
    const { family, code } = ALL_SHADES[i];
    const handle = handles[i];
    const result = await client.request(METAOBJECT_UPSERT, {
      handle: { type: TYPE, handle },
      metaobject: {
        fields: [
          { key: 'catalog_identifier', value: code },
          { key: 'shade_family', value: family },
          { key: 'active', value: 'true' },
        ],
      },
    });
    assertNoUserErrors('metaobjectUpsert (under_shade)', result.metaobjectUpsert);
    gids.push(result.metaobjectUpsert.metaobject.id);
    if ((i + 1) % 10 === 0 || i === ALL_SHADES.length - 1) console.log(`  ${i + 1}/57 created/updated...`);
  }

  console.log('\n=== READ-BACK: verifying 57 unique metaobjects ===');
  const uniqueGids = new Set(gids);
  if (gids.length !== 57 || uniqueGids.size !== 57) throw new Error(`Expected 57 unique GIDs, got ${gids.length} total / ${uniqueGids.size} unique.`);
  console.log('57 created, 57 unique — confirmed.');

  console.log('\n=== Writing montibello.shades on under-permanent-colour ===');
  const metafieldResult = await client.request(METAFIELDS_SET, {
    metafields: [
      {
        ownerId: product.id,
        namespace: 'montibello',
        key: 'shades',
        type: 'list.metaobject_reference',
        value: JSON.stringify(gids),
      },
    ],
  });
  assertNoUserErrors('metafieldsSet (shades)', metafieldResult.metafieldsSet);

  const afterData = await client.request(PRODUCT_LOOKUP, { handle: 'under-permanent-colour' });
  const after = afterData.productByHandle;
  const afterShades = JSON.parse(after.metafields.nodes.find((m) => m.key === 'shades').value);
  console.log(`under-permanent-colour: status=${after.status} variants=${after.variants.nodes.length} media=${after.media.nodes.length} shades referenced=${afterShades.length}`);

  console.log('\n=== FINAL ===');
  console.log(JSON.stringify({
    shadesCreated: 57,
    shadesUnique: uniqueGids.size,
    shadesReferenced: afterShades.length,
    fabricatedErpSkus: 0,
  }, null, 2));
}
main().catch((e) => { console.error('ABORT:', e.message); process.exit(1); });
