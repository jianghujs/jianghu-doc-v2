'use strict';
// 每天定时归档 requestLog
const dayjs = require('dayjs');
const { tableEnum } = require('../constant/constant');
const fs = require('fs');
const path = require('path');
const { count } = require('console');
module.exports = {
  schedule: {
    //immediate: true, // 应用启动后触发
    cron: '0 0 3 * * *', // 每天 3 点执行
    type: 'worker', // worker: 只有一个worker执行
    disable: false
  },
  // 定时任务的入口
  async task (ctx) {
    const startTime = new Date().getTime();
    const { app } = ctx;
    const { knex, logger } = app;
    // 处理 3 天前的数据，即只处理小于 2 天前的数据
    const handleDate = dayjs(new Date(new Date().setDate(new Date().getDate() - 3))).format('YYYY-MM-DD');
    const compareDate = dayjs(new Date(new Date().setDate(new Date().getDate() - 2))).format('YYYY-MM-DD');
    const countOldRecords = await knex(tableEnum._resource_request_log).count('id').where('operationAt','<', compareDate);
    const totalCount = countOldRecords[0]['count(`id`)'];
    const recordPerReading = 1000;
    const recordCapacityPerFile = 5000;
    const numberOfRounds = recordCapacityPerFile / recordPerReading;
    const totalBatch=Math.ceil(totalCount / recordCapacityPerFile);
    const padSize = totalBatch.toString().length;

    for (var n=1; n<=totalBatch; n++ ) {      
      var s = "000000000" + n;
      const batchNumber = s.substring(s.length-padSize);
      const fileNameTimeString = dayjs().format('YYYY-MM-DD-HH-mm-ss');
      const fileName = `${tableEnum._resource_request_log}_${handleDate}_at${fileNameTimeString}-batch${batchNumber}.log`;
      //console.log('fileName: ', fileName);
      const stream = fs.createWriteStream(path.resolve(__dirname, `../../logs/${fileName}`));
      async function writeLogFile(logs) {
        logs.forEach(log => {
          stream.write(JSON.stringify(log) + '\n');
        })
      }
      // 每次 select 最旧的 recordPerReading 条, 每(recordPerReading * numberOfRounds)条换一个文件
      for (let i = 0; i < numberOfRounds; i++) {
        const last1000 = await knex(tableEnum._resource_request_log).limit(recordPerReading).select();
        const olderThanDate = last1000.filter(o => o.operationAt < compareDate);
        //logger.info('[archiveRequestLog.js] Round ' + i + ' archive', { count: olderThanDate.length });
        if (olderThanDate.length <= 0) {
          //console.log('here')
          break;
        }
        await writeLogFile(olderThanDate)
        await knex(tableEnum._resource_request_log).whereIn('id', olderThanDate.map(o => o.id)).delete();
      }
      stream.end();
      
    };

    const optimizeResult = await knex.raw('OPTIMIZE TABLE _resource_request_log');
    const endTime = new Date().getTime();
    logger.info('[archiveRequestLog.js]', { numberOfRecords: totalCount, numberOfFiles: totalBatch, useTime: `${endTime - startTime}/ms` });
  }
};