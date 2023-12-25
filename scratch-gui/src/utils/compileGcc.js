
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
import { handlerError, ipcRender, getCurrentTime } from "./ipcRender";
import { headMain, Task_Info, Task_Stack, Task_Info_Item } from "../config/js/ProgrammerTasks.js";
import { SOURCE, SOURCE_MUSIC } from "../config/json/verifyTypeConfig.json";
import { DIR, APLICATION } from "../config/json/LB_USER.json";
import { ipc as ipc_Renderer } from "est-link"

const fs = window.fs;
const { spawn } = window.child_process;
const cpus = window.os.cpus();


class Compile {

    constructor() {
        // this.filesIndex = 0;
        // this.filesObj = {};
        this.startSend = true;
        this.eventName;
        this.progress;
    }


    /**
     * 将c语言代码写入文件
     * @param {String} path 
     * @param {String} type 
     * @returns 
     */
    writeFiles(path, type) {
        try {
            fs.writeFileSync(path, type);
            return true;
        } catch (error) {
            handlerError(error);
            return false;
        }
    }

    /**
     * 读取文件内容
     * @param {String} path 
     * @param {String} type 
     * @returns 
     */
    readFiles(path, type) {
        try {
            const data = fs.readFileSync(path, type);
            return data;
        } catch (error) {
            handlerError(error);
            return false;
        }
    }

    /**
     * 调用编译命令
     * @returns 
     */
    async commendMake() {
        return new Promise((resolve, reject) => {
            let errStr = '';
            this.progress = spawn('make', [`-j${cpus ? cpus.length * 2 : '99'}`, '-C', './LB_USER'], { cwd: DIR });

            this.progress.stderr.on('data', (err) => errStr += err.toString());

            this.progress.on('close', (code, signal) => {
                if (code === 0) {
                    resolve(true);
                } else {
                    reject(errStr);
                }
            });
        });
    }

    /**
     * 将生成的C代码写入特定的C文件
     * @param {String} codeStr 
     * @param {String} taskStr 
     * @param {String} myStr 
     * @returns 
     */
    handleCode(codeStr, taskStr, myStr) {
        const str = Task_Info(taskStr);
        const newStr = codeStr + str;
        const code = headMain(newStr, myStr);
        const writeAppRes = this.writeFiles(APLICATION, code);
        return writeAppRes;
    }

    /**
     * 运行编译器参数是传入的C语言代码
     * @param {Array} buffer 
     * @param {String} myBlock 
     * @param {Object} selectedExe 
     * @param {String} verifyType 
     */
    runGcc(buffer, myBlock, selectedExe, verifyType) {
        let codeStr = '', taskStr = '';
        buffer.map((el, index) => {
            if (el) {
                codeStr += Task_Stack(el, index);
                taskStr += Task_Info_Item(index);
            }
        });

        const appRes = this.handleCode(codeStr, taskStr, myBlock);

        if (this.progress && this.progress.exitCode !== 0) this.progress.kill('SIGKILL');

        //编译
        if (appRes) {
            this.commendMake().then(() => {
                ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.COMMUNICATION.GETFILES, sendParams: { verifyType, selectedExe } });
            }).catch(e => {
                handlerError(e);
                ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.ERROR.TRANSMISSION });
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
    sendSerial(verifyType, bufferList, myBlock, selectedExe) {
        if (verifyType === SOURCE) {
            ipcRender({
                sendName: ipc_Renderer.SEND_OR_ON.COMMUNICATION.GETFILES,
                sendParams: { verifyType: SOURCE_MUSIC, selectedExe },
                eventName: ipc_Renderer.RETURN.COMMUNICATION.SOURCE.NEXTFILE,
                callback: (event, data) => {
                    ipcRender({sendName: ipc_Renderer.SEND_OR_ON.COMMUNICATION.GETFILES, sendParams: { subFileIndex: data.subFileIndex, verifyType: data.fileVerifyType, clearFilesObj: data.clearFilesObj }});
                }
            });
        } else {
            this.runGcc(bufferList, myBlock, selectedExe, verifyType);
        }
    }
}


export default new Compile();