# CODEX QA — DESKTOP HOMEPAGE MILESTONE

## VERDICT

FAIL

The homepage is not yet a near-1:1 desktop recreation of the international Montibello homepage. The implementation has a sound full-width shell, a correct Peru-only range set, working range-carousel controls, and valid campaign assets, but the middle and lower page diverge materially from the reference architecture. The homepage currently substitutes range-specific UNDER storytelling for the required Hair Magazine module, uses a static community grid instead of a media rail, implements the professional CTA as an oversized range-style split panel, and omits the reference assistance-card treatment and one footer information column.

Peru commercial localization was treated as authoritative. No defect is recorded for omitting m.lab, Dénuée, Styling, Skincare, international HOP families, or international campaign count. HOP Keratin is correctly presented as “Próximamente” without a purchase link. Montserrat is accepted as the licensed fallback; the failures below concern its visual tuning and layout results, not the absence of TT Commons.

## MANAGER-REVIEW READINESS

NOT READY TO SHOW

The first viewport is directionally credible, but a manager scrolling the page will encounter unmistakable structural differences: the wrong HOME editorial module, no reference-shaped editorial/article rail, no community carousel behavior, an overlong professional section, a differently composed contact CTA, and an incomplete footer/navigation model. These are milestone-level differences rather than final-polish items.

## CRITICAL DIFFERENCES

1. **HOME editorial architecture is incorrect.** The reference HOME uses a large Hair Magazine editorial lead plus a horizontal article-card rail and edge arrows. Local instead renders a 1,094 px-tall two-column “Tecnología Glucamine Nature Tech” UNDER section. Glucamine and long-form UNDER technology content belong on `/collections/under`, as specified by `docs/qa/site-architecture-codex.md`; this slot must not be repurposed on HOME.

2. **The professional/contact sequence is not reference-shaped.** Local uses a 1,094 px-tall split “Distribución oficial Montibello en Perú” section followed by a 370 px light-grey centered CTA. The reference uses a salon-locator/destination visual band followed by a distinct black assistance card with white text and a light button. The local sequence is substantially taller and lacks the black assistance-card visual hierarchy.

3. **Community behavior and geometry differ.** Local is a fixed four-column grid of four 287 × 359 px images at 1280 px, with no arrows and no horizontal rail. The reference is a wide mixed-media strip with carousel controls. Commercially safe Peru imagery is acceptable, but the reference interaction and strip geometry are still required.

4. **The desktop navigation model is a placeholder rather than a localized Montibello information architecture.** Local primary navigation is only `INICIO / CATÁLOGO / CONTACTO`; the required Peru mapping is UNDER, HOP, LUXLIGHT, and HOP Keratin — Próximamente, with reference-like density and right-side tools. The utility bar has only two controls, while the reference uses four compact utility actions. This produces visibly empty header space and hides the confirmed portfolio behind a generic catalog destination.

5. **The best-seller/product rail is undersized and incomplete as a component.** At 1280 px local cards are 260 px wide with 325 px media; the reference cards are approximately 283 px wide with 394 px media. Local has three static-width editorial cards, no edge controls, no alternate-image hover treatment, and a left-aligned 35 px heading. The reference has a centered 40 px heading and an arrow-controlled horizontal product rail. Using a truthful editorial stand-in while Shopify product data is unavailable is correct, but the stand-in must still reproduce the reference geometry and interaction without inventing prices, SKUs, or availability.

6. **The range rail exposes a native horizontal scrollbar.** At 1280 px a thick browser scrollbar is visibly rendered below the cards. The official rail relies on edge arrows and does not present a desktop native scrollbar as part of the composition. This is highly visible after the first carousel interaction.

## MINOR DIFFERENCES

1. **Hero height is not responsive to the reference ratio.** At 1280 × 900 local is approximately 1269 × 540 px; reference is approximately 1265 × 474 px. Desired desktop height at this viewport is about 474 px. At 1440 × 1000 local is 1440 × 540 px versus reference 1425 × 534 px, so the issue is the fixed-height behavior at the narrower desktop viewport. The single approved Peru campaign is valid and does not require multiple slides.

2. **Editorial statement wraps to three lines.** At both desktop sizes local is 750 × 120 px at 40/40 px; reference is approximately 750 × 80 px at 40/40 px and two lines. At 1280 px local begins at y=718 versus reference y=653, primarily because of the extra 66 px hero height. The fallback type needs width/weight/letter-spacing tuning so the exact statement remains two lines.

