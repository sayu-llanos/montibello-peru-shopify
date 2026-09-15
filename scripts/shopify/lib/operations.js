const fs = require('node:fs');
const path = require('node:path');
const {
  PRODUCT_LOOKUP,
  PRODUCT_VARIANTS_BULK_UPDATE,
  METAFIELDS_SET,
  METAOBJECT_UPSERT,
  STAGED_UPLOADS_CREATE,
  PRODUCT_UPDATE_MEDIA_ARG_CHECK,
  PRODUCT_UPDATE_MEDIA,
  PRODUCT_CREATE,
  PRODUCT_OPTIONS_CREATE,
} = require('./queries');
const { assertNoUserErrors } = require('./admin-client');

const NAMESPACE = 'montibello';

/** Reads the product + its montibello.* metafields, variants, and media. */
async function findProduct(client, handle) {
  const data = await client.request(PRODUCT_LOOKUP, { handle });
  return data.productByHandle; // null if not found — caller decides what to do
}

/**
 * Pure diff: which confirmed variants need a SKU update, which are already
 * correct. Matching is by the variant's single `Size` option value, per
 * this pilot's confirmed data (HOP Ultra Repair Shampoo has exactly one
 * option, Size).
 */
function planVariantUpdates(product, desiredVariants) {
  const toUpdate = [];
  const alreadyCorrect = [];
  const notFoundOnProduct = [];

  for (const desired of desiredVariants) {
    const match = product.variants.nodes.find((v) =>
      v.selectedOptions.some(
        (opt) => opt.name === desired.optionName && opt.value === desired.optionValue
      )
    );
    if (!match) {
      notFoundOnProduct.push(desired);
      continue;
    }
    if (match.sku === desired.sku) {
      alreadyCorrect.push({ desired, variantId: match.id });
    } else {
      toUpdate.push({ desired, variantId: match.id, currentSku: match.sku });
    }
  }

  return { toUpdate, alreadyCorrect, notFoundOnProduct };
}

async function applyVariantUpdates(client, productId, toUpdate) {
  if (toUpdate.length === 0) return [];
  const variantsInput = toUpdate.map(({ variantId, desired }) => ({
    id: variantId,
    inventoryItem: { sku: desired.sku },
  }));
  const data = await client.request(PRODUCT_VARIANTS_BULK_UPDATE, {
    productId,
    variants: variantsInput,
  });
  assertNoUserErrors('productVariantsBulkUpdate', data.productVariantsBulkUpdate);
  return data.productVariantsBulkUpdate.productVariants;
}

/** Pure diff: which montibello.* metafields need to be set vs. already match. */
function planMetafieldUpdates(product, desiredMetafields) {
  const toSet = [];
  const alreadyCorrect = [];

  for (const [key, { type, value }] of Object.entries(desiredMetafields)) {
    const existing = product.metafields.nodes.find((m) => m.key === key);
    if (existing && existing.value === value && existing.type === type) {
      alreadyCorrect.push({ key, type, value });
    } else {
      toSet.push({ key, type, value, previousValue: existing ? existing.value : null });
    }
  }

  return { toSet, alreadyCorrect };
}

async function applyMetafieldUpdates(client, productId, toSet) {
  if (toSet.length === 0) return [];
  const metafieldsInput = toSet.map(({ key, type, value }) => ({
    ownerId: productId,
    namespace: NAMESPACE,
    key,
    type,
    value,
  }));
  const data = await client.request(METAFIELDS_SET, { metafields: metafieldsInput });
  assertNoUserErrors('metafieldsSet', data.metafieldsSet);
  return data.metafieldsSet.metafields;
}

/**
 * Builds a deterministic handle for a metaobject entry so metaobjectUpsert
 * is truly idempotent (same input -> same handle -> update, not a new
 * record). Handle = `<ownerProductHandle>-<metaobjectType>-<index>`.
 */
function buildMetaobjectHandle(productHandle, metaobjectType, index) {
  return `${productHandle}-${metaobjectType}-${index}`.toLowerCase();
}

/** Pure: turns this pilot's (possibly empty) metaobjects.* lists into upsert plans. */
function planMetaobjectUpserts(productHandle, metaobjectsByField) {
  const plans = [];
  const fieldToType = {
    features: 'montibello_feature',
    key_ingredients: 'montibello_ingredient',
    routine: 'montibello_routine_step',
    allied_store_offers: 'montibello_allied_store_offer',
  };

  for (const [field, entries] of Object.entries(metaobjectsByField)) {
    const type = fieldToType[field];
    entries.forEach((entry, index) => {
      plans.push({
        field,
        type,
        handle: buildMetaobjectHandle(productHandle, type, index),
        fields: entry,
      });
    });
  }
  return plans;
}

