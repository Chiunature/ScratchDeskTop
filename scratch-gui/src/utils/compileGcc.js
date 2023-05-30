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
            return callback(file, err);
        });
    });
}

function compile(file) {
    let ph = path.resolve(__dirname, "/scratch/scratch-gui/mingw64/bin");
    //先获取环境变量看看有没有设置
    process.exec(`set path`, (error, stdout, stderr) => {
        let res = stdout.slice(5).split(";");
        let p = ph.replace(/\//g, "\\\\");
        //如果设置了就跳过直接执行编译，没有就设置之后再执行编译
        if (res.includes(p)) {
            process.exec(
                `gcc -o ${file.replace(/\.+c/g, ".bin")} ${file}`,
                (error, stdout, stderr) => {
                    console.log(error, stdout, stderr);
                }
            );
            return;
        } else {
            process.exec(
                `setx "path" "${ph};%path%"`,
                (error, stdout, stderr) => {
                    if (error) return;
                    process.exec(
                        `gcc -o ${file.replace(/\.+c/g, ".bin")} ${file}`,
                        (error, stdout, stderr) => {
                            console.log(error, stdout, stderr);
                        }
                    );
                }
            );
        }
    });
}

//运行编译器参数是传入的C语言代码
function runGcc(buffer = str) {
    writeFile(buffer, (file, err) => {
        if (err) console.error(err);
        console.info("write success");
        if (file) compile(file);
    });
}

export { runGcc };
