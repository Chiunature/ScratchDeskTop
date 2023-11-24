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
function ipc({ sendName, sendParams, eventName, callback }) {
    if (sendName) window.electron.ipcRenderer.send(sendName, sendParams);
    const eventList = window.electron.ipcRenderer.eventNames();
    if (eventName && !eventList.includes(eventName) && typeof callback === "function") window.electron.ipcRenderer.on(eventName, (event, arg) => callback(event, arg));
}

function delEvents(eventName) {
    window.electron.ipcRenderer.removeAllListeners([eventName]);
}

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


function writeFileWithDirectory(directory, filepath, data) {
    window.fs.mkdir(directory, { recursive: true }, () => {
        window.fs.writeFile(filepath, data + '', err => {
            console.log(err);
        });
    });
}

//错误处理
function handlerError(error) {
    console.error(`error: ${error}`);
    const directory = './Error';
    const filepath = `./Error/error_${getCurrentTime()}.txt`;
    writeFileWithDirectory(directory, filepath, error);
}

function getVersion(data, path = window.process.cwd() + '/resources/gcc-arm-none-eabi/bin/LB_FWLIB/version/Version.txt') {
    const version = window.fs.readFileSync(path, 'utf8');
    if (data == version) {
        return true;
    }else {
        return false;
    }
}

export {
    ipc,
    handlerError,
    getVersion,
    getCurrentTime,
    delEvents
}