# Montibello Peru Product Catalog Audit

Audit date: 2026-09-08

Sources of truth used:

- Final commercial scope supplied by Montibello Peru on 2026-09-08
- `docs/montibello-asset-manifest.md`
- `source-assets/`
- Confirmed Montibello Peru portfolio and SKU brief supplied for this workstream

No prices or product descriptions were created. No Shopify operation was performed. No storefront or theme file was modified.

## Commercial Scope Row Counts

| Range | Subfamily | Confirmed rows |
|---|---|---:|
| UNDER | Permanent colour shades | 57 |
| UNDER | Activators, 1000 ml | 3 |
| UNDER | Monodose activators, 90 ml | 3 |
| HOP | Color Last | 6 |
| HOP | Smooth Hydration | 6 |
| HOP | Ultra Repair | 7 |
| LUXLIGHT | Peru assortment | 8 |
| HOP Keratin | Coming soon | 2 |
| **Total** | | **92** |

Every row belongs to the final Peru commercial scope. No m.lab, Denuee, Cromatone, Eclat, styling, or other international-range product is present. The 57 UNDER shade identifiers are confirmed by the local 2026 catalog and colour chart. The catalog describes the prior assortment as 50 shades and adds seven Elevated Warmth shades: `3.61/3BA`, `7.31/7GA`, `9.31/9GA`, `6.40/6CD`, `5.70/5RD`, `7.70/7RD`, and `7.80/7VRD`.

## UNDER Shades Confirmed

| Subfamily | Count | Shade identifiers |
|---|---:|---|
| Naturales | 8 | `3.0/3N`, `4.0/4N`, `5.0/5N`, `6.0/6N`, `7.0/7N`, `8.0/8N`, `9.0/9N`, `10.0/10N` |
| Cenizas e irisados | 14 | `6.10/6AD`, `7.01/7NA`, `8.01/8NA`, `9.01/9NA`, `6.13/6AG`, `8.13/8AG`, `10.13/10AG`, `6.16/6AB`, `8.16/8AB`, `5.23/5PG`, `7.23/7PG`, `8.23/8PG`, `9.23/9PG`, `10.23/10PG` |
| Dorados | 9 | `6.30/6GD`, `8.30/8GD`, `7.31/7GA`, `9.31/9GA`, `7.32/7GP`, `8.32/8GP`, `9.32/9GP`, `10.32/10GP`, `8.36/8GB` |
| Marrones | 15 | `4.60/4BD`, `5.60/5BD`, `6.60/6BD`, `7.60/7BD`, `9.60/9BD`, `5.63/5BG`, `7.63/7BG`, `10.63/10BG`, `3.61/3BA`, `5.61/5BA`, `8.61/8BA`, `4.62/4BP`, `6.62/6BP`, `7.62/7BP`, `9.62/9BP` |
| Cobrizos, rojizos y purpuras | 11 | `7.34/7GC`, `7.43/7CG`, `9.43/9CG`, `6.40/6CD`, `7.40/7CD`, `8.40/8CD`, `5.70/5RD`, `6.70/6RD`, `7.70/7RD`, `5.80/5VRD`, `7.80/7VRD` |

The local source identifies shades by colour notation, not by Peru ERP-style alphanumeric codes. `under.csv` therefore preserves each confirmed shade identifier in `SKU` as a catalog key and flags ERP SKU confirmation as a prerequisite to import. The Shopify draft leaves `Variant SKU` blank for these 57 rows.

## Attribute and SKU Provenance

