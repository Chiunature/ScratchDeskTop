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

const { ipcMain } = require("electron");
const fs = require("fs");
const { SOURCE_MUSIC, SOURCE_APP, SOURCE_BOOT, SOURCE_VERSION, SOURCE_CONFIG, BOOTBIN, DELETE_EXE } = require("../config/json/verifyTypeConfig.json");
class Common {
    /**
     * 主进程通信
     * @param {String} eventName 
     * @param {Function} callback 
     */
    ipcMain(eventName, callback) {
        const eventList = ipcMain.eventNames();
        !eventList.includes(eventName) && ipcMain.on(eventName, (event, arg) => {
            return callback(event, arg);
        });
    }


    /**
     * 文件名校验位和指令
     * @param {String} item 
     * @param {Number} bits 
     * @returns 
     */
    checkFileName(item, bits) {
        const list = this.stringToHex(item);
        const len = list.length;
        let sum = 0x5a + 0x97 + 0x98 + len + bits;
        list.map(el => sum += el);
        return {
            binArr: [0x5a, 0x97, 0x98, len, bits, ...list, (sum & 0xff), 0xa5],
            crc: sum & 0xff
        };
    }

    /**
     * bin信息指令
     * @param {Array} item 
     * @param {Number} currentIndex 
     * @param {Number} lastIndex 
     * @returns 
     */
    checkBinData(item, currentIndex, lastIndex) {
        const len = item.length;
        const bits = currentIndex == lastIndex ? 0xbb : 0xaa;
        let sum = 0x5a + 0x97 + 0x98 + len + bits;
        item.map(el => sum += el);
        return {
            binArr: [0x5a, 0x97, 0x98, len, bits, ...item, (sum & 0xff), 0xa5],
            crc: sum & 0xff
        };
    }

    /**
     * 发送数据
     * @param {String} eventName 
     * @param {Function} fn 
     */
    sendToSerial(eventName, fn) {
        this.ipcMain(eventName, (event, data) => {
            if (typeof fn === 'function') fn.call(this, event, data);
        });
    }

    /**
     * 侦听编译时的错误处理
     * @param {String} eventName 
     */
    listenError(eventName) {
        this.ipcMain(eventName, (event) => event.reply("completed", { result: false, msg: "uploadError" }));
    }

    /**
     * 数据转buffer数组
     * @param {Array} buf 
     * @returns 
     */
    toArrayBuffer(buf) {
        let view = [];
        for (let i = 0; i < buf.length; i++) {
            view.push(buf[i]);
        }
        return view;
    }

    /**
     * 将十六进制转字符串
     * @param {Array} list 
     * @returns 
     */
    hexToString(list) {
        let result = "";
        let hexArray = list;
        for (let i = 0; i < hexArray.length; i++) {
            result += String.fromCharCode(hexArray[i]);
          }
        return result;
    }

    /**
     * 将字符串转十六进制
     * @param {String} str 
     * @returns 
     */
    stringToHex(str) {
        let val = [];
        for (let i = 0; i < str.length; i++) {
            const hex = str.charCodeAt(i).toString(16);
            const num = parseInt(hex, 16);
            val.push(num);
        }
        return val;
    }

    /**
     * 检测数据并转buffer数组
     * @param {*} data 
     * @returns 
     */
    Get_CRC(data) {
        let arr = [];
        if (!Array.isArray(data)) {
            arr = this.toArrayBuffer(data);
        } else {
            arr = [...data];
        }
        return arr;
    }

    /**
     * 分段上传
     * @param {Array} data 
     * @param {Number} size 
     * @returns 
     */
    uploadSlice(data, size) {
        let newArr = [];
        const chunkSize = size;
        if (data.length < chunkSize) {
            newArr.push(data);
        } else {
            for (let i = 0; i < data.length; i += chunkSize) {
                let chunk = data.slice(i, i + chunkSize);
                newArr.push(chunk);
            }
        }
        return newArr;
    }

    /**
     * 对接收数据的错误处理
     * @param {*} event 
     * @param {Function} fn 
     */
    handleReadError(event, fn) {
        if (typeof fn === 'function') fn.apply(this);
        event.reply("completed", { result: false, msg: "uploadError" });
    }

    /**
     * 从文件夹获取文件名
     * @param {String} folderPath 
     * @returns 
     */
    readmidr(folderPath) {
        const files = fs.readdirSync(folderPath);
        return files;
    }

    /**
     * 读取文件
     * @param {String} path 
     * @param {String} type 
     * @returns 
     */
    readFiles(path, type) {
        const data = fs.readFileSync(path, type);
        return data;
    }
    
    /**
     * 判断功能码
     * @param {Number} verifyType 
     * @returns 
     */
    getBits(verifyType) {
        switch (verifyType) {
            case BOOTBIN:
                return 0xda;
            case SOURCE_MUSIC:
                return 0xec;
            case SOURCE_APP:
                return 0xda;
            case SOURCE_BOOT:
                return 0xdb;
            case SOURCE_VERSION:
                return 0xdd;
            case SOURCE_CONFIG:
                return 0xdc;
            case DELETE_EXE:
                return 0xdf;
            default:
                break;
        }
    }
    
    /**
     * 校验数据的switch
     * @param {Object} actions 
     * @param {String} condition 
     * @param {String} type 
     * @returns 
     */
    switch(actions, condition, type) {
        if (type) {
            if (actions[condition]) {
                return actions[condition]();
            } else {
                return false;
            }
        } else {
            if (actions[condition]) {
                actions[condition]();
            } else {
                return false;
            }
        }
    }

    actions(data) {
        return data
    }

}

module.exports = Common;