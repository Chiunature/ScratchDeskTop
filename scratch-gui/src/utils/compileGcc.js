import { handlerError } from "./ipcRender";
const fs = window.fs;
const path = window.path;
const process = window.child_process;
const { EventEmitter } = window.events;

const makeCommand = 'make';
const makefile = './LB_USER';
const cmd = `cd ./gcc-arm-none-eabi/bin&&${makeCommand} -C ${makefile}`;
const eventEmitter = new EventEmitter();
let currentProcess, startSend;

class Compile {

    //将c语言代码写入文件
    writeFiles(path, buffer) {
        fs.writeFileSync(path, buffer);
        return true;
    }

    executeFunction(fn, ...args) {
        try {
            let result = fn.apply(this, args);
            eventEmitter.emit('success', result);
        } catch (error) {
            eventEmitter.emit('error', error);
        }
    }

    //执行cmd命令
    processCMD(commend) {
        if (currentProcess) currentProcess.kill();
        return new Promise((resolve, reject) => {
            currentProcess = process.exec(commend, (error, stdout) => {
                if (error) reject(error);
                else resolve(stdout);
            });
        });
    }

    //编译
    compile() {
        this.processCMD(cmd).then(res => {
            startSend = true;
        }).catch(error => {
            handlerError(error);
        });
    }

    //处理任务
    programmerTasks() {
        let taskFile = path.join(`./gcc-arm-none-eabi/bin/LB_USER/Src`, 'ProgrammerTasks.c');
        let readRes = fs.readFileSync(taskFile, 'utf8');
        let arr = readRes.split(';');
        console.log(arr[9]);
    }

    //运行编译器参数是传入的C语言代码
    runGcc(buffer, flag = false) {
        startSend = flag;
        //将生成的C代码写入特定的C文件
        let code = `#include "main.h"\nvoid Matrix_LampTask(void *parameter)\n{\nwhile (1)\n{${buffer}vTaskDelay(50);\n}\n}`;
        let filePath = path.join(`./gcc-arm-none-eabi/bin/LB_USER/Src`, 'Aplication.c');
        let writeAppRes = this.writeFiles(filePath, code);
        // this.programmerTasks();
        if (writeAppRes) this.executeFunction(this.compile);
    }

    sendToSerial() {
        if (!startSend) {
            eventEmitter.on('success', (res) => {
                console.log(res);
                window.electron.ipcRenderer.send("writeData");
            });
        } else {
            window.electron.ipcRenderer.send("writeData");
        }
    }
}


export default Compile;
