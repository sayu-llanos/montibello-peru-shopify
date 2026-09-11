# HOP — Final Build Blueprint

Source of truth for implementing the HOP hub + 3 family collections. Consolidated
from `hop-reference-map.md` (full forensic detail). No new research was performed
here — this file turns the existing audit into locked, concrete build decisions.

Nothing has been created yet: `/pages/hop` and the three collections below do
not exist in the theme/store.

## Final Peru architecture

- `/pages/hop` — hub page (brand story + LifeAlgae technology + 3-family directory)
- `/collections/hop-ultra-repair` — Ultra Repair family page
- `/collections/hop-color-last` — Colour Last family page (keep existing local folder-name spelling for the slug; use "Colour Last" — UK spelling — in all visible Peru copy to match official branding)
- `/collections/hop-smooth-hydration` — Smooth Hydration family page

This matches the reference's own information architecture exactly (per-family
sub-pages, no tabs/anchors/filters) — confirmed in the routing evaluation below.
No change to this structure is recommended.

## Asset classification

**PERU IMPLEMENTATION** (use directly):
- `source-assets/HOP/ULTRA-REPAIR/*.png` (5 SKUs: shampoo, rinse, mask, overnight serum, sealed ends — transparent PNGs, EXACT LOCAL MATCH)
- `source-assets/HOP/COLOR-LAST/*.png` (3 SKUs: shampoo, rinse, mask — EXACT LOCAL MATCH)
- `source-assets/HOP/SMOOTH-HYDRATION/*.png` (3 SKUs: shampoo, rinse, mask — PROBABLE→treated as EXACT by consistent pattern)
- `assets/montibello-hop-ultra-repair-serum.png`, `assets/montibello-hop-color-last-shampoo.png` (already Shopify-integrated)
- `source-assets/REFERENCE-HOME/range-cards/hop-card-bodegon-principal-2.jpg` (hub hero crop, already in use)
- `source-assets/REFERENCE-RANGES/HOP/family-cards/hop-card-ultra-repair.jpg`, `hop-card-colour-last.jpg`, `hop-card-smooth-hydration.jpg` (3-card family directory on the hub)
- `source-assets/REFERENCE-RANGES/HOP/technology/hop-repair-collagen-vegano.jpg`, `hop-colour-last-acido-ferulico.jpg`, `hop-hydration-acido-hialuronico.jpg` (per-family ingredient shots)

**SHARED HOP BRAND/SCIENCE** (range-level, applies to hub regardless of family):
- `source-assets/REFERENCE-RANGES/HOP/hero/hop-hero-bodegon-principal-2.jpg`, `hop-wellness-science-nature.jpg`
- `source-assets/REFERENCE-RANGES/HOP/technology/hop-lifealgae-stat-1.jpg`, `hop-lifealgae-stat-2.jpg` (LifeAlgae BioScience technology story)
- `source-assets/HOP/pdf/hop-guia-tecnica.pdf` (84pp — needed to verify stat-claim footnotes before publishing any percentage claims)

**EXCLUDED INTERNATIONAL** (documented only, never build):
Full Volume, Sun Care, Detox, Sensitive Protection, Purifying Balance, Blonde Glow, Silver White, Reflects, Well-Ageing Treatments/in-salon (9 families). Their grid thumbnails exist at `source-assets/REFERENCE-RANGES/HOP/family-cards/EXCLUDE-*` for layout-documentation purposes only — never surfaced in the Peru build.

**NOT NEEDED** (present locally, no current build role):
- `source-assets/HOP/video/hop-brand-video.mp4`, `hop-video.mov`, `hop-in-salon-treatment-experience.mp4` — no on-page reference embed exists to replicate; available for a future video section at Peru's own discretion, not required for launch.
- No standalone HOP wordmark/logo file exists anywhere (reference or local) — the wordmark only appears baked into product photography. Non-blocking; use the text "HOP" set in the theme's own type system for any lockup need.

## Hub page (`/pages/hop`) — section order

