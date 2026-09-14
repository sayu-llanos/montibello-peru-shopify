# Montibello PDP — Reference Architecture Map

Live reference pages inspected 2026-09-14 (DOM `innerText` dumps via a
headless browser — content only, no screenshots, no assets downloaded) to
confirm the manager's PDP information architecture against the actual
current site rather than assuming it. All three confirm the same underlying
template with only content differing.

## Pages inspected

| Pilot | Reference URL | Page title |
|---|---|---|
| UNDER Permanent Colour | https://hair.montibello.com/producto/under/ | "Under - Coloración Permanente Bajo Contenido de Ammonia \| Under" |
| Luxlight Supreme Lightener 9+ | https://hair.montibello.com/producto/supreme-lightener-9/ | "Luxlight Supreme Lightener 9+ - Aclaración Capilar \| Luxlight" |
| HOP Ultra Repair Shampoo | https://hair.montibello.com/producto/ultra-repair-shampoo/ | "Ultra Repair Shampoo - Champú Ultra Reparador \| Hop Repair" |

## Confirmed common structure (all three)

1. Breadcrumb / category context (theme-level navigation — not part of this build)
2. Range eyebrow (e.g. "under", "luxlight", "Ultra Repair")
3. Product title
4. Functional subtitle in caps (e.g. "COLORACIÓN PERMANENTE DE ALTA COBERTURA CON BAJO CONTENIDO DE AMMONIA", "POLVO DECOLORANTE MULTITÉCNICAS", "CHAMPÚ ULTRA REPARADOR")
5. Concise description / bullet-style intro copy
6. "Exclusivo Profesional" badge — present on UNDER and Luxlight, **absent** on the HOP shampoo (confirms this is a real conditional flag, not a fixed brand mark — matches `montibello.professional_only` being optional)
7. Format/size (e.g. "60 g", "500 gr", "300ml")
8. Hair type / target tag — present on Luxlight ("Todo tipo de cabello") and HOP ("Cabello dañado"), **absent** on UNDER (confirms `montibello.hair_type` is genuinely optional per product, not always shown)
9. "Ver características" — collapsed accordion (closed by default)
10. Technology paragraph — **always visible, not collapsed** on Luxlight ("Potenciada por Bond3 Force System + Metal Shield…"); UNDER folds its equivalent story into the characteristics accordion instead and has no separate always-open technology block. This is why `montibello-product-details.liquid` treats the technology block as independently optional from the accordion, not a forced pairing.
11. "Ver todos los ingredientes" — collapsed accordion
12. "Cómo usar [Product]" — collapsed accordion
13. "Datos de interés" — collapsed accordion, short claim lines
14. "Ingredientes principales" — visual card module (HOP only, in this sample): "Colageno Vegano" / "LifeAlgae Bioscience", each with a title + description paragraph
15. "Descubre la rutina completa [Product]." — numbered routine module (HOP only, in this sample): 4 numbered steps, step 2 groups two products (Mask + Rinse) under one number — confirms `montibello_routine_step` needs a `products` **list** field, not a single product reference. Mask and Rinse under step 2 live on **one** `montibello_routine_step` metaobject, in that one entry's `products` list — not on two separate metaobject entries that share the same `step_number` and get grouped at render time. `montibello-product-routine.liquid` renders `montibello.routine`'s step list directly, in order, with no grouping/deduplication logic.
16. Shared bottom CTA band (same on all three, and identical to the one already used on the UNDER/HOP/Luxlight range pages): "¿Tienes un salón pero no eres cliente todavia? → CONTACTA CON UN COMERCIAL" / "Localiza tu salón o peluquería Montibello más cercana → ENCUENTRA"

No PDF or video embed was found on any of the three reference PDPs (unlike
the UNDER *range* page, which links a Carta de Color PDF) — the shade chart
lives on the range page, not the individual product page, on the
international site. This build's Shade Browser section is new relative to
the reference (the reference doesn't need one, since Peru's `under-permanent-colour`
PDP is a Peru-specific consolidation of 57 source rows that the
international site doesn't structure the same way — see
`docs/shopify-product-architecture.md`).

## What this build reuses vs. builds custom

| Reference element | Implementation |
|---|---|
| Media gallery | Native Shopify `_product-media-gallery` block, embedded via `content_for 'block'` inside `montibello-product-main.liquid` — not rebuilt |
| Eyebrow / title / subtitle / tags / description / CTA | Custom Liquid in `montibello-product-main.liquid` (needed for per-field hide-when-blank control that native richtext dynamic-source blocks can't guarantee) |
| Price / Add to cart | **Not implemented** — see `pdp-implementation-notes.md` for why native `buy-buttons`/`price`/`variant-picker` blocks were deliberately not used |
| Size variant switch (HOP) | Custom link-based selector (`?variant={id}`), informational only, no cart action |
| Accordions | Custom, accessible `<details>/<summary>` markup (`snippets/montibello-pdp-accordion-item.liquid`), zero JS, no `display:none`-dependent control |
| Technology block | Custom, in `montibello-product-details.liquid`, independently optional from the accordion rows |
| Ingredientes principales | Custom, `montibello-product-ingredients.liquid` |
| Descubre la rutina completa | Custom, `montibello-product-routine.liquid` — renders `montibello.routine`'s step list directly in order; no grouping logic, since each numbered step is already one `montibello_routine_step` metaobject with its own `products` list |
| Bottom CTA band | Reused as native Horizon `group`/`text`/`button` blocks directly in `templates/product.montibello.json` (`section_contact_cta`) — the exact same block pattern already used on the homepage and range pages, no new Liquid file needed |
| Tiendas Aliadas | New to Peru — does not exist on the international reference at all, since it assumes Shopify-native checkout. Built per the manager's explicit requirement; see `allied-stores-architecture.md` |

## Typography and visual language

Not re-measured pixel-by-pixel for this pass (that level of forensic
comparison was already done for the homepage and range pages in prior
rounds, and the CSS conventions carried over here — 40px/700 headings, 16px
body copy, 5px button radius, `#2E2D2C`/`#E7E6DF` palette). This build
inherits those conventions directly (see the `{% stylesheet %}` block of any
`montibello-product-*.liquid` file) rather than re-deriving them, per the
instruction to spend research effort only where genuinely new ground is
being covered.
