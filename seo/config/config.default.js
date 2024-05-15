"use strict";

const path = require("path");
const assert = require("assert");

const {
  middleware,
  middlewareMatch,
} = require("@jianghujs/jianghu/config/middlewareConfig");
const fs = require("fs");

const jianghuPathTemp = require.resolve('@jianghujs/jianghu');
const jianghuPath = path.join(jianghuPathTemp, "../");

module.exports = (appInfo) => {
  assert(appInfo);
  const appId = "doc";
  const uploadDir = path.join(appInfo.baseDir, "upload");
  const downloadBasePath = `/${appId}/upload`;

  return {
    appId,
    appTitle: "江湖数字化平台",
    meilisearch: {
      host: 'https://meilisearch.openjianghu.org',
      apiKey: 'Iy4kJeGu643c54a953fdc6a5d0cbf752a228a8fc58cb1a00ddaf1634fe4e82f07475718e',
      allIndexUid: 'cn_openjianghu_org_doc_all',
      publicIndexUid: 'cn_openjianghu_org_doc_public',
    },
    appLogo: `/${appId}/upload/seoResource/image/logo.svg`,
    appType: "single",
    indexPage: `/${appId}/index`,
    loginPage: `/${appId}/login`,
    helpPage: `/${appId}/help`,
    adminUrl: `http://127.0.0.1:7368/jianghu-doc-v2-admin`,
    xfpageSeoResourceUrl: `/jianghu-doc-v2-admin`,
    junshiHost: "https://junshi.openjianghu.org",
    junshiWebsiteUuid: "XYXOVr_eFenMR6Xi1n9Gt",
    language: 'zh',
    uploadDir,
    uploadDirConfig: [
      "/articleMaterial",
      "/articleMaterial/_recycle",
      "/materialRepo",
      "/materialRepo/_recycle",
      "/materialRepo/attachment",
      "/materialRepo/image",
      "/materialRepo/audio",
      "/materialRepo/video",
      "/seoResource/image",
    ],
    materialRepoDir: path.join(uploadDir, "materialRepo"),
    articleMaterialDir: path.join(uploadDir, "articleMaterial"),
    downloadBasePath,
    static: {
      maxAge: 0,
      buffer: false,
      preload: false,
      maxFiles: 0,
      dir: [
        {
          prefix: `/${appId}/public/`,
          dir: path.join(appInfo.baseDir, "app/public"),
        },
        {
          prefix: `/${appId}/public/`,
          dir: path.join(jianghuPath, "app/public"),
        },
      ],
    },
    view: {
      defaultViewEngine: "nunjucks",
      mapping: { ".html": "nunjucks" },
      root: [
        path.join(appInfo.baseDir, "app/view"),
        path.join(jianghuPath, "app/view"),
      ].join(","),
    },

    xfPageRoute: 'enable',
    xfPageRouteMap: {
      'index':        5736, // 首页
      'jianghujs':    5737, // 江湖JS框架
      'app':          5738, // 应用
      'panel':        5739, // 运维
      'concept':      5740, // 软件开发理念
      'digital':      5741, // 数字化方法论
      'r&d':          5742, // 研发
      'p&e':          5743, // 实践和经验
      'about':        5744, // 关于我们

      // 'jh-training': 5719,  // 培训
      // 'jh-template': 5722,  // 脚手架
      // 'jh-app': 5723,       // 应用
    },

    middleware: [ ...middleware, 'webPackage', 'webUserInfo', 'webAuthorization' ],
    ...middlewareMatch,
    // 覆盖 downloadUserInfo，适配 /upload/ 开头的路由
    downloadUserInfo: {
      match(ctx) {
        // url 格式符合 /appId/upload
        return (ctx.request.method === 'GET' || ctx.request.method === 'HEAD')
          && (
            ctx.request.path.startsWith(`/${ctx.app.config.appId}/upload/`)
            || ctx.request.path.startsWith(`/upload/`));
      },
    },
    onerror: {
      html(error, ctx) {
        const appId = ctx.app.config.appId
        ctx.app.logger.error("[config.default.js] onerror html:", error);
        const { errorCode, errorReason } = error;
        ctx.redirect(`/${appId}/index?errorCode=${errorCode}&errorReason=${errorReason}`);
      },
    },     
    siteFile: {
      "/favicon.ico": fs.readFileSync(
        path.join(__dirname, "../upload/seoResource/image/favicon.ico")
      ),
    },
  };
};
