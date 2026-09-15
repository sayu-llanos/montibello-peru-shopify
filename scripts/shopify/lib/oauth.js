// Client Credentials Grant — fetches an Admin API access token at runtime
// from a Shopify Dev Dashboard custom app's client id/secret. The token is
// returned to the caller for in-memory use only: this module never writes
// it to disk, never logs it, and never logs the client secret.

const SENSITIVE_KEYS = new Set(['access_token', 'client_secret', 'clientSecret', 'accessToken']);

/** Removes any known-sensitive key before an object is ever stringified for
 * a log/error message — defense in depth, even on paths that shouldn't
 * carry a token (e.g. an OAuth error response). */
function redact(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const copy = {};
  for (const [key, value] of Object.entries(obj)) {
    copy[key] = SENSITIVE_KEYS.has(key) ? '[REDACTED]' : value;
  }
  return copy;
}

const REQUIRED_SCOPES = ['write_products', 'write_metaobjects', 'write_files'];

/**
 * Requests an access token via the Client Credentials Grant.
 * @returns {Promise<{ accessToken: string, scopes: string[] }>}
 * @throws on any HTTP failure or missing access_token — never returns a
 * token without also returning the granted scope list, so the caller can
 * verify scopes before doing anything else.
 */
async function fetchAccessToken({ shop, clientId, clientSecret }) {
  const url = `https://${shop}.myshopify.com/admin/oauth/access_token`;
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const rawText = await res.text();
  let data = null;
  try {
    data = JSON.parse(rawText);
  } catch {
    // leave data null — rawText (never containing our own client_secret,
    // only whatever Shopify sent back) is used for diagnostics below.
  }

  if (!res.ok) {
    const detail = data ? JSON.stringify(redact(data)) : rawText.slice(0, 500);
    throw new Error(`OAuth client_credentials request failed (HTTP ${res.status} ${res.statusText}): ${detail}`);
  }
  if (!data || !data.access_token) {
    throw new Error(`OAuth response did not include an access_token: ${JSON.stringify(redact(data))}`);
  }

  const scopes = (data.scope || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return { accessToken: data.access_token, scopes };
}

/** Returns the required scopes that are missing from the granted list, or
 * an empty array if everything required is present. */
function missingScopes(grantedScopes) {
  return REQUIRED_SCOPES.filter((required) => !grantedScopes.includes(required));
}

module.exports = { fetchAccessToken, missingScopes, REQUIRED_SCOPES, redact };
