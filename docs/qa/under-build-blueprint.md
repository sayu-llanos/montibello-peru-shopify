# UNDER — Final Build Blueprint

Source of truth for implementing UNDER. Consolidated from `under-reference-map.md`
(full forensic detail, keep as backup reference) — every open question from that
report has been resolved into a single concrete decision below. No new research
was performed to produce this file; the one exception is that this pass **locks**
the two previously-flagged "open decisions" (Elevated Warmth image, media_position
mismatches) into definite implementation actions so a build session doesn't need
to make judgment calls mid-build.

Existing file to work against: `templates/collection.under.json` (already has
sections 1-7 and 9 built; section 8/gallery does not exist yet).

---

SECTION NUMBER: 01
SECTION NAME: Hero
REFERENCE LAYOUT: Full-bleed banner, red-haired model in cream top, near-black background, no text overlay.
COPY SOURCE: none (image only)
FINAL IMAGE/VIDEO/PDF: `assets/montibello-under-hero-desktop.jpg` (desktop) + `assets/montibello-under-hero-mobile.jpg` (mobile, Peru-only crop — reference has no distinct mobile art direction, so keeping our own crop is an enhancement, not a gap)
EXACT LOCAL PATH: assets/montibello-under-hero-desktop.jpg ; assets/montibello-under-hero-mobile.jpg
MATCH STATUS: EXACT LOCAL MATCH (already wired)
INTERACTION: none
DESKTOP BEHAVIOR: full-bleed, ~2.667:1 aspect ratio, ~444px rendered height at 1185px content width
MOBILE BEHAVIOR: full-bleed, Peru mobile crop
PERU ADAPTATION: none
IMPLEMENTATION ACTION: reuse existing section — no change

---

SECTION NUMBER: 02
SECTION NAME: Hero Intro
REFERENCE LAYOUT: H1 + intro paragraph + "Ver vídeo" button, left-aligned ~50% column.
COPY SOURCE: verbatim reference — "Under" / "La coloración con cobertura de alta definición y tecnología híbrida que potencia la realidad y naturalidad de un color sin límites." / "Ver vídeo"
FINAL IMAGE/VIDEO/PDF: none (text-only section)
EXACT LOCAL PATH: n/a
MATCH STATUS: EXACT LOCAL MATCH (copy already verbatim in `hero_intro_under`)
INTERACTION: anchor-scroll to video section
DESKTOP BEHAVIOR: 50% column, ~209px height
MOBILE BEHAVIOR: stacks full width
PERU ADAPTATION: none
IMPLEMENTATION ACTION: reuse existing section — no change. (Non-blocking note: button currently anchors to `video_under`, which sits 3rd locally vs. 7th on reference — this is an accepted UX improvement, not a bug; leave as-is.)

---

SECTION NUMBER: 03
SECTION NAME: Stats / Carta de Color
REFERENCE LAYOUT: Split — editorial packshot image LEFT, heading + 4-stat grid + Carta de Color PDF button + footnote RIGHT.
COPY SOURCE: verbatim reference — "Llega la alta definición del color a la coloración de alta cobertura" / 100%·95%·95%·96% stats / "* Evaluación profesional de 512 aplicaciones sobre voluntarias."
FINAL IMAGE/VIDEO/PDF: `assets/montibello-under-stats-editorial.jpg` + `assets/montibello-under-carta-color.pdf`
EXACT LOCAL PATH: assets/montibello-under-stats-editorial.jpg ; assets/montibello-under-carta-color.pdf
MATCH STATUS: EXACT LOCAL MATCH — PDF is MD5-byte-identical to the live reference's PDF (`e16e88d94a79efd34d399c2faaa4638d`)
INTERACTION: "Ver datos" mobile accordion toggle; "Carta de Color" button opens PDF in new tab
DESKTOP BEHAVIOR: media_position left (matches reference exactly), ~543px height
MOBILE BEHAVIOR: stats grid hidden behind "Ver datos" toggle
PERU ADAPTATION: none
IMPLEMENTATION ACTION: reuse existing section — no change, already fully correct

---

