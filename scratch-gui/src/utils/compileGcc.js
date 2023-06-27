import { getFiles } from "./readFile";
const fs = window.fs;
const path = window.path;
const process = window.child_process;
const makeCommand = 'make';
const makeOptions = ['all'];
const makefile = path.join(__dirname, 'makefile');
const command = `${makeCommand} -f "${makefile}" ${makeOptions.join(' ')}`;

const str =
    "#include <stdio.h>\n" + 'int main()\n {\n printf("Hello, World!"); \n}';

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

function processCMD(commend, callback) {
    process.exec(commend, (error, stdout, stderr) => {
        if (error) return callback(error);
        return callback(error, stdout);
    });
}

function compile(file) {
    let ph = "./gcc-arm-none-eabi/bin";
    let gcc = `cd ${ph} && ${command}`;
    processCMD(gcc, (error, stdout) => {
        if (error) return console.error(`exec error: ${error}`);
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        // getFiles(path.join(ph, file.replace(/\.+c/g, ".bin")));
        getFiles("./gcc-arm-none-eabi/bin/codes/cake/LED_Power_Teset.bin");
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
