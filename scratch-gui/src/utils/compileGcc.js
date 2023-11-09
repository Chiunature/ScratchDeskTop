
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
import { headMain, Task_Info, Task_Stack, Task_Info_Item } from "../config/js/ProgrammerTasks.js";
import { SOURCE, SOURCE_MUSIC, SOURCE_APP, SOURCE_BOOT, SOURCE_VERSION, SOURCE_CONFIG } from "../config/json/verifyTypeConfig.json";
import { DIR, APLICATION } from "../config/json/LB_USER.json";
import { verifyBinType } from "../config/js/verify.js";

const fs = window.fs;
const { spawn } = window.child_process;
const { EventEmitter } = window.events;
const eventEmitter = new EventEmitter();
const cpus = window.os.cpus();

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

    //将生成的C代码写入特定的C文件
    handleCode(codeStr, taskStr, myStr) {
        const str = Task_Info(taskStr);
        const newStr = codeStr + str;
        const code = headMain(newStr, myStr);
        const writeAppRes = this.writeFiles(APLICATION, code);
        return writeAppRes;
    }

    //运行编译器参数是传入的C语言代码
    runGcc(buffer, myBlock, isUpload = false) {
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
            this.commendMake().then(result => {
                this.startSend = result;
                if (result) eventEmitter.emit(this.eventName);
                //去掉上一个注册的方法避免重复触发
                if (this.eventName) eventEmitter.removeAllListeners([this.eventName]);
            }).catch(e => {
                handlerError(e);
                if (isUpload) ipc({ sendName: "transmission-error" });
            });
        }
    }

    //获取bin文件数据准备通信
    readBin(verifyType) {
        try {
            const { fileData, fileName } = verifyBinType({ verifyType, filesObj: this.filesObj, filesIndex: this.filesIndex, readFiles: this.readFiles.bind(this), writeFiles: this.writeFiles.bind(this) });

            ipc({
                sendName: "writeData",
                sendParams: { binData: fileData, verifyType, fileName, filesIndex: this.filesIndex, filesLen: this.filesObj.filesLen },
                eventName: "nextFile",
                callback: (event, data) => {
                    if(data.index) this.filesIndex = data.index;
                    if(data.filesObj) this.filesObj = data.filesObj;
                    this.readBin(data.fileVerifyType);
                }
            });

        } catch (error) {
            handlerError(error);
            ipc({ sendName: "transmission-error" });
        }
    }

    sendSerial(verifyType) {
        if (verifyType === SOURCE) {
            this.readBin(SOURCE_MUSIC);
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