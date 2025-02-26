// const fs = require("fs");
const path = require("path");
// const { getZip } = require("./scripts/checkForUpdate.js");
const electron = require("electron");
const { app, BrowserWindow } = electron;
// const { ipc } = require("est-link");


async function showLoading(mainWin) {
    const loadingWindow = new BrowserWindow({
        frame: false,
        width: 840,
        height: 540,
        resizable: false,
        transparent: true,
        partition: 'persist:showLoading',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    loadingWindow.once("show", () => {
        mainWin(loadingWindow);
    });

    if (app.isPackaged) {
        loadingWindow.loadFile(path.join(process.resourcesPath, "app.asar.unpacked/launch.html"))
    } else {
        loadingWindow.loadFile("launch.html")
    }

    // const progressFunc = (loaded, total) => loadingWindow.webContents.send(ipc.LOAD_PROGRESS, Math.floor(loaded / total * 100));
    // const resourcesPath = app.isPackaged ? process.resourcesPath : path.join(app.getAppPath(), "resources");

    loadingWindow.webContents.on("did-finish-load", () => {
        loadingWindow.show();
        /*loadingWindow.webContents.send(ipc.UPDATE, "检查更新中......");
 
        fs.readFile(path.join(resourcesPath, "./scripts/hotVersion.json"), "utf8", async (err, data) => {
            if (err) {
                return;
            } else {
                try {
                    //记录本地的版本号，因为我们需要比对本地版本号和线上是否相同再触发更新
                    const nowRes = JSON.parse(data);
                    const response = await fetch("https://zsff.drluck.club/ATC/hotVersion.json");
                    const newRes = await response.json();
 
                    await compare(nowRes.lb_version, newRes.lb_version, {
                        requestUrl: "https://zsff.drluck.club/ATC/LB_FWLIB.zip",
                        targetPath: path.join(resourcesPath, "./LB_FWLIB.zip"),
                        oldPath: path.join(resourcesPath, "./LB_FWLIB"),
                        callback: progressFunc,
                        type: "lb_version",
                        newResult: newRes
                    })
 
                    await compare(nowRes.atc_version, newRes.atc_version, {
                        requestUrl: "https://zsff.drluck.club/ATC/unpacked.zip",
                        targetPath: path.join(resourcesPath, "./unpacked.zip"),
                        oldPath: path.join(resourcesPath, "./app.asar.unpacked"),
                        callback: progressFunc,
                        type: "atc_version",
                        newResult: newRes
                    })
                    loadingWindow.webContents.send(ipc.UPDATE, "加载中......");
                } catch (error) {
                    loadingWindow.webContents.send(ipc.UPDATE, "无法联网检查更新或出现其它问题，请检查网络连接后重试");
                }finally {
                    loadingWindow.show();
                }
            }
        });*/
    });

    /* async function compare(oldVersion, newVersion, options) {
        const { requestUrl, targetPath, oldPath, callback, newResult, type } = options;
        if (oldVersion !== newVersion) {
            // 如果版本号不同，则触发更新
            loadingWindow.webContents.send(ipc.UPDATE, type);
            await getZip(requestUrl, targetPath, oldPath, callback);
            fs.writeFileSync(path.join(resourcesPath, "./scripts/hotVersion.json"), JSON.stringify(newResult), {
                encoding: "utf8"
            });
        }
    } */
};

module.exports = {
    showLoading
};