const { autoUpdater } = require('electron-updater');
const { app, dialog } = require('electron');
const fs = require("fs-extra");
const path = require("path");
const incrementUpdate = require("./src/config/js/incrementUpdate.js");

const server = 'https://zsff.drluck.club';
const updateUrl = `${server}/ATC`;
const updaterCache = 'ATC-updater';
let updateDownloading = false, currentIncrementUpdate, obsIncrementUpdate, timeInterval = null;


autoUpdater.autoDownload = false; // 自动下载
autoUpdater.autoInstallOnAppQuit = true; // 应用退出后自动安装


const checkUpdate = (mainWin, isUpdate, mainMsg, updateFunc) => {
  autoUpdater.setFeedURL(updateUrl);
  // 更新前，删除本地安装包
  const updatePendingPath = path.join(autoUpdater.app.baseCachePath, updaterCache, 'pending');
  fs.emptyDir(updatePendingPath);


  clearInterval(timeInterval);
  timeInterval = null;
  if (!updateDownloading) {
    autoUpdater.checkForUpdates();
    timeInterval = setInterval(() => {
      // 检测是否有更新包并通知
      if (!updateDownloading) autoUpdater.checkForUpdatesAndNotify();
    }, 7200000);
  }

  return new Promise((resolve, reject) => {
    //有新版本时
    autoUpdater.on('update-available', (_info) => {
      updateDownloading = true;
      dialog.showMessageBox({
        type: 'info',
        title: mainMsg['updateApp'],
        message: mainMsg['discoverUpdate'],
        buttons: [mainMsg['cancel'], mainMsg['confirm']],
        cancelId: 0
      }).then(res => {
        if (res.response == 1) {
          //开始下载更新
          autoUpdater.downloadUpdate();
        }
      });
    });
    //没有新版本时
    autoUpdater.on("update-not-available", () => {
      // 读取本地hotVersion
      fs.readFile(
        path.join(process.resourcesPath, "./scripts/hotVersion.json"),
        "utf8",
        (err, data) => {
          if (err) {
            console.info(err);
          } else {
            //记录本地的版本号，因为我们需要比对本地版本号和线上是否相同再触发更新
            currentIncrementUpdate = JSON.parse(data).version;
            incrementUpdate(currentIncrementUpdate, obsIncrementUpdate, mainMsg, updateFunc);
          }
        }
      );
    });

    autoUpdater.on('download-progress', (prog) => {
      let { bytesPerSecond, percent } = prog;
      mainWin.webContents.send('update', {
        speed: Math.ceil(bytesPerSecond / 1000), // 网速
        percent: percent.toFixed(2), // 百分比
      });
    });


    autoUpdater.on('update-downloaded', (event) => {
      console.info(event)
      updateDownloading = false;
      dialog.showMessageBox({
        type: "info",
        buttons: [mainMsg['cancel'], mainMsg['confirm']],
        title: mainMsg['updateApp'],
        message: mainMsg['updateAppSuccess'],
        detail: mainMsg['updateAppSuccessDetail'],
        defaultId: 0,
        cancelId: 0,
      }).then((returnValue) => {
        if (returnValue.response == 1) {  //选择是，则退出程序，安装新版本
          isUpdate = true;
          autoUpdater.quitAndInstall();
          if (mainWin && mainWin.destroy) {
            mainWin.destroy();
          }
          app.quit();
        } else {
          isUpdate = false;
          event.preventDefault();
        }
        resolve();
      });
    });

    autoUpdater.on('error', (message) => {
      console.info(message)
      reject(message);
    });
  })
};

module.exports = checkUpdate;
