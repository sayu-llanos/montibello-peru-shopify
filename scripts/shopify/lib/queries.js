// Centralized GraphQL documents for the Admin API. Kept separate from
// lib/operations.js so the exact query/mutation shapes are easy to review
// and diff on their own — this is the part most likely to need updating if
// Shopify changes the API in a future version.

// Verifies the store the freshly-obtained access token actually belongs to,
// not just the SHOPIFY_SHOP value we assumed when requesting it — the
// literal "verify the store returned" check, run once right after
// authenticating and before any product read/mutation.
// Combined into one round trip: the store the token belongs to, and the
// scopes actually authorized on this installation. The Client Credentials
// Grant token response's own \`scope\` field is not treated as
// authoritative — for a Dev Dashboard app it can come back empty even when
// real scopes are authorized, since scopes for this app model are granted
// at install time via the app's configuration rather than negotiated per
// token request. currentAppInstallation.accessScopes is the live,
// authoritative source for what this token can actually do.
const STORE_AND_SCOPES_VERIFY = `
  query StoreAndScopesVerify {
    shop {
      myshopifyDomain
    }
    currentAppInstallation {
      accessScopes {
        handle
      }
    }
  }
`;

const PRODUCT_LOOKUP = `
  query ProductLookup($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      status
      options {
        id
        name
      }
      variants(first: 25) {
        nodes {
          id
          sku
          title
          selectedOptions { name value }
        }
      }
      metafields(namespace: "montibello", first: 50) {
        nodes { id namespace key type value }
      }
      media(first: 25) {
        nodes {
          id
          alt
          mediaContentType
          ... on MediaImage {
            image { url }
          }
        }
      }
    }
  }
`;

// SKU lives on the variant's InventoryItem, not directly on
// ProductVariantsBulkInput, as of the API versions this project targets
// (2023-04+) — verified against the ProductVariantsBulkInput schema shape
// rather than assumed, since a top-level `sku` field on this input was
// removed in that migration.
const PRODUCT_VARIANTS_BULK_UPDATE = `
  mutation ProductVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      productVariants {
        id
        sku
        selectedOptions { name value }
      }
      userErrors { field message }
    }
  }
`;

const METAFIELDS_SET = `
  mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { id namespace key }
      userErrors { field message code }
    }
  }
`;

// metaobjectUpsert is keyed by (type, handle), so calling it twice with the
// same handle updates the existing record instead of creating a duplicate —
// this is what makes metaobject sync idempotent without a separate
// "does this already exist" lookup query.
const METAOBJECT_UPSERT = `
  mutation MetaobjectUpsert($handle: MetaobjectHandleInput!, $metaobject: MetaobjectUpsertInput!) {
    metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
      metaobject { id handle type }
      userErrors { field message code }
    }
  }
`;

const STAGED_UPLOADS_CREATE = `
  mutation StagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets {
        url
        resourceUrl
        parameters { name value }
      }
      userErrors { field message }
    }
  }
`;

// PROHIBITED for image attachment: productSet. Its own live schema
// description says list fields (variants, metafields, collections, files)
// are fully reconciled against the mutation's input — entries not included
// get deleted. Using it with only `files` set would risk wiping this
// product's real variants/metafields. productCreateMedia does not exist in
// this app's configured API version (confirmed absent by introspection),
// and ProductUpdateInput (the older `input:` argument shape) has no
// media/files field at all. The only mutation used for image attachment is
// productUpdate's separate `media` argument (added in a later API version
// than 2025-01) — verified live below before ever being called.
//
// Introspects Mutation.productUpdate's own argument list (not just
// "does productUpdate exist") — confirms an argument named `media` whose
// type unwraps to CreateMediaInput, live against whatever API version this
// process is actually configured for (lib/config.js).
const PRODUCT_UPDATE_MEDIA_ARG_CHECK = `
  query ProductUpdateMediaArgCheck {
    __type(name: "Mutation") {
      fields(includeDeprecated: false) {
        name
        args {
          name
          type {
            name
            kind
            ofType {
              name
              kind
              ofType {
                name
                kind
              }
            }
          }
        }
      }
    }
  }
`;

// product: { id } ONLY — no title/handle/status/tags/variants/metafields.
// This mutation must never be called with anything else in `product` for
// the image-attach use case; see operations.js's uploadAndAttachImage.
const PRODUCT_UPDATE_MEDIA = `
  mutation ProductUpdateMedia($product: ProductUpdateInput!, $media: [CreateMediaInput!]) {
    productUpdate(product: $product, media: $media) {
      product {
        id
        media(first: 5) {
          nodes {
            id
            alt
            mediaContentType
          }
        }
      }
      userErrors { field message }
    }
  }
`;

// Creates a brand-new product only — never used for an existing handle.
// Unlike productSet, productCreate has no list-field reconciliation
// behavior: there is nothing pre-existing on a new product to accidentally
// delete. productOptions (with values) makes Shopify auto-generate one
// variant per value at creation time; SKUs are then set on those variants
// via productVariantsBulkUpdate (see lib/operations.js), same as the
// existing pilot's variant-update path. `media` is the same separate
// argument (CreateMediaInput) used by PRODUCT_UPDATE_MEDIA above — verified
// present on productCreate by live introspection before use.
const PRODUCT_CREATE = `
  mutation ProductCreate($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
    productCreate(product: $product, media: $media) {
      product {
        id
        title
        handle
        status
        variants(first: 25) {
          nodes { id sku selectedOptions { name value } }
        }
        media(first: 5) {
          nodes { id alt mediaContentType }
        }
      }
      userErrors { field message }
    }
  }
`;

// productCreate (above) only ever creates a product with ONE initial
// variant — confirmed by its own live mutation description ("The
// productCreate mutation only supports creating a product with its initial
// product variant"), not assumed. A paired-size HOP product therefore needs
// this second mutation to add the real "Size" option afterward.
// variantStrategy: CREATE replaces the placeholder implicit "Title" option
// on the just-created single-variant product: the existing variant is
// updated in place to the option's first value, and one new variant is
// created for each remaining value — confirmed via this enum value's own
// description, not assumed. This never applies to hop-ultra-repair-shampoo
// (already has a real Size option, so productOptionsCreate would return
// OPTION_ALREADY_EXISTS) — this pipeline never calls it for that handle.
const PRODUCT_OPTIONS_CREATE = `
  mutation ProductOptionsCreate($productId: ID!, $options: [OptionCreateInput!]!, $variantStrategy: ProductOptionCreateVariantStrategy) {
    productOptionsCreate(productId: $productId, options: $options, variantStrategy: $variantStrategy) {
      product {
        id
        title
        handle
        status
        variants(first: 25) {
          nodes { id sku selectedOptions { name value } }
        }
        media(first: 5) {
          nodes { id alt mediaContentType }
        }
      }
      userErrors { field message code }
    }
  }
`;

module.exports = {
  STORE_AND_SCOPES_VERIFY,
  PRODUCT_LOOKUP,
  PRODUCT_VARIANTS_BULK_UPDATE,
  METAFIELDS_SET,
  METAOBJECT_UPSERT,
  STAGED_UPLOADS_CREATE,
  PRODUCT_UPDATE_MEDIA_ARG_CHECK,
  PRODUCT_UPDATE_MEDIA,
  PRODUCT_CREATE,
  PRODUCT_OPTIONS_CREATE,
};
