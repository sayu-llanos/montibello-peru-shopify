# Montibello Peru — Marketing Center Asset Manifest

Source: `https://marketingcenter.montibello.com` (authenticated session, read-only access authorized for the Montibello Peru storefront project). All files below were downloaded to `source-assets/` (git-ignored, raw/unmodified) via the Marketing Center's own resource-detail download links.

Legend: **Sel.** = selected for production use on the storefront. **D/M** = Desktop / Mobile / Both / N/A.

---

## 1. Official brand system (Corporate)

Found under `Corporate → Brand book`. This supersedes any previously-guessed palette.

**Colour palette (official, from `montibello-brand-book-2026.pdf`, p.30–31):**

| Name | Hex | RGB | CMYK | Pantone | Role |
|---|---|---|---|---|---|
| Montibello black | `#2E2D2C` | 40-39-39 | 0-0-0-95 | Black 2C | Primary — logos, graphics, text on light bg |
| Montibello neutral | `#E7E6DF` | 231-230-223 | 11-8-13-0 | 9043 C | Primary — neutral background, large text surfaces |
| Montibello white | `#FFFFFF` | 255-255-255 | 0-0-0-0 | — | Primary |
| Holistic yellow | `#EF9600` | 239-150-0 | 3-45-78-0 | 2012 C | Accent |
| Heritage brown | `#BD9C7F` | 189-156-127 | 23-36-48-11 | 2467 C | Accent |
| Passion coral | `#E04F39` | 224-79-57 | 3-72-70-0 | 7417 C | Accent |
| Earth green | `#71867C` | 113-134-124 | 52-27-45-17 | 5625 C | Accent |
| Real care rosé | `#E38C7E` | 227-140-126 | 2-55-50-0 | 4051 C | Accent |

Accent colours: use per the book's approved ratio (25/25/25/5/5/5/5/5%), diluted at most to 10% of full strength.

**Typography (official, p.35–36):** Primary = **TT Commons** (Regular/Bold) — printed materials, "and if possible digitally." Secondary = **Montserrat** (Regular/Bold) — presentations only, never corporate print. TT Commons is a commercial font; licensing for embedding on the Shopify storefront is unconfirmed. Montserrat is free (Google Fonts) and explicitly brand-sanctioned as a secondary typeface — **recommended as the storefront body/heading font** pending confirmation of a TT Commons web-license.

**Logo:** From Jan 2026, new logo — black or white only, no added elements beyond the tagline, never abbreviated.

| Filename | Type | Size | Source | Downloaded | Selected |
|---|---|---|---|---|---|
| `BRAND/montibello-brand-book-2026.pdf` | PDF | 33.9 MB | Corporate → Brand book (`montibello-brand-book-5697`) — 2026 edition, supersedes the older `montibello-manual-de-marca-274` (not downloaded, outdated) | ✅ | ✅ (reference doc) |
| `BRAND/montibello-logo-package.zip` | ZIP (vector logo files) | 2.3 MB | Corporate → Logotipos (`montibello-logotipo-5699`) | ✅ | ✅ |

---

## 2. UNDER (Color)

