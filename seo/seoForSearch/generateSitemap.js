const { SitemapStream, streamToPromise } = require( 'sitemap' )
const { Readable } = require( 'stream' )
const fs = require('fs');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../../.env')});
const submenu = require('./seo_ui.submenu.json');
const dayjs = require('dayjs');
const pd = require('pretty-data').pd;
const connection = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_DOC
};


(async () => {
    const knex = require('knex')({ client: 'mysql', connection})
    // An array with your links
    const links = [
        { url: '/',               changefreq: 'daily', priority: 1, lastmod: dayjs().format(),  },
        { url: '/doc/index',      changefreq: 'daily', priority: 1, lastmod: dayjs().format(),  },
        { url: '/doc/jianghujs',  changefreq: 'daily', priority: 1, lastmod: dayjs().format(),  },
        { url: '/doc/app',        changefreq: 'daily', priority: 0.8, lastmod: dayjs().format(),  },
        { url: '/doc/panel',      changefreq: 'daily', priority: 0.8, lastmod: dayjs().format(),  },
        { url: '/doc/concept',    changefreq: 'daily', priority: 0.8, lastmod: dayjs().format(),  },
        { url: '/doc/digital',    changefreq: 'daily', priority: 0.8, lastmod: dayjs().format(),  },
        { url: '/doc/r&d',        changefreq: 'daily', priority: 0.6, lastmod: dayjs().format(),  },
        { url: '/doc/p&e',        changefreq: 'daily', priority: 0.6, lastmod: dayjs().format(),  },
    ]
    
    for (let key in submenu) {
        submenu[key].forEach(item => {
            if (item.path.includes('xfArticle')) {
                links.push({ url: item.path, changefreq: 'daily', priority: 0.7, lastmod: dayjs().format(),  })
            }
        })
    }
    const articleList = await knex('view01_article').where({ articlePublishStatus: 'public', categoryPublishStatus: 'public' }).select();
    articleList.forEach(article => {
        links.push({ url: `/doc/page/article/${article.articleId}`, changefreq: 'daily', 
            priority: 0.4, lastmod: dayjs().format(),  })
    })
    const stream = new SitemapStream( { hostname: 'https://www.openjianghu.org' } )
    const data = await streamToPromise(Readable.from(links).pipe(stream));
    fs.writeFileSync('./seoForSearch/sitemap.xml', pd.xml(data.toString()));
    console.log(links.map(link => link.url).join('\n'));
    console.log('Sitemap generate finished!')
})();

