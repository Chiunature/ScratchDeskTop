/*
 * @Description: New features
 * @Author: jiang
 * @Date: 2023-06-05 14:43:50
 * @LastEditors: jiang
 * @LastEditTime: 2023-06-06 18:30:58
 * 
 */
const { app, BrowserWindow, dialog, Menu, shell, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const Serialport = require(path.join(__dirname, "src/utils/serialport.js"));

let mainWindow, loadingWindow, progressInterval;

const options = {
    nativeWindowOpen: true,
    nodeIntegration: true,
    contextIsolation: false,
    javascript: true,
    plugins: true,
    webSecurity: false,
    preload: path.join(__dirname, "preload.js"),
}

function progress() {
    let c = 0;
    progressInterval = setInterval(() => {
        c++;
        loadingWindow.setProgressBar(c);
        loadingWindow.webContents.send("progress", c);
        if (c == 100) clearInterval(progressInterval);
    }, 20);
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
        progress();
        resolve();
    });
};

function createWindow() {
    return new Promise((resolve, reject) => {
        mainWindow = new BrowserWindow({
            width: 1430,
            height: 800,
            show: false,
            webPreferences: options,
        });
        let sp = new Serialport();
        //关闭默认菜单
        if (app.isPackaged) {
            Menu.setApplicationMenu(null);
            /* 
                加载应用-----  electron-quick-start中默认的加载入口
            */
            mainWindow.loadURL(
                url.format({
                    pathname: path.join(__dirname, "build/index.html"),
                    protocol: "file:",
                    slashes: true,
                })
            );
        } else {
            mainWindow.loadURL("http://127.0.0.1:8601/");
            // 打开开发者工具，默认不打开
            mainWindow.webContents.openDevTools();
        }

        //获取串口列表
        sp.getList();
        //连接串口
        sp.connectSerial();

        //点击logo打开官网
        ipcMain.on('open-url', (event, url) => {
            shell.openExternal(url);
        });

        mainWindow.once("ready-to-show", () => {
            loadingWindow.hide();
            loadingWindow.close();
            mainWindow.show();
            clearInterval(progressInterval);
        });

        // 关闭window时触发下列事件.
        mainWindow.on("close", function (e) {
            let index = dialog.showMessageBoxSync({
                type: "info",
                title: "The changes you made may not be saved",
                message: "你所做的更改可能未保存",
                buttons: ["取消(cancel)", "确定(confirm)"],
            });
            if (index === 0) {
                e.preventDefault(); //阻止默认行为
                return;
            } else {
                mainWindow = null;
                app.exit(); //exit()直接关闭客户端，不会执行quit();
            }
        });
    });
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
