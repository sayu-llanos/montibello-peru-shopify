# CODEX — MONTIBELLO PERU SITE ARCHITECTURE

This study uses `docs/peru-commercial-scope.md` as the commercial authority and `docs/montibello-asset-manifest.md` plus `source-assets/` as the asset authority. The five official pages were visually inspected at desktop and responsive/mobile widths. International product breadth is not a Peru requirement; the international composition, interaction patterns, proportions, typography, spacing, and responsive rules are the visual reference.

## OFFICIAL HOME ARCHITECTURE

### Exact section order

1. **Global utility bar and header**
   - Desktop: 49 px black utility area above an 80 px white main header; page content begins at y=129 at the inspected 1280 px viewport.
   - Utility actions: login as a light filled control, then e-learning, salon locator, and contact separated by fine vertical rules.
   - Main header: left Montibello wordmark; centered editorial/category navigation; right search, locale/globe, and cart icons.
   - Mobile: one 56 px white header, left-aligned wordmark, then cart and hamburger. Desktop utility links and full navigation disappear. No extra search/account icons are visible.

2. **Campaign hero/slideshow**
   - Desktop: full-bleed landscape slide below the header, approximately 1265 × 474 px at 1280 px. Text/logo overlays the image and previous/next controls sit at the outer edges.
   - Mobile: each slide becomes a dedicated 375 × 469 px portrait image followed by a light text panel; the total first slide is much taller than its image. The CTA is a plain text link with a thin right arrow.
   - Multiple official campaigns rotate/slide horizontally. Peru may use fewer approved campaigns, but must preserve this slide component, aspect-ratio logic, transition behavior, controls when multiple slides exist, and mobile image/text separation.

3. **Editorial statement**
   - A centered, two-line statement creates a strong pause after the hero: `Transforma tu salón con nosotros. Vive un antes y un después en tu historia.`
   - Desktop: approximately 750 × 80 px, 40/40 px, centered around y=653 at 1280 px.
   - Mobile: approximately 345 px wide, 35/35 px, with generous vertical padding.

4. **Range carousel**
   - Desktop: horizontal cards approximately 385 × 661 px with 25 px gaps; three cards plus the beginning of the fourth are visible. Images are approximately 385 × 439 px. Edge arrows navigate the rail.
   - Each card uses category eyebrow → large range name → short description. Image hover applies a restrained scale-up transition.
   - Mobile remains contained to the viewport and uses horizontal carousel behavior; it must not widen the page.
   - Peru mapping: UNDER, HOP, LUXLIGHT, HOP Keratin — Próximamente. This substitution is the correct localization.

5. **Best-sellers rail**
   - Section heading followed by a horizontal product rail.
   - Tall product cards use a packshot/alternate-image hover treatment, range eyebrow, product title, short descriptor, size selector/pill where applicable, and availability/purchase state.
   - Desktop inspected cards were approximately 283 px wide with 394 px media. Edge arrows move the rail.
   - Peru must use only confirmed UNDER, HOP, and LUXLIGHT product data. No invented products, prices, SKUs, or availability; HOP Keratin must not be purchasable.

6. **Hair Magazine/editorial area**
   - Large dark editorial panel/headline (`The Hair Magazine para profesionales`) paired with a clear CTA.
   - Adjacent/following horizontal article-card rail: large editorial thumbnails, article titles, hoverable cards, and edge arrows.
   - Peru can use locally approved education/editorial content, but should preserve the large editorial lead plus article-rail architecture. This slot must not be repurposed as a single UNDER technology section.

7. **Community/social area**
   - Centered social heading/link (`Inspírate con nosotros @montibellopro`) and community line.
   - Large horizontal social-media gallery mixing still images and video tiles, with edge arrows.
   - Peru should use approved local account/link and official/local content while retaining the wide media-strip geometry and interaction.

8. **Professional/salon locator CTA**
   - Large muted-grey visual area with the message `Encuentra tu salón Montibello más cercano`, supporting line, and high-contrast black locator button.
   - This is a destination CTA, not a range-content block.

9. **Assistance/contact CTA**
   - Distinct black card/panel on a light field with white heading/body and a light filled `CONTACTAR` button.
   - Visually separated from the locator area and immediately before the footer.

