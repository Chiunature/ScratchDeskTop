const { contextBridge, ipcRenderer, shell } = require("electron");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFile, exec } = require("child_process");
const { cwd } = require("process");
const url = require("url");
const { VERSION } = require("./src/config/json/LB_FWLIB.json");
const { DIR } = require("./src/config/json/LB_USER.json");
const packageJson = require("./package.json");
/*const UseLocalForage = require("./src/utils/useLocalForage");
const store_lf = new UseLocalForage();*/

const Store = require("electron-store");
const store = new Store({
    name: packageJson.name,
});

function setStoreValue(key, value) {
    if (store.has(key)) store.delete(key);
    store.set(key, value);
}

function getStoreValue(key) {
    return store.get(key);
}

function removeStoreValue(key) {
    store.delete(key);
}

function hasStoreValue(key) {
    return store.has(key);
}

/*async function setForage(key, value) {
    await store_lf.setForage(key, value);
}

async function getForage(key) {
    return await store_lf.getForage(key);
}

async function removeForage(key) {
    await store_lf.removeForage(key);
}*/

/**
 * 异步通信
 * @param {String} sendName
 * @param {any} sendParams
 * @returns {Promise}
 */
async function ipcInvoke(sendName, sendParams) {
    return await ipcRenderer.invoke(sendName, sendParams);
}

/**
 * 渲染进程开启事件监听
 * @param {sendName:String, sendParams:Object, eventName:String, callback:Function } param0
 */
function ipcRender({ sendName, sendParams, eventName, callback }) {
    if (sendName) {
        ipcRenderer.send(sendName, sendParams);
    }
    const eventList = ipcRenderer.eventNames();
    if (
        eventName &&
        !eventList.includes(eventName) &&
        typeof callback === "function"
    ) {
        ipcRenderer.on(eventName, (event, arg) => callback(event, arg));
    }
}

/**
 * 去掉渲染进程注册的事件监听
 * @param {String} eventName
 */
function delEvents(eventName) {
    if (!eventName) {
        const eventList = ipcRenderer.eventNames();
        eventList.forEach((item) => {
            ipcRenderer.removeAllListeners([item]);
        });
        return;
    } else if (Array.isArray(eventName)) {
        eventName.forEach((item) => {
            ipcRenderer.removeAllListeners([item]);
        });
        return;
    }
    ipcRenderer.removeAllListeners([eventName]);
}

/**
 * 读取文件内容
 * @returns
 * @param link
 * @param resourcePath
 * @param options
 */
function readFiles(link, resourcePath = cwd(), options = { encoding: "utf8" }) {
    return new Promise((resolve) => {
        fs.readFile(
            path.join(resourcePath, link),
            options.encoding,
            (err, data) => {
                if (err) handlerError(err, resourcePath);
                resolve(err ? false : data);
            }
        );
    });
}

function readFilesAsync(
    link,
    resourcePath = cwd(),
    options = { encoding: "utf8" }
) {
    try {
        const res = fs.readFileSync(path.join(resourcePath, link), options);
        return res;
    } catch (error) {
        handlerError(error, resourcePath);
        return null;
    }
}

/**
 * 将c语言代码写入文件
 * @returns
 * @param link
 * @param data
 * @param resourcePath
 * @param options
 */
function writeFiles(link, data, resourcePath = cwd(), options = {}) {
    return new Promise((resolve) => {
        fs.writeFile(path.join(resourcePath, link), data, options, (err) => {
            if (err) handlerError(err, resourcePath);
            resolve(!err);
        });
    });
}

function replaceFiles(oldFilePath, newFilePath, content) {
    // 删除旧文件
    fs.unlink(oldFilePath, (err) => {
        if (err) {
            if (err) handlerError(err);
        } else {
            console.log("Old file deleted successfully.");

            // 将新文件移动到旧文件的位置
            /*fs.rename(newFilePath, oldFilePath, (err) => {
                if (err) {
                    console.error('Error moving new file to old file location:', err);
                } else {
                    console.log('New file moved to old file location successfully.');
                }
            });*/
            // 创建新文件
            fs.writeFile(newFilePath, content, (err) => {
                if (err) {
                    console.error("Error creating new file:", err);
                } else {
                    console.log("New file created successfully.");
                }
            });
        }
    });
}

/**
 * 删除文件
 * @returns
 * @param link
 * @param resourcePath
 */
function deleteFiles(link, resourcePath = cwd()) {
    return new Promise((resolve) => {
        fs.unlink(path.join(resourcePath, link), (err) => {
            if (err) handlerError(err, resourcePath);
            resolve(!err);
        });
    });
}

/**
 * 调用编译命令
 * @returns
 */
function commendMake(pathCWD = cwd()) {
    return new Promise((resolve, reject) => {
        const targetDir = path.join(pathCWD, DIR);
        if (!fs.existsSync(targetDir)) {
            const errorMsg = `目录不存在: ${targetDir}`;
            handlerError(errorMsg, pathCWD);
            reject(errorMsg);
            return;
        }

        console.log(`执行: python.exe -c 0.py -o 0.py.o 在 ${targetDir}`);
        const child = spawn("python.exe", ["-c", "0.py", "-o", "0.py.o"], {
            cwd: targetDir,
            shell: true, // Windows 可能需要
            stdio: ["ignore", "pipe", "pipe"], // 捕获输出
        });

        // 实时打印输出（替代 execa 的优势）
        child.stdout.on("data", (data) => {
            process.stdout.write(`[编译信息] ${data}`);
        });

        child.stderr.on("data", (data) => {
            process.stderr.write(`[编译错误] ${data}`);
        });

        child.on("error", (err) => {
            handlerError(err.message, pathCWD);
            reject(err);
        });

        child.on("close", (code) => {
            if (code === 0) {
                resolve(true);
            } else {
                reject(new Error(`进程退出，代码: ${code}`));
            }
        });
    });
}

