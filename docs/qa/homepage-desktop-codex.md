# CODEX QA — STRICT DESKTOP FIDELITY

## VERDICT

FAIL

## MANAGER REVIEW

NOT READY TO SHOW

## DOES IT FEEL LIKE THE SAME WEBSITE?

NO

The current implementation is substantially better structured than the previous version, but a side-by-side comparison still reads as two different website systems. Local feels like a shorter custom Shopify homepage assembled from official Montibello assets; the reference feels like a dense editorial/commerce system with a specific typography, content, and interaction language.

Peru commercial scope was applied correctly. This verdict is not caused by the absence of m.lab, Dénuée, Éclat, Styling, Skincare, other international-only ranges, or additional international campaigns.

## TOP 5 VISUAL REASONS

1. **Hero typography and placement are visibly different.** At 1280 px the reference headline is 40/40 px at x=30; local is 56/56 px at x=76. The local headline dominates the image like a bespoke campaign landing page, while the reference slideshow uses a smaller, left-edge editorial text system.

2. **The central commerce/editorial density is wrong.** The product rail has only three cards occupying 924 px of a 1209 px rail, leaving a large empty right side and no usable arrow. The reference presents four complete product cards in view, with denser metadata and a visibly continuous rail.

3. **The Magazine module has the right broad layout but the wrong identity.** Local uses a 32 px generic “Educación y tendencias para tu salón” lead, an underlined text link, and three reused range-promotion cards. The reference uses the Montibello wordmark, a 40/40 px “The Hair Magazine para profesionales” editorial lockup, a black button, and article cards that read as published stories.

4. **The lower-page pacing is materially different.** Local’s locator band is 440 px high versus 330 px reference and stacks all copy at the lower left; the reference balances a left headline with a separate right tagline/button. Local’s assistance section is 267 px high versus 181 px reference. These extra heights make the final third feel slower and more generic.

5. **Header and footer information density do not match the official system.** At 1280 the local primary navigation collapses `CONTACTO` into `MÁS`, despite the official reference keeping its full desktop navigation visible. The local utility bar has two actions instead of the reference’s four-action rhythm, and the footer has an empty social column, a sparse compliance slot, text instead of the wordmark, and `Mi tienda` branding.

## CRITICAL DIFFERENCES

1. The hero’s 56 px headline, 76 px left inset, narrow 14 px body copy, and campaign-specific composition remain far from the reference slideshow typography (40 px headline, 30 px inset, 16 px body). Hero dimensions are now correct, but geometry alone does not make the composition faithful.

2. The safe product stand-in is commercially truthful but visually incomplete. Only three cards appear, leaving approximately 285 px of unused rail width at 1280. The next arrow is disabled because the rail has no overflow. The official module reads as an active multi-item product carousel rather than three isolated range tiles.

3. The Magazine area still reads as generic range promotion rather than the official editorial product. It lacks the Montibello wordmark and black CTA, uses a 32 px lead instead of 40 px, repeats imagery already used elsewhere, and labels cards with broad range descriptors instead of credible editorial subjects. No fabricated articles are required, but the visual role and hierarchy must be reproduced more faithfully.

4. Important local destinations are not manager-review safe. Direct checks returned 404 for `/collections/under`, `/pages/hop`, `/pages/luxlight`, `/pages/hop-keratin`, and `/pages/contacto`; `/pages/nosotros` returned 502 during the HTTP status pass. In-browser verification confirmed `/collections/under` renders `404 No encontrado – Mi tienda`. That 404 template also exposes demo `S/. 19.99` content, although no fake price appears on the homepage itself.

5. The professional/locator module is 110 px taller than the reference (440 px local versus 330 px reference) and uses a single lower-left content block. It does not reproduce the reference’s two-part left/right message and CTA balance.

6. The local scroll container has measurable page-level horizontal overflow at 1280: `.page-wrapper` client width is 1269 px and scroll width is 1273 px. The four-pixel overflow is consistent with carousel arrows positioned at `left: -4px` / `right: -4px`; after interaction the entire page can sit at `scrollLeft: 4`.

## SECTION-BY-SECTION COMPARISON

### Header

