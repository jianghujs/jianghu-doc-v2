'use strict';
const Service = require('egg').Service;
const { tableEnum, xfPagePublishStatusEnum } = require('../constant/constant');
const _ = require('lodash');
const path = require('path');

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone'); // dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);

const idGenerateUtil = require('@jianghujs/jianghu/app/common/idGenerateUtil');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const { BizError, errorInfoEnum } = require('../constant/error');
const fs = require('fs'),
  fsPromises = require('fs').promises,
  rename = fsPromises.rename,
  util = require('util'),
  rimraf = util.promisify(require("rimraf")),
  exists = util.promisify(fs.exists);
const actionDataScheme = Object.freeze({
  deletedXfPage: {
    type: 'object',
    additionalProperties: true,
    required: [ 'xfPageId' ],
    properties: {
      xfPageId: { anyOf: [{ type: 'string' }, { type: 'number' }] },
    },
  },
  restoreXfPage: {
    type: 'object',
    additionalProperties: true,
    required: [ 'xfPageId' ],
    properties: {
      xfPageId: { anyOf: [{ type: 'string' }, { type: 'number' }] },
    },
  },
});

class xfPageService extends Service {

  async fillInsertItemParamsBeforeHook() {
    const { userId, username } = this.ctx.userInfo;
    const time = dayjs().format();
    const tableName = 'xf_page';
    const columnName = 'xfPageId';
    const xfPageId = await idGenerateUtil.idPlus({
      knex: this.app.jianghuKnex,
      tableName,
      columnName,
    });
    // 浏览器传过来的时间 要转成 Asia/Shanghai；
    let { xfPagePublishTime } = this.ctx.request.body.appData.actionData;
    if (xfPagePublishTime) {
      xfPagePublishTime = dayjs(xfPagePublishTime).tz('Asia/Shanghai').format();
    }
    if (!dayjs(xfPagePublishTime).isValid()) {
      xfPagePublishTime = dayjs().tz('Asia/Shanghai').format();
    }
    Object.assign(this.ctx.request.body.appData.actionData, {
      xfPageId,
      xfPagePublishTime,
      xfPageCreateTime: time,
      xfPageCreateUserId: userId,
      xfPageCreateUsername: username,
      xfPageUpdateTime: time,
      xfPageUpdateUserId: userId,
      xfPageUpdateUsername: username,
    });
  }

  async fillUpdateItemParamsBeforeHook() {
    const { userId, username } = this.ctx.userInfo;
    const time = dayjs().format();
    // 浏览器传过来的时间 要转成 Asia/Shanghai；
    let { xfPagePublishTime } = this.ctx.request.body.appData.actionData;
    if (xfPagePublishTime) {
      xfPagePublishTime = dayjs(xfPagePublishTime).tz('Asia/Shanghai').format();
    }
    if (!dayjs(xfPagePublishTime).isValid()) {
      xfPagePublishTime = dayjs().tz('Asia/Shanghai').format();
    }
    Object.assign(this.ctx.request.body.appData.actionData, {
      xfPagePublishTime,
      xfPageUpdateTime: time,
      xfPageUpdateUserId: userId,
      xfPageUpdateUsername: username,
    });
  }

  async xfPageHistoryRecordAfterHook() {
    const { xfPageId } = this.ctx.request.body.appData.actionData;
    if (xfPageId) {
      // 保存新版本
      const { id, ...history } = this.ctx.request.body.appData.actionData;
      await this.app.jianghuKnex(tableEnum.xf_page_history).insert(history);
    }
  }

  async deletedXfPage() {
    const { jianghuKnex } = this.app;
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.deletedXfPage, actionData);
    const { xfPageId } = actionData;
    const { xfPageMaterialDir } = this.app.config;

    await jianghuKnex(tableEnum.xf_page, this.ctx).where({ xfPageId }).update({ xfPagePublishStatus: xfPagePublishStatusEnum.deleted });

