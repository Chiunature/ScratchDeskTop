/*
 * @Description: New features
 * @Author: jiang
 * @Date: 2023-05-29 14:28:01
 * @LastEditors: jiang
 * @LastEditTime: 2023-05-31 11:40:42
 */
const fs = window.fs;
const path = window.path;
const process = window.child_process;
import { getFiles } from "./readFile";

const str =
    "#include <stdio.h>\n" + 'int main()\n {\n printf("Hello, World!"); \n}';

function writeFile(buffer, callback) {
    fs.mkdir(`./mingw64/bin/codes/cake/`, { recursive: true }, (err) => {
        if (err) return callback(err);
        let cname = `./codes/cake/test${Date.now().toString(36)}.c`;
        let file = path.join(`./mingw64/bin`, cname);
        fs.writeFile(file, buffer, function (err) {
            return callback(err, cname);
        });
    });
}

function processCMD(commend, callback) {
    process.exec(commend, (error, stdout, stderr) => {
        if (error) return callback(error);
        return callback(error, stdout);
    });
}

function compile(file) {
    let ph = "./mingw64/bin";
    let gcc = `cd ${ph} && gcc -o ${file.replace(/\.+c/g, ".bin")} ${file}`;
    processCMD(gcc, (error, stdout) => {
        if (error) throw error;
        getFiles(path.join(ph, file.replace(/\.+c/g, ".bin")));
    });
}

//运行编译器参数是传入的C语言代码
function runGcc(buffer = str) {
    writeFile(buffer, (err, file) => {
        if (err) throw err;
        console.info("write success");
        if (file) compile(file);
    });
}

export { runGcc };
