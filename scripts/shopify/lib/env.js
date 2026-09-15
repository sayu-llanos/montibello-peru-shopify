// Minimal .env.local loader — no external dependencies (dotenv etc.),
// since this repo has no package manager lockfile/install step set up yet.
// Only reads .env.local (never .env, never committed) and never logs values.
//
// This app authenticates via Client Credentials Grant (Shopify Dev
// Dashboard custom app), NOT a static Admin API access token — .env.local
// holds only the shop name and OAuth client id/secret. The access token
// itself is fetched at runtime (see lib/oauth.js) and kept in memory only.

const fs = require('node:fs');
const path = require('node:path');
const { ADMIN_API_VERSION } = require('./config');

const REQUIRED_STORE_DOMAIN = 'nar9bk-s9.myshopify.com';

function parseEnvFile(contents) {
  const values = {};
  for (const rawLine of contents.split('\n')) {
    const line = rawLine.trim();
    if (line === '' || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

/**
 * Loads OAuth client credentials from .env.local at the repo root.
 * Returns { ok: true, env: { shop, storeDomain, clientId, clientSecret,
 * apiVersion } } or { ok: false, reason } — never throws, so callers can
 * print a clear, non-crashing report instead of a stack trace when
 * credentials are missing (a legitimate, expected state in this repo
 * today). Never returns or logs clientSecret beyond handing it back to the
 * caller for the one OAuth request that needs it.
 */
function loadShopifyEnv(repoRoot) {
  const envPath = path.join(repoRoot, '.env.local');

  if (!fs.existsSync(envPath)) {
    return {
      ok: false,
      reason: `.env.local not found at ${envPath}. Create it with SHOPIFY_SHOP, SHOPIFY_CLIENT_ID, and SHOPIFY_CLIENT_SECRET — see .env.local.example.`,
    };
  }

  const parsed = parseEnvFile(fs.readFileSync(envPath, 'utf8'));
  const shop = parsed.SHOPIFY_SHOP;
  const clientId = parsed.SHOPIFY_CLIENT_ID;
  const clientSecret = parsed.SHOPIFY_CLIENT_SECRET;
  const apiVersion = parsed.SHOPIFY_API_VERSION || ADMIN_API_VERSION;

  if (!shop) {
    return { ok: false, reason: 'SHOPIFY_SHOP is missing from .env.local.' };
  }
  if (!clientId) {
    return { ok: false, reason: 'SHOPIFY_CLIENT_ID is missing from .env.local.' };
  }
  if (!clientSecret) {
    return { ok: false, reason: 'SHOPIFY_CLIENT_SECRET is missing from .env.local.' };
  }

  const storeDomain = `${shop}.myshopify.com`;
  if (storeDomain !== REQUIRED_STORE_DOMAIN) {
    return {
      ok: false,
      reason: `SHOPIFY_SHOP="${shop}" resolves to "${storeDomain}", not the only authorized store "${REQUIRED_STORE_DOMAIN}". Refusing to proceed.`,
    };
  }

  return { ok: true, env: { shop, storeDomain, clientId, clientSecret, apiVersion } };
}

module.exports = { loadShopifyEnv, REQUIRED_STORE_DOMAIN, parseEnvFile };
