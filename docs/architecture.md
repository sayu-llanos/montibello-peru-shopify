# Montibello Perú — Storefront Architecture

Status: **analysis only** — no theme code has been modified. This document is the
proposed architecture for translating hair.montibello.com's premium/editorial
visual language into this Horizon (Online Store 2.0) theme, scoped to Perú's two
product families: **UNDER** (color) and **HCare** (haircare).

## 1. Current state

The repo is a stock Horizon theme pull (commit `ed8f7bb`) with no customization
yet — `templates/index.json` still has Horizon's default "Browse our latest
products" hero + product-list. Spanish locale files (`locales/es.json`,
`es.schema.json`) are already present, so the storefront is ready for
Spanish-first content without translation setup work.

Horizon is Shopify's newest Online Store 2.0 theme: every section is built from
composable **blocks** (`blocks/*.liquid`, prefixed `_` when static/internal),
styled through **global design tokens** in `config/settings_schema.json`
(color palette, typography roles, buttons, swatches, badges, cart, popovers).
This token system — not per-section CSS overrides — is how we should express
Montibello's brand, so most of the visual translation is a *configuration* task,
not a coding task.

## 2. Reference site — structure & visual system

Findings from hair.montibello.com (international site; Perú scope is a subset):

- **Nav**: mega-menu with image-backed dropdowns per range (Color, Tratamiento,
  Styling, Forma). Perú only needs two entries — **UNDER** and **HCare** — so the
  mega-menu can be much simpler, but the "featured range imagery in the dropdown"
  pattern is worth keeping.
- **Homepage**: hero carousel of campaign slides → editorial "explore our ranges"
  grid → best-sellers product grid → magazine/article teasers → Instagram social
  grid → salon locator / contact CTA.
- **Range landing page** (e.g. `/gama/under/`): hero with video → stat callouts
  (100% grey coverage, 95% fill) → technology/editorial blocks → product grid
  (colorant + activator variants) → lifestyle imagery.
- **Product page**: image gallery/carousel → title, format, price → accordions
  (Características, Ingredientes, Cómo usar) → callout stats → color-chart PDF
  link → salon locator CTA.
- **Visual language**: generous whitespace, large photography, restrained
  sans-serif type, mostly-white background with dark text, muted brand accents,
  editorial pacing rather than aggressive promo design. Premium/clinical-beauty
  tone, not a typical DTC storefront.
- **Footer**: brand links, legal/compliance, salon/career links, social icons
  (separate Hair vs Skincare handles — not applicable to Perú single-line scope).

### 2.1 HCare validation — treatment-by-need pages

Peru's HCare scope (Nutrition, Frizz control, Maintenance) was checked against
the international site's `/tratamiento/` section rather than assumed to be an
existing range. Findings:

- The international site already runs a **"shop by need" taxonomy**, separate
  from "shop by line" (Hop, m.lab, Smart Touch, Gold Oil). Each need is its own
  page: `/tratamiento/necesidad/<slug>/` — e.g. `repara`, `nutre`,
  `mantenimiento-de-color`, `proteccion-solar`, `volumen`,
  `perdida-de-cabello`, `cuidado-del-cuero-cabelludo`. This is a strong
  structural precedent: **needs are first-class landing pages with their own
  URL and curated grid**, pulling products across multiple lines — not a
  single collection with an in-page filter toggle.
- **Peru's taxonomy does not map 1:1 to the international one.** The closest
  international need, "Hidratación" (`/tratamiento/necesidad/nutre/`), bundles
  *both* nutrition and frizz control into one page — its own copy targets
  "cabellos secos, rebeldes y/o encrespados" (dry, unruly, frizzy hair) and
  explicitly says the routine helps "controlar el frizz." There is no
  standalone "frizz" need or product-type on the international site anywhere.
  Peru's decision to split **Nutrition** and **Frizz control** into two
  separate needs is a deliberate scope refinement, not something to copy from
  an existing page — likely to give a smaller catalog clearer,
  intent-matched entry points.
