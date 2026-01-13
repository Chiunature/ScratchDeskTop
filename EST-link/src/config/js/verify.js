/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2023 drluck Inc.
 * http://www.drluck.cn/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview The class representing one block.
 * @author avenger-jxc
 */
import { SOURCE, BOOTBIN } from "../json/verifyTypeConfig.json";
import { BIN, LB_FWLIB } from "../json/LB_FWLIB.json";
import { PYTHON } from "../json/code_type.json";
import ipc_Main from "../json/ipc.json";

function getAllFiles(fs, path, dir) {
  let res = [];
  //定义允许被遍历的目录
  const allowedDirs = ["app", "version"];

  const traverse = (dir, type) => {
    fs.readdirSync(dir).forEach((file) => {
      const pathname = path.join(dir, file);
      if (fs.statSync(pathname).isDirectory()) {
        // 如果是目录
        if (type === null) {
          // 在根目录，只遍历允许的目录
          const dirName = file.toLowerCase();
          if (allowedDirs.includes(dirName)) {
            traverse(pathname, `SOURCE_${file.toUpperCase()}`);
          }
          // 如果不是允许的目录，跳过（不递归）
        } else {
          // 在子目录中，继续递归
          traverse(pathname, type);
        }
      } else {
        // 如果是文件，只在允许的目录下添加
        if (
          type &&
          (type.includes("SOURCE_APP") || type.includes("SOURCE_VERSION"))
        ) {
          res.push({
            verifyType: type,
            pathname,
            fileName: file,
            fileData: fs.readFileSync(pathname),
          });
        }
      }
    });
  };

  traverse(dir, null);
  return res;
}

/**
 * 处理是哪种类型的校验
 * @param  {Object} options
 * @returns
 */
export function verifyBinType(options, event) {
  const { verifyType } = options;
  const { path, fs, staticPath } = this;
  //根据类型判断是哪种通信
  switch (verifyType) {
    case SOURCE:
      const fileSourcePath = path.join(staticPath, LB_FWLIB);
      const allFiles = getAllFiles(fs, path, fileSourcePath);
      event.reply(ipc_Main.RETURN.COMMUNICATION.SOURCE.LENGTH, allFiles.length);
      return allFiles;
    case BOOTBIN:
      return getResultByCodeType(options, { path, fs, root: staticPath });
    default:
      return false;
  }
}

function getResultByCodeType(options, codeOptions) {
  const { selectedExe, codeType, fileName } = options;
  const { path, fs, root } = codeOptions;
  switch (codeType) {
    case PYTHON:
      return [
        {
          verifyType: BOOTBIN,
          fileName: fileName,
          fileData: options.codeStr,
        },
      ];
    default:
      return false;
  }
}
