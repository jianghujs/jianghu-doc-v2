## 风格

- [参考](https://layui.itze.cn/)

## 配置

1. npm install
2. 复制 `config.local.example.js` 为 `config.local.js`
3. 并且修改数据库配置为自己的数据库, 例如：
   ```
   host: '127.0.0.1',
   port: 3306,
   user: 'root',
   password: '123456',
   database: 'doc'
   ```
4. 启动 npm run dev

## 数据库

```sql
# 数据库初始化
create database `openjianghu_seo_v2` default character set utf8mb4 collate utf8mb4_bin;
use openjianghu_seo_v2;
# 运行 sql/init.sql 文件
```

## 软连接 admin/upload/xx 至 seo/upload/xx

```bash
ln -s /xxx/cn-openjianghu-admin-v2/upload/articleMaterial /xxx/cn-openjianghu-seo-v2/upload/articleMaterial
ln -s /xxx/cn-openjianghu-admin-v2/upload/materialRepo /xxx/cn-openjianghu-seo-v2/upload/materialRepo
```