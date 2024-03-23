const Service = require("egg").Service;
const { tableEnum } = require("../constant/constant");
const _ = require("lodash");
const validateUtil = require("@jianghujs/jianghu/app/common/validateUtil");
const idGenerateUtil = require("@jianghujs/jianghu/app/common/idGenerateUtil");
const { BizError, errorInfoEnum } = require("../constant/error");

class CodeViewService extends Service {
  async beforeCreateCodeId() {
    const { jianghuKnex } = this.app;
    const idSequence = await idGenerateUtil.idPlus({
      knex: jianghuKnex,
      startValue: 10001,
      tableName: 'code_view',
      columnName: "idSequence"
    });
    this.ctx.request.body.appData.actionData.idSequence = idSequence;
    this.ctx.request.body.appData.actionData.codeId = 'C' + idSequence;
  }
}
module.exports = CodeViewService;
