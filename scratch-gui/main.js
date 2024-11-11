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
const { app, BrowserWindow, dialog, Menu, ipcMain, screen, shell, utilityProcess, MessageChannelMain } = electron;
const PDFWindow = require('electron-pdf-window')
const path = require("path");
const fs = require("fs");
const { cwd } = require("process");
const { exec } = require("child_process");
const { Serialport, ipc } = require("est-link");
const checkUpdate = require("./update.js");
// const createProtocol = require("./scripts/createProtocol.js");
const watchLaunchFromATC = require("./scripts/watchLaunchFromATC.js");
const getRandomString = require("./scripts/getRandomString.js");

//设置通知标题上面的 英文 electron.app.Electron 
const pg = require("./package.json");
app.setAppUserModelId(pg.description);

const Store = require("electron-store");
Store.initRenderer();

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

let mainWindow, loadingWindow, isUpdate, mainMsg, updateFunc;


// 使用快速启动模式
app.commandLine.appendSwitch('enable-features', 'HardwareAccelerationModeDefault');
app.commandLine.appendSwitch('gpu-memory-buffer-compositor-resources');
app.commandLine.appendSwitch('disable-features', 'OutOfProcessPdf'); // 必须禁用PDF预览以启用快速启动
app.disableHardwareAcceleration(); // 快速启动模式下可能需要禁用硬件加速


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

/* function notice(title, body) {
    return new Promise((ok, fail) => {
        if (!Notification.isSupported()) fail("当前系统不支持通知")
        let ps = typeof (title) == 'object' ? title : { title, body }
        let n = new Notification(ps)
        n.on('click', ok)
        n.show()
    })
} */

function showPDF(href) {
    const pdfwin = new PDFWindow({
        width: 800,
        height: 600,
        alwaysOnTop: true,
        title: href.slice(href.lastIndexOf('\\') + 1),
        partition: 'PDF' + getRandomString(),
    });
    pdfwin.menuBarVisible = false;
    pdfwin.loadURL(href);
    pdfwin.on('page-title-updated', (event) => {
        event.preventDefault();
    })
}

function showLoading(mainWin) {
    loadingWindow = new BrowserWindow({
        show: false,
        frame: false,
        width: 840,
        height: 540,
        resizable: false,
        transparent: true,
        partition: 'persist:showLoading',
    });

    loadingWindow.once("show", mainWin);
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


function openSerialPort() {
    const pack = {
        electron: electron,
        fs: fs,
        path: path,
        process: global.process,
        isPackaged: app.isPackaged
    }
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
        mainWindow.loadFile(path.join(process.resourcesPath, "app.asar.unpacked/index.html"));
    } else {
        mainWindow.loadURL("http://127.0.0.1:8601/");
        const devtools = new BrowserWindow();
        // 解决 Windows 无法正常打开开发者工具的问题
        mainWindow.webContents.setDevToolsWebContents(devtools.webContents);
        // 打开开发者工具
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
}

function openPDFWindow() {
    ipcMain.on('pdf', (e, data) => {
        switch (data.type) {
            case 'pdf':
                showPDF(data.href);
                break;
            default:
                break;
        }
    });
}

function createWindow() {
    const options = {
        sandbox: false,
        nativeWindowOpen: true,
        nodeIntegration: true,
        contextIsolation: true,
        javascript: true,
        plugins: true,
        webSecurity: false,
        preload: path.resolve(__dirname, "preload.js"),
        requestedExecutionLevel: "requireAdministrator",
        nodeIntegrationInWorker: true
    };
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
        partition: 'persist:window-id' + getRandomString(),
        webPreferences: options,
    });

    handleMenuAndDevtool(mainWindow);


    mainWindow.once("ready-to-show", () => {
        loadingWindow.hide();
        loadingWindow.close();
        mainWindow.show();
        if (app.isPackaged) {
            watchLaunchFromATC(mainWindow, ipc.SEND_OR_ON.LAUCHFROMATC);
            // 启用硬件加速
            app.commandLine.appendSwitch('--enable-gpu-rasterization');
        }
    });

    getRenderVersion();
    openSerialPort();
    // 开启子线程操作文件缓存
    handleChildProcess();
    // 防止页面失去焦点
    _handleOnFocus();
    // 保存文件到本地
    saveFileToLocal();
    // 打开文件位置
    _openFileLocation();
    openPDFWindow();


    // 设置静态资源路径
    ipcHandle(ipc.SEND_OR_ON.SET_STATIC_PATH, () => app.isPackaged ? process.resourcesPath.slice(0, -10) : app.getAppPath());
    ipcHandle(ipc.SEND_OR_ON.GETMAINMSG, (event, args) => {
        if (!mainMsg && args.msg) {
            mainMsg = { ...args.msg };
        }
        // notice(`通知`, `可在文件选项中开启自动备份, 开启后工作区会每隔10分钟自动保存文件, 路径是${path.join(app.getPath('documents'), '\\NEW-AI')}`);
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

    // 关闭window时触发下列事件.
    mainWindow.on("close", async (e) => {
        e.preventDefault();
        if (isUpdate) return;
        const { response } = await dialog.showMessageBox({
            type: "warning",
            title: "\t",
            message: mainMsg.exit,
            buttons: [mainMsg['cancel'], mainMsg['confirm']],
            defaultId: 0,
            cancelId: 0,
        });
        if (response === 1) {
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
            _handleSaveBeforClose();
        }
    });

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

    function _handleSaveBeforClose() {
        mainWindow.webContents.send('auto-save-file-before-close');
        ipcHandle('return-close-app', (event, args) => {
            if (args) {
                 dialog.showMessageBox({
                    type: "warning",
                    buttons: ["OK"],
                    title: "备份",
                    message: "自动备份中, 请勿操作......, 备份完成将自动退出!",
                    detail: mainMsg['waiting'],
                }).catch();

                setTimeout(() => app.exit(), 2000);
            } else {
                app.exit()
            }
            return;
        })
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
            return false;
        })
    }

    function getRenderVersion() {
        ipcHandle('app-version', () => {
            const ver = app.getVersion();
            return ver || pg.version;
        })
    }
}

//退出客户端去掉事件监听
/* function _delEvents() {
    const eventList = ipcMain.eventNames();
    eventList.forEach(item => {
        ipcMain.removeAllListeners([item]);
    });
} */


// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on("ready", () => {
    showLoading(createWindow);
});

// GPU进程崩溃
/* app.on('gpu-process-crashed', function () {
    console.info('GPU进程崩溃,程序退出');
    app.exit(0);
}); */

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

