# LUXLIGHT — Reference Page Forensic Map

## REFERENCE URL
https://hair.montibello.com/gama/luxlight/ (captured 2026-09-10)

## PAGE PURPOSE
Official Montibello brand range page for **Luxlight**, the professional lightening/decoloración system (powders, clay lightener, oil developers, control-oil system, pH shampoo/treatment). The page sells the "máxima aclaración con máximo cuidado" positioning built on the **Bond3 Force System + Metal Shield** technology, then upsells a combined lightening+toning salon service built around a companion toner range called **éclat**, before showing the full Luxlight product range and an editorial/product gallery.

## PERU COMMERCIAL SCOPE
- **Luxlight**: ACTIVE / IN SCOPE. All Luxlight products, Bond3 Force System / Metal Shield technology story, and Luxlight-only campaign/product imagery are usable for the Peru page.
- **éclat**: **NOT IN PERU SCOPE.** Éclat is a toner/gloss companion line referenced on the reference page (dedicated "luxlight + éclat: el dúo perfecto" module, plus an Éclat-toned "after" photo inside the results/stats section). Éclat must not be implemented, sold, or shown as purchasable on the Peru site. See the Exclusion Matrix below for exact occurrences and handling recommendations.
- No PDF/"Carta de Color" link was found embedded on this specific reference page (unlike the UNDER range, which does link one). Three Luxlight PDFs already exist locally (catalog, 9+ tarjeta, logo) as supplementary official material — not required to replicate the live page, but available.

## EXACT CURRENT SECTION ORDER (top → bottom)
1. Site header / navbar (shared, not range-specific — logo, Contacto button, login)
2. Hero — H1 "luxlight" + intro line + full-bleed banner (desktop banner / mobile crop)
3. Performance & results section — H2 stats headline, 4 stat callouts, campaign video (modal), campaign close-up photo, before/after comparison slider
4. Technology section — H2 "Bond3 Force System + Metal Shield", 2 explanatory paragraphs, inline technology video, 4-model campaign photo grid
5. Value-proposition icon strip — 4 short one-line claims (service / range / performance / service menu)
6. "Luxlight + Éclat: el dúo perfecto" module — H2 + 3 paragraphs (ÉCLAT — see exclusion matrix)
7. Product range — H2 "Descubre la gama completa" + 8 product cards (5 core + 3 developers)
8. Editorial/product gallery strip — 11 images (product + campaign crops)
9. Footer (shared — logo, "Cosmética Cosbar, S.L. © 2026")

---

## SECTION-BY-SECTION BREAKDOWN

### Section 1 — Header / Navbar
- **Role**: Shared site chrome, not range content.
- **Assets**: `montibello-logo.svg` (151×26, shared across all range pages — not range-specific, skip for Luxlight asset library).
- **Peru status**: N/A (out of range scope; homepage/theme already has its own header).
- **Peru modification**: None needed for this research; header is theme-level, not part of the Luxlight content build.

### Section 2 — Hero
- **Copy (verbatim)**:
  - H1: "luxlight"
  - P: "Máximo poder de aclaración con el máximo cuidado del cabello. Diseñada para cubrir todas las necesidades de los servicios de aclaración."
- **Layout**: Full-bleed banner image behind/above a left-aligned H1 + intro paragraph block. Container is `uk-container-expand` (no max-width cap — content runs edge-to-edge minus a small gutter, effectively full viewport width at all the desktop breakpoints tested: 1474px measured width at ~1489px viewport).
- **Desktop geometry**: Hero image rendered at 1474×552.75 at time of measurement → **ratio 2.667:1** (matches 2560×960 crop exactly).
- **Mobile behavior**: Separate portrait-oriented image swapped in below ~768px (`luxlight_movil-1.jpg`, 768×960, ratio 0.8:1) rather than a CSS crop of the desktop asset.
- **Background/colors**: Photographic bodegón hero (lavender/lilac product bottles on gradient lilac backdrop), no flat color background.
- **Typography**: H1 40px / weight 700 / line-height 40px (1:1 leading), font-family `TTCommons`, color `rgb(0,0,0)`. Body P: 16px / 19.7px line-height, `TTCommons`.
- **Assets**:
  - Desktop hero: `https://hair.montibello.com/wp-content/uploads/yootheme/cache/bf/Banner-luxlight-bfa1d072.webp` (2560×960 at largest srcset step; full srcset 768/1024/1366/1600/1920/2560w).
  - Mobile hero: `https://hair.montibello.com/wp-content/uploads/2026/02/luxlight_movil-1.jpg` (768×960, original upload path, not a yootheme cache derivative).