10. **Footer**
    - Desktop: Montibello brand area plus four structured columns—about/brand ecosystem, information/support, compliance/legal, and social channels—followed by a compact copyright/legal row.
    - Mobile: Montibello wordmark followed by full-width ruled accordion rows (`Sobre nosotros`, `Información y soporte`, `Compliance`, `Síguenos`) with right arrows, then copyright.
    - Peru should localize destinations, social accounts, and legal entity/copy but preserve the architecture and responsive interaction.

### Homepage ownership rule

HOME is an editorial discovery surface. It may feature a current UNDER, HOP, or LUXLIGHT campaign in the hero, but detailed technologies, stats, shade-chart education, techniques, full product specifications, and long-form range storytelling belong on the corresponding range landing.

## UNDER REFERENCE ARCHITECTURE

### Official section order and behavior

1. Common utility/header.
2. **Full-width UNDER hero:** desktop approximately 1265 × 474 px; mobile currently uses a shallow 375 × 141 px campaign crop, then the title/intro below.
3. **Range intro:** `Under`, concise promise paragraph, black `VER VÍDEO` button. Video is invoked as an interaction/modal rather than permanently consuming the hero.
4. **High-definition/stats panel:** two-column desktop composition with editorial product image on the left and 40 px headline plus four proof points on the right: coverage of greys, colour fill, tone intensity, luminous colour. Includes methodology note and `CARTA DE COLOR` button.
5. **Glucamine Nature Tech:** alternating two-column section with technical visual and headline/body describing hybrid technology, pigment delivery, and vegan collagen.
6. **Elevated Warmth editorial:** large range-specific image paired with trend copy and benefit bullets. This is a range landing section, not the homepage Magazine module.
7. **Complete product range:** `Descubre la gama completa`, then product cards for colour and activators. Peru must include the confirmed 60 ml colour assortment, 1000 ml 15/25/35 vol activators, and 90 ml monodose 15/25/35 vol activators. Product rails/grids use tall packshot cards and truthful availability/purchase states.
8. **Editorial video:** large wide media block following product cards.
9. **Editorial/lifestyle gallery:** horizontal strip of tall images with previous/next arrows.
10. **Professional CTA pair:** commercial-contact CTA plus salon-locator CTA.
11. Common footer.

### Responsive pattern

- Desktop alternates roughly 50/50 media and copy using ~603 px media blocks inside a ~1205 px content width.
- Mobile collapses every two-column row to a single column at ~345 px content width. Headings become 35 px. Media precedes its related copy and measures about 345 × 245 px. Product cards become a two-column/scrolling compact grid with ~163 px content widths. No page-level overflow is allowed.

### Asset mapping

- Hero desktop/mobile: keep existing `assets/montibello-under-hero-desktop.jpg` and `assets/montibello-under-hero-mobile.jpg`.
- Intro/video: use the existing official video integration if licensed/available; otherwise preserve the `VER VÍDEO` interaction and use an approved official video, not a fabricated loop.
- Stats/high-definition image: `source-assets/UNDER/products/under-bodegon-08.jpg`, recropped and web-exported to the reference landscape block.
- Carta de Color visual: web-optimized export of `source-assets/UNDER/technical/under-carta-de-color.png`.
- Carta de Color download: `source-assets/UNDER/pdf/under-carta-de-color-digital.pdf`, replacing the older theme copy.
- Glucamine section: keep `assets/montibello-under-glucamine-tech.jpg`.
- Elevated Warmth: keep `assets/montibello-under-editorial-elevated-warmth.jpg`.
- Product cards: `source-assets/UNDER/products/under-tubo.png`, `under-crema-activadora.png`, and `under-bodegon-01.jpg` through `under-bodegon-12.jpg`; retain confirmed per-volume local packshots already in theme where the Marketing Center has only a generic activator image.
- Editorial gallery: `source-assets/UNDER/campaign/under-2026-modelo-02.jpg` through `-06.jpg` plus `under-tendencias-2026.jpg`.
- Professional CTA: keep `assets/montibello-professional-salon-editorial.jpg`.

## HOP REFERENCE ARCHITECTURE