    const xfPageDirPath = path.join(xfPageMaterialDir, `${xfPageId}`);
    await this.ctx.helper.dirExists(path.join(xfPageMaterialDir, '_recycle'));
    const xfPageRecycleDirPath = path.join(xfPageMaterialDir, '_recycle', `${xfPageId}`);
    if (!await exists(xfPageDirPath)) {
      return;
    }
    if (await exists(xfPageRecycleDirPath)) {
      await rimraf(articleRecycleDirPath);
    }
    await rename(xfPageDirPath, xfPageRecycleDirPath);
  }

  async restoreXfPage() {
    const { jianghuKnex } = this.app;
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.restoreXfPage, actionData);
    const { xfPageId } = actionData;
    const { xfPageMaterialDir } = this.app.config;

    await jianghuKnex(tableEnum.xf_page, this.ctx).where({ xfPageId }).update({ xfPagePublishStatus: xfPagePublishStatusEnum.login });

    const xfPageDirPath = path.join(xfPageMaterialDir, `${xfPageId}`);
    const xfPageRecycleDirPath = path.join(xfPageMaterialDir, '_recycle', `${xfPageId}`);
    if (!await exists(xfPageRecycleDirPath) || await exists(xfPageDirPath)) {
      return;
    }
    await rename(xfPageRecycleDirPath, xfPageDirPath);
  }

  async getXfPageAndFillArticles() {
    const { ctx, app } = this;
    const { jianghuKnex } = app;
    const xfPageId = ctx.pathParams && ctx.pathParams[0]
      || this.ctx.request.body.appData.actionData.xfPageId;
    const xfPage = await jianghuKnex(tableEnum.xf_page)
      .where({ xfPageId })
      .first();
    if (!xfPage) {
      throw new BizError(errorInfoEnum.article_not_found);
    }

    let xfPageList = await jianghuKnex(tableEnum.xf_page)
      .select();
    xfPageList = xfPageList.map(
      ({
        xfPageId,
        xfPageTitle,
        xfPageCoverImage,
        xfPagePublishStatus,
        xfPageGroupName,
      }) => {
        return {
          xfPageId,
          xfPageTitle,
          xfPageCoverImage,
          xfPagePublishStatus,
          xfPageGroupName,
        };
      }
    );
    xfPage.xfPageList = xfPageList;
    return xfPage;
  }

  async autoCreateItem({appTitle, appType, appDesc, copyAppId}) {
    const { jianghuKnex } = this.app;
    const constantUi = await jianghuKnex('seo_ui')
      .where({ constantKey: 'submenu' })
      .first();
    const language = this.app.config.language;
    constantUi[language] = JSON.parse(constantUi[language]);

    const xfPage = await jianghuKnex('xf_page')
      .where({ xfPageId: 5738 })
      .first();

    const copyPage = await jianghuKnex('xf_page')
      .where({ xfPageTitle: '应用_' + copyAppId })
      .first();

    if (!copyPage) {
      throw new BizError(errorInfoEnum.xf_page_not_found);
    }
    xfPage.xfPageConfig = JSON.parse(xfPage.xfPageConfig);

    await jianghuKnex.transaction(async (trx) => {
      // 1. 创建xfpage
      delete copyPage.id;
      copyPage.xfPageConfig = JSON.parse(copyPage.xfPageConfig);
      copyPage.xfPageConfig.body.title = appTitle;

      copyPage.xfPageConfig = JSON.stringify(copyPage.xfPageConfig);
      this.ctx.request.body.appData.actionData = { ...copyPage, xfPageTitle: '应用_' + appTitle };
      await this.fillInsertItemParamsBeforeHook();
      const xfPageInsertData  = this.ctx.request.body.appData.actionData;

      // 2. 更新xfpage
      const { xfPageId } = this.ctx.request.body.appData.actionData;
      xfPage.xfPageConfig.appList.push({
        title: appTitle,
        desc: appDesc,
        type: appType,
        tags: [],
        cover: "https://demo.jianghujs.org/jianghu-doc-v2-admin/upload/materialRepo/image/app演示图.PNG",
        "url": "/jianghu-doc-v2-seo/page/xfArticle/" + xfPageId,
      });
      await trx('xf_page')
        .where({ xfPageId: 5738 })
        .update({ xfPageConfig: JSON.stringify(xfPage.xfPageConfig) });

      // 3. 二级菜单增加应用
      const copyConstantUi = constantUi[language]['应用_' + copyAppId];
      constantUi[language]['应用_' + appTitle] = _.cloneDeep(copyConstantUi);

      const maxArticleId = await jianghuKnex('article').max('articleId as max').first();
      const maxCategoryId = await jianghuKnex('category').max('categoryId as max').first();
      let articleMaxId = maxArticleId.max + 1;
      let categoryMaxId = maxCategoryId.max + 1;
      for (const item of constantUi[language]['应用_' + appTitle]) {
        if ((item.categoryName || '').includes('介绍')) {
          item.categoryName = appTitle + '介绍';
          // 添加 category
          await this.createCategory(trx, { categoryId: categoryMaxId, categoryName: appTitle + '介绍', categoryGroup: '应用_' + appTitle });
          await trx('xf_page').insert({ ...xfPageInsertData, categoryId: categoryMaxId });
          item.path = "/jianghu-doc-v2-seo/page/xfArticle/" + xfPageId;
          categoryMaxId++;
        }
        if (item.categoryName === '培训') {
          const categoryName = appTitle + '培训';
          item.categoryName = categoryName;

          // 添加目录文章
          const articleId = item.path.split('/').pop();
          const articleList = await this.articleIdToCategoryArticleList(articleId);
          // 创建 category
          await this.createCategory(trx, { categoryId: categoryMaxId, categoryName, categoryGroup: '应用_' + appTitle });

          item.path = "/jianghu-doc-v2-seo/page/article/" + articleMaxId;
          for (const articleTitle of ['_00_目录']) {
            // 创建 article
            const content = `## 目录
              
            [jh-article-query]
            {
             "tableName": "article",
             "where": "where categoryId = ${categoryMaxId}",
             "queryType": "order",
             "orderBy": "order by articleTitle asc",
             "limit": 20
            }
            [/jh-article-query]
                          `;
            await this.createArticle(trx, { 
              articleTitle: `_00_目录【应用_${appTitle}】`,
              categoryId: categoryMaxId, 
              articleId: articleMaxId,
              articleContent: `## 目录
              
              [jh-article-query]
              {
               "tableName": "article",
               "where": "where categoryId = ${categoryMaxId}",
               "queryType": "order",
               "orderBy": "order by articleTitle asc",
               "limit": 20
              }
              [/jh-article-query]
                            `,
              articleContentForSeo: `<h2 id="h2-u76EEu5F55"><a class="reference-link" name="目录"></a><span class="header-link octicon octicon-link"></span>目录</h2>
              [jh-article-query]
              {
               "tableName": "article",
               "where": "where categoryId = ${categoryMaxId}",
               "queryType": "order",
               "orderBy": "order by articleTitle asc",
               "limit": 20
              }
              [/jh-article-query]
                            `
            });
            articleMaxId++;
            await this.createArticle(trx, { 
              articleTitle: `_01_第一步`,
              articleGroupName: `_01_操作`,
              categoryId: categoryMaxId, 
              articleId: articleMaxId,
              articleContent: '',
              articleContentForSeo: ''
            });
            articleMaxId++;
            await this.createArticle(trx, { 
              articleTitle: `_02_第二步`,
              articleGroupName: `_01_操作`,
              categoryId: categoryMaxId, 
              articleId: articleMaxId,
              articleContent: '',
              articleContentForSeo: ''
            });
            articleMaxId++;
          }

          categoryMaxId++;
        }
        if (item.categoryName == '文档'){
          const categoryName = appTitle + '文档';
          item.categoryName = categoryName;
          // 添加目录文章
          const articleId = item.path.split('/').pop();
          const articleList = await this.articleIdToCategoryArticleList(articleId);
          // 创建 category
          await this.createCategory(trx, { categoryId: categoryMaxId, categoryName, categoryGroup: '应用_' + appTitle });

          item.path = "/jianghu-doc-v2-seo/page/article/" + articleMaxId;
          for (const art of articleList) {
            // 创建 article
            await this.createArticle(trx, { ...art, categoryId: categoryMaxId, articleId: articleMaxId });
            articleMaxId++;
          }
          categoryMaxId++;
        }
      }
      // 保存 constantUi[language]
      await trx('seo_ui')
        .where({ constantKey: 'submenu' })
        .update({ [language]: JSON.stringify(constantUi[language]) });

    });
    
  }

  async articleIdToCategoryArticleList(articleId) {
    const { jianghuKnex } = this.app;
    const article = await jianghuKnex('article').where({ articleId }).first();
    if (!article) {
      return [];
    }
    const articleList = await jianghuKnex('article').where({ categoryId: article.categoryId }).orderBy('articleTitle', 'asc').select();
    return articleList;
  }

  async createCategory(trx, { categoryId, categoryName, categoryGroup }) {
    await trx('category').insert({ categoryId, categoryName, categoryGroup, categoryPublishStatus: 'public' });
  }

  async createArticle(trx, { articleId, articleTitle, articleContent, categoryId, articleContentForSeo, articleGroupName = ''}) {
    const articlePublishStatus = 'public';
    const articlePublishTime = dayjs().format();
    await trx('article').insert({ articleId, articleTitle, articleContent, articleContentForSeo, categoryId, articlePublishStatus, articlePublishTime, articleGroupName });
    articleId++;
  }

}

module.exports = xfPageService;
