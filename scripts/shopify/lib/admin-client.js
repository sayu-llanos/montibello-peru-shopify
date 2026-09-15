// Shopify Admin GraphQL client. Deliberately dependency-free (uses Node's
// built-in fetch, available since Node 18+). Every mutation call MUST be
// checked for userErrors by the caller via `assertNoUserErrors` — this
// module never swallows an error silently.

class ShopifyAdminError extends Error {}

class AdminClient {
  constructor({ storeDomain, accessToken, apiVersion, requiredStoreDomain }) {
    if (requiredStoreDomain && storeDomain !== requiredStoreDomain) {
      // Defense in depth: even if a caller constructs this client directly
      // (bypassing lib/env.js's own check), the client itself refuses to
      // target any store other than the one authorized for this project.
      throw new ShopifyAdminError(
        `Refusing to create an Admin API client for "${storeDomain}" — the only authorized store is "${requiredStoreDomain}".`
      );
    }
    this.storeDomain = storeDomain;
    this.accessToken = accessToken;
    this.apiVersion = apiVersion;
    this.endpoint = `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`;
  }

  async request(query, variables = {}) {
    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': this.accessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      throw new ShopifyAdminError(
        `Admin API HTTP ${res.status} ${res.statusText}: ${body ? JSON.stringify(body) : '(no body)'}`
      );
    }
    if (!body) {
      throw new ShopifyAdminError('Admin API returned a non-JSON response.');
    }
    if (body.errors && body.errors.length > 0) {
      throw new ShopifyAdminError(`Admin API GraphQL errors: ${JSON.stringify(body.errors)}`);
    }
    return body.data;
  }

  /**
   * Uploads a local file buffer to a Shopify staged-upload target
   * (returned by stagedUploadsCreate). Shopify's staged targets expect a
   * multipart/form-data POST with the target's own parameters first, then
   * the file — order matters for S3-compatible targets.
   */
  async uploadToStagedTarget(target, fileBuffer, filename, mimeType) {
    const form = new FormData();
    for (const { name, value } of target.parameters) {
      form.append(name, value);
    }
    form.append('file', new Blob([fileBuffer], { type: mimeType }), filename);

    const res = await fetch(target.url, { method: 'POST', body: form });
    if (!res.ok) {
      const text = await res.text().catch(() => '(no body)');
      throw new ShopifyAdminError(`Staged upload HTTP ${res.status} ${res.statusText}: ${text}`);
    }
  }
}

/**
 * Throws if a mutation payload carries any userErrors. Call this on every
 * mutation result before trusting its output — required by the pipeline's
 * "abort on any GraphQL userError" rule.
 *
 * @param {string} mutationName - for the error message
 * @param {object} payload - the mutation's response object (e.g. data.productUpdate)
 * @param {string} [errorsField] - defaults to 'userErrors'
 */
function assertNoUserErrors(mutationName, payload, errorsField = 'userErrors') {
  const errors = payload && payload[errorsField];
  if (errors && errors.length > 0) {
    throw new ShopifyAdminError(`${mutationName} returned userErrors: ${JSON.stringify(errors)}`);
  }
}

module.exports = { AdminClient, ShopifyAdminError, assertNoUserErrors };
