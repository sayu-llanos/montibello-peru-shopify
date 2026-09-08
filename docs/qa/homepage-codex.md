# CODEX QA — HOMEPAGE

## VERDICT

FAIL

Commercial scope was evaluated against `docs/peru-commercial-scope.md`. The local use of UNDER, HOP, LUXLIGHT, and HOP Keratin — Próximamente is an intentional, correct Peru localization. The homepage still fails because its visual/UX shell is materially different from the international reference and contains placeholder product pricing that violates the Peru commercial rules.

Audit date: 2026-09-08 (America/Lima). Reference: `https://hair.montibello.com/`. Local: `http://127.0.0.1:9292/`. Browser comparisons covered normalized 1280 × 720 desktop and 390 × 844 mobile viewports.

## CRITICAL DIFFERENCES

1. **The homepage architecture is substantially incomplete.** The reference visual sequence is campaign hero/slideshow → centered editorial statement → range carousel → best-seller product rail → Hair Magazine editorial module → social/community module → salon-locator CTA → assistance CTA → full brand footer. Local uses hero → range cards → placeholder product rail → two generic professional CTAs → generic footer. Hair Magazine, social/community, locator, and reference-style assistance modules are missing. The localized commercial content may differ, but the section architecture and visual rhythm must remain near 1:1.

2. **Desktop header geometry and information architecture do not match.** At 1280 px the reference uses a 49 px black utility area plus an 80 px main header; the hero begins at y=129. Local uses a 39 px utility area plus a 79 px main header; hero begins at y=118. Reference utility controls are `INICIAR SESIÓN`, `E-LEARNING`, `LOCALIZADOR CENTROS`, and `CONTACTO`, with a filled login control and separators. Local has only `¿Eres profesional?` and `Contacto`. Reference main navigation uses seven editorial category links and search/globe/cart actions; local uses `INICIO`, `CATÁLOGO`, `CONTACTO` and search/account/cart. Peru links may be localized, but the density, hierarchy, alignment, target geometry, separators, and icon language should visually reproduce the reference.

3. **Mobile header visual language is wrong.** At 390 px the reference layout width is 375 px and has a 56 px header: 151 × 26 px logo at x=15, cart near x=290, and menu near x=334. Local has a 61 px header with hamburger, search, centered logo, account, and cart. The ordering, number of icons, logo alignment, spacing, and height are visibly different.

4. **Hero uses valid Peru content but the wrong visual composition.** An UNDER campaign is commercially allowed; matching the reference's current HOP campaign or international slide count is not required. However, at 1280 px the reference hero image is 1265 × 474 px at y=129; local is 1269 × 432 px at y=118. On mobile the reference uses a dedicated 375 × 469 px portrait image followed by a separate off-white copy panel, while local uses a 379 × 405 px image with all copy overlaid. Reference mobile headline starts below the image at approximately y=547; local headline begins over the image at approximately y=105. The local CTA is a 191 × 54 px filled rectangle; the reference treatment is `Ver gama` as a text link with a thin arrow. Preserve Peru campaign content, but rebuild its desktop/mobile composition, proportions, crop, text treatment, and CTA to the reference system.

5. **Hero/slideshow behavior is not reference-equivalent.** Local exposes one static campaign and no hero previous/next controls. A reduced Peru campaign count is allowed, including one campaign if that is all that is approved. If multiple approved UNDER/HOP/LUXLIGHT campaigns exist, they must use the reference carousel architecture, edge controls, transitions, responsive image swapping, and text motion. If only one approved campaign exists, the non-interactive single-slide state must still match the reference slide geometry and visual treatment; controls should be omitted/disabled cleanly rather than replacing the component with a different banner design.

6. **Typography is globally incorrect.** Reference computed family is `TTCommons`; local is `Montserrat, sans-serif`. This changes letter widths, weights, wrapping, density, and the overall Montibello character throughout navigation, hero, cards, product rail, CTAs, and footer. The reference editorial statement is 40/40 px on desktop and 35/35 px on mobile. Local omits that statement and uses a 48/48 px mobile hero headline in a different composition.