3. **Range rail vertical position and large-desktop width differ.** At 1280 px local starts at y=888 versus reference y=773, a +115 px displacement. The local/reference card widths at that viewport are both 385 px with 25 px gaps, and the image height is correctly about 439 px. At 1440 px, however, local cards remain 385 px and start at x=100, while reference cards expand to about 417 px and start at x=63. Desired behavior: retain 385 px cards with a 30 px gutter at 1280, then expand to about 417 px inside an approximately 1300 px centered rail at 1440.

4. **Range-card total heights are inconsistent.** At 1280 px the first three local cards are about 621 px tall versus approximately 661 px reference; HOP Keratin is only about 529 px tall. Give all four card shells a common desktop content rhythm/minimum height so title baselines and the following section remain stable, while keeping the coming-soon copy commercially distinct.

5. **Section headings are too small and inconsistently aligned.** Local `Nuestros productos` and `La comunidad Montibello` render at 35 px and left align to the content gutter. Reference major HOME headings render at approximately 40 px and, for these rails, use a centered 750 px text block.

6. **Header spacing is close but not exact.** Local utility/main header heights are 49/79 px versus 49/80 px reference. At 1440 px the wordmark is 152 × 26 px at x=40; reference is about 151 × 26 px at x=30. Move the desktop logo 10 px left and restore the 80 px main-header height while rebuilding the navigation density.

7. **Footer is one structural column short.** Once lazy content renders, local has four total desktop columns: brand, ranges, information/support, and social. Reference architecture is a brand area plus four structured columns (five visual columns total), including a separate compliance/legal group. Local footer height is close—about 362 px at 1280 versus approximately 366 px reference—but the column model, legal grouping, and populated social destinations are incomplete.

8. **Brand naming remains generic in system surfaces.** The browser title, logo accessible label, and copyright identify the shop as `Mi tienda`, not Montibello Perú. This is visible in the tab title and footer and weakens an otherwise correct Montibello wordmark treatment.

## HOME VS RANGE-PAGE ARCHITECTURE

- HOME may use an UNDER campaign in the hero and may link to UNDER from a product/range card.
- HOME must remain an editorial discovery surface: hero → statement → range carousel → best-seller/product rail → Magazine/editorial lead and article rail → community media rail → professional locator/destination CTA → black assistance CTA → footer.
- `Tecnología Glucamine Nature Tech`, detailed technology explanations, proof points, Elevated Warmth long-form storytelling, shade education, and full specifications belong on the UNDER landing page. The current Glucamine section must therefore move out of the HOME sequence; it is not a valid localized substitute for Magazine.
- The confirmed HOME commercial set is correctly limited to UNDER, HOP, LUXLIGHT, and HOP Keratin — Próximamente. The absence of international-only ranges is correct.
- The HOME product area may remain a safe editorial stand-in until confirmed Shopify product data exists, but it must not claim best-seller status, price, SKU, size, availability, or purchase state without authoritative data. HOP Keratin must remain non-purchasable.
- Peru can localize Magazine, community, locator, and assistance copy/destinations, but each slot must retain the international page’s visual role, geometry, hierarchy, and interaction model.

## DESKTOP MEASUREMENTS

| Component | 1280 × 900 reference | 1280 × 900 local | Desired | 1440 × 1000 reference | 1440 × 1000 local |
|---|---:|---:|---:|---:|---:|
| Effective content/page width | 1265 px | 1269 px | Full available width; no page overflow | 1425 px | 1440 px | 
| Utility bar | 49 px | 49 px | 49 px | 49 px | 49 px |
| Main header | 80 px | 79 px | 80 px | 80 px | 79 px |
| Hero | 1265 × 474 px | 1269 × 540 px | ~1265 × 474 px | 1425 × 534 px | 1440 × 540 px |
| Editorial statement | 750 × 80 px, 2 lines | 750 × 120 px, 3 lines | 750 × 80 px, 40/40 px, 2 lines | 750 × 80 px | 750 × 120 px |
| Range rail start | y=773 | y=888 | y≈773 after hero/text correction | y=833 | y=938 |
| Range card width / gap | 385 / 25 px | 385 / 25 px | 385 / 25 px | 417 / 24–25 px | 385 / 25 px |
| Range image | ~385 × 439 px | ~385 × 439 px | Match reference | ~417 × 475 px | ~385 × 439 px |
| Range card total height | ~661 px | ~621 px; Keratin ~529 px | ~661 px shared shell | ~677 px | ~621 px; Keratin ~529 px |
| Range arrows | 50 × 50 px | 50 × 50 px | Keep; hide native scrollbar | 50 × 50 px | 50 × 50 px |
| Product heading | 750 px centered, 40 px type | 1220 px left-aligned, 35 px type | 750 px centered, 40 px | 750 px centered, 40 px | 1240 px left-aligned, 35 px |
| Product card / media | ~283 px / 394 px media | 260 px / 325 px media | ~283 px / 394 px media | ~306 px card | 260 px card |
| Local Glucamine HOME block | Not present; Magazine occupies slot | 1,094 px tall | Replace with Magazine lead + article rail | Not present | 1,094 px tall |
| Community layout | Horizontal mixed-media rail | Four-column static grid; 287 × 359 px tiles | Horizontal rail with edge controls | Horizontal mixed-media rail | Static grid |
| Footer | ~366 px; five visual columns | ~362 px; four visual columns | Preserve height; add missing information architecture | ~366 px | ~362 px |

