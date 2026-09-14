# Montibello PDP — Implementation Notes

## What was built

`templates/product.montibello.json`, an alternate product template
(assignable per-product in Admin, or previewable on any existing product via
`?view=montibello`), plus 7 new sections and 2 snippets:

- `sections/montibello-product-main.liquid` — eyebrow, title, functional
  subtitle, professional-only/hair-type/format tags, description, an
  informational size selector (single-option products only — see Known
  Limitations), the Tiendas Aliadas CTA, the real Shopify media gallery
  (reused, not rebuilt), and the product's structured data (JSON-LD).
- `sections/montibello-product-details.liquid` — technology block (always
  open) + up to 5 collapsible accordion rows (characteristics, how-to-use,
  ingredients, datos de interés, datos técnicos) + claim footnote.
- `sections/montibello-product-ingredients.liquid` — "Ingredientes
  principales" visual card grid.
- `sections/montibello-product-benefits.liquid` — visual features/benefits
  cards (only renders if at least one feature has an image; otherwise the
  same content already surfaced as plain text in the accordion is enough).
- `sections/montibello-product-routine.liquid` — numbered routine steps. One
  `montibello_routine_step` metaobject per step, each with its own
  `products` list, so a step with more than one product needs no grouping
  logic in the renderer.
- `sections/montibello-allied-stores.liquid` — the Tiendas Aliadas offer
  grid.
- `sections/montibello-shade-browser.liquid` — the UNDER colour-chart
  browser, grouped by shade family.
- `snippets/montibello-pdp-accordion-item.liquid` — the shared accordion row
  markup (native `<details>/<summary>`) used by
  `montibello-product-details.liquid`.
- `snippets/montibello-pdp-shade-chip.liquid` — the shared swatch-chip
  markup used by `montibello-shade-browser.liquid`'s two pagination passes.

Every section independently checks its own required metafield(s) and
renders nothing — not even a heading or empty container — when they're
blank; the one exception is `section_contact_cta` in the JSON template,
which is a native Horizon `group`/`text`/`button` block instance (the same
dual-CTA band already approved on the UNDER range page) and always renders,
since its copy and routing are theme-authored, not metafield-driven. This
was verified by code review of each custom section's opening `{% liquid %}`
gate, not by live rendering (see Blockers below).

## Codex fix round (this pass)

An independent read-only audit (Codex) found real implementation defects in
the first draft, fixed here without changing the overall architecture:

- **Metaobject field access.** Every consumer used `entry.fields.key.value`,
  which is not valid Liquid — Shopify exposes metaobject reference fields
  directly (`entry.key.value`). Fixed across all 7 sections; grepped
  afterward to confirm no `.fields.` access remains in executable code
  (a few explanatory code comments mention the old pattern by name on
  purpose, to document what was wrong).
- **Reference list existence/filtering.** `list.size > 0` was replaced with
  a `for item in list / assign has_x = true / break` pattern for every
  metaobject/metafield reference list (native Shopify arrays like
  `product.options_with_values` still use `.size` normally — only reference
  lists were in scope). Nested `where: 'fields....value'` filters were
  replaced with plain `for`/`if` loops.
- **Tiendas Aliadas visibility gate.** Both `montibello-product-main.liquid`
  (the CTA button) and `montibello-allied-stores.liquid` (the section
  itself) now require **both** `active == true` **and** a non-blank
  `product_url` before counting an offer as visible — an earlier draft only
  checked `active` in one of the two places, which could show a CTA linking
  to a section that then rendered nothing. See `allied-stores-architecture.md`.
- **UNDER 57-shade pagination.** `montibello-shade-browser.liquid` now reads
  the `shades` list in two `limit: 50` chunks (offsets 0 and 50) for every
  counting, family-grouping, and rendering pass, guaranteeing all up to 100
  referenced shades are reachable regardless of any per-loop iteration cap.
- **Accessible accordions.** `montibello-pdp-accordion-item.liquid` was
  rewritten from a hidden-checkbox/label pattern to native
  `<details>/<summary>` — keyboard-operable, semantically exposes
  expanded/collapsed state, no `display:none` control dependency, same
  visual styling, closed by default.
- **Exact field types.** Every metafield/metaobject field now has one exact
  Shopify type (no more "Multi-line text or rich text"). See
  `product-data-schema.md`.
- **Namespace.** `montibello` is now the single, resolved namespace across
  this build and `docs/shopify-product-architecture.md` — the earlier
  `custom.*` proposal in that document has been retired.
- **Luxlight technical data.** Added `montibello.technical_data` (Rich
  text), rendered as its own accordion row ("Datos técnicos"), separate from
  `interest_data`.
- **Product JSON-LD.** `montibello-product-main.liquid` now emits
  `{{ product | structured_data }}`, the same built-in filter the stock
  `product-information.liquid` section uses — no duplicate JSON-LD anywhere
  else in the template.
- **Media gallery context.** The `_product-media-gallery` block is now
  called with `closest.product: product` explicitly, matching the stock
  `product-information-content.liquid` snippet's own pattern — the gallery's
  renderer reads `closest.product` directly and shows an empty state if it's
  blank, so it cannot be left to ambient inheritance.
- **Variant selector safety.** The custom size selector is now explicitly
  restricted to products with exactly one option
  (`product.options_with_values.size == 1`); it no longer renders at all for
  a hypothetical future multi-option product, where it would be
  combination-unsafe. See Known Limitations.
