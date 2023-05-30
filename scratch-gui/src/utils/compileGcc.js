/*
 * @Description: New features
 * @Author: jiang
 * @Date: 2023-05-29 14:28:01
 * @LastEditors: jiang
 * @LastEditTime: 2023-05-30 10:10:06
 */
const fs = window.fs;
const path = window.path;
const process = window.child_process;
const str =
    "#include <stdio.h>\n" + 'int main()\n {\n printf("Hello, World!"); \n}';

function writeFile(buffer, callback) {
    fs.mkdir(`./codes/cake/`, { recursive: true }, (err) => {
        if (err) return callback(err);
        let file = `./codes/cake/` + `test${Date.now().toString(36)}.c`;
        fs.writeFile(file, buffer, function (err) {
            return callback(err, file);
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
    let ph = path.resolve(__dirname, "/scratch/scratch-gui/mingw64/bin");
    //先获取环境变量看看有没有设置
    processCMD(`set path`, (error, stdout) => {
        if (error) return;
        let res = stdout.slice(5).split(";");
        let p = ph.replace(/\//g, "\\\\");
        let gcc = `gcc -o ${file.replace(/\.+c/g, ".bin")} ${file}`;
        //如果设置了就跳过直接执行编译，没有就设置之后再执行编译
        if (res.includes(p)) {
            processCMD(gcc, (error, stdout) => {
                console.log("设置了环境变量跳过直接执行编译=>", error, stdout);
            });
            return;
        } else {
            processCMD(`setx "path" "${ph};%path%"`, (error, stdout) => {
                if (error) return;
                processCMD(gcc, (error, stdout) => {
                    console.log(error, stdout);
                });
            });
        }
    });
}

//运行编译器参数是传入的C语言代码
function runGcc(buffer = str) {
    writeFile(buffer, (err, file) => {
        if (err) return;
        console.info("write success");
        if (file) compile(file);
    });
}

export { runGcc };
