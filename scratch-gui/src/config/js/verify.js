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
const { SOURCE, SOURCE_MUSIC, SOURCE_APP, SOURCE_BOOT, SOURCE_VERSION, SOURCE_CONFIG, BOOTBIN } = require("../json/verifyTypeConfig.json");
const { MUSIC, BOOT, BIN, APP, VERSION, CONFIG } = require("../json/LB_FWLIB.json");

//校验接收的数据
function verifyActions(data) {
    return {
        "Boot_URL": () => {
            if (data[0] == 0x5a && data[1] == 0x98 && data[2] == 0x97 && data[3] == 0x01 && data[4] == 0xfd && data[5] == 0x01 && data[data.length - 2] == 0x88 && data[data.length - 1] == 0xa5) {
                return true;
            } else {
                return false;
            }
        },
        "Boot_Bin": () => {
            if (data[0] == 0x5a && data[1] == 0x98 && data[2] == 0x97 && data[3] == 0x01 && data[4] == 0xfd && data[5] == 0x01 && data[data.length - 2] == 0x88 && data[data.length - 1] == 0xa5) {
                return true;
            } else {
                return false;
            }
        },
        "Boot_End": () => {
            if (data[0] == 0x5a && data[1] == 0x98 && data[2] == 0x97 && data[3] == 0x01 && data[4] == 0xfd && data[5] == 0x01 && data[data.length - 2] == 0x88 && data[data.length - 1] == 0xa5) {
                return true;
            } else {
                return false;
            }
        },
    }
}

//区分是哪种类型操作
function distinguish(filesObj, type, event) {
    let obj = filesObj;
    switch (type) {
        case SOURCE_MUSIC:
            let flag = obj.filesIndex < obj.filesLen;
            if (flag) {
                obj.filesIndex++;
                event.reply("nextFile", { index: obj.filesIndex, fileVerifyType: obj.fileVerifyType });
            } else {
                obj.filesIndex = 0;
                obj.fileVerifyType = SOURCE_APP;
                event.reply("nextFile", { index: obj.filesIndex, fileVerifyType: obj.fileVerifyType });
            }
            break;
        case SOURCE_APP:
            obj.fileVerifyType = SOURCE_BOOT;
            event.reply("nextFile", { fileVerifyType: obj.fileVerifyType });
            break;
        case SOURCE_BOOT:
            obj.fileVerifyType = SOURCE_VERSION;
            event.reply("nextFile", { fileVerifyType: obj.fileVerifyType });
            break;
        case SOURCE_VERSION:
            obj.fileVerifyType = SOURCE_CONFIG;
            event.reply("nextFile", { fileVerifyType: obj.fileVerifyType });
            break;
        case SOURCE_CONFIG:
            event.reply("completed", { result: true, msg: "uploadSuccess" });
            break;
        case BOOTBIN:
            event.reply("completed", { result: true, msg: "uploadSuccess" });
            break;
        default:
            break;
    }
}


//处理接收数据后的操作
function processReceivedConfig(event, ...arg) {
    let obj = {};
    arg.map(item => {
        if (typeof item == "function") {
            switch (item.name) {
                case "bound sendBin":
                    obj['Boot_Bin'] = () => item(arg[0], event);
                    break;
                case "bound clearCache":
                    obj['Boot_End'] = () => {
                        distinguish(arg[2], arg[1], event);
                        item();
                    }
                    break;
                default:
                    break;
            }
        }
    });
    return obj;
}

//处理是哪种类型的校验
function verifyBinType(...arg) {
    let fileData, fileName;
    const { verifyType, filesObj, filesIndex, readFiles, writeFiles } = arg[0];
    switch (verifyType) {
        case SOURCE_MUSIC:
            if (Object.keys(filesObj).length === 0) {
                filesObj.filesList = window.fs.readdirSync(MUSIC);
                filesObj.filesLen = filesObj.filesList.length;
            }
            fileData = readFiles(`${MUSIC}/${filesObj.filesList[filesIndex]}`);
            fileName = filesObj.filesList[filesIndex].slice(0, -4);
            break;
        case SOURCE_APP:
            fileName = readFiles(BOOT, 'utf8');
            fileData = readFiles(APP);
            break;
        case SOURCE_BOOT:
            fileName = 'rigistryApp.txt';
            fileData = readFiles(BOOT);
            break;
        case SOURCE_VERSION:
            fileName = 'Version.txt';
            fileData = readFiles(VERSION);
            break;
        case SOURCE_CONFIG:
            fileName = 'config';
            fileData = readFiles(CONFIG);
            break;
        case BOOTBIN:
            fileName = readFiles(BOOT, 'utf8');
            fileData = readFiles(BIN);
            writeFiles(APP, fileData);
            break;
        default:
            break;
    }

    return {
        fileData,
        fileName
    }
}

module.exports = {
    verifyActions,
    processReceivedConfig,
    verifyBinType
};