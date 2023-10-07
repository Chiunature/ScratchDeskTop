
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
import { handlerError, ipc } from "./ipcRender";
import { headMain, Task_Info, Task_Stack, Task_Info_Item, User_Aplication } from "../config/js/ProgrammerTasks.js";
import { SOURCE } from "../config/json/verifyTypeConfig.json";
import LB_FWLIB from "../config/json/LB_FWLIB.json";

const fs = window.fs;
const path = window.path;
const process = window.child_process;
const { EventEmitter } = window.events;

const makeCommand = 'make';
const makefile = './LB_USER';
const LB_USER = './gcc-arm-none-eabi/bin/LB_USER/Src';
const cmd = `cd ./gcc-arm-none-eabi/bin&&${makeCommand} -C ${makefile}`;
const eventEmitter = new EventEmitter();

class Compile{

    constructor() {
        this.currentProcess;
        this.filesIndex = 0;
        this.startSend = true;
        this.filesObj = {};
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

    //执行cmd命令
    processCMD(commend) {
        if (this.currentProcess && this.currentProcess.exitCode === null) this.currentProcess.kill(this.currentProcess.pid, 'SIGINT');
        return new Promise((resolve, reject) => {
            this.currentProcess = process.exec(commend, (error, stdout) => {
                if (error) reject(error);
                else resolve(stdout);
            });
        });
    }

    //编译
    compile(isUpload) {
        this.processCMD(cmd).then(res => {
            this.startSend = true;
            if (isUpload) eventEmitter.emit('success');
        }).catch(error => {
            handlerError(error);
            if (isUpload) ipc({sendName: "transmission-error"});
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
        newArr.splice(1, 0, ...headList);
        return newArr.join(";");
    }

    //将生成的C代码写入特定的C文件
    handleCode(codeStr) {
        const code = headMain(codeStr);
        const filePath = path.join(LB_USER, 'Aplication.c');
        const writeAppRes = this.writeFiles(filePath, code);
        return writeAppRes;
    }

    //并发任务操作
    handleTask(headStr, taskStr) {
        const taskFile = path.join(LB_USER, 'ProgrammerTasks.c');
        const parserCode = this.programmerTasks(taskFile, taskStr, headStr);
        const writeTaskRes = this.writeFiles(taskFile, parserCode);
        return writeTaskRes;
    }

    //运行编译器参数是传入的C语言代码
    runGcc(buffer, isUpload = false) {
        let codeStr = '', taskStr = '', headStr = '';
        buffer.map((el, index) => {
            headStr += User_Aplication(index);
            codeStr += Task_Stack(el, index);
            taskStr += Task_Info_Item(index);
        });

        const appRes = this.handleCode(codeStr);
        const taskRes = this.handleTask(headStr, taskStr);
        console.log(appRes, taskRes);

        //编译
        if (appRes && taskRes) this.compile(isUpload);
    }

    //获取bing文件数据准备通信
    readBin(verifyType) {
        try {
            let fileData, fileName;
            if(verifyType === SOURCE) {
                if(!this.filesObj) {
                    this.filesObj.filesList = fs.readdirSync(LB_FWLIB.MUSIC);
                    this.filesObj.filesLen = this.filesObj.filesList.length;
                }
                fileData = this.readFiles(`${LB_FWLIB.MUSIC}/${this.filesObj.filesList[this.filesIndex]}`);
                fileName = this.filesObj.filesList[this.filesIndex].slice(0, -4);
            }else {
                fileName = this.readFiles(LB_FWLIB.BOOT, 'utf8');
                fileData = this.readFiles(LB_FWLIB.BIN);
                this.writeFiles(LB_FWLIB.APP, fileData);
            }

            ipc({
                sendName: "writeData", 
                sendParams: { binData: fileData, verifyType, fileName, filesIndex: this.filesIndex, filesLen: this.filesObj.filesLen }, 
                eventName: "nextFile", 
                callback: (event, data) => {
                    this.filesIndex = data.index;
                    if(this.filesIndex <= this.filesObj.filesLen) this.readBin(SOURCE);
            }});

        } catch (error) {
            handlerError(error);
            ipc({sendName: "transmission-error"});
        }
    }

    sendSerial(verifyType) {
        if(verifyType === SOURCE) {
            this.readBin(verifyType);
        }else {
            if (!this.startSend) {
                eventEmitter.on('success', () => this.readBin(verifyType));
            }else {
                this.readBin(verifyType);
            }
        }
    }
}


export default new Compile();