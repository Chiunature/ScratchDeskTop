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
const ipc_Main = require("../json/communication/ipc.json");



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
            _processedForSouceFile(obj, SOURCE_CONFIG, event);
            break;
        case SOURCE_BOOT:
            _processedForSouceFile(obj, SOURCE_VERSION, event);
            break;
        case SOURCE_CONFIG:
            _processedForSouceFile(obj, null, event);
            break;
        case SOURCE_APP:
            _processedForSouceFile(obj, SOURCE_BOOT, event);
            break;
        case SOURCE_VERSION:
            _processedForSouceFile(obj, SOURCE_MUSIC, event);
            break;
        case BOOTBIN:
            event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, { result: true, msg: "uploadSuccess" });
            break;
        default:
            break;
    }
    //发送完资源文件后
    function _processedForSouceFile(obj, next, event) {
        obj.filesIndex++;
        if (next) {
            const isLastFile = obj.filesIndex > obj.filesLen - 1;
            const fileVerifyType = isLastFile ? next : obj.fileVerifyType;
            const subFileIndex = isLastFile ? 0 : obj.filesIndex;
            event.reply(ipc_Main.RETURN.COMMUNICATION.SOURCE.NEXTFILE, { subFileIndex, fileVerifyType, clearFilesObj: isLastFile });
        } else {
            event.reply(ipc_Main.RETURN.COMMUNICATION.SOURCE.CONPLETED, { msg: "uploadSuccess" });
        }
        console.log(`${obj.fileName}已经下载完成`);
    }
}


/**
 * 处理是哪种类型的校验
 * @param  {Object} options 
 * @returns 
 */
function verifyBinType(options) {
    let data, name;
    const { verifyType, selectedExe, files, filesIndex } = options;
    const { path, fs, process, isPackaged } = this;
    const root = isPackaged ? '' : process.cwd();
    //根据类型判断是哪种通信
    switch (verifyType) {
        case SOURCE_MUSIC:
            const music = _readdirForSource(path.join(root, MUSIC), files, filesIndex);
            data = music.fileData;
            name = music.fileName;
            break;
        case SOURCE_APP:
            const app = _readdirForSource(path.join(root, APP), files, filesIndex);
            data = app.fileData;
            name = app.fileName;
            break;
        case SOURCE_BOOT:
            const boot = _readdirForSource(path.join(root, BOOT), files, filesIndex);
            data = boot.fileData;
            name = boot.fileName;
            break;
        case SOURCE_VERSION:
            const version = _readdirForSource(path.join(root, VERSION), files, filesIndex);
            data = version.fileData;
            name = version.fileName;
            break;
        case SOURCE_CONFIG:
            const config = _readdirForSource(path.join(root, CONFIG), files, filesIndex);
            data = config.fileData;
            name = config.fileName;
            break;
        case BOOTBIN:
            name = `${selectedExe.num}_APP.bin`;
            data = fs.readFileSync(path.join(root, BIN))
            fs.writeFileSync(path.join(root, APP, name), data);
            break;
        default:
            break;
    }
    //读取资源文件夹，获取文件夹中的文件列表和文件数量，并根据filesIndex子文件下标获取对应子文件的数据
    function _readdirForSource(path, files, filesIndex) {
        let fileData, fileName;
        if (Object.keys(files).length === 0) {
            files.filesList = fs.readdirSync(path);
            files.filesLen = files.filesList.length;
        }
        if (files.filesList.length > 0) {
            fileData = fs.readFileSync(`${path}/${files.filesList[filesIndex]}`);
            fileName = files.filesList[filesIndex];
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
    distinguish,
    verifyBinType
};