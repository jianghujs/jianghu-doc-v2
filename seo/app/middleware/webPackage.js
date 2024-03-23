'use strict';

const { tableEnum } = require('../constant/constant');

module.exports = () => {
  return async (ctx, next) => {
    if (ctx.app.config.xfPageRoute !== 'enable') {
      await next();
      return;
    }

    const { logger, jianghuKnex } = ctx.app;
    const path = ctx.request.path;

    // 跳过框架默认的路由
    const defaultSysNext = [
      `/${ctx.app.config.appId}/page/`, `/${ctx.app.config.appId}/upload/`, `/${ctx.app.config.appId}/public/`
    ]
    if (defaultSysNext.some(e => path.includes(e)) ) {
      await next();
      return;
    }
    
    // 验证是否 xfArticle 路由
    let pageId = ctx.request.path.replace(`/${ctx.app.config.appId}/`, '');
    // pageId = pageId === '/' ? 'jh-training' : pageId;
    const pageObj = ctx.app.config.xfPageRouteMap; // { xxx: 5719, xxxx: 5719, ...}
    if (!pageObj[pageId]) {
      await next();
      return;
    }
    // 尝试获取全路径
    let page = null;

    // 并将 xfArticleId 放到 ctx.pathParams 中
    if (!pageId.includes('/')) {
      page = await jianghuKnex(tableEnum._page).where({ pageId: 'xfArticle' }).first();
      if (page && page.pageType === 'seo') {
        ctx.pathParams = [pageObj[pageId]]; // [5719]
      }
    }

    if (!page) {
      page = await jianghuKnex(tableEnum._page).where({ pageId }).first();
    }

    ctx.packagePage = page;
    if (!ctx.packagePage) {
      logger.error(`[page not found error], url: ${ctx.request.url}`);
      ctx.redirect(ctx.app.config.helpPage);
      return;
    }

    await next();
  };
};

