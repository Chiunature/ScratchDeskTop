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
    writeFiles(buffer) {
        let file = path.join(`./gcc-arm-none-eabi/bin/LB_USER/Src`, 'Aplication.c');
        fs.writeFileSync(file, buffer);
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
            console.log(res);
            startSend = true;
        }).catch(error => {
            handlerError(error);
        });
    }

    //运行编译器参数是传入的C语言代码
    runGcc(buffer, flag = false) {
        startSend = flag;
        const pattern = /(int main\s*\(\s*void\s*\)|int main\s*\(\s*\))\s*{([\s\S]+)\}/g;
        let match = pattern.exec(buffer);
        if (!buffer || match[2] === '\n\n') return;
        let code = `#include "main.h"\nvoid Matrix_LampTask(void *parameter)\n{while (1)\n{\n${match[2]}\nvTaskDelay(50);\n}\n}`;
        let res = this.writeFiles(code);
        if (res) this.executeFunction(this.compile);
    }

    //获取bing文件数据准备通信
    readBin() {
        let data = fs.readFileSync("./gcc-arm-none-eabi/bin/LB_USER/build/LB_USER.bin");
        window.electron.ipcRenderer.send("writeData", data);
    }

    sendToSerial() {
        if (!startSend) {
            eventEmitter.on('success', (res) => {
                this.readBin();
            });
        } else {
            this.readBin();
        }
    }
}


export default Compile;
