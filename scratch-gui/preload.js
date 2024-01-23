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
     * @param {String} type 
     * @returns 
     */
function writeFiles(path, type) {
    try {
        fs.writeFileSync(path, type);
        return true;
    } catch (error) {
        handlerError(error);
        return false;
    }
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

contextBridge.exposeInMainWorld('myAPI', {
    readFiles,
    writeFiles,
    ipcInvoke,
    delEvents,
    ipcRender,
    getVersion,
    commendMake
});