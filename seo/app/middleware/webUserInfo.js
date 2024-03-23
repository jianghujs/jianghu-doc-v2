'use strict';

const userInfoUtil = require('@jianghujs/jianghu/app/middleware/middlewareUtil/userInfoUtil');

module.exports = options => {
  return async (ctx, next) => {
    const { jianghuKnex, logger, db, config } = ctx.app;
    const { appId, appType } = config;
    const path = ctx.request.path;

    // 跳过框架默认的路由
    const defaultSysNext = [
      `/${ctx.app.config.appId}/page/`, `/${ctx.app.config.appId}/upload/`, `/${ctx.app.config.appId}/public/`
    ]
    if (defaultSysNext.some(e => path.includes(e)) ) {
      await next();
      return;
    }
    // 由于 userInfoUtil 针对的是 post 请求，所以需要构造一个结构一致的 body
    const mockBody = {
      appData: {
        authToken: ctx.cookies.get(`${appId}_authToken`, {
          httpOnly: false,
          signed: false,
        }),
      },
    };

    // 捕获 userInfo: { user, userGroupRoleList, allowPageList, userAppList } 到 ctx.userInfo
    ctx.userInfo = await userInfoUtil.getUserInfo({
      config,
      body: mockBody,
      jianghuKnex,
      db,
      logger,
      appType,
    });
    await next();
  };
};

