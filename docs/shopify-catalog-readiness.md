# Shopify Catalog Readiness

Review date: 2026-09-08

## Catalog Status

**PARTIALLY READY**

The product scope, normalized catalog structure, handles, statuses, HOP image mappings, and proposed collections are ready for commercial completion. No generated Shopify draft is safe to import yet because required or operational commercial data remains blank. HOP Keratin is intentionally draft-only and non-purchasable.

## Confirmed Commercial Scope

| Range | Status | Count |
|---|---|---:|
| UNDER permanent colour shades | Active portfolio | 57 |
| UNDER activators and monodoses | Active portfolio | 6 |
| HOP Color Last | Active portfolio | 6 |
| HOP Smooth Hydration | Active portfolio | 6 |
| HOP Ultra Repair | Active portfolio | 7 |
| LUXLIGHT | Active portfolio | 8 |
| HOP Keratin | Coming soon only | 2 |
| **Total catalog rows** | | **92** |

All 92 rows are in scope. No m.lab, Denuee, Cromatone, Eclat, styling, or unconfirmed international-range product is present.

## SKU Readiness

| SKU class | Count | Treatment in Shopify draft |
|---|---:|---|
| Confirmed in the Montibello Peru SKU brief | 35 | Included in `Variant SKU` |
| UNDER shade identifiers without confirmed Peru ERP SKU | 57 | `Variant SKU` left blank |

The 35 brief-confirmed codes comprise six UNDER auxiliaries, 19 HOP products, eight LUXLIGHT products, and two HOP Keratin coming-soon products. These codes were not independently reproduced in the downloaded Marketing Center documents, so an ERP export remains the recommended final cross-check.

## Image Coverage

| Coverage | Rows | Notes |
|---|---:|---|
| Exact product-and-size packshot | 9 | HOP Sealed Ends 1; LUXLIGHT 8 |
| Official shared product-level packshot | 78 | UNDER shade tube 57; UNDER generic 1000 ml activator 3; HOP paired-size products 18 |
| Individual image with naming ambiguity | 2 | HOP Keratin Shampoo/Cleanser and Lotion/Infusion |
| No suitable image | 3 | UNDER monodose `UMA15`, `UMA25`, `UMA35` |
| Family/group imagery only | 0 | Group assets are reserved for collection/editorial use, not assigned to product rows |

HOP coverage is 19 of 19 at product level. The official HOP catalog explicitly associates the nine shampoo/rinse/mask renders with their paired commercial sizes. The same file is therefore intentionally reused for two size SKUs and is not represented as a size-specific render.

The Shopify draft `Image Src` columns remain blank for every row because Shopify requires hosted public URLs; local `source-assets/` paths are not valid import URLs.

## Duplicate and Ambiguous Assets

- No byte-identical duplicate was found within the scoped product-asset set.
- `under-tubo.png` is intentionally shared by 57 shades and is not shade-specific.
- `under-crema-activadora.png` is intentionally shared by three 1000 ml strengths and does not show the strength.
- Nine HOP product-level assets are intentionally shared across 18 paired-size SKUs, as supported by the official HOP catalog.
- HOP Keratin assets exactly show 750 ml and 1000 ml, but use `Organic Alkaline Shampoo / Cleanser` and `Organic Keratin Therapy / Infusion` rather than the confirmed Peru launch names.
- LUXLIGHT Control Oil uses two distinct component packshots for one SKU; these are not duplicates.

## Collection Plan

Shopify does not provide true nested collections. Create the collections below and reproduce the hierarchy in navigation.

| Intended navigation | Collection handle |
|---|---|
| Color | `color` |
| Color > UNDER | `under` |
| Tratamiento / Cuidado Capilar | `tratamiento-cuidado-capilar` |
| Tratamiento / Cuidado Capilar > HOP | `hop` |
| Tratamiento / Cuidado Capilar > HOP > Color Last | `hop-color-last` |
| Tratamiento / Cuidado Capilar > HOP > Smooth Hydration | `hop-smooth-hydration` |
| Tratamiento / Cuidado Capilar > HOP > Ultra Repair | `hop-ultra-repair` |
| Decoloración | `decoloracion` |
| Decoloración > LUXLIGHT | `luxlight` |
| Coming Soon | `coming-soon` |
| Coming Soon > HOP Keratin | `hop-keratin` |

