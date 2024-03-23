'use strict';

const path = require('path');

module.exports = appInfo => {

  return {
    language: 'zh',
    meilisearch: {
      host: 'https://meilisearch.openjianghu.org',
      apiKey: '只读权限的apiKey',
      allIndexUid: 'cn_openjianghu_org_doc_all',
      publicIndexUid: 'cn_openjianghu_org_doc_public',
    },
    static: {
      maxAge: 0,
      buffer: false,
      preload: false,
      maxFiles: 0,
    },
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
          host: "127.0.0.1",
          port: 3306,
          user: "root",
          password: "123456",
          database: 'jianghu_doc_v2',
        },
        pool: { min: 0, max: 30 },
        acquireConnectionTimeout: 30000,
      },
      app: true,
    },
  };

};
