
import { handlerError } from "./ipcRender";
const fs = window.fs;
const path = window.path;
const process = window.child_process;
const { EventEmitter } = window.events;
const electron = window.electron;

const makeCommand = 'make';
const makefile = './LB_USER';
const cmd = `cd ./gcc-arm-none-eabi/bin&&${makeCommand} -C ${makefile}`;
const eventEmitter = new EventEmitter();

class Compile{

    constructor() {
        this.currentProcess;
        this.startSend = true;
    }

    //控制编译前、编译中、编译后通信
    setStartSend(val) {
        this.startSend = val;
    }

    //将c语言代码写入文件
    writeFiles(path, buffer) {
        try {
            fs.writeFileSync(path, buffer);
            return true;
        } catch (error) {
            handlerError(error);
            return false;
        }
    }

    //执行cmd命令
    processCMD(commend) {
        if (this.currentProcess) this.currentProcess.kill();
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
            console.log(res);
            this.startSend = true;
            eventEmitter.emit('success');
        }).catch(error => {
            this.startSend = true;
            handlerError(error);
            if (isUpload) electron.ipcRenderer.send("transmission-error");
        });
    }

    //处理任务
    programmerTasks(filePath, taskStr, headStr) {
        let readRes = fs.readFileSync(filePath, 'utf8');
        let arr = readRes.split(';');
        let newStr = "\nTask_Info user_task[] = {" + taskStr + "\n}";
        let newArr = arr.reduce((pre, el) => {
            if (el.search("extern void Task") == -1) {
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
        let code = `#include "main.h"\n${codeStr}\n`;
        let filePath = path.join(`./gcc-arm-none-eabi/bin/LB_USER/Src`, 'Aplication.c');
        let writeAppRes = this.writeFiles(filePath, code);
        return writeAppRes;
    }

    //并发任务操作
    handleTask(headStr, taskStr) {
        let taskFile = path.join(`./gcc-arm-none-eabi/bin/LB_USER/Src`, 'ProgrammerTasks.c');
        let parserCode = this.programmerTasks(taskFile, taskStr, headStr);
        let writeTaskRes = this.writeFiles(taskFile, parserCode);
        return writeTaskRes;
    }

    //运行编译器参数是传入的C语言代码
    runGcc(buffer, isUpload = false) {
        let codeStr = '', taskStr = '', headStr = '';
        buffer.map((el, index) => {
            headStr += `\r\nextern void Task${index}(void *parameter);`;
            codeStr += `Task${index}(void *parameter)\n{\n${el}\nwhile (1)\n{\nvTaskDelay(50);\n}\n}\n`;
            taskStr += `\n{\r\n\t\t.Task_Name = "Task${index}",\r\n\t\t.Task_StackSize = 128,\r\n\t\t.UBase_Proier = 6,\r\n\t\t.TaskFunction = Task${index},\r\n},\n`;
        });

        let appRes = this.handleCode(codeStr);
        let taskRes = this.handleTask(headStr, taskStr);
        console.log(appRes, taskRes);

        //编译
        if (appRes && taskRes) this.compile(isUpload);
    }

    //获取bing文件数据准备通信
    readBin(verifyType) {
        try {
            let fileData, flag, fileName;
            if(verifyType === 'SOURCE') {
                let str = '';
                let files = fs.readdirSync("./gcc-arm-none-eabi/bin/LB_FWLIB/music");
                files.map(el => {
                    if (el.indexOf("Meow") != -1) str = `./gcc-arm-none-eabi/bin/LB_FWLIB/music/${el}`;
                });
                fileData = fs.readFileSync(str);
                fileName = "Meow";
            }else {
                fileName = fs.readFileSync("./gcc-arm-none-eabi/bin/LB_FWLIB/boot/registryApp.txt", 'utf8');
                fileData = fs.readFileSync("./gcc-arm-none-eabi/bin/LB_USER/build/LB_USER.bin");
                flag = this.writeFiles("./gcc-arm-none-eabi/bin/LB_FWLIB/app/LB_USER.bin", fileData);
            }

            if(fileData) electron.ipcRenderer.send("writeData", { binData: fileData, verifyType, fileName });

        } catch (error) {
            handlerError(error);
            electron.ipcRenderer.send("transmission-error");
        }
        
    }

    sendSerial(verifyType) {
        if(verifyType === 'SOURCE') {
            this.readBin(verifyType);
            return
        }else {
            if (!this.startSend) {
                eventEmitter.on('success', () => this.readBin(verifyType));
                return;
            }else {
                this.readBin(verifyType);
            }
        }
    }
}


export default new Compile();
