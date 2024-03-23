'use strict';

const fs = require('fs');
const path = require('path');
const fsPromises = require("fs").promises;
const util = require("util");
const exists = util.promisify(fs.exists);
const { MeiliSearch } = require('meilisearch');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async serverDidReady() {
    await this.uploadDirCreate();
    // await this.testMeiliSearchData();
  }

  async uploadDirCreate () {
    const { uploadDir, uploadDirConfig } = this.app.config;
    if (!await exists(uploadDir)) {
        await fsPromises.mkdir(uploadDir, { recursive: true });
    }
    for (const dir of uploadDirConfig) {
      const targetDir = path.join(uploadDir, dir);
      if (!await exists(targetDir)) {
          await fsPromises.mkdir(targetDir, { recursive: true });
      }
    }
  }

  // 测试代码
  async testMeiliSearchData () {
    const client = new MeiliSearch({ 
      host: 'https://meilisearch.openjianghu.org',
      apiKey: 'FDsaf343efDsf#$325FGDg435$%fgDG',
    });

    // 删除文档
    // await client.deleteIndex('test');
    // await client.index('docs_searchbar_demo').deleteAllDocuments();
    
    // 查询所有的 api key
    const getKeysRes = await client.getKeys();
    this.app.logger.info("[AppBootHook] getKeysRes:", getKeysRes);

    // 创建一个只读的 api key
    // const createKeyRes = await client.createKey({
    //   description: '只读的api key',
    //   actions: ['search'],
    //   indexes: ['cn_openjianghu_org_doc_public', 'openjianghu_org_doc_public', 'cn_openjianghu_org_doc_all', 'openjianghu_org_doc_all'],
    //   expiresAt: '2026-01-01T00:00:00Z'
    // })
    // this.app.logger.info("[AppBootHook] createKeyRes:", createKeyRes);

    // 删除一个 api key
    // for (const keyObj of getKeysRes.results) {
    //   const { key, description } = keyObj;
    //   if (description === "只读的api key") {
    //     await client.deleteKey(key)
    //     this.app.logger.info("[AppBootHook] deleteKey:", key);
    //   }
    // }

    this.app.logger.info("[AppBootHook] testMeiliSearchData");

  }

}

module.exports = AppBootHook;

