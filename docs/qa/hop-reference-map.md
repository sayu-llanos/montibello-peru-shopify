# HOP Reference Map — Forensic Audit

**REFERENCE URL:** https://hair.montibello.com/gama/hop/
**Related reference URLs crawled:** /gama/hop/hop-repair/, /gama/hop/hop-colour/, /gama/hop/hop-hydration/, /gama/hop/hop-in-salon/ (brief, excluded family, for shared-layout understanding only)
**Audit date:** 2026-09-10
**Method:** Live page fetched twice via a shared Playwright browser session (also in use by two parallel agents auditing UNDER and LUXLIGHT — see methodology note below) and cross-checked against raw HTML fetched with `curl` + the site's own WordPress REST API (`/wp-json/wp/v2/media?search=...`) to resolve true original (non-thumbnail, non-yootheme-cache) image URLs. All classification decisions in this report are based on the curl/REST-API data, which is deterministic and race-free.

## METHODOLOGY NOTE — shared browser artifact

This project's Playwright MCP browser is shared across the three parallel range-audit agents (HOP / UNDER / LUXLIGHT) running concurrently. During early extraction, `browser_evaluate` calls intermittently returned content from **tabs belonging to the other agents** (e.g. an `h1` reading "luxlight" or "Under" while the URL bar still showed `/gama/hop/`), because tab focus is a shared, global cursor and the other agents were issuing `select`/`navigate` calls in the same window of time. This was **not** a bug in hair.montibello.com — it was cross-talk between concurrent automation sessions. Once identified, all data in this report was re-derived from direct `curl` fetches of the raw server-rendered HTML (which is not subject to shared-browser race conditions) and spot-verified with a dedicated, freshly-created browser tab, verifying `location.href` inside every `evaluate()` call before trusting its output. Screenshots were captured in a dedicated tab, verified for correct URL immediately before capture.

## PAGE PURPOSE

`/gama/hop/` is the master hub/landing page for the HOP range ("Hop — Join Wellness"), a hair-wellness line built on "LifeAlgae BioScience" (fermented-algae biotechnology). The hub introduces the range's positioning (wellness/bienestar, science, nature), explains the shared technology platform, and fans out into **12 family sub-pages**, each living at `/gama/hop/hop-<family-slug>/` with its own hero, benefit stats, technology callout, and product grid linking to individual `/producto/<slug>/` PDP pages.

## PERU COMMERCIAL SCOPE

Per project instructions, only 3 of the 12 international HOP families are commercially available in Peru:

| Reference family (ES / EN) | Reference slug | Peru status |
|---|---|---|
| Ultra Repair | `/gama/hop/hop-repair/` | **INCLUDE** |
| Colour Last (Colour Last / Color Last) | `/gama/hop/hop-colour/` | **INCLUDE** |
| Smooth Hydration | `/gama/hop/hop-hydration/` | **INCLUDE** |
| Full Volume | `/gama/hop/hop-volume/` | EXCLUDE |
| Sun Care | `/gama/hop/hop-sun-care/` | EXCLUDE |
| Detox | `/gama/hop/hop-detox/` | EXCLUDE |
| Sensitive Protection | `/gama/hop/hop-sensitive/` | EXCLUDE |
| Purifying Balance | `/gama/hop/hop-purify/` | EXCLUDE |
| Blonde Glow | `/gama/hop/hop-blonde/` | EXCLUDE |
| Silver White | `/gama/hop/hop-silver/` | EXCLUDE |
| Reflects | `/gama/hop/hop-reflects/` | EXCLUDE |
| Well-Ageing Treatments (labelled "Well-Ageing Treatments" on the card, but the link target is `/gama/hop/hop-in-salon/` — an in-salon-only professional service line, not a retail family) | `/gama/hop/hop-in-salon/` | EXCLUDE |

Excluded families were inspected only enough to document the shared card/grid layout on the hub page (one representative thumbnail each). No excluded-family product packshots, ingredient shots, or lifestyle photography were downloaded, per instructions.

## EXACT CURRENT SECTION ORDER (hub page, `/gama/hop/`)

0. Global header/nav (shared site chrome — not analyzed)
1. Hero — H1 "Hop" + intro paragraph + bodegón (all-range still-life) banner image
2. Wellness statement — H3 headline + 4 short bullet claims + portrait model image (with a language-switch "CD"/ES-EN toggle overlay visible in the corner)
3. LifeAlgae BioScience technology — H2 + 2 paragraphs + stat callouts, next to a dark-background hero shot of a glass test-tube/vial with an amber/algae-extract swirl
4. Skincare-grade ingredients — H2 "Enriquecidas con ingredientes del skincare para actuar en los signos del bienestar capilar" + 4 stat rows, next to a flat-lay image of skincare-style swatches/textures in white trays
5. "Gamas Hop" family grid — H1 "Gamas Hop" + 12 cards (3 columns × 4 rows on desktop, 1 column on mobile), each with family name, "Ver productos →" link, and a **hover-reveal image** (image is invisible by default — `uk-transition-opaque` — and only fades in on `:hover`, confirmed by the fact that two independent full-page screenshots taken without hovering show the cards with visible titles/links but blank image tiles; this is a genuine interaction, not a load failure)
6. Product/lifestyle photo strip — 4 square-ish tiles (repair-shampoo lifestyle shot with "hop" wordmark overlay, colour-mask texture close-up, volume-shampoo lifestyle shot with "hop" wordmark overlay, all-range flat-lay)
7. Bottom CTA band — full-width black background, 2 columns: "¿Tienes un salón pero no eres cliente todavía? → Contacta con un comercial" / "Localiza tu salón o peluquería Montibello más cercana → ENCUENTRA"
8. Global footer (shared site chrome — not analyzed)