- Utility/main header heights now match the reference at 49/80 px.
- Wordmark size is close: local 152 × 26 px versus reference approximately 151 × 26 px. Local x=26 at the effective 1269 px canvas and x=30 at 1440, which is acceptable.
- Local desktop nav uses 18 px text and six destinations. At 1280, `CONTACTO` is pushed into `MÁS`; reference keeps seven primary items visible.
- Local labels `COLOR / TRATAMIENTO / DECOLORACIÓN / PRÓXIMAMENTE` are commercially safe but do not expose the actual Peru brands as clearly as `UNDER / HOP / LUXLIGHT / HOP KERATIN` would.
- Utility density remains visibly low: local has only `¿ERES PROFESIONAL?` and `CONTACTO`; reference uses login, e-learning, locator, and contact separated by fine rules.
- Search and cart remain; reference also has a locale/globe control. Do not add a nonfunctional locale control solely for decoration, but retune spacing so the right-side tool cluster feels complete.
- Browser title and logo accessible name remain `Mi tienda`.

### Hero

- Geometry passes: local is 1269 × 476 px at 1280 versus reference 1265 × 474 px; local is 1429 × 536 px at 1440 versus reference about 1425 × 534 px.
- The approved UNDER 2560 × 960 asset loads at full resolution, maintains its native 2.667:1 ratio, and is not stretched.
- Local headline: 56 px/56 px, weight 700, x=76, y=271 at 1280.
- Reference headline: 40 px/40 px, weight 600, x=30, y=351 on the inspected slide.
- Local body: 14 px/22.4 px in a 319 px column. Reference body: 16 px/19.7 px in a 417 px column.
- CTA scale is close (23 px), but local’s overall text cluster is larger, farther from the edge, and visually higher/heavier.
- A single Peru campaign is allowed; lack of multiple slides is not a defect. If more campaigns are later added, they must use the reference slide transition and edge-control language.

### Editorial Statement

- The prior three-line defect is fixed. Local is two lines at 40/40 px and y=655; reference is two lines at 40/40 px and y=653.
- Local width is 820 px at x=225; reference is 750 px at x=258. The result is close in line count but visibly broader and heavier.
- There is too much space after the statement. Local range cards begin at y=835; reference cards begin at about y=773, leaving local +62 px low at both desktop sizes.

### Range Carousel

- Card geometry now passes at both viewports.
  - 1280: local 385 × 661 px, 25 px gap, x=30/440/850/1260; media 385 × 439 px. These match the reference targets.
  - 1440: local 417 × 677 px, 25 px gap, x=65/507/949/1391; reference is approximately x=63 with 417 × 677 px cards and 24–25 px gaps.
- All cards share the intended height. HOP Keratin remains labelled `PRÓXIMAMENTE`, has no purchase link, and contains no price or availability claim.
- Native rail scrollbar suppression passes (`scrollbar-width: none`).
- Arrow behavior passes: at 1280 `Siguiente` moves from 0 to the 406 px maximum; previous/next disabled states update correctly.
- Hover zoom passes technically: the tested image transitions from `none` to `matrix(1.08, 0, 0, 1.08, 0, 0)`.
- Remaining issue is vertical pacing: the whole rail starts 62 px too low because statement-bottom plus range-top spacing totals about 100 px instead of the reference’s approximately 40 px.

### Product Rail

- Card/media geometry now matches the target: local 283 px card width and 394 px media height at 1280, with 25 px gaps. Heading is centered at 40 px.
- Commercial truth passes: only UNDER, HOP, and LUXLIGHT appear; there are no prices, sizes, SKUs, stock claims, Add to Cart controls, or HOP Keratin commerce.
- Visual density fails. Local has three 283 px cards at x=30/338/646 and ends around x=929, leaving the right quarter of the 1209 px rail empty. Reference shows four approximately 283 px product cards across the row and continues as a carousel.
- Product arrow logic exists but both arrows are effectively inactive because local client width and scroll width are both 1209 px.
- The cards read as large range-image links, not product cards: minimal label/title hierarchy, no product-level packshot consistency, and no alternate-image treatment. The UNDER card is product-like, while HOP and LUXLIGHT are campaign/range images, producing inconsistent semantics.

### Magazine / Editorial

