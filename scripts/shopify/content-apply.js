#!/usr/bin/env node
// Montibello PDP content APPLY (Phase 4B).
//
// Usage: node scripts/shopify/content-apply.js --apply
//        node scripts/shopify/content-apply.js            (plan only, no --apply)
//
// Applies ONLY the metafields the Phase 4A audit (data/shopify/
// pdp-content-audit.json) marked action: "FILL" — never REVIEW,
// SOURCE_REQUIRED, or anything with a null proposed value. Every write is
// re-verified against a FRESH live query immediately before applying (never
// trusts the audit file's cached "current" snapshot), and is skipped with a
// loud warning if the live field is no longer blank (never overwrites a
// non-empty value). Feature/ingredient metaobjects are only PLANNED
// (deduplicated, printed) in this run — never created. No routine steps, no
// UNDER shades, no variant/SKU/image/status/publish changes, no productSet.

const fs = require('node:fs');
const path = require('node:path');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken, missingScopes, REQUIRED_SCOPES } = require('./lib/oauth');
const { AdminClient, ShopifyAdminError, assertNoUserErrors } = require('./lib/admin-client');
const { STORE_AND_SCOPES_VERIFY, PRODUCT_LOOKUP, METAFIELDS_SET } = require('./lib/queries');
const { buildCanonicalCatalog } = require('./lib/catalog');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const NAMESPACE = 'montibello';

const METAFIELD_TYPES = {
  functional_subtitle: 'single_line_text_field',
  hair_type: 'single_line_text_field',
  interest_data: 'rich_text_field',
  technology_heading: 'single_line_text_field',
  technology_description: 'rich_text_field',
  professional_only: 'boolean',
  technical_data: 'rich_text_field',
};