| Catalog group | Title/range/size provenance | SKU provenance | Result |
|---|---|---|---|
| UNDER shades, 57 | Final Peru scope plus official 2026 UNDER catalog and colour chart; retail titles are normalized from the range name and shade identifier | No Peru ERP codes found; shade identifiers are not treated as confirmed ERP SKUs | Attributes confirmed; SKUs unconfirmed |
| UNDER activators and monodoses, 6 | Final Peru scope and prior confirmed Peru SKU brief; the generic activator asset independently confirms 1000 ml but not volume strength | `UO15`, `UO25`, `UO35`, `UMA15`, `UMA25`, `UMA35` from confirmed Peru brief; not printed in downloaded Marketing Center files | Brief-confirmed; request ERP export for independent cross-check |
| HOP, 19 | Final Peru scope, confirmed Peru SKU brief, and official HOP catalog; catalog independently confirms product names and all size pairs | 19 alphanumeric codes from confirmed Peru brief; codes are not printed in the official HOP catalog | Brief-confirmed; request ERP export for independent cross-check |
| LUXLIGHT, 8 | Final Peru scope, confirmed Peru SKU brief, and exact official packshots | 8 alphanumeric codes from confirmed Peru brief; codes are not present in the asset manifest | Brief-confirmed; request ERP export for independent cross-check |
| HOP Keratin, 2 | Final Peru scope and exact-size official assets; Peru names differ from the source labels `Cleanser` and `Infusion` | `HKS` and `HKL` from confirmed Peru brief; not printed on downloaded assets | Brief-confirmed, coming soon; final naming still needs launch approval |

Handles and collection assignments are implementation recommendations, not source commercial attributes. They are unique, lowercase ASCII, and deterministic from the confirmed range/title/size data.

## Missing Data

- Prices are intentionally absent.
- Descriptions are intentionally absent.
- Barcode, inventory, tax, vendor cost, sales-channel availability, and publication state are not provided by the authoritative sources.
- Peru ERP-style SKUs for all 57 UNDER shades are missing. Shade identifiers are not assumed to be ERP codes.
- The final scope confirms active portfolio membership but does not establish stock quantity or current sellability. Non-Keratin rows use `ACTIVE PORTFOLIO`, not `AVAILABLE`.
- HOP Keratin launch timing and final sellable naming remain unconfirmed.
- Public Shopify image URLs are unavailable. Local `source-assets/` paths cannot be placed in Shopify's `Image Src` field.

## Product Image Coverage

- UNDER monodose `UMA15`, `UMA25`, and `UMA35`: no dedicated 90 ml packshots found.
- All 19 HOP rows now have official product-level packshots. The official HOP catalog explicitly associates each shampoo, rinse, and mask product image with both commercial sizes, so the same asset is intentionally mapped to each size SKU. These are supported shared product renders, not claimed size-specific renders.
- HOP Ultra Repair Sealed Ends `HRSE7C` has a unique, exact product-and-size packshot.
- All eight LUXLIGHT SKUs have exact packshot mappings. `LXLPCB42` is a two-part system and retains both images separated by `|`.
- Both HOP Keratin rows have size- and product-type-compatible assets, with source naming differences documented in `Notes`.

Coverage classification across 92 rows:

| Coverage class | Rows | Detail |
|---|---:|---|
| Exact SKU/product-and-size packshot | 9 | HOP Sealed Ends 1; LUXLIGHT 8 |
| Official shared product-level packshot | 78 | UNDER shades 57; UNDER 1000 ml activators 3; HOP paired-size products 18 |
| Individual asset with naming ambiguity | 2 | HOP Keratin Shampoo/Cleanser and Lotion/Infusion |
| No suitable image | 3 | UNDER monodoses |
| Family/group imagery only | 0 | Group imagery exists for range pages but is not needed as a substitute for any catalog row |

## Ambiguous Image Mappings

| SKU group | Candidate asset | Issue |
|---|---|---|
| HOP masks, rinses, and shampoos | Nine product-level PNGs under the three HOP subfamily directories | Each asset is shared by two size SKUs. This is supported by `hop-catalogo.pdf`, which labels the products `200ml/500ml`, `200ml/750ml`, or `300ml/1000ml`; the PNG itself is not a size-specific render |
| HOP Keratin `HKS` | `HOP-KERATIN/coming-soon/hop-keratin-cleanser.jpg` | Size and shampoo type match; asset says Organic Alkaline Shampoo / Cleanser rather than the Peru brief title |
| HOP Keratin `HKL` | `HOP-KERATIN/coming-soon/hop-keratin-infusion.jpg` | Size and treatment type match; asset says Organic Keratin Therapy Smoothing Treatment / Infusion rather than Lotion |

UNDER `under-tubo.png` is explicitly a generic dye-tube packshot and is mapped to all shade rows as a shared non-shade-specific image. `under-crema-activadora.png` is explicitly a generic 1000 ml activator packshot and is mapped to all three 1000 ml activators; it is not mapped to monodose products.

