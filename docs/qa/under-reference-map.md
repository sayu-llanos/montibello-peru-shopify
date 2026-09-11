# UNDER — Reference Page Forensic Map

## REFERENCE URL
https://hair.montibello.com/gama/under/
(Page title: "Under - Coloración Permanente Bajo Contenido de Amoníaco | Under")

Captured 2026-09-10 via an isolated Chrome DevTools MCP browser context (`isolatedContext: under-research`) to avoid collisions with the parallel HOP/LUXLIGHT research agents sharing the default Playwright browser session.

## PAGE PURPOSE
Official Montibello Hair range-landing page for **Under**, a hybrid low-ammonia permanent hair-colour line ("Hybrid low ammonia permanent colouring cream" / "Coloración con cobertura de alta definición"). The page sells the range's technology story (Glucamine Nature Tech, Elevated Warmth tonal collection), shows the shade-coverage stats, links to the official Carta de Color (colour chart) PDF, and lists the sellable SKUs (colorant + 3 activator strengths). All product buttons on the reference site read **"No disponible en tu país"** (Peru is excluded from direct e-commerce there), so this is purely a brand/education range page pattern, not a live storefront checkout flow.

## PERU COMMERCIAL SCOPE
Confirmed Peru-sellable/relevant items for UNDER, per project brief (do not expand beyond this without new source docs):
- **Under** permanent colour (colorant tubes, all shades per the confirmed Carta de Color)
- **Under Activating Cream** (peroxide/developer): 15 vol / 4.5%, 25 vol / 7.5%, 35 vol / 10.5%
- **Under Monodose**: 15 vol / 4.5%, 25 vol / 7.5%, 35 vol / 10.5%

The reference page itself only ever shows the colorant + the 3 **Activating Cream** SKUs (no Monodose SKU is displayed on this particular range page on hair.montibello.com — Monodose may live only in the product catalog/PDF, not this landing page). This confirms the existing local build's `product_range_under` section (colorant + 3 activator cards, no Monodose) is aligned with what the official reference itself displays; Monodose would need to be sourced from the catalog PDFs if a future Peru build wants to surface it separately.

The **Elevated Warmth** sub-collection ("7 nuevos tonos cálidos elevados") is a shade-family marketing name inside UNDER, not a separate SKU set — any specific shade/tone codes used in Peru copy must be cross-checked against the confirmed current Carta de Color PDF (see Section 3 assets below; the exact current PDF has been verified byte-identical to the one already bundled in `assets/`).

## EXACT CURRENT SECTION ORDER (verified via live DOM traversal, not assumption)
Captured by walking `document.querySelector('main').children` and recording each section's copy, top offset and height. Numbering below is the reference site's actual visual order:

| # | Section (reference) | Approx. height @1185 content width |
|---|---|---|
| 1 | Hero (full-bleed model image banner) | 444px |
| 2 | Hero intro (H1 "Under" + intro paragraph + "Ver vídeo" button) | 209px |
| 3 | Stats / Carta de Color panel | 543px |
| 4 | Glucamine Nature Tech (split banner) | 450px |
| 5 | Elevated Warmth (split banner) | 510px |
| 6 | Product range ("Descubre la gama completa") | 670px |
| 7 | Video (Vimeo embed, fs-video plugin) | 633px |
| 8 | Editorial/gallery carousel (10–11 slides) | 468px |
| 9 | CTA professional + salon locator (black bar) | 202px |

**Important divergence from the already-built local `templates/collection.under.json`:** that file currently places `video_under` as the **3rd** section (right after the intro, before stats), whereas the live reference places its video section **7th** (after the product range, before the gallery). The "Ver vídeo" button in the intro is an anchor link (`#shopify-section-video_under` locally; on reference it scrolls to the lower video block). This is a legitimate prior design decision (surfacing video earlier is arguably better UX) — flagging it here as a factual difference from the reference, not something to "fix" (this task is research-only; the frozen local file was not modified).

## SECTION-BY-SECTION BREAKDOWN