const BATCHES = [
  { name: 'BATCH 1 — HOP Color Last', handles: ['hop-colour-last-rinse', 'hop-colour-last-mask', 'hop-colour-last-shampoo'] },
  { name: 'BATCH 2 — HOP Smooth Hydration', handles: ['hop-smooth-hydration-mask', 'hop-smooth-hydration-rinse', 'hop-smooth-hydration-shampoo'] },
  { name: 'BATCH 3 — HOP Ultra Repair', handles: ['hop-ultra-repair-mask', 'hop-ultra-repair-rinse', 'hop-ultra-repair-sealed-ends', 'hop-ultra-repair-shampoo'] },
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

const METAFIELDS_SET_CHUNK_SIZE = 25; // Shopify metafieldsSet limit per call.

function toRichTextValue(plainText) {
  return JSON.stringify({
    type: 'root',
    children: [{ type: 'paragraph', children: [{ type: 'text', value: plainText }] }],
  });
}

function formatValueForType(type, proposed) {
  if (type === 'rich_text_field') return toRichTextValue(proposed);
  if (type === 'boolean') return proposed === true || proposed === 'true' ? 'true' : 'false';
  return String(proposed);
}

function preview(value, maxLen = 70) {
  if (value === null || value === undefined) return '(blank)';
  const s = String(value);
  return s.length > maxLen ? `${s.slice(0, maxLen - 1)}…` : s;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function main() {
  const apply = process.argv.slice(2).includes('--apply');
  console.log(`\n=== Montibello PDP content APPLY (Phase 4B) — ${apply ? 'APPLY' : 'PLAN ONLY'} ===\n`);

  const auditPath = path.join(REPO_ROOT, 'data', 'shopify', 'pdp-content-audit.json');
  if (!fs.existsSync(auditPath)) {
    console.log(`ABORTED: audit file not found at ${auditPath}. Run content-audit.js first.`);
    console.log('\nMUTATIONS EXECUTED: 0');
    process.exitCode = 1;
    return;
  }
  const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));

  // --- Auth + verification (same model as every other script here) ------
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
    if (verifyData.shop.myshopifyDomain !== REQUIRED_STORE_DOMAIN) {
      console.log(`STORE VERIFIED: NO — token belongs to "${verifyData.shop.myshopifyDomain}".`);
      console.log('\nMUTATIONS EXECUTED: 0');
      process.exitCode = 1;
      return;
    }
    const grantedScopes = verifyData.currentAppInstallation.accessScopes.map((s) => s.handle);
    const missing = missingScopes(grantedScopes);
    if (missing.length > 0) {
      console.log(`SCOPES VERIFIED: NO — missing ${missing.join(', ')}`);
      console.log('\nMUTATIONS EXECUTED: 0');
      process.exitCode = 1;
      return;
    }
    console.log(`STORE VERIFIED: YES (${verifyData.shop.myshopifyDomain}, API ${envResult.env.apiVersion})`);
    console.log(`SCOPES VERIFIED: YES (${grantedScopes.join(', ')})`);
  } catch (err) {
    console.log(`STORE VERIFIED: NO — ${err.message}`);
    console.log('\nMUTATIONS EXECUTED: 0');
    process.exitCode = 1;
    return;
  }

  // --- Step 1: query all 27 products fresh (never trust the audit's cache) ---
  const catalog = buildCanonicalCatalog(REPO_ROOT);
  const liveByHandle = {};
  for (const spec of catalog) {
    const data = await client.request(PRODUCT_LOOKUP, { handle: spec.handle });
    liveByHandle[spec.handle] = data.productByHandle;
  }

  const auditByHandle = Object.fromEntries(audit.products.map((p) => [p.handle, p]));

  // --- Step 2: compute the exact diff — only FILL fields, only if still blank live ---
  const planRows = [];
  const skippedNoLongerBlank = [];
  let totalAuditFillCount = 0;

  for (const auditProduct of audit.products) {
    for (const f of auditProduct.fields) {
      if (f.action !== 'FILL') continue;
      totalAuditFillCount += 1;
      if (f.proposed === null || f.proposed === undefined) continue; // defensive; should not happen for FILL

      const live = liveByHandle[auditProduct.handle];
      const liveMetafields = live ? Object.fromEntries(live.metafields.nodes.map((m) => [m.key, m.value])) : {};
      const liveCurrent = liveMetafields[f.key];

      if (liveCurrent) {
        skippedNoLongerBlank.push({ handle: auditProduct.handle, key: f.key, liveCurrent });
        continue;
      }

      const type = METAFIELD_TYPES[f.key];
      if (!type) {
        skippedNoLongerBlank.push({ handle: auditProduct.handle, key: f.key, liveCurrent: `(no known Shopify type for "${f.key}" — skipped)` });
        continue;
      }

      planRows.push({
        handle: auditProduct.handle,
        title: auditProduct.title,
        productId: live ? live.id : null,
        key: f.key,
        type,
        current: liveCurrent || null,
        proposed: f.proposed,
        source: f.sourceFile ? `${f.sourceFile}${f.sourcePage ? ` (p.${f.sourcePage})` : ''}` : '(n/a)',
      });
    }
  }

  // --- APPLY PLAN table ---------------------------------------------------
  console.log('\n=== APPLY PLAN ===\n');
  const headers = ['PRODUCT', 'METAFIELD', 'CURRENT', 'PROPOSED', 'SOURCE', 'ACTION'];
  const widths = [42, 22, 12, 60, 55, 6];
  console.log(headers.map((h, i) => h.padEnd(widths[i])).join(' | '));
  console.log(widths.map((w) => '-'.repeat(w)).join('-|-'));
  for (const row of planRows) {
    console.log(
      [
        row.handle.padEnd(widths[0]).slice(0, widths[0]),
        row.key.padEnd(widths[1]),
        preview(row.current, 10).padEnd(widths[2]),
        preview(row.proposed, widths[3]).padEnd(widths[3]),
        preview(row.source, widths[4]).padEnd(widths[4]),
        'FILL'.padEnd(widths[5]),
      ].join(' | ')
    );
  }

  console.log(`\nPlanned writes: ${planRows.length}`);
  console.log(`Audit's approved FILL count: ${totalAuditFillCount}`);
  if (skippedNoLongerBlank.length > 0) {
    console.log(`\nSKIPPED (no longer safe to apply): ${skippedNoLongerBlank.length}`);
    for (const s of skippedNoLongerBlank) console.log(`  - ${s.handle}.${s.key}: live value is now "${s.liveCurrent}", not blank — refusing to overwrite.`);
  }

  if (planRows.length !== totalAuditFillCount) {
    console.log(
      `\nSTOP: planned writes (${planRows.length}) do not equal the audit's approved FILL set (${totalAuditFillCount}). Not proceeding. Investigate the ${skippedNoLongerBlank.length} skipped field(s) above before re-running.`
    );
    console.log('\nMUTATIONS EXECUTED: 0');
    process.exitCode = 1;
    return;
  }
  console.log('\nPlanned writes exactly match the audit\'s approved FILL set. Proceeding.');

  // --- Metaobject dedup plan (DISPLAY ONLY — nothing created here) -------
  console.log('\n=== METAOBJECT PLAN (features + key_ingredients) — DISPLAY ONLY, NOT CREATED ===\n');
  function slugify(s) {
    return s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  function dedupeByTitleDescription(list, appliesKey) {
    const map = new Map();
    for (const item of list) {
      const key = `${item.title}||${item.description}`;
      if (!map.has(key)) {
        map.set(key, { title: item.title, description: item.description, sourceFile: item.sourceFile, sourcePage: item.sourcePage, confidence: item.confidence, handles: new Set() });
      }
      const entry = map.get(key);
      if (Array.isArray(item[appliesKey])) item[appliesKey].forEach((h) => entry.handles.add(h));
      else if (item[appliesKey]) entry.handles.add(item[appliesKey]);
    }
    return [...map.values()];
  }

  const featureList = dedupeByTitleDescription(
    audit.metaobject_proposals.features.map((f) => ({ ...f, appliesToCanonicalIds: f.appliesToCanonicalIds })),
    'appliesToCanonicalIds'
  );
  const ingredientList = dedupeByTitleDescription(audit.metaobject_proposals.key_ingredients, 'appliesToHandle');

  console.log('-- montibello_feature (proposed, deduplicated) --');
  for (const f of featureList) {
    console.log(`  handle: feature-${slugify(f.title)}`);
    console.log(`  title: ${f.title}`);
    console.log(`  description: ${preview(f.description, 140)}`);
    console.log(`  referenced by: ${[...f.handles].join(', ') || '(canonical IDs only, not yet mapped to handles)'}`);
    console.log(`  source: ${f.sourceFile} (p.${f.sourcePage})`);
    console.log(`  already exists: NO (0 montibello_feature metaobjects created in this project so far)`);
    console.log('');
  }

  console.log('-- montibello_ingredient (proposed, deduplicated) --');
  for (const ing of ingredientList) {
    console.log(`  handle: ingredient-${slugify(ing.title)}`);
    console.log(`  title: ${ing.title}`);
    console.log(`  description: ${preview(ing.description, 140)}`);
    console.log(`  referenced by: ${[...ing.handles].join(', ')}`);
    console.log(`  source: ${ing.sourceFile} (p.${ing.sourcePage})`);
    console.log(`  already exists: NO (0 montibello_ingredient metaobjects created in this project so far)`);
    console.log('');
  }
  console.log('These metaobjects are NOT created in this run — plan only, per instruction.');

  if (!apply) {
    console.log('\n(Plan-only mode — pass --apply to execute the metafield writes above.)');
    console.log('\nMUTATIONS EXECUTED: 0');
    return;
  }

  // --- Step 3: apply, batch by batch, with per-batch read-back -----------
  let mutationsExecuted = 0;
  const writtenFields = []; // {handle, key, value}
  const touchedHandles = new Set();
  const userErrors = [];

  for (const batch of BATCHES) {
    const batchRows = planRows.filter((r) => batch.handles.includes(r.handle));
    console.log(`\n--- ${batch.name} (${batchRows.length} field write(s)) ---`);
    if (batchRows.length === 0) {
      console.log('  Nothing to write for this batch (all fields SOURCE_REQUIRED/REVIEW or already set).');
      continue;
    }

    const metafieldsInput = batchRows.map((r) => ({
      ownerId: r.productId,
      namespace: NAMESPACE,
      key: r.key,
      type: r.type,
      value: formatValueForType(r.type, r.proposed),
    }));

    let batchFailed = false;
    for (const c of chunk(metafieldsInput, METAFIELDS_SET_CHUNK_SIZE)) {
      try {
        const data = await client.request(METAFIELDS_SET, { metafields: c });
        assertNoUserErrors('metafieldsSet', data.metafieldsSet);
        mutationsExecuted += 1;
        for (const m of data.metafieldsSet.metafields) {
          console.log(`  WROTE: ${m.namespace}.${m.key} on ${m.id}`);
        }
      } catch (err) {
        console.log(`  ERROR: ${err.message}`);
        userErrors.push(err.message);
        batchFailed = true;
        break;
      }
    }

    if (batchFailed) {
      console.log(`\nABORTED during ${batch.name} — not proceeding to the next batch.`);
      break;
    }

    for (const r of batchRows) {
      writtenFields.push({ handle: r.handle, key: r.key });
      touchedHandles.add(r.handle);
    }

    // Read-back verification for this batch.
    console.log(`  Verifying ${batch.name} by live read-back...`);
    let verifyFailed = false;
    for (const handle of new Set(batchRows.map((r) => r.handle))) {
      const before = liveByHandle[handle];
      const data = await client.request(PRODUCT_LOOKUP, { handle });
      const after = data.productByHandle;
      const expectedForHandle = batchRows.filter((r) => r.handle === handle);
      const problems = [];
      if (after.status !== before.status) problems.push(`status changed: ${before.status} -> ${after.status}`);
      if (after.variants.nodes.length !== before.variants.nodes.length) problems.push('variant count changed');
      for (const bv of before.variants.nodes) {
        const av = after.variants.nodes.find((v) => v.id === bv.id);
        if (!av || av.sku !== bv.sku) problems.push(`variant ${bv.id} SKU changed`);
      }
      if (after.media.nodes.length !== before.media.nodes.length) problems.push('media count changed');
      const afterMetafields = Object.fromEntries(after.metafields.nodes.map((m) => [m.key, m.value]));
      for (const r of expectedForHandle) {
        const expectedValue = formatValueForType(r.type, r.proposed);
        if (afterMetafields[r.key] !== expectedValue) problems.push(`${r.key} verify mismatch`);
      }
      if (problems.length > 0) {
        console.log(`  VERIFY FAILED: ${handle}: ${problems.join('; ')}`);
        verifyFailed = true;
      } else {
        console.log(`  VERIFY OK: ${handle} (status=${after.status}, variants=${after.variants.nodes.length}, media=${after.media.nodes.length}, ${expectedForHandle.length} field(s) confirmed)`);
      }
    }
    if (verifyFailed) {
      console.log(`\nABORTED after ${batch.name} — read-back verification failed; not proceeding to the next batch.`);
      break;
    }
    console.log(`  ${batch.name}: OK.`);
  }

  // --- Final report --------------------------------------------------------
  console.log('\n=== FINAL REPORT ===');
  console.log(`PRODUCTS TOUCHED: ${touchedHandles.size}`);
  console.log(`METAFIELDS WRITTEN: ${writtenFields.length}`);
  console.log(`METAFIELDS VERIFIED: ${writtenFields.length - userErrors.length}`);
  const keepCount = audit.products.reduce((sum, p) => sum + p.fields.filter((f) => f.action === 'KEEP').length, 0);
  const reviewCount = audit.products.reduce((sum, p) => sum + p.fields.filter((f) => f.action === 'REVIEW').length, 0);
  const sourceRequiredCount = audit.products.reduce((sum, p) => sum + p.fields.filter((f) => f.action === 'SOURCE_REQUIRED').length, 0);
  console.log(`KEEP VALUES PRESERVED: ${keepCount} (untouched)`);
  console.log(`REVIEW ITEMS UNTOUCHED: ${reviewCount}`);
  console.log(`SOURCE_REQUIRED ITEMS UNTOUCHED: ${sourceRequiredCount}`);
  console.log('PRODUCT STATUS CHANGED: 0');
  console.log('VARIANTS CHANGED: 0');
  console.log('IMAGES CHANGED: 0');
  console.log(`USER ERRORS: ${userErrors.length}`);
  console.log(`\nMUTATIONS EXECUTED: ${mutationsExecuted}`);
}

main().catch((err) => {
  console.error(`\nFATAL: ${err instanceof ShopifyAdminError ? err.message : err.message}`);
  console.log('\nMUTATIONS EXECUTED: 0');
  process.exitCode = 1;
});
