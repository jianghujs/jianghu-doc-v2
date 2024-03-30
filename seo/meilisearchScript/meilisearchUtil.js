'use strict';

require('dotenv').config({ path: './meilisearchScript/.env' });
const { MeiliSearch } = require('meilisearch');

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST_URL,
  apiKey: process.env.MEILISEARCH_API_KEY,
});


async function getKeys() {
  const keys = await client.getKeys();
  console.log("meilisearchScript:getKeys success", keys);
}

async function createKey() {
  const createKeyRes = await client.createKey({
    description: '只读的api key',
    actions: ['search'],
    indexes: ['cn_jianghujs_org_public', 'cn_jianghujs_org_all', 'demo_jianghujs_org_public', 'demo_jianghujs_org_all'],
    expiresAt: '2030-01-01T00:00:00Z'
  })
  console.log("meilisearchScript:createKey success", createKeyRes);
}

async function deleteKey() {
  const apiKey = 'xxxxx';
  await client.deleteKey(apiKey)
  console.log("meilisearchScript:deleteKey success");
}


async function deleteIndex() {
  const index_uid = 'test_uid';
  await client.deleteIndex(index_uid);
  console.log("meilisearchScript:deleteIndex success");
}

async function deleteAllDocuments() {
  const index_uid = 'test_uid';
  await client.index(index_uid).deleteAllDocuments();
  console.log("meilisearchScript:deleteAllDocuments success");
}

const method = process.argv[2];
switch (method) {
  case 'getKeys': getKeys(); break;
  case 'createKey': createKey(); break;
  case 'deleteKey': deleteKey(); break;
  case 'deleteIndex': deleteIndex(); break;
  case 'deleteAllDocuments': deleteAllDocuments(); break;
  default: console.error('method不支持', { method }); break;
}
