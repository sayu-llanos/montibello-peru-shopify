# LUXLIGHT — Final Build Blueprint

Source of truth for implementing LUXLIGHT. Consolidated from
`luxlight-reference-map.md` (full forensic detail). No new research performed —
this file resolves the Éclat contradiction into concrete, locked decisions per
this round's explicit rule: **Éclat is out of scope, and its absence can never
make this page NOT READY.**

Nothing has been created yet: `/collections/luxlight` (or equivalent) does not
exist in the theme/store.

---

SECTION NUMBER: 01
SECTION NAME: Header/Navbar
REFERENCE LAYOUT: Shared site chrome, not range content.
COPY SOURCE: n/a
FINAL IMAGE/VIDEO/PDF: n/a
MATCH STATUS: N/A
INTERACTION: n/a
DESKTOP BEHAVIOR: n/a
MOBILE BEHAVIOR: n/a
PERU ADAPTATION: n/a — theme header already exists
IMPLEMENTATION ACTION: omit — not a range-page section

---

SECTION NUMBER: 02
SECTION NAME: Hero
REFERENCE LAYOUT: Full-bleed banner behind left-aligned H1 + intro paragraph.
COPY SOURCE: verbatim — "luxlight" / "Máximo poder de aclaración con el máximo cuidado del cabello. Diseñada para cubrir todas las necesidades de los servicios de aclaración."
FINAL IMAGE/VIDEO/PDF: `assets/montibello-luxlight-hero-desktop.jpg` (desktop) + `source-assets/REFERENCE-RANGES/LUXLIGHT/hero/luxlight-hero-mobile-reference.jpg` (mobile, 768×960)
EXACT LOCAL PATH: assets/montibello-luxlight-hero-desktop.jpg ; source-assets/REFERENCE-RANGES/LUXLIGHT/hero/luxlight-hero-mobile-reference.jpg
MATCH STATUS: EXACT LOCAL MATCH — desktop hero is MD5-byte-identical to the reference; mobile crop was downloaded directly from the reference this session, so it is also exact (not a substitute)
INTERACTION: none
DESKTOP BEHAVIOR: full-bleed, 2.667:1 aspect ratio
MOBILE BEHAVIOR: separate portrait crop (0.8:1), not a CSS crop of the desktop asset
PERU ADAPTATION: none
IMPLEMENTATION ACTION: reuse existing desktop asset; copy the downloaded mobile file into `assets/montibello-luxlight-hero-mobile.jpg` and wire it as the mobile image

---

SECTION NUMBER: 03
SECTION NAME: Performance & Results
REFERENCE LAYOUT: Video thumbnail + rounded campaign photo + before/after comparison slider + 4 stat lines.
COPY SOURCE: verbatim — "Máxima aclaración con el máximo cuidado capilar" / "x20 veces más fuerte*" / "52% más resistente a la rotura**" / "x10 veces más suave*" / "Recupera la fuerza natural del cabello**"
FINAL IMAGE/VIDEO/PDF: video `source-assets/LUXLIGHT/video/luxlight-video-campana.mp4`; campaign photo `source-assets/LUXLIGHT/campaign/luxlight-modelo-04.jpg`; before/after slider — **OMITTED, see Peru adaptation**
EXACT LOCAL PATH: source-assets/LUXLIGHT/video/luxlight-video-campana.mp4 ; source-assets/LUXLIGHT/campaign/luxlight-modelo-04.jpg
MATCH STATUS: PROBABLE LOCAL MATCH (video by role/naming, not frame-verified; campaign photo visually confirmed same model/pose/lighting as reference, different crop)
INTERACTION: click-to-play video modal, autoplay-on-scroll-into-view — MUST REPLICATE
DESKTOP BEHAVIOR: 2-column-ish arrangement
MOBILE BEHAVIOR: stacks
PERU ADAPTATION: **The reference's before/after slider uses an Éclat-watermarked "after" photo ("Toned with éclat 10-02"), which is out of scope. No Luxlight-only before/after photo pair exists in the local library — commissioning new photography is out of scope for this documentation pass. Per this round's rule, this gap does NOT block readiness: drop the drag-comparison slider mechanic entirely and present the 4 stat lines as plain bold text callouts next to the video and campaign photo instead.**
IMPLEMENTATION ACTION: build section with video + campaign photo + 4 text-only stat callouts; omit the before/after slider (non-blocking, revisit if/when genuine Luxlight-only before/after photography becomes available)