- **"Maintenance" maps cleanly** to the international "Mantenimiento de
  color" need — verified 1:1: "Productos profesionales de mantenimiento de
  color para cabellos rubios, decolorados, coloreados, blancos o con canas...
  para iluminar, potenciar el color y proteger la fibra."
- **Need-page template is lighter than range pages.** Unlike `/gama/under/`
  (video hero, stat callouts, tech blocks), the need pages checked
  (`nutre`, `mantenimiento-de-color`) have **no hero imagery** — they open
  directly with a short paragraph of benefit copy, then the product grid.
  HCare's need pages should follow this lighter pattern, not UNDER's
  campaign-style template.
- The `/tratamiento/` hub itself is a simple **card grid of 4 line tiles**
  ("Ver productos" CTA per card) — the same pattern Peru should reuse for an
  **HCare hub page with 3 need cards** (Nutrition, Frizz control,
  Maintenance) instead of line cards.

## 3. Reusable Horizon components (no custom code needed)

| Reference pattern | Horizon section/block |
|---|---|
| Hero carousel / campaign slides | `sections/slideshow.liquid`, `layered-slideshow.liquid` |
| Range hero banner (image/video) | `sections/hero.liquid` |
| Editorial split (image + copy) | `sections/media-with-content.liquid` |
| "Explore our ranges" tiles | `sections/collection-list.liquid` |
| Best-sellers / range product grid | `sections/product-list.liquid`, `main-collection.liquid` + `blocks/filters.liquid` |
| Magazine/article teasers | `sections/featured-blog-posts.liquid` |
| Shoppable lifestyle image | `sections/product-hotspots.liquid` |
| Spotlighted hero product | `sections/featured-product.liquid`, `featured-product-information.liquid` |
| Product accordions (Características/Ingredientes/Modo de uso) | `blocks/disclosures.liquid` on `product-information.liquid` |
| Shade/tone swatches | `blocks/swatches.liquid` + native variant swatches (needs a Color/Tone product option) |
| Stat/number callouts, scrolling strip | `sections/marquee.liquid`, or a generic `sections/section.liquid` + `group`/`text` blocks |
| Generic flexible layout | `sections/section.liquid` (composable container for anything not covered above) |

## 4. Gaps requiring custom Liquid work

Two reference patterns have no native Horizon equivalent:

1. **Instagram/social grid** (`@montibellopro` 3×3 grid) — no built-in section;
   needs either a lightweight custom section pulling curated images from
   metaobjects, or a social-feed app embed via `custom-liquid.liquid`.
2. **Salon/stockist locator** — not in the stated business scope (UNDER/HCare
   product catalog only); flag as a later-phase custom section if the business
   later wants a "find a salon" experience, backed by a metaobject list + map.

Everything else (stat tiles, color-chart download link, editorial callouts,
accordions) is achievable by composing existing sections/blocks — recommend
validating that in the theme editor before writing any custom `.liquid`.

## 5. Page architecture

**Header** (`sections/header-group.json`)
Logo, mega-menu with two entries: **UNDER** (links straight to the `under`
collection) and **HCare** (dropdown with 3 sub-items — Nutrition, Frizz
control, Maintenance — linking to their respective need collections), using
`menu_style: featured_products` or `featured_collections` to show imagery
inline — matches the reference's editorial mega-menu. Announcement bar for
shipping/promo messaging. Sticky header enabled.

