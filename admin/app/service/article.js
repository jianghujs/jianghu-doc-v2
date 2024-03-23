'use strict';
const Service = require('egg').Service;
const { tableEnum, articlePublishStatusEnum } = require("../constant/constant");
const _ = require("lodash");
const path = require("path");
const hljs = require('highlight.js');

// TODO: 封装一下
const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)

const idGenerateUtil = require("@jianghujs/jianghu/app/common/idGenerateUtil");
const validateUtil = require("@jianghujs/jianghu/app/common/validateUtil");
const { BizError, errorInfoEnum } = require("../constant/error");
const fs = require("fs"),
    fsPromises = require("fs").promises,
    rename = fsPromises.rename,
    util = require("util"),
    rimraf = util.promisify(require("rimraf")),
    exists = util.promisify(fs.exists);
const actionDataScheme = Object.freeze({
  deletedArticle: {
    type: "object",
    additionalProperties: true,
    required: ["articleId"],
    properties: {
      articleId: { anyOf: [{ type: "string" }, { type: "number" }] },
    },
  },
  restoreArticle: {
    type: "object",
    additionalProperties: true,
    required: ["articleId"],
    properties: {
      articleId: { anyOf: [{ type: "string" }, { type: "number" }] },
    },
  },
});

class ArticleService extends Service {

  async fillInsertItemParamsBeforeHook() {
    const { userId, username } = this.ctx.userInfo;
    const time = dayjs().format();
    const tableName = "article";
    const columnName = "articleId";
    const articleId = await idGenerateUtil.idPlus({
      knex: this.app.jianghuKnex,
      tableName,
      columnName,
    });
    // 浏览器传过来的时间 要转成 Asia/Shanghai；
    let { articlePublishTime } = this.ctx.request.body.appData.actionData;
    if (articlePublishTime) {
      articlePublishTime = dayjs(articlePublishTime).tz("Asia/Shanghai").format();
    }
    if (!dayjs(articlePublishTime).isValid()) {
      articlePublishTime = dayjs().tz("Asia/Shanghai").format();
    }
    Object.assign(this.ctx.request.body.appData.actionData, {
      articleId,
      articlePublishTime,
      articleCreateTime: time,
      articleCreateUserId: userId,
      articleCreateUsername: username,
      articleUpdateTime: time,
      articleUpdateUserId: userId,
      articleUpdateUsername: username,
    })
  }

  async fillUpdateItemParamsBeforeHook() {
    const { userId, username } = this.ctx.userInfo;
    const time = dayjs().format();
    // 浏览器传过来的时间 要转成 Asia/Shanghai；
    let { articlePublishTime } = this.ctx.request.body.appData.actionData;
    if (articlePublishTime) {
      articlePublishTime = dayjs(articlePublishTime).tz("Asia/Shanghai").format();
    }
    if (!dayjs(articlePublishTime).isValid()) {
      articlePublishTime = dayjs().tz("Asia/Shanghai").format();
    }
    Object.assign(this.ctx.request.body.appData.actionData, {
      articlePublishTime,
      articleUpdateTime: time,
      articleUpdateUserId: userId,
      articleUpdateUsername: username,
    })
  }

  async articleHistoryRecordAfterHook() {
    const { articleId } = this.ctx.request.body.appData.actionData;
    if (articleId) {
      // 保存新版本
      const {id, ...history} = this.ctx.request.body.appData.actionData;
      await this.app.jianghuKnex(tableEnum.article_history).insert(history);
    }
  }

  async deletedArticle() {
    const { jianghuKnex } = this.app;
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.deletedArticle, actionData);
    const { articleId } = actionData;
    const { articleMaterialDir } = this.app.config;

    await jianghuKnex(tableEnum.article, this.ctx).where({ articleId }).update({ articlePublishStatus: articlePublishStatusEnum.deleted });

