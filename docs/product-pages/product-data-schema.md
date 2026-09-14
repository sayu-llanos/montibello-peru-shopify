# Montibello PDP — Product Data Schema

Documentation only. No Shopify metafield or metaobject definition has been
created in Admin. Every field below is a specification for what needs to be
created there before the theme's rendered output stops being blank/hidden.

## Namespace — resolved

**Namespace: `montibello`.** A prior independent proposal in
`docs/shopify-product-architecture.md` used a `custom.*` namespace with
differently-named-but-overlapping fields; that proposal has been retired in
favor of this one (see the update note at the top of that document). Every
field below, and every field in `docs/shopify-product-architecture.md`, now
uses the same `montibello` namespace and the same field names. There is only
one naming scheme to implement in Shopify Admin.

`montibello.routine` is implemented as a direct list of
`montibello_routine_step` references (see below), one metaobject per
numbered step, rather than a reference to a separate higher-level "routine"
record — the manager's 5-metaobject list does not include one, and one
metaobject per step is simpler to author and render.

## Product metafields (namespace: `montibello`)

Every field has exactly one Shopify type — no field is "type A or type B."

| Key | Type | Required | Renders in | Fallback when blank | Used by pilot |
|---|---|---|---|---|---|
| `range` | Single line text | No | Main — eyebrow | Eyebrow row omitted if both `range` and `subfamily` are blank | All 3 |
| `subfamily` | Single line text | No | Main — eyebrow | Same as above | HOP, Luxlight |
| `functional_subtitle` | Single line text | No | Main — subtitle | Subtitle line omitted | All 3 |
| `hair_type` | Single line text | No | Main — tag | Tag omitted | HOP, Luxlight |
| `professional_only` | Boolean | No | Main — "Exclusivo Profesional" tag | Tag omitted | UNDER, Luxlight |
| `how_to_use` | Rich text | No | Details — accordion row | Row omitted | All 3 |
| `full_ingredients` | Multi-line text | No | Details — accordion row, rendered via `\| metafield_tag` (see Rendering path below) | Row omitted | All 3 |
| `interest_data` | Rich text | No | Details — accordion row ("Datos de interés") | Row omitted | All 3 |
| `technical_data` | Rich text | No | Details — accordion row ("Datos técnicos"); mixing ratios, lift information, processing guidance | Row omitted | Luxlight |
| `technology_heading` | Single line text | No | Details — always-open technology block | Block omitted if both technology fields blank | Luxlight |
| `technology_description` | Rich text | No | Details — always-open technology block | Same as above | Luxlight, HOP |
| `claim_footnote` | Single line text | No | Details — small print | Omitted | All 3 (once real % claims are approved) |
| `features` | List of `montibello_feature` references | No | Details — plain-text accordion row; Benefits — visual cards (only if ≥1 feature has an image) | Accordion row and card section both omitted if list is empty | HOP (feature/benefit cards) |
| `key_ingredients` | List of `montibello_ingredient` references | No | Ingredients section | Section omitted if list is empty | HOP |
| `routine` | List of `montibello_routine_step` references | No | Routine section | Section omitted if list is empty | HOP Ultra Repair Shampoo |
| `shades` | List of `montibello_under_shade` references | No | Shade Browser section | Section omitted if list is empty (i.e. renders on no product except the UNDER informational PDP) | UNDER |
| `allied_store_offers` | List of `montibello_allied_store_offer` references | No | Main — CTA button; Allied Stores section | CTA and section both omitted unless ≥1 offer has `active: true` **and** a `product_url` | All 3 (once retailer URLs are approved) |

Native Shopify product fields are used as-is and are **not** duplicated as
`montibello.*` metafields: `product.title`, `product.description`,
`product.featured_image` / `product.media`, `product.options_with_values`,
`product.variants`, `product.selected_or_first_available_variant.title`
(used as the "format/size" tag, e.g. "300 ml", when it isn't Shopify's
placeholder `Default Title`). Structured data for search engines reuses
Shopify's own `structured_data` filter (`{{ product | structured_data }}` in
`montibello-product-main.liquid`) rather than a hand-written JSON-LD block —
the same mechanism the stock `product-information.liquid` section uses.

