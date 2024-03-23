'use strict';
const Service = require('egg').Service;
const { tableEnum } = require("../constant/constant");
const _ = require("lodash");
const path = require("path");

// TODO: 封装一下
const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)
const { BizError, errorInfoEnum } = require("../constant/error");
const actionDataScheme = Object.freeze({
});

class CategoryService extends Service {

  async getCategoryList() {
    const { ctx, app } = this;
    const { jianghuKnex } = app;
    const { keyword } = ctx.request.query;

    let categoryList
    if (keyword) {
      categoryList = await jianghuKnex(tableEnum.view01_category)
        .whereNot('categoryPublishStatus', 'deleted')
        .where('categoryName', 'like', `%${keyword.trim()}%`)
        .orderBy('categoryGroupSort', 'asc')
        .select();
    } else {
      categoryList = await jianghuKnex(tableEnum.view01_category)
        .whereNot('categoryPublishStatus', 'deleted')
        .orderBy('categoryGroupSort', 'asc')
        .select();
    }
    categoryList.forEach(row => {
      const articleIdList = row.articleIdList ? row.articleIdList.split(',') : [];
      const articleTitleList = row.articleIdList ? row.articleTitleList.split(',') : [];
      const articleUpdateTime = row.articleIdList ? row.articleUpdateTimeList.split(',') : [];
      const articleList = [];
      for (let i = 0; i < articleIdList.length; i++) {
        articleList.push({
          articleId: articleIdList[i],
          articleTitle: articleTitleList[i],
          articleUpdateTime: articleUpdateTime[i],
        })
      }
      row.articleList = articleList.slice(0,3);
    });
    return categoryList;
  }

}

module.exports = CategoryService;