7. **The editorial transition into the range carousel is missing.** Reference places `Transforma tu salón con nosotros. Vive un antes y un después en tu historia.` between hero and cards. At 1280 px it is a centered 750 × 80 px block at approximately x=258/y=653. Local starts range cards at y=600 immediately after the hero, with no heading or equivalent whitespace. At mobile the reference heading is approximately 345 px wide, 35/35 px, and about 140 px tall before the cards.

8. **Range portfolio is correct, but carousel geometry and styling are not.** UNDER, HOP, LUXLIGHT, and HOP Keratin — Próximamente are the correct localized replacements; their difference from m.lab/Dénuée is not a defect. At 1280 px, reference cards are approximately 385 × 661 px at x=30/440/850/1260 with 25 px gaps and begin at y=773. Local cards begin at y=600 and measure approximately 417 × 658 px at x=30/472/914; the teaser collapses to about 220 × 381 px. Local lacks the reference heading, reference crop proportions, reference slidenav styling, and consistent full-size fourth-card treatment.

9. **Mobile range carousel breaks the page width.** At a 390 px viewport, local document client width is 379 px but document scroll width is 1,144 px. `.montibello-ranges__viewport` expands to 1,144 px and `.montibello-ranges__list` to 1,084 px, creating page-level horizontal scrolling. Reference client and scroll width are both 375 px. Carousel overflow must remain internal to the component.

10. **Best sellers violate both fidelity and commercial truth.** Local renders repeated `Montibello — próximamente` products with an invented `S/. 19.99` price. This is explicitly prohibited by the commercial scope. The module must retain the reference product-rail geometry and metadata hierarchy while using real confirmed Peru products from UNDER, HOP Color Last, HOP Smooth Hydration, HOP Ultra Repair, or LUXLIGHT. HOP Keratin cannot carry a price, purchase control, or available-for-sale presentation.

11. **Footer does not reproduce the reference architecture.** Reference desktop uses grouped Montibello information/support/compliance/social columns and a secondary legal row. Mobile uses the Montibello wordmark and ruled accordion rows with right arrows. Local visibly resolves to generic Shopify identity (`© 2026 Mi tienda, Tecnología de Shopify` and `Términos y políticas`) instead of the reference hierarchy, spacing, rules, accordion interaction, typography, and brand/legal treatment. Peru-specific link destinations and approved local legal copy are allowed; the visual shell is not.

12. **Store identity remains generic.** Browser title is `Mi tienda`; logo alt is `Mi tienda - Inicio`; body copy/footer exposes `Mi tienda`. This is a production blocker independent of assortment localization.

## MINOR DIFFERENCES

- Desktop reference logo is about 151 × 26 px at x=30/y=76 in the 1440 px inspection; local logo is about 152 × 26 px at x=40/y=65. Asset size is close, but header placement is not.
- Reference desktop utility typography is uppercase 12 px TTCommons with stronger button/separator hierarchy. Local is mixed case and visually lighter.
- Reference desktop navigation uses 18 px TTCommons in 80 px-tall targets. Local Montserrat navigation is less dense and positioned differently.
- Reference slideshow and card arrows use edge-aligned slidenav glyphs. Local range arrows are 50 px dark translucent circles, and hero arrows are absent.
- Reference card images have a restrained hover-scale treatment. Local does not consistently reproduce the same hover motion and easing.
- Local card labels and descriptions are commercially appropriate but require reference-equivalent type scale, spacing, line length, and casing treatment.
- HOP Keratin is correctly labeled `PRÓXIMAMENTE`, but the duplicated `PRÓXIMAMENTE` label and undersized fourth-card geometry reduce polish and fidelity.
- Reference includes its cookie settings control. Local does not show an equivalent; confirm whether the Peru storefront's consent requirements are handled elsewhere.

## TECHNICAL ISSUES

