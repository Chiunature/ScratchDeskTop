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



/**
 * 校验接收的数据, Boot_URL是发文件路径的时候, Boot_Bin是发文件数据的时候, Boot_End是文件发完的时候
 * @param {String} sign 
 * @param {Object} recevieObj 
 * @param {Object} event 
 * @param {Function} hexToString 
 * @returns 
 */
function verifyActions(sign, recevieObj, event, hexToString) {
    const { data, bit } = recevieObj;
    if (sign && sign.search('Boot') !== -1) {
        let obj = {};
        obj[sign] = () => {
            const list = [0x5A, 0x98, 0x97, 0x01, 0xfd, 0x01, 0x88, 0xA5];
            let res;
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                if (item == list[i]) {
                    res = true;
                } else {
                    res = false;
                    break;
                }
            }
            return res;
        }
        return obj;
    } else {
        switch (sign) {
            case "Watch_Device":
                event.reply("response_watch", { data: hexToString(data.slice(5, data.length - 2)), bit });
                return false;
            case "get_version":
                event.reply("return_version", hexToString(data.slice(5, data.length - 2)));
                return false;
            case "delete-exe":
                const list = [0x5A, 0x98, 0x97, 0x00, 0xDF, 0x68, 0xA5];
                let res;
                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    if (item == list[i]) {
                        res = true;
                    } else {
                        res = false;
                        break;
                    }
                }
                event.reply("return-delExe", res);
                return false;
            default:
                break;
        }
    }
}

/**
 * 区分是哪种类型操作
 * @param {Object} filesObj 
 * @param {String} type 
 * @param {Object} event 
 */
function distinguish(filesObj, type, event) {
    let obj = { ...filesObj };
    switch (type) {
        case SOURCE_MUSIC:
            processedForSouceFile(obj, SOURCE_BOOT, event);
            break;
        case SOURCE_BOOT:
            processedForSouceFile(obj, SOURCE_VERSION, event);
            break;
        case SOURCE_VERSION:
            processedForSouceFile(obj, SOURCE_CONFIG, event);
            break;
        case SOURCE_CONFIG:
            processedForSouceFile(obj, SOURCE_APP, event);
            break;
        case SOURCE_APP:
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
        if(next) {
            if (obj.filesIndex < obj.filesLen) {
                event.reply("nextFile", { subFileIndex: obj.filesIndex, fileVerifyType: obj.fileVerifyType, clearFilesObj: false });
            } else if (obj.filesIndex > obj.filesLen - 1) {
                obj.fileVerifyType = next;
                event.reply("nextFile", { subFileIndex: 0, fileVerifyType: obj.fileVerifyType, clearFilesObj: true });
            }
            console.log(`${obj.fileName}已经下载完成`);
        } else {
            event.reply("sourceCompleted", { msg: "uploadSuccess" });
        }
    }
}



/**
 * 处理接收数据后的操作
 * @param  {Object} options 
 * @returns 
 */
function processReceivedConfig(options) {
    const {
        event,
        chunkIndex,
        verifyType,
        filesObj,
        sendBin,
        clearCache
    } = options;
    return {
        Boot_Bin: () => sendBin(chunkIndex, event),
        Boot_End: () => {
            distinguish(filesObj, verifyType, event);
            clearCache();
        }
    }
}


/**
 * 处理是哪种类型的校验
 * @param  {Object} options 
 * @returns 
 */
function verifyBinType(options, that) {
    let data, name;
    const { verifyType, selectedExe, filesObj, filesIndex, readFiles, writeFiles } = options;
    const {path, fs, process} = that;
    const root = process.cwd();
    switch (verifyType) {
        case SOURCE_MUSIC:
            const music = readdirForSource(path.join(root, MUSIC), filesObj, filesIndex, readFiles);
            data = music.fileData;
            name = music.fileName;
            break;
        case SOURCE_APP:
            const app = readdirForSource(path.join(root, APP), filesObj, filesIndex, readFiles);
            data = app.fileData;
            name = app.fileName;
            break;
        case SOURCE_BOOT:
            const boot = readdirForSource(path.join(root, BOOT), filesObj, filesIndex, readFiles);
            data = boot.fileData;
            name = boot.fileName;
            break;
        case SOURCE_VERSION:
            const version = readdirForSource(path.join(root, VERSION), filesObj, filesIndex, readFiles);
            data = version.fileData;
            name = version.fileName;
            break;
        case SOURCE_CONFIG:
            const config = readdirForSource(path.join(root, CONFIG), filesObj, filesIndex, readFiles);
            data = config.fileData;
            name = config.fileName;
            break;
        case BOOTBIN:
            name = `${selectedExe.num}_APP.bin`;
            data = readFiles(path.join(root, BIN));
            writeFiles(path.join(root, APP, name), data);
            break;
        default:
            break;
    }
    //读取资源文件夹
    function readdirForSource(path, filesObj, filesIndex, readFiles) {
        let fileData, fileName;
        if (Object.keys(filesObj).length === 0) {
            filesObj.filesList = fs.readdirSync(path);
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