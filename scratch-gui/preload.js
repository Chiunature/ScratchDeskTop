const { contextBridge, ipcRenderer } = require('electron');
const fs = require("fs");
const path = require("path");
const { spawn, exec } = require("child_process");
const { cwd } = require('process');
const url = require("url");
const { VERSION } = require("./src/config/json/LB_FWLIB.json");
const { DIR } = require("./src/config/json/LB_USER.json");
const Store = require('electron-store');
const store = new Store();


function setStoreValue(key, value) {
    if (store.has(key)) store.delete(key);
    store.set(key, value);
}

function getStoreValue(key) {
    const value = store.get(key);
    return value;
}

function removeStoreValue(key) {
    store.delete(key);
}

function hasStoreValue(key) {
    return store.has(key);
}


/**
 * 异步通信
 * @param {String} sendName
 * @param {any} sendParams
 * @returns {Promise}
 */
async function ipcInvoke(sendName, sendParams) {
    const result = await ipcRenderer.invoke(sendName, sendParams);
    return result
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
    if (eventName && !eventList.includes(eventName) && typeof callback === "function") {
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
        eventList.forEach(item => {
            ipcRenderer.removeAllListeners([item]);
        });
        return;
    } else if (Array.isArray(eventName)) {
        eventName.forEach(item => {
            ipcRenderer.removeAllListeners([item]);
        });
        return;
    }
    ipcRenderer.removeAllListeners([eventName]);
}

/**
     * 读取文件内容
     * @param {String} path
     * @param {String} type
     * @returns
     */
function readFiles(link, resourcePath = cwd(), options = { encoding: 'utf-8' }) {
    try {
        const data = fs.readFileSync(path.join(resourcePath, link), options);
        return data;
    } catch (error) {
        handlerError(error, resourcePath);
        return false;
    }
}

/**
     * 将c语言代码写入文件
     * @param {String} path
     * @returns
     */
function writeFiles(link, data, resourcePath = cwd(), options = {}) {
    try {
        fs.writeFileSync(path.join(resourcePath, link), data, options);
        return true;
    } catch (error) {
        handlerError(error, resourcePath);
        return false;
    }
}

function replaceFiles(oldFilePath, newFilePath, content) {
    // 删除旧文件
    fs.unlink(oldFilePath, (err) => {
        if (err) {
            console.error('Error deleting old file:', err);
        } else {
            console.log('Old file deleted successfully.');

            // 将新文件移动到旧文件的位置
            fs.rename(newFilePath, oldFilePath, (err) => {
                if (err) {
                    console.error('Error moving new file to old file location:', err);
                } else {
                    console.log('New file moved to old file location successfully.');
                }
            });
            // 创建新文件
            fs.writeFile(newFilePath, content, (err) => {
                if (err) {
                    console.error('Error creating new file:', err);
                } else {
                    console.log('New file created successfully.');
                }
            });
        }
    });
}

/**
     * 删除文件
     * @param {String} path
     * @returns
     */
function deleteFiles(link, resourcePath = cwd()) {
    // 检测文件是否存在
    fs.access(path.join(resourcePath, link), fs.constants.F_OK, (err) => {
        if (err) {
            console.error('文件不存在');
        } else {
            fs.unlink(path.join(resourcePath, link), (err) => {
                if (err) handlerError(err, resourcePath);
            });
        }
    });
}

/**
     * 调用编译命令
     * @returns
     */
function commendMake(cpath = cwd()) {
    return new Promise((resolve, reject) => {
        let errStr = '';
        const progress = spawn('make', [`-j99`, '-C', './LB_USER'], { cwd: path.join(cpath, DIR) });
        progress.stderr.on('data', (err) => errStr += err.toString());

        progress.on('close', (code, signal) => {
            console.log(new Date());
            if (code === 0) {
                resolve(true);
            } else {
                reject(errStr);
            }
        });
    });
}

/**
 * 获取版本并对比是否需要更新
 * @param {String} data
 * @param {String} path
 * @returns
 */
function compareVersion(data, vpath = path.join(cwd(), VERSION, '/Version.txt')) {
    const version = fs.readFileSync(vpath, 'utf-8');
    if (version && !isNaN(version) && data == version) {
        return true;
    } else {
        return false;
    }
}

/**
 * 获取硬件版本
 * @param {String} data
 * @param {String} path
 * @returns
 */
function getVersion(vpath) {
    const p = path.join(vpath, VERSION, '/Version.txt');
    const version = fs.readFileSync(p, 'utf-8');
    return version;
}

/**
 * 查找文件夹并写入文件
 * @param {String} directory
 * @param {String} filepath
 * @param {String} data
 */
async function writeFileWithDirectory(directory = cwd(), filepath, data) {
    if (fs.existsSync(directory)) {
        fs.writeFileSync(filepath, data);
    } else {
        fs.mkdir(directory, { recursive: true }, async () => {
            fs.writeFileSync(filepath, data);
        });
    }
}

/**
 * 获取当前时间
 * @returns
 */
function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

/**
 * 错误处理
 * @param {string} error
 * @param resourcePath
 */
async function handlerError (error, resourcePath = cwd()) {
    if(!ArrayBuffer.isView(error) || typeof error !== 'string') return;
    const time = getCurrentTime();
    const filepath = `./Error/error_${time}.txt`;
    await writeFileWithDirectory(resourcePath, filepath, error);
}

function getDocxUrl(static_path, link) {
    const href = path.join(static_path, link);
    exec(href);
}


function getMediaPath(link = '') {
    return url.format({
        pathname: path.join(link, './resources/static/blocks-media/'),
        protocol: "file:",
        slashes: true,
    });
}


contextBridge.exposeInMainWorld('myAPI', {
    readFiles,
    writeFiles,
    deleteFiles,
    ipcInvoke,
    delEvents,
    ipcRender,
    compareVersion,
    commendMake,
    writeFileWithDirectory,
    handlerError,
    getCurrentTime,
    setStoreValue,
    getStoreValue,
    removeStoreValue,
    hasStoreValue,
    onUpdate: (callback) => ipcRenderer.on('update', callback),
    getDocxUrl,
    getMediaPath,
    getVersion,
    replaceFiles
});