- The Glucamine/UNDER long-form technology section has been removed from HOME. This fix is verified.
- The section now uses the correct lead-plus-horizontal-rail architecture and its arrow reaches the 99 px maximum with correct disabled states.
- Card proportions are close: local 300 × 375 px; reference first article card approximately 288 × 367 px at 1280.
- Lead treatment fails fidelity: local heading is 32/35.2 px in a 300 px column; reference is 40/40 px in an approximately 271 px column. Local substitutes an eyebrow and body paragraph for the official wordmark/editorial lockup.
- Local CTA is an underlined text link; reference uses a filled black button.
- Local first card begins at x=390 at rest versus reference about x=341. The 60 px lead-to-rail gap and 24 px card gaps make the composition looser.
- Reusing Under/HOP/Luxlight range imagery and generic descriptors makes the module read as another range carousel, not a Magazine surface.

### Community

- The static-grid defect is fixed. Local is now a horizontal rail with five items, hidden native scrollbar, 50 px arrows, hover motion, and correct end-state logic. Two next clicks move to the 471 px maximum and disable the next arrow.
- Local uses 320 × 440 px media with 20 px gaps inside a 1209 px rail. The reference also uses a dominant wide social rail, so the core interaction role now passes.
- Editorial tone remains weak: local heading is only `La comunidad Montibello`, with no supporting community line, and every tile repeats imagery already seen in ranges, products, Magazine, or locator. The reference feels like a varied social feed with mixed-media rhythm.
- No social handle should be fabricated. Use neutral approved copy and more varied approved campaign frames if a Peru account is unconfirmed.

### Professional / Locator

- The former 1,094 px split section has been replaced with an image-led band; that architectural fix is verified.
- Local band: 1269 × 440 px. Reference: 1265 × 330 px. Local is 33% taller.
- Local places a 32 px heading, paragraph, and button together in a lower-left 480 px block. Reference places a 40 px headline on the left and a separate “Siempre a tu lado” plus black locator button on the right.
- Local uses an approved 1391 × 2086 professional image and does not stretch it, but the extreme face crop and bottom-heavy overlay do not communicate the same salon-locator visual role as the reference salon interior.
- Routing to truthful Peru contact/commercial assistance is acceptable; destination localization is not the failure.

### Assistance CTA

- The black-card treatment is implemented and clearly closer to the reference.
- Local card is approximately 1189 × 147 px at 1280; reference is approximately 1205 × 131 px. Local section is 267 px tall versus 181 px reference because of excessive outer padding.
- Local heading is 24/24 px; reference is approximately 23/21 px. Contrast, horizontal copy/button layout, and light button treatment pass.
- Reduce total section height and increase card width slightly; this is refinement rather than a full rebuild.

### Footer

- Five desktop visual columns now exist and total local footer height is approximately 362 px, close to the 366 px reference.
- Visual content remains incomplete. Local uses `Montibello Perú` text plus a paragraph instead of the wordmark; reference uses the Montibello wordmark and a distinct About column.
- Local `Compliance` contains only the generic `Términos y políticas` disclosure. Reference shows a dense legal link list.
- Local `Síguenos` is empty, creating a conspicuous blank final column. Do not fabricate accounts, but either populate confirmed corporate Montibello channels approved for Peru or redesign the slot truthfully while retaining comparable density.
- Bottom copyright still reads `© 2026 Mi tienda` instead of Montibello Perú.

## TYPOGRAPHY FIDELITY

Montserrat is accepted as the temporary licensed fallback and is not, by itself, a failure. Its current tuning is inconsistent:

- Hero must reduce from 56/56 px, weight 700 to approximately 40/40 px, weight 600, and move from x=76 to x≈30.
- Hero body should move from 14/22.4 px to approximately 16/20 px and use a wider ~417 px measure.
- Editorial statement should return from 820 px to the reference 750 px while preserving two lines; test 40/40 px at weight 600 with tracking around `-0.03em` before changing font size.
- Magazine lead must increase from 32/35.2 px to 40/40 px and use the reference’s tighter editorial lockup.
- Destination heading must increase from 32/36.8 px to 40/40 px when the band is rebuilt.
- Local major centered headings use 40/44 px while reference uses 40/40 px. Set line-height to 1.0 for the product and community headings.

