const { app, BrowserWindow, dialog, Menu, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const parser = new ReadlineParser({ delimiter: "\r\n" });
let mainWindow, port, timer;

//获取串口列表
function getList() {
    ipcMain.on("connect", (event, arg) => {
        if (arg) {
            SerialPort.list().then((res) => {
                event.reply("connected", res);
            });
        }
    });
}
//连接串口
function connectSerial() {
    ipcMain.on("connected", (event, arg) => {
        linkToSerial(arg, event);
    });
}
//断开连接
function disconnectSerial(port) {
    ipcMain.on("disconnected", (event) => {
        if (port.isOpen) port.close();
        event.reply("closed", "disconnect");
    });
}

function linkToSerial(serial, event) {
    if (port) port.close();
    port = new SerialPort(
        {
            path: serial.path,
            baudRate: 115200,
        },
        (err) => {
            if (err) {
                event.reply("open", "failedConnected");
            } else {
                event.reply("open", "successfullyConnected");
            }
        }
    );
    port.pipe(parser);
    parser.on("data", (data) => {
        console.log("the received data is:", data);
    });
    sendToSerial();
    disconnectSerial(port);
    port.on("close", () => {
        port = null;
        console.log("the serialport is closed.");
    });
}

function writeData(data) {
    console.log(data);
    port.write(data);
}

//分段上传
function uploadSlice(data) {
    // 将data分段，每段大小512b
    const chunkSize = 512;
    if (data.length < chunkSize) {
        writeData(data);
    } else {
        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            writeData(chunk);
        }
    }
}

//发送数据
function sendToSerial() {
    ipcMain.on("writeData", (event, data) => {
        uploadSlice(data);
        clearTimeout(timer);
        timer = setTimeout(() => {
            port.drain((err) => {
                if (err) {
                    event.reply("completed", {
                        result: false,
                        msg: "uploadError",
                    });
                } else {
                    event.reply("completed", {
                        result: false,
                        msg: "uploadSuccess",
                    });
                }
            });
        }, 0);
    });
}

function createWindow() {
    //创建浏览器窗口,宽高自定义具体大小你开心就好
    mainWindow = new BrowserWindow({
        width: 1430,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            javascript: true,
            plugins: true,
            webSecurity: false,
            preload: path.join(__dirname, "preload.js"),
        },
    });

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
    getList();
    //连接串口
    connectSerial();

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
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on("ready", createWindow);

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
