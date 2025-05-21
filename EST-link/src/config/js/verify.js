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
import { CAKE, PYTHON } from "../json/code_type.json";
import ipc_Main from "../json/ipc.json";



function getAllFiles(fs, path, dir) {
    let res = [];
    const traverse = (dir, type) => {
        fs.readdirSync(dir).forEach((file) => {
            const pathname = path.join(dir, file);
            if (fs.statSync(pathname).isDirectory()) {
                traverse(pathname, `SOURCE_${file.toUpperCase()}`);
            } else {
                res.push({ verifyType: type, pathname, fileName: file, fileData: fs.readFileSync(pathname) });
            }
        })
    }
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
    const { selectedExe, codeType } = options;
    const { path, fs, root } = codeOptions;
    switch (codeType) {
        case CAKE:
            const pathname = path.join(root, BIN);
            return [
                {
                    pathname,
                    verifyType: BOOTBIN,
                    fileName: `${selectedExe.num}_APP.bin`,
                    fileData: fs.readFileSync(pathname)
                }
            ]
        case PYTHON:
            return [
                {
                    verifyType: BOOTBIN,
                    fileName: `${selectedExe.num}.o`,
                    fileData: options.codeStr
                }
            ]
        default:
            return false;
    }
}

// module.exports = {
//     verifyBinType
// };