### Official hub structure

1. Common utility/header.
2. **Full-width HOP hero:** desktop approximately 1265 × 474 px; mobile dedicated 375 × 469 px portrait.
3. **Hero/intro band:** `Hop` plus concise wellbeing promise.
4. **Wellbeing/benefits section:** alternating two-column editorial image and large statement (`Bienestar, ciencia y naturaleza...`) followed by three benefit propositions: correcting signs of hair wellbeing, high-efficacy ingredients, immersive sensorial experience, and eco-responsibility.
5. **LifeAlgae BioScience section:** technical visual and explanation of hyperfermented algae and skincare-derived ingredients.
6. **Results/stats section:** another alternating image/copy block with four prominent results: hydration, nutrition, strength, and colour-protection duration, plus test footnotes.
7. **`Gamas Hop` subrange hub:** three-column desktop card grid. Each card is approximately 375 × 344 px with a ~375 × 241 px image, 40 px title, and `Ver productos`. Mobile becomes a single-column sequence at ~345 px wide with ~345 × 222 px images.
8. **Editorial gallery:** horizontal tall-image rail with edge controls.
9. Professional-contact and salon-locator CTA pair.
10. Common footer.

### Peru localization

- Preserve sections 1–6 unchanged in visual role, but ensure claims/copy are approved for Peru.
- In `Gamas Hop`, render only **Ultra Repair, Color Last, Smooth Hydration**. Do not leave empty grid holes and do not add Full Volume, Sun Care, Detox, Sensitive Protection, Purifying Balance, Blonde Glow, Silver White, Reflects, or Well-Ageing.
- Use one three-card desktop row—the reference already establishes a three-column geometry, so Peru's three families fit perfectly without redesign.
- The editorial gallery must use only in-scope HOP imagery or neutral HOP brand imagery.

### Asset mapping

- Hub hero: web-exported `source-assets/HOP/campaign/hop-gama-completa.jpg`; faster fallback is a downscaled/cropped `hop-gama-repair-colour.jpg`. Do not use a group shot that visibly foregrounds out-of-scope products without an approved crop.
- Brand/lifestyle intro: convert `hop-modelos-mindfullness-beauty-01.tif` to web-quality JPG/WebP. Alternate: the dancer image after conversion.
- LifeAlgae/benefits/results: use approved crops from the HOP lifestyle/brand set and official graphical content derived from the catalog/guide; do not invent scientific diagrams or unsupported statistics.
- Color Last card/products: `source-assets/HOP/COLOR-LAST/*.png`.
- Smooth Hydration card/products: `source-assets/HOP/SMOOTH-HYDRATION/*.png`; `hop-gama-volume-hydration.jpg` is usable only after cropping out Full Volume products.
- Ultra Repair card/products/editorial: `source-assets/HOP/ULTRA-REPAIR/*.png` plus `hop-ultra-repair-overnight-serum-gama-01.jpg`, `lifestyle-01.jpg`, and `modelo-01.jpg`.
- Professional CTA: downscaled `source-assets/HOP/professional/hop-in-salon-aplicador.jpg` or `hop-in-salon-grupo.jpg`.
- Optional motion: re-encode `source-assets/HOP/video/hop-brand-video.mp4`; `hop-video.mov` and the large in-salon master must not be served as-is.

## LUXLIGHT REFERENCE ARCHITECTURE

### Official section order and behavior

1. Common utility/header.
2. **Full-width Luxlight hero:** desktop approximately 1265 × 474 px; mobile dedicated 375 × 469 px portrait.
3. **Range intro:** `luxlight`, concise maximum-lightening/care promise, black `VER VÍDEO` button.
4. **Performance/stats panel:** alternating two-column image/copy with headline `Máxima aclaración con el máximo cuidado capilar`, four proof points (strength, breakage resistance, softness, natural-strength recovery), and footnotes.
5. **Bond3 Force System + Metal Shield:** technology video/visual paired with 40 px heading and technical explanation.
6. **Service 360 section:** before/after paired imagery and copy describing complete lightening needs, salon 360 service, treatment, performance, and before/during/after service menu.
7. **International `luxlight + éclat` editorial slot:** a 50/50 editorial image/copy section.
8. **Complete product range:** heading plus tall cards for the eight confirmed Peru products. Official desktop uses five cards in the first row and three in the next; mobile uses compact two-column rows.
9. **Editorial/technical gallery:** tall image rail with edge controls.
10. Professional-contact and salon-locator CTA pair.
11. Common footer.

