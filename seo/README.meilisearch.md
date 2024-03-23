# meilisearch

## meilisearch 服务器搭建

- 创建 `/xxx/meilisearch/docker-compose.yml`
    ```bash
    version: "3"
    services:
        meilisearch:
            image: getmeili/meilisearch:v0.27.1
            container_name: meilisearch
            restart: always
            volumes:
                - /xxx/meilisearch/meili_data:/meili_data
            ports:
                - "7700:7700"
            command: "/bin/meilisearch --master-key='123456'"
    ```
    > 进入容器:`docker exec -it --user root meilisearch /bin/bash`

- 启动/停止
    ```bash
    cd /xxx/meilisearch
    # 启动
    docker-compose up -d
    # 停止
    docker-compose down -v
    # 浏览器访问 http://127.0.0.1:7700  密码: 123456
    ```

- nginx配置
    ```config
        location / {
            proxy_pass http://127.0.0.1:7700;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header REMOTE-HOST $remote_addr;

            # wss 支持
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    ```



## 爬取seo的文章到meilisearch

> 注意: 最好使用python3.8--python3.9
```bash
cd ./meilisearchScript
pip install pipenv
# 在项目目录安装虚拟环境
export PIPENV_VENV_IN_PROJECT=True
pipenv install
# 拷贝 配置文件 并配置参数
cp example.env .env
cp example.scraper_seo_article_all.json scraper_seo_article_all.json 
cp example.scraper_seo_article_public.json scraper_seo_article_public.json
# 依次执行这四个脚本
pipenv run ./scraper_seo_article_public
pipenv run ./scraper_seo_article_all
```

## meilisearchUtil

- 创建一个只读的api key(seo项目使用)
```bash
cd ./meilisearchScript/example.env ./meilisearchScript/.env
npm run meilisearchUtil:getKeys
npm run meilisearchUtil:createKey
npm run meilisearchUtil:deleteKey
npm run meilisearchUtil:deleteIndex
npm run meilisearchUtil:deleteAllDocuments
```

## 配置定时 刷新 抓取文档

```bash
source /xxx/meilisearchScript/.venv/bin/activate
cd /xxx/meilisearchScript
/xxxx/bin/pipenv run ./scraper_seo_article_public
/xxxx/bin/pipenv run ./scraper_seo_article_all
```
