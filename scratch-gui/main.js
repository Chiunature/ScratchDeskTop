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
const { app, BrowserWindow, dialog, Menu, shell, ipcMain } = electron;
const { autoUpdater } = require('electron-updater');
const path = require("path");
const url = require("url");
const fs = require("fs");
const noble = require('@abandonware/noble');
const { exec } = require('child_process');
const { Serialport, ipc, Bluetooth } = require('est-link');

let mainWindow, loadingWindow, progressInterval, isUpdate;
const server = 'http://127.0.0.1:2060';
const updateUrl = `${server}/update/${process.platform}/`;

const options = {
    nativeWindowOpen: true,
    nodeIntegration: true,
    contextIsolation: false,
    javascript: true,
    plugins: true,
    webSecurity: false,
    preload: path.join(__dirname, "preload.js"),
}

const pack = {
    electron, 
    fs, 
    path, 
    process: global.process
}


function updater() {
    autoUpdater.setFeedURL(updateUrl);
    autoUpdater.checkForUpdates();
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        const dialogOpts = {
            type: 'info',
            buttons: ['Update(更新)', 'Later(稍后再说)'],
            title: 'Application Update(应用更新)',
            message: process.platform === 'win32' ? releaseNotes : releaseName,
            detail:
                'A new version was found. Do you want to update?(发现新版本，是否更新？)'
        }
        dialog.showMessageBox(dialogOpts).then((returnValue) => {
            if (returnValue.response == 0) {  //选择是，则退出程序，安装新版本
                isUpdate = true;
                autoUpdater.quitAndInstall();
                app.quit();
            } else {
                event.preventDefault();
            }
        });
    });

    autoUpdater.on('error', (message) => {
        console.error('There was a problem updating the application')
        console.error(message)
    });
}

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
        _progress();
        resolve();
    });

    function _progress() {
        let c = 0;
        progressInterval = setInterval(() => {
            c++;
            loadingWindow.setProgressBar(c);
            loadingWindow.webContents.send("progress", c);
            if (c == 100) clearInterval(progressInterval);
        }, 20);
    }
};

function createWindow() {
    return new Promise((resolve, reject) => {
        mainWindow = new BrowserWindow({
            width: 1430,
            height: 800,
            show: false,
            webPreferences: options,
        });

        
        const sp = new Serialport({ serialport, ...pack });
        const ble = new Bluetooth({ noble, ...pack });
        //获取串口列表
        sp.getList();
        //连接串口
        sp.connectSerial();

/*  ipcMain.on(ipc.SEND_OR_ON.BLE.CONNECTION, (event, arg) => {
            //开启蓝牙扫描
        ble.scanning(event, arg);
        }); */

// ipcMain.handle(ipc.SEND_OR_ON.BLE.DISCONNECTED, (event, res) => {});

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

        //点击重新更新固件提示
        ipcMain.handle(ipc.SEND_OR_ON.VERSION, (event, arg) => {
            const index = dialog.showMessageBoxSync({
                type: "info",
                title: "Do you want to delete this record",
                message: "固件已是最新版本, 是否要重新更新",
                buttons: ["否(no)", "是(yes)"],
            });
            return index;
        });

        //点击logo打开官网
        ipcMain.handle(ipc.SEND_OR_ON.LOGO.OPEN, (event, url) => {
            shell.openExternal(url);
        });

        //是否删除记录
        ipcMain.handle(ipc.SEND_OR_ON.FILE.DELETE, () => {
            const index = dialog.showMessageBoxSync({
                type: "info",
                title: "Do you want to delete this record",
                message: "是否要删除此记录",
                buttons: ["否(no)", "是(yes)"],
            });
            return index;
        });


        ipcMain.handle(ipc.SEND_OR_ON.DEVICE.CHECK, (event, flag) => {
            if (flag === 'true') return;
             // 检测电脑是否安装了某个驱动
             exec('driverquery | findstr "LBS Serial"', (error, stdout, stderr) => {
                const index = dialog.showMessageBoxSync({
                    type: "info",
                    title: "Checked that your computer does not have the necessary drivers installed. Would you like to go ahead and install them",
                    message: "检查到你的电脑未安装必要驱动，是否前去安装",
                    buttons: ["否(no)", "是(yes)"],
                });
                if (index === 0) {
                    return false;
                } else {
                    exec(`cd ./resources && zadig.exe`);
                    return true;
                }
            });
        });

        mainWindow.once("ready-to-show", () => {
            loadingWindow.hide();
            loadingWindow.close();
            mainWindow.show();
            clearInterval(progressInterval);
            updater();
        });

        // 关闭window时触发下列事件.
        mainWindow.on("close", (e) => {
            if (isUpdate) return;
            const index = dialog.showMessageBoxSync({
                type: "info",
                title: "The changes you made may not be saved",
                message: "你所做的更改可能未保存",
                buttons: ["取消(cancel)", "确定(confirm)"],
            });
            if (index === 0) {
                e.preventDefault();
            } else {
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
