/**
 * @description: 监视通过 newai/lbs 文件启动
 * @param {*}
 * @return {*}
 */
const watchLaunchFromATC = (win, sendName) => {
    const argv = process.argv;
    if (process.platform !== "darwin") {
        // argv[argv.length - 1] 为 newai/lbs 文件路径
        const filePath = argv[argv.length - 1];
        if (/^(.*)\.((newai|lbs)|(sb[23]))?$/.test(filePath)) {
            console.info("[app] watchLaunchFromATC open project file", filePath);
            win.webContents.send(sendName, filePath);
        }
    }
}

module.exports = watchLaunchFromATC;
