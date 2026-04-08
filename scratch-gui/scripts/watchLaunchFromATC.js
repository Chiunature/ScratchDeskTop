/**
 * @description: 监视通过 WillAI（.willai）或兼容扩展名启动
 * @param {*}
 * @return {*}
 */
const watchLaunchFromATC = (win, sendName) => {
    const argv = process.argv;
    if (process.platform !== "darwin") {
        // argv[argv.length - 1] 为项目文件路径
        const filePath = argv[argv.length - 1];
        if (/^(.*)\.((willai)|(lbs)|(sb[23]))?$/.test(filePath)) {
            console.info("[app] watchLaunchFromATC open project file", filePath);
            win.webContents.send(sendName, filePath);
        }
    }
}

module.exports = watchLaunchFromATC;
