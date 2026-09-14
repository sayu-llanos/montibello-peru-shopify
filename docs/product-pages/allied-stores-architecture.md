# Tiendas Aliadas — Architecture

## Why this exists instead of Shopify checkout

Peru has no approved prices, inventory, barcodes, or publication rules yet
(`docs/shopify-catalog-readiness.md` lists these as open blockers for all 92
catalog rows). Management's requirement is that "Allied stores will
eventually be ecommerce partners selling each product" — i.e., for now and
possibly permanently, the actual purchase path is an external retailer, not
Shopify's own cart. Showing Shopify's native `buy-buttons`/`price` blocks
with no real price would render a fake `$0.00`/blank-price storefront, which
the task's data-safety rules explicitly prohibit ("no fake ecommerce
availability"). Tiendas Aliadas is therefore the PDP's actual conversion
path today, not a secondary module.

## Data source

Entirely `product.metafields.montibello.allied_store_offers` (and, for a
size-specific override, `variant.metafields.montibello.allied_store_offers`)
— a list of `montibello_allied_store_offer` metaobject references, each of
which references a reusable `montibello_retailer` metaobject for the
retailer's name/logo. **No retailer name, logo, or URL is hardcoded anywhere
in the Liquid.** This was verified by grep: neither
`montibello-allied-stores.liquid` nor `montibello-product-main.liquid`
contains a literal retailer string.

`montibello_retailer` was introduced as a separate metaobject (rather than
`retailer_name`/`retailer_logo` fields directly on the offer, as in this
build's first draft) so a retailer selling several products is entered once
in Admin and referenced from each offer, instead of having its name/logo
retyped on every offer record. See `product-data-schema.md` for the exact
field list.

## Rendering rule

1. Read `product.metafields.montibello.allied_store_offers`.
2. If the current variant has its own `allied_store_offers` list with at
   least one entry (checked with a `for ... break` existence loop, not
   `.size`), that list **replaces** the product-level list entirely for the
   currently selected variant (it does not merge). This is for the
   documented HOP case: "HOP paired-size PDPs may use a variant-level
   override when the retailer provides a distinct URL for each size."
3. An offer only counts as visible when **both** of these are true:
   - `offer.active.value == true`
   - `offer.product_url.value` is present
   Both conditions are required — checking only `active` was an early-draft
   bug in this build: it let an active-but-URL-less offer make the main
   hero's CTA appear, then link to a section that rendered nothing. Both
   `montibello-product-main.liquid` and `montibello-allied-stores.liquid`
   now independently re-run this identical two-condition check (Liquid
   sections cannot share computed state directly, so the check is
   duplicated deliberately rather than factored out). Filtering uses a plain
   `for`/`if` loop, not a `where: 'fields....value'` filter — that nested
   path pattern is not supported for metaobject reference lists.
4. If zero offers satisfy both conditions:
   - The main hero's "Tiendas aliadas" CTA button is hidden.
   - The Allied Stores section itself renders nothing, including its anchor
     id (`#montibello-allied-stores-{{ product.id }}`), so the CTA can never
     be shown pointing at a target that doesn't exist.

External destination URLs are HTML-escaped on output (`offer.product_url.value
| escape`) before being placed in an `href` attribute.

## Variant-specific URLs — how they would work

`docs/shopify-product-architecture.md` anticipated this exact need:
"Keep size- or SKU-specific Tiendas Aliadas links in `allied_store_offer`,
with an optional variant reference, rather than embedding retailer-specific
columns on each variant." This build implements that by putting the
override list directly on the **variant's own** `allied_store_offers`
metafield (simpler to author in Admin — no separate "which variant does
this apply to" reference field needed on the metaobject itself) rather than
a variant-reference field on a shared metaobject. Concretely: a HOP Shampoo
product with 300 ml and 1000 ml variants can have a product-level offer
(shown for both sizes by default) and, only for the 1000 ml variant, its own
`allied_store_offers` value pointing to a retailer that only carries the
larger size — switching the size selector on the PDP changes which offers
render, with no page reload needed beyond the existing `?variant={id}` link
navigation.

## Explicitly out of scope for this build

- No search-generated or guessed retailer URLs.
- No "out of stock" or availability state — an offer either renders (it's a
  real, approved, active link with a URL) or it doesn't exist on the page.
- No fake retailer roster for the 3 pilot product types — until real
  `montibello_retailer` and `montibello_allied_store_offer` records are
  authored in Admin, Tiendas Aliadas renders nothing anywhere, which is the
  correct behavior per the data-safety rules, not a bug to fix later.