| Filename | Subfamily | Type | Dimensions | Size | Source ID | Storefront use | D/M | Sel. |
|---|---|---|---|---|---|---|---|---|
| `UNDER/campaign/under-2026-modelo-02.jpg` | Campaign | Original JPG | 8021×5350 | 5.2 MB | 6022 | Hero / carousel candidate | Both | ✅ |
| `UNDER/campaign/under-2026-modelo-03.jpg` | Campaign | Original JPG | 5464×8192 | 4.9 MB | 6024 | Carousel / lifestyle panorama | Both | ✅ |
| `UNDER/campaign/under-2026-modelo-04.jpg` | Campaign | Original JPG | 5350×8021 | 5.3 MB | 6026 | Carousel / lifestyle panorama | Both | ✅ |
| `UNDER/campaign/under-2026-modelo-05.jpg` | Campaign | Original JPG | 5464×8192 | 5.7 MB | 6028 | Carousel / lifestyle panorama | Both | ✅ |
| `UNDER/campaign/under-2026-modelo-06.jpg` | Campaign | Original JPG | 8192×5464 | 5.6 MB | 6030 | Carousel / lifestyle panorama (same file already used as homepage card image `montibello-under-card-portrait.jpg`) | Both | ✅ — supersedes the WP-sourced copy (identical file, now with confirmed provenance) |
| `UNDER/campaign/under-tendencias-2026.jpg` | Campaign | Trend graphic | 1920×1080 | 483 KB | 5969 | Editorial / trends block | Desktop | ✅ |
| `UNDER/products/under-crema-activadora.png` | Products | Packshot (transparent) | 1703×4814 | 7.9 MB | 4909 | Activating cream packshot (generic, all 3 vol variants) | Both | ✅ |
| `UNDER/products/under-tubo.png` | Products | Packshot (transparent) | 1987×3688 | 1.7 MB | 4907 | Dye tube packshot | Both | ✅ |
| `UNDER/products/under-bodegon-01..12.jpg` (12 files) | Products | Still-life / texture shots | ~3150×4724 avg | 3.9–9.7 MB ea. | 4847-4858 | Product-range grid backgrounds, technical detail blocks | Both | ✅ (all 12 — no clear duplicates, each is a distinct set/angle) |
| `UNDER/technical/under-carta-de-color.png` | Technical | Colour chart (raster) | 5177×2500 | 50.1 MB | 4961 | Stats/Carta de Color section — **too large for direct web use, must be re-exported/compressed** | Desktop | ✅ (needs re-encode before use) |
| `UNDER/pdf/under-carta-de-color-digital.pdf` | PDF | Colour chart | — | 14.2 MB | 5471 | Downloadable Carta de Color (already wired in `montibello-stats-panel.liquid` from the older WP copy — **this Marketing Center version is the authoritative source, should replace it**) | N/A | ✅ supersedes prior WP-sourced PDF |
| `UNDER/pdf/under-catalogo.pdf` | PDF | Full catalog | — | 39.8 MB | 4905 | Reference / sales material, not for direct storefront embed | N/A | Reference only |
| `UNDER/pdf/under-2026-catalogo.pdf` | PDF | Full catalog (2026, "low" = web-optimized) | — | 7.2 MB | 5960 | Lighter alternative catalog for a downloadable "brochure" link if desired | N/A | Candidate |
| — `Under - Carta de color digital` (Editable, id 4915) | — | — | — | — | Skipped — InDesign/AI source file, not needed for web | — | ✗ |
| — `Under - Catálogo` (Editable, id 4911) / `under 2026 - Catálogo` (Editable, id 6018) | — | — | — | — | Skipped — editable source files | — | ✗ |
| — `Logo UNDER` (id 5482) | Logo | — | — | — | Link resolved to `null` (non-standard download element); not retrieved this pass — retry recommended, low priority since the Under wordmark isn't distinct from the sub-brand logo already in the brand book/Under catalog covers | — | ✗ (not downloaded) |

