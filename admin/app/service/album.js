const Service = require("egg").Service;
const { tableEnum } = require("../constant/constant");
const _ = require("lodash");
const validateUtil = require("@jianghujs/jianghu/app/common/validateUtil");
const idGenerateUtil = require("@jianghujs/jianghu/app/common/idGenerateUtil");
const { BizError, errorInfoEnum } = require("../constant/error");

const actionDataScheme = Object.freeze({
  viewAlbumContent: {
    type: "object",
    additionalProperties: true,
    required: ["albumId"],
    properties: {
      albumId: { anyOf: [{ type: "string" }, { type: "number" }] },
      pageNum: { anyOf: [{ type: "number" }, { type: "null" }] },
    },
  },
});

// pageNum 从第一页开始
function computeNextPageNum({ total, pageNum, pageSize }) {
  const lastPageNum = parseInt(total / pageSize);
  if (lastPageNum <= pageNum) {
    return lastPageNum + 1;
  }
  if (lastPageNum > pageNum) {
    return pageNum + 1;
  }
}

class AlbumService extends Service {
  async albumIdGenerateBeforeHook() {
    const tableName = "album";
    const columnName = "albumId";
    const albumId = await idGenerateUtil.idPlus({
      knex: this.app.jianghuKnex,
      tableName,
      columnName,
    });
    this.ctx.request.body.appData.actionData[columnName] = albumId;
  }

  async viewAlbumArticleList() {
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.viewAlbumContent, actionData);
    const { jianghuKnex } = this.app;

    let { albumId, pageNum } = actionData;
    if (!pageNum) { pageNum = 1; }
    const album = await jianghuKnex(tableEnum.album).where({ albumId, albumStatus: 'active' }).first();
    if (!album) {
      return { rows: [] };
    }
    const albumQuery = JSON.parse(album.albumQuery);
    const {
      tableName,
      where = "",
      queryType = "order", // random order
      orderBy = "order by id desc",
      limit = 50,
    } = albumQuery;
    if (!tableName) {
      throw new BizError(errorInfoEnum.data_expection);
    }
    const pageSize = limit;

    if (queryType === "order") {
      const orderSql = `select * from ${tableName} ${where} ${orderBy} limit ${
        (pageNum - 1) * limit
      },${limit}`;
      const orderTotalSql = `select count(1) count from ${tableName} ${where}`;
      const total = (await jianghuKnex.raw(orderTotalSql))[0][0].count;
      const rows = (await jianghuKnex.raw(orderSql))[0];
      const nextPageNum = computeNextPageNum({
        total,
        pageNum,
        pageSize: limit,
      });
      return { rows, total, pageSize, nextPageNum };
    }

    if (queryType === "random") {
      let newWhere = where;
      if (newWhere === "") {
        newWhere = "where 1=1";
      }
      const randomAllIdSql = `select id from ${tableName} ${newWhere}`;
      const allIdList = (await jianghuKnex.raw(randomAllIdSql))[0].map(
        (row) => row.id
      );
      const total = allIdList.length;
      const idList = _.sampleSize(allIdList, limit);
      if (idList.length === 0) {
        return { rows: [], total, pageSize };
      }
      const randomSql = `select * from ${tableName} ${newWhere} and id in (${idList})`;
      const rows = (await jianghuKnex.raw(randomSql))[0];
      return { rows, total, pageSize };
    }

    throw new BizError(errorInfoEnum.album_queryType_error);
  }
}
module.exports = AlbumService;
