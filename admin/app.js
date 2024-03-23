'use strict';

const fs = require('fs');
const path = require('path');
const fsPromises = require("fs").promises;
const util = require("util");
const exists = util.promisify(fs.exists);

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async serverDidReady() {
    await this.uploadDirCreate();
  }

  async uploadDirCreate () {
    const { uploadDir, uploadDirConfig } = this.app.config;
    if (!await exists(uploadDir)) {
        await fsPromises.mkdir(uploadDir, { recursive: true });
    }
    for (const dir of uploadDirConfig) {
      const targetDir = path.join(uploadDir, dir);
      if (!await exists(targetDir)) {
          await fsPromises.mkdir(targetDir, { recursive: true });
      }
    }
  }

}

module.exports = AppBootHook;