async function applyMetaobjectUpsert(client, plan) {
  const fieldsInput = Object.entries(plan.fields).map(([key, value]) => ({ key, value }));
  const data = await client.request(METAOBJECT_UPSERT, {
    handle: { type: plan.type, handle: plan.handle },
    metaobject: { fields: fieldsInput },
  });
  assertNoUserErrors('metaobjectUpsert', data.metaobjectUpsert);
  return data.metaobjectUpsert.metaobject;
}

/**
 * Factual, non-fabricated alt text built only from the confirmed product
 * title. Deliberately does NOT include a size/variant — the image itself
 * doesn't depict a specific size, so naming one in the alt text would be an
 * inference the image doesn't support, not a fact read off it.
 */
function buildAltText(productTitle) {
  return `Botella de ${productTitle} de Montibello`;
}

/**
 * Resolves whether the confirmed image is already attached to the product,
 * using the deterministic alt text as the dedupe key (Shopify doesn't
 * expose the originally-uploaded local filename back on Media, so alt text
 * is the most reliable signal this pipeline controls end-to-end).
 */
function planImageUpload(product, altText) {
  const existing = product.media.nodes.find((m) => m.alt === altText);
  return existing ? { alreadyUploaded: true, media: existing } : { alreadyUploaded: false };
}

function resolveAssetPath(repoRoot, relativePath) {
  if (!relativePath.startsWith('source-assets/')) {
    throw new Error(
      `Refusing to use non-source-assets image path "${relativePath}" — only source-assets/ is authorized (never local-assets/).`
    );
  }
  const absolute = path.join(repoRoot, relativePath);
  if (!fs.existsSync(absolute)) {
    throw new Error(`Image not found on disk: ${absolute}`);
  }
  return absolute;
}

/**
 * Confirms — via live introspection against whatever API version this
 * process is actually configured for (lib/config.js), never assumed —
 * that Mutation.productUpdate has a `media` argument whose type unwraps to
 * CreateMediaInput. productCreateMedia is not checked or used at all: it
 * does not exist in this app's configured API version, and productSet is
 * explicitly prohibited for image attachment (see queries.js) because its
 * list-field reconciliation semantics risk deleting this product's real
 * variants/metafields if not fully resupplied.
 */
async function checkProductUpdateMediaAvailable(client) {
  const data = await client.request(PRODUCT_UPDATE_MEDIA_ARG_CHECK);
  const productUpdateField = data.__type.fields.find((f) => f.name === 'productUpdate');
  if (!productUpdateField) {
    return { available: false, reason: 'productUpdate is not present in this API version\'s schema.' };
  }
  const mediaArg = productUpdateField.args.find((a) => a.name === 'media');
  if (!mediaArg) {
    return { available: false, reason: 'productUpdate has no "media" argument in this API version.' };
  }
  // Unwrap LIST -> NON_NULL -> INPUT_OBJECT to find the base named type.
  let t = mediaArg.type;
  while (t && !t.name) t = t.ofType;
  if (!t || t.name !== 'CreateMediaInput') {
    return {
      available: false,
      reason: `productUpdate's "media" argument does not resolve to CreateMediaInput (found: ${t ? t.name : 'unknown'}).`,
    };
  }
  return { available: true };
}

/**
 * Uploads the confirmed local image and attaches it to the product via
 * productUpdate's separate `media` argument — never productSet. `product`
 * is sent with ONLY `{ id: productId }`; no title/handle/status/tags/
 * variants/metafields/collections are ever included, so this call cannot
 * touch anything on the product besides adding the new media.
 */
/**
 * Uploads a local file to a fresh Shopify staged target and returns the
 * resourceUrl to use as `originalSource` in a CreateMediaInput. Shared by
 * both the existing-product image-attach path (uploadAndAttachImage) and
 * the new-product creation path (createCanonicalProduct) so there is one
 * upload implementation, not two.
 */