**Homepage** (`templates/index.json`)
Hero/slideshow (campaign) → editorial media-with-content intro to UNDER and
HCare (2 blocks, not 4 like the reference's full catalog) → best-sellers
product-list → (optional, phase 2) blog/magazine teaser → footer CTA.

**UNDER** (color range)
Modeled as one Shopify Collection (`under`) with three product types tagged for
filtering — complete color range, hair dye, peroxide/activating cream — using
`main-collection.liquid` + `blocks/filters.liquid` (Search & Discovery). Landing
content above the grid: hero/video, coverage/technology stat callouts, editorial
blocks — same pattern as `/gama/under/` on the reference.

**HCare** (haircare) — revised after validation, see §2.1

Not a single-line range like UNDER — a **needs-based hub**, matching the
international `/tratamiento/necesidad/` pattern:

- **HCare hub page** (`pages/hcare` or a `collection-list.liquid`-driven
  landing): short brand intro + 3 need cards — Nutrition, Frizz control,
  Maintenance — each linking to its own collection. Same card-grid pattern as
  the reference's `/tratamiento/` line hub, just swapping lines for needs.
- **Three need-based Collections** (`hcare-nutrition`, `hcare-frizz-control`,
  `hcare-maintenance`), each products tagged/assigned per need. Products can
  belong to more than one need collection (a mask that both nourishes and
  fights frizz shouldn't be forced into a single bucket).
- **Need landing template**: lighter than UNDER's — short benefit-copy block
  (`media-with-content.liquid` or a plain `text` block, no hero/video) directly
  above the `main-collection.liquid` product grid. No stat-callout marquee
  unless a specific need has real claims to show (e.g. Maintenance could
  reuse the coverage/protection-style callouts; Nutrition/Frizz control likely
  don't need them based on the reference's copy-only pattern).
- `filters.liquid` is still useful *within* each need collection (e.g. filter
  by product type — shampoo/mask/serum) but is not the mechanism that defines
  the three needs themselves — those are separate collections, not filter
  values, so each gets its own URL, SEO copy, and editor-managed content.

**Collections (generic)**
`main-collection.liquid` handles the UNDER grid and all three HCare need grids
uniformly; only the above-grid content differs per collection (via
`templates/collection.<handle>.json` overrides). UNDER gets the heavier
campaign template (§5 UNDER); HCare need pages get the lighter copy-only
template described above.

**Product page** (`templates/product.json`)
Already well-aligned: media gallery (grid/carousel), title/price, variant
picker (tone swatches for UNDER only), buy buttons, description, disclosures
accordion for Características / Modo de uso / Ingredientes, product
recommendations. Add a color-chart download link as a `button` block linking to
a file asset where relevant (UNDER only).

**Footer** (`sections/footer-group.json`)
Email signup, policy links (Perú legal: terms, privacy, cookies), social icons,
copyright. Simpler than the reference (single brand line, no Hair/Skincare
split).

## 6. Desktop vs. mobile

Horizon's grid/carousel sections already expose mobile-specific settings
(`mobile_columns`, `carousel_on_mobile`, `mobile_card_size`, `stack_media_on_mobile`)
and the header/menu components ship a mobile drawer + accordion menu
out of the box. No custom breakpoint code is expected — mobile behavior should
be configured per-section in the theme editor, verified against the reference
site's mobile stacking (single-column editorial blocks, 2-column product grids).

## 7. Recommended implementation order

1. **Brand foundation** — color palette, typography (custom font upload if
   Montibello's brand typeface isn't a Google/system font), logo/favicon,
   buttons, swatches, badges in `config/settings_schema.json` / theme editor.
2. **Navigation** — main menu (UNDER, HCare, Nosotros/Contacto), header mega-menu
   style, footer links and legal pages for Perú.
3. **Collections data model** — create the `under` collection (tagged by
   subtype: color range/dye/peroxide) and the three HCare need collections
   (`hcare-nutrition`, `hcare-frizz-control`, `hcare-maintenance`, allowing
   multi-need product membership); configure Search & Discovery filters
   within each.
4. **Product page** — configure `product-information.liquid` disclosures,
   variant/swatch setup for UNDER tones, recommendations.
5. **Collection landing pages** — UNDER gets the heavy hero/stat-callout
   template; each HCare need page gets the lighter copy+grid template; build
   the HCare hub page (3 need cards).
6. **Homepage** — hero/campaign + editorial intro to UNDER and the HCare hub
   + best-sellers.
7. **Content pages** — About, Contact, policies (`templates/page*.json`).
8. **Custom sections (if validated as needed)** — Instagram/social grid; defer
   salon locator unless scope expands.
9. **QA pass** — responsive check per section, `es.json` copy completeness,
   image performance, accessibility, SEO metafields.
