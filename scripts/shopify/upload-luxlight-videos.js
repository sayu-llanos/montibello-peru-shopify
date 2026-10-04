#!/usr/bin/env node
// One-off: uploads the two Luxlight video files to Shopify's own file
// storage (stagedUploadsCreate -> upload -> fileCreate), then polls until
// each finishes processing, so the theme can reference a real
// cdn.shopify.com MP4 URL — the same pattern already used for UNDER's
// video (see collection.under.json), avoiding the Vimeo domain-embed
// problem entirely. Prints the two resulting URLs; does not touch any
// template/theme file itself.

const path = require('node:path');
const fs = require('node:fs');
const { loadShopifyEnv } = require('./lib/env');
const { fetchAccessToken } = require('./lib/oauth');
const { AdminClient, ShopifyAdminError } = require('./lib/admin-client');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

const STAGED_UPLOADS_CREATE = `
  mutation StagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets { url resourceUrl parameters { name value } }
      userErrors { field message }
    }
  }
`;

const FILE_CREATE = `
  mutation FileCreate($files: [FileCreateInput!]!) {
    fileCreate(files: $files) {
      files {
        id
        fileStatus
        alt
        ... on Video { sources { url format } }
      }
      userErrors { field message }
    }
  }
`;

const FILES_QUERY = `
  query FileStatus($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Video {
        id
        fileStatus
        sources { url format }
      }
    }
  }
`;

function assertNoUserErrors(name, payload) {
  if (payload.userErrors && payload.userErrors.length > 0) {
    throw new ShopifyAdminError(`${name} userErrors: ${JSON.stringify(payload.userErrors)}`);
  }
}

async function uploadVideo(client, absolutePath, filename, alt) {
  const fileBuffer = fs.readFileSync(absolutePath);
  const stagedData = await client.request(STAGED_UPLOADS_CREATE, {
    input: [
      {
        resource: 'VIDEO',
        filename,
        mimeType: 'video/mp4',
        httpMethod: 'POST',
        fileSize: String(fileBuffer.byteLength),
      },
    ],
  });
  assertNoUserErrors('stagedUploadsCreate', stagedData.stagedUploadsCreate);
  const target = stagedData.stagedUploadsCreate.stagedTargets[0];
  await client.uploadToStagedTarget(target, fileBuffer, filename, 'video/mp4');

  const createData = await client.request(FILE_CREATE, {
    files: [{ originalSource: target.resourceUrl, contentType: 'VIDEO', alt }],
  });
  assertNoUserErrors('fileCreate', createData.fileCreate);
  const file = createData.fileCreate.files[0];
  return file.id;
}

async function pollUntilReady(client, id, label) {
  for (let attempt = 0; attempt < 30; attempt++) {
    const data = await client.request(FILES_QUERY, { ids: [id] });
    const node = data.nodes[0];
    if (node && node.fileStatus === 'READY' && node.sources && node.sources.length > 0) {
      const mp4 = node.sources.find((s) => s.format === 'mp4') || node.sources[0];
      return mp4.url;
    }
    if (node && node.fileStatus === 'FAILED') {
      throw new ShopifyAdminError(`${label} processing FAILED`);
    }
    await new Promise((r) => setTimeout(r, 4000));
  }
  throw new ShopifyAdminError(`${label} did not become READY in time`);
}

async function main() {
  const envResult = loadShopifyEnv(REPO_ROOT);
  if (!envResult.ok) {
    console.error(envResult.reason);
    process.exit(1);
  }
  const { env } = envResult;

  const { accessToken } = await fetchAccessToken(env);

  const client = new AdminClient({
    storeDomain: env.storeDomain,
    accessToken,
    apiVersion: env.apiVersion,
    requiredStoreDomain: 'nar9bk-s9.myshopify.com',
  });

  const shopData = await client.request('{ shop { myshopifyDomain } }');
  if (shopData.shop.myshopifyDomain !== 'nar9bk-s9.myshopify.com') {
    console.error(`Token belongs to ${shopData.shop.myshopifyDomain}, not nar9bk-s9.myshopify.com. Aborting.`);
    process.exit(1);
  }

  const videos = [
    {
      path: path.join(REPO_ROOT, 'source-assets/LUXLIGHT/video/luxlight-video-campana.mp4'),
      filename: 'montibello-luxlight-video-campana.mp4',
      alt: 'Montibello Luxlight — vídeo campaña',
      label: 'campana',
    },
    {
      path: path.join(REPO_ROOT, 'source-assets/LUXLIGHT/video/luxlight-video-tecnologia.mp4'),
      filename: 'montibello-luxlight-video-tecnologia.mp4',
      alt: 'Montibello Luxlight — vídeo tecnología Bond3',
      label: 'tecnologia',
    },
  ];

  const results = {};
  for (const v of videos) {
    console.log(`Uploading ${v.label}...`);
    const id = await uploadVideo(client, v.path, v.filename, v.alt);
    console.log(`  staged as ${id}, waiting for processing...`);
    const url = await pollUntilReady(client, id, v.label);
    console.log(`  READY: ${url}`);
    results[v.label] = url;
  }

  console.log('\n--- RESULT ---');
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err instanceof ShopifyAdminError ? err.message : err);
  process.exit(1);
});
