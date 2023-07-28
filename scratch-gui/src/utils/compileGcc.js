import { handlerError } from "./ipcRender";
const fs = window.fs;
const path = window.path;
const process = window.child_process;
const makeCommand = 'make';
const makefile = './LB_USER';
const cmd = `cd ./gcc-arm-none-eabi/bin&&${makeCommand} -C ${makefile}`;

//将c语言代码写入文件
function writeFiles(buffer, callback) {
    let file = path.join(`./gcc-arm-none-eabi/bin/LB_USER/Src`, 'Aplication.c');
    fs.writeFile(file, buffer, (err) => {
        return callback(err);
    });
}

//执行cmd命令
function processCMD(commend, callback) {
    process.exec(commend, (error, stdout) => {
        if (error) return handlerError(error);
        return callback(stdout);
    });
}

//获取Bin文件数据准备通信
function compile() {
    processCMD(cmd, (stdout) => {
        // console.log(`stdout: ${stdout}`);
        try {
            let data = fs.readFileSync("./gcc-arm-none-eabi/bin/LB_USER/build/LB_USER.bin");
            window.electron.ipcRenderer.send("writeData", data);
        } catch (error) {
            handlerError(error);
        }
    });
}

//运行编译器参数是传入的C语言代码
function runGcc(buffer) {
    const pattern = /(int main\s*\(\s*void\s*\)|int main\s*\(\s*\))\s*{([\s\S]+)\}/g;
    let match = pattern.exec(buffer);
    let code = `#include "main.h"\nvoid USER_Aplication(void)\n{\n${match[2]}\n}`;
    writeFiles(code, (err) => {
        if (err) return handlerError(err);
        console.info("write success");
        compile();
    });
}

export { runGcc };