## IMAGE / ASSET FIDELITY

- All 18 inspected homepage images loaded with non-zero natural dimensions. No missing or broken homepage image was found.
- Hero uses the 2560 × 960 approved UNDER asset at the correct aspect ratio.
- Range imagery loads at appropriate source resolution and uses `object-fit: cover`; no stretching was observed.
- Product and Magazine sections over-reuse the same HOP and Luxlight campaign images. This makes different modules visually indistinguishable and weakens the reference’s progression from range discovery to products to editorial.
- Community repeats the same assets again instead of creating a varied social/editorial cadence.
- Locator uses an approved professional image, but its portrait source is forced into a shallow landscape band with an extreme face crop. Use an approved landscape salon/professional asset or a crop that preserves the locator intent.
- No thumbnail-quality or obviously soft source was detected at the tested sizes.

## DESKTOP MEASUREMENTS

| Item | Reference 1280 × 900 | Local 1280 × 900 | Reference 1440 × 1000 | Local 1440 × 1000 |
|---|---:|---:|---:|---:|
| Effective page width | 1265 px | 1269 px | 1425 px | 1429 px |
| Utility / main header | 49 / 80 px | 49 / 80 px | 49 / 80 px | 49 / 80 px |
| Hero | 1265 × 474 px | 1269 × 476 px | ~1425 × 534 px | 1429 × 536 px |
| Hero headline | 40/40 px, x=30 | 56/56 px, x=76 | ~40/40 px, x=30 | 56/56 px, x≈80 |
| Statement | x=258, y=653, 750 × 80 px | x=225, y=655, 820 × 80 px | x≈338, y=713, 750 × 80 px | x=305, y=715, 820 × 80 px |
| Range cards start | y≈773 | y=835 | y≈833 | y=895 |
| Range card / media | 385 × 661 / 385 × 439 px | exact match | 417 × 677 / 417 × 475 px | 417 × 677 / 417 × 476 px |
| Product heading | y=1534, 40/40 px | y=1618, 40/44 px | y≈1610, 40 px | y=1694, 40/44 px |
| Product card / media | ~283 px / 394 px | 283 px / 394 px | ~306 px card | 283 px card |
| Magazine lead heading | 40/40 px, 271 px wide | 32/35.2 px, 300 px wide | ~40 px | 32 px |
| Magazine card | ~288 × 367 px | 300 × 375 px | ~312 × 397 px | 300 × 375 px |
| Community heading | y=2769, 750 × 40 px | y=2820, 586 × 44 px | y≈2909 | y=2896 |
| Locator band | 1265 × 330 px | 1269 × 440 px | same visual ratio | 1429 × 440 px |
| Assistance outer/card | 181 / 131 px high | 267 / 147 px high | similar reference rhythm | 267 / ~147 px high |
| Footer | ~366 px | ~362 px | ~366 px | ~362 px |
| Total scroll height | 4293 px | 4475 px | ~4473 px | ~4551 px inferred from measured sections/footer |

Local has eight major HOME modules before the footer, matching the official module count and order. The remaining rhythm mismatch comes from spacing distribution and component density, not missing section names.

## TECHNICAL STATUS

- `shopify theme check` completed successfully but is not clean: 372 files inspected, 11 warnings across `snippets/mega-menu-list.liquid` and `snippets/util-mega-menu-img-sizes-attr.liquid`. Warnings include two orphaned snippets and nine scoped-CSS-class warnings. Previous QA recorded no offenses, so these should be reviewed before handoff.
- Homepage console inspection after load and carousel interaction returned no errors or warnings.
- Range, Magazine, and community arrows work and update disabled states. Product arrows are present but inactive because the rail does not overflow.
- Native rail scrollbars are visually suppressed (`scrollbar-width: none`); this fix passes.
- Page-level horizontal overflow does not fully pass: `.page-wrapper` is 1269 px client / 1273 px scroll width at 1280.
- Homepage images all resolve and report non-zero natural dimensions.
- Homepage contains no price, SKU, stock, size, or Add to Cart claims. HOP Keratin is non-purchasable.
- Important linked destinations fail in the current preview: UNDER, HOP, LUXLIGHT, HOP Keratin, and Contacto returned 404; Nosotros returned 502 during the status pass. Browser confirmation reproduced the UNDER 404.
- `/collections/under` 404 template exposes demo `Montibello — próximamente` cards with `S/. 19.99`; remove this demo leakage even though it is outside the homepage DOM.
- Footer `Under` now resolves to `/collections/under` rather than a raw `shopify://` href; that specific href fix is verified.
- `git diff --check` passes. QA modified only this report.

