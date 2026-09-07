# Technical Decisions

Concise record of architecture decisions for the Montibello Perú storefront.
Full rationale and supporting research live in `docs/architecture.md`; this
file is the quick-reference log of *what was decided*.

## 1. UNDER uses a campaign-led landing experience

UNDER is one color line, so its collection page carries a heavier, editorial
template: hero/video, coverage/technology stat callouts, then the product
grid — mirroring `/gama/under/` on the international site.

## 2. HCare uses a hub-and-needs architecture

HCare is not a single-line range. It's structured as a hub page linking to
need-specific collections, mirroring the international site's
`/tratamiento/necesidad/<slug>/` pattern rather than a line page. Need pages
use a lighter template (short benefit copy + grid, no hero/video).

## 3. HCare has three first-class need collections

- `hcare-nutrition`
- `hcare-frizz-control`
- `hcare-maintenance`

Each is a real Shopify Collection with its own URL, editor-managed content,
and product grid — not a filter value inside one combined HCare collection.

## 4. Products may belong to more than one HCare need collection

A product addressing more than one need (e.g. a mask that both nourishes and
controls frizz) is assigned to multiple need collections rather than forced
into a single bucket.

## 5. The Perú architecture adapts the international taxonomy instead of copying it 1:1

The international site's own "Hidratación" need bundles nutrition and frizz
control together, with no standalone frizz category anywhere on the site.
Splitting **Nutrition** and **Frizz control** into separate Perú needs is a
deliberate local refinement, validated against the international site rather
than assumed from it. **Maintenance** does map directly to the international
"Mantenimiento de color" need.

## 6. Reuse Horizon native components whenever possible

Hero, slideshow, media-with-content, collection-list, product-list,
main-collection + filters, disclosures accordions, swatches, and marquee
cover nearly every pattern seen on the reference site. Visual translation is
primarily a configuration task through Horizon's global design tokens, not a
coding task.

## 7. Custom Liquid only when Horizon cannot support the experience

New sections are justified only where no native Horizon component fits —
currently: an Instagram/social grid, and (deferred, out of current scope) a
salon locator. Every other reference pattern should be validated as
achievable via existing sections/blocks before any custom `.liquid` is
written.
