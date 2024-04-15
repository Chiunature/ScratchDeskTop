const { dialog, app } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const AdmZip = require("adm-zip");

let currentIncrementUpdateVersion = '', decompressing = false, hasCheckWaitUpdate = false, downloadApplying = false, timer = null;

// 增量更新
async function incrementUpdate(currentIncrementUpdate, obsIncrementUpdate, mainMsg) {
    return new Promise((resolve, reject) => {
        let oldPath = process.resourcesPath + "/app.asar.unpacked";
        let targetPath = process.resourcesPath + "/unpacked.zip";
        if (hasCheckWaitUpdate) {
            dialog.showMessageBox({
                type: "info",
                buttons: [mainMsg['cancel'], mainMsg['confirm']],
                title: mainMsg['updateApp'],
                message: mainMsg['updateAppSuccess'],
                detail: mainMsg['restartUpdate'],
                defaultId: 0,
                cancelId: 0,
            }).then(async (response) => {
                if (response === 1) {
                    const res = await handleIncreaseUpdate(oldPath, targetPath, obsIncrementUpdate, mainMsg);
                    resolve(res);
                } else {
                    const res = await handleIncreaseUpdate(oldPath, targetPath, obsIncrementUpdate, mainMsg, false);
                    resolve(res);
                }
            });
        }
        if (downloadApplying) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                dialog.showMessageBox({
                    type: "info",
                    buttons: ["OK"],
                    title: mainMsg['updateApp'],
                    message: mainMsg['updating'],
                    detail: mainMsg['waiting'],
                }).catch();
                timer = null;
            }, 1000);
            return;
        }
        axios.get("https://zsff.drluck.club/ATC/hotVersion.json").then(async (response) => {
            if (response.status == 200) {
                // 服务器版本
                obsIncrementUpdate = response.data.version;
                //两个版本号不同，触发更新
                if (currentIncrementUpdate != obsIncrementUpdate) {
                    downloadApplying = true;
                    let received_bytes = 0, total_bytes = 0;
                    // let startTime = Date.now(), prevLoaded = 0;
                    let req = await axios.get("https://zsff.drluck.club/ATC/unpacked.zip", {
                        responseType: 'stream',
                        onDownloadProgress: progressEvent => {
                            if (total_bytes === 0) total_bytes = progressEvent.total;
                            received_bytes = progressEvent.loaded;
                            /* const currentTime = Date.now();
                            const timeElapsed = (currentTime - startTime) / 1000;
                            const loaded = progressEvent.loaded;
                            const speed = (loaded - prevLoaded) / timeElapsed / 1024;
                            prevLoaded = loaded;
                            const percentComplete = (loaded / progressEvent.total) * 100;
                            mainWin.webContents.send('update', {
                                speed: speed.toFixed(2),
                                percent: percentComplete.toFixed(2),
                            });
                            startTime = currentTime; */
                        }
                    });
                    try {
                        let out = fs.createWriteStream(targetPath);
                        req.data.pipe(out);
                        req.data.on("end", async () => {
                            if (req.status === 200) {
                                const percentComplete = (received_bytes / total_bytes) * 100;
                                if (Math.ceil(percentComplete.toFixed(2)) >= 100) {
                                    const resFn = await updateAtOnce(oldPath, targetPath, obsIncrementUpdate, mainMsg);
                                    resolve(resFn);
                                } else {
                                    out.end();
                                    downloadApplying = false;
                                }
                            } else {
                                //网络波动，下载文件不全
                                out.end();
                                downloadApplying = false;
                            }
                        });
                        req.data.on("error", (e) => {
                            console.info(e)
                            out.end();
                            downloadApplying = false;
                        });
                    } catch (err) {
                        console.info(err)
                        downloadApplying = false;
                    }
                }
            }
        });
    });
}


async function updateAtOnce(oldPath, targetPath, obsIncrementUpdate, mainMsg) {
    return new Promise(resolve => {
        hasCheckWaitUpdate = true;
        dialog.showMessageBox({
            type: "info",
            buttons: [mainMsg['cancel'], mainMsg['confirm']],
            title: mainMsg['updateApp'],
            message: mainMsg['updateAppSuccess'],
            detail: mainMsg['updateAppSuccessDetail'],
            defaultId: 0,
            cancelId: 0,
        }).then(async (response) => {
            if (response === 1) {
                const resFn = await handleIncreaseUpdate(oldPath, targetPath, obsIncrementUpdate, mainMsg);
                console.info(resFn);
                resolve(resFn);
            } else {
                const resFn = await handleIncreaseUpdate(oldPath, targetPath, obsIncrementUpdate, mainMsg, false);
                console.info(resFn);
                resolve(resFn);
            }
        })

    })
}

//删除目标文件夹以及文件夹下的所有文件
function deleteOld(url) {
    let files = [];
    if (fs.existsSync(url)) {
        files = fs.readdirSync(url);
        files.forEach((file, index) => {
            let curPath = path.join(url, file);
            if (fs.statSync(curPath).isDirectory()) {
                deleteOld(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(url);
    }
}

function extractZip(targetPath, oldPath) {
    return new Promise((resolve) => {
        // 解压
        let zip = new AdmZip(targetPath);
        zip.extractAllTo(oldPath, true);
        //删除目标文件夹以及文件夹下的所有文件
        // deleteOld(oldPath + ".old");
        fs.unlink(targetPath, (err) => console.info(err));
        resolve(true);
    });
}

function handleIncreaseUpdate(oldPath, targetPath, obsIncrementUpdate, mainMsg, reload = true) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(targetPath)) {
            hasCheckWaitUpdate = false;
            downloadApplying = false;
            resolve(null);
            return;
        }
        // 不能重复处理文件
        if (decompressing) {
            resolve(null);
            return;
        }
        decompressing = true;
        // 建立.old备份
        fs.rename(oldPath, oldPath + ".old", async (err) => {
            if (err) {
                console.info(err)
                hasCheckWaitUpdate = false;
                downloadApplying = false;
                decompressing = false;
                reject(err);
                return;
            }
            try {
                //解压完之后别忘了要修改本地hotVersion文件的版本号，否则会一直触发更新
                fs.writeFile(path.join(process.resourcesPath, "./scripts/hotVersion.json"), JSON.stringify({ version: obsIncrementUpdate, }, null, 2), () => { });
                currentIncrementUpdateVersion = obsIncrementUpdate;
                hasCheckWaitUpdate = false;
                downloadApplying = false;
                decompressing = false;
                if (reload) {
                    dialog.showMessageBox({
                        type: "info",
                        noLink: true,
                        title: mainMsg['updateApp'],
                        message: mainMsg['updating'],
                        detail: mainMsg['waiting'],
                    }).catch();
                    await extractZip(targetPath, oldPath);
                    //重启应用
                    app.relaunch();
                    app.exit(0);
                    resolve(null);
                } else {
                    const resFn = () => Promise.resolve(extractZip(targetPath, oldPath));
                    resolve(resFn);
                }
            } catch (error) {
                console.info(error)
                downloadApplying = false;
                decompressing = false;
                //恢复
                fs.rename(oldPath + ".old", oldPath, (err) => console.info(err));
                reject(error);
            }
        });
    });
}

module.exports = incrementUpdate;