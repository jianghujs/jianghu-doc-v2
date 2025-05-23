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

  // Tip: 这个不能删
  async playgroundRenderPageOfBeforeHook() {
    return { content: '这是一个页面的 beforeHook demo' };
  }

  // Tip: 这个不能删
  async getConstantUiMap() {
    const { jianghuKnex } = this.app;
    const { pageId } = this.ctx.packagePage;
    const { language } = this.app.config;
    const constantUiList = await jianghuKnex(`_constant_ui`).whereIn('pageId', ['all', pageId]).select();
    const constantUiMap = Object.fromEntries(
      constantUiList.map(obj => {
        const { constantKey } = obj;
        try {
          return [constantKey, JSON.parse(obj[language] || '{}')];
        } catch (error) {
          this.app.logger.error('getConstantUiMap', ` constantKey:${constantKey} `, error);
          return [constantKey, {}];
        }
      })
    );
    return constantUiMap;
  }

  async saveCode() {
    const { jianghuKnex } = this.app;
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.saveCode, actionData);
    const { codeId, htmlCode, jsCode, includeList=[] } = actionData;
    const codeOld = await jianghuKnex(tableEnum.playground_code, this.ctx).where({ codeId }).select().first();
    if (!codeOld) {
      await jianghuKnex(tableEnum.playground_code, this.ctx).insert({
        codeId,
        htmlCode,
        jsCode,
        includeList: includeList.join(','),
      })
    }
    if (codeOld) {
      await jianghuKnex(tableEnum.playground_code, this.ctx).where({ codeId: codeId }).update({htmlCode, jsCode, includeList: includeList.join(',')})
    }
  }


  async getCode(actionData) {
    const { jianghuKnex } = this.app;
    const ctx = this.ctx;
    const packagePage = ctx;
    const codeId = ctx.query.codeId || actionData?.codeId;
    const code = await jianghuKnex(tableEnum.playground_code, this.ctx).where({ codeId }).select().first();
    const { htmlCode, jsCode, includeList:includeListStr} = code || {};
    const includeList = (includeListStr||'').trim().split(',');
    
    // htmlCode 支持 njk 语法
    const htmlCodeRender = await ctx.renderString(htmlCode, {
      ...ctx.hookResult,
      page: { passcode: packagePage.passcode }
    });

    return { htmlCode: htmlCodeRender, jsCode, includeList };
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
