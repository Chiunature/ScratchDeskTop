
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
import { headMain, Task_Info, Task_Stack, Task_Info_Item, Task_Handler } from "../config/js/ProgrammerTasks.js";
import { APLICATION } from "../config/json/LB_USER.json";
import { ipc as ipc_Renderer, verifyTypeConfig } from "est-link"


const reg_USER_Aplication = /\s{1}void\s+USER_Aplication\d*\([\s\S]*?\)\s*\{[\s\S]*?\/\*USER APLICATION END\*\/\s*vTaskExit\("1"\)\;\s*\}\;\s{1}/g;
const reg_Task_Info = /MallocTask_Info\s+User_Task\[\]\s+\=\s+\{[\s\S]*?\}\;\s{1}/;
const reg_main = /\#if\s+ExternalPrograment\s+\=\=\s+\d+[\s\S]*?\/\*MyBlock End\*\/\s{1}/;
const reg_Task_Handler = /\s{1}TaskHandle_t\s+UserHandle\d*\;/g;

class Compile {

    constructor() { }

    /**
     * 根据正则去修改文件特定内容
     * @param {RegExp | String} regex
     * @param {String} targetStr
     * @returns
     */
    changeFileByReg(result, regex, targetStr) {
        let newRes = '', regList, isReg = false;
        return new Promise((resolve, reject) => {
            try {
                if (typeof regex === 'string') {
                    regList = regex;
                    isReg = false;
                } else {
                    regList = result.match(regex);
                    isReg = true;
                }
                if (!regList) {
                    return;
                }
                newRes = result.replace(isReg ? regList.join('\n') : regList, targetStr);
                resolve(newRes);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 将生成的C代码写入特定的C文件
     * @param {String} codeStr
     * @param {String} taskStr
     * @param {String} myStr
     * @returns
     */
    async handleCode(codeStr, taskStr, myStr, handlerStr) {
        //读取Aplication.c文件
        const result = window.myAPI.readFiles(APLICATION, window.resourcesPath);
        //自制积木块放入前面
        const myCode = headMain(myStr);
        const newMy = await this.changeFileByReg(result, reg_main, myCode);
        //替换void USER_Aplication部分
        const newUser = await this.changeFileByReg(newMy, reg_USER_Aplication, codeStr);
        //替换TaskHandle_t部分
        const newTaskHandler = await this.changeFileByReg(newUser, reg_Task_Handler, handlerStr);
        //替换MallocTask_Info User_Task[]部分
        const taskIntoStr = Task_Info(taskStr);
        const newTaskInto = await this.changeFileByReg(newTaskHandler, reg_Task_Info, taskIntoStr);
        //重新写入Aplication.c文件
        const writeAppRes = window.myAPI.writeFiles(APLICATION, newTaskInto, window.resourcesPath);
        return writeAppRes;
    }

    /**
     * 运行编译器参数是传入的C语言代码
     * @param {Array} buffer
     * @param {String} myBlock
     * @param {Object} selectedExe
     * @param {String} verifyType
     */
    async runGcc(buffer, myBlock, selectedExe, verifyType) {
        let codeStr = '', taskStr = '', handlerStr = '';
        buffer.map((el, index) => {
            if (el) {
                codeStr += Task_Stack(el, index);
                taskStr += Task_Info_Item(index);
                handlerStr += Task_Handler(index);
            }
        });

        const appRes = await this.handleCode(codeStr, taskStr, myBlock, handlerStr);
        //编译
        if (appRes) {
            window.myAPI.commendMake(window.resourcesPath).then(() => {
                if (selectedExe) window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.COMMUNICATION.GETFILES, sendParams: { verifyType, selectedExe } });
            }).catch(err => {
                window.myAPI.handlerError(err, window.resourcesPath);
                window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.ERROR.TRANSMISSION });
            });
        }
    }


    /**
     * 区分是什么类型的通信
     * @param {String} verifyType
     * @param {Array} bufferList
     * @param {String} myBlock
     * @param {Object} selectedExe
     */
    async sendSerial(verifyType, bufferList, myBlock, selectedExe) {
        if (verifyType === verifyTypeConfig.SOURCE) {
            window.myAPI.ipcRender({
                sendName: ipc_Renderer.SEND_OR_ON.COMMUNICATION.GETFILES,
                sendParams: { verifyType: verifyTypeConfig.RESET_FWLIB },
                eventName: ipc_Renderer.RETURN.COMMUNICATION.SOURCE.NEXTFILE,
                callback: (event, data) => {
                    window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.COMMUNICATION.GETFILES, sendParams: { subFileIndex: data.subFileIndex, verifyType: data.fileVerifyType, clearFilesObj: data.clearFilesObj } });
                }
            });
        } else {
            await this.runGcc(bufferList, myBlock, selectedExe, verifyType);
        }
    }
}

/**
 * 对比参数是否相等
 * @param {Array | Function} val
 * @param {Array | Function} cur
 * @returns
 */
function isSame(val, cur) {
    if (val.length !== cur.length) {
        return false;
    }
    for (let i = 0; i < cur.length; i++) {
        if (val[i] !== cur[i]) {
            return false;
        }
    }
    return true;
}

/**
 * 把类代理成单例模式
 * @param {object} className
 * @returns
 */
function singleton(className) {
    let ins, parmters;
    return new Proxy(className, {
        construct(target, args) {
            if (!ins) {
                ins = new target(...args);
                parmters = args;
            }
            if (!isSame(parmters, args)) {
                throw new Error('Cannot create instance!');
            }
            return ins;
        }
    })
}

export default singleton(Compile);
