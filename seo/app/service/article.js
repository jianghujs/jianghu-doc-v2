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
const hljs = require("highlight.js");

class ArticleService extends Service {

  async getArticleAndFillArticles() {
    const { ctx, app } = this;
    const { user } = ctx.userInfo;
    const userStatusIsActive = user && user.userId && user.userStatus === 'active';
    // 临时代码: 支持docs-scraper可以访问 login文章
    // const userStatusIsActive = true;
    const { jianghuKnex } = app;
    const articleId = ctx.pathParams && ctx.pathParams[0]
      || this.ctx.request.body.appData.actionData.articleId;
    const articleTitleIgnoreReg = /^[0-9]*_/;


    const articlePublishStatus = [ 'public', 'login' ];
    // if (userStatusIsActive) {
    //   articlePublishStatus.push('login');
    // }

    // 文章数据
    const article = await jianghuKnex(tableEnum.view01_article)
      .whereIn('articlePublishStatus', [ 'public', 'login'])
      .whereIn('categoryPublishStatus', [ 'public', 'login'])
      .where({ articleId })
      .first();

    if (!article) {
      throw new BizError(errorInfoEnum.article_not_found);
    }

    if(ctx.originalUrl.includes('/page/article/')) {
      if(!_.isEmpty(article.articleContentForSeo)) {
        article.articleContentForSeo = await this.service.articleParser.parseJhTags(article.articleContentForSeo);
      }
    }


    if(ctx.originalUrl.includes('/page/article2ForPDF/')) {
      if(!_.isEmpty(article.articleContentForSeo)) {
        article.articleContentForSeo = await this.service.articleParser.parseJhTags(article.articleContentForSeo);
      }
    }

    if ((article.articlePublishStatus === 'login' || article.categoryPublishStatus === 'login') && !userStatusIsActive) {
      article.articleContent = "## 无权限访问，请登录后查看";
      article.articleContentForSeo = "<h2>无权限访问，请登录后查看</h2>";
    }

    // 评论
    const commentList = await jianghuKnex(tableEnum.comment) .where({ articleId: article.articleId, }) .select();

    // 该分类/分类分组下的所有文章
    const { categoryId, categoryGroup } = article;
    const whereObj = categoryGroup ? { categoryGroup } : { categoryId };
    let categoryArticleData = await jianghuKnex(tableEnum.view01_article).where(whereObj).whereIn('articlePublishStatus', articlePublishStatus).orderBy('articleSort', 'asc').orderBy('articleTitle', 'asc').select();
    categoryArticleData = _.map(categoryArticleData, item => {
      const { articleTitle } = item;
      let articleTitleShow = articleTitle;
      if (articleTitleShow.startsWith('_')) {
        articleTitleShow = articleTitleShow.replace(/^_[0-9]*_/, "");
      }
      let articleText = articleTitleShow;
      if (articleTitle.startsWith('_')) {
        articleText = articleTitle.replace(/^_[0-9]*_/, "");
      } else if (articleTitle.includes('_')) {
        articleText = '课-' + articleTitle.split('_').pop();
      }
      return {
        ...item,
        articleTitle,
        articleTitleMap: {
          prefix: articleTitle.includes('_') ? articleTitle.split('_')[0] : '',
          text: articleText,
        },
      }
    })
    // 分类列表 - 名称排序
    const keys = _.uniqBy(_.sortBy(categoryArticleData, ['categoryGroupSort']), 'categoryName').map(item => item.categoryName);

    // 处理文章列表数据
    const categoryGroupArticleList = {};
    _.forEach(keys, (key) => {
      const list = categoryArticleData.filter(e => e.categoryName == key);
      // 文章分组
      const noGroupArticle = list.filter(({ articleGroupName }) => !articleGroupName);
      const hasGroupArticle = list.filter(({ articleGroupName }) => !!articleGroupName);
      const hasGroupArticleGroup = _.groupBy(hasGroupArticle, "articleGroupName");
      let groupArticle = Object.values(hasGroupArticleGroup).map(list => {
        const { articleGroupName } = list[0];
        return {
          articleTitle: articleGroupName,
          isGroup: true,
          childrenList: _.sortBy(list, ['articleSort', 'articleTitle']),
        };
      });
      groupArticle = _.orderBy(groupArticle, ['articleSort', 'articleTitle'], ['asc', 'asc']);

      // 将articleTitle上的 "01_" 替换成 ""
      noGroupArticle.forEach(item => {
        item.articleTitle = item.articleTitle.replace(articleTitleIgnoreReg, "");
      });
      groupArticle.forEach(item => {
        item.articleTitle = item.articleTitle.replace(articleTitleIgnoreReg, "");
        item.childrenList.forEach(children => {
          children.articleTitle = children.articleTitle.replace(articleTitleIgnoreReg, "");
        })
      });

      categoryGroupArticleList[key] = { categoryName: list[0]['categoryName'], articleList: noGroupArticle.concat(groupArticle) };
    });

    // 处理文章数据
    article.articleTitle = article.articleTitle.replace(/^_?[0-9]*_/, "");
    article.articleList = categoryGroupArticleList;
    article.categoryGroupArticleList = categoryGroupArticleList;
    article.commentList = commentList;
    article.articleContentForSeo = (article.articleContentForSeo || '').replace(/__appId__/g, app.config.appId);
    // 把articleContentForSeo里的<a>标签都以新页面的方式打开，添加上target="_blank"
    // 如果a标签href是#id的锚点，则不添加target="_blank"
    article.articleContentForSeo = article.articleContentForSeo.replace(/<a\s+([^>]*?)href="([^"]*?)"([^>]*?)>/g, (match, p1, p2, p3) => {
        if (p2.startsWith('#')) {
            return `<a ${p1} href="${p2}" ${p3}>`;
        }
        return `<a ${p1} href="${p2}" target="_blank" ${p3}>`;
    });

    article.articleContentForSeoByCodeView = await this.parseSeo(article.articleContentForSeo);
    // 一二级标题判断
    article.hasOutline = /^#{1,2} .*/.test(article.articleContent);

    // 处理目录数据
    const constantUiMap = await this.service.constantUi.getConstantUiMap();
    article.sideMenu = constantUiMap.submenu[article.categoryGroup] ? _.pick(article.categoryGroupArticleList, [article.categoryName]) : article.categoryGroupArticleList;

    return article;
  }
  async parseSeo2(sontentForSeo) {
    if (!sontentForSeo) return sontentForSeo;
    let content = _.cloneDeep(sontentForSeo);
    // 取content中[jh-code-view type="html"]标签
    const articleQueryTagList = content.match(/\[jh-code-view(\s+\w+="[^"]*")*\s*\]([\s\S]*?)\[\/jh-code-view\]/g);
    if (!articleQueryTagList) return sontentForSeo;


    //遍历articleQueryTagList，取出type和content, type是在jh-code-view标签中的type属性，content是在[jh-code-view]和[/jh-code-view]之间的内容
    for (let item of articleQueryTagList) {

      const params = this.extractedParams(item);
      const { type } = params;
      let codeContent = item.match(/\[jh-code-view(\s+\w+="[^"]*")*\s*\]([\s\S]*?)\[\/jh-code-view\]/)[2];
      // 将codeContent中的&gt;和&lt;转义回来
      codeContent = codeContent.replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<')
          .replace(/<br>/g, '')
          .replace(/<p><\/p>/g, '');

      // loadsh随机生成一个codeId
      const codeId = _.uniqueId('codeId_');
      const codeView = this.markdownToHtml(type, codeContent, codeId);

      content = content.replace(item, codeView);
    }
    return content;
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
    // code 原样转义


    let palyGroundType = 'HTMLPlayground';
    if (language === 'javascript') {
      palyGroundType = 'JavaScriptPlayground';
    }
    return `
      <div class="card">
        <div class="card-header d-flex">
          <div class="flex-grow-1">
          </div>
          <div>
            <v-btn
              icon
              color="pink"
              title="尝试一下"
            >
              <a target="_blank" href="/${app.config.appId}/page/test/${palyGroundType}?code=${codeId}"><v-icon>mdi-codepen</v-icon></a>
            </v-btn>
            <v-btn
              icon
              color="pink"
              type="button"
              title="查看代码"
              data-mdb-toggle="collapse" data-mdb-target="#collapseExample${codeId}" aria-expanded="false" aria-controls="collapseExample"
            >
              <v-icon>mdi-code-tags </v-icon>
            </v-btn>
          </div>
        </div>
        <div class="card-body">
        ${code}
        </div>
        <div class="card-footer text-muted collapse" id="collapseExample${codeId}">
          ${this.codeToMdHtml(code, language)}
        </div>
      </div>
    `;
  }
  codeToMdHtml(code, language = "html") {
    const validLanguage = hljs.getLanguage(language) ? language : "plaintext";
    const highlighted = hljs.highlight(validLanguage, code).value;
    const lines = highlighted.split("\n").map((line, i) => {
      return `<li class="code-line">${line}</li>`;
    }).join("");
    return `<div class="code-block"><pre><code class="language-${validLanguage}"><ol class="code-list">${lines}</ol></code></pre></div>`;
  }

}

module.exports = ArticleService;
