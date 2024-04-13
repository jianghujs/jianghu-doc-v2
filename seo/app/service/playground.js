'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
const validateUtil = require("@jianghujs/jianghu/app/common/validateUtil");
const { tableEnum } = require('../constant/constant');
// ========================================常用 require end=============================================
const actionDataScheme = Object.freeze({
  saveCode: {
    type: 'object',
    additionalProperties: true,
    required: [ 'codeId' ],
    properties: {
      codeId: { type: 'string' },
      htmlCode: { anyOf: [{ type: "string" }, { type: "null" }] },
      jsCode: { anyOf: [{ type: "string" }, { type: "null" }] },
    },
  },
});

class ConstantUiService extends Service {

  async saveCode() {
    const { jianghuKnex } = this.app;
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.saveCode, actionData);
    const { codeId, htmlCode, jsCode } = actionData;
    const codeOld = await jianghuKnex(tableEnum.playground_code, this.ctx).where({ codeId }).select().first();
    if (!codeOld) {
      await jianghuKnex(tableEnum.playground_code, this.ctx).insert({
        codeId,
        htmlCode,
        jsCode,
      })
    }
    if (codeOld) {
      await jianghuKnex(tableEnum.playground_code, this.ctx).where({ codeId: codeId }).update({htmlCode, jsCode})
    }
  }


  async getCode() {
    const { jianghuKnex } = this.app;
    const codeId = this.ctx.query.codeId
    const code = await jianghuKnex(tableEnum.playground_code, this.ctx).where({ codeId }).select().first();
    const { htmlCode, jsCode } = code || {};
    return { htmlCode, jsCode };
    // return {
    //     htmlCode: `
    // <v-form ref="createForm" lazy-validation>
    //     <v-row no-gutters>
    //         <span class="text-h7 font-weight-bold pa-4 pl-0">表单组件</span>
    //     </v-row>
    //     <v-divider class="jh-divider"></v-divider>
    //     <v-row>
    //         <v-col cols="12" sm="12" md="4">
    //             <span class="jh-input-label">学生名</span>
    //             <v-text-field v-model="studentName" :rules="validationRules.studentName" class="jh-v-input" dense single-line filled></v-text-field>
    //         </v-col>
    //     </v-row>
    //     <v-row class="justify-end mx-0 my-8 px-4">
    //         <v-btn color="success" small @click="doUiAction('createStudent')">保存</v-btn>
    //     </v-row>
    // </v-form>
    //     `,
    //     jsCode: `
    //     data: () => ({
    //         validationRules: {
    //           studentName: [
    //               v => !!v || '学生名字是必填项',
    //               v => (v && v.length >= 2) || '学生名字至少需要2个字符',
    //           ],
    //         },
    //         studentName: '张',
    //       }),
    //       async created() {
    //       },
    //       mounted() {
    //       },
    //       methods: {
    //         async doUiAction(uiActionId, uiActionData) {
    //           switch (uiActionId) {
    //             case 'createStudent':
    //               await this.prepareCreateValidate();
    //               await this.confirmCreateItemDialog();
    //               await this.doCreateStudent();
    //               break;
    //             default:
    //               console.error("[doUiAction] uiActionId not find", { uiActionId });
    //               break;
    //           }
    //         },
    //         async prepareCreateValidate() {
    //           if (await this.$refs.createForm.validate()) {
    //             return true;
    //           }
    //           throw new Error("请完善表单信息")
    //         },
    //         async confirmCreateItemDialog() {
    //           if (await window.confirmDialog({title: "新增", content: "确定新增吗？"}) === false) {
    //             throw new Error("[confirmCreateFormDialog] 否");
    //           }
    //         },
    //         async doCreateStudent() {
    //           window.vtoast.success("保存")
    //         },
    //     }
    //     `,
    // };
  }
}

module.exports = ConstantUiService;
