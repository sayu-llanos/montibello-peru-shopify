// Local-only tests for the Client Credentials Grant flow — global.fetch is
// mocked, so these never hit the real network and never need real secrets.

const test = require('node:test');
const assert = require('node:assert/strict');
const { fetchAccessToken, missingScopes, REQUIRED_SCOPES, redact } = require('../lib/oauth');

function withMockedFetch(responder, fn) {
  const original = global.fetch;
  global.fetch = responder;
  return Promise.resolve(fn()).finally(() => {
    global.fetch = original;
  });
}

test('fetchAccessToken: posts client_credentials to the correct OAuth URL', async () => {
  let capturedUrl;
  let capturedBody;
  let capturedHeaders;

  await withMockedFetch(
    async (url, init) => {
      capturedUrl = url;
      capturedBody = init.body;
      capturedHeaders = init.headers;
      return {
        ok: true,
        text: async () =>
          JSON.stringify({ access_token: 'shpat_fake_for_test', scope: 'write_products,write_metaobjects,write_files' }),
      };
    },
    async () => {
      const result = await fetchAccessToken({
        shop: 'nar9bk-s9',
        clientId: 'fake-client-id',
        clientSecret: 'fake-client-secret',
      });
      assert.equal(result.accessToken, 'shpat_fake_for_test');
      assert.deepEqual(result.scopes, ['write_products', 'write_metaobjects', 'write_files']);
    }
  );

  assert.equal(capturedUrl, 'https://nar9bk-s9.myshopify.com/admin/oauth/access_token');
  assert.equal(capturedHeaders['Content-Type'], 'application/x-www-form-urlencoded');
  assert.match(capturedBody, /grant_type=client_credentials/);
  assert.match(capturedBody, /client_id=fake-client-id/);
  assert.match(capturedBody, /client_secret=fake-client-secret/);
});

test('fetchAccessToken: throws without leaking the client secret on HTTP failure', async () => {
  await withMockedFetch(
    async () => ({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () => JSON.stringify({ error: 'invalid_client' }),
    }),
    async () => {
      await assert.rejects(
        () =>
          fetchAccessToken({
            shop: 'nar9bk-s9',
            clientId: 'fake-client-id',
            clientSecret: 'super-secret-value',
          }),
        (err) => {
          assert.match(err.message, /HTTP 401/);
          assert.ok(!err.message.includes('super-secret-value'), 'error message must not include the client secret');
          return true;
        }
      );
    }
  );
});

test('fetchAccessToken: throws if the response has no access_token', async () => {
  await withMockedFetch(
    async () => ({ ok: true, text: async () => JSON.stringify({ scope: 'write_products' }) }),
    async () => {
      await assert.rejects(() =>
        fetchAccessToken({ shop: 'nar9bk-s9', clientId: 'x', clientSecret: 'y' })
      );
    }
  );
});

test('fetchAccessToken: surfaces a non-JSON HTML error body (e.g. app_not_installed) without crashing', async () => {
  await withMockedFetch(
    async () => ({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      text: async () => '<!DOCTYPE html><title>400 - Oauth error app_not_installed</title>',
    }),
    async () => {
      await assert.rejects(
        () => fetchAccessToken({ shop: 'nar9bk-s9', clientId: 'x', clientSecret: 'y' }),
        (err) => {
          assert.match(err.message, /app_not_installed/);
          return true;
        }
      );
    }
  );
});

test('missingScopes: returns nothing when all required scopes are granted', () => {
  assert.deepEqual(missingScopes(REQUIRED_SCOPES), []);
});

test('missingScopes: reports exactly what is missing', () => {
  assert.deepEqual(missingScopes(['write_products']), ['write_metaobjects', 'write_files']);
});

test('redact: strips access_token and client_secret keys but keeps everything else', () => {
  const redacted = redact({ error: 'invalid_client', access_token: 'shpat_x', client_secret: 'shhh', scope: 'write_products' });
  assert.equal(redacted.access_token, '[REDACTED]');
  assert.equal(redacted.client_secret, '[REDACTED]');
  assert.equal(redacted.error, 'invalid_client');
  assert.equal(redacted.scope, 'write_products');
});
