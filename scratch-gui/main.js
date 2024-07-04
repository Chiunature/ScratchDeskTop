/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2023 drluck Inc.
 * http://www.drluck.cn/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview The class representing one block.
 * @author avenger-jxc
 */
const serialport = require("serialport");
const electron = require("electron");
const { app, BrowserWindow, dialog, Menu, ipcMain, screen, shell, utilityProcess, MessageChannelMain, crashReporter } = electron;
const path = require("path");
const url = require("url");
const fs = require("fs");
// const noble = require("@abandonware/noble");
const { cwd } = require("process");
const { exec } = require("child_process");
const { Serialport, ipc } = require("est-link");
const checkUpdate = require("./update.js");
const createProtocol = require("./src/config/js/createProtocol.js");
const watchLaunchFromATC = require("./src/config/js/watchLaunchFromATC.js");

const logger = require("electron-log");
logger.transports.file.maxSize = 1002430;
logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}';
let date = new Date();
date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
//需要保存的了路径
logger.transports.file.resolvePathFn = () => cwd() + '\\Logs\\' + date + '.log';
//全局的console.info写进日志文件
console.info = logger.info || logger.warn;

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
const Store = require("electron-store");
Store.initRenderer();

let mainWindow, loadingWindow, isUpdate, mainMsg, updateFunc, crashDumpsDir = '';

crashDumpsDir = app.getPath('crashDumps');
console.info('Crash file path=>', crashDumpsDir + '/reports');
// 开启crash捕获
crashReporter.start({
    productName: 'NEW-AI',
    companyName: 'Dr.luck',
    submitURL: 'https://zsff.drluck.club/ATC/crash-reports',
    uploadToServer: false,
    ignoreSystemCrashHandler: false, // 不忽略系统自带的奔溃处理
});

const options = {
    sandbox: false,
    nativeWindowOpen: true,
    nodeIntegration: true,
    contextIsolation: true,
    javascript: true,
    plugins: true,
    webSecurity: false,
    preload: path.join(__dirname, "preload.js"),
    requestedExecutionLevel: "requireAdministrator",
    nodeIntegrationInWorker: true
}

const pack = {
    electron,
    fs,
    path,
    process: global.process,
    isPackaged: app.isPackaged
}

function ipcHandle(eventName, callback) {
    ipcMain.removeHandler(eventName);
    ipcMain.handle(eventName, (event, arg) => callback(event, arg));
}

async function updater(win, autoUpdate) {
    if (!autoUpdate) {
        return null;
    }
    updateFunc = await checkUpdate(win, isUpdate, mainMsg, updateFunc);
    return updateFunc;
}

function showLoading(cb) {
    loadingWindow = new BrowserWindow({
        show: false,
        frame: false,
        width: 840,
        height: 540,
        resizable: false,
        transparent: true,
        partition: 'persist:showLoading',
    });

    loadingWindow.once("show", cb);
    loadingWindow.loadFile(path.join(process.resourcesPath, "app.asar.unpacked/launch.html"));
    loadingWindow.show();
};



function saveFileToLocal() {
    ipcHandle(ipc.FILE.SAVE, async (event, obj) => {
        // 选择文件保存路径
        const result = await dialog.showSaveDialog({
            title: 'Save File',
            defaultPath: path.join(app.getPath('documents'), obj.filename),
            filters: [{ name: 'LBS Files', extensions: ['lbs', 'sb3', 'sb2', 'sb1'] }]
        });
        if (!result.canceled) {
            const filePath = result.filePath;
            // 写入文件到指定路径
            fs.writeFileSync(filePath, obj.file);
            return filePath;
        } else {
            return false;
        }
    });
}

function handleChildProcess() {
    const childProcessPath = path.join(__dirname, './src/utils/storeChildProcess.js');
    const { port1, port2 } = new MessageChannelMain();
    const child = utilityProcess.fork(childProcessPath);
    child.postMessage(null, [port1]);
    ipcHandle(ipc.WORKER, async (event, data) => {
        try {
            if (!data) return;
            port2.postMessage({ ...data });
            const result = await _onmessage();
            return result;
        } catch (error) {
            console.info(error);
        }
    })
    function _onmessage() {
        return new Promise((resolve) => {
            port2.removeAllListeners('message');
            port2.once('message', (msg) => {
                const { data } = msg;
                if (data.type === 'get') resolve(data.value);
                resolve();
            });
        })
    }
    port2.start();
}

/* function openBle() {
    const ble = new Bluetooth({ noble, ...pack });
    ble.linkBle();
    ipcMain.on(ipc.SEND_OR_ON.BLE.SCANNING, (event, open) => {
        ble.scanning(open).discover(event);
    });
} */

function openSerialPort() {
    const sp = new Serialport({ serialport, ...pack });
    //获取串口列表
    sp.getList();
    //连接串口
    sp.connectSerial();
}

