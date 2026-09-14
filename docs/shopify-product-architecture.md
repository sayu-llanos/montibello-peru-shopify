# Shopify Product Architecture

Decision date: 2026-09-14
Namespace resolved: 2026-09-14 (Codex PDP fix round)

This document defines the canonical Shopify product, variant, metafield, and metaobject model for the 92 confirmed Montibello Peru catalog rows. It is an architecture specification only. No Shopify product, collection, metafield, metaobject, theme, or storefront change has been made.

**Namespace note:** this document originally proposed a `custom.*` metafield namespace. That proposal is retired. The theme's PDP build (`templates/product.montibello.json` and the `montibello-product-*`/`montibello-allied-stores`/`montibello-shade-browser` sections) uses namespace `montibello` with the field names below, and this document has been updated to match — there is now one naming scheme, not two. See `docs/product-pages/product-data-schema.md` for the field-by-field type table the theme actually reads. Metaobject type handles below are likewise prefixed `montibello_` to match the implemented types.

## Executive Recommendation

Build **27 product detail pages (PDPs)** with **36 Shopify variant records**:

| Range | Source rows | PDPs | Shopify variants | SKU-backed variants | Coming-soon PDPs |
|---|---:|---:|---:|---:|---:|
| UNDER | 63 | 7 | 7 | 6 | 0 |
| HOP | 19 | 10 | 19 | 19 | 0 |
| LUXLIGHT | 8 | 8 | 8 | 8 | 0 |
| HOP Keratin | 2 | 2 | 2 | 2 | 2 |
| **Total** | **92** | **27** | **36** | **35** | **2** |

The difference between 36 Shopify variants and 35 SKU-backed variants is deliberate. Shopify requires every product to have a default variant, so the informational UNDER colour PDP will have one non-commercial, SKU-less default variant. It does not represent any of the 57 shades. The 57 shade rows become structured shade entries referenced by that PDP and do not become fake sellable variants.

The row-level decisions are recorded in:

- `data/shopify/product-grouping.csv`: one row per canonical product.
- `data/shopify/source-to-product-map.csv`: one row per source catalog row, mapped exactly once.

## Decision Principles

- Use a variant when records are the same formulation and differ only by a standard merchandise choice such as package size.
- Use separate PDPs when concentration, formulation, function, instructions, or professional decision-making materially differs.
- Do not expose a sellable variant without a confirmed Peru ERP SKU.
- Preserve exact Peru scope and status. International pages inform information architecture only; they do not add products to Peru.
- Keep canonical handles independent of package size so a later confirmed size can join the product without changing its URL.
- Do not treat active portfolio status as proof of price, stock, retail availability, or publication approval.

## Range Decisions

### UNDER Permanent Colour

**Decision: option C, one informational colour-system PDP plus structured shade metaobjects.**

Create one canonical PDP at `under-permanent-colour`. It explains the permanent colour system and renders the 57 confirmed shades as a filterable or grouped colour chart. Each shade is a `montibello_under_shade` metaobject, not a Shopify variant.

This is preferable to 57 separate PDPs because the official Montibello presentation treats UNDER as one product system with a colour chart. It is also preferable to 57 current variants because the source values are shade identifiers, not confirmed Peru ERP SKUs. Creating variants now would falsely imply SKU, price, inventory, and purchase readiness.

The informational PDP must remain non-purchasable until Montibello Peru defines the intended transaction model. Shopify's unavoidable default variant must have no fabricated SKU, barcode, price, or inventory value and must not be presented as a shade choice.

If Peru later confirms ERP SKUs and direct shade purchasing, each commerce variant should use option `Shade` and reference its existing `montibello_under_shade` metaobject through a variant metafield. The metaobject remains the durable shade-chart record; the ERP variant becomes the commerce record.

### UNDER Activators And Monodoses

Create six separate PDPs: three 1000 ml activators and three 90 ml monodoses, one for each confirmed strength.

- Do not combine 1000 ml activators and 90 ml monodoses. They are distinct packaging formats and source product identities.
- Do not group 15vol, 25vol, and 35vol as variants. Peroxide concentration is technically material, not a cosmetic package choice, and the confirmed Peru source treats each concentration as a distinct product identity.
- Each PDP has one default SKU-backed variant.
- Reuse the generic 1000 ml image only with an explicit non-strength-specific image status. Do not reuse it for monodoses.

