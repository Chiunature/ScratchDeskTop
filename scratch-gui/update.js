const { autoUpdater } = require('electron-updater');
const { app, dialog } = require('electron');
const fs = require("fs-extra");
const path = require("path");

const server = 'https://zsff.drluck.club';
const updateUrl = `${server}/ATC`;
const updaterCache = 'ATC-updater';


const opt = {
  type: 'info',
  title: '更新提示',
  message: '有新版本发布了',
  buttons: ['更新', '取消'],
  cancelId: 1
}
const dialogOpts = {
  type: 'info',
  buttons: ['Update(更新)', 'Later(稍后再说)'],
  title: 'Application Update(应用更新)',
  message: '已为您下载最新应用，点击确定马上替换为最新版本！',
  detail:
    'A new version was found. Do you want to update?(发现新版本，是否更新？)'
}

autoUpdater.autoDownload = false; // 自动下载
autoUpdater.autoInstallOnAppQuit = true; // 应用退出后自动安装


const checkUpdate = (mainWin) => {
  autoUpdater.setFeedURL(updateUrl);
  // 更新前，删除本地安装包
  const updatePendingPath = path.join(autoUpdater.app.baseCachePath, updaterCache, 'pending');
  fs.emptyDir(updatePendingPath);

  // 检测是否有更新包并通知
  autoUpdater.checkForUpdatesAndNotify();

  return new Promise((resolve, reject) => {
    //有新版本时
    autoUpdater.on('update-available', (_info) => {
      dialog.showMessageBox(opt).then(res => {
        if (res.response == 0) {
          //开始下载更新
          autoUpdater.downloadUpdate();
        }
      });
    });
    //没有新版本时
    autoUpdater.on('update-not-available', (_info) => {
      console.info('没有更新')
    })

    autoUpdater.on('download-progress', (prog) => {
      let { bytesPerSecond, percent } = prog;
      mainWin.webContents.send('update', {
        speed: Math.ceil(bytesPerSecond / 1000), // 网速
        percent: percent.toFixed(2), // 百分比
      });
    });


    autoUpdater.on('update-downloaded', (event) => {
      console.info(event)
      dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response == 0) {  //选择是，则退出程序，安装新版本
          resolve(true);
          autoUpdater.quitAndInstall();
          app.quit();
        } else {
          resolve(false);
          event.preventDefault();
        }
      });
    });

    autoUpdater.on('error', (message) => {
      console.info(message)
      reject(message);
    });
  })
};

module.exports = checkUpdate;