async function stageLocalImage(client, absolutePath, filename) {
  const fileBuffer = fs.readFileSync(absolutePath);
  const mimeType = filename.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

  const stagedData = await client.request(STAGED_UPLOADS_CREATE, {
    input: [
      {
        resource: 'PRODUCT_IMAGE',
        filename,
        mimeType,
        httpMethod: 'POST',
        fileSize: String(fileBuffer.byteLength),
      },
    ],
  });
  assertNoUserErrors('stagedUploadsCreate', stagedData.stagedUploadsCreate);
  const target = stagedData.stagedUploadsCreate.stagedTargets[0];
  await client.uploadToStagedTarget(target, fileBuffer, filename, mimeType);
  return target.resourceUrl;
}

async function uploadAndAttachImage(client, { productId, absolutePath, filename, altText }) {
  const resourceUrl = await stageLocalImage(client, absolutePath, filename);
  const mediaData = await client.request(PRODUCT_UPDATE_MEDIA, {
    product: { id: productId },
    media: [{ originalSource: resourceUrl, mediaContentType: 'IMAGE', alt: altText }],
  });
  assertNoUserErrors('productUpdate', mediaData.productUpdate);
  return mediaData.productUpdate.product.media.nodes;
}

/**
 * True when a canonical spec needs a real, named product option (e.g. a
 * paired-size HOP product's "Size") rather than Shopify's implicit single
 * "Title" / "Default Title" variant. Every spec in lib/catalog.js with more
 * than one variant uses the same option name across all its variants, so
 * checking the first variant's option is sufficient.
 */
function needsRealOption(spec) {
  return spec.variants.length > 1 || spec.variants[0].optionName !== 'Title';
}

/**
 * Creates a brand-new DRAFT product from a canonical catalog spec
 * (lib/catalog.js) using ONLY productCreate — never productSet, which is
 * prohibited for image work elsewhere in this pipeline because of its
 * list-field reconciliation behavior. That risk does not apply here since
 * this is always a genuinely new product with nothing pre-existing to
 * reconcile away, but productCreate is used uniformly regardless.
 *
 * Writes only montibello.range and montibello.subfamily (both sourced
 * directly from product-grouping.csv) — no speculative metafield is ever
 * set here. Deliberately never passes productOptions here: productCreate's
 * own mutation description states it "only supports creating a product
 * with its initial product variant" regardless of productOptions — a
 * multi-value option is added afterward via addConfirmedOption. Variant
 * SKUs are likewise not set by this call; the caller applies them via
 * planVariantUpdates/applyVariantUpdates against the returned product, same
 * as the existing single-pilot flow.
 */
async function createCanonicalProduct(client, spec, mediaInput) {
  const productInput = {
    title: spec.title,
    handle: spec.handle,
    vendor: 'Montibello',
    status: 'DRAFT',
    metafields: [
      { namespace: NAMESPACE, key: 'range', type: 'single_line_text_field', value: spec.range },
      { namespace: NAMESPACE, key: 'subfamily', type: 'single_line_text_field', value: spec.subfamily },
    ],
  };
  if (spec.productType) productInput.productType = spec.productType;

  const data = await client.request(PRODUCT_CREATE, { product: productInput, media: mediaInput });
  assertNoUserErrors('productCreate', data.productCreate);
  return data.productCreate.product;
}

/**
 * Adds the confirmed real option (e.g. "Size") and its values to a
 * just-created, still-single-variant product, using variantStrategy
 * "CREATE" — per that enum value's own description, this updates the
 * existing placeholder variant to the option's first value and creates one
 * new variant per remaining value, so the result is exactly
 * spec.variants.length variants with no leftover "Default Title" record.
 * Never called for a product that already has a real option (e.g.
 * hop-ultra-repair-shampoo) — that would return OPTION_ALREADY_EXISTS.
 */
async function addConfirmedOption(client, productId, spec) {
  const optionName = spec.variants[0].optionName;
  const options = [{ name: optionName, values: spec.variants.map((v) => ({ name: v.optionValue })) }];
  const data = await client.request(PRODUCT_OPTIONS_CREATE, {
    productId,
    options,
    variantStrategy: 'CREATE',
  });
  assertNoUserErrors('productOptionsCreate', data.productOptionsCreate);
  return data.productOptionsCreate.product;
}

module.exports = {
  NAMESPACE,
  findProduct,
  planVariantUpdates,
  applyVariantUpdates,
  planMetafieldUpdates,
  applyMetafieldUpdates,
  buildMetaobjectHandle,
  planMetaobjectUpserts,
  applyMetaobjectUpsert,
  buildAltText,
  planImageUpload,
  resolveAssetPath,
  checkProductUpdateMediaAvailable,
  stageLocalImage,
  uploadAndAttachImage,
  needsRealOption,
  createCanonicalProduct,
  addConfirmedOption,
};
