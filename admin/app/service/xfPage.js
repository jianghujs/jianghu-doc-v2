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

}

module.exports = xfPageService;