### HOP

Create one PDP per subfamily and formulation, with `Size` variants for each paired Peru package size:

| Subfamily | Formulation PDPs | Variant pattern |
|---|---:|---|
| Color Last | Shampoo, Rinse, Mask | Two `Size` variants each |
| Smooth Hydration | Shampoo, Rinse, Mask | Two `Size` variants each |
| Ultra Repair | Shampoo, Rinse, Mask | Two `Size` variants each |
| Ultra Repair | Sealed Ends | One standalone default variant |

This produces 10 HOP PDPs and preserves all 19 confirmed SKUs. Shampoo, Rinse, Mask, and Sealed Ends remain separate because they are different formulations and routine steps. The paired package sizes share formulation-level PDP content and official product-level imagery, while SKU, size, future price, barcode, inventory, and any size-specific retailer URL remain variant-owned.

### LUXLIGHT

Create eight PDPs, one for each confirmed Peru SKU.

- Supreme Lightener 9+, Supreme Clay Lightener 7+, and Supreme Control Oil Lightening System remain distinct formulations.
- Supreme Oil Developer 10vol, 20vol, and 30vol remain separate concentration-specific PDPs. The official international site gives each concentration a distinct PDP, and the peroxide percentages are material technical differences.
- Supreme pH Protective Shampoo and Supreme Acidic pH Treatment remain separate care-step PDPs.
- Supreme Control Oil is one two-component system under SKU `LXLPCB42`, not two variants. The current source `400 ml` value describes only one component; confirm the full commercial pack statement before implementation and store component quantities as technical data.

### HOP Keratin

Create two standalone future PDPs: `hop-keratin-shampoo` and `hop-keratin-lotion`.

Both must retain `COMING SOON`, remain non-purchasable, and have no Tiendas Aliadas offers until launch approval. The source assets use Cleanser/Organic Alkaline Shampoo and Infusion/Organic Keratin Therapy terminology, so the final Peru launch names require approval before publication.

## Shopify Ownership Model

### Native Product Fields

Use Shopify's native product fields for title, handle, vendor, product type, status, media, collections, and SEO fields. Use native variant fields for SKU, barcode, price, inventory, weight, and the HOP `Size` option when those commercial values are supplied and approved.

### Product Metafields

Split below into what the current 3-pilot PDP build actually needs versus
what only matters once broader commerce/ERP/catalog work is enabled — so
reviewing or defining the pilot's fields in Admin is never blocked on
future-only work. Every field uses namespace `montibello`, one exact
Shopify type each (no "type A or type B" fields).

#### A. PDP release definitions required now

These are read by `templates/product.montibello.json` today and are needed
to review the 3 pilot products (UNDER Permanent Colour, HOP Ultra Repair
Shampoo, Luxlight Supreme Lightener 9+):

