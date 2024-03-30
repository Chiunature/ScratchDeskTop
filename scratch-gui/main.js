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
const serialport = require('serialport');
const electron = require("electron");
const { app, BrowserWindow, dialog, Menu, shell, ipcMain, screen } = electron;
const path = require("path");
const url = require("url");
const fs = require("fs");
const { cwd } = require('process');
const { exec } = require('child_process');
const { Serialport, ipc } = require('est-link');
// const checkUpdate = require('./update.js');
const logger = require('electron-log');

logger.transports.file.maxSize = 1002430;
logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}';
let date = new Date();
date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
//需要保存的了路径
logger.transports.file.resolvePathFn = () => cwd() + '\\Logs\\' + date + '.log';
//全局的console.info写进日志文件
console.info = logger.info || logger.warn;

let mainWindow, loadingWindow, isUpdate;


const options = {
    nativeWindowOpen: true,
    nodeIntegration: true,
    contextIsolation: true,
    javascript: true,
    plugins: true,
    webSecurity: false,
    preload: path.join(__dirname, "preload.js"),
    requestedExecutionLevel: 'requireAdministrator'
}

const pack = {
    electron,
    fs,
    path,
    process: global.process,
    isPackaged: app.isPackaged
}

/* async function updater(win) {
    const res = await checkUpdate(win);
    isUpdate = res;
} */

function showLoading() {
    return new Promise((resolve, reject) => {
        loadingWindow = new BrowserWindow({
            width: 840,
            height: 540,
            frame: false,
            transparent: true,
            webPreferences: options,
        });
        loadingWindow.loadFile(path.join(__dirname, "launch.html"));
        loadingWindow.show();
        resolve();
    });

};

function createWindow() {
    // 获取主显示器的宽高信息
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    return new Promise((resolve, reject) => {
        mainWindow = new BrowserWindow({
            width: width,
            height: height,
            x: 0,
            y: 0,
            show: false,
            webPreferences: options,
        });


        const sp = new Serialport({ serialport, ...pack });
        //获取串口列表
        sp.getList();
        //连接串口
        sp.connectSerial();
        //关闭默认菜单
        if (app.isPackaged) {
            Menu.setApplicationMenu(null);
            mainWindow.loadURL(
                url.format({
                    pathname: path.join(__dirname, "build/index.html"),
                    protocol: "file:",
                    slashes: true,
                })
            );
        } else {
            mainWindow.loadURL("http://127.0.0.1:8601/");
            mainWindow.webContents.openDevTools();
        }
        // 防止页面失去焦点
        _handleOnFocus();

        //点击logo打开官网
        ipcMain.handle(ipc.SEND_OR_ON.LOGO.OPEN, (event, url) => {
            shell.openExternal(url);
        });

        //点击重新更新固件提示
        _ipcMainHandle(ipc.SEND_OR_ON.VERSION.REUPDATE, {
            title: "Do you want to delete this record",
            message: "固件已是最新版本, 是否要重新更新"
        });


        //更新固件提示
        _ipcMainHandle(ipc.SEND_OR_ON.VERSION.UPDATE, {
            title: "Detected that the firmware version is not the latest. Do you want to update it now",
            message: "检测到固件版本不是最新，是否前去更新"
        });


        //是否删除记录
        _ipcMainHandle(ipc.SEND_OR_ON.FILE.DELETE, {
            title: "Do you want to delete this record",
            message: "是否要删除此记录"
        });


        // 检测电脑是否安装了驱动
        ipcMain.handle(ipc.SEND_OR_ON.DEVICE.CHECK, async (event, flag) => {
            if (flag === 'install') return;

            //是否需要重装驱动
            if (flag === 'reupdate') {
                const res = await _checkInstallDriver({
                    title: "Are you sure you want to reinstall the driver?",
                    message: "确定要重新安装驱动吗?",
                });
                return res;
            }

            const res = await _checkInstallDriver({
                title: "Checked that your computer does not have the necessary drivers installed. Would you like to go ahead and install them",
                message: "检查到你的电脑未安装必要驱动，是否前去安装",
            });
            return res;
        });

        mainWindow.once("ready-to-show", () => {
            loadingWindow.hide();
            loadingWindow.close();
            mainWindow.show();
            // updater(mainWindow);
        });

        // 关闭window时触发下列事件.
        mainWindow.on("close", async (e) => {
            e.preventDefault();
            if (isUpdate) return;
            const { response } = await dialog.showMessageBox({
                type: "info",
                title: "The changes you made may not be saved",
                message: "你所做的更改可能未保存",
                buttons: ["取消(cancel)", "确定(confirm)"],
            });
            if (response === 1) {
                mainWindow = null;
                const eventList = ipcMain.eventNames();
                eventList.map(item => {
                    _delEvents(item);
                });
                app.exit();
            }
        });
        resolve();
    });

    function _ipcMainHandle(instruct, obj) {
        ipcMain.handle(instruct, async () => {
            const { response } = await dialog.showMessageBox({
                type: obj.type ? obj.type : 'info',
                title: obj.title,
                message: obj.message,
                buttons: ["否(no)", "是(yes)"],
            });
            return response;
        });
    }

    async function _checkInstallDriver({ title, message }) {
        const { response } = await dialog.showMessageBox({
            type: "info",
            title,
            message,
            buttons: ["否(no)", "是(yes)"],
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

    //退出客户端去掉事件监听
    function _delEvents(eventName) {
        ipcMain.removeAllListeners([eventName]);
    }
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on("ready", async () => {
    await showLoading();
    await createWindow();
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