/**
 * 获取硬件版本
 * @returns
 * @param vpath
 */
function getVersion(vpath, verTxt = "/Version.txt") {
    try {
        // 直接使用正确的相对路径
        const fileRelativePath = "LB_FWLIB/version/Version.txt";
        const fullPath = path.join(vpath, fileRelativePath);
        if (!fs.existsSync(fullPath)) {
            console.error("版本文件不存在:", fullPath);
            return null;
        }
        const version = readFilesAsync(fileRelativePath, vpath);
        return version;
    } catch (error) {
        return null;
    }
}

/**
 * 查找文件夹并写入文件
 * @param {String} directory
 * @param {String} filepath
 * @param {NodeJS.ErrnoException & ArrayBufferView} data
 */
function writeFileWithDirectory(directory = cwd(), filepath, data) {
    return new Promise((resolve, reject) => {
        try {
            if (fs.existsSync(directory)) {
                _writeErr(filepath, data);
            } else {
                fs.mkdir(directory, { recursive: true }, () => {
                    _writeErr(filepath, data);
                });
            }
            resolve();
        } catch (error) {
            _writeErr(filepath, data);
            reject();
        }

        function _writeErr(filepath, data) {
            fs.writeFile(filepath, data, (err) => {
                if (err) throw err;
            });
        }
    });
}

/**
 * 获取当前时间
 * @returns
 */
function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

/**
 * 错误处理
 * @param {NodeJS.ErrnoException} error
 * @param resourcePath
 */
async function handlerError(error, resourcePath = cwd()) {
    if (!ArrayBuffer.isView(error) && typeof error !== "string") return;
    const time = getCurrentTime();
    const filepath = `/error_${time}.txt`;
    await writeFileWithDirectory(resourcePath + "/Error", filepath, error);
}

async function getDocxUrl(static_path = cwd(), link, type = "pdf") {
    const href = path.join(static_path, link);
    if (type === "pdf") {
        ipcRenderer.send("pdf", { href, type });
    } else {
        const res = await shell.openPath(href);
        if (res.length > 0) {
            exec(href);
        }
    }
}

function getMediaPath(link = "") {
    return url.format({
        pathname: path.join(link, "./resources/static/blocks-media/"),
        protocol: "file:",
        slashes: true,
    });
}

async function changeFileName(oldPath, newPath) {
    fs.cp(oldPath, newPath, (err) => {
        if (err) {
            console.error("Error creating new file:", err);
        } else {
            console.log("New file created successfully.");
            /* fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('文件名已被修改');
                }
            }); */
        }
    });
}

function FileIsExists(filePath) {
    return new Promise((resolve) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            resolve(!err);
        });
    });
}

async function sleep(time) {
    await sleepFunc(time).next().value;

    function* sleepFunc(timer) {
        yield new Promise((resolve) => setTimeout(resolve, timer));
    }
}

function getHomeDir() {
    return new Promise((resolve) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        const rsName = `${year}${month}${day}`;
        const homedir = path.join(os.homedir(), "Documents");
        const dir = homedir + "\\NEW-AI\\" + rsName;

        try {
            if (fs.existsSync(dir)) {
                resolve({ homedir: dir, rsName });
            } else {
                fs.mkdir(dir, { recursive: true }, () => {
                    resolve({ homedir: dir, rsName });
                });
            }
        } catch (err) {
            console.error(err);
        }
    });
}

function openCacheDir() {
    const homedir = path.join(os.homedir(), "Documents");
    const dir = homedir + "\\NEW-AI\\";
    shell.openPath(dir);
}

function compareSize(file, size, pathCWD = cwd()) {
    try {
        const stats = fs.statSync(path.join(pathCWD, file));
        if (typeof stats.size === "number" && stats.size >= size * 1024) {
            // console.log('文件大小超过16KB');
            return true;
        } else {
            // console.log('文件大小未超过16KB');
            return false;
        }
    } catch (err) {
        return false;
    }
}

function getFileSize(file, pathCWD = cwd()) {
    try {
        const stats = fs.statSync(path.join(pathCWD, file));
        return stats.size;
    } catch (err) {
        return false;
    }
}

contextBridge.exposeInMainWorld("myAPI", {
    readFiles,
    writeFiles,
    deleteFiles,
    ipcInvoke,
    delEvents,
    ipcRender,
    commendMake,
    handlerError,
    getCurrentTime,
    setStoreValue,
    getStoreValue,
    removeStoreValue,
    hasStoreValue,
    getDocxUrl,
    getMediaPath,
    getVersion,
    replaceFiles,
    changeFileName,
    FileIsExists,
    readFilesAsync,
    onUpdate: (callback) => ipcRenderer.on("update", callback),
    onGetVersion: async () => await ipcInvoke("app-version"),
    sleep,
    openExternal: (url) => shell.openExternal(url),
    getHomeDir,
    openCacheDir,
    compareSize,
    getFileSize,
});
