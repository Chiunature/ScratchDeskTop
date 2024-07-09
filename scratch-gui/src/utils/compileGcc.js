
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
import { Task_Handler, Task_Info, Task_Info_Item, Task_Stack, Task_MyBlock } from "../config/js/ProgrammerTasks.js";
import { APLICATION } from "../config/json/LB_USER.json";
import { ipc as ipc_Renderer, verifyTypeConfig } from "est-link"


const reg_USER_Aplication = /\s{1}void\s+USER_Aplication\d*\([\s\S]*?\)\s*\{[\s\S]*?\/\*USER APLICATION END\*\/\s*vTaskExit\("1"\)\;\s*\}\;\s{1}/g;
const reg_Task_Info = /\s{1}MallocTask_Info\s+User_Task\[\]\s+\=\s+\{[\s\S]*?\}\;\s{1}/;
const reg_main = /\s{1}\/\*MyBlock Write\d+\*\/[\s\S]*?\/\*MyBlock End\d+\*\/\s{1}/g;
const reg_Task_Handler = /\s{1}TaskHandle_t\s+UserHandle\d*\;\s{1}/g;

class Compile {

    constructor() { }

    /**
     * 根据正则去修改文件特定内容
     * @param result
     * @param {RegExp | String} regex
     * @param {String} targetStr
     * @returns
     */
    changeFileByReg(result, regex, targetStr) {
        let newRes = result, regList, targetList, isReg = false;
        return new Promise((resolve, reject) => {
            try {
                if (typeof regex === 'string') {
                    regList = regex;
                    isReg = false;
                } else {
                    regList = result.match(regex);
                    targetList = targetStr.match(regex);
                    isReg = true;
                }
                if (!regList || !isReg) {
                    return;
                }
                if (targetList && regList) {
                    if (targetList.length === regList.length || regList.length > targetList.length) {
                        for (let i = 0; i < regList.length; i++) {
                            const item = regList[i];
                            const target = targetList[i];
                            if (item && target) {
                                newRes = newRes.replace(item, target);
                            } else if (item && !target) {
                                newRes = newRes.replace(item, '');
                            }
                        }
                    } else if (regList.length < targetList.length) {
                        newRes = result.replace(regList.join(''), targetStr);
                    }
                } else {
                    newRes = result.replace(regList.join(''), targetStr);
                }
                resolve(newRes);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 将生成的C代码写入特定的C文件
     * @param {String} spath
     * @param {String} codeStr
     * @param {String} taskStr
     * @param {String} myStr
     * @param handlerStr
     * @returns
     */
    async handleCode(spath, codeStr, taskStr, myStr, handlerStr) {
        //读取Aplication.c文件
        const result = await window.myAPI.readFiles(APLICATION, spath);
        //自制积木块放入前面
        const newMy = await this.changeFileByReg(result, reg_main, myStr);
        //替换void USER_Aplication部分
        const newUser = await this.changeFileByReg(newMy, reg_USER_Aplication, codeStr);
        //替换TaskHandle_t部分
        const newTaskHandler = await this.changeFileByReg(newUser, reg_Task_Handler, handlerStr);
        //替换MallocTask_Info User_Task[]部分
        const taskIntoStr = Task_Info(taskStr);
        const newTaskInto = await this.changeFileByReg(newTaskHandler, reg_Task_Info, taskIntoStr);
        //重新写入Aplication.c文件
        return await window.myAPI.writeFiles(APLICATION, newTaskInto, spath);
    }

    /**
     * 运行编译器参数是传入的C语言代码
     * @param {Array} buffer
     * @param {String} myBlock
     * @param {Object} selectedExe
     * @param {String} verifyType
     * @param {Array} soundslist
     */
    async runGcc(buffer, myBlock, selectedExe, verifyType, soundslist) {
        let codeStr = '', taskStr = '', handlerStr = '', myBlockStr = '';
        const spath = sessionStorage.getItem("static_path") || window.resourcesPath;
        buffer.forEach((el, index) => {
            if (el) {
                codeStr += Task_Stack(el, index);
                taskStr += Task_Info_Item(index);
                handlerStr += Task_Handler(index);
            }
        });
        if (Array.isArray(myBlock)) {
            myBlock.forEach((el, index) => {
                myBlockStr += Task_MyBlock(el, index);
            })
        } else {
            myBlockStr = Task_MyBlock(myBlock);
        }
        const appRes = await this.handleCode(spath, codeStr, taskStr, myBlockStr, handlerStr);
        //编译
        if (appRes) {
            window.myAPI.commendMake(spath).then(() => {
                if (selectedExe) window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.COMMUNICATION.GETFILES, sendParams: { verifyType, selectedExe, soundslist } });
            }).catch(err => {
                window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.ERROR.TRANSMISSION });
                window.myAPI.handlerError(err, spath);
            });
        }
    }


    /**
     * 区分是什么类型的通信
     * @param {String} verifyType
     * @param {Array} bufferList
     * @param {String} myBlock
     * @param {Object} selectedExe
     * @param {Array} soundslist
     */
    async sendSerial(verifyType, bufferList, myBlock, selectedExe, soundslist) {
        switch (verifyType) {
            case verifyTypeConfig.RESET_FWLIB:
                window.myAPI.ipcRender({
                    sendName: ipc_Renderer.SEND_OR_ON.COMMUNICATION.GETFILES,
                    sendParams: { verifyType },
                    eventName: ipc_Renderer.RETURN.COMMUNICATION.SOURCE.NEXTFILE,
                    callback: (event, data) => {
                        window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.COMMUNICATION.GETFILES, sendParams: { ...data, verifyType: data.fileVerifyType } });
                    }
                });
                break;
            case verifyTypeConfig.BOOTBIN:
                await this.runGcc(bufferList, myBlock, selectedExe, verifyType, soundslist);
                break;
            default:
                break;
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
