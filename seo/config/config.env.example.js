'use strict';

const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../../.env')});

module.exports = appInfo => {

  return {
    adminUrl: `http://127.0.0.1:7368/jianghu-doc-v2-admin`,
    xfpageSeoResourceUrl: "https://www.openjianghu.org/doc",
    language: 'zh',
    meilisearch: {
      host: 'https://meilisearch.openjianghu.org',
      apiKey: '只读权限的apiKey',
      allIndexUid: 'demo_jianghujs_org_all',
      publicIndexUid: 'demo_jianghujs_org_public',
    },
    // static: {
    //   maxAge: 14 * 24 * 60 * 60 * 1000, // 2 weeks in milliseconds
    //   buffer: true,
    //   preload: false,
    //   maxFiles: 0,
    // },
    logger: {
      outputJSON: true,
      consoleLevel: "DEBUG",
      level: "DEBUG",
      dir: path.join(appInfo.baseDir, "logs"),
      contextFormatter(meta) {
        return `[${meta.date}] [${meta.level}] [${meta.ctx.method} ${meta.ctx.url}] ${meta.message}`;
      },
    },
    jianghuConfig: {
      jianghuConfigDataIgnoreIdList: {
        _constant: [],
        _page: [],
        _resource: [],
        _test_case: [],
        _ui: [],
      },
      jhIdConfig: {
        // 是否开启
        enable: true,
        // 当前应用使用的 jhId，在使用配置表时，自动用该 jhId 做过滤
        jhId: 'seo',
        // 使用到 jhId 的配置表，一般保持默认即可
        careTableViewList: [
          '_cache',
          '_constant',
          '_constant_ui',
          '_file',
          '_group',
          '_page',
          '_record_history',
          '_resource',
          '_resource_request_log',
          '_role',
          '_test_case',
          '_user',
          '_user_group_role',
          '_user_group_role_page',
          '_user_group_role_resource',
          '_user_session',
          '_view01_user',
        ],
      },
    },
    knex: {
      client: {
        dialect: "mysql",
        connection: {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: 'jianghu_doc_v2',
        },
        pool: { min: 0, max: 30 },
        acquireConnectionTimeout: 30000,
      },
      app: true,
    },
  };

};
