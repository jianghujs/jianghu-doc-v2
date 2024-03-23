const Service = require("egg").Service;
const { tableEnum } = require("../constant/constant");
const _ = require("lodash");
const validateUtil = require("@jianghujs/jianghu/app/common/validateUtil");
const idGenerateUtil = require("@jianghujs/jianghu/app/common/idGenerateUtil");
const { BizError, errorInfoEnum } = require("../constant/error");

class CodeViewService extends Service {
  async getCodeView() {
    const { jianghuKnex } = this.app;
    const { code: codeId } = this.ctx.request.query;
    const codeView = await jianghuKnex('code_view').where({ codeId }).first();
    return codeView;
  }
}
module.exports = CodeViewService;