SECTION NUMBER: 01
SECTION NAME: Hero
REFERENCE LAYOUT: Full-bleed bodegón banner + H1 "Hop" + intro paragraph, 2-column at desktop.
COPY SOURCE: verbatim — "Hop" / "El cuidado capilar de alto rendimiento basado en la biociencia de las algas capaz de corregir los 8 signos del bienestar del cuero cabelludo y el cabello: hidratación, nutrición, equilibrio, fuerza, protección del color, encrespamiento, volumen y brillo."
FINAL IMAGE/VIDEO/PDF: `source-assets/REFERENCE-HOME/range-cards/hop-card-bodegon-principal-2.jpg` (already-cropped local version) — or the newly downloaded full-res `source-assets/REFERENCE-RANGES/HOP/hero/hop-hero-bodegon-principal-2.jpg` if a wider banner crop is preferred
EXACT LOCAL PATH: source-assets/REFERENCE-HOME/range-cards/hop-card-bodegon-principal-2.jpg
MATCH STATUS: EXACT LOCAL MATCH
INTERACTION: none
DESKTOP BEHAVIOR: full-bleed banner, 2-column title/copy below
MOBILE BEHAVIOR: single column stack
PERU ADAPTATION: none — copy already in Spanish, generic brand messaging
IMPLEMENTATION ACTION: create new section using the existing local crop

SECTION NUMBER: 02
SECTION NAME: Wellness statement
REFERENCE LAYOUT: Portrait model photo LEFT + headline/4 bullets RIGHT.
COPY SOURCE: verbatim — "Bienestar, ciencia y naturaleza para impulsar el cuidado del cabello más allá de la belleza." + 4 bullets
FINAL IMAGE/VIDEO/PDF: `source-assets/REFERENCE-RANGES/HOP/hero/hop-wellness-science-nature.jpg`
EXACT LOCAL PATH: source-assets/REFERENCE-RANGES/HOP/hero/hop-wellness-science-nature.jpg
MATCH STATUS: REFERENCE DOWNLOAD (no closer local equivalent existed; this is the actual reference photo, already secured)
INTERACTION: none
DESKTOP BEHAVIOR: 2-column
MOBILE BEHAVIOR: stacks
PERU ADAPTATION: none
IMPLEMENTATION ACTION: create new section using the downloaded reference image

SECTION NUMBER: 03
SECTION NAME: LifeAlgae BioScience technology
REFERENCE LAYOUT: Copy LEFT + dark-tile science image RIGHT.
COPY SOURCE: verbatim — "LifeAlgae BioScience multiplica x4 el poder de los activos." + 2 paragraphs
FINAL IMAGE/VIDEO/PDF: `source-assets/REFERENCE-RANGES/HOP/technology/hop-lifealgae-stat-1.jpg`
EXACT LOCAL PATH: source-assets/REFERENCE-RANGES/HOP/technology/hop-lifealgae-stat-1.jpg
MATCH STATUS: REFERENCE DOWNLOAD (secured, no prior local equivalent)
INTERACTION: none
DESKTOP BEHAVIOR: 2-column
MOBILE BEHAVIOR: stacks
PERU ADAPTATION: verify "hiperfermentación de las algas" claims against Peru cosmetic-advertising rules before publishing
IMPLEMENTATION ACTION: create new section using the downloaded reference image

SECTION NUMBER: 04
SECTION NAME: Skincare-grade ingredients
REFERENCE LAYOUT: Copy LEFT (4 stats) + flat-lay skincare-texture image RIGHT.
COPY SOURCE: verbatim — "Enriquecidas con ingredientes del skincare para actuar en los signos del bienestar capilar." + 4 stats (+93%, +87%, x6, +8 semanas)
FINAL IMAGE/VIDEO/PDF: `source-assets/REFERENCE-RANGES/HOP/technology/hop-lifealgae-stat-2.jpg`
EXACT LOCAL PATH: source-assets/REFERENCE-RANGES/HOP/technology/hop-lifealgae-stat-2.jpg
MATCH STATUS: REFERENCE DOWNLOAD
INTERACTION: none
DESKTOP BEHAVIOR: 2-column
MOBILE BEHAVIOR: stacks
PERU ADAPTATION: do not publish the numeric stat claims without checking the `*`/`**` footnote methodology in `hop-guia-tecnica.pdf` first
IMPLEMENTATION ACTION: create new section using the downloaded reference image; hold stat-claim copy pending footnote verification