| Definition | Type | Purpose |
|---|---|---|
| `montibello.range` | Single line text | UNDER, HOP, LUXLIGHT, or HOP Keratin grouping |
| `montibello.subfamily` | Single line text | Color Last, Smooth Hydration, Ultra Repair, and equivalent families |
| `montibello.functional_subtitle` | Single line text | The all-caps functional subtitle shown under the title on the reference PDPs (e.g. "COLORACIÓN PERMANENTE DE ALTA COBERTURA...") |
| `montibello.hair_type` | Single line text | Optional per-product hair type/target tag |
| `montibello.professional_only` | Boolean | "Exclusivo Profesional" badge |
| `montibello.features` | List of `montibello_feature` references | Approved product benefits/characteristics, read as plain text (accordion) and as visual cards (Benefits section) |
| `montibello.how_to_use` | Rich text | Approved application instructions and professional warnings |
| `montibello.full_ingredients` | Multi-line text | Full approved INCI in source order; do not split or normalize without approval. Rendered via `metafield_tag` in the theme, not raw `.value`, to preserve line breaks. |
| `montibello.key_ingredients` | List of `montibello_ingredient` references | Reusable, approved ingredient callouts only |
| `montibello.interest_data` | Rich text | Short approved claim lines ("Datos de interés") |
| `montibello.technology_heading` / `montibello.technology_description` | Single line text / Rich text | Always-open technology block (e.g. Luxlight's Bond3/Metal Shield story) |
| `montibello.technical_data` | Rich text | Lift, pH, mixing ratio, processing details, and system-component quantities (Luxlight pilot) |
| `montibello.claim_footnote` | Single line text | Small-print claim qualifier |
| `montibello.shades` | List of `montibello_under_shade` references | Ordered shade chart for the informational UNDER PDP |
| `montibello.routine` | List of `montibello_routine_step` references | One metaobject per numbered step, each with its own `products` list — connects a product to an approved regimen without needing a separate higher-level routine record (HOP pilot) |
| `montibello.allied_store_offers` | List of `montibello_allied_store_offer` references | Ordered product-level retailer links — the PDP's current CTA mechanism; the definition is needed now even though real retailer records aren't authored yet |

Do not populate these fields from assumptions. Empty approved content is preferable to generated claims.

#### B. Future commerce / ERP definitions

Not read by any current PDP section. Needed only once the corresponding
future work is undertaken — defining these now is optional catalog-planning
groundwork, not a blocker for the current pilot:

| Definition | Type | Needed once… |
|---|---|---|
| `montibello.commercial_status` | Single line text with validation (`ACTIVE PORTFOLIO` / `COMING SOON`) | The full 92-row catalog (beyond the 3 pilots) is being published, so publication status can be tracked per product; never infer in-stock status from it |
| `montibello.pdp_mode` | Single line text with validation (`commercial` / `informational` / `coming_soon`) | Same catalog-wide publication rollout as above |
| `montibello.developer_volume` | Single line text (values like "10 vol / 3%" are display/domain labels, not arithmetic — not Integer or Decimal) | The separate Luxlight Supreme Oil Developer 10vol/20vol/30vol PDPs are built — none of the 3 current pilots are a developer product |
| `montibello.developer_percentage` | Decimal | Same developer-PDP rollout as above, once a peroxide percentage is confirmed |

### Variant Metafields

Keep variant data minimal:

- Use native SKU and HOP `Size` option values for the 35 confirmed commerce records. **(A — required now** for the HOP Ultra Repair Shampoo pilot's size variants.)
- Keep size- or SKU-specific Tiendas Aliadas links in `montibello.allied_store_offers` directly on the variant (overriding, not merging with, the product-level list) rather than embedding retailer-specific columns on each variant. **(A — required now.)**
- Add `montibello.content_amount` only if a typed quantity is needed independently of the display option. **(B — future,** only if a product needs a quantity that isn't already the variant's own option value.)
- Add `montibello.shade` as a `montibello_under_shade` reference only when a confirmed ERP-backed UNDER shade variant is created later. **(B — future,** gated on Peru ERP SKU confirmation for the 57 shades — see Implementation Gates.)
- Do not create strength variant metafields in the current architecture because developer concentrations are separate PDPs.

## Metaobjects

### `montibello_under_shade`

Recommended fields:

- `catalog_identifier`: required source value such as `7.31/7GA`.
- `numeric_code` and `letter_code`: optional approved parsed labels.
- `shade_family`: controlled family reference or value.
- `display_name`: optional approved customer-facing shade name.
- `erp_sku`: blank until confirmed by Peru ERP.
- `swatch` or `image`: blank unless an approved shade-accurate asset is supplied.
- `sort_order`: preserves official chart order.
- `is_elevated_warmth`: boolean only for the seven catalog-confirmed additions.
- `active`: opt-out boolean (blank/unset = active; only an explicit `false` retires a shade).

The source map's 57 shade rows are the input ledger for these records. Their `source_sku` values are catalog identifiers despite the inherited source-column name.

### `montibello_feature` ("PRODUCT FEATURE")

Use a controlled reusable record with title, approved rich-text description, and optional image — covers both hair-need/benefit callouts and general product characteristics. This prevents inconsistent free-text labels across products and collection filters.

### `montibello_ingredient` ("KEY INGREDIENT")

Use for reusable approved ingredient stories with title, approved rich-text description, and optional image. Keep the legally ordered full INCI in the product metafield (`montibello.full_ingredients`), not in this promotional model.

### `montibello_routine_step` ("ROUTINE STEP")

One metaobject per numbered step: `step_number`, `label`, and an ordered list of product references (`products`). A step connecting more than one product (e.g. Ultra Repair Shampoo's step 2 = Mask + Rinse) holds all of them in that one step's `products` list — it does not need a second metaobject sharing the same `step_number`.

### `montibello_retailer` And `montibello_allied_store_offer`

`montibello_retailer` should hold the approved retailer name, logo, and optional website — entered once per retailer, then referenced from every offer that retailer appears in. `montibello_allied_store_offer` should hold:

- `retailer`: reference to a `montibello_retailer`;
- `product_url`: exact approved destination URL (required — an offer with no URL never renders);
- `button_label`: optional, defaults to "Ver en tienda";
- `active`: opt-in boolean — must be explicitly `true`, together with a non-blank `product_url`, for the offer to render.

Do not store availability, price, or stock unless Montibello Peru receives and maintains authoritative retailer data.

## Tiendas Aliadas URL Rules

- Product-level retailer links are the default for standalone PDPs and retailers whose destination covers all variants.
- HOP paired-size PDPs may use a variant-level override when the retailer provides a distinct URL for each size.
- When a size variant has no override, it may inherit the approved product-level offer.
- UNDER's informational PDP may show only an approved general product or retailer destination. Do not synthesize shade links while shade SKUs are missing.
- HOP Keratin has no retailer offers while `COMING SOON`.
- Omit an offer when no approved URL exists. Never create search URLs, guessed slugs, or placeholder links.

## Status And Publication Rules

- `ACTIVE PORTFOLIO` means the item belongs to confirmed Peru scope. It does not mean in stock, priced, published, or purchasable.
- `COMING SOON` products must remain draft or otherwise non-purchasable until Montibello Peru approves launch behavior.
- `INFORMATIONAL` identifies the UNDER shade-system PDP and must not expose Shopify's technical default variant as a customer-selectable item.
- Product availability, channel publication, price, inventory policy, tax behavior, and fulfillment remain unresolved implementation inputs.

## Evidence And Provenance

Local primary sources:

- `source-assets/UNDER/pdf/under-2026-catalogo.pdf`: one colour system and the 57-shade local chart.
- `source-assets/HOP/pdf/hop-catalogo.pdf`: formulation identities and paired Peru package sizes.
- `source-assets/LUXLIGHT/pdf/luxlight-catalogo.pdf`: distinct lighteners, developer concentrations, care products, and Control Oil system.
- `source-assets/HOP-KERATIN/coming-soon/hop-keratin-catalogo.pdf`: the two future Keratin steps.
- Confirmed Montibello Peru portfolio and SKU brief documented in `docs/product-catalog-audit.md`.

Official international references reviewed on 2026-09-14:

- [UNDER product](https://hair.montibello.com/en/product/under/) and [UNDER range](https://hair.montibello.com/en/range/under/): one product-system presentation with a colour chart.
- [HOP Colour Last Shampoo](https://hair.montibello.com/en/product/colour-last-shampoo/): one formulation-level product identity with format presentation.
- [Supreme Oil Developer 10vol](https://hair.montibello.com/en/product/supreme-oil-developer-3-10vol/), [20vol](https://hair.montibello.com/en/product/supreme-oil-developer-6-20-vol/), and [30vol](https://hair.montibello.com/en/product/supreme-oil-developer-9-30-vol/): separate concentration-specific PDPs.
- [Organic Alkaline Shampoo](https://hair.montibello.com/en/product/organic-alkaline-shampoo/) and [Organic Keratin Therapy](https://hair.montibello.com/en/product/organic-keratin-therapy/): separate Keratin routine steps and evidence for the source-name mismatch.

International pages are supporting architecture evidence only. The Peru catalogs and confirmed Peru brief control assortment, SKU, size, and status.

## Implementation Gates

Before any Shopify build or import:

1. Confirm all 57 UNDER shade ERP SKUs and whether Peru intends direct shade purchasing or an informational-only colour chart.
2. Validate all 35 brief-confirmed SKUs against a current Peru ERP export.
3. Supply approved prices, descriptions, INCI, technical copy, barcodes, inventory, tax, weight, fulfillment, and publication rules.
4. Supply public approved media URLs and dedicated UNDER monodose packshots.
5. Confirm the complete Control Oil system quantity statement and image order.
6. Approve final HOP Keratin names, launch date, and teaser behavior.
7. Supply the Tiendas Aliadas retailer and URL matrix, including any HOP size-specific links.

Until these gates are met, the existing files under `data/shopify/draft/` remain staging references and must not be imported.
