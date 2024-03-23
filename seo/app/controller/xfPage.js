'use strict';

const Controller = require('egg').Controller;

class XfPageController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.userId = this.ctx.userInfo.userId;
  }
  async index() {
    const app = this.app;

    const configs = {
      xfPage: await this.ctx.service.xfPage.getXfPageAndFillArticles(),
      constantUiMap: await this.ctx.service.constantUi.getConstantUiMap(),
      userInfo: this.ctx.userInfo,
    };

    await this.ctx.render(`page/xfArticle.html`, configs);
  }
}

module.exports = XfPageController;