- **Local match**: **EXACT LOCAL** — `assets/montibello-luxlight-hero-desktop.jpg` is **byte-identical** (MD5 match) to `source-assets/REFERENCE-HOME/hero/luxlight-hero-bodegon-1.jpg`, and pixel-dimension-identical (2560×960) and visually identical to the downloaded reference hero. This asset is already fully integrated and used on the approved homepage — no rework needed.
- **Missing**: Mobile portrait crop (768×960) has no local equivalent — downloaded (see Asset Summary).
- **Interactions**: None (static hero). MUST REPLICATE: full-bleed treatment + exact aspect ratio. NOT REQUIRED FOR PERU: separate mobile crop file — could be solved with CSS `object-position` on the same desktop asset if a true mobile crop isn't produced.

### Section 3 — Performance & Results
- **Copy (verbatim)**:
  - H2: "Máxima aclaración con el máximo cuidado capilar"
  - P: "x20 veces más fuerte*"
  - P: "52% más resistente a la rotura**"
  - P: "x10 veces más suave*"
  - P: "Recupera la fuerza natural del cabello**"
- **Layout**: Two-column-ish arrangement combining a clickable video thumbnail, a rounded campaign photo (`01-luxlight`), and a **before/after comparison slider** (interactive drag handle, "twentytwenty" plugin classes `twentytwenty-before` / `twentytwenty-after`), plus the 4 stat lines as short bold statements (asterisked, footnote-style claims — exact footnote text not present in captured DOM, likely in fine print elsewhere on the live page; do not fabricate footnote content for Peru).
- **Video**: Vimeo ID `1168380624`, opens in a modal (`data-modal="videoGama"`), autoplay when in view. Local match: **PROBABLE LOCAL MATCH** — `source-assets/LUXLIGHT/video/luxlight-video-campana.mp4` (1920×1080, 42s) by role/naming; not frame-verified against the live vimeo stream.
- **Before/after slider**:
  - "Before" image: brunette/dark-blonde model, back view, natural pre-service hair. URL: `.../luxlight-before-c0fb49ae.webp` (1252×898).
  - "After" image: same model, back view, platinum-blonde result, watermarked **"Toned with éclat 10-02"**. URL: `.../eclat-after-4e49a44c.webp` (1252×898).
  - **This "after" image is an Éclat-branded asset** — see Exclusion Matrix, Occurrence 1.
