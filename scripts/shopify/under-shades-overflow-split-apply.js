#!/usr/bin/env node
// UNDER 57-shade Liquid-cap fix.
//
// Root cause (confirmed via `shopify theme console` against the live
// store): `product.metafields.montibello.shades.value` in real Liquid
// truncates to the first 50 resolved metaobjects the moment the
// list.metaobject_reference field is dereferenced — this happens upstream
// of any `for`/`limit`/`offset` tag, so no loop-level pagination trick can
// route around it. Proof: `.value.size` reported 57 (the raw, uncapped
// reference-list length) but `.value | last` returned the shade at index
// 49 ("8.30/8GD"), not the true last shade at index 56 ("8.36/8GB").
//
// Fix: split the existing 57-reference `montibello.shades` metafield into
// two metafields, each holding <=50 references, so each one fully
// dereferences without hitting the cap:
//   - montibello.shades          -> first 50 (indices 0-49)
//   - montibello.shades_overflow -> remaining 7 (indices 50-56)
// The theme section then does
//   `shades | concat: shades_overflow`
// to rebuild the full ordered 57-item array in Liquid memory (concat
// merges two already-resolved arrays — no further reference resolution,
// so the cap does not re-apply).
//
// Usage:
//   node scripts/shopify/under-shades-overflow-split-apply.js --dry-run
//   node scripts/shopify/under-shades-overflow-split-apply.js --apply
//
// Never deletes or duplicates any montibello_under_shade metaobject — this
// only repoints which product metafield each existing GID is listed under.
// Canonical order (as originally authored) is preserved exactly.

const path = require('node:path');
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken } = require('./lib/oauth');
const { AdminClient, assertNoUserErrors } = require('./lib/admin-client');

const APPLY = process.argv.includes('--apply');
const PRODUCT_HANDLE = 'under-permanent-colour';
const SPLIT_AT = 50;

const PRODUCT_QUERY = `
  query {
    productByHandle(handle: "${PRODUCT_HANDLE}") {
      id
      mf: metafield(namespace: "montibello", key: "shades") {
        id
        type
        references(first: 100) {
          nodes {
            ... on Metaobject { id handle }
          }
        }
      }
      overflow: metafield(namespace: "montibello", key: "shades_overflow") {
        id
        value
      }
    }
  }
`;

const METAFIELDS_SET = `
  mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { id namespace key type }
      userErrors { field message code }
    }
  }
`;

async function main() {
  console.log(`\n=== UNDER shade overflow split (${APPLY ? 'apply' : 'dry-run'}) ===\n`);
  const envResult = loadShopifyEnv(REPO_ROOT);
  if (!envResult.ok) throw new Error(envResult.reason);
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

  const data = await client.request(PRODUCT_QUERY);
  const product = data.productByHandle;
  if (!product) throw new Error(`Product "${PRODUCT_HANDLE}" not found.`);
  if (!product.mf) throw new Error('montibello.shades metafield not found on this product.');

  const allGids = product.mf.references.nodes.map((n) => n.id);
  const allHandles = product.mf.references.nodes.map((n) => n.handle);
  console.log(`TOTAL CANONICAL SHADE REFERENCES: ${allGids.length}`);
  if (allGids.length <= SPLIT_AT) {
    console.log(`Total is already <= ${SPLIT_AT} — no split needed. Aborting without changes.`);
    return;
  }

  const primary = allGids.slice(0, SPLIT_AT);
  const overflow = allGids.slice(SPLIT_AT);
  console.log(`PRIMARY (montibello.shades): ${primary.length} refs (indices 0-${SPLIT_AT - 1})`);
  console.log(`OVERFLOW (montibello.shades_overflow): ${overflow.length} refs (indices ${SPLIT_AT}-${allGids.length - 1})`);
  console.log(`OVERFLOW HANDLES: ${allHandles.slice(SPLIT_AT).join(', ')}`);

  if (product.overflow && product.overflow.value) {
    const existing = JSON.parse(product.overflow.value);
    console.log(`\nEXISTING montibello.shades_overflow already has ${existing.length} refs — will be overwritten with the same canonical split (idempotent if unchanged).`);
  } else {
    console.log('\nmontibello.shades_overflow does not exist yet — will be created.');
  }

  if (!APPLY) {
    console.log('\nDry-run only — no mutation executed.');
    return;
  }

  const metafieldsInput = [
    {
      ownerId: product.id,
      namespace: 'montibello',
      key: 'shades',
      type: 'list.metaobject_reference',
      value: JSON.stringify(primary),
    },
    {
      ownerId: product.id,
      namespace: 'montibello',
      key: 'shades_overflow',
      type: 'list.metaobject_reference',
      value: JSON.stringify(overflow),
    },
  ];

  const result = await client.request(METAFIELDS_SET, { metafields: metafieldsInput });
  assertNoUserErrors('metafieldsSet', result.metafieldsSet);
  console.log('\nMETAFIELDS SET:');
  for (const m of result.metafieldsSet.metafields) {
    console.log(`  ${m.namespace}.${m.key} (${m.type})`);
  }

  // Re-query to verify.
  const verify = await client.request(PRODUCT_QUERY);
  const vPrimaryCount = verify.productByHandle.mf.references.nodes.length;
  const vOverflow = verify.productByHandle.overflow;
  console.log(`\nVERIFY: montibello.shades now has ${vPrimaryCount} references (Admin API, uncapped).`);
  console.log(`VERIFY: montibello.shades_overflow value = ${vOverflow.value}`);
  const vOverflowCount = JSON.parse(vOverflow.value).length;
  console.log(`VERIFY: montibello.shades_overflow has ${vOverflowCount} references.`);
  console.log(`\nTOTAL AFTER SPLIT: ${vPrimaryCount + vOverflowCount} (expected ${allGids.length})`);
}

main().catch((e) => {
  console.error('\nABORTED:', e.message);
  process.exitCode = 1;
});
