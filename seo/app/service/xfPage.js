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
    const { ctx, app, config } = this;
    const { jianghuKnex } = app;
    const { user } = ctx.userInfo;
    let xfPageId = (config.indexPage !== `/${config.appId}/page/home`) ? 
          ((ctx.pathParams && ctx.pathParams[0]) || (this.ctx.request.body.appData && this.ctx.request.body.appData.actionData.xfPageId)) : 5719;
    if (!xfPageId) {
      xfPageId = 5719;
    }
    const xfPage = await jianghuKnex(tableEnum.xf_page)
      .where({ xfPageId })
      .first();
    if (!xfPage) {
      throw new BizError(errorInfoEnum.article_not_found);
    }
    xfPage.xfPageConfig = JSON.parse(xfPage.xfPageConfig) || {}
    if (xfPage.template === 'lesson') {
      const categoryIdList = [];
      xfPage.xfPageConfig.forEach(section => {
        section.columnList.forEach(column => {
          column.forEach(block => {
            categoryIdList.push(block.categoryId)
          })
        })
      })
      const categoryList = await jianghuKnex(tableEnum.category).whereIn('categoryId', categoryIdList).select();
      
      const userStatusIsActive = user && user.userId && user.userStatus === 'active';
      const articlePublishStatus = [ 'public', 'login' ];
      // if (userStatusIsActive) {
      //   articlePublishStatus.push('login');
      // }
      let articleList = await jianghuKnex(tableEnum.view01_article).whereIn('categoryId', categoryIdList).whereIn('articlePublishStatus', articlePublishStatus).select();
      articleList = articleList.map(article => {
        const item = {};
        item.articleTitle = article.articleTitle.includes('_') ? article.articleTitle.replace('_', '课-') : article.articleTitle;
        item.articleId = article.articleId;
        item.categoryName = article.categoryName;
        item.categoryId = article.categoryId;
        item.articlePublishStatus = article.articlePublishStatus;
        return item;
      })
      // categoryId articleTitle sort
      articleList = _.sortBy(articleList, ['categoryId', 'articleTitle']);
      const articleByCategory = _.groupBy(articleList, 'categoryId');
      for(const section of xfPage.xfPageConfig) {
        if (section.type === 'sql') {
          section.columnList.forEach(column => {
            column.forEach(block => {
              const category = categoryList.find(category => category.categoryId == block.categoryId);
              block.articleList = articleByCategory[block.categoryId] ? articleByCategory[block.categoryId].map(e => {
                return {
                  articleTitleMap: {
                    prefix: e.articleTitle.includes('课-') ? e.articleTitle.split('课-')[0] + '课' : '',
                    text: e.articleTitle.includes('课-') ? e.articleTitle.split('课-')[1] : e.articleTitle,              
                  },
                  articleTitle: e.articleTitle,
                  articleId: e.articleId,
                  articlePublishStatus: e.articlePublishStatus,
                };
              }) : [];
              block.categoryName = category && category.categoryName || '无标题';
              block.categoryTagList = category && category.categoryTagList ? category.categoryTagList.split(',') : [];
              block.categoryInfo = category;
            })
          });
        }
      }
    } else if (xfPage.template === 'catalog') {
      const { catalog } = xfPage.xfPageConfig;
      if (catalog) {
        xfPage.xfPageConfig.catalog = await this.getEcosystem(catalog);
      }
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

  // 目录页 - 分类 & 文章
  async getEcosystem(config) {
    const { jianghuKnex } = this.app;

    const categoryGroup = config.map(obj => {
      return obj.category === '江湖培训' || obj.category === '江湖脚手架' ? _.map(obj.list, (item) => {
        return _.replace(item, '江湖', '');
      }) : obj.list;
    });
    const categoryGroupFlat = categoryGroup.flat().filter(e => !!e);

    const articleData = await jianghuKnex('view01_article').whereIn('categoryGroup', categoryGroupFlat).orderBy('articleTitle', 'asc').whereIn('articlePublishStatus', ['login', 'public']).select();
    const categoryData = await jianghuKnex('view01_category').whereIn('categoryGroup', categoryGroupFlat).whereIn('categoryPublishStatus', ['login', 'public']).select();

    config.forEach(obj => {
      const list = _.map(obj.list || [], group => {
        let category = _.filter(categoryData, item => {
          return item.categoryName !== '概要' && item.categoryGroup === (obj.category === '江湖培训' || obj.category === '江湖脚手架' ? _.replace(group, '江湖', '') : group)
        });
        category.forEach(e => {
          e.categoryName = e?.categoryName || '';
          e.categoryIntro = e?.categoryIntro || ''
          e.articleList = articleData.filter(article => article.categoryId == e.categoryId).map(e => {
            return {
              articleTitleMap: {
                prefix: e.articleTitle.includes('_') || e.articleTitle.includes('-') ? (e.articleTitle.includes('_') ? e.articleTitle.split('_')[0] + '课' : e.articleTitle.split('-')[0]) : '',
                text: e.articleTitle.includes('_') || e.articleTitle.includes('-') ? (e.articleTitle.includes('_') ? e.articleTitle.split('_')[1] : e.articleTitle.split('-')[1]) : e.articleTitle,    
              },
              articleTitle: e.articleTitle,
              articleId: e.articleId,
              articlePublishStatus: e.articlePublishStatus,
            };
          });
        });

        const categorySort = _.sortBy(category, ['categoryName']);
        return {
          categoryGroup: group,
          label: obj.category === '江湖培训' || obj.category === '江湖脚手架' ? _.replace(group, '江湖', '') : `应用-${group}`,
          categoryList: categorySort
        }
      });
      obj.listData = list;
    });
    
    
    return config;
  }

}

module.exports = xfPageService;
