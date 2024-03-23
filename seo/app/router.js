// app/router.js
module.exports = app => {
  const { router, controller, middleware, config } = app;
  
  // 路径页面映射
  // router.get(`/${config.appId}/page/home`, middleware.proxy({}));
  for (const key in config.xfPageRouteMap) {
    router.get(`/${config.appId}/${key}`, controller.xfPage.index);
  }
};