- `shopify theme check` passes: 365 files inspected with no offenses.
- Git working tree is dirty. Modified implementation files: `sections/footer-group.json`, `sections/header-group.json`, `sections/montibello-range-cards.liquid`. Untracked implementation file: `sections/montibello-utility-bar.liquid`.
- QA/context documents are also untracked under `docs/`: `docs/peru-commercial-scope.md` and `docs/qa/homepage-codex.md`.
- Tracked implementation diff summary: 3 files changed, 242 insertions, 131 deletions. The untracked utility-bar implementation is not included in that statistic.
- Mobile page overflow is measurable and severe: 379 px client width versus 1,144 px scroll width at a 390 px browser viewport.
- Local console reports `[shopify-account] Menu "customer-account-main-menu" not found in Storefront API. Falling back to default menu items.`
- The range script registers `window.resize` per section instance without teardown, which can accumulate when Shopify's theme editor rerenders sections.
- Range arrows are hidden below 990 px and no equivalent visible mobile control/pagination is provided. Touch scrolling may be acceptable only after overflow is contained within the carousel and matches the reference interaction.
- The reference emitted its own product-slider JavaScript error during inspection. This is not a local defect and should not be reproduced; QA compares intended visible behavior.

## REQUIRED FIXES FOR CLAUDE

1. **Rebuild desktop header geometry and hierarchy.** Target reference measurements at 1280 px: utility region 49 px, main header 80 px, hero start y=129. Current: 39 px, 79 px, hero start y=118. Preserve Peru-appropriate destinations, but match the reference's control density, uppercase 12 px utility styling, button/separator treatment, seven-item-style navigation rhythm, 18 px primary-nav typography, and search/locale/cart icon language.

2. **Match the mobile header.** Target at 390 px: 56 px high; logo 151 × 26 px at x=15; cart near x=290; menu near x=334. Current: 61 px with hamburger/search/centered logo/account/cart. Remove the visible mobile search/account controls, left-align the logo, and match reference spacing and icon strokes.

3. **Keep the UNDER campaign but rebuild it in the reference hero system.** Desktop target: image/content area approximately 1265 × 474 px at y=129; current 1269 × 432 px at y=118. Mobile target: 375 × 469 px dedicated portrait image followed by the off-white copy area; current 379 × 405 px with text overlaid. Match reference crop logic, vertical rhythm, headline/body scale, `Ver gama →` text-link CTA, and edge-control treatment when more than one approved Peru campaign is present.

4. **Implement only approved Peru campaign slides.** Do not copy unavailable international campaigns or invent a slide count. If official Marketing Center assets exist for multiple approved UNDER/HOP/LUXLIGHT campaigns, implement them with the reference slideshow transitions, arrows, responsive sources, and timing. If only one approved campaign exists, keep a single slide but preserve the same component geometry and responsive composition.

5. **Apply TTCommons and reference type metrics globally.** Replace Montserrat in the fidelity shell. Match the reference's real weights, line heights, and letter spacing across utility/nav, hero, editorial heading, cards, product metadata, CTAs, and footer. Validate 40/40 px desktop and 35/35 px mobile for the post-hero editorial statement.

6. **Restore the post-hero editorial statement and spacing.** Add the exact reference statement or an approved Peru-localized equivalent with the same line count and geometry. At 1280 px target approximately x=258/y=653, 750 × 80 px; mobile target x=15, width 345 px, height about 140 px.

7. **Retain the localized range set and fix only its visual implementation.** Keep UNDER, HOP, LUXLIGHT, and HOP Keratin — Próximamente. Target at 1280 px: card width 385 px, height near 661 px, x positions 30/440/850/1260, 25 px gaps, y≈773. Make all four cards follow the same base proportions; express HOP Keratin's unavailable state through reference-quality overlay/label treatment rather than collapsing the card. Match official Marketing Center crops and reference hover zoom/easing.

8. **Eliminate page-level horizontal overflow.** At 390 px, desired `document.documentElement.scrollWidth` equals client width (reference: 375/375; local: 379/1,144). Constrain `.montibello-ranges__viewport` to the available width, set necessary parent flex/grid items to `min-width: 0`, and keep horizontal overflow on `.montibello-ranges__list` only. Verify no off-screen card expands `body` or `html`.

