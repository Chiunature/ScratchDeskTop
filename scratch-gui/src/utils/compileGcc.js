
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
import { handlerError, ipc, getCurrentTime } from "./ipcRender";
import { headMain, Task_Info, Task_Stack, Task_Info_Item, User_Aplication } from "../config/js/ProgrammerTasks.js";
import { SOURCE } from "../config/json/verifyTypeConfig.json";
import { MUSIC, BOOT, BIN, APP } from "../config/json/LB_FWLIB.json";
import { DIR, APLICATION, PROGRAMMERTASKS } from "../config/json/LB_USER.json";

const fs = window.fs;
const { spawn } = window.child_process;
const { EventEmitter } = window.events;
const eventEmitter = new EventEmitter();

class Compile {

    constructor() {
        this.filesIndex = 0;
        this.startSend = true;
        this.filesObj = {};
        this.eventName;
        this.progress;
    }

    //控制编译前、编译中、编译后通信
    setStartSend(val) {
        this.startSend = val;
    }

    //将c语言代码写入文件
    writeFiles(path, type) {
        try {
            fs.writeFileSync(path, type);
            return true;
        } catch (error) {
            handlerError(error);
            return false;
        }
    }

    //读取文件内容
    readFiles(path, type) {
        try {
            const data = fs.readFileSync(path, type);
            return data;
        } catch (error) {
            handlerError(error);
            return false;
        }
    }

    //调用编译命令
    commendMake() {
        return new Promise((resolve, reject) => {
            let errStr = '';
            this.progress = spawn('make', [`-j99`, '-C', './LB_USER'], { cwd: DIR });

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

    //处理任务
    programmerTasks(filePath, taskStr, headStr) {
        let readRes = this.readFiles(filePath, 'utf8');
        const arr = readRes.split(';');
        const newStr = Task_Info(taskStr);
        let newArr = arr.reduce((pre, el) => {
            if (el.search("extern void User_Aplication") == -1) {
                if (el.search("Task_Info user_task") != -1) {
                    el = newStr;
                }
                pre.push(el);
            }
            return pre;
        }, []);
        let headList = headStr.split(';');
        headList.splice(-1, 1);
        newArr.splice(0, 0, ...headList);
        return newArr.join(";");
    }

    //将生成的C代码写入特定的C文件
    handleCode(codeStr) {
        const code = headMain(codeStr);
        const writeAppRes = this.writeFiles(APLICATION, code);
        return writeAppRes;
    }

    //并发任务操作
    handleTask(headStr, taskStr) {
        const parserCode = this.programmerTasks(PROGRAMMERTASKS, taskStr, headStr);
        const writeTaskRes = this.writeFiles(PROGRAMMERTASKS, parserCode);
        return writeTaskRes;
    }

    //运行编译器参数是传入的C语言代码
    runGcc(buffer, isUpload = false) {
        let codeStr = taskStr = headStr = '';
        buffer.map((el, index) => {
            headStr += User_Aplication(index);
            codeStr += Task_Stack(el, index);
            taskStr += Task_Info_Item(index);
        });
        const appRes = this.handleCode(codeStr);
        const taskRes = this.handleTask(headStr, taskStr);

        if (this.progress && this.progress.exitCode !== 0) this.progress.kill('SIGKILL');

        //编译
        if (appRes && taskRes) {
            this.commendMake().then(result => {
                this.startSend = true;
                if (isUpload && this.startSend) eventEmitter.emit(this.eventName);
                //去掉上一个注册的方法避免重复触发
                if (this.eventName) eventEmitter.removeAllListeners([this.eventName]);
            }).catch(e => {
                handlerError(e);
                if (isUpload) ipc({ sendName: "transmission-error" });
            });
        }
    }

    //获取bing文件数据准备通信
    readBin(verifyType) {
        try {
            let fileData, fileName;
            if (verifyType === SOURCE) {
                if (!this.filesObj) {
                    this.filesObj.filesList = fs.readdirSync(MUSIC);
                    this.filesObj.filesLen = this.filesObj.filesList.length;
                }
                fileData = this.readFiles(`${MUSIC}/${this.filesObj.filesList[this.filesIndex]}`);
                fileName = this.filesObj.filesList[this.filesIndex].slice(0, -4);
            } else {
                fileName = this.readFiles(BOOT, 'utf8');
                fileData = this.readFiles(BIN);
                this.writeFiles(APP, fileData);
            }

            ipc({
                sendName: "writeData",
                sendParams: { binData: fileData, verifyType, fileName, filesIndex: this.filesIndex, filesLen: this.filesObj.filesLen },
                eventName: "nextFile",
                callback: (event, data) => {
                    this.filesIndex = data.index;
                    if (this.filesIndex <= this.filesObj.filesLen) this.readBin(SOURCE);
                }
            });

        } catch (error) {
            handlerError(error);
            ipc({ sendName: "transmission-error" });
        }
    }

    sendSerial(verifyType) {
        if (verifyType === SOURCE) {
            this.readBin(verifyType);
        } else {
            if (!this.startSend) {
                this.eventName = 'success' + getCurrentTime();
                eventEmitter.on(this.eventName, () => this.readBin(verifyType));
            } else {
                this.readBin(verifyType);
            }
        }
    }
}


export default new Compile();