SECTION NUMBER: 05
SECTION NAME: Gamas Hop family grid
REFERENCE LAYOUT: Grid of family cards, hover-reveal image. Reference has 12; Peru has 3.
COPY SOURCE: "Gamas Hop" (or Peru-equivalent heading) + 3 card titles/links
FINAL IMAGE/VIDEO/PDF: `source-assets/REFERENCE-RANGES/HOP/family-cards/hop-card-ultra-repair.jpg`, `hop-card-colour-last.jpg`, `hop-card-smooth-hydration.jpg`
EXACT LOCAL PATH: as above
MATCH STATUS: EXACT LOCAL MATCH (originals resolved via WP REST API)
INTERACTION: hover-reveal image (opacity 0→1 on `:hover`) — MUST REPLICATE, cheap CSS-only effect
DESKTOP BEHAVIOR: 3-column grid (reduced from reference's 3-col×4-row)
MOBILE BEHAVIOR: 1-column stack
PERU ADAPTATION: grid reduced from 12 cards to exactly 3 — Ultra Repair, Colour Last, Smooth Hydration
IMPLEMENTATION ACTION: create new section — 3-card grid linking to the 3 Peru collections, replicate hover-reveal via CSS opacity transition

SECTION NUMBER: 06
SECTION NAME: Product/lifestyle photo strip
REFERENCE LAYOUT: 4 square tiles.
COPY SOURCE: none
FINAL IMAGE/VIDEO/PDF: n/a — reference's 4 tiles include 2 excluded-family images; no full Peru-only replacement set was sourced
EXACT LOCAL PATH: n/a
MATCH STATUS: NOT NEEDED
INTERACTION: none
DESKTOP BEHAVIOR: n/a
MOBILE BEHAVIOR: n/a
PERU ADAPTATION: omit, or rebuild later with 3 tiles (one per Peru family) using each family's own product/technology imagery already secured above
IMPLEMENTATION ACTION: omit reference-only module for v1 launch (non-blocking, low priority — can be revisited as a polish pass)

SECTION NUMBER: 07
SECTION NAME: Bottom CTA band
REFERENCE LAYOUT: Full-width black bar, 2-column B2B CTA (become-a-client / salon locator).
COPY SOURCE: n/a — this is Spain B2B/professional-network furniture
FINAL IMAGE/VIDEO/PDF: none
EXACT LOCAL PATH: n/a
MATCH STATUS: NOT REQUIRED FOR PERU
INTERACTION: n/a
DESKTOP BEHAVIOR: n/a
MOBILE BEHAVIOR: n/a
PERU ADAPTATION: replace with a Peru-appropriate CTA consistent with the homepage's own assistance/contact CTA pattern, or omit
IMPLEMENTATION ACTION: omit reference-only module — reuse the site's existing assistance-CTA section pattern instead if a closing CTA is wanted

## Family collection template (applies to all 3 Peru collections)

Per the routing evaluation: each `/collections/hop-*` page should use a **custom
collection template** with a content block above the product grid (matching the
reference's own family-page pattern), not Horizon's default banner+grid template.

SECTION NUMBER: F1
SECTION NAME: Family hero
REFERENCE LAYOUT: H1 (family name) + descriptive paragraph + hero group image.
COPY SOURCE: verbatim per family (see below)
FINAL IMAGE/VIDEO/PDF: see per-family asset list below
MATCH STATUS: EXACT LOCAL MATCH (all 3 families)
INTERACTION: none
DESKTOP BEHAVIOR: 2-column
MOBILE BEHAVIOR: stacks
PERU ADAPTATION: none, copy already Spanish
IMPLEMENTATION ACTION: create as a collection-template content block

SECTION NUMBER: F2
SECTION NAME: Benefit stats
REFERENCE LAYOUT: H2 headline + 4 stat bullets, family-specific.
COPY SOURCE: verbatim per family (see below)
PERU ADAPTATION: verify all `*`/`**` stat claims against `hop-guia-tecnica.pdf` before publishing
IMPLEMENTATION ACTION: create as a collection-template content block; hold numeric claims pending footnote verification

SECTION NUMBER: F3
SECTION NAME: Technology
REFERENCE LAYOUT: H2 "LifeAlgae Bioscience + [family-specific active]" + 2-3 paragraphs + ingredient close-up.
COPY SOURCE: verbatim per family (see below)
FINAL IMAGE/VIDEO/PDF: per-family ingredient shot (already downloaded — see asset classification above)
IMPLEMENTATION ACTION: create as a collection-template content block

SECTION NUMBER: F4
SECTION NAME: Descubre la gama completa
REFERENCE LAYOUT: H2 + product grid linking to PDPs.
COPY SOURCE: "Descubre la gama completa"
FINAL IMAGE/VIDEO/PDF: family's transparent PNG product set (see PERU IMPLEMENTATION list above)
MATCH STATUS: EXACT LOCAL MATCH
IMPLEMENTATION ACTION: the collection's native product grid — this is the collection itself, no custom section needed beyond the standard product grid

### Ultra Repair — copy + assets
- H1: "Ultra Repair"
- Intro: "Rutina reparadora y nutritiva que reconstruye y fortalece los cabellos dañados químicamente, térmicamente o por factores medioambientales. Enriquecida con Colágeno vegano, un complejo de proteínas de origen vegetal que rellenan y restauran la fibra capilar."
- Stats H2: "Cuidado intensivo 24/7 para tu cabello dañado." — "125% cabello más fuerte*" / "x5 más hidratación*" / "x4 menos encrespamiento*" / "x4 cabello más sedoso*"
- Technology H2: "LifeAlgae Bioscience + Colágeno Vegano" (+ secondary overnight-stat block)
- Products: Shampoo, Rinse, Mask, Overnight Serum, Sealed Ends
- Assets: `source-assets/HOP/ULTRA-REPAIR/*.png` (5 SKUs) + `source-assets/REFERENCE-RANGES/HOP/technology/hop-repair-collagen-vegano.jpg`

### Colour Last — copy + assets
- H1: "Colour Last"
- Intro: "Rutina hidratante y protectora que prolonga la vida del color en los cabellos coloreados. Enriquecida con Ácido ferúlico, un potente antioxidante de origen vegetal con alto poder hidratante que protege de los radicales libres y de la radiación solar y prolonga la duración del color y del brillo."
- Stats H2: "Protección y cuidado para el cabello coloreado." — "8 semanas de color protegido" / "Cabello x6 más resistente a rotura*" / "Crea un escudo protector antioxidante y anti-polución para preservar el color" / "Filtro UV"
- Technology H2: "LifeAlgae Bioscience + Ácido Ferúlico"
- Products: Shampoo, Rinse, Mask
- Assets: `source-assets/HOP/COLOR-LAST/*.png` (3 SKUs) + `source-assets/REFERENCE-RANGES/HOP/technology/hop-colour-last-acido-ferulico.jpg`

### Smooth Hydration — copy + assets
- H1: "Smooth Hydration"
- Intro: "Rutina hidratante y antifrizz que fortalece y aporta control en cabellos secos, rebeldes y/o encrespados, enriquecida con Ácido Hialurónico, un activo altamente hidratante que mejoran la elasticidad, controlan el frizz y devuelven la suavidad y la manejabilidad."
- Stats H2: "Hidratación profunda para el cabello seco." — "86% cabello más hidratado desde la primera aplicación" / "86% cabello menos frizz**" / "Repara la función barrera del cabello" / "Controla el frizz y devolve el brillo, la suavidad y la manejabilidad."
- Technology H2: "LifeAlgae Bioscience + Ácido Hialurónico" (+ mention of Polisacáridos de chia y lino)
- Products: Shampoo, Rinse, Mask
- Assets: `source-assets/HOP/SMOOTH-HYDRATION/*.png` (3 SKUs) + `source-assets/REFERENCE-RANGES/HOP/technology/hop-hydration-acido-hialuronico.jpg`

## Routing/architecture — final confirmation

`/pages/hop` (static page, hub) + `/collections/hop-ultra-repair`,
`/collections/hop-color-last`, `/collections/hop-smooth-hydration` (collections
with a custom template carrying the F1-F4 content blocks above the product grid)
is confirmed as the correct structure — it matches the reference's own IA
exactly. Not implemented yet; routes are documented here only.

# HOP BUILD ORDER

1. Create the 3 collections (`hop-ultra-repair`, `hop-color-last`, `hop-smooth-hydration`) and assign the confirmed Peru SKUs to each.
2. Build a custom collection template carrying sections F1-F4 for each collection.
3. Copy the per-family assets listed above from `source-assets/` into `assets/` with descriptive production filenames.
4. Build `/pages/hop` with hub sections 01-05 (omit 06 and 07 per this blueprint).
5. Verify all numeric stat claims against `hop-guia-tecnica.pdf` before publishing.
6. Run `shopify theme check` and visual QA against `docs/screenshots/range-reference/hop/` at 1440/1280/mobile-390.
