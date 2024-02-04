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

/*
 * @Description: 渲染进程和主进程通信
 * @Author: jiang
 * @Date: 2023-06-02 09:21:03
 * @LastEditors: jiang
 * @LastEditTime: 2023-06-02 09:41:04
 * @params : {sendName, sendParams, eventName, callback}
 */
const { VERSION } = require('../config/json/LB_FWLIB.json');

/**
 * 获取当前时间
 * @returns 
 */
function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}


/**
 * 错误处理
 * @param {String} error 
 */
async function handlerError(error) {
    const directory = './Error';
    const time = getCurrentTime();
    const filepath = `${directory}/error_${time}.txt`;
    await window.myAPI.writeFileWithDirectory(directory, filepath, error);
}


/**
 * 把 dataURL 转成 blob
 * @param {String} dataurl 
 * @returns 
 */
function dataURLToBlob(dataurl) {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

/**
     * 将十六进制转字符串
     * @param {Array} list 
     * @returns 
     */
function hexToString(list) {
    let result = "";
    let hexArray = [...list];
    for (let i = 0; i < hexArray.length; i++) {
        result += String.fromCharCode(hexArray[i]);
    }
    return result;
}

export {
    handlerError,
    getCurrentTime,
    dataURLToBlob,
    hexToString
}