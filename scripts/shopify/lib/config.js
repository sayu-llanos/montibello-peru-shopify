// Single source of truth for the Admin GraphQL API version — every other
// file must import this constant rather than hardcoding a version string,
// so the version cannot drift between files.
//
// Must match the API version the Montibello app is actually configured for
// in the Partner/Dev Dashboard. Currently 2026-07, which is the first
// version confirmed (by live schema introspection) to expose
// `productUpdate(media: [CreateMediaInput!])` — 2025-01 does not have this
// argument, and has no `productCreateMedia` mutation either.
const ADMIN_API_VERSION = '2026-07';

module.exports = { ADMIN_API_VERSION };