## REQUIRED FIXES FOR CLAUDE

### 1. Recompose hero typography

REFERENCE:
40/40 px headline at x=30, weight 600; 16/19.7 px body in an approximately 417 px column; 23 px text CTA. The cluster feels integrated into the slideshow rather than dominant over it.

LOCAL:
56/56 px headline at x=76–80, weight 700; 14/22.4 px body in a 319 px column. The headline visually overwhelms the official campaign image.

TARGET:
Set desktop hero content inset to 30 px; headline approximately 40 px/40 px and weight 600; body approximately 16 px/20 px with max-width around 417 px. Rebalance vertical placement against the approved UNDER crop while keeping the now-correct 2.667:1 hero ratio.

PRIORITY:
P0

### 2. Restore official vertical rhythm after the statement

REFERENCE:
At 1280 the statement is y=653–733 and range cards begin around y=773, approximately 40 px later.

LOCAL:
Statement is y=655–735 and range cards begin y=835, approximately 100 px later. The same +62 px displacement occurs at 1440.

TARGET:
Reduce the combined statement-bottom/range-top gap from about 100 px to about 40 px. Keep current range dimensions unchanged. This should also move the product heading from y=1618 toward y≈1534.

PRIORITY:
P0

### 3. Make the safe product rail visually continuous

REFERENCE:
Four approximately 283 px product cards fill the 1280 desktop row, with product-level packshots, dense label/title/descriptor hierarchy, and a continuing carousel.

LOCAL:
Three 283 px cards end at x≈929 inside a 1209 px rail, leaving ~285 px blank. HOP and Luxlight use campaign/range images; arrows are disabled because there is no overflow.

TARGET:
Use at least four truthful, confirmed Peru product/subfamily cards—for example UNDER plus confirmed HOP Color Last/Ultra Repair/Smooth Hydration and/or LUXLIGHT—using approved product-level packshots. Keep all price, SKU, size, stock, and purchase data absent until authoritative. Ensure total content exceeds the rail so the next arrow has a real function.

PRIORITY:
P0

### 4. Rebuild the Magazine lead as Montibello editorial

REFERENCE:
Montibello wordmark above a 40/40 px, three-line Hair Magazine title, filled black CTA, approximately 271 px lead width, then 288 × 367 px article cards beginning around x=341.

LOCAL:
14 px eyebrow, 32/35.2 px generic heading, body paragraph, underlined CTA, 300 px lead, 60 px lead-to-rail gap, and range-promotion cards beginning around x=390.

TARGET:
Add the approved Montibello wordmark to the lead; use a truthful Peru editorial label while preserving the Hair Magazine lockup, 40/40 px hierarchy, and black button. Reduce lead-to-rail gap toward ~30–40 px, card width toward ~288 px at 1280, and use approved education/editorial subjects rather than repeating range descriptors. If no article hub exists, use non-clicking editorial cards or a truthful `Próximamente` editorial destination instead of routing the CTA to generic Nosotros.

PRIORITY:
P0

### 5. Fix important destinations and demo leakage

REFERENCE:
Primary, card, editorial, locator/contact, and footer links resolve to their intended live destinations.

LOCAL:
`/collections/under`, `/pages/hop`, `/pages/luxlight`, `/pages/hop-keratin`, and `/pages/contacto` return 404; `/pages/nosotros` returned 502 in the status pass. The UNDER 404 exposes demo S/. 19.99 content.

TARGET:
Create/attach the intended unpublished-theme resources in the preview store or temporarily remove/disable links that cannot resolve. Eliminate demo products/prices from the 404 template. Recheck every homepage href and require non-error responses before manager review.

PRIORITY:
P0

### 6. Match locator band geometry and composition