    const articleDirPath = path.join(articleMaterialDir, `${articleId}`);
    const articleRecycleDirPath = path.join(articleMaterialDir, '_recycle', `${articleId}`);
    if (!await exists(articleDirPath)) {
        return;
    }
    if (await exists(articleRecycleDirPath)) {
      await rimraf(articleRecycleDirPath);
    }
    await rename(articleDirPath, articleRecycleDirPath)
  }

  async restoreArticle() {
    const { jianghuKnex } = this.app;
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.restoreArticle, actionData);
    const { articleId } = actionData;
    const { articleMaterialDir } = this.app.config;

    await jianghuKnex(tableEnum.article, this.ctx).where({ articleId }).update({ articlePublishStatus: articlePublishStatusEnum.login });

    const articleDirPath = path.join(articleMaterialDir, `${articleId}`);
    const articleRecycleDirPath = path.join(articleMaterialDir, '_recycle', `${articleId}`);
    if (!await exists(articleRecycleDirPath) || await exists(articleDirPath)) {
        return;
    }
    await rename(articleRecycleDirPath, articleDirPath);
  }

  async getArticleAndFillArticles() {
    const { ctx, app } = this;
    const { jianghuKnex } = app;
    const articleId = ctx.pathParams && ctx.pathParams[0]
      || this.ctx.request.body.appData.actionData.articleId;
    const article = await jianghuKnex(tableEnum.article)
      .where({ articleId })
      .first();
    if (!article) {
      throw new BizError(errorInfoEnum.article_not_found)
    }
    if(ctx.originalUrl.includes('/page/article/')) {
      if(!_.isEmpty(article.articleContentForSeo)) {
        article.articleContentForSeo = await this.service.articleParser.parseJhTags(article.articleContentForSeo);
      }
    }

    const { categoryId } = article;
    let articlelist = await jianghuKnex(tableEnum.view01_article)
      .where({
        categoryId,
      })
      .select();
    articlelist = articlelist.map(
      ({
        articleId,
        articleTitle,
        categoryId,
        categoryName,
        articleCoverImage,
        articlePublishStatus,
        articleGroupName,
      }) => {
        return {
          articleId,
          articleTitle,
          categoryId,
          categoryName,
          articleCoverImage,
          articlePublishStatus,
          articleGroupName,
        };
      }
    );
    const groupNameArticlelist = articlelist.filter(({ articleGroupName }) => !!articleGroupName);
    const noGroupNameArticlelist = articlelist.filter(
      ({ articleGroupName }) => !articleGroupName
    );
    const groupByArticleMap = _.groupBy(groupNameArticlelist, "articleGroupName");
    const hasGroupNameArticlelist = Object.values(groupByArticleMap).map(list => {
      const { articleGroupName } = list[0];
      return {
        articleTitle: articleGroupName,
        isGroup: true,
        childrenList: list,
      };
    });
    let newArticleList = hasGroupNameArticlelist.concat(noGroupNameArticlelist);
    newArticleList = _.orderBy(
      newArticleList,
      ["articleTitle"],
      ["asc"]
    );
    article.articleList = newArticleList;
    // 全部替换 __appId__
    article.articleContentForSeo = (article.articleContentForSeo || '').replace(/__appId__/g, app.config.appId);
    article.articleContentForSeoByCodeView = await this.parseSeo(article.articleContentForSeo);
    return article;
  }
  async parseSeo(sontentForSeo) {
    if (!sontentForSeo) return sontentForSeo;
    let content = _.cloneDeep(sontentForSeo);
    const codeTagList = content.match(/\[jh-code-view(\s+\w+="[^"]*")*\s*\/\]/g);
    if (!codeTagList) return sontentForSeo;
    const codeIdList = [];
    for (const item of codeTagList) {
      const params = this.extractedParams(item);
      if (params.id) {
        codeIdList.push(params.id);
      }
    }
    const codeViewData = await this.app.jianghuKnex('code_view').whereIn('codeId', codeIdList).select();
    const codeViewDataMap = _.keyBy(codeViewData, 'codeId');
    for (const item of codeTagList) {
      const params = this.extractedParams(item);
      const code = codeViewDataMap[params.id] || 'empty';
      const codeView = this.markdownToHtml(code.language, code.codeContent, code.codeId);
      // console.log('str', item);
      content = content.replace(item, codeView);
      // console.log('content', content);
    }
    return content;
  }

  extractedParams(item) {
    const attrRegex = /(\w+)=["']([^"]*)["']/g;
    const attrs = {};
    let attrMatch;
    while (attrMatch = attrRegex.exec(item)) {
      const [, attr, value] = attrMatch;
      attrs[attr] = value;
    }
    return attrs;
  }
  markdownToHtml(language, code, codeId) {
    const { ctx, app} = this;
    // 如果指定了语言，则在pre标签中添加class属性
    let str = ``;
    if (language) {
      str += '<pre style="margin-bottom: 2px; padding: 10px" class="pa-3 language-' + language + '"><code class="language-' + language + '">' + code + '</code></pre>';
    } else {
      str += '<pre style="margin-bottom: 2px; padding: 10px" class="pa-3"><code>' + code + '</code></pre>';
    }
    // str += '<pre style="margin-bottom: 2px" class="pa-3">' + hljs.highlight(language, code).value + '</pre>';
    return str + `<a role="button" href="/${app.config.appId}/page/test/HTMLPlayground?code=${codeId}"
    class="jianghu-home-hero-button try-btn">尝试一下<i class="fas fa-arrow-right jianghu-home-hero-icon-right"></i></a>`;
  }
}

module.exports = ArticleService;
