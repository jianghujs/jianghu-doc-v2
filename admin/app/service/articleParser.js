'use strict';
const Service = require('egg').Service;
const { tableEnum } = require('../constant/constant');
const _ = require('lodash');
const dayjs = require('dayjs');

class ArticleParserService extends Service {

  /**
   * 格式化替换jh-toggle jh-article-query
   * @param {*} content
   * @returns
   */
  async parseJhTags(content) {
    content = this.parseJhToggle(content);
    content = this.parseJhColumn(content);
    content = await this.parseJhArticleQueryAndFillArticle(content);
    return content;
  }

  getFirstRegMatch(str, pattern) {
    const list = str.replace(/[“”]/g, '"').match(pattern);
    return list && list.length > 1 && list[1];
  }

  /**
   * 查找替换jh-toggle
   * @param {*} content
   * @returns
   */
  parseJhToggle(content) {
    // [jh-toggle title="123" state="hide"] ... [/jh-toggle]
    // 替换头部
    const headReg = /(<\/?p>|<\/?br>|)\[jh-toggle[^\]]*\](<\/?p>|<\/?br>|)/g;
    const headList = content.match(headReg);
    if (headList && headList.length) {
      headList.forEach(head => {
        // 获取 title 和 state
        const title = (this.getFirstRegMatch(head, /title='(.*?)'/) || this.getFirstRegMatch(head, /title="(.*?)"/) || '');
        const state = (this.getFirstRegMatch(head, /state=['"](.*?)['"]/) || 'open');
        const headHtml = `
<div class="toggle tie-sc-${state === 'open' ? 'open' : 'close'}">
    <h3 class="toggle-head">
        ${title}<i class="fa fa-angle-down" aria-hidden="true"></i>
    </h3>
    <div class="toggle-content">`;
        content = content.replace(head, headHtml);
      });
    }
    // 替换尾部
    const tailReg = /(<\/?p>|<\/?br>|)\[\/jh-toggle\](<\/?p>|<\/?br>|)/g;
    const tailList = content.match(tailReg);
    if (tailList && tailList.length) {
      tailList.forEach(tail => {
        const tailHtml = ' </div> </div>';
        content = content.replace(tail, tailHtml);
      });
    }
    return content;
  }

  parseJhColumn(content) {
    // [jh-half-left][/jh-half-left]
    // [jh-half-right][/jh-half-right]
    // 替换头部
    const headReg = /(<\/?p>|<\/?br>|)\[jh-half-(left|right)[^\]]*\](<\/?p>|<\/?br>|)/g;
    const headList = content.match(headReg);
    if (headList && headList.length) {
      headList.forEach(head => {
        let headHtml;
        if (head.includes('jh-half-left')) {
          headHtml = '<div class="jh-half-left toggle-custom-class" style="width:48%; float: left;">';
        } else {
          headHtml = '<div class="jh-half-right toggle-custom-class" style="width:48%; float: right;">';
        }
        content = content.replace(head, headHtml);
      });
    }
    // 替换尾部
    const tailReg = /(<\/?p>|<\/?br>|)\[\/jh-half-(left|right)\](<\/?p>|<\/?br>|)*/g;
    const tailList = content.match(tailReg);
    if (tailList && tailList.length) {
      tailList.forEach(tail => {
        const tailHtml = ' </div>';
        content = content.replace(tail, tailHtml);
      });
    }
    return content;
  }

  /**
   * 查找替换jh-article-query
   * @param {*} content
   * @returns
   */
  async parseJhArticleQueryAndFillArticle(content) {
    // [jh-article-query] { ... } [/jh-article-query]
    // 替换头部
    const path = `/${this.ctx.app.config.appId}/page/article/`
    const qeuryReg = /(<\/?p>|<\/?br>|)\[jh-article-query\][\s\S]*?\[\/jh-article-query\](<\/?p>|<\/?br>|)/g;
    const queryList = content.match(qeuryReg);
    if (queryList && queryList.length) {
      for (const jhQuery of queryList) {
        // 获取 queryJson
        let queryJson = this.getFirstRegMatch(jhQuery, /\[jh-article-query\]([\s\S]*)\[\/jh-article-query\]/) || '';
        if (queryJson) {
          queryJson = queryJson.replace(/(<\/?p>|<\/?br>)/g, '').replace(/[’‘]/g, '\'').replace(/[”“]/g, '"');
          try {
            const articleList = await this.getArticleList(JSON.parse(queryJson));
            const liList = articleList.map(article => {
              return `<li><a href="${path}${article.articleId}">${article.articleTitle}</a></li>`;
            });
            content = content.replace(jhQuery, `<ul class="lcp_catlist">${liList.join('')}</ul>`);
          } catch (error) {
            this.logger.error('Parse jh-article-query error', { queryJson, error });
            content = content.replace(jhQuery, '<\/?p></p>');
          }
        } else {
          content = content.replace(jhQuery, '<\/?p></p>');
        }
      }
    }
    return content;
  }

  /**
   * article query 获取文章列表
   * @param {*} param0
   * @returns
   */
  async getArticleList({
    where = '',
    queryType = 'order', // random order
    orderBy = 'order by id desc',
    limit = 20,
  }) {
    const { jianghuKnex } = this.app;
    const tableName = tableEnum.article;
    if (where) {
      where = where + ` and articlePublishTime < '${ dayjs().format() }' and articlePublishStatus in ("public", "login")`;
    } else {
      where = `where articlePublishTime < '${ dayjs().format() }' and articlePublishStatus in ("public", "login")`;
    }

    if (queryType === 'order') {
      const orderSql = `select * from ${tableName} ${where} ${orderBy} limit ${limit}`;
      const rows = (await jianghuKnex.raw(orderSql))[0];
      return rows;
    }

    if (queryType === 'random') {
      const randomAllIdSql = `select id from ${tableName} ${where}`;
      const allIdList = (await jianghuKnex.raw(randomAllIdSql))[0].map(
        row => row.id
      );
      const idList = _.sampleSize(allIdList, limit);
      if (idList.length === 0) {
        return [];
      }
      const randomSql = `select * from ${tableName} ${where} and id in (${idList})`;
      const rows = (await jianghuKnex.raw(randomSql))[0];
      return rows;
    }

    return [];
  }

}

module.exports = ArticleParserService;
