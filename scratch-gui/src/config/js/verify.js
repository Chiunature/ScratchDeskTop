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
const { SOURCE_MUSIC, SOURCE_APP, SOURCE_BOOT, SOURCE_VERSION, SOURCE_CONFIG, BOOTBIN } = require("../json/verifyTypeConfig.json");
const { MUSIC, BOOT, BIN, APP, VERSION, CONFIG } = require("../json/LB_FWLIB.json");

//校验接收的数据, Boot_URL是发文件路径的时候, Boot_Bin是发文件数据的时候, Boot_End是文件发完的时候
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
            processedForSouceFile(obj, SOURCE_APP, event);
            break;
        case SOURCE_APP:
            processedForSouceFile(obj, SOURCE_BOOT, event);
            break;
        case SOURCE_BOOT:
            processedForSouceFile(obj, SOURCE_VERSION, event);
            break;
        case SOURCE_VERSION:
            processedForSouceFile(obj, SOURCE_CONFIG, event);
            break;
        case SOURCE_CONFIG:
            processedForSouceFile(obj, null, event);
            break;
        case BOOTBIN:
            event.reply("completed", { result: true, msg: "uploadSuccess" });
            break;
        default:
            break;
    }
    //发送完资源文件后
    function processedForSouceFile(obj, next, event) {
        obj.filesIndex++;
        if (obj.filesIndex <= obj.filesLen - 1) {
            event.reply("nextFile", { index: obj.filesIndex, fileVerifyType: obj.fileVerifyType, clearFilesObj: false });
        } else if (obj.fileVerifyType !== next) {
            obj.filesIndex = 0;
            obj.fileVerifyType = next;
            event.reply("nextFile", { index: obj.filesIndex, fileVerifyType: obj.fileVerifyType, clearFilesObj: true });
        } else if (!next) {
            event.reply("sourceCompleted", { msg: "uploadSuccess" });
        }
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
    let data, name;
    const { verifyType, selectedExe, filesObj, filesIndex, readFiles, writeFiles } = arg[0];
    switch (verifyType) {
        case SOURCE_MUSIC:
            const music = readdirForSource(MUSIC, filesObj, filesIndex, readFiles);
            data = music.fileData;
            name = music.fileName;
            break;
        case SOURCE_APP:
            const app = readdirForSource(APP, filesObj, filesIndex, readFiles);
            data = app.fileData;
            name = app.fileName;
            break;
        case SOURCE_BOOT:
            const boot = readdirForSource(BOOT, filesObj, filesIndex, readFiles);
            data = boot.fileData;
            name = boot.fileName;
            break;
        case SOURCE_VERSION:
            const version = readdirForSource(VERSION, filesObj, filesIndex, readFiles);
            data = version.fileData;
            name = version.fileName;
            break;
        case SOURCE_CONFIG:
            const config = readdirForSource(CONFIG, filesObj, filesIndex, readFiles);
            data = config.fileData;
            name = config.fileName;
            break;
        case BOOTBIN:
            name = `${selectedExe.num}_APP.bin`;
            data = readFiles(BIN);
            writeFiles(APP + '/' + name, data);
            break;
        default:
            break;
    }
    //读取资源文件夹
    function readdirForSource(path, filesObj, filesIndex, readFiles) {
        let fileData, fileName;
        if (Object.keys(filesObj).length === 0) {
            filesObj.filesList = window.fs.readdirSync(path);
            filesObj.filesLen = filesObj.filesList.length;
        }
        if (filesObj.filesList.length > 0) {
            fileData = readFiles(`${path}/${filesObj.filesList[filesIndex]}`);
            fileName = filesObj.filesList[filesIndex];
        }

        return {
            fileData,
            fileName
        }
    }

    return {
        fileData: data,
        fileName: name,
    }
}

module.exports = {
    verifyActions,
    processReceivedConfig,
    verifyBinType
};