## Rendering path by field type (Codex field-type fix round)

`.value` is used everywhere for blank/presence checks. For the *presentation*
output:

- **Rich text** (`how_to_use`, `interest_data`, `technology_description`,
  `technical_data`, and the metaobject fields `montibello_feature.description`
  / `montibello_ingredient.description`): rendered via `| metafield_tag` on
  the field drop itself (e.g. `{{ product.metafields.montibello.how_to_use | metafield_tag }}`,
  `{{ feature.description | metafield_tag }}`), never on `.value`. `.value`
  is used only for the blank/presence check before deciding whether to
  render the row at all.
- **Multi-line text** (`full_ingredients`): `.value` here is a *plain string*
  with literal `\n` characters, not HTML — printed directly, a browser
  collapses those into spaces and the ingredient list loses its line breaks.
  Rendered the same way, via `| metafield_tag` on the metafield object (not
  `.value`), which preserves line breaks.
- **Single line text / Boolean / Color / URL / File** fields (`range`,
  `subfamily`, `functional_subtitle`, `hair_type`, `professional_only`,
  `technology_heading`, `claim_footnote`, swatch colors, images, offer URLs,
  etc.): plain `.value` is correct as-is for these types; there is nothing
  for `metafield_tag` to add.

## Variant metafields (namespace: `montibello`)

| Key | Type | Purpose |
|---|---|---|
| `allied_store_offers` | List of `montibello_allied_store_offer` references | Optional size-specific retailer link override. When present on the selected variant (at least one entry), it replaces — not merges with — the product-level list for that variant. Used only when a HOP paired size needs a different retailer URL than its sibling size — see `allied-stores-architecture.md`. |

No other variant metafields are read by this build. Native variant fields
(`title`, `sku`, price when eventually set) are used as-is.

## Metaobject definitions

Metaobject reference fields are accessed in Liquid with direct dot notation
(`entry.field_key.value`) — Shopify does not expose a `.fields.` wrapper.
Every `montibello-*.liquid` file was audited and corrected to this pattern.

### `montibello_feature` ("PRODUCT FEATURE")

| Field | Type | Notes |
|---|---|---|
| `title` | Single line text | Bold lead-in on the accordion row; card heading on the Benefits section |
| `description` | Rich text | Required for the entry to render meaningfully; rich text so a benefit can legitimately use bold/paragraph breaks |
| `image` | File (image) | Optional. Presence of ≥1 populated `image` across the list is what makes the visual Benefits section appear at all |

### `montibello_ingredient` ("KEY INGREDIENT")

| Field | Type | Notes |
|---|---|---|
| `title` | Single line text | Card heading |
| `description` | Rich text | Card body |
| `image` | File (image) | Optional; card renders as text-only when absent |

### `montibello_routine_step` ("ROUTINE STEP")

