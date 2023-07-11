import { getFiles } from "./readFile";
import { handlerError } from "./ipcRender";
const fs = window.fs;
const path = window.path;
const process = window.child_process;

const makeCommand = 'make';
const makefile = './myLED';
const cmd = `cd ./gcc-arm-none-eabi/bin&&${makeCommand} -C ${makefile}`;

//将c语言代码写入文件
function writeFiles(buffer, callback) {
    let file = path.join(`./gcc-arm-none-eabi/bin/myLED/USER/`, 'main.c');
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
        console.log(`stdout: ${stdout}`);
        // getFiles(path.join(ph, file.replace(/\.+c/g, ".bin")));
        getFiles("./gcc-arm-none-eabi/bin/myLED/build/myLED.bin");
    });
}

//运行编译器参数是传入的C语言代码
function runGcc(buffer) {
    const pattern = /(int main\s*\(\s*void\s*\)|int main\s*\(\s*\))\s*{([\s\S]+)\}/g;
    let match = pattern.exec(buffer);
    let code = `#include "stm32f10x.h"\n#include "stdio.h"\n#include "stm32f10x_gpio.h"\n#include "delay.h"\n#include "stm32f10x_usart.h"\n#define LED_Troger (*(void (*)())0x8030001)\n#define Delay_500ms (*(void (*)())0x8030081)\n#define printf_usart (*(void (*)(char *))0x8030161)\nint main(void) {\n SCB->VTOR = FLASH_BASE | 0x20000;\nDelay_500ms();\nDelay_500ms();\nprintf_usart(" jump to App1 OK!");\n${match[2]}\nwhile (1){\n LED_Troger();\n}\n}`;
    writeFiles(code, (err) => {
        if (err) return handlerError(err);
        console.info("write success");
        compile();
    });
}

export { runGcc };