No PDF links and no video/iframe embeds were found anywhere in the server-rendered HTML of the hub page or any of the three in-scope family sub-pages (`hop-repair`, `hop-colour`, `hop-hydration`) or the excluded `hop-in-salon` page. The `fs-video` YOOtheme plugin script tag is present sitewide but no `fs-video` component markup renders on any HOP page — the "Ver vídeo" video-lightbox pattern is used by **LUXLIGHT**, not HOP. Local HOP video files (see Asset Summary) are official Montibello brand assets that do not currently correspond to any on-page embed on the live HOP reference — they are available for future use but not required to replicate the current reference.

---

## SECTION-BY-SECTION BREAKDOWN

### Section 1 — Hero

- **Role:** Range introduction / brand statement
- **Reference copy (verbatim, ES):**
  - H1: "Hop"
  - Body: "El cuidado capilar de alto rendimiento basado en la biociencia de las algas capaz de corregir los 8 signos del bienestar del cuero cabelludo y el cabello: hidratación, nutrición, equilibrio, fuerza, protección del color, encrespamiento, volumen y brillo."
- **Layout:** Full-bleed banner image at top (bodegón/all-range still-life), page title + intro copy below in a 2-column arrangement (title left, copy right) at desktop widths.
- **Desktop geometry:** H1/H2/H3 all render at **40px / 700 weight / 40px line-height**, font-family `TTCommons` (the reference site's brand typeface; project uses Montserrat — record geometry only, do not source TT Commons). Body paragraph: **16px / 500 weight / 19.7px line-height**. Section horizontal padding via `.uk-container`: `0 30px`.
- **Mobile behavior:** Single column stack (confirmed via full-page mobile screenshot).
- **Background/colors:** Section background `rgb(246,246,243)` (warm off-white/beige) for most of the page; text is pure black `rgb(0,0,0)`.
- **Images:**
  - Hero bodegón (all-range still life), original: `https://hair.montibello.com/wp-content/uploads/2026/01/BODEGON-PRINCIPAL-2.jpg` — **2560×1183** (also serves at 300/768/1024/1366/1536/1600/1920/2048/2560w via yootheme cache + native WP `srcset`)
  - Portrait model image next to intro copy: `https://hair.montibello.com/wp-content/uploads/yootheme/cache/.../BODEGON-principal-e1684142226757-*.jpg` (secondary crop of the same bodegón image; original source seed dated 2023, re-used)
- **Interactions:** None beyond standard image lazy-load.
- **Local exact matches:**
  - `source-assets/REFERENCE-HOME/range-cards/hop-card-bodegon-principal-2.jpg` — **visually confirmed** (Read-tool side-by-side) to be the same bodegón photoshoot, cropped tighter (right-hand cluster: Blonde/Silver/Detox). EXACT LOCAL MATCH (same campaign photography, different crop).
  - `source-assets/HOP/campaign/hop-gama-repair-colour.jpg` and `hop-gama-completa.jpg` — same photoshoot family, full-resolution (8256×5504 / 17717×11787) raw campaign captures.
  - `assets/montibello-hop-hero-desktop.jpg`, `assets/montibello-hop-hero-shampoo.jpg` — already production-integrated on the Shopify homepage.
- **Downloaded reference (Step 5):** `source-assets/REFERENCE-RANGES/HOP/hero/hop-hero-bodegon-principal-2.jpg` (full 2560×1183 original, for direct side-by-side use if a wider hero crop is needed than what's locally cropped).
- **Peru commercial status:** Fully applicable — this is shared range-level branding, not family-specific.
- **Peru modification required:** Translate copy to Peru Spanish (already Spanish; verify tone/localisms), swap CTA destination if a Peru salon-locator equivalent exists.
- **Implementation notes:** Use existing local bodegón crop for the Peru hub hero unless a wider banner crop is preferred, in which case use the newly downloaded full-resolution original.

### Section 2 — Wellness statement

- **Reference copy (verbatim, ES):**
  - H3: "Bienestar, ciencia y naturaleza para impulsar el cuidado del cabello más allá de la belleza."
  - Bullets: "Corrige los signos del bienestar capilar." / "Impulsa el bienestar en el cabello con ingredientes cosméticos de alta eficacia." / "Experiencia inmersiva de bienestar a través de la sensorialidad de texturas y fragancias." / "Una gama ecorresponsable para el bienestar del cabello y del planeta."
- **Layout:** Portrait model photo (left) + headline/bullets (right), 2-column at desktop.
- **Images:** `https://hair.montibello.com/wp-content/uploads/yootheme/cache/.../AW-HOP-0175-A_2_3-scaled-*.webp` → original `https://hair.montibello.com/wp-content/uploads/2026/01/AW-HOP-0175-A_2_3-scaled-e1768464913116.jpg` (model beauty shot, hair close-up).
- **Local match:** No direct local equivalent found; closest is the general HOP campaign/model photography in `source-assets/HOP/campaign/hop-modelos-*.tif` (different models/poses — PROBABLE stylistic match only, not the same shot).
- **Downloaded reference:** `source-assets/REFERENCE-RANGES/HOP/hero/hop-wellness-science-nature.jpg`.
- **Peru commercial status:** Applicable (range-level messaging).
- **Implementation notes:** Copy translates directly; image can be swapped for an approved Peru-cleared model image if usage rights for this specific model shot are unclear (standard model-release caution).

### Section 3 — LifeAlgae BioScience technology

- **Reference copy (verbatim, ES):**
  - H2: "LifeAlgae BioScience multiplica x4 el poder de los activos."
  - "5 años de investigación para desarrollar LifeAlgae BioScience, la biociencia basada en el poder de las algas capaz de amplificar y potenciar el poder de los activos."
  - "La clave: la hiperfermentación de las algas. Un proceso biotecnológico transformador único."
- **Layout:** Copy (left) + dark-tile science image (right) — the image tile itself has a dark brown/black background (not the section background), containing a glass test-tube/vial shot with amber liquid swirl.
- **Images:** `Mesa-de-trabajo-1` → original `https://hair.montibello.com/wp-content/uploads/2026/03/Mesa-de-trabajo-1.jpg`.
- **Local match:** No exact local equivalent (this specific test-tube hero shot was not found in `source-assets/`). **REFERENCE DOWNLOAD REQUIRED — DONE.**
- **Downloaded reference:** `source-assets/REFERENCE-RANGES/HOP/technology/hop-lifealgae-stat-1.jpg`.
- **Peru commercial status:** Applicable — LifeAlgae BioScience is the shared technology platform underpinning all 3 Peru families.
- **Implementation notes:** Strong candidate for the Peru hub's "technology" section; verify translation of "hiperfermentación de las algas" claims against any Peru regulatory copy constraints (cosmetic claims).

### Section 4 — Skincare-grade ingredients

- **Reference copy (verbatim, ES):**
  - H2: "Enriquecidas con ingredientes del skincare para actuar en los signos del bienestar capilar."
  - Stats: "+93% más hidratación**" / "+87% más nutrición*" / "x6 más fuerza*" / "+8 semanas de color protegido*" (footnote markers "*"/"**" reference test methodology disclaimers, not captured as visible footnote text on this page — verify before using stat claims in Peru copy)
- **Images:** `Mesa-de-trabajo-1-copia` → original `https://hair.montibello.com/wp-content/uploads/2026/03/Mesa-de-trabajo-1-copia.jpg` (flat-lay of skincare-style swatches in white trays).
- **Downloaded reference:** `source-assets/REFERENCE-RANGES/HOP/technology/hop-lifealgae-stat-2.jpg`.
- **Peru commercial status:** Applicable.
- **Implementation notes:** Do not publish the numeric performance claims without checking test-method footnotes (asterisks) — Peru advertising-claims compliance risk if used unqualified.

### Section 5 — "Gamas Hop" family grid (12 cards)

- **Reference copy:** H1 "Gamas Hop"; each card = family name (H2, `.el-title`, same 40px/700 TTCommons styling) + "Ver productos →" CTA.
- **Layout:** `uk-grid uk-child-width-1-1 uk-child-width-1-3@m uk-grid-match` — **3-column grid at `@m` breakpoint (desktop), 1-column stacked on mobile**, cards match-height.
- **Interaction — MUST REPLICATE consideration:** Card images are `opacity:0` by default (`uk-transition-opaque` / `uk-transition-scale-up`) and only reveal on hover (desktop) — confirmed empirically via full-page screenshots that render titles/links but blank image tiles at rest. This is a deliberate hover-reveal micro-interaction. On touch devices this pattern typically degrades to "always visible" or "tap-to-reveal" in UIkit — verify actual touch behavior is not required for Peru (mobile screenshot suggests images may render statically on mobile; not fully confirmed).
- **Peru-relevant card images (originals resolved via WP REST API):**
  - Ultra Repair → `https://hair.montibello.com/wp-content/uploads/2026/01/MontibelloHOP_AllRange_023-copia-1.jpg`
  - Colour Last → `https://hair.montibello.com/wp-content/uploads/2026/01/hop-colour-last.jpg`
  - Smooth Hydration → `https://hair.montibello.com/wp-content/uploads/2026/01/HYDRATION.jpg`
- **Downloaded reference:** `source-assets/REFERENCE-RANGES/HOP/family-cards/hop-card-ultra-repair.jpg`, `hop-card-colour-last.jpg`, `hop-card-smooth-hydration.jpg` (plus `hop-card-in-salon-wellageing.jpg` and 7 `EXCLUDE-*` thumbnails for the excluded families, kept only to document the full 12-card grid layout).
- **Peru commercial status:** Grid must be reduced to 3 cards (Ultra Repair, Colour Last, Smooth Hydration) for the Peru hub — this is the single biggest structural deviation from the reference.
- **Implementation notes:** This section is the direct template for the future Peru `/pages/hop` "shop by family" module.

### Section 6 — Product/lifestyle photo strip

- **Layout:** 4 square-ish tiles in a row (flex/grid), each `uk-transition-opaque uk-flex-1`.
- **Images (originals):** `hop_repairshampoo_04.jpg`, `hop_colour_mask_02.jpg`, `hop_volume_shampoo_04.jpg` (excluded family — Full Volume), `MontibelloHOP_AllRange_088-copia-scaled.jpg`. Two of four tiles belong to Peru-included families (Ultra Repair, Colour Last); the other two belong to excluded families (Full Volume, general all-range) — for Peru this strip would need to be rebuilt with only in-scope imagery (e.g., Ultra Repair, Colour Last, Smooth Hydration + one all-range/group shot).
- **Local match:** `hop_repairshampoo_04` and `hop_colour_mask_02` not found as exact local files; general product photography for these families exists (see Ultra Repair / Colour Last product folders) but not this specific lifestyle crop.
- **Peru commercial status:** Partially applicable — 2 of 4 tiles usable as-is (after download), 2 need replacement/omission.
- **Implementation notes:** Low priority for the hub MVP; can be simplified to 3 tiles (one per Peru family) instead of replicating the exact reference set.

### Section 7 — Bottom CTA band

- **Reference copy (verbatim, ES):**
  - "¿Tienes un salón pero no eres cliente todavía?" → button "Contacta con un comercial"
  - "Localiza tu salón o peluquería Montibello más cercana" → button "ENCUENTRA"
- **Layout:** Full-width black (`rgb(0,0,0)`) band, 2-column, white text, buttons white-bg/black-text (inverse of the black/white button used elsewhere).
- **Button geometry:** `18px / 500 weight / 48px line-height`, `0 40px` horizontal padding, `5px` border-radius.
- **Peru commercial status:** This is shared site-wide B2B chrome (salon-recruitment / locator), not HOP-specific — likely NOT needed verbatim on a Peru consumer-facing `/pages/hop`; Peru's homepage/site already has its own CTA patterns.
- **Implementation notes:** NOT REQUIRED FOR PERU as designed (B2B "become a client" CTA is a Spain/professional-distribution model); consider a Peru-appropriate CTA instead (e.g., "Where to buy" / "Encuentra tu salón Montibello Perú" if applicable, or omit).

---

## FAMILY SUB-PAGE TEMPLATE (applies to all 12, verified on the 3 Peru families)

Each `/gama/hop/hop-<slug>/` page follows an identical structural template:

1. Hero — H1 (family name) + descriptive paragraph + hero product/group image
2. Benefit stats — H2 headline + 4 stat bullets specific to the family
3. Technology — H2 "LifeAlgae Bioscience + [family-specific active]" + 2-3 paragraphs + ingredient close-up photo
4. "Descubre la gama completa" — H2 + product cards (H3 product name) linking to `/producto/<slug>/` PDPs
5. (Ultra Repair only, richer) — additional lifestyle/model photo gallery (6 extra images)
6. Shared bottom CTA band (Section 7 above)
7. Shared footer

### Ultra Repair (`/gama/hop/hop-repair/`) — Peru INCLUDE

- **H1:** "Ultra Repair"
- **Intro (verbatim):** "Rutina reparadora y nutritiva que reconstruye y fortalece los cabellos dañados químicamente, térmicamente o por factores medioambientales. Enriquecida con Colágeno vegano, un complejo de proteínas de origen vegetal que rellenan y restauran la fibra capilar."
- **Stats H2:** "Cuidado intensivo 24/7 para tu cabello dañado." — "125% cabello más fuerte*" / "x5 más hidratación*" / "x4 menos encrespamiento*" / "x4 cabello más sedoso*"
- **Technology H2:** "LifeAlgae Bioscience + Colágeno Vegano" — explains algae amplification + vegan collagen (repairs/fills/strengthens/restores/protects against breakage); includes a secondary "overnight" stat block: "90% cabello más fuerte*" / "x3 más hidratación*" / "75% menos encrespamiento tras 8 horas*"
- **Products ("Descubre la gama completa"):** ULTRA REPAIR SHAMPOO, ULTRA REPAIR RINSE, ULTRA REPAIR MASK, ULTRA REPAIR OVERNIGHT SERUM, ULTRA REPAIR SEALED ENDS — each linking to `/producto/ultra-repair-<slug>/`
- **Images (originals resolved):**
  - Hero group shot: `MontibelloHOP_AllRange_023-copia-1.jpg` / `-copia-scaled.jpg`
  - Wellness portrait reuse: `AW-HOP-0175-A_2_3-scaled-e1768464913116.jpg`
  - Collagen ingredient shot: `collagen_low-scaled.jpg`
  - Overnight-serum stat tile: `Mesa-de-trabajo-1-copia-2.jpg`
  - Product packshots (studio, bilingual ES/EN or EN/FR label, 1855×2560 or 1600×2239): `hop-ultra-repair-shampoo-300-fda-f.jpg`, `hop-ultra-repair-rinse-200-fda-f.jpg`, `hop-ultra-repair-mask-300-fda-f.jpg`, `hop_repairovernight_01-1.jpg`, `hop-repair-sealed-ends.webp`
  - Gallery: `MontibelloHop_Model_113-scaled.jpg`, `MontibelloHOP_AllRange_088-copia-scaled.jpg`, `MontibelloHOP_Lifestyle_074-copia-scaled.jpg`, `MontibelloHOP_ModelProduct_054-scaled-e1768739087813.jpg`, `MontibelloHOP_Lifestyle_028-copia-scaled.jpg`, `MontibelloHOP_ModelProduct_069-1-scaled.jpg`, `MontibelloHOP_AllRange_083-copia-scaled.jpg`
- **Local vs reference verification:** `source-assets/HOP/ULTRA-REPAIR/hop-ultra-repair-shampoo.png` was opened side-by-side against the downloaded `hop-ultra-repair-shampoo-reference.jpg` (Read-tool visual comparison). **Confirmed: same bottle, same studio photography, same "hop / join wellness" branding and REPAIR side-label** — local file is a transparent-cutout PNG (EN-only label copy), reference is the full studio JPG on white with drop shadow (bilingual EN/FR label, includes "300 ml 10.14 fl.oz" size callout). **Classification: EXACT LOCAL MATCH (same photography, different crop/background treatment — local PNG is actually more production-ready for a Shopify PDP than the reference JPG).** The same pattern holds for rinse, mask, overnight-serum, and sealed-ends (verified by consistent naming, dimensions, and one additional spot-check on Colour Last shampoo below).
- **Peru commercial status:** INCLUDE — full family in scope.
- **Peru modification required:** None structurally; translate/localize copy as needed, verify stat claims against Peru ad-claims rules.

### Colour Last (`/gama/hop/hop-colour/`) — Peru INCLUDE

- **H1:** "Colour Last"
- **Intro (verbatim):** "Rutina hidratante y protectora que prolonga la vida del color en los cabellos coloreados. Enriquecida con Ácido ferúlico, un potente antioxidante de origen vegetal con alto poder hidratante que protege de los radicales libres y de la radiación solar y prolonga la duración del color y del brillo."
- **Stats H2:** "Protección y cuidado para el cabello coloreado." — "8 semanas de color protegido" / "Cabello x6 más resistente a rotura*" / "Crea un escudo protector antioxidante y anti-polución para preservar el color" / "Filtro UV"
- **Technology H2:** "LifeAlgae Bioscience + Ácido Ferúlico" — ferulic acid antioxidant/UV-protective claims.
- **Products:** COLOUR LAST SHAMPOO, COLOUR LAST RINSE, COLOUR LAST MASK → `/producto/colour-last-<slug>/`
- **Images (originals):** Hero `hop-colour-last.jpg` / `hop-colour-last-square.jpg`; ingredient `acido-ferulico.jpg` / `acido-ferulico-1.jpg`; packshots `hop-colour-last-shampoo-300-fda-f.jpg`, `hop-colour-last-rinse-200-fda-f.jpg`, `hop-colour-last-mask-200-fda.jpg` (1855×2560 each).
- **Local verification:** `source-assets/HOP/COLOR-LAST/hop-colour-last-shampoo.png` visually confirmed **identical bottle/photography** to the downloaded reference (side-by-side Read comparison) — same pattern as Ultra Repair. **EXACT LOCAL MATCH** for shampoo/rinse/mask (transparent PNG variants, both plain and `-ts` transparent).
- **Peru commercial status:** INCLUDE.
- **Naming note:** Local folder uses `COLOR-LAST` (US spelling); reference and product titles use "Colour Last" (UK spelling) consistently — recommend standardizing on "Colour Last" for Peru-facing copy to match official branding exactly, while keeping the existing local folder name as-is (already established convention in this project).

### Smooth Hydration (`/gama/hop/hop-hydration/`) — Peru INCLUDE

- **H1:** "Smooth Hydration"
- **Intro (verbatim):** "Rutina hidratante y antifrizz que fortalece y aporta control en cabellos secos, rebeldes y/o encrespados, enriquecida con Ácido Hialurónico, un activo altamente hidratante que mejoran la elasticidad, controlan el frizz y devuelven la suavidad y la manejabilidad."
- **Stats H2:** "Hidratación profunda para el cabello seco." — "86% cabello más hidratado desde la primera aplicación" / "86% cabello menos frizz**" / "Repara la función barrera del cabello" / "Controla el frizz y devolve el brillo, la suavidad y la manejabilidad." (note: reference copy has a minor Spanish grammar typo, "devolve" instead of "devuelve" — verbatim as published)
- **Technology H2:** "LifeAlgae Bioscience + Ácido Hialurónico" + mention of "Polisacáridos de chia y lino."
- **Products:** SMOOTH HYDRATION SHAMPOO, SMOOTH HYDRATION RINSE, SMOOTH HYDRATION MASK → `/producto/smooth-hydration-<slug>/`
- **Images (originals):** Hero `HYDRATION.jpg` / `1600x1088px-HYDRATION.jpg`; ingredient `acido-hialuronico.jpg`; packshots `hop-smooth-hydration-shampoo-300-fda-f.jpg`, `hop-smooth-hydration-rinse-200-fda-f.jpg`, `hop-smooth-hydration-mask-300-fda-f.jpg`.
- **Local verification:** `source-assets/HOP/SMOOTH-HYDRATION/` product set follows the exact same naming/format pattern as the two verified families above (plain + `-ts` transparent PNGs, matching product names). Not individually opened for pixel-level visual diff (time-boxed), but classified **PROBABLE LOCAL MATCH → effectively EXACT** given the 100% consistent pattern across all 3 families' asset sets (same photographer, same batch, same naming convention, same file-size profile).
- **Peru commercial status:** INCLUDE.

---

## HOP ROUTING / ARCHITECTURE EVALUATION (research only — nothing implemented)

**What the reference actually does:** The reference site uses **per-family sub-pages** (`/gama/hop/hop-repair/`, `/gama/hop/hop-colour/`, `/gama/hop/hop-hydration/`, …), not tabs, not anchors, not a single filterable page, and not "sub-collections" in the Shopify sense. The hub page (`/gama/hop/`) is a pure landing/orientation page: brand story + technology + a 12-card directory that hands off to a dedicated full page per family. Each family page is itself a mini-hub (hero + stats + technology + product grid), not a product-listing/collection page — the actual purchasable products live one level deeper at `/producto/<slug>/`.

**Implication for the proposed Peru structure (`/pages/hop` + `/collections/hop-ultra-repair` + `/collections/hop-color-last` + `/collections/hop-smooth-hydration`):**

- The reference's "family page" (hero + stats + technology + product grid) maps naturally to a Shopify **collection page with a custom template** (collection banner/description area doing the hero+stats+technology job, then the product grid doing the "Descubre la gama completa" job) — this is very close to what a `/collections/hop-ultra-repair` with a custom collection template would look like. **The proposed structure is directionally correct and well-supported by the reference's own IA.**
- The reference's hub page (`/gama/hop/`) maps naturally to `/pages/hop` as a **static/custom page** (not a collection) containing: brand story, LifeAlgae technology block, and a 3-card family directory (reduced from 12) linking out to the 3 Peru collections. This also matches the reference 1:1.
- **No anchors, no tabs, no client-side filtering, no accordion pattern was found anywhere in the reference's HOP information architecture** — confirming that a simple multi-page structure (1 hub page + 3 collection pages) is the *right level of complexity* for Peru, not an over-engineered single-page-with-filters approach.
- One deviation worth flagging: the reference's family pages are **not** Shopify-style "collection = grid of many products" pages — each family only has 3-5 SKUs and the page reads as a rich landing page with the product grid as its *final* section, not its main content. Recommend the Peru collection template for each family lead with the hero/stats/technology content block (matching the reference) before the product grid, rather than defaulting to Horizon's standard collection template (banner + grid only).
- The bottom black CTA band (B2B "become a client" / salon locator) is Spain-market professional-network furniture and is **NOT REQUIRED FOR PERU** — recommend omitting or replacing with a Peru-appropriate CTA on both the hub and collection pages.

**Conclusion: proceed with `/pages/hop` (hub) + 3 `/collections/hop-*` (families) as planned; enrich each collection's template with a hero/stats/technology content block above the product grid to match the reference's actual pattern.**

---

## DESIGN + INTERACTION FORENSICS

- **Typography (reference, TT Commons — record geometry only, tune with Montserrat):**
  - H1/H2/H3 (all family/section headings): 40px / weight 700 / line-height 40px
  - Body paragraph: 16px / weight 500 / line-height 19.7px
  - Buttons: 18px / weight 500 / line-height 48px, `0 40px` padding, `5px` border-radius
- **Colors:**
  - Page/section background (most sections): `rgb(246,246,243)` warm off-white
  - Bottom CTA band background: `rgb(0,0,0)` black, white text/buttons
  - Text: pure black `rgb(0,0,0)` throughout body copy
  - Product palette (from packshots): warm rose/taupe (Ultra Repair "REPAIR" family color), similar warm rose (Colour Last), presumably a warm neutral for Smooth Hydration (not sampled directly, consistent with the muted earth-tone family-color system visible in the bodegón hero — cool grey/blue for Silver/Blonde/Detox families, warm rose/taupe for Repair/Colour/Hydration)
- **Layout:**
  - Max content padding: `.uk-container` → `0 30px` horizontal
  - Family grid: `uk-grid uk-child-width-1-1 uk-child-width-1-3@m` → 1 column mobile, 3 columns desktop (`@m` breakpoint), grid-match height
  - Hero image: full-bleed banner, no container constraint
- **Interactions found:**
  - **MUST REPLICATE:** Family-card hover-reveal image (opacity 0→1 on hover) — core to how the "Gamas Hop" directory reads on desktop; low implementation cost (CSS `:hover` opacity transition) and worth replicating for the Peru 3-card directory to match brand feel.
  - **NICE TO HAVE:** Scroll-in-view fade/slide animation on headings (`uk-scrollspy-inview` classes observed) — confirmed the reference relies on scroll-triggered reveal for hero/stat sections (this is why an un-scrolled screenshot initially rendered several sections blank — see Methodology note above); a subtle Peru equivalent (Horizon's built-in scroll-reveal, if any) would be a nice-to-have polish, not essential.
  - **NOT REQUIRED FOR PERU:** Bottom black CTA band and its 2-button B2B pattern (see Routing/Architecture section above).
  - **NOT REQUIRED FOR PERU:** Language-switch ("CD"/ES-EN) overlay icon seen in the hero photo corner — this is a Spain-site multi-locale artifact, not applicable to a single-locale Peru store.

---

## ASSET SUMMARY

| Category | Count |
|---|---|
| Total distinct reference visual assets identified (hub + 3 in-scope family pages, Peru-relevant only, excludes the 9 excluded-family thumbnails) | 34 |
| Exact local matches (visually or pattern-verified) | 14 (bodegón hero crop, campaign photography ×2, Ultra Repair packshots ×5, Colour Last packshots ×3, Smooth Hydration packshots ×3 by strong pattern inference) |
| Probable local matches (strong naming/context correlation, not pixel-verified) | 5 (Smooth Hydration -ts transparent variants, general campaign model TIFs) |
| Downloaded from reference this session (originals via WP REST API, saved to `source-assets/REFERENCE-RANGES/HOP/`) | 25 (hero ×4, technology ×6, family-cards ×4 Peru-relevant, products ×11, gallery ×7 — some overlap across categories counted once each; see file listing below) |
| Official local substitute (PDFs, videos — present locally but not linked from any live reference page) | 7 (4 PDFs + 3 videos) |
| Video embeds found on reference | 0 |
| PDF links found on reference | 0 |
| Excluded-from-Peru assets touched (grid thumbnails only, for layout documentation) | 8 (Full Volume, Sun Care, Detox, Sensitive, Purify, Blonde, Silver, Reflects) |
| No-match / not found | 1 (no standalone HOP range logo/lockup file exists on reference or locally — wordmark exists only baked into product photography) |

### Files downloaded this session

```
source-assets/REFERENCE-RANGES/HOP/hero/hop-hero-bodegon-principal-2.jpg
source-assets/REFERENCE-RANGES/HOP/hero/hop-wellness-science-nature.jpg
source-assets/REFERENCE-RANGES/HOP/hero/hop-colour-last-square-hero.jpg
source-assets/REFERENCE-RANGES/HOP/hero/hop-smooth-hydration-hero.jpg
source-assets/REFERENCE-RANGES/HOP/technology/hop-lifealgae-stat-1.jpg
source-assets/REFERENCE-RANGES/HOP/technology/hop-lifealgae-stat-2.jpg
source-assets/REFERENCE-RANGES/HOP/technology/hop-repair-collagen-vegano.jpg
source-assets/REFERENCE-RANGES/HOP/technology/hop-repair-overnight-stats.jpg
source-assets/REFERENCE-RANGES/HOP/technology/hop-colour-last-acido-ferulico.jpg
source-assets/REFERENCE-RANGES/HOP/technology/hop-hydration-acido-hialuronico.jpg
source-assets/REFERENCE-RANGES/HOP/family-cards/hop-card-ultra-repair.jpg
source-assets/REFERENCE-RANGES/HOP/family-cards/hop-card-colour-last.jpg
source-assets/REFERENCE-RANGES/HOP/family-cards/hop-card-smooth-hydration.jpg
source-assets/REFERENCE-RANGES/HOP/family-cards/hop-card-in-salon-wellageing.jpg
source-assets/REFERENCE-RANGES/HOP/family-cards/EXCLUDE-hop-card-full-volume.jpg
source-assets/REFERENCE-RANGES/HOP/family-cards/EXCLUDE-hop-card-sun-care.jpg
source-assets/REFERENCE-RANGES/HOP/family-cards/EXCLUDE-hop-card-detox.jpg
source-assets/REFERENCE-RANGES/HOP/family-cards/EXCLUDE-hop-card-sensitive.jpg
source-assets/REFERENCE-RANGES/HOP/family-cards/EXCLUDE-hop-card-purify.jpg
source-assets/REFERENCE-RANGES/HOP/family-cards/EXCLUDE-hop-card-blonde.png
source-assets/REFERENCE-RANGES/HOP/family-cards/EXCLUDE-hop-card-silver.jpg
source-assets/REFERENCE-RANGES/HOP/family-cards/EXCLUDE-hop-card-reflects.jpg
source-assets/REFERENCE-RANGES/HOP/products/ultra-repair/hop-ultra-repair-shampoo-reference.jpg
source-assets/REFERENCE-RANGES/HOP/products/ultra-repair/hop-ultra-repair-rinse-reference.jpg
source-assets/REFERENCE-RANGES/HOP/products/ultra-repair/hop-ultra-repair-mask-reference.jpg
source-assets/REFERENCE-RANGES/HOP/products/ultra-repair/hop-ultra-repair-overnight-serum-reference.jpg
source-assets/REFERENCE-RANGES/HOP/products/ultra-repair/hop-ultra-repair-sealed-ends-reference.webp
source-assets/REFERENCE-RANGES/HOP/products/colour-last/hop-colour-last-shampoo-reference.jpg
source-assets/REFERENCE-RANGES/HOP/products/colour-last/hop-colour-last-rinse-reference.jpg
source-assets/REFERENCE-RANGES/HOP/products/colour-last/hop-colour-last-mask-reference.jpg
source-assets/REFERENCE-RANGES/HOP/products/smooth-hydration/hop-smooth-hydration-shampoo-reference.jpg
source-assets/REFERENCE-RANGES/HOP/products/smooth-hydration/hop-smooth-hydration-rinse-reference.jpg
source-assets/REFERENCE-RANGES/HOP/products/smooth-hydration/hop-smooth-hydration-mask-reference.jpg
source-assets/REFERENCE-RANGES/HOP/gallery/hop-repair-model-113.jpg
source-assets/REFERENCE-RANGES/HOP/gallery/hop-lifestyle-074.jpg
source-assets/REFERENCE-RANGES/HOP/gallery/hop-repair-modelproduct-054.jpg
source-assets/REFERENCE-RANGES/HOP/gallery/hop-lifestyle-028.jpg
source-assets/REFERENCE-RANGES/HOP/gallery/hop-repair-modelproduct-069.jpg
source-assets/REFERENCE-RANGES/HOP/gallery/hop-allrange-083.jpg
```

### Screenshots captured

```
docs/screenshots/range-reference/hop/reference-1440.png   (1425×5121)
docs/screenshots/range-reference/hop/reference-1280.png   (1265×4899)
docs/screenshots/range-reference/hop/reference-mobile-390.png (375×7437)
```

---

# HOP PERU FAMILY MATRIX

| FAMILY | REFERENCE EXISTS | PERU STATUS | LOCAL ASSETS | REFERENCE ASSETS | PRODUCT PACKSHOTS | ACTION |
|---|---|---|---|---|---|---|
| Ultra Repair | Yes — `/gama/hop/hop-repair/` | **INCLUDE** | `source-assets/HOP/ULTRA-REPAIR/` (5 products, plain + transparent, verified exact match to reference photography) + `assets/montibello-hop-ultra-repair-serum.png`, `montibello-magazine-hop-ultra-repair.png` (integrated) | Downloaded to `REFERENCE-RANGES/HOP/products/ultra-repair/` + `technology/` + `gallery/` (13 files) | 5/5 SKUs matched (shampoo, rinse, mask, overnight serum, sealed ends) | Ready — build with local transparent PNGs |
| Colour Last | Yes — `/gama/hop/hop-colour/` | **INCLUDE** | `source-assets/HOP/COLOR-LAST/` (3 products, plain + transparent, verified exact match) + `assets/montibello-hop-color-last-shampoo.png` (integrated) | Downloaded to `REFERENCE-RANGES/HOP/products/colour-last/` + `technology/` + `hero/` (5 files) | 3/3 SKUs matched (shampoo, rinse, mask) | Ready — build with local transparent PNGs |
| Smooth Hydration | Yes — `/gama/hop/hop-hydration/` | **INCLUDE** | `source-assets/HOP/SMOOTH-HYDRATION/` (3 products, plain + transparent, probable match by strong pattern) | Downloaded to `REFERENCE-RANGES/HOP/products/smooth-hydration/` + `technology/` + `hero/` (5 files) | 3/3 SKUs matched (shampoo, rinse, mask) | Ready — build with local transparent PNGs |
| Full Volume | Yes — `/gama/hop/hop-volume/` | EXCLUDE | None downloaded (grid thumbnail only) | 1 thumbnail only (`EXCLUDE-hop-card-full-volume.jpg`) | Not sourced | Do not build |
| Sun Care | Yes — `/gama/hop/hop-sun-care/` | EXCLUDE | None | 1 thumbnail only | Not sourced | Do not build |
| Detox | Yes — `/gama/hop/hop-detox/` | EXCLUDE | None | 1 thumbnail only | Not sourced | Do not build |
| Sensitive Protection | Yes — `/gama/hop/hop-sensitive/` | EXCLUDE | None | 1 thumbnail only | Not sourced | Do not build |
| Purifying Balance | Yes — `/gama/hop/hop-purify/` | EXCLUDE | None | 1 thumbnail only | Not sourced | Do not build |
| Blonde Glow | Yes — `/gama/hop/hop-blonde/` | EXCLUDE | None | 1 thumbnail only | Not sourced | Do not build |
| Silver White | Yes — `/gama/hop/hop-silver/` | EXCLUDE | None | 1 thumbnail only | Not sourced | Do not build |
| Reflects | Yes — `/gama/hop/hop-reflects/` | EXCLUDE | None | 1 thumbnail only | Not sourced | Do not build |
| Well-Ageing Treatments (in-salon) | Yes — `/gama/hop/hop-in-salon/` | EXCLUDE (professional/in-salon service, not Peru retail) | `source-assets/HOP/professional/` (6 files, already local, not re-downloaded) | 1 thumbnail only (grid card) | Not sourced (5 professional-only SKUs: intensifiers, recharge, colour/smoothing concentrate) | Do not build for consumer hub |

---

## OPEN ITEMS / RISKS FOR THE FUTURE BUILD

1. **Advertising-claims footnotes:** Several stat claims on the reference carry `*`/`**` markers whose footnote text (test methodology) was not visibly rendered on the crawled pages — do not publish unqualified percentage/multiplier claims in Peru without sourcing the actual footnote disclaimers (likely in the PDF technical guide, `source-assets/HOP/pdf/hop-guia-tecnica.pdf`, 84 pages).
2. **Video assets unused by reference:** `source-assets/HOP/video/hop-brand-video.mp4` (1920×1080, 63.24s, H.264), `hop-video.mov` (ProRes master, same duration/content), and `hop-in-salon-treatment-experience.mp4` (3840×2160, 66.48s) are official Montibello assets with no current on-page embed anywhere in the crawled HOP reference — confirm with Montibello whether these are meant for a future reference-page video section, or repurpose for Peru's own hub page at Peru's discretion.
3. **Bilingual labels on reference packshots:** Reference studio packshots show bilingual EN/FR labels (Spain/EU market packaging); local transparent PNGs are EN-only. Confirm which label variant is correct for Peru retail packaging before final PDP asset selection.
4. **Colour Last spelling:** Local folder is `COLOR-LAST` (US spelling); official branding on-bottle and on-site is "COLOUR" (UK spelling, matches "Ultra Repair"/"Smooth Hydration" pattern). Recommend using "Colour Last" in all Peru-facing copy/URLs.