REFERENCE:
1265 × 330 px at 1280, 40/40 px headline on the left, and a separate right-side tagline plus dark CTA over a salon-oriented landscape image.

LOCAL:
1269 × 440 px, 32/36.8 px heading, paragraph, and CTA stacked in one lower-left block over an extreme portrait face crop.

TARGET:
Reduce desktop band height to about 330 px; split content into left headline and right supporting message/button; increase headline to 40/40 px; use an approved landscape salon/professional asset or a crop that retains a salon/destination visual role. Route to Contacto if no locator exists.

PRIORITY:
P1

### 7. Tighten assistance section

REFERENCE:
181 px outer section with a 1205 × 131 px black card at 1280 and approximately 25 px vertical outer spacing.

LOCAL:
267 px outer section with a 1189 × 147 px card and approximately 60 px vertical spacing.

TARGET:
Reduce outer padding to approximately 25 px top/bottom, widen the card toward 1205 px, reduce card height toward 131 px, and retain the current horizontal white-text/light-button arrangement.

PRIORITY:
P1

### 8. Complete header density without overflow menus

REFERENCE:
All desktop primary destinations remain visible at 1280; utility actions form a compact four-item rhythm; search, locale, and cart align as one tool group.

LOCAL:
`CONTACTO` collapses into `MÁS` at 1280. Utility has only two actions, and long generic category labels consume excessive width.

TARGET:
Use shorter Peru brand labels `UNDER / HOP / LUXLIGHT / HOP KERATIN` plus only the essential supporting destinations, tune nav padding below the current 16 px per side if needed, and keep all intended desktop links visible at 1280. Restore reference-like utility density only with truthful destinations; do not add dead controls.

PRIORITY:
P1

### 9. Complete footer visual content

REFERENCE:
Montibello wordmark plus dense About, Information/support, Compliance, and Social columns, followed by a compact legal row.

LOCAL:
Five columns exist, but brand is plain text, Compliance is one generic control, Social is empty, and copyright says `Mi tienda`.

TARGET:
Render the approved wordmark; replace `Mi tienda` with Montibello Perú; expose real available policy destinations individually; populate only confirmed/approved Montibello social channels or provide a truthful alternative with comparable visual density. Preserve the current near-correct 362 px total height.

PRIORITY:
P1

### 10. Remove four-pixel page overflow

REFERENCE:
No page-level horizontal scrolling; carousel controls overlay within the viewport.

LOCAL:
At 1280 `.page-wrapper` is 1269 px client width and 1273 px scroll width, and can move to `scrollLeft: 4`. Carousel arrows use negative four-pixel offsets.

TARGET:
Place all rail arrows within their viewport (`left/right: 0` or a positive inset), then verify `.page-wrapper.scrollWidth === .page-wrapper.clientWidth` at both primary viewports while retaining horizontal rail overflow internally.

PRIORITY:
P1

### 11. Refine statement and heading line-height

REFERENCE:
Statement 750 × 80 px at 40/40; centered section headings 40/40.

LOCAL:
Statement 820 × 80 px at 40/40; product/community headings use 40/44.

TARGET:
Return statement max-width to ~750 px while preserving two lines via Montserrat weight/tracking tuning (test weight 600 and `letter-spacing: -0.03em`). Set major 40 px headings to 40 px line-height.

PRIORITY:
P2

### 12. Resolve Theme Check warnings

REFERENCE:
QA handoff should not introduce new lint debt.

LOCAL:
Theme Check completes with 11 warnings across two snippets, including orphaned snippets and scoped CSS class warnings.

TARGET:
Remove genuinely unused snippets or restore valid references; scope or annotate the reported mega-menu CSS classes appropriately. Re-run until the current changes introduce no new warnings.

PRIORITY:
P2

## FINAL RECOMMENDATION

Do not show this version to the manager as a near-1:1 Montibello Peru homepage. Preserve the verified structural work—correct section order, hero ratio, range geometry, truthful commerce, working rails, hidden native scrollbars, black assistance treatment, and five-column footer shell—but complete the P0 hero, spacing, product-density, Magazine, and destination-link fixes first. A subsequent review should begin with same-size top/full-page screenshots; if the pages still look authored by different design systems before measurements are read, the fidelity milestone has not been met.
