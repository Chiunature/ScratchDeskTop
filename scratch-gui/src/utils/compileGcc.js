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
    let ph = `./mingw64/bin`;
    process.exec(
        `gcc -o ${file.replace(/\.+c/g, ".bin")} ${file}`,
        (error, stdout, stderr) => {
            console.log(error, stdout, stderr);
        }
    );
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