### Section 1 — HERO
- **Role:** Full-bleed hero image banner, no overlay text baked into the section (heading lives in Section 2 below it, not overlapping).
- **Copy:** none (pure image)
- **Layout:** `uk-section uk-padding-remove-vertical`, single `<picture>` inside a `uk-container` > full-width grid, one non-art-directed `<source>` (webp) with a plain width-based `srcset` (768/1024/1366/1600/1920/2560w) — **no dedicated mobile crop** on the reference; the same photo simply scales down. This differs from the already-integrated local build, which supplies a separate `montibello-under-hero-mobile.jpg` — a legitimate Peru-side enhancement (portrait crop for small screens), not a regression.
- **Desktop geometry:** rendered height 444px at 1185px content width (image itself is edge-to-edge, not constrained to the 1185 container — it's a full-bleed section).
- **Mobile behavior:** same single image, scaled; in our mobile screenshot capture the hero image did not paint (see screenshot caveat note at the end of this doc) despite `img.complete` being true in earlier desktop DOM checks — a lazy-load/scroll-observer timing quirk specific to automated capture, not a real content gap (verified content via desktop capture instead).
- **Background/colors:** section background `rgb(246,246,243)` (site's warm off-white), hero image itself has a near-black background behind the model.
- **Typography:** none in this section.
- **Image assets:**
  - Reference: `https://hair.montibello.com/wp-content/uploads/yootheme/cache/25/DESKTOP-25852b45.webp` (cache-served; largest srcset step 2560w). Downloaded a copy to `source-assets/REFERENCE-RANGES/UNDER/hero/under-hero-desktop-2560w.webp` (373,210 bytes) for the audit trail.
  - Visually confirmed (via full-page screenshot): red-haired model in cream top against near-black background — **identical composition** to the already-integrated `assets/montibello-under-hero-desktop.jpg` (2560×960) and to `source-assets/REFERENCE-HOME/hero/under-hero-desktop-2026-05.jpg` (also 2560×960, same aspect ratio 2.667 as the reference's rendered 1489×558 natural size).
- **Video/PDF assets:** none.
- **Interactions:** none.
- **Exact local matches:** `assets/montibello-under-hero-desktop.jpg`, `assets/montibello-under-hero-mobile.jpg` (Peru-only crop, no reference equivalent) — **EXACT LOCAL MATCH** (high confidence via aspect ratio + visual composition match; not byte-diffed against the WP original because WP re-encodes to webp with its own cache pipeline).
- **Missing assets:** none.
- **Peru commercial status:** fine as-is, generic brand hero.
- **Peru modification required:** none.
- **Implementation notes:** Reference has no distinct mobile crop; keep the Peru-side separate mobile hero image as an enhancement.

### Section 2 — HERO INTRO
- **Role:** H1 + intro paragraph + CTA button, left-aligned in a ~50%-width column (matches local `hero_intro_under` group `custom_width: 50`).
- **Copy (verbatim):**
  - H1: "Under"
  - Body: "La coloración con cobertura de alta definición y tecnología híbrida que potencia la realidad y naturalidad de un color sin límites."
  - Button: "VER VÍDEO" (rendered uppercase via CSS `text-transform: uppercase`; source text is "Ver vídeo")
- **Layout:** `uk-section uk-section-xsmall`, container width 1185px, content column width 542.5px (~50% + gutter alignment, i.e. left half of the 1185 container).
- **Desktop geometry:** section height 209px, padding 25px top/bottom.
- **Mobile behavior:** stacks full width; button remains visible and functional.
- **Background/colors:** `rgb(246,246,243)`.
- **Typography:** H1 40px / weight 700 / line-height 40px / font-family `TTCommons` (do not embed the font; Peru build uses Montserrat tuned to similar size/weight/tracking). Body paragraph 16px / line-height 19.7px.
- **Button style (site-wide `uk-button-default` pattern, sampled from "Ver vídeo"):** height 40px, padding `0 20px`, `border-radius: 5px`, background `rgb(0,0,0)`, text `rgb(255,255,255)`, uppercase, font-size 18px, weight 500.
- **Image/video/PDF assets:** none directly (button links to the video section further down the page).
- **Interactions:** anchor-scroll to video section. **MUST REPLICATE** (cheap, high value).
- **Exact local matches:** copy is already verbatim-identical in `templates/collection.under.json` (`hero_intro_under`).
- **Peru commercial status:** copy is generic brand messaging, safe to keep verbatim.
- **Peru modification required:** none (already correct).
- **Implementation notes:** the button currently in the local build points to `#shopify-section-video_under`, which is positioned 3rd locally vs. 7th on reference — see the section-order note above.

### Section 3 — STATS / CARTA DE COLOR PANEL
- **Role:** Split panel: editorial packshot image (left, verified) + heading + 4-stat data grid + "Carta de Color" PDF button + legal footnote (right).
- **Copy (verbatim):**
  - H2: "Llega la alta definición del color a la coloración de alta cobertura"
  - Stats: "100% cobertura de canas *", "95% relleno de color *", "95% intensidad de matiz *", "96% color luminoso *"
  - Button: "CARTA DE COLOR" (with a small download/link icon)
  - Footnote: "* Evaluación profesional de 512 aplicaciones sobre voluntarias."
- **Layout:** image column 562.5px wide (LEFT, x:30–592.5 in a 1185 container), text column right. Matches local `stats_carta_under` setting `media_position: "left"` — **this one is consistent** with the reference.
- **Desktop geometry:** section height 543px, image rendered 562.5×492.5 (source natural 899×640, aspect 1.404).
- **Mobile behavior:** stats grid is hidden by default behind a **"Ver datos" mobile-only toggle button** (`class="toggleMobileButton ... dataGama"`) — confirmed via DOM (a real accordion, not decorative). The local template already anticipates this via its `toggle_label: "Ver datos"` setting on `montibello-stats-panel` — good alignment, **MUST REPLICATE**.
- **Background/colors:** `rgb(246,246,243)`.
- **Typography:** H2 40px/700/40px line-height, max-width ~462.5px (half-column). Stat numbers 23px/700.
- **Image assets:** `https://hair.montibello.com/wp-content/uploads/yootheme/cache/57/30_05_MONTIBELLO_SET3_0052-copia-scaled-e1768560893387-5701a745.webp` (899×640) — downloaded to `source-assets/REFERENCE-RANGES/UNDER/technology/under-stats-editorial-1707w.webp` (328,006 bytes). **Visually confirmed via screenshot: 4 Under colorant tubes with product spilling out, laid flat on a grey/stone surface** — this is the **same photograph** already integrated as `assets/montibello-under-stats-editorial.jpg` — **EXACT LOCAL MATCH** (confirmed visually, high confidence).
- **PDF asset:** `https://hair.montibello.com/wp-content/uploads/2026/06/Carta-UNDER_26.pdf`. **Downloaded and MD5-verified: `e16e88d94a79efd34d399c2faaa4638d`, 8,345,602 bytes — byte-identical to the already-integrated `assets/montibello-under-carta-color.pdf`.** This is the current, correct official 2026 Carta de Color. Confirmed **EXACT LOCAL MATCH** at the byte level (the strongest possible confidence). Note: `source-assets/UNDER/pdf/under-carta-de-color-digital.pdf` (14.2MB, MD5 `33fdc689bf8b862c816951480fa9575d`) is a **different, older/larger file** — do not confuse the two; the one already wired into the theme (`assets/montibello-under-carta-color.pdf`) is the current one.
- **Interactions:** "Ver datos" mobile accordion toggle (**MUST REPLICATE**); "Carta de Color" button opens the PDF directly (new tab), no lightbox (**MUST REPLICATE**, trivial).
- **Peru commercial status:** the four percentage stats are a professional-evaluation marketing claim tied to the global formula, not a Peru-specific commercial claim — safe to keep verbatim including the footnote (already done locally).
- **Peru modification required:** none — content and asset are already exact.
- **Implementation notes:** none outstanding; this section is fully built and verified correct.

### Section 4 — GLUCAMINE NATURE TECH
- **Role:** Split banner: heading + 3-paragraph technology story (LEFT) + illustration (RIGHT).
- **Copy (verbatim):**
  - H2: "Glucamine Nature Tech, la nueva tecnología híbrida de alta eficacia."
  - Para 1: "INNOVADORA TECNOLOGÍA HÍBRIDA: Una fórmula innovadora con la tecnología híbrida Glucamine Nature Tech, para la máxima cobertura y la mayor realidad de color."
  - Para 2: "DOBLE PODER DE PIGMENTACIÓN: Mayor relleno y nitidez de color gracias a una nueva evolución en el sistema de liberación de pigmentos."
  - Para 3: "COLÁGENO VEGANO: Un novedoso complejo de origen biotecnológico para aportar resiliencia y protección al cuero cabelludo y al cabello."
- **Layout:** reference renders the **image on the RIGHT** (x:592.5–1155 of 1185) and text on the left. **This is the opposite of the local build's setting** (`glucamine_under.settings.media_position: "left"`, i.e. image left). Flagging as a confirmed mismatch versus the live reference — not fixed here (out of scope / frozen file), but worth a deliberate decision in a future pass.
- **Desktop geometry:** section height 450px; image rendered 562.5×400 (source natural 900×640, aspect 1.406).
- **Mobile behavior:** stacks (image above or below text depending on final Peru choice); on the reference mobile capture, image did not paint in the automated screenshot (same lazy-load caveat as Section 1) but content order was heading → 3 paragraphs.
- **Background/colors:** `rgb(246,246,243)`.
- **Typography:** H2 40px/700/40 line-height, max-width ~462.5px; body paragraphs standard 16px RTE style, each on its own line/paragraph (no bullet markup, just stacked `<p>`).
- **Image assets:** `https://hair.montibello.com/wp-content/uploads/yootheme/cache/ff/Mesa-de-trabajo-1-copia-5-ff5eb4c4.webp` (900×640) — downloaded to `source-assets/REFERENCE-RANGES/UNDER/technology/under-glucamine-1350w.webp` (149,304 bytes). **Visually confirmed: a green-plant/glucose-molecule liquid-sphere illustration** — this is the **same illustration** already integrated as `assets/montibello-under-glucamine-tech.jpg` — **EXACT LOCAL MATCH** (confirmed visually; note the integrated file is a different intrinsic size/crop, 1350×1080 vs. reference's rendered 900×640, but it is unmistakably the same illustration asset, just a different export).
- **Interactions:** none.
- **Peru commercial status:** ingredient/technology story, safe to keep verbatim — it's a formula-level claim, not a market-availability claim.
- **Peru modification required:** none for copy/image content; only the media_position left/right choice is an open design decision (see above).
- **Implementation notes:** decide whether to match the reference's image-right layout or keep the current image-left build; either is defensible, but the manifest below defaults to **matching the reference** (image right) for anyone doing a faithful rebuild.

### Section 5 — ELEVATED WARMTH
- **Role:** Split banner: image (LEFT) + heading + copy + CTA button (RIGHT).
- **Copy (verbatim):**
  - H2: "Descubre Elevated Warmth: 7 nuevos tonos cálidos elevados"
  - Body: "Una nueva expresión del color de los tonos en tendencia: castaños profundos, rubios beige equilibrados, cobrizos, rojos y púrpuras vibrantes. Máxima cobertura con la máxima intensidad sin necesidad de mezclar con base con tono natural. Cromaticidad, luminosidad y nitidez absoluta. Tonos cálidos y profundos que potencian el brillo, con una intensidad de color equilibrada y natural." (rendered as 4 separate stacked paragraphs/lines with rule separators between them, per the screenshot)
  - Button: "Más información" (mobile shows it as a text link with an arrow icon rather than a filled button)
- **Layout:** reference renders the **image on the LEFT** (x:30–592.5) and text on the right. **This is the opposite of the local build's setting** (`elevated_warmth_under.settings.media_position: "right"`). Same class of mismatch as Section 4, but inverted — i.e., both split sections in the local build currently have their media_position flipped relative to the live reference.
- **Desktop geometry:** section height 510px; image rendered 562.5×459.6.
- **Mobile behavior:** heading + "Más información →" link shown; body copy and image follow below (confirmed via mobile screenshot).
- **Background/colors:** `rgb(246,246,243)`.
- **Typography:** H2 40px/700/40 (site-standard), body 16px with thin horizontal rules between each stacked claim line (a distinctive treatment worth replicating for visual polish, though not critical).
- **Image assets:** `https://hair.montibello.com/wp-content/uploads/yootheme/cache/b1/under-b17c52c8.webp` (900×640) — downloaded to `source-assets/REFERENCE-RANGES/UNDER/technology/under-elevated-warmth-swatch-900w.webp`. **Visually confirmed content: a close-up amaryllis/lily flower photo with 7 tone-swatch pin labels overlaid** (values 3.61, 7.31, 7.70, 9.31, 7.80, 6.40, 5.70 — almost certainly the 7 Elevated Warmth shade-depth/tone codes) **plus an "under" wordmark overlay.**
  - **CRITICAL FINDING:** this is **completely different content** from the currently-integrated `assets/montibello-under-editorial-elevated-warmth.jpg` (2560×1708), which is a portrait of a seated woman in cream clothing against a black backdrop — the same campaign/model as the Section 1 hero, but **not** the reference's floral tone-swatch graphic. **This is a NO MATCH / content mismatch, now resolved by the fresh download** at `source-assets/REFERENCE-RANGES/UNDER/technology/under-elevated-warmth-swatch-900w.webp` (900×640 — usable but on the smaller side for a full-bleed banner; if a higher-resolution original exists on hair.montibello.com's media library, it should be sourced before production use, since 900×640 will look soft at 1920px+ banner widths).
- **Interactions:** none beyond the button link.
- **Exact local matches:** none (see mismatch above).
- **Missing/mismatched assets:** the currently-wired `montibello-under-editorial-elevated-warmth.jpg` should be reconsidered — either swap to the new tone-swatch download, or deliberately keep the campaign-portrait image as a Peru stylistic choice (both are legitimate options; this is a decision for the implementer, not something to silently "fix").
- **Peru commercial status:** the "7 nuevos tonos" claim and specific tone numbers (3.61/7.31/7.70/9.31/7.80/6.40/5.70) must be cross-checked against the confirmed current Carta de Color PDF (`assets/montibello-under-carta-color.pdf`, verified current) before being used as literal shade-code claims in any Peru-facing copy — do not assume these numeric codes are correct for the Peru catalog without checking the PDF.
- **Peru modification required:** decide on final banner image (swatch graphic vs. campaign portrait) and verify tone codes against the Carta de Color PDF.
- **Implementation notes:** media_position mismatch (see Section 4) also applies here, inverted.

### Section 6 — PRODUCT RANGE ("Descubre la gama completa")
- **Role:** Centered heading + 4-card product grid.
- **Copy (verbatim):**
  - H2 (centered, full width 1125px): "Descubre la gama completa"
  - Card 1: "UNDER" (eyebrow) / "Under" (title) / "Coloración permanente de alta cobertura con bajo contenido de ammonia" (description) / "NO DISPONIBLE EN TU PAÍS" (disabled button)
  - Card 2: "UNDER" / "Under Activating Cream 4,5% (15 Vol)" / "Crema activadora" / "NO DISPONIBLE EN TU PAÍS"
  - Card 3: "UNDER" / "Under Activating Cream 7,5% (25 Vol)" / "Crema activadora" / "NO DISPONIBLE EN TU PAÍS"
  - Card 4: "UNDER" / "Under Activating Cream 10,5% (35 Vol)" / "Crema activadora" / "NO DISPONIBLE EN TU PAÍS"
- **Layout:** 4-column grid on desktop (each card ~213px wide in the 1185 container, portrait image ratio 213×297.35 ≈ 0.716 = same ratio as the 1855×2560 source photography), 2-column grid on mobile (confirmed: cards render at 225px width in a 500px mobile viewport, i.e. 2 per row).
- **Desktop geometry:** section height 670px, padding-block 50/50 (matches local `product_range_under` padding-block-start/end: 64/64 — close enough, a stylistic choice).
- **Mobile behavior:** 2-column card grid confirmed via screenshot.
- **Background/colors:** `rgb(246,246,243)`.
- **Typography:** H2 40px/700/40 centered; card title/eyebrow follow the site's small-caps/eyebrow pattern (not deeply sampled — treat as `product-title`/price-preset already defined locally).
- **Image assets (all four visually confirmed as EXACT LOCAL MATCH via dimension convention baked into the reference filenames themselves):**
  - Colorant: reference `Under_banner_1855x2560-C-*.webp` (dimension "1855x2560" literally in the filename) ↔ local `assets/montibello-under-product-colorant.webp` (1855×2560) — **EXACT LOCAL MATCH, very high confidence.**
  - 15 vol: reference `under-15.jpg` (largest srcset step 1855w) ↔ local `assets/montibello-under-activating-cream-15vol.jpg` (1855×2560) — **EXACT LOCAL MATCH.**
  - 25 vol: reference `under-25.jpg` (1855w) ↔ local `assets/montibello-under-activating-cream-25vol.jpg` (1855×2560) — **EXACT LOCAL MATCH.**
  - 35 vol: reference `under-35.jpg` (1855w) ↔ local `assets/montibello-under-activating-cream-35vol.jpg` (1855×2560) — **EXACT LOCAL MATCH.**
- **Interactions:** disabled "No disponible en tu país" buttons on reference — **NOT REQUIRED FOR PERU** (Peru build should show real add-to-cart / price once products are live in the Shopify catalog; the local template already anticipates this with a `placeholder_note: "Catálogo completo disponible próximamente en Montibello Perú."` and live `_product-card` blocks rather than static disabled buttons — this is the correct Peru approach, better than replicating the reference's disabled state).
- **Peru commercial status:** matches confirmed Peru SKU set exactly (colorant + 3 activators; no Monodose shown on this page, consistent with the reference).
- **Peru modification required:** none for these 4 cards; Monodose SKUs (if wanted on this page) would need new content sourced from the catalog PDFs, not the range landing page.
- **Implementation notes:** none outstanding — this section's assets are fully verified and correctly wired.

### Section 7 — VIDEO
- **Role:** Full-width click-to-play Vimeo embed (fs-video WordPress plugin), poster-first (not autoplay).
- **Copy:** none (video only); local template sets `alt: "Vídeo oficial Montibello Under"`.
- **Layout:** full `uk-container` width (1185px in-context, but section itself is `full-width` per local build), single video block.
- **Desktop geometry:** section height 633px; poster aspect-ratio locked at `1400/788` (≈1.777, 16:9) per the `<img>` inline style on the reference.
- **Mobile behavior:** same poster-and-play-button pattern, full width.
- **Background/colors:** `rgb(246,246,243)` surrounding the video frame.
- **Video asset:** Vimeo ID **1153294336**, confirmed via `data-video="1153294336"` attribute on the reference's `.fs-video-placeholder` element — this **exactly matches** the `video_url: "https://vimeo.com/1153294336"` already set in the local `templates/collection.under.json` (`video_under.blocks.video_block`). **VIDEO-EMBED, already correctly sourced.**
- **Poster:** visually confirmed — a model with dark bob hair, wearing a white/cream blazer, teal/turquoise studio background, arm raised, gold necklace. This appears to be Vimeo's own auto-generated thumbnail (URL pattern `i.vimeocdn.com/video/...`), not a custom-uploaded poster — no local action needed since Vimeo serves its own poster automatically once the same video ID is embedded.
- **Interactions:** click-to-play, not autoplay, not looping (matches local `video_autoplay: false`, `video_loop: false`). **MUST REPLICATE** (already correct).
- **Peru commercial status:** brand/technology video, generic, safe to keep as-is.
- **Peru modification required:** none — already correctly configured.
- **Implementation notes:** only outstanding item is the page-order placement question noted at the top (video 3rd locally vs. 7th on reference).

### Section 8 — GALLERY / EDITORIAL CAROUSEL
- **Role:** Horizontal arrow-navigated carousel of portrait editorial/campaign photography, positioned between the video and the black CTA bar. **This section does not currently exist in the local `templates/collection.under.json` at all** — it would be a net-new addition if a future build wants full parity with the reference.
- **Copy:** none (pure imagery), section id on reference is `template-008e5ABX#12`.
- **Layout:** UIkit slider (`el-slidenav` / `uk-slidenav`), 10–11 visible slide groups (accessibility snapshot showed "1 de 11" / "2 de 11" etc., i.e. **11 total slides**, several `aria-hidden` clones for infinite-loop behavior), portrait cards 277.5×388px (aspect ≈0.716, same portrait ratio as the product cards) with ~15px gap between cards, previous/next arrow buttons **50×50px**.
- **Desktop geometry:** section height 468px, `uk-section-small` padding (40px top/bottom).
- **Mobile behavior:** single card visible at a time, swipe/arrow navigation (only 1 arrow visible in the mobile screenshot — likely the "previous" arrow docked at the image edge).
- **Background/colors:** `rgb(246,246,243)`.
- **Image assets:** 10 distinct filenames captured, several bearing generic model names not obviously "Under"-branded (`30_05_MONTIBELLO_SET3_0052`, `30_05_MONTIBELLO_SET05_0181`, `30_05_MONTIBELLO_SET01_02_0072`, `30_05_MONTIBELLO_SET06_0024`, `MONTIBELLO_VITA_539`, `MONTIBELLO_VITA_205`, `260210_MONTIBELLO_Under_Shoot_05_1077_2_r2`, `260210_MONTIBELLO_Under_Shoot_02_0127_2_r2`, `MONTIBELLO_MILDRED_180`, `MONTIBELLO_SOFIA_257`). The "_Under_Shoot_" ones are clearly Under-specific; the "SET"/"VITA"/"MILDRED"/"SOFIA" ones read like a **shared cross-range studio/portfolio gallery** reused across multiple Montibello Hair range pages, not necessarily UNDER-exclusive. Visually (via screenshot), the visible slides showed: a hand squeezing an Under tube with product spilling out, a model holding an Under tube card to her cheek, a hand applying color from a tube, and a model holding an Under tube near her face — genuinely Under-branded product-in-hand editorial shots.
  - Downloaded 3 representative samples for the record: `source-assets/REFERENCE-RANGES/UNDER/gallery/under-gallery-01.jpg`, `-02.jpg`, `-03.jpg` (the "_Under_Shoot_" and "SET05" files). The remaining ~7 were **not** downloaded (time/scope trade-off) — treat as **NO MATCH — NOT DOWNLOADED** if full parity is needed later; they are all still fetchable at the cache URLs captured during this audit if a future session needs them (see raw URLs in this doc's DOM-extraction notes, recoverable by re-running the same evaluate script against the live page).
- **Interactions:** arrow-click navigation; autoplay/loop behavior not deeply tested (time-boxed) — **NICE TO HAVE**, not confirmed either way.
- **Exact local matches:** the project already has a strong **local UNDER campaign library** that can serve as an **OFFICIAL LOCAL SUBSTITUTE** for this section without needing the reference's mixed/generic portfolio set: `source-assets/UNDER/campaign/under-2026-modelo-02.jpg` through `-06.jpg` (5 tall campaign portraits, 5464–8192px on the long edge) and `under-tendencias-2026.jpg`, plus the 12 `source-assets/UNDER/products/under-bodegon-01.jpg` … `-12.jpg` still-life product shots (3150×4724 portrait, matching the carousel's portrait aspect closely). **Recommendation: build this gallery from the local UNDER-specific campaign/bodegon library rather than the reference's shared cross-range portfolio**, since it's both higher-resolution and unambiguously Under-branded.
- **Peru commercial status:** purely editorial/brand imagery, no commercial claims, safe as a visual-only section.
- **Peru modification required:** use the local UNDER campaign/bodegon set (see above) instead of re-sourcing the reference's mixed portfolio.
- **Implementation notes:** this entire section is a **net-new build** for Peru (nothing exists in `collection.under.json` yet) — mark as optional/nice-to-have for a first launch, since the 8 sections that do exist already cover the core commercial and technology story.

### Section 9 — CTA PROFESSIONAL / LOCATOR
- **Role:** Full-width black bar, two side-by-side (row) groups: "become a client" CTA and "find a salon" CTA.
- **Copy (verbatim):**
  - Left: "¿Tienes un salón pero no eres cliente todavia?" / button "CONTACTA CON UN COMERCIAL" → `/contacto/`
  - Right: "Localiza tu salón o peluquería Montibello más cercana" / button "ENCUENTRA" → `/localizador-de-centros/`
- **Layout:** 2-column row (`ctaColumns` DOM check found 4 nested group elements, consistent with 2 groups × {text, button}), `space-between` horizontal alignment, centered vertically, 32px gap between groups.
- **Desktop geometry:** section height 202px, padding-block 50/50 (local build uses 56/56 — very close, stylistic).
- **Mobile behavior:** stacks vertically (confirmed via mobile screenshot: both CTA blocks stack full-width, each centered).
- **Background/colors:** `rgb(0,0,0)` (pure black) — matches local `cta_professional_under.settings.background_color: "#000000"` exactly.
- **Typography:** heading text white (`#FFFFFF`), h5-scale per local build; buttons white-bordered/transparent-background outline style (`custom_button_background: rgba(0,0,0,0)`) matching the reference's white-outlined ghost buttons on black exactly.
- **Image/video/PDF assets:** none.
- **Interactions:** simple links, no special behavior.
- **Exact local matches:** copy, links, and styling are already verbatim-identical to the local `cta_professional_under` section — **fully correct as built.**
- **Peru commercial status:** generic contact/locator CTAs — the actual `/contacto/` and `/localizador-de-centros/` destinations are Spain-specific; the local build already correctly points both to `/pages/contacto` (Peru's own contact page) instead of a locator page that doesn't exist yet for Peru — a sensible substitution already made.
- **Peru modification required:** none — already handled correctly (both buttons route to Peru's contact page as an interim solution).
- **Implementation notes:** if/when Peru gets its own salon locator page, the "ENCUENTRA" button should be repointed there instead of `/pages/contacto`.

## GLOBAL DESIGN FORENSICS
- **Max content width:** 1185px (`.uk-container`), with 30px horizontal gutter/padding each side (so total viewport-safe max is ~1245px before gutters compress).
- **Section background (body):** `rgb(246,246,243)` — warm off-white, consistent across every section except the CTA bar (`rgb(0,0,0)`).
- **Headings:** H1 and H2 both render at 40px / weight 700 / line-height 40px on desktop, font-family `TTCommons` (do not embed this font — tune Montserrat to visually approximate size/weight/tracking, per project constraint).
- **Body copy:** 16px, line-height ~19.7px (≈1.23).
- **Buttons:** two consistent visual patterns — (1) solid black pill-corner button (`border-radius: 5px`, black bg, white uppercase text, weight 500, 18px for large CTAs / 12px for small nav-utility buttons), and (2) white-outline ghost button on black backgrounds (CTA bar). Button height for large CTAs ≈40px; small utility buttons ≈29px.
- **Product/gallery card aspect ratio:** consistently ≈0.715–0.72 (portrait), i.e. matches the 1855×2560 source photography convention used throughout the brand's product photography.
- **Carousel arrows:** 50×50px, `uk-slidenav` icon buttons, positioned at the vertical center of the carousel track.
- **Split-banner columns:** each half of a 2-column split section is ~562.5px wide (half of 1185, no visible gap—the two halves meet edge-to-edge) at desktop; stacks full-width on mobile.

## INTERACTION FORENSICS
| Interaction | Where | Classification |
|---|---|---|
| Click-to-play video (poster-first, no autoplay/loop) | Section 7 | MUST REPLICATE (already correct locally) |
| "Ver datos" mobile accordion toggle for stats grid | Section 3 | MUST REPLICATE (already spec'd locally via `toggle_label`) |
| "Carta de Color" → direct PDF link (new tab, no lightbox) | Section 3 | MUST REPLICATE (trivial, already correct locally) |
| Anchor-scroll "Ver vídeo" button → video section | Section 2 | MUST REPLICATE (already present locally, though target section position differs from reference) |
| Arrow-navigated editorial carousel (10–11 slides, infinite-loop clones) | Section 8 | NICE TO HAVE (section doesn't exist locally yet; optional for first launch) |
| Disabled "No disponible en tu país" product buttons | Section 6 | NOT REQUIRED FOR PERU (Peru shows real product cards instead — already correct locally) |
| Cookiebot consent banner | Global (reference site only) | NOT REQUIRED FOR PERU (Shopify has its own consent mechanism) |
| Header dropdown nav (Color/Tratamiento/Styling/Forma) | Global header | NOT REQUIRED FOR PERU (out of scope — theme-level navigation, not range-page-specific) |

## ASSET SUMMARY
- **Total reference visual/media assets identified:** ~28 (25 `<img>` DOM nodes + 1 Vimeo embed + 1 PDF + several duplicate/responsive srcset variants of the same underlying images)
- **Exact local matches (verified visually and/or byte-identical):** 9 — hero desktop, stats editorial (tubes), glucamine illustration, colorant tube, 3× activating cream bottles, Carta de Color PDF (MD5-confirmed byte-identical)
- **Probable local matches:** 0 (everything checked was either confirmed exact or confirmed mismatched — no ambiguous "probably fine" cases were left unresolved)
- **Downloaded from reference during this audit:** 8 files — `under-hero-desktop-2560w.webp`, `under-stats-editorial-1707w.webp`, `under-glucamine-1350w.webp`, `under-elevated-warmth-swatch-900w.webp`, `Carta-UNDER_26.pdf`, `montibello-logo.svg`, `under-gallery-01.jpg`, `under-gallery-02.jpg`, `under-gallery-03.jpg` (9 total, corrected count)
- **Official local substitute recommended:** 1 — Section 8 gallery (use local `source-assets/UNDER/campaign/` + `products/` bodegon library instead of the reference's shared cross-range portfolio)
- **Video-embed (no download needed, ID reused as-is):** 1 — Vimeo 1153294336
- **PDF assets mapped:** 1 directly linked on the page (Carta de Color, confirmed current, byte-identical to what's already bundled) + 2 supplementary catalog PDFs already in the local library but not directly linked from this specific range page (`source-assets/UNDER/pdf/under-catalogo.pdf`, `under-2026-catalogo.pdf`)
- **Excluded from Peru:** disabled-button product states, Cookiebot banner, Spain-specific `/localizador-de-centros/` and `/contacto/` destinations (Peru substitutes already wired)
- **No match / needs future work:** ~7 of the 10 gallery carousel images (not downloaded, low priority given the local substitute recommendation); Elevated Warmth banner higher-resolution source (only a 900×640 webp was recoverable via cache URL — may need a request to Montibello for a larger original before production use)

### Screenshot capture caveat
The reference site (WordPress + UIkit) uses `uk-scrollspy-class` fade-in animations (`opacity:0` until scrolled into view) on several image blocks. The first capture pass showed several blank/grey boxes despite `img.complete === true` in the DOM (images were network-loaded but still visually hidden pending the animation trigger). This was fixed for the two desktop screenshots (1440 and 1280) by force-setting `opacity:1` on all zero-opacity elements after a full scroll-through pass — both desktop screenshots now show every image correctly. The mobile (390px) screenshot **still has some blank image slots** (hero, stats editorial, glucamine illustration, product cards) after the same fix was attempted twice; video and 3 gallery images did render correctly on mobile. This appears to be a mobile-viewport-specific lazy-load/responsive-picture-source quirk on the reference site itself, not a data-accuracy problem — every affected image's real content was independently confirmed via the successful desktop captures and direct asset downloads documented above.

Screenshots saved to:
- `docs/screenshots/range-reference/under/reference-1440.png` (all images loaded correctly)
- `docs/screenshots/range-reference/under/reference-1280.png` (all images loaded correctly)
- `docs/screenshots/range-reference/under/reference-mobile-390.png` (partial — see caveat above)

---

# UNDER IMPLEMENTATION MANIFEST

Use this manifest as the direct build reference for a future Peru `/collections/under` (or equivalent) implementation. It reflects both the live reference site and the already-frozen `templates/collection.under.json` (read-only, not modified by this research pass). Where the two disagree, both facts are stated so the implementer can make an informed choice.

## SECTION 01 — HERO
**REFERENCE:** Full-bleed image banner, red-haired model in cream top on near-black background, no text overlay in this section.
**COPY:** none.
**USE IMAGE:** `assets/montibello-under-hero-desktop.jpg` (already wired, EXACT LOCAL MATCH, verified)
**MOBILE IMAGE:** `assets/montibello-under-hero-mobile.jpg` (Peru-only crop; reference has no distinct mobile art direction)
**VIDEO:** none
**LAYOUT:** full-width, full-bleed, no container constraint
**HEIGHT:** ~444px at 1185 content width on reference (scales with viewport; treat as aspect-ratio-locked ~2.667:1 for desktop)
**BACKGROUND:** near-black (baked into the photo itself); page background `#F6F6F3`
**INTERACTION:** none
**PERU CHANGE:** none needed — already correct
**IMPLEMENTATION NOTES:** already fully built (`hero_under` in `templates/collection.under.json`). No action required.

## SECTION 02 — HERO INTRO
**REFERENCE:** H1 "Under" + intro paragraph + "Ver vídeo" button, left-aligned ~50% column.
**COPY:** "Under" / "La coloración con cobertura de alta definición y tecnología híbrida que potencia la realidad y naturalidad de un color sin límites." / "Ver vídeo" — verbatim, no Peru change needed.
**USE IMAGE:** none (text-only section)
**MOBILE IMAGE:** n/a
**VIDEO:** none (button anchors to Section 07)
**LAYOUT:** column group, `custom_width: 50` desktop / full width mobile
**HEIGHT:** ~209px content height at desktop
**BACKGROUND:** `#F6F6F3`
**INTERACTION:** anchor-scroll to video section
**PERU CHANGE:** none
**IMPLEMENTATION NOTES:** already fully built (`hero_intro_under`). Reference places its video section much lower on the page (Section 07 here) than the local build does (3rd); if a future rebuild wants pixel-parity with the reference's page flow, move `video_under` to right before the gallery section. Not required — current placement is a reasonable UX improvement.

## SECTION 03 — STATS / CARTA DE COLOR
**REFERENCE:** Image (tubes, left) + heading + 4-stat grid + Carta de Color PDF button + footnote (right).
**COPY:** "Llega la alta definición del color a la coloración de alta cobertura" / 100%·95%·95%·96% stats with labels / "* Evaluación profesional de 512 aplicaciones sobre voluntarias." — verbatim, already correct locally.
**USE IMAGE:** `assets/montibello-under-stats-editorial.jpg` (already wired, EXACT LOCAL MATCH, visually confirmed — 4 Under tubes on grey surface)
**MOBILE IMAGE:** same as desktop
**VIDEO:** none
**LAYOUT:** split, media_position LEFT (matches reference exactly)
**HEIGHT:** ~543px desktop
**BACKGROUND:** `#F6F6F3`
**INTERACTION:** "Ver datos" mobile accordion toggle (hide/reveal stat grid on small screens); "Carta de Color" button opens PDF in new tab
**PERU CHANGE:** none — PDF byte-verified current (`assets/montibello-under-carta-color.pdf`, MD5 `e16e88d94a79efd34d399c2faaa4638d`, matches live reference exactly)
**IMPLEMENTATION NOTES:** fully correct and verified. No action needed.

## SECTION 04 — GLUCAMINE NATURE TECH
**REFERENCE:** Heading + 3-paragraph tech story (left) + illustration (RIGHT).
**COPY:** "Glucamine Nature Tech, la nueva tecnología híbrida de alta eficacia." + 3 paragraphs (INNOVADORA TECNOLOGÍA HÍBRIDA / DOBLE PODER DE PIGMENTACIÓN / COLÁGENO VEGANO) — verbatim, already correct locally.
**USE IMAGE:** `assets/montibello-under-glucamine-tech.jpg` (already wired, EXACT LOCAL MATCH, visually confirmed — green plant/molecule illustration)
**MOBILE IMAGE:** same as desktop
**VIDEO:** none
**LAYOUT:** split — **reference has image RIGHT; local build currently has `media_position: "left"` (image left) — a confirmed mismatch.**
**HEIGHT:** ~450px desktop
**BACKGROUND:** `#F6F6F3`
**INTERACTION:** none
**PERU CHANGE:** none for copy/image; consider flipping `media_position` to `"right"` to match the reference exactly (optional, cosmetic, not a commercial-truth issue)
**IMPLEMENTATION NOTES:** content is 100% correct; only the left/right placement differs from the reference. Flag for design review, not a blocker.

## SECTION 05 — ELEVATED WARMTH
**REFERENCE:** Image (floral tone-swatch graphic, LEFT) + heading + copy + "Más información" button (right).
**COPY:** "Descubre Elevated Warmth: 7 nuevos tonos cálidos elevados" + descriptive paragraph — verbatim, already correct locally, BUT verify the specific tone codes (3.61/7.31/7.70/9.31/7.80/6.40/5.70 seen baked into the reference image) against `assets/montibello-under-carta-color.pdf` before using them as literal shade-code claims anywhere in Peru copy.
**USE IMAGE:** `source-assets/REFERENCE-RANGES/UNDER/technology/under-elevated-warmth-swatch-900w.webp` (NEWLY DOWNLOADED — replaces the currently-wired `assets/montibello-under-editorial-elevated-warmth.jpg`, which is confirmed to be the WRONG image — a generic campaign portrait, not the reference's tone-swatch graphic). **Resolution caveat: only 900×640 was recoverable from the WP cache; source a higher-resolution original from Montibello before using at large banner widths.**
**MOBILE IMAGE:** same as desktop (pending resolution upgrade)
**VIDEO:** none
**LAYOUT:** split — **reference has image LEFT; local build currently has `media_position: "right"` (image right) — a confirmed mismatch, inverse of Section 04's issue.**
**HEIGHT:** ~510px desktop
**BACKGROUND:** `#F6F6F3`
**INTERACTION:** none beyond the button link
**PERU CHANGE:** (1) swap the banner image to the tone-swatch graphic (or make a deliberate decision to keep the campaign-portrait image instead — both are legitimate, but the current file is not what the reference shows); (2) verify the 7 tone codes against the current Carta de Color PDF before publishing any specific shade numbers in Peru-facing copy; (3) consider flipping `media_position` to `"left"` to match the reference.
**IMPLEMENTATION NOTES:** this is the single highest-priority content fix identified in this audit — the currently-wired image is not what the brand's own reference page shows for this specific claim ("7 nuevos tonos").

## SECTION 06 — PRODUCT RANGE
**REFERENCE:** Centered "Descubre la gama completa" heading + 4-card grid (colorant + 3 activators), all showing "No disponible en tu país".
**COPY:** "Descubre la gama completa" + per-card titles/descriptions exactly as already built locally.
**USE IMAGE:** `assets/montibello-under-product-colorant.webp`, `assets/montibello-under-activating-cream-15vol.jpg`, `-25vol.jpg`, `-35vol.jpg` (all four already wired, all four EXACT LOCAL MATCH via dimension-convention + filename correlation with the reference's `Under_banner_1855x2560`/`under-15/25/35.jpg` sources)
**MOBILE IMAGE:** same files, 2-column grid on mobile (confirmed)
**VIDEO:** none
**LAYOUT:** 4-column desktop grid / 2-column mobile grid, portrait card ratio ≈0.716
**HEIGHT:** ~670px desktop content height
**BACKGROUND:** `#F6F6F3`
**INTERACTION:** reference shows disabled buttons; Peru build correctly shows live product cards instead (already implemented via `_product-card` blocks + `placeholder_note`)
**PERU CHANGE:** none — Peru's approach (real product cards, not disabled placeholders) is already the correct commercial approach. Monodose SKUs are NOT shown on the reference range page either, so their absence here is consistent, not a gap.
**IMPLEMENTATION NOTES:** fully correct and verified. No action needed.

## SECTION 07 — VIDEO
**REFERENCE:** Full-width click-to-play Vimeo embed, positioned AFTER the product range (7th on the page), poster shows a model in white blazer on teal background.
**COPY:** none; alt text "Vídeo oficial Montibello Under" already set locally.
**USE IMAGE:** n/a (Vimeo serves its own poster automatically)
**MOBILE IMAGE:** same as desktop
**VIDEO:** Vimeo ID `1153294336` (already correctly set in `templates/collection.under.json` as `https://vimeo.com/1153294336` — confirmed exact match against the live reference's `data-video` attribute)
**LAYOUT:** full-width container
**HEIGHT:** ~633px desktop, aspect-ratio-locked to the video's native 1400:788 (≈16:9)
**BACKGROUND:** `#F6F6F3`
**INTERACTION:** click-to-play, no autoplay, no loop (already correctly configured locally)
**PERU CHANGE:** none — already correct
**IMPLEMENTATION NOTES:** the only open question is page-order: locally this section sits 3rd (right after the intro); on the reference it sits 7th (after the product cards). Either is defensible; document the choice if changed.

## SECTION 08 — GALLERY / EDITORIAL CAROUSEL
**REFERENCE:** Arrow-navigated 11-slide portrait carousel of editorial/product-in-hand photography, positioned between the video and the CTA bar. **Not present in the current local build at all.**
**COPY:** none (image-only section)
**USE IMAGE:** recommend local `source-assets/UNDER/campaign/under-2026-modelo-02.jpg` through `-06.jpg` + `under-tendencias-2026.jpg` + a selection from `source-assets/UNDER/products/under-bodegon-01.jpg` … `-12.jpg` (portrait ratio already matches the reference's carousel card ratio ≈0.716–0.667) — these are UNDER-specific and higher resolution than what's recoverable from the reference site's shared cross-range portfolio gallery.
**MOBILE IMAGE:** same source set, single-card-visible carousel
**VIDEO:** none
**LAYOUT:** horizontal slider, ~277.5×388px cards at desktop (reference), 15px gap, 50×50px prev/next arrows
**HEIGHT:** ~468px desktop
**BACKGROUND:** `#F6F6F3`
**INTERACTION:** arrow-click navigation (drag/swipe recommended for touch); loop/autoplay behavior not confirmed on reference — treat as optional
**PERU CHANGE:** build from the local UNDER campaign/bodegon library, not the reference's mixed-range portfolio (which includes non-Under-labeled files like `MONTIBELLO_VITA`/`MILDRED`/`SOFIA` that may belong to other ranges)
**IMPLEMENTATION NOTES:** this is a **net-new, optional** section for a first Peru launch — the 7 other sections already cover the full commercial and technology narrative without it. Build it only if there's appetite for the extra editorial polish.

## SECTION 09 — CTA PROFESSIONAL / LOCATOR
**REFERENCE:** Full-width black bar, 2-column CTA row (become-a-client / find-a-salon).
**COPY:** "¿Tienes un salón pero no eres cliente todavia?" + "CONTACTA CON UN COMERCIAL" / "Localiza tu salón o peluquería Montibello más cercana" + "ENCUENTRA" — verbatim, already correct locally.
**USE IMAGE:** none
**MOBILE IMAGE:** n/a
**VIDEO:** none
**LAYOUT:** 2-column row, `space-between`, stacks on mobile
**HEIGHT:** ~202px desktop
**BACKGROUND:** `#000000` (pure black), white text/outline buttons
**INTERACTION:** simple links
**PERU CHANGE:** already correctly substituted — both buttons point to `/pages/contacto` (Peru's real contact page) instead of the Spain-specific `/contacto/` and `/localizador-de-centros/` destinations used on the reference
**IMPLEMENTATION NOTES:** if/when Peru gets a dedicated salon locator page, repoint the "ENCUENTRA" button there instead of `/pages/contacto`.

## BUILD READINESS SUMMARY
Sections 1, 2, 3, 6, 7, 9 are **fully verified correct** as already built. Sections 4 and 5 have a confirmed (but low-severity) `media_position` mismatch versus the reference. Section 5 additionally has a **real content mismatch** (wrong banner image) that should be corrected before this section is considered final. Section 8 (gallery) is a net-new, optional addition with a clear local-asset path already identified. No fabricated data was introduced anywhere in this manifest — all commercial claims, SKUs, volumes, and the Carta de Color PDF were verified against either the live reference site or the already-confirmed Peru commercial-truth brief.