**Already in the theme from a prior pass (WP-sourced, not from this session):** `montibello-under-hero-desktop/mobile.jpg`, `montibello-under-glucamine-tech.jpg`, `montibello-under-editorial-elevated-warmth.jpg`, `montibello-under-stats-editorial.jpg`, `montibello-under-activating-cream-15/25/35vol.jpg`, `montibello-under-product-colorant.webp`. These remain valid; the Marketing Center pass did not find higher-resolution replacements for the hero/Glucamine/Elevated-Warmth images specifically (those campaign shoots weren't found under this brand filter — likely filed under a different internal project name). **Recommendation:** keep the existing WP-sourced hero/editorial images, but replace the Carta de Color PDF and add the new 2026 campaign model shots as carousel material.

---

## 3. HOP (Cuidado capilar) — Color Last, Smooth Hydration, Ultra Repair

Peru scope note: the Marketing Center's "hop" brand filter returned ~98 assets total, most for sub-lines Peru does **not** sell (Blonde Glow, Reflects shampoos, Detox, Full Volume, Purifying Balance, Sensitive Protection, hop sun care). Those were audited but intentionally not downloaded — out of scope.

### Color Last
| Filename | Type | Dimensions | Size | Source ID | Use | Sel. |
|---|---|---|---|---|---|---|
| `HOP/COLOR-LAST/hop-colour-last-mask.png` | Packshot | 1387×1183 | 5.6 MB | 3849 | Product card | ✅ |
| `HOP/COLOR-LAST/hop-colour-last-mask-ts.png` | Technical (talla técnica) | 1570×1523 | 6.4 MB | 3927 | Size/spec reference | ✅ |
| `HOP/COLOR-LAST/hop-colour-last-rinse.png` | Packshot | 1005×2272 | 6.7 MB | 3851 | Product card | ✅ |
| `HOP/COLOR-LAST/hop-colour-last-rinse-ts.png` | Technical | 1388×4158 | 11.2 MB | 3921 | Size/spec reference | ✅ |
| `HOP/COLOR-LAST/hop-colour-last-shampoo.png` | Packshot | 1153×2828 | 8.0 MB | 3853 | Product card | ✅ |
| `HOP/COLOR-LAST/hop-colour-last-shampoo-ts.png` | Technical | 1697×4960 | 10.8 MB | 3903 | Size/spec reference | ✅ |

### Smooth Hydration
| Filename | Type | Dimensions | Size | Source ID | Use | Sel. |
|---|---|---|---|---|---|---|
| `HOP/SMOOTH-HYDRATION/hop-smooth-hydration-mask.png` | Packshot | 1441×1227 | 5.4 MB | 3884 | Product card | ✅ |
| `HOP/SMOOTH-HYDRATION/hop-smooth-hydration-mask-ts.png` | Technical | 1602×1542 | 6.4 MB | 3930 | Size/spec | ✅ |
| `HOP/SMOOTH-HYDRATION/hop-smooth-hydration-rinse.png` | Packshot | 1063×2393 | 6.2 MB | 3886 | Product card | ✅ |
| `HOP/SMOOTH-HYDRATION/hop-smooth-hydration-rinse-ts.png` | Technical | 1312×4198 | 11.1 MB | 3925 | Size/spec (source titled "Hidration", typo in Marketing Center) | ✅ |
| `HOP/SMOOTH-HYDRATION/hop-smooth-hydration-shampoo.png` | Packshot | 1139×2761 | 7.5 MB | 3888 | Product card | ✅ |
| `HOP/SMOOTH-HYDRATION/hop-smooth-hydration-shampoo-ts.png` | Technical | 1614×4887 | 10.8 MB | 3909 | Size/spec | ✅ |

### Ultra Repair
| Filename | Type | Dimensions | Size | Source ID | Use | Sel. |
|---|---|---|---|---|---|---|
| `HOP/ULTRA-REPAIR/hop-ultra-repair-mask.png` | Packshot | 1473×1245 | 5.6 MB | 3890 | Product card | ✅ |
| `HOP/ULTRA-REPAIR/hop-ultra-repair-mask-ts.png` | Technical | 1593×1609 | 6.4 MB | 3929 | Size/spec | ✅ |
| `HOP/ULTRA-REPAIR/hop-ultra-repair-rinse.png` | Packshot | 1065×2434 | 6.7 MB | 3892 | Product card | ✅ |
| `HOP/ULTRA-REPAIR/hop-ultra-repair-rinse-ts.png` | Technical | 1319×4099 | 11.1 MB | 3923 | Size/spec | ✅ |
| `HOP/ULTRA-REPAIR/hop-ultra-repair-sealed-ends.png` | Packshot | 874×2213 | 5.3 MB | 3894 | Product card | ✅ |
| `HOP/ULTRA-REPAIR/hop-ultra-repair-shampoo.png` | Packshot | 1122×2801 | 8.0 MB | 3896 | Product card | ✅ |
| `HOP/ULTRA-REPAIR/hop-ultra-repair-shampoo-ts.png` | Technical | 1630×4896 | 10.7 MB | 3905 | Size/spec | ✅ |
| `HOP/ULTRA-REPAIR/hop-ultra-repair-overnight-serum.png` | Packshot | 2857×4000 | 2.0 MB | 5634 | Product card (newest SKU, 2026) | ✅ |
| `HOP/ULTRA-REPAIR/hop-ultra-repair-overnight-serum-gama-01.jpg` | Campaign (range/group) | 7567×5405 | 22.1 MB | 5636 | Ultra Repair hub hero | ✅ |
| `HOP/ULTRA-REPAIR/hop-ultra-repair-overnight-serum-lifestyle-01.jpg` | Campaign (lifestyle) | 4778×6690 | 13.9 MB | 5647 | Ultra Repair editorial | ✅ |
| `HOP/ULTRA-REPAIR/hop-ultra-repair-overnight-serum-lifestyle-02.jpg` | Campaign (lifestyle) | 5464×7650 | 30.2 MB | 5650 | Ultra Repair editorial (alt crop) | Candidate (pick one of lifestyle-01/02) |
| `HOP/ULTRA-REPAIR/hop-ultra-repair-overnight-serum-modelo-01.jpg` | Campaign (model) | 6557×9830 | 8.0 MB | 5662 | Ultra Repair hero model shot | ✅ |
| — Overnight Serum: `01-03`, `Modelo 02-04`, `Gama 02-05`, `Lifestyle 03-04` (12 more IDs: 5656,5658,5660,5664,5666,5668,5639,5641,5643,5645,5652,5654) | Campaign | — | — | — | **Alternate crops/angles of the same shoot — audited, not downloaded** (duplicative of the 5 selected above; available on request) | ✗ |

### HOP brand-level & professional
| Filename | Type | Size | Source ID | Use | Sel. |
|---|---|---|---|---|---|
| `HOP/campaign/hop-gama-completa.jpg` | Full-range bodegón | 51.1 MB (17717×11787) | 4519 | HOP hub hero — **needs downscale/re-export before web use** | ✅ (after re-export) |
| `HOP/campaign/hop-gama-repair-colour.jpg` | Range group (Color Last + Ultra Repair) | 23.8 MB (8256×5504) | 4526 | Color Last / Ultra Repair hub visual | ✅ |
| `HOP/campaign/hop-gama-volume-hydration.jpg` | Range group (incl. Smooth Hydration + out-of-scope Full Volume) | 14.9 MB (8256×5504) | 4520 | Smooth Hydration hub visual — **crop out Full Volume bottles if used**, since Peru doesn't sell that sub-line | ✅ (crop needed) |
| `HOP/campaign/hop-modelos-dancer-beauty-01.tif` | Lifestyle (true original) | 64.8 MB | 3956 | HOP hero candidate — **must convert to JPG/WebP, Shopify doesn't serve TIFF** | Candidate |
| `HOP/campaign/hop-modelos-mindfullness-beauty-01.tif` | Lifestyle (true original) | 63.9 MB | 3979 | HOP hero candidate — same conversion note | ✅ **selected**, pending conversion |
| `HOP/campaign/hop-modelos-dancer-entero-01.tif` | Lifestyle (true original) | 62.4 MB | 3964 | HOP hero candidate — same conversion note | Candidate |
| `HOP/pdf/hop-catalogo.pdf` | Sales folder PDF | 26.0 MB | 3949 | Reference / downloadable brochure | ✅ |
| `HOP/pdf/hop-guia-tecnica.pdf` | Technical guide PDF | 292.9 MB | 3954 | Professional/salon reference — **valid but extremely oversized for a downloadable PDF (84 pages, print-res images), re-export at web resolution before offering as a customer download** | ✅ (needs re-export) |
| `HOP/video/hop-brand-video.mp4` | Brand video | 150.1 MB | 4029 | HOP hub hero video — re-encode to a web-streaming bitrate before embedding | ✅ |
| `HOP/video/hop-video.mov` | Brand video (alt cut, ProRes master) | 710.4 MB | 3840 | Raw ProRes master — **not web-usable as-is**; only worth converting if `hop-brand-video.mp4` proves unsuitable | Candidate |
| `HOP/professional/hop-in-salon-aplicador.jpg` | Professional/salon equipment | 28.3 MB (15000×8438) | 4031 | Professional CTA section | ✅ (downscale first) |
| `HOP/professional/hop-in-salon-expositor.jpg` | Professional/salon (retail display) | 33.6 MB | 4033 | Not web-relevant (POS display unit) | ✗ selected |
| `HOP/professional/hop-in-salon-gama-completa.png` | Professional/salon full range | 334.2 MB (33825×6369) | 4027 | **Extremely oversized — must re-export before any use** | Candidate (needs re-export) |
| `HOP/professional/hop-in-salon-grupo.jpg` | Professional/salon group shot | 21.5 MB | 4035 | Professional CTA section | ✅ |
| `HOP/professional/hop-in-salon-intensifiers.jpg` | Professional/salon equipment | 29.9 MB | 4039 | Skip — equipment closeup, not consumer-facing | ✗ |
| `HOP/professional/hop-in-salon-vaporizador.jpg` | Professional/salon equipment | 17.9 MB | 4047 | Skip — equipment closeup | ✗ |
| `HOP/pdf/hop-in-salon-catalogo.pdf` | Professional sales material | 55.6 MB | 4017 | Reference only | Reference |
| `HOP/pdf/hop-in-salon-guia-tecnica.pdf` | Professional technical guide | 26.5 MB | 4020 | Reference only | Reference |
| `HOP/video/hop-in-salon-treatment-experience.mp4` | Professional treatment video | 320.0 MB | 4024 | Professional CTA section video — **re-encode before embedding**, this is a production master | ✅ (needs re-encode) |

**Out-of-scope HOP items audited but skipped (not downloaded):** Blonde Glow (Mask/Shampoo), Brown/Copper/Purple/Red/Silver White Reflects shampoos, Detox Cleansing, Full Volume (Dry Shampoo/Foam Rinse/Shampoo), Purifying Balance, Sensitive Protection, entire "hop sun care" sub-line (7 items), "Hop Gama Blonde/Detox/Silver-Blonde-Reflects" group shots, "hop Modelos" Dancer/Mindfulness series items beyond the 3 selected (9 more), "hop - Hoja de diagnóstico" (internal diagnostic sheet, Editable-only) — none of these belong to Peru's Color Last / Smooth Hydration / Ultra Repair assortment.

---

## 4. LUXLIGHT (Decoloración)

Peru's 8-SKU assortment, all found and downloaded as individual packshots:

| Filename | Product | Dimensions | Size | Source ID | Sel. |
|---|---|---|---|---|---|
| `LUXLIGHT/products/luxlight-supreme-lightener-9plus.png` | Supreme Lightener 9+ | 4000×4000 | 14.6 MB | 5813 | ✅ |
| `LUXLIGHT/products/luxlight-supreme-clay-lightener-7plus.png` | Supreme Clay Lightener 7+ | 4000×4000 | 14.6 MB | 5811 | ✅ |
| `LUXLIGHT/products/luxlight-supreme-control-oil-lightening-system-1.png` | Supreme Control Oil Lightening Sys+ (part 1) | 4000×4000 | 4.2 MB | 5805 | ✅ |
| `LUXLIGHT/products/luxlight-supreme-control-oil-lightening-system-2.png` | Supreme Control Oil Lightening Sys+ (part 2) | 4000×4000 | 7.1 MB | 5807 | ✅ |
| `LUXLIGHT/products/luxlight-supreme-oil-developer-10vol.jpg` | Supreme Oil Developer 10 vol | 4000×4000 | 1.1 MB | 5815 | ✅ |
| `LUXLIGHT/products/luxlight-supreme-oil-developer-20vol.jpg` | Supreme Oil Developer 20 vol | 4000×4000 | 1.1 MB | 5817 | ✅ |
| `LUXLIGHT/products/luxlight-supreme-oil-developer-30vol.jpg` | Supreme Oil Developer 30 vol | 4000×4000 | 1.1 MB | 5819 | ✅ |
| `LUXLIGHT/products/luxlight-supreme-ph-protective-shampoo.png` | Supreme pH Protective Shampoo | 4000×4000 | 10.2 MB | 5809 | ✅ |
| `LUXLIGHT/products/luxlight-supreme-acidic-ph-treatment.png` | Supreme Acidic pH Treatment | 4000×4000 | 7.2 MB | 5803 | ✅ |
| `LUXLIGHT/products/luxlight-gama-completa.png` | Full range group shot | 5000×1551 | 4.1 MB | 5828 | ✅ — hub hero candidate |
| `LUXLIGHT/products/luxlight-bodegon-01..06.jpg` (6 files) | Still-life/technical | 5000×3000–5262 avg | 1.5–4.1 MB ea. | 5830-5835 | ✅ all 6 — technical/editorial blocks |
| — Sachet/mini variants: Clay Lightener 7+ Sachets, Lightener 9+ Sachets, Oil Developer 20vol Mini (5822, 5824, 5826) | Alt pack size | — | — | Audited, not downloaded — not part of Peru's stated assortment (single-size only); available if Peru later stocks sachets | ✗ |

**Campaign / lifestyle:**
| Filename | Dimensions | Size | Source ID | Use | Sel. |
|---|---|---|---|---|---|
| `LUXLIGHT/campaign/luxlight-fotos-lifestyle-01.jpg` | 5000×3276 | 8.2 MB | 5842 | Hub hero candidate | ✅ |
| `LUXLIGHT/campaign/luxlight-fotos-lifestyle-03.jpg` | 5000×3335 | 10.1 MB | 5844 | Carousel | ✅ |
| `LUXLIGHT/campaign/luxlight-fotos-lifestyle-05.jpg` | 1928×2500 | 1.4 MB | 5846 | Carousel (lower-res than others — check before hero use) | Candidate |
| `LUXLIGHT/campaign/luxlight-fotos-lifestyle-07.jpg` | 2147×2500 | 2.1 MB | 5848 | Carousel | Candidate |
| `LUXLIGHT/campaign/luxlight-modelo-01.jpg` | 6404×9600 | 5.7 MB | 5769 | Model hero, portrait | ✅ |
| `LUXLIGHT/campaign/luxlight-modelo-04.jpg` | 4218×6083 | 3.7 MB | 5775 | Model, portrait | Candidate |
| `LUXLIGHT/campaign/luxlight-modelo-08.jpg` | 6444×9569 | 7.9 MB | 5783 | Model, portrait | ✅ |
| `LUXLIGHT/campaign/luxlight-modelo-10.jpg` | 6054×9034 | 6.3 MB | 5787 | Model, portrait | Candidate |
| — `Fotos lifestyle 02,04,06,08,09,10` (5843,5845,5847,5849,5850,5851) and `Modelo 02,03,05,06,07,09,11-17` (11 more IDs) | — | — | — | Audited, not downloaded — same shoots, alternate frames; curated selection above is sufficient for launch | ✗ |

**Technical/editorial:**
| Filename | Dimensions | Size | Source ID | Use | Sel. |
|---|---|---|---|---|---|
| `LUXLIGHT/technical/luxlight-tecnologia-01.jpg` | 5000×5000 | 1.0 MB | 5864 | Technology explainer block | ✅ |
| `LUXLIGHT/technical/luxlight-tecnologia-02.jpg` | 5000×5000 | 1.3 MB | 5866 | Technology explainer block | ✅ |
| `LUXLIGHT/technical/luxlight-tecnologia-03.jpg` | 5000×5000 | 1.0 MB | 5868 | Technology explainer block | ✅ |
| `LUXLIGHT/technical/luxlight-tecnologia-04.jpg` | 5000×5000 | 2.2 MB | 5870 | Technology explainer block | ✅ |
| `LUXLIGHT/technical/luxlight-tecnologia-05.jpg` | 5000×5000 | 2.9 MB | 5872 | Technology explainer block | ✅ |

**PDF / logo / video:**
| Filename | Type | Size | Source ID | Sel. |
|---|---|---|---|---|
| `LUXLIGHT/pdf/luxlight-logo.pdf` | Vector logo | 365 KB | 5733 | ✅ |
| `LUXLIGHT/pdf/luxlight-catalogo.pdf` | Sales folder | 12.9 MB | 5731 | ✅ |
| `LUXLIGHT/pdf/luxlight-9plus-tarjeta.pdf` | Product info card | 1.6 MB | 6035 | ✅ |
| `LUXLIGHT/video/luxlight-video-campana.mp4` | Campaign video | 50.0 MB | 5749 | ✅ hub hero video |
| `LUXLIGHT/video/luxlight-video-tecnologia.mp4` | Technology video | 34.3 MB | 5750 | ✅ technical block |
| `LUXLIGHT/video/luxlight-stepbystep-expensive-blonde-es.mp4` | Technique tutorial | 168.7 MB | 5751 | Professional/education section | Candidate |
| `LUXLIGHT/video/luxlight-stepbystep-frosted-platinum-es.mp4` | Technique tutorial | 179.9 MB | 5752 | Professional/education section | Candidate |
| `LUXLIGHT/video/luxlight-stepbystep-honey-cascade-es.mp4` | Technique tutorial | 215.1 MB | 5753 | Professional/education section | Candidate |
| `LUXLIGHT/video/luxlight-stepbystep-light-blow-balayage-es.mp4` | Technique tutorial | 331.4 MB | 5754 | Professional/education section | Candidate |
| — All 4 tutorials are ProRes-weight masters (169–331 MB each), not web-ready | — | — | — | Re-encode to H.264/H.265 web bitrate before any use — none are required for launch | — |
| — Same 4 tutorials in English/French/Polish (6 more IDs: 5757,5758,5761,5762,5765,5766) | — | — | Audited, not downloaded — Peru storefront is Spanish-only | ✗ |

---

## 5. HOP KERATIN — coming soon / in development

Per your instruction, classified separately and **not to be presented as commercially available**. No dedicated "Hop Keratin" brand filter exists in the Marketing Center — these are filed under the "hop" brand with "Keratin" in the title, found via search.

| Filename | Type | Source ID | Use | Sel. |
|---|---|---|---|---|
| `HOP-KERATIN/coming-soon/hop-keratin-catalogo.pdf` | Catalog PDF | 4701 | Internal reference for the coming-soon teaser copy | ✅ (reference) |
| `HOP-KERATIN/coming-soon/hop-keratin-cleanser.jpg` | Packshot | 4759 | Small teaser image | ✅ |
| `HOP-KERATIN/coming-soon/hop-keratin-guia-tecnica.pdf` | Technical guide PDF | 4710 | Internal reference | ✅ (reference) |
| `HOP-KERATIN/coming-soon/hop-keratin-infusion.jpg` | Packshot | 4757 | Small teaser image | ✅ |

Known Peru SKUs per your brief (HOP Keratin Shampoo 750 ml, HOP Keratin Lotion 1000 ml) were **not** found as individually-named assets in the Marketing Center under those exact titles — only "Keratin Cleanser" and "Keratin Infusion" exist. Flag to Alvaro/Montibello for the correct current asset names once the line launches.

---

## 6. Storefront asset selection — summary recommendations

**HOMEPAGE**
- UNDER card: `UNDER/campaign/under-2026-modelo-06.jpg` (same file already live via `montibello-under-card-portrait.jpg` — now confirmed authoritative)
- HOP card: `HOP/campaign/hop-modelos-mindfullness-beauty-01.tif` or `hop-gama-repair-colour.jpg` (re-exported/cropped) — needs a decision once .tif is converted to web format
- LUXLIGHT card: `LUXLIGHT/campaign/luxlight-modelo-01.jpg` or `luxlight-fotos-lifestyle-01.jpg`
- HOP Keratin teaser: `HOP-KERATIN/coming-soon/hop-keratin-infusion.jpg`, small/muted treatment, labeled "Próximamente"

**UNDER PAGE** — hero desktop/mobile: keep existing WP-sourced assets (no higher-res replacement found here). Intro/video: existing Vimeo embed unaffected. Stats section: replace PDF with `UNDER/pdf/under-carta-de-color-digital.pdf` (Marketing Center original). Product range: `UNDER/products/under-bodegon-*.jpg` as supplementary imagery. Carousel: the 5 `under-2026-modelo-*.jpg` campaign shots.

**HOP** — hub: `hop-gama-completa.jpg` (re-exported) or one of the 3 `.tif` lifestyle shots. Color Last / Smooth Hydration / Ultra Repair: the packshots + `-ts` technical shots per subfamily table above; Ultra Repair also gets its dedicated campaign set (gama/lifestyle/modelo).

**LUXLIGHT** — hub hero: `luxlight-video-campana.mp4` or `luxlight-fotos-lifestyle-01.jpg` as a static fallback. Product cards: the 9 packshots (8 SKUs + system pt.2). Technical/editorial: the 5 `luxlight-tecnologia-*.jpg` graphics + `luxlight-video-tecnologia.mp4`.

**HOP KERATIN** — small "coming soon" teaser only, per your instruction: one muted packshot + "Próximamente" label, no purchase path.

---

## 7. Files needing attention before production use

- `UNDER/technical/under-carta-de-color.png` (50 MB) and `HOP/professional/hop-in-salon-gama-completa.png` (334 MB) are far too large for direct web delivery — re-export at web resolution before referencing in any Liquid section.
- Several `.tif` originals (`HOP/campaign/hop-modelos-*.tif`, ~63–65 MB each) need conversion to JPG/WebP before use in Shopify (Shopify doesn't serve TIFF).
- All video files downloaded are production/ProRes-weight masters (150 MB–710 MB) — every one needs re-encoding to a web-streaming H.264/H.265 bitrate before embedding; none should be uploaded to Shopify in their current form.
- `hop-guia-tecnica.pdf` (293 MB) and `hop-in-salon-catalogo.pdf` (56 MB) are valid but oversized for a customer-facing download — re-export at web resolution if ever offered as a downloadable brochure.
- `hop-gama-volume-hydration.jpg` includes out-of-scope Full Volume products in-frame — crop before use if visually prominent.

No account settings were changed, nothing was uploaded/edited/deleted in the Marketing Center, and the session was not logged out.

---

## 8. Final verification (this pass)

- **Download completion:** all three background download batches (UNDER, HOP, LUXLIGHT/HOP-KERATIN) ran to completion. 111 files total across `source-assets/`: UNDER 24 files (243 MB), HOP 43 files (2.5 GB), LUXLIGHT 38 files (1.1 GB), HOP-KERATIN 4 files (52 MB), BRAND 2 files (36 MB).
- **Integrity check:** every image file (`.jpg`/`.png`/`.webp`/`.tif`) was opened and read via `sips`; every PDF was checked for a valid `%PDF-` header. **0 corrupted or partial files found.**
- **Logo check:** extracted `BRAND/montibello-logo-package.zip` and visually compared `logo-montibello-1.png` against the theme's current `assets/montibello-logo.svg`. Both are the same lowercase "montibello" wordmark in the same geometric sans, both filled with the exact official black (`#2E2D2C`). The zip's internal file dates (mid-to-late 2025) predate the brand book's stated "new logo from January 2026" — **I can't confirm from this pass whether a newer logo file exists elsewhere in the Marketing Center that supersedes this package; visually, no difference was found, so no replacement is recommended without further confirmation.**

---

## 9. Final production asset selection

Everything below is validated, downloaded, and ready to be copied into `/assets` when you're ready to wire it into Liquid (not done yet, per your instruction).

### HOMEPAGE
| Card | File | Notes |
|---|---|---|
| UNDER card | `UNDER/campaign/under-2026-modelo-06.jpg` | Identical file already live as `assets/montibello-under-card-portrait.jpg` — no change needed, provenance now confirmed via Marketing Center |
| HOP card | `HOP/campaign/hop-modelos-mindfullness-beauty-01.tif` | **Needs conversion to JPG/WebP first** (Shopify can't serve `.tif`). Fallback if conversion is deferred: `HOP/campaign/hop-gama-repair-colour.jpg` (already web-safe format, ready now) |
| LUXLIGHT card | `LUXLIGHT/campaign/luxlight-modelo-01.jpg` | Ready now, no conversion needed |
| HOP Keratin teaser | `HOP-KERATIN/coming-soon/hop-keratin-infusion.jpg` | Ready now — small/muted treatment, "Próximamente" label, no purchase path |

### UNDER
| Section | File | Notes |
|---|---|---|
| Hero desktop | `assets/montibello-under-hero-desktop.jpg` (existing) | No superior Marketing Center replacement found this pass — **keep** |
| Hero mobile | `assets/montibello-under-hero-mobile.jpg` (existing) | **Keep** |
| Stats/high-definition section | `UNDER/products/under-bodegon-08.jpg` | Same source photo as the currently-live `montibello-under-stats-editorial.jpg`, now at native 3150×4724 vs. the old 1707×1766 — re-crop to the section's aspect ratio before swapping in |
| Glucamine Nature Tech | `assets/montibello-under-glucamine-tech.jpg` (existing) | No Marketing Center equivalent found under the Under brand filter — **keep** |
| Elevated Warmth | `assets/montibello-under-editorial-elevated-warmth.jpg` (existing) | No higher-res replacement found this pass — **keep** |
| Product packshots | `UNDER/products/under-crema-activadora.png`, `under-tubo.png`, `under-bodegon-01..12.jpg` | All ready now, web-safe formats |
| Lifestyle panorama / carousel | `UNDER/campaign/under-2026-modelo-02.jpg` through `-05.jpg`, `under-tendencias-2026.jpg` | Ready now |
| Professional CTA | `assets/montibello-professional-salon-editorial.jpg` (existing) | No clearly-better topical replacement found (HOP-in-salon imagery is keratin-service-specific, not generic distributor/professional-network imagery) — **keep** |
| Colour chart PDF | `UNDER/pdf/under-carta-de-color-digital.pdf` | **Replaces** `assets/montibello-under-carta-color.pdf` — confirmed official, newer source |

### HOP
| Section | File | Notes |
|---|---|---|
| Hub hero | `HOP/campaign/hop-gama-completa.jpg` | **334 MB → must be re-exported at web resolution first.** Faster path: `HOP/campaign/hop-gama-repair-colour.jpg` (23.8 MB, still needs downscale but far more tractable) |
| Color Last | `HOP/COLOR-LAST/*.png` (6 files) | Ready now |
| Smooth Hydration | `HOP/SMOOTH-HYDRATION/*.png` (6 files) | Ready now |
| Ultra Repair | `HOP/ULTRA-REPAIR/*.png` + campaign set (12 files) | Ready now |
| Product packshots | All of the above, plus `-ts` (talla técnica) variants for size/spec reference | Ready now |
| Editorial/professional imagery | `HOP/professional/hop-in-salon-aplicador.jpg`, `hop-in-salon-grupo.jpg` | Ready now (both are already web-safe JPG, just large — recommend downscaling from ~15000px to ~2500px wide) |

### LUXLIGHT
| Section | File | Notes |
|---|---|---|
| Landing hero | `LUXLIGHT/campaign/luxlight-fotos-lifestyle-01.jpg` or `luxlight-modelo-01.jpg` | Both ready now |
| Campaign/editorial | `LUXLIGHT/campaign/*.jpg` (8 files selected) | Ready now |
| All 8 Peru SKU packshots | `LUXLIGHT/products/luxlight-supreme-*.png/.jpg` (9 files incl. both Control Oil System parts) | Ready now |
| Technical imagery | `LUXLIGHT/technical/luxlight-tecnologia-01..05.jpg` | Ready now |

### HOP KERATIN
| Section | File | Notes |
|---|---|---|
| Coming-soon teaser | `HOP-KERATIN/coming-soon/hop-keratin-infusion.jpg` or `hop-keratin-cleanser.jpg` | Both ready now — pick one, muted/small treatment, "Próximamente" label only, no purchase path |

---

## 10. Migration plan — CURRENT ASSET → OFFICIAL MARKETING CENTER REPLACEMENT

| Current `/assets` file | Action | Replacement |
|---|---|---|
| `montibello-under-carta-color.pdf` (8.3 MB) | **Replace** | `UNDER/pdf/under-carta-de-color-digital.pdf` (14.2 MB, confirmed official) |
| `montibello-under-stats-editorial.jpg` (1707×1766) | **Replace** | `UNDER/products/under-bodegon-08.jpg` (3150×4724, same source photo, needs re-crop to same aspect ratio) |
| `montibello-under-product-colorant.webp` (1855×2560) | **Consider replacing** | `UNDER/products/under-tubo.png` (1987×3688, official MC packshot) — re-export to WebP for weight if adopted |
| `montibello-hcare-hop-editorial.jpg` (2560×1183) | **Consider replacing** | `HOP/campaign/hop-modelos-mindfullness-beauty-01.tif` (after conversion) or `hop-gama-repair-colour.jpg` — Marketing Center offers substantially higher-res true campaign photography for HOP than the WP-scraped crop currently in use |
| `montibello-under-card-portrait.jpg` (1600×2265) | **No action** | Confirmed identical file to `UNDER/campaign/under-2026-modelo-06.jpg` — already the Marketing Center original |
| `montibello-under-hero-desktop.jpg` / `-mobile.jpg` | **No action — keep** | No Marketing Center equivalent found under the Under brand filter this pass |
| `montibello-under-editorial-elevated-warmth.jpg` | **No action — keep** | No higher-res replacement found this pass |
| `montibello-under-glucamine-tech.jpg` | **No action — keep** | No Marketing Center equivalent found |
| `montibello-under-activating-cream-15/25/35vol.jpg` | **No action — keep** | No per-volume packshot variants found in Marketing Center (only a generic "Crema activadora" shot exists there) |
| `montibello-professional-salon-editorial.jpg` | **No action — keep** | No clearly-better topical match found (HOP-in-salon imagery is service-specific, not generic professional/distributor imagery) |
| `montibello-logo.svg` | **No action** | Visually matches the official logo package; no confirmed newer version found |

**Nothing has been deleted.** All current `/assets` files remain in place and functional; this table only marks which ones have a superior or confirmed-authoritative Marketing Center counterpart ready to swap in when you decide to implement.
