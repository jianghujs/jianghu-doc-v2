"use strict";

const path = require("path");
const assert = require("assert");

const {
  middleware,
  middlewareMatch,
} = require("@jianghujs/jianghu/config/middlewareConfig");

const jianghuPathTemp = require.resolve('@jianghujs/jianghu');
const jianghuPath = path.join(jianghuPathTemp, "../");

module.exports = (appInfo) => {
  assert(appInfo);

  const appId = "jianghu-doc-admin";
  const uploadDir = path.join(appInfo.baseDir, "upload");
  const downloadBasePath = `/${appId}/upload`;

  return {
    appId,
    language: 'zh',
    appTitle: "openjianghu后台管理",
    appLogo: `${appId}/public/img/logo.png`,
    appType: "single",
    appDirectoryLink: "/",
    indexPage: `/${appId}/page/categoryManagement`,
    adminIndex: `/${appId}/page/categoryManagement`,
    loginPage: `/${appId}/page/login`,
    helpPage: `/${appId}/page/help`,
    primaryColor: "#4caf50",
    primaryColorA80: "#EEF7EE",
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
    ],
    materialRepoDir: path.join(uploadDir, "materialRepo"),
    articleMaterialDir: path.join(uploadDir, "articleMaterial"),
    xfPageMaterialDir: path.join(uploadDir, "xfPageMaterial"),
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
    middleware,
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
  };
};
