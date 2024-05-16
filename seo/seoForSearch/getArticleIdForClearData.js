const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../../.env')});
const fs = require('fs');
const _ = require('lodash');
const connection = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_DOC
};


const blockList = require('./jsonData/blockList.json');
const appList = require('./jsonData/appList.json');
const submenu = require('./jsonData/submenu.json');


(async () => {
    const knex = require('knex')({ client: 'mysql', connection})
    // const articleList = await knex('view01_article').where({}).select();

    const xfPageIdList = blockList.map(item => item.xfPageId + '');
    const articleIdList = [];
    const appListAll = _.flatMap(appList, 'appList');
    appListAll.forEach(app => {
        const { url } = app; 
        if (url.startsWith('/doc/page/xfArticle/')){
            const match = url.match(/\d+/);
            const xfPageId = match[0];
            xfPageIdList.push(xfPageId);
        }
        if (url.startsWith('/doc/page/article/')){
            const match = url.match(/\d+/);
            const articleId = match[0];
            articleIdList.push(articleId);
        }
    });
    for (let key in submenu) {
        const itemList = submenu[key];
        itemList.forEach(item => {
            const { path } = item; 
            if (path.startsWith('/doc/page/xfArticle/')){
                const match = path.match(/\d+/);
                const xfPageId = match[0];
                xfPageIdList.push(xfPageId);
            }
            if (path.startsWith('/doc/page/article/')){
                const match = path.match(/\d+/);
                const articleId = match[0];
                articleIdList.push(articleId);
            }
        })
    }

    for (let key in submenu) {
        const itemList = submenu[key];
        if (key.startsWith("应用_")) {
            const app = appListAll.find(app => `应用_${app.title}` === key);
            if (!app) {
                console.log("submenu中多余的项    ", key);
            }
        }
    }

    console.log('xfPageIdList: ', xfPageIdList);
    console.log('articleIdList: ', articleIdList);
    console.log('allCategoryId: ', `select categoryId from xf_page where xfPageId in (${xfPageIdList.join(',')}) union
                                    select categoryId from article where articleId in (${articleIdList.join(',')})`);
    console.log('Clear data finished!')
})();