---

SECTION NUMBER: 04
SECTION NAME: Technology (Bond3 Force System + Metal Shield)
REFERENCE LAYOUT: Text block + inline embedded video + secondary 4-panel campaign photo grid.
COPY SOURCE: verbatim — "Potenciada por la tecnología Bond3 Force System + Metal Shield" + 2 explanatory paragraphs (BOND3 FORCE SYSTEM triple-action bullets; METAL SHIELD anti-metal shield description)
FINAL IMAGE/VIDEO/PDF: video `source-assets/LUXLIGHT/video/luxlight-video-tecnologia.mp4`; secondary visual `source-assets/REFERENCE-RANGES/LUXLIGHT/technology/luxlight-intro-02-reference.webp` (the 4-panel campaign grid — this specific image is Éclat-free; only Section 6's copy/framing was Éclat-tied, not this image)
EXACT LOCAL PATH: source-assets/LUXLIGHT/video/luxlight-video-tecnologia.mp4 ; source-assets/REFERENCE-RANGES/LUXLIGHT/technology/luxlight-intro-02-reference.webp
MATCH STATUS: PROBABLE LOCAL MATCH (video) / EXACT (secondary image, downloaded directly from reference)
INTERACTION: inline autoplay-on-scroll video — MUST REPLICATE
DESKTOP BEHAVIOR: text + inline video + grid image
MOBILE BEHAVIOR: stacks
PERU ADAPTATION: none — this section is Luxlight-only content, no Éclat dependency
IMPLEMENTATION ACTION: build section with video + downloaded 4-panel image; optionally supplement with local Bond3 CGI renders (`source-assets/LUXLIGHT/technical/luxlight-tecnologia-01..05.jpg`) as a static fallback if video is not embedded

---

SECTION NUMBER: 05
SECTION NAME: Value-proposition icon strip
REFERENCE LAYOUT: 4-column short-claim strip.
COPY SOURCE: 3 verbatim + 1 rewritten — "Servicio premium 360º en el salón." / "Gama completa con aclaración + tratamiento." / "Rendimiento demostrado, resultados elevados." / **item 4 rewritten**: "Menú de servicios para antes, durante y después de la aclaración con Luxlight." (reference original implies a toning add-on step via Éclat; Peru wording keeps the same before/during/after structure but scopes it to Luxlight's own product steps — developer → lightener → pH shampoo/treatment — no fabricated new claim, just removal of the implied Éclat step)
FINAL IMAGE/VIDEO/PDF: none (icon/CSS glyphs, not photographic assets)
MATCH STATUS: N/A
INTERACTION: none
DESKTOP BEHAVIOR: 4-column
MOBILE BEHAVIOR: stacks
PERU ADAPTATION: item 4 copy rewritten per above
IMPLEMENTATION ACTION: build section with items 1-3 verbatim, item 4 using the rewritten line above

---

SECTION NUMBER: 06
SECTION NAME: "Luxlight + Éclat: el dúo perfecto" module
REFERENCE LAYOUT: H2 + 3 paragraphs + the 4-panel campaign grid.
COPY SOURCE: n/a — every line's premise is the Luxlight+Éclat combination
FINAL IMAGE/VIDEO/PDF: n/a
MATCH STATUS: EXCLUDE FROM PERU
INTERACTION: n/a
DESKTOP BEHAVIOR: n/a
MOBILE BEHAVIOR: n/a
PERU ADAPTATION: **Recommendation A confirmed: remove this module entirely.** There is no way to re-skin it with Luxlight-only copy without becoming either a redundant restatement of Section 04's technology pitch or implying an unavailable combined toning service. Removing it keeps the Peru narrative honest (aclaración → protección vía Bond3/Metal Shield → gama completa). The section's own image (the 4-panel grid) is reused in Section 04 instead — no visual asset is wasted.
IMPLEMENTATION ACTION: omit this section entirely from the Peru page's section order

---

SECTION NUMBER: 07
SECTION NAME: Product Range ("Descubre la gama completa")
REFERENCE LAYOUT: 8-card product grid (5 core + 3 developers).
COPY SOURCE: verbatim — "Descubre la gama completa" + 8 product names (Supreme Lightener 9+, Supreme Clay Lightener 7+, Supreme Control Oil Lightening System 2+, Supreme Ph Protective Shampoo, Supreme Acidic Ph Treatment, Supreme Oil Developer 3%/6%/9%)
FINAL IMAGE/VIDEO/PDF: `source-assets/LUXLIGHT/products/*.png` (8 square studio renders, one per SKU)
EXACT LOCAL PATH: source-assets/LUXLIGHT/products/ (already partially integrated: `assets/montibello-luxlight-lightener-9plus.png`, `assets/montibello-luxlight-ph-protective-shampoo.png`)
MATCH STATUS: PROBABLE LOCAL MATCH — same 8 SKUs confirmed, different photographic treatment (square studio renders vs. reference's styled portrait bodegón crops); fully usable, no content gap
INTERACTION: none beyond standard product-card links
DESKTOP BEHAVIOR: grid, portrait ratio ≈0.716 on reference (local square renders are usable as-is)
MOBILE BEHAVIOR: grid reflow
PERU ADAPTATION: none — all 8 SKUs are Luxlight-only, no Éclat products in this grid
IMPLEMENTATION ACTION: build the 8-card grid using the existing local square product PNGs; optional future upgrade to bodegón-style crops (2 samples already downloaded for reference) is cosmetic, non-blocking

---

SECTION NUMBER: 08
SECTION NAME: Editorial/Product Gallery Strip
REFERENCE LAYOUT: Horizontal strip of 11 product-in-hand/macro images.
COPY SOURCE: none
FINAL IMAGE/VIDEO/PDF: `source-assets/LUXLIGHT/campaign/luxlight-modelo-04.jpg` + `source-assets/LUXLIGHT/products/luxlight-bodegon-01.jpg` through `-06.jpg` + `luxlight-gama-completa.png`
EXACT LOCAL PATH: as above
MATCH STATUS: OFFICIAL LOCAL SUBSTITUTE — same campaign family, different composition than the reference's individual macro crops, but on-brand and Luxlight-only
INTERACTION: horizontal-scroll strip (no arrow/dot controls on reference)
DESKTOP BEHAVIOR: flex-row strip
MOBILE BEHAVIOR: horizontal scroll
PERU ADAPTATION: none
IMPLEMENTATION ACTION: create new section — OPTIONAL for first launch, non-blocking

---

SECTION NUMBER: 09
SECTION NAME: Footer
REFERENCE LAYOUT: Shared footer.
MATCH STATUS: N/A
IMPLEMENTATION ACTION: omit — theme footer already exists

---

# LUXLIGHT BUILD ORDER

1. Copy `source-assets/REFERENCE-RANGES/LUXLIGHT/hero/luxlight-hero-mobile-reference.jpg` into `assets/montibello-luxlight-hero-mobile.jpg` and wire the mobile hero.
2. Build Section 03 (Performance & Results) WITHOUT the before/after slider — video + campaign photo + 4 text-only stat callouts.
3. Build Section 04 (Technology) with video + the downloaded 4-panel campaign image.
4. Build Section 05 (value-prop strip) using the rewritten item-4 copy above.
5. Do NOT build Section 06 (Luxlight + Éclat module) — omit entirely.
6. Build Section 07 (product range, 8 SKUs) using the existing local square product PNGs.
7. (Optional, non-blocking) Build Section 08 editorial gallery strip using local Luxlight campaign/bodegon imagery.
8. Run `shopify theme check` and visual QA against `docs/screenshots/range-reference/luxlight/` at 1440/1280/mobile-390.
9. If/when genuine Luxlight-only before/after photography becomes available, revisit Section 03 to reinstate the drag-comparison slider — this is a future enhancement, not a launch blocker.