Both local desktop widths use the full viewport without a narrow central-page constraint, blank right gutter, or page-level horizontal overflow. At 1280 px the range list has a 1209 px client width, 1615 px scroll width, and 406 px maximum scroll. Clicking `Siguiente` moves from 0 to 406 px, enables `Anterior`, and disables `Siguiente` at the end; this behavior passes.

## TECHNICAL ISSUES

1. Browser console reports: `[shopify-account] Menu "customer-account-main-menu" not found in Storefront API. Falling back to default menu items.` Configure the referenced customer-account menu or remove the unavailable menu dependency.

2. Primary navigation `CONTACTO` resolves to `/pages/contact`, while the utility CTA and architecture use `/pages/contacto`. Normalize the route to the actual Peru contact page and verify it does not 404.

3. The footer `Under` rich-text link is emitted as `shopify://collections/under` in the rendered DOM instead of a storefront URL. Replace the rich-text literal with a valid Shopify link-picker value or resolved `/collections/under` URL.

4. The page `<title>`, logo alt text, and footer copyright use the placeholder `Mi tienda`. Set the shop/theme-facing brand identity to Montibello Perú without changing the approved wordmark asset.

5. The range list and product list both use `overflow-x: auto` with visible desktop scrollbars. Preserve keyboard/touch scrolling and add cross-browser scrollbar suppression for the visual rail, with accessible arrow controls where overflow exists.

6. The current range script is functional at 1280 px: one next-arrow activation reaches the 406 px maximum, and disabled states update correctly. Retain this logic when correcting geometry.

7. Lazy-loaded media verification passes. After scrolling each region into view, all 15 homepage images report non-zero natural dimensions, including `montibello-under-glucamine-tech.jpg`, `montibello-under-editorial-elevated-warmth.jpg`, and `montibello-professional-salon-editorial.jpg`. Do not treat their initial off-screen `naturalWidth=0` state as a missing-asset defect.

8. Git inspection shows an active homepage implementation set: added product teaser/community/editorial components and modified header, footer, range, hero, and `templates/index.json`. `git diff --check` returns no whitespace errors. No implementation file was changed during this QA pass.

## REQUIRED FIXES FOR CLAUDE

1. **Rebuild `templates/index.json` HOME order** to match: hero → editorial statement → range carousel → truthful product rail → Magazine/editorial lead + article rail → community media rail → Peru locator/destination CTA → black assistance CTA → footer. Remove the Glucamine technology block from HOME and retain it for the UNDER landing.

2. **Replace the current HOME Glucamine section** (`montibello_editorial_magazine`, currently 1,094 px tall) with a reference-shaped Magazine module: dark editorial lead/headline and CTA plus a horizontally scrollable article-card rail with 50 px edge controls. Use only approved Peru editorial content; if article destinations are not ready, do not fabricate publication claims or dead links.

3. **Correct desktop hero sizing in `sections/montibello-image-banner.liquid`.** At 1280 px change the rendered height from 540 px to approximately 474 px while retaining approximately 534–540 px at 1440 px. Use responsive aspect-ratio/clamp behavior instead of one fixed desktop height. Keep the current single Peru slide valid; render arrows/pagination only when multiple approved slides exist.

4. **Tune the editorial statement in `sections/montibello-editorial-statement.liquid`.** Current: 750 × 120 px, three lines, 40/40 px. Desired: approximately 750 × 80 px, two lines, 40/40 px. Adjust Montserrat weight, letter spacing, and/or inner width minimally; do not reduce the target 40 px scale merely to force wrapping.