### Peru treatment of the Éclat slot

**Preserve the visual slot but replace it with Luxlight-only editorial content.** Omitting it would shorten the page and break the reference rhythm; retaining Éclat would violate commercial scope. Use the same two-column 603/503-ish desktop geometry and 345 px mobile stack to present a Luxlight-only professional technique/service story—for example `Servicio premium 360°: antes, durante y después de la aclaración` or an approved technique feature. Do not mention Éclat, tonalization with Éclat, or any Éclat shade.

### Asset mapping

- Hero/static fallback: `source-assets/LUXLIGHT/campaign/luxlight-fotos-lifestyle-01.jpg` or `luxlight-modelo-01.jpg`.
- Campaign hero motion: re-encoded `source-assets/LUXLIGHT/video/luxlight-video-campana.mp4` with poster/fallback.
- Performance/stats: approved crops from `luxlight-fotos-lifestyle-03/05/07.jpg` and/or `luxlight-modelo-04/08/10.jpg`.
- Bond3 + Metal Shield: `source-assets/LUXLIGHT/video/luxlight-video-tecnologia.mp4` after web optimization plus `source-assets/LUXLIGHT/technical/luxlight-tecnologia-01.jpg` through `-05.jpg`.
- Service 360 and Éclat-replacement visual slot: `source-assets/LUXLIGHT/products/luxlight-bodegon-01.jpg` through `-06.jpg` and selected campaign/editorial images, keeping the slot Luxlight-only.
- Product range: all nine packshot files under `source-assets/LUXLIGHT/products/luxlight-supreme-*` (eight SKUs; the Control Oil system uses two coordinated parts) plus `luxlight-gama-completa.png` where suitable.
- Editorial/technical gallery: remaining campaign/model/lifestyle selections and technical images.
- Optional professional education: re-encoded Spanish step-by-step video(s), deferred from launch because the masters are 169–331 MB.

## HOP KERATIN REFERENCE ARCHITECTURE

The official page is a shorter version of the shared range template:

1. Common utility/header.
2. Full-width campaign hero: desktop ~1265 × 474 px; mobile currently a shallow ~375 × 141 px crop.
3. `Hop Organic Keratin` intro and promise.
4. Alternating 50/50 benefits row: editorial/product image plus `Alisado orgánico para un liso 100 % natural`, benefits and result claims.
5. Alternating ingredients/technology row: `Organic Acid Complex, Botanical actives & Natural oils` plus supporting copy.
6. `Descubre la gama completa` with two product cards.
7. Professional-contact and salon-locator CTAs.
8. Common footer.

The international page contains much more approved product/claim context than the Peru project currently has. The Marketing Center inventory contains two teaser packshots (`hop-keratin-cleanser.jpg`, `hop-keratin-infusion.jpg`) and internal-reference PDFs, while the known Peru names are Shampoo 750 ml and Lotion 1000 ml. The asset/title mismatch must be resolved before a full commercial landing is attempted.

## PERU LOCALIZATION DECISIONS

- **Global visual system:** copy the official header/footer, TT Commons scale if web licensing is confirmed, section widths, 50/50 editorial rows, card proportions, controls, hover transitions, spacing, and responsive stacking.
- **Typography fallback:** the manifest confirms TT Commons is primary but the storefront web license is unconfirmed. Do not embed it without license confirmation. Until confirmed, use brand-sanctioned Montserrat but tune its sizes/weights/letter spacing to approximate the reference; document this as a temporary fidelity limitation.
- **HOME:** campaign-led discovery only. Use approved Peru campaign(s); range carousel contains UNDER/HOP/LUXLIGHT/Keratin teaser; real Peru best sellers; localized editorial/community/locator/contact modules.
- **UNDER:** full reference-shaped range landing with Peru colour/activator/monodose assortment, colour chart, Glucamine, Elevated Warmth, editorial gallery, and professional CTAs.
- **HOP:** one reference-shaped hub limited to the three approved families. Do not create empty placeholders for excluded families.
- **LUXLIGHT:** full reference-shaped landing with the confirmed eight SKUs. Replace the Éclat editorial slot with Luxlight-only service/technical content while preserving its geometry.
- **HOP Keratin:** coming-soon communication only; no price, cart, availability, or purchase CTA.
- **Product truth:** use Shopify collection/product data only after confirmed SKUs and prices exist. No `S/. 19.99` placeholders or international availability messages.
- **Asset preparation:** every selected TIFF, print-resolution PNG/JPG, PDF, and large video must be converted/re-exported before web delivery. Keep original files untouched in `source-assets/`.

