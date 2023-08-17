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
        try {
            fs.writeFileSync(path, buffer);
            return true;
        } catch (error) {
            return false;
        }
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
    programmerTasks(filePath, taskStr, headStr) {
        let readRes = fs.readFileSync(filePath, 'utf8');
        let arr = readRes.split(';');
        let newStr = "\nTask_Info user_task[] = {" + taskStr + "\n}";
        let newArr = arr.reduce((pre, el) => {
            if (el.search("extern void Task") == -1) {
                if (el.search("Task_Info user_task") != -1) el = newStr;
                pre.push(el);
            }
            return pre;
        }, []);
        newArr[0] = newArr[0] + ";" + headStr;
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
    runGcc(buffer, flag = false) {
        startSend = flag;
        let codeStr = '', taskStr = '', headStr = '';
        buffer.map((el, index) => {
            if (el) {
                headStr += `\r\nextern void Task${index}(void *parameter)${index === buffer.length - 1 ? '' : ';'}`;
                codeStr += `Task${index}(void *parameter)\n{\nwhile (1)\n{\n${el}\nvTaskDelay(50);\n}\n}\n`;
                taskStr += `\n{\r\n\t\t.Task_Name = "Task${index}",\r\n\t\t.Task_StackSize = 128,\r\n\t\t.UBase_Proier = 6,\r\n\t\t.TaskFunction = Task${index},\r\n},\n`;
            }
        });

        let appRes = this.handleCode(codeStr);
        let taskRes = this.handleTask(headStr, taskStr);

        //编译
        if (appRes && taskRes) this.executeFunction(this.compile);
    }

    sendToSerial() {
        if (!startSend) {
            eventEmitter.on('success', () => window.electron.ipcRenderer.send("writeData"));
        } else {
            window.electron.ipcRenderer.send("writeData");
        }
    }
}

//全局监听错误信息
eventEmitter.on('error', (res) => {
    handlerError(res);
    window.electron.ipcRenderer.send("transmission-error");
});

export default Compile;
