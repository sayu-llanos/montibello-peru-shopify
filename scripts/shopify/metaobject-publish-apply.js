#!/usr/bin/env node
// Montibello metaobject DRAFT -> ACTIVE publisher.
//
// Usage:
//   node scripts/shopify/metaobject-publish-apply.js --dry-run
//   node scripts/shopify/metaobject-publish-apply.js --apply
//
// Context: montibello_feature / montibello_ingredient / montibello_routine_step
// / montibello_under_shade metaobject definitions already have Storefront API
// access enabled, but the individual entries were left in DRAFT publishable
// status, which is a separate, per-entry gate — a DRAFT entry never resolves
// through `product.metafields.montibello.*.value` in Liquid even when its
// definition is fully storefront-accessible. This script's only job is
// flipping that one capability field on entries already created with real,
// approved content. It changes CONTENT DATA (publishable status), never
// theme code, never field values, never products/prices/inventory/SKUs/
// variants/status, and never touches montibello_retailer or
// montibello_allied_store_offer.
//
// Safety model (same as every other script in this directory):
// - Refuses to run against any store except nar9bk-s9.myshopify.com.
// - Client Credentials Grant auth via .env.local — no static token.
// - --dry-run performs only read queries and prints the full audit table.
// - --apply publishes only entries that pass the validation gate below.
// - Every mutation is checked for userErrors; any error aborts immediately.

const path = require('node:path');
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken } = require('./lib/oauth');
const { AdminClient, assertNoUserErrors } = require('./lib/admin-client');

const APPLY = process.argv.includes('--apply');

// Only these four types are in scope. montibello_retailer and
// montibello_allied_store_offer are deliberately excluded.
const ALLOWED_TYPES = [
  { type: 'montibello_feature', requiredFields: ['title', 'description'] },
  { type: 'montibello_ingredient', requiredFields: ['title', 'description'] },
  { type: 'montibello_routine_step', requiredFields: ['step_number', 'label'] },
  { type: 'montibello_under_shade', requiredFields: ['catalog_identifier'] },
];

const SUSPICIOUS_PATTERNS = [/\btest\b/i, /\btemp\b/i, /\bexample\b/i, /\bplaceholder\b/i, /\bdummy\b/i, /\bfoo\b/i, /\blorem\b/i];

const METAOBJECTS_QUERY = `
  query MetaobjectsByType($type: String!, $cursor: String) {
    metaobjects(type: $type, first: 100, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        handle
        displayName
        capabilities {
          publishable { status }
        }
        fields { key value }
      }
    }
  }
`;

const METAOBJECT_UPDATE_PUBLISH = `
  mutation MetaobjectPublish($id: ID!) {
    metaobjectUpdate(
      id: $id
      metaobject: { capabilities: { publishable: { status: ACTIVE } } }
    ) {
      metaobject {
        id
        handle
        capabilities { publishable { status } }
      }
      userErrors { field message code }
    }
  }
`;

async function fetchAllForType(client, type) {
  let cursor = null;
  let all = [];
  while (true) {
    const data = await client.request(METAOBJECTS_QUERY, { type, cursor });
    all = all.concat(data.metaobjects.nodes);
    if (!data.metaobjects.pageInfo.hasNextPage) break;
    cursor = data.metaobjects.pageInfo.endCursor;
  }
  return all;
}

function fieldValue(entry, key) {
  const f = entry.fields.find((x) => x.key === key);
  return f ? f.value : null;
}

/** Returns { valid: bool, reason: string|null } */
function validateEntry(entry, requiredFields) {
  if (!entry.handle || entry.handle.trim() === '') {
    return { valid: false, reason: 'empty handle' };
  }
  for (const key of requiredFields) {
    const v = fieldValue(entry, key);
    if (v === null || v === undefined || v.trim() === '') {
      return { valid: false, reason: `required field "${key}" is blank` };
    }
  }
  const haystack = [entry.handle, entry.displayName, ...entry.fields.map((f) => f.value || '')].join(' ');
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(haystack)) {
      return { valid: false, reason: `matched suspicious pattern ${pattern}` };
    }
  }
  return { valid: true, reason: null };
}

