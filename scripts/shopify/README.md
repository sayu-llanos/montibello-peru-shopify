# Montibello Shopify PDP sync

Idempotent pipeline that syncs one existing Shopify product's variants,
metafields, metaobjects, and primary image from data already confirmed in
this repo (`data/shopify/product-grouping.csv`, `source-assets/`) to the
Shopify Admin GraphQL API.

## Authentication

This app authenticates via **Client Credentials Grant** (a Shopify Dev
Dashboard custom app) — there is no static Admin API access token anywhere
in this repo or in `.env.local`. `.env.local` holds only:

```
SHOPIFY_SHOP=nar9bk-s9
SHOPIFY_CLIENT_ID=...
SHOPIFY_CLIENT_SECRET=...
```

At runtime, `lib/oauth.js` exchanges the client id/secret for an access
token via `POST https://{shop}.myshopify.com/admin/oauth/access_token`. The
token is held in a local variable for the life of the process only — it is
never written to disk and never printed or logged (`lib/oauth.js` also
redacts `access_token`/`client_secret` from any error text it constructs,
as defense in depth).

Scopes are verified via the live `currentAppInstallation { accessScopes }`
query, **not** the OAuth token response's own `scope` field — in testing,
that field came back empty for this Dev Dashboard app even after the
required scopes had been approved on the store, since this app model grants
scopes at install time through app configuration rather than negotiating
them per token request. The pipeline aborts if `write_products`,
`write_metaobjects`, or `write_files` is missing from that live query's
result.

## API version

`lib/config.js` exports the single `ADMIN_API_VERSION` constant every other
file imports — there is no second hardcoded version string anywhere in this
directory. It must match the API version the Montibello app is actually
configured for in the Partner/Dev Dashboard (currently `2026-07`, the first
version confirmed by live introspection to expose
`productUpdate(media: [CreateMediaInput!])`). Override only via
`SHOPIFY_API_VERSION` in `.env.local` for an intentional one-off test.

## Safety rails

- Refuses to run against any store domain other than
  `nar9bk-s9.myshopify.com` — checked twice: once from `SHOPIFY_SHOP`
  before the OAuth request is even made (`lib/env.js`), and again against
  the store the access token actually belongs to via a live
  `shop { myshopifyDomain }` query right after authenticating
  (`pdp-sync.js`), before any product read/mutation.
- Only ever reads/writes the ONE product named by `--pilot`.
- Never creates a new product — if the handle isn't found, it aborts.
- Never fabricates prices, inventory, barcodes, SKUs, claims, or
  ingredients. Metaobject content (features, key ingredients, routine
  steps, allied store offers) is only synced when a pilot file actually
  supplies it — an empty list is left empty, not filled with placeholder
  copy.
- Every mutation result is checked for `userErrors` via `assertNoUserErrors`
  — any non-empty error list aborts the whole run immediately.
- `--dry-run` performs real read queries (so the report reflects the actual
  store) but executes zero mutations — enforced by an explicit invariant
  check at the end of the run, not just "we didn't call apply code."
- Idempotent: variants/metafields already at the desired value are skipped,
  not re-written; metaobjects are upserted by a deterministic handle
  (`metaobjectUpsert`), so re-running never creates duplicates; images are
  deduped by matching the deterministic alt text already on the product's
  media.
- **Image attachment uses only `stagedUploadsCreate` -> upload ->
  `productUpdate`'s separate `media` argument**, called with
  `product: { id }` ONLY — never `title`/`handle`/`status`/`tags`/
  `variants`/`metafields`/`collections`. `productSet` is explicitly never
  used for this: its own live schema description states list fields
  (variants, metafields, files, collections) are fully reconciled against
  the mutation's input, deleting entries not included — using it with only
  `files` set would risk wiping a product's real variants/metafields.
  `productCreateMedia` isn't used either — it doesn't exist in this app's
  configured API version. Before ever calling `productUpdate` for an image
  in `--apply` mode, the pipeline introspects the store's own live schema
  (`checkProductUpdateMediaAvailable`) to confirm the `media` argument
  actually exists and resolves to `CreateMediaInput` — it does not assume
  this from documentation or a past API version.

## Setup

```
cp .env.local.example .env.local
# fill in SHOPIFY_SHOP, SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET for a
# Dev Dashboard custom app installed on the store with scopes
# write_products, write_metaobjects, write_files
```

## Commands

```
npm run shopify:pdp -- --pilot hop-ultra-repair-shampoo --dry-run
npm run shopify:pdp -- --pilot hop-ultra-repair-shampoo --apply
npm run shopify:asset-report   # full catalog source-assets/ classification, read-only
npm test                       # local logic tests, no network/credentials needed
```

## Adding a new pilot

Add `scripts/shopify/pilots/<handle>.js` (see
`hop-ultra-repair-shampoo.js` for the shape) and an entry in
`data/shopify/image-manifest.json`. Only include metafield/metaobject
values that are actually approved — leave a field or list out entirely
rather than inventing a placeholder.

## Known limitation

Image dedupe matches on the deterministic alt text this pipeline itself
generates (`buildAltText` in `lib/operations.js`), since Shopify's Media API
doesn't expose the originally-uploaded local filename back to the caller.
If a product's title or confirmed variant sizes change, the alt text
changes too, which would make the pipeline think the image needs
re-uploading. Acceptable for now since neither is expected to change
without an intentional catalog update.