## RECOMMENDED SITEMAP

### Primary marketing/navigation routes

- `/` — HOME
- `/collections/under` — UNDER rich collection landing + confirmed product listing
- `/pages/hop` — HOP hub
- `/collections/luxlight` — LUXLIGHT rich collection landing + confirmed product listing
- `/pages/hop-keratin` — HOP KERATIN — PRÓXIMAMENTE
- `/pages/contacto` — Contact / commercial assistance
- `/pages/nosotros` — Montibello Perú / distributor information
- `/pages/localizador` — Peru salon/distributor locator only if reliable local locator data exists; otherwise route the locator-style CTA to contact/commercial assistance without claiming a locator exists
- `/blogs/magazine` — Peru professional editorial hub when there is enough approved content; until then use a curated editorial landing without fabricated articles

### HOP commerce routes

- `/collections/hop-color-last` — confirmed Color Last products
- `/collections/hop-smooth-hydration` — confirmed Smooth Hydration products
- `/collections/hop-ultra-repair` — confirmed Ultra Repair products

The three HOP collection routes should be linked from cards/anchors within `/pages/hop`. Do not launch separate marketing routes `/hop/color-last`, `/hop/smooth-hydration`, or `/hop/ultra-repair` in the first architecture pass.

### Navigation model

- Primary range navigation: UNDER, HOP, LUXLIGHT, HOP Keratin — Próximamente.
- Secondary/professional utilities: professional access/contact, education/editorial if available, locator/contact equivalent, and cart/search/locale as applicable to Peru.
- Do not expose international-only Color/Styling/Forma/Skincare ranges as commercial destinations. Preserve the reference navigation's spacing and density using Peru-relevant labels rather than copying unavailable categories.

## HOP SUBFAMILY RECOMMENDATION

**Recommendation: B + C—anchor/overview sections inside the HOP hub, with Shopify collection pages for products. Do not build three full child marketing landings now.**

- The official HOP page is already a hub whose subranges are represented as image cards leading to products. Reusing that model is the closest architectural match.
- A single HOP hub can preserve the brand story, wellbeing benefits, LifeAlgae technology, results, three family cards, gallery, and professional CTA without duplicating shared content.
- Each family card can deep-link to a short anchor/overview inside `/pages/hop` for context and then to its dedicated Shopify collection for actual product browsing.
- Collections are simpler to maintain as SKUs/availability change and avoid maintaining three nearly identical marketing pages.
- Full child landings would add time, duplication, and inconsistency risk without evidence that the international reference requires them.
- Reconsider full child landings only when each family has sufficient approved campaign photography, distinct technical claims, SEO need, and content depth to justify a page.

## HOP KERATIN RECOMMENDATION

**Recommendation: OPTION B—homepage teaser plus a small Coming Soon landing.**

- **Trust:** a dedicated page gives the teaser a credible destination and lets the unavailable status be unambiguous.
- **Anticipation:** it can present one concise approved promise, the two-product silhouette/packshot treatment, and an optional professional-contact or updates CTA without implying sales availability.
- **Availability risk:** manageable if every view carries `PRÓXIMAMENTE`, has no price, no Add to Cart, no stock language, and no collection/product purchasing links.
- **Asset reality:** only two suitable packshots and internal PDFs are confirmed, and their names do not cleanly match the known Peru product names. This is insufficient for a full near-1:1 Keratin landing with benefits/technology claims.
- **Speed:** a short page is fast and reusable at launch; it can later expand into the full range template after product names, assets, claims, availability, and legal copy are approved.
- **Suggested small-page structure:** common header → restrained campaign/packshot hero → `PRÓXIMAMENTE` status → short approved description → two non-purchasable product silhouettes/cards (only after name/asset mapping is confirmed) → professional-contact CTA → common footer.