- **Campaign photo** (`01-luxlight`): close-up beauty shot, platinum-blonde model, "luxlight" wordmark overlay, diagonal light-streak graphic element. 900×640 (cache); original source photo matches local **`source-assets/LUXLIGHT/campaign/luxlight-modelo-04.jpg`** (4218×6083) — same model, pose, lighting, light-streak, and turtleneck — visually confirmed. **PROBABLE LOCAL MATCH** (same source photograph, different crop/aspect than the live site's specific placement).
- **Interactions**: (1) Click-to-play video modal with autoplay-on-scroll-into-view. (2) Draggable before/after comparison slider. Both are meaningful conversion/engagement devices.
  - MUST REPLICATE: the video-on-scroll intro moment (high production value, directly reusable with local mp4).
  - NICE TO HAVE: the drag-comparison slider mechanic — but the specific asset pair used live is Éclat-tainted (see exclusion matrix) so Peru needs its own Luxlight-only before/after pair, or should drop the slider interaction and keep only the single after/result photo.
- **Peru commercial status**: Section overall is Luxlight-relevant (INCLUDE), but the "after" photo specifically is EXCLUDE (Éclat).
- **Peru modification required**: Replace the Éclat-watermarked "after" photo before/after; do not fabricate a substitute — source or commission a genuine Luxlight-only before/after pair, or simplify to a single "after" result photo without slider.

### Section 4 — Technology (Bond3 Force System + Metal Shield)
- **Copy (verbatim)**:
  - H2: "Potenciada por la tecnología Bond3 Force System + Metal Shield"
  - P: "Innovadora tecnología que actúa en las diferentes capas del cabello y permite aclarar y proteger en un solo paso."
  - P: "BOND3 FORCE SYSTEM: un nuevo sistema de triple acción.\n– Refuerza y restaura los enlaces debilitados y dañados para aportar mayor resistencia.\n– Crea enlaces adicionales en las cadenas de queratina y entre ellas.\n– Refuerza la estructura interna de la fibra."
  - P: "Combinada con METAL SHIELD, un escudo antimetales que crea un film para reparar y reforzar el cabello mientras lo protege frente a los efectos del exceso de metales acumulados, para un cabello fuerte y resistente."
- **Layout**: Text block on one side; on the other, an **inline embedded Vimeo player** (not a modal — rendered directly as an `<iframe>` with rounded corners/overflow-hidden), plus a secondary 4-panel campaign photo grid (`02-luxlight`) elsewhere in the section.
- **Video**: Vimeo ID `1168379823`, embedded inline, autoplay-inview, no modal wrapper. Local match: **PROBABLE LOCAL MATCH** — `source-assets/LUXLIGHT/video/luxlight-video-tecnologia.mp4` (1920×1080, 32s) by role/naming.
- **4-panel campaign grid** (`02-luxlight`, 900×640 cache): four models (platinum blonde, warm blonde, curly brunette back view, dark brunette) in white/metallic party outfits, split into 4 vertical panels. **No local equivalent found** — this specific grouped grid/crop does not match any single local campaign file (checked against all 8 local campaign files). **REFERENCE DOWNLOAD REQUIRED** (downloaded).
- **Notably**: No static CGI/3D "bond" molecule render is used on the live page for this section (the local `source-assets/LUXLIGHT/technical/luxlight-tecnologia-01..05.jpg` DNA/molecule 3D renders, 5000×5000, are NOT currently displayed anywhere in this page's captured DOM). Classify those 5 local files as **OFFICIAL LOCAL SUBSTITUTE** — available and on-brand, but not a replication requirement; could be used by Peru as a static fallback/enhancement if not embedding video, or as a supplementary explainer graphic.
- **Interactions**: Inline autoplay-on-scroll video. MUST REPLICATE if video is used at all for Peru (it directly explains the core selling technology); NICE TO HAVE fallback: static Bond3 CGI render (local asset already covers this).
- **Peru commercial status**: INCLUDE (Luxlight-only, no Éclat content in this section).

### Section 5 — Value-proposition icon strip
- **Copy (verbatim, 4 short lines)**:
  - "Servicio premium 360º en el salón."
  - "Gama completa con aclaración + tratamiento."
  - "Rendimiento demostrado, resultados elevados."
  - "Menú de servicios para antes, durante y después de la aclaración."
- **Layout**: Reads as a 4-column short-claim/icon strip bridging the technology section and the Éclat module; icon graphics were not resolved as distinct `<img>` elements in the captured DOM (likely inline SVG/icon font — not captured by the img/picture/video scan; treat icon glyphs as a UI-kit/CSS-icon concern, not a photographic asset to source).
- **Peru commercial status**: Mostly INCLUDE — items 1–3 are generic value claims usable for Luxlight alone. Item 4 ("Menú de servicios para antes, durante y después de la aclaración") should be reviewed: on the live site this phrase functions as a bridge into the combined Luxlight+Éclat service menu; for Peru it should describe only Luxlight's own before/during/after product steps (developer → lightener → pH shampoo/treatment), not an implied toning add-on service.
- **Peru modification required**: Verify/rewrite item 4's framing so it does not imply an Éclat-based "after" step is available.

### Section 6 — "Luxlight + Éclat: el dúo perfecto" (ÉCLAT MODULE)
- **Copy (verbatim)**:
  - H2: "luxlight + éclat: el dúo perfecto"
  - P: "Servicio premium 360º que comienza en el aclarado y finaliza en el tratamiento."
  - P: "La perfecta combinación de color y tratamiento."
  - P: "Neutraliza o tonaliza y aporta más valor a tus servicios de aclarado."
- **Layout**: H2 + 3 short paragraphs on one side, the `02-luxlight` 4-panel campaign photo grid as the visual companion on the other (same image referenced in Section 4's layout — the DOM shows it once; its exact section placement between the tech section and this module is ambiguous in a pure top-to-bottom DOM crawl, but the copy is unambiguous).
- **Peru commercial status**: **EXCLUDE** — see Exclusion Matrix below for full handling.

### Section 7 — Product Range ("Descubre la gama completa")
- **Copy**: H2 "Descubre la gama completa"
- **Layout**: Product card grid, 8 SKUs across two visual rows (5 core products, then 3 developers), each card = product bodegón photo + product name (H3) + (presumed) price/CTA affordances typical of the `cvl-product-*` WooCommerce/catalog component classes seen in the DOM.
- **Products & copy (H3, verbatim)**:
  - Row 1: "Supreme Lightener 9+", "Supreme Clay Lightener 7+", "Supreme Control Oil Lightening System 2+", "Supreme Ph Protective Shampoo", "Supreme Acidic Ph Treatment"
  - Row 2: "Supreme Oil Developer 3% (10 Vol)", "Supreme Oil Developer 6% (20 Vol)", "Supreme Oil Developer 9% (30 Vol)"
- **Assets**: Each card image is a portrait bodegón crop, 1200×1675 (original upload paths, e.g. `.../uploads/2026/02/supreme-9_01-1200x1675.jpg`, `supreme-7_01`, `oil-control-2_01`, `supreme-shampoo_01`, `supreme-treatment_01`, `supreme-developer-10/20/30`).
- **Local match**: **PROBABLE LOCAL MATCH** for all 8 — local `source-assets/LUXLIGHT/products/*.png` (4000×4000 square studio renders of the same SKUs) cover every product identity correctly but in a different (square, no-background) crop/style than the live site's styled portrait bodegón photography. Same products, different photographic treatment — usable, but not a pixel match. Two representative bodegón-style originals (`supreme-9_01`, `supreme-shampoo_01`) were downloaded for side-by-side comparison/reference.
- **Peru commercial status**: INCLUDE (fully Luxlight, no Éclat SKUs present in this grid — confirms the reference product line for Peru is self-contained).
- **Peru modification**: Decide whether Peru should keep the square studio product renders (already integrated as `assets/montibello-luxlight-lightener-9plus.png`, `assets/montibello-luxlight-ph-protective-shampoo.png`) or invest in matching bodegón-style crops for a closer visual match to the reference. NICE TO HAVE, not required.

### Section 8 — Editorial/Product Gallery Strip
- **Layout**: Horizontal strip/carousel of 11 images mixing product-in-hand and macro beauty crops, all at 600×839 (cache) scaling from 1200×1678 originals.
- **Assets** (all under `.../uploads/2026/02/` originals, filenames): `supreme-9_05-1`, `supreme-9_06-1`, `supreme-07_04-1`, `supreme-9_07`, `supreme-9_03-1`, `supreme-7_07_`, `supreme-7_06`, `supreme-07_03-1`, `supreme-shampoo_05`, `supreme-shampoo_04`, `oil-control_03-1`.
- **Local match**: `supreme-9_05` (first gallery item) is the **same base campaign photo** as Section 3's `01-luxlight` — confirmed identical model/pose/lighting to local `source-assets/LUXLIGHT/campaign/luxlight-modelo-04.jpg` → **PROBABLE LOCAL MATCH**. The remaining 10 close-up product/hand-detail shots have no verified local equivalent (local `products/luxlight-bodegon-01..06.jpg` and `products/luxlight-gama-completa.png` are full studio bodegón/group shots, a different composition than these individual in-hand macro crops). Two representative frames (`supreme-9_05`, `supreme-9_06`) were downloaded as reference; the rest are **REFERENCE DOWNLOAD REQUIRED (not yet downloaded — lower priority, same visual family as the two captured samples)**.
- **Interactions**: Likely a horizontal-scroll/carousel (`uk-flex-1` flex-row classes suggest a flex-scroll strip rather than a slider with arrows — no arrow/dot controls were found in the captured DOM). NICE TO HAVE for Peru.
- **Peru commercial status**: INCLUDE (all Luxlight/Supreme product content, no Éclat).

### Section 9 — Footer
- **Assets**: Shared `montibello-logo.svg`, copyright line "Cosmética Cosbar, S.L. © 2026".
- **Peru commercial status**: N/A (theme-level, shared footer already exists).

### Cookie consent
- Cookiebot iframe present (`consentcdn.cookiebot.com`) — infrastructure, not content; NOT REQUIRED FOR PERU (site should already have its own consent handling).

---

## DESIGN + INTERACTION FORENSICS

| Property | Value |
|---|---|
| Body font | `TTCommons` (record geometry only — do not download/embed; retune with Montserrat per project convention) |
| H1/H2 size | 40px / weight 700 / line-height 40px (1:1 leading — tight display heading style) |
| Body P | 16px / line-height 19.7px (~1.23 leading) |
| Container behavior | `uk-container-expand`, `maxWidth: none` — effectively full-bleed at all measured breakpoints (measured 1474px wide container at ~1489px viewport, i.e. near-zero side gutter) |
| Hero aspect ratio (desktop) | 2.667:1 (2560×960) |
| Hero aspect ratio (mobile) | 0.8:1 (768×960, portrait swap, not a CSS crop) |
| Button radius | 5px (both black "Contacto" CTA and white nav button) |
| Button padding | `0 40px` (primary), `0 15px` (secondary/login) |
| Product card image ratio | 1200:1675 ≈ 0.716:1 (portrait bodegón) |
| Gallery image ratio | 1200:1678 ≈ 0.715:1 (same family as product cards) |
| Before/after image ratio | 1252:898 ≈ 1.394:1 (landscape) |
| Section image ("NN-luxlight") ratio | 900:640 = 1.406:1 |

**Interactions inventory:**
| Interaction | Priority |
|---|---|
| Full-bleed hero with responsive image swap (not crop) | MUST REPLICATE |
| Scroll-into-view autoplay video (campaign, modal) | MUST REPLICATE |
| Scroll-into-view autoplay video (inline, technology) | NICE TO HAVE |
| Draggable before/after comparison slider | NICE TO HAVE (only with a Luxlight-only asset pair — see exclusion matrix) |
| Horizontal editorial gallery strip | NICE TO HAVE |
| Icon/claim strip (4 short value props) | MUST REPLICATE (cheap to build, reinforces credibility) |
| Éclat cross-sell module | NOT REQUIRED FOR PERU (see exclusion matrix) |

---

# LUXLIGHT EXCLUSION MATRIX

## Occurrence 1 — Éclat-toned "after" photo inside the results/before-after slider
- **Location**: Section 3 (Performance & Results), before/after comparison slider.
- **Dimensions**: 1252×898.
- **Visual role**: The "after" half of a drag-comparison slider demonstrating lightening results.
- **Imagery**: Same model as the "before" photo, now platinum blonde, with an on-image caption "Toned with éclat 10-02" crediting the toning shade to the Éclat product line.
- **Copy**: No separate body copy beyond the in-image watermark; sits under the "x20 veces más fuerte*" stat block.
- **Interaction**: Draggable comparison handle (twentytwenty plugin).
- **PERU STATUS: EXCLUDE** (the specific after-photo/caption; the before photo and slider mechanic are not exclusive to Éclat).
- **Recommendation: (B) Preserve the visual slot, replace the content.** The before/after mechanic is a strong, low-cost conversion device that has nothing inherently to do with Éclat — only this specific "after" photo is Éclat-tainted. Recommend sourcing/commissioning a genuine Luxlight-only before/after pair (a lightened result with no toning-brand attribution) to keep the slider. **Gap flagged**: no such Luxlight-only before/after pair currently exists in the local asset library — this is new photography/asset work, not a simple swap of existing files. If that photography isn't available in time, fall back to a single static "after" result photo (no slider, no toning brand mentioned) rather than removing the section outright, since the stat callouts ("x20 veces más fuerte", etc.) still need a supporting visual.

## Occurrence 2 — Dedicated "luxlight + éclat: el dúo perfecto" module
- **Location**: Section 6, standalone module between the value-proposition icon strip and the product range.
- **Dimensions**: Text column + the `02-luxlight` 4-panel campaign image (900×640).
- **Visual role**: Cross-sell module positioning Luxlight (lightening) and Éclat (toning/treatment) as a combined "360º" salon service.
- **Copy**: H2 "luxlight + éclat: el dúo perfecto"; body copy explicitly sells "el aclarado y... el tratamiento" combination, "la perfecta combinación de color y tratamiento", "neutraliza o tonaliza y aporta más valor a tus servicios de aclarado" — every line's premise is the two-product combo.
- **Interaction**: None beyond standard scroll reveal.
- **PERU STATUS: EXCLUDE**
- **Recommendation: (A) Remove the module completely.** Unlike Occurrence 1, this entire section's reason for existing is the Luxlight+Éclat combination — there is no way to "re-skin" it with Luxlight-only copy without either (a) becoming a redundant restatement of Section 4's technology pitch and Section 7's product range, or (b) implying a treatment/toning step that Peru cannot fulfill with Luxlight alone. Removing it entirely keeps the Peru page's narrative honest (aclaración → protección vía Bond3/Metal Shield → gama completa) and avoids customer confusion about an unavailable combined service. The `02-luxlight` campaign image itself is Éclat-free and can be reused elsewhere on the Peru page (e.g., as a secondary editorial image in the technology or gallery section) since the image content is not exclusionary — only this module's copy and framing are.

---

## ASSET SUMMARY

| Category | Count |
|---|---|
| Total reference visual assets identified (range-specific, excluding shared nav/footer) | 27 |
| Exact local matches (verified byte/pixel identical) | 1 (hero desktop) |
| Probable local matches (same source/product, different crop or unverified frame match) | 6 (campaign intro-01, campaign intro grid's model family partially, gallery frame 1, campaign video, technology video, + product-identity match across all 8 product cards counted as one family) |
| Downloaded from reference (new files added to `source-assets/REFERENCE-RANGES/LUXLIGHT/`) | 10 |
| Official local substitute (on-brand local asset not used on this exact page, available for reuse) | 5 (Bond3/Metal Shield CGI renders, `technical/luxlight-tecnologia-01..05.jpg`) |
| Video-embed (Vimeo, mapped to local mp4 by role) | 2 (campaign, technology) — plus 4 local step-by-step technique videos confirmed NOT embedded on this page (out of scope for this specific reference URL) |
| PDF | 0 found embedded on this reference page (3 Luxlight PDFs exist locally as supplementary material, not required by this page) |
| Excluded from Peru (Éclat) | 2 occurrences (before/after "after" photo; dedicated dúo-perfecto module) |
| No match (no local equivalent, downloaded as new reference-only asset) | 11 (mobile hero crop, 4-panel campaign grid, before-photo, 2 bodegón product-card crops, 2 gallery frames, + ~10 remaining unfetched gallery frames counted at lower priority — see notes) |

**Local video assets confirmed NOT present on this reference page** (archived locally but not part of `/gama/luxlight/`'s own DOM — likely belong to a linked technique/application sub-page not covered by this URL scope): `luxlight-stepbystep-expensive-blonde-es.mp4`, `luxlight-stepbystep-frosted-platinum-es.mp4`, `luxlight-stepbystep-honey-cascade-es.mp4`, `luxlight-stepbystep-light-blow-balayage-es.mp4`.

**Files downloaded** (`source-assets/REFERENCE-RANGES/LUXLIGHT/`):
- `hero/luxlight-hero-desktop-reference.webp` (2560×960)
- `hero/luxlight-hero-mobile-reference.jpg` (768×960)
- `technology/luxlight-intro-01-reference.webp` (900×640)
- `technology/luxlight-intro-02-reference.webp` (900×640) — 4-panel campaign grid, ÉCLAT-adjacent module visual (image itself Éclat-free)
- `technology/luxlight-before-after-BEFORE-reference.webp` (1252×898)
- `technology/eclat-before-after-AFTER-reference.webp` (1252×898) — **ÉCLAT, reference/documentation only, do not use as-is**
- `products/supreme-9-bodegon-card-reference.jpg` (1200×1675)
- `products/supreme-shampoo-bodegon-card-reference.jpg` (1200×1675)
- `gallery/supreme-9-gallery-05-reference.webp` (1200×1678)
- `gallery/supreme-9-gallery-06-reference.webp` (1200×1678)

All downloads returned HTTP 200; no failures to report.