SECTION NUMBER: 04
SECTION NAME: Glucamine Nature Tech
REFERENCE LAYOUT: Split — heading + 3-paragraph tech story LEFT, illustration RIGHT.
COPY SOURCE: verbatim reference — "Glucamine Nature Tech, la nueva tecnología híbrida de alta eficacia." + 3 paragraphs (INNOVADORA TECNOLOGÍA HÍBRIDA / DOBLE PODER DE PIGMENTACIÓN / COLÁGENO VEGANO)
FINAL IMAGE/VIDEO/PDF: `assets/montibello-under-glucamine-tech.jpg`
EXACT LOCAL PATH: assets/montibello-under-glucamine-tech.jpg
MATCH STATUS: EXACT LOCAL MATCH (image already correct)
INTERACTION: none
DESKTOP BEHAVIOR: ~450px height
MOBILE BEHAVIOR: stacks
PERU ADAPTATION: none (copy/image already correct)
IMPLEMENTATION ACTION: correct `media_position` from "left" to "right" in `glucamine_under` settings to match the live reference exactly (currently inverted — confirmed bug, low severity, cosmetic-only)

---

SECTION NUMBER: 05
SECTION NAME: Elevated Warmth
REFERENCE LAYOUT: Split — image LEFT, heading + copy + "Más información" button RIGHT.
COPY SOURCE: verbatim reference — "Descubre Elevated Warmth: 7 nuevos tonos cálidos elevados" + 4-line descriptive paragraph. Tone codes seen baked into the reference image (3.61/7.31/7.70/9.31/7.80/6.40/5.70) must be cross-checked against `assets/montibello-under-carta-color.pdf` before any of those specific numbers are used as literal shade-code claims in Peru copy — do not publish them unverified.
FINAL IMAGE/VIDEO/PDF: `source-assets/REFERENCE-RANGES/UNDER/technology/under-elevated-warmth-swatch-900w.webp` — **replaces** the currently-wired `assets/montibello-under-editorial-elevated-warmth.jpg`, which is confirmed to be the wrong image (a generic campaign portrait, not this claim's actual tone-swatch graphic)
EXACT LOCAL PATH: source-assets/REFERENCE-RANGES/UNDER/technology/under-elevated-warmth-swatch-900w.webp (copy to `assets/montibello-under-elevated-warmth-swatch.jpg` during implementation)
MATCH STATUS: OFFICIAL SUBSTITUTE — this IS the correct reference asset (downloaded directly from the live page), but only a 900×640 resolution was recoverable via the WordPress cache; it will look soft at large desktop banner widths (1920px+). Locked in as the correct content for now; flag for a higher-resolution request from Montibello before final production polish, but do not let this block launch.
INTERACTION: none beyond the button link
DESKTOP BEHAVIOR: ~510px height
MOBILE BEHAVIOR: heading + "Más información →" link, then body copy + image
PERU ADAPTATION: verify the 7 tone codes against the Carta de Color PDF before publishing as shade-code claims
IMPLEMENTATION ACTION: replace image asset (swap `montibello-under-editorial-elevated-warmth.jpg` → the newly copied `montibello-under-elevated-warmth-swatch.jpg`) AND correct `media_position` from "right" to "left" to match the reference

---

SECTION NUMBER: 06
SECTION NAME: Product Range
REFERENCE LAYOUT: Centered heading + 4-card grid (colorant + 3 activators).
COPY SOURCE: verbatim reference — "Descubre la gama completa" + per-card titles/descriptions
FINAL IMAGE/VIDEO/PDF: `assets/montibello-under-product-colorant.webp`, `assets/montibello-under-activating-cream-15vol.jpg`, `-25vol.jpg`, `-35vol.jpg`
EXACT LOCAL PATH: as above (all 4 already wired)
MATCH STATUS: EXACT LOCAL MATCH (all 4, confirmed via dimension-convention + filename correlation with reference sources)
INTERACTION: real product cards (Peru correctly shows live cards instead of the reference's disabled "No disponible en tu país" buttons)
DESKTOP BEHAVIOR: 4-column grid, portrait ratio ≈0.716
MOBILE BEHAVIOR: 2-column grid
PERU ADAPTATION: none — Peru's SKU set (colorant + 3 activators, no Monodose) matches what the reference range page itself shows
IMPLEMENTATION ACTION: reuse existing section — no change, already fully correct

---

SECTION NUMBER: 07
SECTION NAME: Video
REFERENCE LAYOUT: Full-width click-to-play Vimeo embed, poster-first, positioned after the product range on the reference (7th).
COPY SOURCE: alt text "Vídeo oficial Montibello Under" (already set)
FINAL IMAGE/VIDEO/PDF: Vimeo ID 1153294336
EXACT LOCAL PATH: n/a (embed, no local file — poster is served by Vimeo)
MATCH STATUS: EXACT LOCAL MATCH (video ID already correctly set locally, confirmed against reference's `data-video` attribute)
INTERACTION: click-to-play, no autoplay, no loop
DESKTOP BEHAVIOR: ~633px height, 16:9 aspect
MOBILE BEHAVIOR: same poster-and-play pattern, full width
PERU ADAPTATION: none
IMPLEMENTATION ACTION: reuse existing section — no change. (Non-blocking note: section currently sits 3rd locally vs. 7th on reference; keep current placement, it is an accepted UX improvement, not a defect.)

---

SECTION NUMBER: 08
SECTION NAME: Gallery / Editorial Carousel
REFERENCE LAYOUT: Arrow-navigated 11-slide portrait carousel between the video and the CTA bar. Does not exist in the local build yet.
COPY SOURCE: none (image-only)
FINAL IMAGE/VIDEO/PDF: local UNDER campaign/bodegon library — `source-assets/UNDER/campaign/under-2026-modelo-02.jpg` through `-06.jpg`, `under-tendencias-2026.jpg`, plus a selection from `source-assets/UNDER/products/under-bodegon-01.jpg` … `-12.jpg`
EXACT LOCAL PATH: source-assets/UNDER/campaign/ and source-assets/UNDER/products/ (copy selected files into `assets/` at implementation time)
MATCH STATUS: OFFICIAL LOCAL SUBSTITUTE — higher-resolution and unambiguously Under-branded, preferred over the reference's shared cross-range portfolio (which mixes in non-Under-labeled files from other ranges)
INTERACTION: arrow-click navigation, ~277.5×388px cards, 15px gap, 50×50px arrows
DESKTOP BEHAVIOR: ~468px height
MOBILE BEHAVIOR: single card visible, swipe/arrow nav
PERU ADAPTATION: build from the local UNDER-specific set, not the reference's mixed portfolio
IMPLEMENTATION ACTION: create new section — OPTIONAL for first launch, non-blocking (the 8 other sections already cover the full commercial and technology narrative without it)

---

SECTION NUMBER: 09
SECTION NAME: CTA Professional / Locator
REFERENCE LAYOUT: Full-width black bar, 2-column CTA row.
COPY SOURCE: verbatim reference — "¿Tienes un salón pero no eres cliente todavia?" + "CONTACTA CON UN COMERCIAL" / "Localiza tu salón o peluquería Montibello más cercana" + "ENCUENTRA"
FINAL IMAGE/VIDEO/PDF: none
EXACT LOCAL PATH: n/a
MATCH STATUS: EXACT LOCAL MATCH (copy, links, styling already correct)
INTERACTION: simple links
DESKTOP BEHAVIOR: 2-column, space-between, ~202px height
MOBILE BEHAVIOR: stacks vertically
PERU ADAPTATION: both buttons already correctly route to `/pages/contacto` instead of the Spain-specific `/contacto/` and `/localizador-de-centros/` destinations
IMPLEMENTATION ACTION: reuse existing section — no change. (Admin-only future action: if Peru gets a dedicated salon locator, repoint "ENCUENTRA" there instead of `/pages/contacto`.)

---

# UNDER BUILD ORDER

1. Verify `templates/collection.under.json` current state (confirm sections 1-7, 9 still match this blueprint — nothing else has touched this file since the audit).
2. Fix Section 04: flip `glucamine_under.settings.media_position` to `"right"`.
3. Fix Section 05: copy `source-assets/REFERENCE-RANGES/UNDER/technology/under-elevated-warmth-swatch-900w.webp` into `assets/montibello-under-elevated-warmth-swatch.jpg`, rewire `elevated_warmth_under`'s image setting to it, flip `media_position` to `"left"`.
4. Verify the 7 Elevated Warmth tone codes against `assets/montibello-under-carta-color.pdf` before any of those numbers appear in published copy.
5. (Optional, non-blocking) Build Section 08 gallery carousel using the local UNDER campaign/bodegon library.
6. Run `shopify theme check` and visual QA against `docs/screenshots/range-reference/under/` at 1440/1280/mobile-390.
7. Do not touch sections 01, 02, 03, 06, 07, 09 — already verified correct.