9. **Replace fake best sellers with confirmed Peru product data.** Remove all `Montibello — próximamente` / `S/. 19.99` placeholders. Populate the reference-style rail with confirmed real products and approved imagery from UNDER, HOP Color Last, HOP Smooth Hydration, HOP Ultra Repair, and/or LUXLIGHT. Do not invent prices or SKUs. Do not place HOP Keratin in a purchasable product rail.

10. **Restore the missing reference section architecture using Peru content.** Implement the Hair Magazine-style editorial module, social/community module, salon-locator CTA, and assistance/contact CTA in the reference order with matching backgrounds, ratios, spacing, controls, and responsive stacking. Copy the visual shell; localize copy, links, articles, and calls to action appropriately for Peru.

11. **Rebuild the footer's visual shell.** Desktop must reproduce the grouped columns, spacing, hierarchy, and secondary legal row. Mobile must reproduce the Montibello wordmark, horizontal rules, accordion rows, arrows, and interaction. Use only approved Peru links/social accounts/legal wording; do not copy irrelevant international destinations merely for content parity.

12. **Remove generic Shopify identity and resolve the account error.** Set the page title, logo alt, metadata, and footer identity to Montibello Perú. Replace `Mi tienda` and the visible `Tecnología de Shopify` treatment. Configure `customer-account-main-menu` or remove the unsupported account surface if it is not part of the approved reference-equivalent header.

13. **Re-test interactions and responsiveness at 1440, 1280, 768, 390, and 375 px.** Verify no page-level horizontal scroll, correct hero responsive composition, slideshow controls only when applicable, carousel keyboard/touch behavior, hover scaling on pointer devices, mobile footer accordions, and reduced-motion handling.

14. **Include the untracked utility-bar file in Claude's implementation change set.** Provide a complete, reviewable Git diff; do not leave active theme implementation dependent on an untracked file.

## TEST RESULTS

- **Commercial-scope validation: PARTIAL PASS.** Range selection (UNDER, HOP, LUXLIGHT, HOP Keratin — Próximamente) is correct. International-only omissions are accepted. Fake product names/prices fail the commercial rules.
- **Desktop visual comparison (1280 × 720): FAIL.** Reference header geometry 49 + 80 px versus local 39 + 79 px; hero 1265 × 474 px versus local 1269 × 432 px; reference cards begin y=773 at 385 px width versus local y=600 at 417 px width.
- **Mobile visual comparison (390 × 844): FAIL.** Reference 56 px simplified header and 375 × 469 px portrait hero with copy below; local 61 px five-control header and 379 × 405 px hero with copy overlaid.
- **Responsive overflow: FAIL.** Reference client/scroll width 375/375; local 379/1,144.
- **Hero architecture: FAIL.** UNDER content is allowed, but slide proportions, mobile composition, CTA styling, and control architecture do not match.
- **Range content: PASS.** The localized range substitutions are correct and must not be replaced with m.lab, Dénuée, or other international-only ranges.
- **Range visual/behavioral fidelity: FAIL.** Geometry, fourth-card sizing, heading, controls, hover language, and mobile containment differ.
- **Best-seller commercial integrity: FAIL.** Invented `S/. 19.99` placeholder products are present.
- **Typography: FAIL.** Reference TTCommons; local Montserrat.
- **Section architecture: FAIL.** Major reference-style editorial, community, locator, and assistance modules are absent.
- **Footer: FAIL.** Reference visual hierarchy and mobile accordion language are not reproduced; generic Shopify identity remains.
- **Console: FAIL.** Missing customer account menu error observed locally.
- **`git status --short`: REVIEW REQUIRED.** Three modified tracked implementation files, one untracked implementation file, and the requested untracked documentation are present.
- **`git diff`: REVIEW REQUIRED.** Active header/footer/range changes are visible; the untracked utility bar is outside the tracked diff.
- **`shopify theme check`: PASS.** 365 files inspected with no offenses found.
