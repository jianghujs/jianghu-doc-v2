'use strict';

const { userStatusEnum, tableEnum } = require('../constant/constant');
const { errorInfoEnum } = require('../constant/error');

module.exports = option => {
  return async (ctx, next) => {
    if (ctx.app.config.xfPageRoute !== 'enable') {
      await next();
      return;
    }
    const path = ctx.request.path;

    // 跳过框架默认的路由
    const defaultSysNext = [
      `/${ctx.app.config.appId}/page/`, `/${ctx.app.config.appId}/upload/`, `/${ctx.app.config.appId}/public/`
    ]
    if (defaultSysNext.some(e => path.includes(e)) ) {
      await next();
      return;
    }

    const { packagePage, userInfo } = ctx;
    const { user, userAppList, allowPageList } = userInfo;
    if(!packagePage) {
      await next();
      return;
    }
    const { pageId } = packagePage;
    const isLoginUser = user && user.userId;
    const { config, jianghuKnex } = ctx.app;
    const { appType, appId } = config;
    // 对于 public page ====》不需要做 用户状态的校验
    // public: { user: "*", group: "public", role: "*" }
    const allUserGroupRolePageList = await jianghuKnex(
      tableEnum._user_group_role_page
    ).select();
    const isNotPublic = !allUserGroupRolePageList.find(
      (rule) =>
        rule.group === "public" && rule.role === "*" && rule.page === pageId
    );
    const { originalUrl } = ctx.request;
    const originalUrlEncode = encodeURIComponent(originalUrl);

    const goToErrorPage = ({ isLoginUser, error }) => {
      if (!isLoginUser) {
        ctx.redirect(
          ctx.app.config.loginPage + `?redirectUrl=${originalUrlEncode}`
        );
      } else {
        const { errorCode, errorReason } = error;
        ctx.redirect(
          `${ctx.app.config.helpPage}?errorCode=${errorCode}&errorReason=${errorReason}`
        );
      }
    };

    // 1. 判断用户是否有当前app的权限
    if (appType === "multiApp") {
      const targetUserApp =
        userAppList && userAppList.find((x) => x.appId === appId);
      if (isNotPublic && !targetUserApp) {
        const { errorCode, errorReason } = errorInfoEnum.request_app_forbidden;
        ctx.redirect(
          `${ctx.app.config.loginPage}?errorCode=${errorCode}&errorReason=${errorReason}`
        );
        return;
      }
    }

    // 2 判断用户状态
    if (isNotPublic && isLoginUser) {
      const { userStatus } = user;
      if (userStatus === userStatusEnum.banned) {
        goToErrorPage({ isLoginUser, error: errorInfoEnum.user_banned });
        return;
      }
      if (userStatus !== userStatusEnum.active) {
        goToErrorPage({ isLoginUser, error: errorInfoEnum.user_status_error });
        return;
      }
    }

    // 3. 判断用户是否有 当前 packagePage 的权限
    if (!allowPageList.some((x) => x.pageId === pageId)) {
      goToErrorPage({ isLoginUser, error: errorInfoEnum.page_forbidden });
      return;
    }

    // 4. 已登录 则重定向到首页
    if (pageId === "login" && isLoginUser) {
      ctx.redirect(ctx.app.config.indexPage);
    }
    await next();
  };
};