Do not implement OPTION C now. It would encourage unsupported adaptation of international Organic Keratin claims and imply a launch-ready product ecosystem that Peru does not yet have.

## WHAT MUST BE REMOVED FROM CURRENT HOME

- Remove the current `editorial_magazine` content centered on `Tecnología Glucamine Nature Tech`. That content belongs to the UNDER landing's technology section. Replace the HOME slot with the official Hair Magazine/editorial architecture using approved Peru professional content.
- Remove invented/placeholder product states, especially `Montibello — próximamente` and `S/. 19.99`. HOME best sellers must be populated from confirmed Peru products or withheld until product data is ready.
- Remove generic Shopify identity (`Mi tienda`, `Tecnología de Shopify`) from visible HOME metadata/footer.
- Remove the current standalone professional/distributor banner treatment if it remains a generic 50/50 range-style editorial block. Replace it with the official homepage locator visual slot followed by the separate black assistance/contact CTA. The underlying Peru professional message can be reused.
- Remove page-level horizontal overflow caused by the range carousel. Off-screen cards must remain inside the rail.
- Remove duplicated `PRÓXIMAMENTE` treatment on the Keratin card; use one clear status label.

The following current HOME content should **not** be removed merely for being range-specific:

- Elevated Warmth may remain as an approved UNDER homepage campaign teaser, provided it uses the official homepage slideshow composition and links to UNDER.
- UNDER/HOP/LUXLIGHT/Keratin range cards belong on HOME and are the correct Peru localization.
- The editorial statement belongs on HOME and should remain.
- Professional and contact messaging belongs on HOME, but must be rebuilt into the official locator/contact visual architecture.

HOME must not acquire UNDER stats, Carta de Color, Glucamine detail, Elevated Warmth long-form benefits, activator product grids, or UNDER galleries beyond a concise campaign/card teaser.

## WHAT CLAUDE SHOULD BUILD NEXT

1. **Stabilize the shared global shell first:** exact desktop/mobile header, utility navigation, footer columns/accordions, typography tokens, widths, spacing tokens, buttons, arrow controls, hover motion, and responsive containment. Every page depends on these.
2. **Finish HOME visual architecture:** fix range overflow; restore official hero responsive composition; keep the Peru range set; replace placeholders with real/empty-safe product data; build the correct Magazine, community, locator, assistance, and footer sequence. Remove the UNDER technology content from the Magazine slot.
3. **Build UNDER as the first full range template:** it has the strongest content/asset coverage and establishes reusable hero, intro/video CTA, 50/50 editorial/stats rows, product rail/grid, gallery, professional CTA, and footer components.
4. **Extract reusable range components from UNDER:** full-width responsive hero, intro band, editorial media/copy row with optional reversal, stats grid, video trigger/modal, product collection rail/grid, gallery rail, professional CTA pair.
5. **Build LUXLIGHT using the shared range template:** map the performance, technology, service 360, Luxlight-only replacement editorial slot, eight-product range, gallery, and professional CTAs. Re-encode video assets before use.
6. **Build the HOP hub:** shared hero/editorial rows plus only the three Peru family cards in one three-column desktop row. Link those cards to their Shopify collections; do not build full child marketing pages yet.
7. **Build the small HOP Keratin Coming Soon page last:** only after Montibello confirms the mapping between Peru's Shampoo/Lotion names and the Marketing Center's Cleanser/Infusion assets. No commerce controls.
8. **Add/verify collection data and routes:** `/collections/under`, `/collections/luxlight`, and the three HOP subfamily collections. Never fabricate prices or SKU availability while data is incomplete.
9. **Run visual regression at 1440, 1280, 768, 390, and 375 px:** verify section order, aspect ratios, type scale, arrows, modal/video behavior, hover effects, mobile stacking, footer accordions, and zero page-level horizontal overflow.

No storefront implementation files were modified during this architecture study.
