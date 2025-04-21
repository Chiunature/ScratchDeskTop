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
const { SOURCE, BOOTBIN } = require("../json/verifyTypeConfig.json");
const { BIN, LB_FWLIB } = require("../json/LB_FWLIB.json");
const { CAKE, PYTHON } = require("../json/code_type.json");
const ipc_Main = require("../json/communication/ipc.json");



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
function verifyBinType(options, event) {
    const { verifyType } = options;
    const { path, fs, process, isPackaged } = this;
    const dir = path.resolve(__dirname);
    const root = isPackaged ? dir.slice(0, dir.indexOf('resources') - 1) : process.cwd();
    //根据类型判断是哪种通信
    switch (verifyType) {
        case SOURCE:
            const allFiles = getAllFiles(fs, path, path.join(root, LB_FWLIB));
            event.reply(ipc_Main.RETURN.COMMUNICATION.SOURCE.LENGTH, allFiles.length);
            return allFiles;
        case BOOTBIN:
            return getResultByCodeType(options, { path, fs, root });
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
                    fileName: `${selectedExe.num}.py`,
                    fileData: options.codeStr
                }
            ]
        default:
            return false;
    }
}

module.exports = {
    verifyBinType
};