function handleMenuAndDevtool(mainWindow) {
    //关闭默认菜单
    if (app.isPackaged) {
        Menu.setApplicationMenu(null);
        createProtocol("app", "", path.join(process.resourcesPath, "./app.asar.unpacked"));
        mainWindow.loadURL(url.format({
            pathname: path.join(process.resourcesPath, "app.asar.unpacked/index.html"),
            protocol: "file:",
            slashes: true,
        }));
    } else {
        mainWindow.loadURL("http://127.0.0.1:8601/");
        const devtools = new BrowserWindow();
        // 解决 Windows 无法正常打开开发者工具的问题
        mainWindow.webContents.setDevToolsWebContents(devtools.webContents);
        // 打开开发者工具
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
}

function getRenderVersion() {
    ipcHandle('app-version', () => {
        const ver = app.getVersion();
        const SoftWareVersion = ver || '1.4.9';
        return SoftWareVersion;
    })
}


function createWindow() {
    // 获取主显示器的宽高信息
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
        mainWindow = new BrowserWindow({
            width: width,
            height: height,
            x: 0,
            y: 0,
            show: false,
            minWidth: 1020,
            minHeight: 750,
            partition: 'persist:window-id',
            webPreferences: options,
        });
        handleMenuAndDevtool(mainWindow);
        getRenderVersion();
        openSerialPort();
        // openBle();
        // 开启子线程操作文件缓存
        handleChildProcess();
        // 防止页面失去焦点
        _handleOnFocus();
        // 保存文件到本地
        saveFileToLocal();
        _openFileLocation();
        // 设置静态资源路径
        ipcHandle(ipc.SEND_OR_ON.SET_STATIC_PATH, () => app.isPackaged ? process.resourcesPath.slice(0, -10) : cwd());
        ipcHandle(ipc.SEND_OR_ON.GETMAINMSG, (event, args) => {
            if (!mainMsg && args.msg) {
                mainMsg = { ...args.msg };
            }
            return updater(mainWindow, args.autoUpdate);
        });

        // 检测电脑是否安装了驱动
        ipcHandle(ipc.SEND_OR_ON.DEVICE.CHECK, async (event, flag) => {
            if (flag === ipc.DRIVER.INSTALL) return;
            //是否需要重装驱动
            if (flag === ipc.DRIVER.REUPDATE) {
                return await _checkInstallDriver({ message: mainMsg['reinstallDriver'] });
            }
            return await _checkInstallDriver({ message: mainMsg['installDriver'] });
        });

        mainWindow.once("ready-to-show", () => {
            loadingWindow.hide();
            loadingWindow.close();
            mainWindow.show();
            app.isPackaged && watchLaunchFromATC(mainWindow, ipc.SEND_OR_ON.LAUCHFROMATC);
        });

        // 关闭window时触发下列事件.
        mainWindow.on("close", async (e) => {
            e.preventDefault();
            if (isUpdate) return;
            const { response } = await dialog.showMessageBox({
                type: "info",
                title: " ",
                message: mainMsg.exit,
                buttons: [mainMsg['cancel'], mainMsg['confirm']],
                defaultId: 0,
                cancelId: 0,
            });
            if (response === 1) {
                mainWindow = null;
                const eventList = ipcMain.eventNames();
                eventList.forEach(item => {
                    _delEvents(item);
                });
                if (updateFunc && typeof updateFunc === 'function') {
                    dialog.showMessageBox({
                        type: "info",
                        buttons: ["OK"],
                        title: mainMsg['updateApp'],
                        message: mainMsg['updating'],
                        detail: mainMsg['waiting'],
                    }).catch();
                    const res = await updateFunc();
                    res && app.exit();
                    return;
                }
                app.exit();
            }
    });

    /* function _ipcMainHandle(instruct, obj, buttons = [mainMsg['cancel'], mainMsg['confirm']]) {
        ipcMain.removeHandler(instruct);
        ipcHandle(instruct, async () => {
            const { response } = await dialog.showMessageBox({
                type: obj.type ? obj.type : 'info',
                title: obj.title ? obj.title : ' ',
                message: obj.message,
                buttons,
                defaultId: 0,
                cancelId: 0,
            });
            return response;
        });
    } */

    async function _checkInstallDriver({ title = ' ', message }) {
        const { response } = await dialog.showMessageBox({
            type: "info",
            title,
            message,
            buttons: [mainMsg['cancel'], mainMsg['confirm']],
            defaultId: 0,
            cancelId: 0,
        });
        if (response === 0) {
            return false;
        } else {
            exec(`cd ./resources && zadig.exe`);
            return true;
        }
    }

    function _handleOnFocus() {
        ipcMain.on('mainOnFocus', () => {
            mainWindow.blur();
            mainWindow.focus();
        });
    }

    function _openFileLocation() {
        ipcHandle('openFileLocation', (event, path) => {
            shell.showItemInFolder(path);
            return;
        })
    }

    //退出客户端去掉事件监听
    function _delEvents(eventName) {
        ipcMain.removeAllListeners([eventName]);
    }
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on("ready", async () => {
    showLoading(createWindow);
});

// GPU进程崩溃
app.on('gpu-process-crashed', function(){
    console.info('GPU进程崩溃,程序退出');
    app.exit(0);
});

// 所有窗口关闭时退出应用.
app.on("window-all-closed", function () {
    // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
    if (mainWindow === null) {
        createWindow();
    }
});

//限制只能开启一个应用
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
            mainWindow.show();
        }
    })
}
