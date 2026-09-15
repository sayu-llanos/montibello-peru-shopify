// Pilot definition — HOP Ultra Repair Shampoo (handle: hop-ultra-repair-shampoo).
//
// Every value below traces to an explicit, already-confirmed source:
// - variants/SKUs: given directly in this task's own instructions, and
//   cross-checked against data/shopify/product-grouping.csv row
//   HOP-ULTRA-REPAIR-SHAMPOO (source_skus: HRS3I|HRS1F, variant_values_1:
//   "300 ml|1000 ml") — matches exactly.
// - metafields.range / metafields.subfamily: read directly from that same
//   CSV row's `range`/`subfamily` columns ("HOP" / "Ultra Repair"), not
//   invented.
// - metaobjects: deliberately EMPTY. No approved copy exists yet for
//   features, key ingredients, routine steps, or allied store offers for
//   this product — per the task's explicit "no inventar... claims o
//   ingredientes" rule, this pipeline does not fabricate placeholder
//   content to fill these sections. They stay empty until a future task
//   supplies real, approved values here.
// - image: the one confirmed primary packshot path from source-assets/,
//   documented in data/shopify/image-manifest.json.

module.exports = {
  handle: 'hop-ultra-repair-shampoo',
  csvCanonicalId: 'HOP-ULTRA-REPAIR-SHAMPOO',

  variants: [
    { optionName: 'Size', optionValue: '300 ml', sku: 'HRS3I' },
    { optionName: 'Size', optionValue: '1000 ml', sku: 'HRS1F' },
  ],

  metafields: {
    // type must match product-data-schema.md exactly — single_line_text_field
    range: { type: 'single_line_text_field', value: 'HOP' },
    subfamily: { type: 'single_line_text_field', value: 'Ultra Repair' },
  },

  // Intentionally empty — see header comment. Each key maps to a
  // montibello.* list metafield of metaobject references; the sync
  // pipeline treats an empty array as "nothing to prepare," not an error.
  metaobjects: {
    features: [],
    key_ingredients: [],
    routine: [],
    allied_store_offers: [],
  },

  images: {
    // Keyed the same way as data/shopify/image-manifest.json so both files
    // can be validated against each other.
    main: 'source-assets/HOP/ULTRA-REPAIR/hop-ultra-repair-shampoo.png',
  },
};