- **Dead settings.** `montibello-product-ingredients.liquid`,
  `montibello-shade-browser.liquid`, and `montibello-allied-stores.liquid`
  declared a `background_color` template setting that the section schemas
  didn't expose or use. Implemented properly (schema `color` setting +
  Horizon's own `contrast-override` snippet + `section-background`/
  `color-custom-{{ section.id }}` pattern, matching e.g.
  `sections/collection-links.liquid`) rather than removed, since the JSON
  template's alternating backgrounds were an intentional visual-rhythm
  choice.
- **Bottom CTA parity.** The template's closing CTA now uses the exact
  dual-CTA band already approved and live on the UNDER range page
  ("¿Tienes un salón...? → Contacta con un comercial" /
  "Localiza tu salón... → Encuentra", both routing to `/pages/contacto`) —
  not the different single "Contactar" CTA the first draft had invented.
- **Retailer normalization.** Added a `montibello_retailer` metaobject
  (name/logo/website) referenced by `montibello_allied_store_offer`, instead
  of duplicating a retailer's name/logo on every offer record. See
  `product-data-schema.md` and `allied-stores-architecture.md`.
- **Routine model simplified.** `montibello.routine` is now one
  `montibello_routine_step` metaobject per numbered step (with a `products`
  list on it), not two metaobjects sharing a step number grouped at render
  time — removes a `where`-filter grouping pass entirely.

## Why no native buy-buttons / price / variant-picker

Covered in full in `allied-stores-architecture.md`. Short version: no
approved prices exist yet, and Peru's actual purchase path is external
allied retailers, not Shopify checkout — showing native price/cart UI with
no price would be a fake-availability problem, not a cosmetic one.

## Why the size selector is a plain link, not a JS component

`?variant={id}` is a real, server-rendered Shopify URL pattern — Shopify
auto-selects the variant named in the query string on page load, with zero
custom JavaScript. It is deliberately restricted to products with exactly
one option (see Known Limitations for why) — a JS-driven combination-aware
picker would need to be built and tested against real cart/AJAX endpoints
for a case no current pilot product needs.

## Known limitations

- **The custom size selector only supports single-option products.** It
  resolves "the variant whose value at this option's position matches,"
  which is only correct when there's exactly one option — with two or more
  options (e.g. Size + Shade), it could silently pick the wrong combination.
  `montibello-product-main.liquid` now hides the selector entirely unless
  `product.options_with_values.size == 1`. A future product needing two or
  more real options should not use this selector at all — embed Shopify's
  native `_variant-picker` block instead, which resolves full combinations
  correctly.
- **`features` list serves two roles.** The same `montibello.features`
  metaobject list is read as plain text by the "Ver características"
  accordion and as visual cards by the Benefits section — one authored list,
  two presentations, rather than two separate metafields. If a future brief
  wants genuinely different content in the accordion vs. the cards, this
  will need to split into two metafields.
- **No product recommendations / cross-sell module** was added beyond the
  routine section, since the manager's brief didn't ask for one and adding
  Shopify's native `product-recommendations` section back in would need
  real published products to recommend — trivial to add to the template's
  `order` array later if wanted.

## QA performed

- **Theme Check**: 0 errors, 17 warnings — all 17 are pre-existing and in
  files this task never touched (`sections/header.liquid`,
  `snippets/divider.liquid`, `snippets/mega-menu-list.liquid`,
  `snippets/util-mega-menu-img-sizes-attr.liquid`). Verified by diffing the
  warning file list against this task's changed-files list, both before and
  after the Codex fix round.
- **Whitespace check on untracked files**: since these files are new and
  untracked, a plain `git diff --check` shows nothing for them (there is no
  tracked baseline to diff against) — running it without accounting for
  that would have been a false-positive "clean" result. The correct check
  was run as `git add --intent-to-add <files>` (registers the paths without
  staging content) followed by `git diff --check`, then `git reset` to
  return them to untracked — exit 0, no whitespace errors, nothing left
  staged or committed.
- **grep audit for the specific patterns Codex flagged**: `.fields.` and
  `where: 'fields.` — zero remaining occurrences in executable Liquid across
  all `montibello-*.liquid` files (a handful of code comments name the old
  pattern on purpose, to document what was wrong; those don't execute).
- **Liquid syntax correctness**: confirmed by Theme Check (0 errors) plus
  manual re-reading of every changed file. This confirms the code parses and
  the fields referenced exist under the documented schema — it does **not**
  confirm real-data rendering correctness, since there is no live product to
  render against (see Blockers below).

## Blockers for a real live pilot

1. **Zero products exist in this dev store.** `curl
   http://127.0.0.1:9292/products.json` returns an empty list. This build's
   correctness could only be verified by static code review and Theme
   Check, not by loading a rendered page — this is the single biggest gap
   between "the code should be right" and "the code is confirmed right."
   The very next action after review should be creating the 3 draft pilot
   products (UNDER Permanent Colour, HOP Ultra Repair Shampoo, Luxlight
   Supreme Lightener 9+) so this template can actually be loaded once.
2. **No metafield or metaobject definitions exist in Shopify Admin yet.**
   Every `product.metafields.montibello.*` reference in this build resolves
   to `nil` until each definition in `product-data-schema.md` is created —
   at that point every section on every product will render as if it has no
   content at all (correctly hidden, but also correctly empty).
3. **No approved copy, images, or retailer URLs exist to populate the
   metaobjects** — same gate already documented in
   `docs/shopify-catalog-readiness.md` and `docs/shopify-product-architecture.md`'s
   Implementation Gates, unchanged by this task.
4. Once (1) and (2) are done, a real visual QA pass (the kind performed for
   the homepage and UNDER range page in earlier rounds — live screenshots at
   1440/1280/1024/768/390/375, arrow/accordion interaction checks, HOME and
   UNDER-range regression) should be run against the 3 pilot products before
   this template is considered launch-ready.
