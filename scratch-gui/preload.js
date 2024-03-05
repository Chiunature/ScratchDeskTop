const { contextBridge, ipcRenderer } = require('electron');
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { cwd } = require('process');
const { VERSION } = require("./src/config/json/LB_FWLIB.json");
const { DIR } = require("./src/config/json/LB_USER.json");

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
function readFiles(path, type) {
    try {
        const data = fs.readFileSync(path, type);
        return data;
    } catch (error) {
        handlerError(error);
        return false;
    }
}

/**
     * 将c语言代码写入文件
     * @param {String} path 
     * @returns 
     */
function writeFiles(path, data, options = {}) {
    try {
        fs.writeFileSync(path, data, options);
        return true;
    } catch (error) {
        handlerError(error);
        return false;
    }
}

/**
     * 删除文件
     * @param {String} path 
     * @returns 
     */
function deleteFiles(path) {
    // 检测文件是否存在
    fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('文件不存在');
        } else {
            fs.unlink(path, (err) => {
                if (err) handlerError(err);
                // console.log('删除成功');
            });
        }
    });
}

/**
     * 调用编译命令
     * @returns 
     */
function commendMake() {
    return new Promise((resolve, reject) => {
        let errStr = '';
        const progress = spawn('make', [`-j99`, '-C', './LB_USER'], { cwd: DIR });

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
function getVersion(data, vpath = path.join(cwd(), VERSION, '/Version.txt')) {
    const version = fs.readFileSync(vpath, 'utf8');
    if (data == version) {
        return true;
    } else {
        return false;
    }
}

/**
 * 查找文件夹并写入文件
 * @param {String} directory 
 * @param {String} filepath 
 * @param {String} data 
 */
async function writeFileWithDirectory(directory, filepath, data) {
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
 * @param {String} error 
 */
async function handlerError(error) {
    const directory = './Error';
    const time = getCurrentTime();
    const filepath = `${directory}/error_${time}.txt`;
    await writeFileWithDirectory(directory, filepath, error);
}

contextBridge.exposeInMainWorld('myAPI', {
    readFiles,
    writeFiles,
    deleteFiles,
    ipcInvoke,
    delEvents,
    ipcRender,
    getVersion,
    commendMake,
    writeFileWithDirectory,
    handlerError
});