## Duplicate Assets

- SHA-256 comparison of the scoped UNDER product images, HOP range images, LUXLIGHT product images, and HOP Keratin JPGs found no byte-identical duplicates within that product-asset set.
- The manifest records `UNDER/campaign/under-2026-modelo-06.jpg` as identical to the existing theme asset `montibello-under-card-portrait.jpg`. This is a known cross-location duplicate and was not modified.
- HOP `-ts.png` files are technical/talla tecnica alternatives, not duplicate packshots.
- LUXLIGHT Control Oil images `-1.png` and `-2.png` are distinct parts of one system, not duplicates.

## Recommended Shopify Collection Plan

Shopify collections are not natively hierarchical. Implement these as collections plus navigation nesting:

| Navigation level | Collection | Proposed handle | Scope |
|---|---|---|---|
| Top | Color | `color` | Navigation parent for colour ranges |
| Child | UNDER | `under` | All 63 UNDER rows |
| Top | Tratamiento / Cuidado Capilar | `tratamiento-cuidado-capilar` | Navigation parent for care ranges |
| Child | HOP | `hop` | All 19 active HOP rows |
| Grandchild | HOP Color Last | `hop-color-last` | Six Color Last rows |
| Grandchild | HOP Smooth Hydration | `hop-smooth-hydration` | Six Smooth Hydration rows |
| Grandchild | HOP Ultra Repair | `hop-ultra-repair` | Seven Ultra Repair rows |
| Top | Decoloración | `decoloracion` | Navigation parent for lightening ranges |
| Child | LUXLIGHT | `luxlight` | Eight LUXLIGHT rows |
| Top | Coming Soon | `coming-soon` | Non-purchasable launch previews only |
| Child | HOP Keratin | `hop-keratin` | Two coming-soon rows; exclude from purchase-enabled navigation and sales paths |

## Proposed Product Handles

- Handles are lowercase ASCII, hyphenated, and include size where separate SKUs share a product name.
- UNDER shade handles include both numbering systems, for example `under-permanent-colour-3-0-3n`.
- HOP product handles follow the official HOP catalog naming; `HCS1L` is normalized to `hop-colour-last-shampoo-1000ml`.
- All proposed handles are listed row by row in the four CSV files.

## Import Readiness

| File | Readiness | Blocking issues |
|---|---|---|
| `under.csv` | Not import-ready | Confirm ERP SKUs for 57 shades; add prices and approved descriptions; source monodose packshots; confirm inventory/publication state |
| `hop.csv` | Structurally ready for commercial enrichment | Add prices and approved descriptions; confirm inventory/publication state; upload approved images and provide public URLs |
| `luxlight.csv` | Structurally ready for commercial enrichment | Add prices and approved descriptions; confirm inventory/publication state; confirm how the importer should order two Control Oil images |
| `hop-keratin.csv` | Reference only | Must remain coming soon and non-purchasable; confirm final names, launch date, publication policy, prices/descriptions only when authorized |

These are catalog-source CSVs, not direct Shopify product-import templates. The schema intentionally excludes fabricated Shopify-required commercial values.

## Remaining Questions for Montibello Peru

1. What are the official Peru ERP SKUs for each of the 57 UNDER shades?
2. Can Montibello provide an ERP export that independently cross-checks the 35 brief-confirmed alphanumeric SKUs?
3. Can Montibello provide dedicated packshots for `UMA15`, `UMA25`, and `UMA35`?
4. Can Montibello provide size-specific HOP renders, or confirm continued use of the shared product-level renders?
5. For `LXLPCB42`, should the two Control Oil components be imported as two images on one product, and in what order?
6. Are the HOP Keratin launch names officially `Shampoo` and `Lotion`, or should Peru adopt the asset labels `Cleanser` and `Infusion`?
7. What publication date and sales-channel policy should apply to HOP Keratin? Until confirmed, both records must remain non-purchasable.
8. Provide approved prices, descriptions, barcodes, inventory policy/quantities, tax treatment, weights, Shopify taxonomy, publication state, and hosted product-image URLs.
