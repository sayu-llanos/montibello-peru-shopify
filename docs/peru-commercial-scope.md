# Montibello Perú — Commercial Scope

This document is the authoritative commercial source of truth for Montibello Perú storefront QA.

## Governing rule

- **Visual design, UX, and structure:** reproduce the international Montibello Hair website as close to 1:1 as reasonably possible.
- **Commercial content:** use only the confirmed Montibello Perú assortment.

The intended result is the international Montibello visual shell localized to Peru—not an indiscriminate copy of the international catalog and not a separate Shopify design merely inspired by Montibello.

## Confirmed Peru portfolio

### UNDER

- Category: Color / Coloración
- Status: active
- Permanent hair color in 60 ml tubes using the confirmed Peru shade assortment
- Activators:
  - 15 vol / 4.5% — 1000 ml
  - 25 vol / 7.5% — 1000 ml
  - 35 vol / 10.5% — 1000 ml
- Monodose activators:
  - 15 vol / 4.5% — 90 ml
  - 25 vol / 7.5% — 90 ml
  - 35 vol / 10.5% — 90 ml

### HOP

- Category: Tratamiento / Cuidado capilar
- Status: active
- Confirmed subfamilies:
  - Color Last — color maintenance
  - Smooth Hydration — hydration and frizz control
  - Ultra Repair — repair and damaged hair
- Only confirmed Peru SKUs from these subfamilies may be shown.

### LUXLIGHT

- Category: Decoloración
- Status: active
- Confirmed assortment:
  - Supreme Lightener 9+
  - Supreme Clay Lightener 7+
  - Supreme Control Oil Lightening Sys+
  - Supreme Oil Developer 10 vol / 3%
  - Supreme Oil Developer 20 vol / 6%
  - Supreme Oil Developer 30 vol / 9%
  - Supreme pH Protective Shampoo
  - Supreme Acidic pH Treatment

### HOP Keratin

- Status: coming soon / in development
- Known products:
  - HOP Keratin Shampoo 750 ml
  - HOP Keratin Lotion 1000 ml
- May appear as a visually attractive `PRÓXIMAMENTE — HOP KERATIN` teaser using official Marketing Center imagery.
- Must not have Add to Cart, a price, or wording that implies current availability.

## Out of commercial scope

Do not add or require ranges solely because they appear internationally. Out-of-scope examples include:

- m.lab
- Dénuée
- Cromatone
- Éclat
- Styling ranges
- Forma ranges
- Skincare
- Any other range not confirmed above

Their absence is not a QA defect.

## Localization rules

- Preserve the international page composition, section order, geometry, spacing, typography scale, colors, image ratios/crops, carousel geometry, controls, hover effects, animations, CTA treatment, header/footer architecture, responsive behavior, visual rhythm, and interactions.
- International range cards may be replaced with UNDER, HOP, LUXLIGHT, and HOP Keratin — Próximamente while preserving the reference module's visual and behavioral design.
- Use only real official campaigns relevant to Peru, prioritizing UNDER, HOP, and LUXLIGHT. Preserve the reference slideshow architecture, proportions, transitions, arrows, responsive composition, and typography treatment. Matching the international slide count is not required when suitable Peru campaigns do not exist.
- Product rails must preserve the international visual structure but use confirmed Peru product data.
- Never invent prices, SKUs, shades, or availability.
- Never show unavailable international products.
- Never present HOP Keratin as currently purchasable.
- Prefer original official Montibello Marketing Center assets documented in `source-assets/` and `docs/montibello-asset-manifest.md`; do not substitute scraped thumbnails when originals exist.

## QA decision rule

Fail differences in geometry, layout, spacing, typography scale, interaction, responsive behavior, section architecture, image treatment, carousel behavior, and header/footer visual language.

Do not fail intentional Peru assortment substitutions, exclusion of international-only ranges/products/campaigns, Peru-specific product names or links, a reduced campaign count based on available official Peru campaigns, or HOP Keratin being marked Próximamente.
