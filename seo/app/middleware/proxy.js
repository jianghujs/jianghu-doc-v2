
module.exports = (options) => {
  return async function(ctx, next) {
    const { path } = ctx;
    const appId = ctx.app.config.appId;
    if (path.startsWith(`/${appId}/page/home`)) {
      let target = options.target || `/${appId}/page/xfArticle/5719`;
      // const port = ctx.app.config.env === 'local' ? '8407' : '9407';
      const port = ctx.app.server.address().port;
      if (!target.startsWith('http')) {
        target = 'http://127.0.0.1:' + port + target;
      }
      
      const res = await ctx.curl(target, {
        // 30秒超时
        timeout: 30000,
        // 携带所有header 
        headers: ctx.headers,
      }); // 发送请求获取目标页面的内容
      ctx.type = 'html'; // 设置响应类型为 HTML
      ctx.body = res.data; // 将目标页面的内容返回给客户端
    }
  };
};