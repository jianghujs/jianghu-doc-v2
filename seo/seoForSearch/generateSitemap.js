const { SitemapStream, streamToPromise } = require( 'sitemap' )
const { Readable } = require( 'stream' )
const fs = require('fs');
const pd = require('pretty-data').pd;

// An array with your links
const links = [
    { url: '/',               changefreq: 'daily', priority: 0.8, lastmod: dayjs().format(),  },
    { url: '/doc/index',      changefreq: 'daily', priority: 0.8, lastmod: dayjs().format(),  },
    { url: '/doc/jianghujs',  changefreq: 'daily', priority: 0.8, lastmod: dayjs().format(),  },
    { url: '/doc/app',        changefreq: 'daily', priority: 0.8, lastmod: dayjs().format(),  },
    { url: '/doc/panel',      changefreq: 'daily', priority: 0.8, lastmod: dayjs().format(),  },
    { url: '/doc/concept',    changefreq: 'daily', priority: 0.8, lastmod: dayjs().format(),  },
    { url: '/doc/digital',    changefreq: 'daily', priority: 0.8, lastmod: dayjs().format(),  },
    { url: '/doc/r&d',        changefreq: 'daily', priority: 0.6, lastmod: dayjs().format(),  },
    { url: '/doc/p&e',        changefreq: 'daily', priority: 0.6, lastmod: dayjs().format(),  },
]

links.push({ url: '/doc/page/article/12052', changefreq: 'daily', priority: 0.5, lastmod: dayjs().format(),  })
links.push({ url: '/doc/page/article/11101', changefreq: 'daily', priority: 0.5, lastmod: dayjs().format(),  })
links.push({ url: '/doc/page/article/11102', changefreq: 'daily', priority: 0.5, lastmod: dayjs().format(),  })
links.push({ url: '/doc/page/article/11104', changefreq: 'daily', priority: 0.5, lastmod: dayjs().format(),  })


// Create a stream to write to
const stream = new SitemapStream( { hostname: 'https://www.openjianghu.org' } )

// Return a promise that resolves with your XML string
return streamToPromise(Readable.from(links).pipe(stream)).then((data) =>{
    data.toString();
    fs.writeFileSync('./seoForSearch/sitemap.xml', pd.xml(data.toString()));
})

// const sm = require('sitemap');
// const fs = require('fs');

// // 定义我们的网站 URL 和其他配置参数
// const sitemap = sm.createSitemap({
//   hostname: 'https://www.openjianghu.org',
//   cacheTime: '60000', // 60 seconds - the period of time the cache will live
// });

// // 添加各个页面到 sitemap
// sitemap.add({url: '/'});
// sitemap.add({url: '/doc/index'});
// sitemap.add({url: '/doc/jianghujs'});
// sitemap.add({url: '/doc/app'});
// sitemap.add({url: '/doc/panel'});
// sitemap.add({url: '/doc/concept'});
// sitemap.add({url: '/doc/digital'});
// sitemap.add({url: '/doc/r&d'});
// sitemap.add({url: '/doc/p&e'});

// // 将 sitemap 转换为 XML
// const xml = sitemap.toString();

// // 将 XML 写入到 sitemap.xml 文件中
// fs.writeFileSync('sitemap.xml', xml);

// console.log('Sitemap created and written to sitemap.xml');