Do not create these collections in Shopify yet. Product CSV import does not assign Shopify collections; collection creation and product rules require a separate reviewed step.

## Draft Shopify Files

| File | Rows | Current readiness |
|---|---:|---|
| `data/shopify/draft/under-shopify-draft.csv` | 63 | **Blocked**: 57 ERP SKUs, prices, commercial fields, public image URLs, and three monodose images missing |
| `data/shopify/draft/hop-shopify-draft.csv` | 19 | **Not ready**: prices, commercial fields, public image URLs, and ERP cross-check missing |
| `data/shopify/draft/luxlight-shopify-draft.csv` | 8 | **Not ready**: prices, commercial fields, public image URLs, ERP cross-check, and Control Oil image order missing |
| `data/shopify/draft/hop-keratin-shopify-draft.csv` | 2 | **Do not import for sale**: coming soon, naming/launch policy unresolved, intentionally unpublished and draft |

Every row has `Published=FALSE` and `Status=draft`. HOP Keratin also carries a `coming-soon` tag. Blank fields are intentional and must not be converted to zero, false, or guessed values without Montibello Peru approval.

## Blank Shopify Fields

- `Body (HTML)`: no approved product-level descriptions supplied.
- `Product Category`: Shopify taxonomy assignment not approved.
- `Variant Grams`: shipping weight is not the same as labeled product content and was not supplied.
- `Variant Inventory Tracker`, `Variant Inventory Qty`, `Variant Inventory Policy`: inventory setup not supplied.
- `Variant Fulfillment Service`: fulfillment configuration not supplied.
- `Variant Price`, `Variant Compare At Price`: no approved prices supplied.
- `Variant Requires Shipping`, `Variant Taxable`: operational and tax treatment not supplied.
- `Variant Barcode`: barcodes not supplied.
- `Image Src`, `Image Position`, `Image Alt Text`: no public hosted URLs or final image ordering supplied.
- `SEO Title`, `SEO Description`: no approved SEO copy supplied.
- UNDER shade `Variant SKU`: official Peru ERP SKUs not supplied.

## Exact Import Blockers

1. Confirm all 57 UNDER shade ERP SKUs.
2. Supply approved retail prices and currency policy for every active SKU.
3. Supply approved product descriptions or authorize use of official catalog copy.
4. Supply barcodes, shipping weights, tax treatment, inventory tracking/policy, fulfillment service, and publication/sales-channel state.
5. Upload approved product images to a stable public source and provide URLs, or complete a separately reviewed Shopify media-upload step.
6. Supply dedicated UNDER monodose packshots.
7. Confirm whether shared HOP renders remain approved or provide size-specific renders.
8. Confirm LUXLIGHT Control Oil image order.
9. Confirm HOP Keratin final names, launch date, teaser policy, and continued non-purchasable configuration.
10. Validate the 35 brief-confirmed alphanumeric SKUs against a current Peru ERP export.

## Safe to Import Later

After the blockers above are resolved and the drafts are revalidated, HOP and LUXLIGHT are structurally closest to import readiness. UNDER requires the additional shade-SKU mapping. HOP Keratin must remain excluded from any purchase-enabled import until Montibello Peru authorizes launch.

At present, **none of the four draft CSVs is approved for import**.

## Request From Montibello Peru

- Current ERP export with all 92 records, especially the 57 UNDER shade SKUs.
- Approved prices, descriptions, barcodes, shipping weights, taxes, inventory, fulfillment, and publication rules.
- Dedicated 90 ml UNDER monodose packshots and confirmation of shared HOP imagery.
- Publicly hosted final product images or authorization for a later controlled media upload.
- Final HOP Keratin naming, launch date, and non-purchasable teaser requirements.
- LUXLIGHT Control Oil primary/secondary image order.
