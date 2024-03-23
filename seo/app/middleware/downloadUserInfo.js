'use strict';

const range = require('koa-range');
const send = require('koa-send');

module.exports = options => {
  return async (ctx, next) => {

    const { config } = ctx.app;

    // 兼容 /upload 开头的配置
    if (ctx.path.startsWith(`/${config.appId}/upload/`)) {
      await send(ctx, ctx.path.replace(`/${config.appId}/upload/`, ''), { root: config.baseDir + '/upload' });
    } else {
      await send(ctx, ctx.path.replace('/upload/', ''), { root: config.baseDir + '/upload' });
    }
    
    return range(ctx, next);
  };
};