| Field | Type | Notes |
|---|---|---|
| `step_number` | Integer | Displayed as the numbered badge |
| `label` | Single line text | Shown under the product thumbnail; falls back to the referenced product's own title when blank |
| `products` | List of product references | Each is rendered as a small linked thumbnail + label inside its step. A step with more than one product (e.g. Ultra Repair Shampoo's step 2 = Mask + Rinse) is **one** `montibello_routine_step` metaobject whose `products` list holds both — not two metaobjects sharing a step number. `montibello.routine` is simply this list of step metaobjects in display order; the renderer does not group or deduplicate by step number. |

### `montibello_retailer` ("RETAILER")

Introduced in this fix round to avoid duplicating a retailer's name/logo
across every offer it appears in (Codex P2 "retailer normalization"). A
retailer that sells five products previously would have needed its name and
logo re-entered on five separate `montibello_allied_store_offer` records;
now it's entered once and referenced five times.

| Field | Type | Notes |
|---|---|---|
| `name` | Single line text | Shown only when `logo` is blank |
| `logo` | File (image) | Preferred over `name` when both are present |
| `website` | URL | Optional; the retailer's own homepage, informational only — not used as a fallback for a missing `product_url` on an offer |

### `montibello_allied_store_offer` ("ALLIED STORE OFFER")

| Field | Type | Notes |
|---|---|---|
| `retailer` | Metaobject reference (`montibello_retailer`) | Required for the card to show a name/logo. |
| `product_url` | URL | Required — an offer with no URL never renders, regardless of `active` |
| `button_label` | Single line text | Defaults to "Ver en tienda" when blank |
| `active` | Boolean | Must be explicitly `true` to render — unlike `montibello_under_shade.active` (see below), this is opt-in, since a freshly authored offer with an unreviewed URL should not go live by accident |

**Rendering gate (applied identically in both `montibello-product-main.liquid`
and `montibello-allied-stores.liquid`):** an offer only counts as visible when
`active.value == true` **and** `product_url.value` is present. Neither
condition alone is sufficient — an earlier version of this build only checked
`active` for the CTA button's visibility, which could show a "Tiendas
aliadas" button linking to a section that then rendered nothing (an active
offer with no URL). Both files now re-derive the identical two-condition
check independently (sections cannot share computed state directly in
Liquid).

`product_url` is a real external destination approved by Montibello Peru —
this build never constructs, guesses, or search-generates a URL. See
`allied-stores-architecture.md` for full sourcing rules.

### `montibello_under_shade` ("UNDER SHADE")

| Field | Type | Notes |
|---|---|---|
| `catalog_identifier` | Single line text | e.g. `7.31/7GA` — the source catalog key, not necessarily an ERP SKU (none of the 57 confirmed UNDER shades have a confirmed ERP SKU as of this writing, per `docs/shopify-catalog-readiness.md`) |
| `shade_family` | Single line text | Groups the chart, e.g. "Naturales", "Dorados" — the five families are listed in `docs/product-catalog-audit.md` |
| `display_name` | Single line text | Optional customer-facing name; falls back to `catalog_identifier` in the swatch's `title` tooltip |
| `swatch` | Color | Optional. Only an authored value renders a colored circle — never a generated/guessed hex |
| `erp_sku` | Single line text | Left blank until Peru ERP confirms it; not read by the theme (informational-only field for the eventual commerce transition, per `docs/shopify-product-architecture.md`'s Implementation Gates) |
| `active` | Boolean | Opt-**out** — a blank/unset value is treated as active. Only an explicit `false` hides the shade. This is the inverse of `montibello_allied_store_offer.active` by design: an authored shade chart entry is assumed correct until retired, while an authored retailer link is assumed unreviewed until approved |

**Rendering at scale:** `montibello-shade-browser.liquid` reads this list in
two `limit: 50` chunks (offsets 0 and 50) for every counting/grouping/render
pass, rather than a single unbounded loop, so all up to 100 referenced
shades — comfortably above the 57 currently confirmed — are guaranteed
reachable regardless of any per-loop iteration cap. Family grouping is done
with plain `for`/`if` (a discovered-family-names accumulator plus a
per-family filter pass), not a `where:` filter, since `where:` on a nested
metaobject field path (`where: 'fields....value'`) is not a supported
pattern.

## Field-level hide-when-empty guarantee

Every section in this build independently checks its own required
metafield(s) and renders nothing — not even a heading or empty container —
when they're blank. Existence checks use a `for ... break` pattern
(`assign has_x = false / for item in list / assign has_x = true / break /
endfor`) rather than `list.size > 0`, since Codex's audit flagged `.size` as
an unsafe check specifically for metaobject/metafield reference lists (native
Shopify object arrays, like `product.options_with_values`, still use `.size`
normally — that usage is unaffected). This was verified by code review of
each section's top-of-file `{% liquid %}` gate, not by live testing, since
the dev store currently has zero products to test against (see
`pdp-implementation-notes.md`).