5. **Fix range rail responsive geometry in `sections/montibello-range-cards.liquid`.** Preserve current 1280 values (x=30, 385 px cards, 25 px gaps). At 1440 target x≈63 and 417 px cards rather than x=100 and 385 px cards. Use a centered ~1300 px rail with a responsive card basis. Set a shared desktop card/content minimum height near 661 px at 1280 and 677 px at 1440 so Keratin does not collapse to ~529 px. Keep Keratin unlinked and labeled Próximamente.

6. **Hide native desktop rail scrollbars** in the range and product rails while preserving touch, wheel/trackpad, keyboard accessibility, scroll snapping, and working arrow disabled states.

7. **Bring the product stand-in to reference geometry.** Current at 1280: 260 px card, 325 px media, 35 px left heading. Desired: approximately 283 px card, 394 px media, 40 px heading centered in a 750 px block, 25 px-ish rhythm, and edge arrows when content overflows. Add the alternate-image hover treatment only when a truthful approved alternate asset exists. Do not add fake prices, SKUs, sizes, availability, or cart controls.

8. **Convert `sections/montibello-community.liquid` from a fixed grid to a media rail.** Keep approved Peru assets, but reproduce the reference horizontal strip, overflow, edge arrows, and restrained hover/motion treatment. Change the 35 px left-aligned heading to an approximately 40 px centered heading block. Mixed video is optional unless an approved optimized asset exists; the rail behavior is not optional.

9. **Replace the oversized professional split section.** Current affected block: `montibello_banner_professional`, 1,094 px tall. Implement the reference locator/destination visual role as a substantially shallower image-led band with localized Peru copy. If no reliable Peru locator exists, route the locator-style CTA to commercial assistance as allowed by the architecture authority; do not claim an unavailable locator.

10. **Restyle the assistance CTA as the reference black card.** Current affected block: `montibello_contact`, 370 px light-grey full-width panel. Desired: a distinct black panel/card on a light field, white heading/body, and light filled `CONTACTAR`/localized contact button immediately before the footer.

11. **Rebuild desktop navigation content in `sections/header-group.json` / `sections/header.liquid`.** Replace generic `INICIO / CATÁLOGO / CONTACTO` with UNDER, HOP, LUXLIGHT, and HOP Keratin — Próximamente; add Peru-relevant utility destinations to restore reference density without exposing excluded international ranges. Retain search/cart, add the locale/globe control only if it has a truthful Peru function, set main header height to 80 px, and move the wordmark from x=40 to approximately x=30 at 1440.

12. **Complete the footer information architecture.** Keep the near-correct ~362–366 px height, but use five visual desktop columns: Montibello Perú brand area plus about/ecosystem, information/support, compliance/legal, and social. Populate or intentionally omit social links based on confirmed accounts; do not leave an empty `Síguenos` column. Correct the Under URL, contact URL, copyright brand, and all `Mi tienda` labels.

13. **Clear technical placeholders and warnings.** Resolve the missing `customer-account-main-menu` warning, normalize `/pages/contacto`, replace rendered `shopify://` hrefs, set the document title and accessible logo label to Montibello Perú, then re-run console inspection at both desktop widths.

14. **Re-test at exactly 1280 × 900 and 1440 × 1000** after the structural rebuild. Verify no page-level horizontal overflow, no blank right gutter, no visible rail scrollbar, correct arrow end states, two-line editorial statement, lazy image completion, hover zoom, and the complete HOME sequence before requesting another manager-review milestone.

## SHOPIFY THEME CHECK

PASS

Command: `shopify theme check`

Result: 369 files inspected; no offenses detected.

Additional repository checks:

- `git status --short` confirms the active implementation touches homepage-related blocks, sections, header/footer groups, and `templates/index.json`, plus QA documentation.
- `git diff` was inspected for the current homepage implementation.
- `git diff --check` passes with no whitespace errors.
- QA did not modify any file under `sections/`, `blocks/`, `snippets/`, `templates/`, `layout/`, `config/`, `assets/`, or `locales/`.

## FINAL QA SUMMARY

The desktop homepage has a viable foundation: correct full-width behavior, near-correct header heights, an approved Peru hero, accurate 1280 px range-card width/gap/image geometry, correct Peru portfolio boundaries, a safe non-priced product stand-in, valid lazy-loaded assets, functioning range arrows, and a clean Shopify Theme Check result. It still fails the milestone because near-1:1 fidelity is determined by the complete page, not only the first screen. The Magazine, community, professional/locator, assistance, navigation, product-rail, and footer architectures must be corrected before manager review.