async function main() {
  console.log(`\n=== Montibello metaobject publisher (${APPLY ? 'apply' : 'dry-run'}) ===\n`);

  const envResult = loadShopifyEnv(REPO_ROOT);
  if (!envResult.ok) {
    console.log(`STORE VERIFIED: NO — ${envResult.reason}`);
    process.exitCode = 1;
    return;
  }

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
  console.log(`STORE: ${envResult.env.storeDomain} (API ${envResult.env.apiVersion})`);

  const report = {};
  let totalActivated = 0;
  const allUserErrors = [];

  for (const { type, requiredFields } of ALLOWED_TYPES) {
    console.log(`\n--- ${type} ---`);
    const entries = await fetchAllForType(client, type);
    const draftBefore = entries.filter((e) => e.capabilities?.publishable?.status === 'DRAFT');
    const activeBefore = entries.filter((e) => e.capabilities?.publishable?.status === 'ACTIVE');

    console.log(`TOTAL: ${entries.length}  ACTIVE: ${activeBefore.length}  DRAFT: ${draftBefore.length}`);
    console.log('PREVIEW TABLE:');
    for (const e of entries) {
      const status = e.capabilities?.publishable?.status ?? '(no publishable capability)';
      console.log(`  ${e.id}  handle=${e.handle}  displayName="${e.displayName}"  status=${status}`);
    }

    const toActivate = [];
    const skipped = [];
    for (const e of draftBefore) {
      const { valid, reason } = validateEntry(e, requiredFields);
      if (valid) {
        toActivate.push(e);
      } else {
        skipped.push({ entry: e, reason });
        console.log(`  SKIP (invalid): ${e.handle} — ${reason}`);
      }
    }

    let activatedCount = 0;
    const activatedHandles = [];
    if (APPLY) {
      for (const e of toActivate) {
        const data = await client.request(METAOBJECT_UPDATE_PUBLISH, { id: e.id });
        assertNoUserErrors('metaobjectUpdate', data.metaobjectUpdate);
        if (data.metaobjectUpdate.userErrors && data.metaobjectUpdate.userErrors.length > 0) {
          allUserErrors.push(...data.metaobjectUpdate.userErrors.map((ue) => ({ type, handle: e.handle, ...ue })));
        } else {
          activatedCount += 1;
          activatedHandles.push(e.handle);
          console.log(`  ACTIVATED: ${e.handle}`);
        }
      }
    } else {
      console.log(`  WOULD ACTIVATE: ${toActivate.length} entr${toActivate.length === 1 ? 'y' : 'ies'}`);
    }

    totalActivated += activatedCount;

    report[type] = {
      total: entries.length,
      draftBefore: draftBefore.length,
      activeBefore: activeBefore.length,
      validDrafts: toActivate.length,
      activated: activatedCount,
      skipped: skipped.map((s) => ({ handle: s.entry.handle, reason: s.reason })),
    };
  }

  console.log('\n=== SUMMARY ===');
  for (const [type, r] of Object.entries(report)) {
    console.log(
      `${type}: total=${r.total} draftBefore=${r.draftBefore} activeBefore=${r.activeBefore} validDrafts=${r.validDrafts} activated=${r.activated} skipped=${r.skipped.length}`
    );
    for (const s of r.skipped) console.log(`  SKIPPED: ${s.handle} — ${s.reason}`);
  }

  console.log(`\nTOTAL ACTIVATED: ${totalActivated}`);
  console.log(`USER ERRORS: ${allUserErrors.length === 0 ? 'none' : JSON.stringify(allUserErrors, null, 2)}`);

  if (APPLY) {
    console.log('\n=== VERIFY (re-query) ===');
    for (const { type } of ALLOWED_TYPES) {
      const entries = await fetchAllForType(client, type);
      const stillDraft = entries.filter((e) => e.capabilities?.publishable?.status === 'DRAFT');
      const active = entries.filter((e) => e.capabilities?.publishable?.status === 'ACTIVE');
      console.log(`${type}: ACTIVE=${active.length} DRAFT=${stillDraft.length}`);
      for (const d of stillDraft) console.log(`  STILL DRAFT: ${d.handle}`);
    }
  }
}

main().catch((e) => {
  console.error('\nABORTED:', e.message);
  process.exitCode = 1;
});
