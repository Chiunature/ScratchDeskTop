import { getFiles } from "./readFile";
const fs = window.fs;
const path = window.path;
const process = window.child_process;
const makeCommand = 'make';
const makeOptions = ['all'];
const cmd = `cd ./gcc-arm-none-eabi/bin/myLED&&${makeCommand} ${makeOptions.join(' ')}`;

// const str ="#include <stdio.h>\n" + 'int main()\n {\n printf("Hello, World!"); \n}';

const str = 'int main()\n {\n printf("Hello, World!"); \n}';

//将c语言代码写入文件
function writeFiles(buffer, callback) {
    fs.mkdir(`./gcc-arm-none-eabi/bin/codes/cake/`, { recursive: true }, (err) => {
        if (err) return callback(err);
        let cname = `./codes/cake/test${Date.now().toString(36)}.c`;
        let file = path.join(`./gcc-arm-none-eabi/bin`, cname);
        fs.writeFile(file, buffer, function (err) {
            return callback(err, cname);
        });
    });
}

//执行cmd命令
function processCMD(commend, callback) {
    process.exec(commend, (error, stdout, stderr) => {
        if (error) return callback(error);
        return callback(error, stdout);
    });
}

//获取Bin文件数据准备通信
function compile(file) {
    processCMD(cmd, (error, stdout) => {
        if (error) return console.error(`exec error: ${error}`);
        console.log(`stdout: ${stdout}`);
        // getFiles(path.join(ph, file.replace(/\.+c/g, ".bin")));
        getFiles("./gcc-arm-none-eabi/bin/myLED/build/myLED.bin");
    });
}


//运行编译器参数是传入的C语言代码
function runGcc(buffer = str) {
    writeFiles(buffer, (err, file) => {
        if (err) return;
        console.info("write success");
        if (file) compile(file);
    });
}

export { runGcc };
