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

const { ipcRenderer } = window.electron;
const fs = window.fs;

/**
 * 异步通信
 * @param {String} sendName 
 * @param {any} sendParams 
 * @returns {Promise}
 */
async function ipcInvoke(sendName, sendParams) {
    const result = await ipcRenderer.invoke(sendName, sendParams);
    return result
}

/**
 * 渲染进程开启事件监听
 * @param {sendName:String, sendParams:Object, eventName:String, callback:Function } param0 
 */
function ipcRender({ sendName, sendParams, eventName, callback }) {
    if (sendName) {
        ipcRenderer.send(sendName, sendParams);
    }
    const eventList = ipcRenderer.eventNames();
    if (eventName && !eventList.includes(eventName) && typeof callback === "function") {
        ipcRenderer.on(eventName, (event, arg) => callback(event, arg));
    }
}

/**
 * 去掉渲染进程注册的事件监听
 * @param {String} eventName 
 */
function delEvents(eventName) {
    ipcRenderer.removeAllListeners([eventName]);
}

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
 * 查找文件夹并写入文件
 * @param {String} directory 
 * @param {String} filepath 
 * @param {String} data 
 */
function writeFileWithDirectory(directory, filepath, data) {
    fs.mkdir(directory, { recursive: true }, () => {
        fs.writeFile(filepath, data + '', err => {
            console.log(err);
        });
    });
}

/**
 * 错误处理
 * @param {String} error 
 */
function handlerError(error) {
    console.error(`error: ${error}`);
    const directory = './Error';
    const filepath = `./Error/error_${getCurrentTime()}.txt`;
    writeFileWithDirectory(directory, filepath, error);
}

/**
 * 获取版本并对比是否需要更新
 * @param {String} data 
 * @param {String} path 
 * @returns 
 */
function getVersion(data, path = window.process.cwd() + '/resources/gcc-arm-none-eabi/bin/LB_FWLIB/version/Version.txt') {
    const version = fs.readFileSync(path, 'utf8');
    if (data == version) {
        return true;
    }else {
        return false;
    }
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
        u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
}

export {
    ipcRender,
    handlerError,
    getVersion,
    getCurrentTime,
    delEvents,
    dataURLToBlob,
    ipcInvoke
}