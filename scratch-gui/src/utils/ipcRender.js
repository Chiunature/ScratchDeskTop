/*
 * @Description: 渲染进程和主进程通信
 * @Author: jiang
 * @Date: 2023-06-02 09:21:03
 * @LastEditors: jiang
 * @LastEditTime: 2023-06-02 09:41:04
 * @params : {sendName, sendParams, eventName, callback}
 */
function ipc({ sendName, sendParams, eventName, callback }) {
    if (sendName) window.electron.ipcRenderer.send(sendName, sendParams);
    if (eventName && typeof callback === "function") window.electron.ipcRenderer.on(eventName, (event, arg) => callback(event, arg));
}

function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}


function writeFileWithDirectory(directory, filepath, data) {
    window.fs.mkdir(directory, { recursive: true }, () => {
        window.fs.writeFile(filepath, data + '', err => {
            console.log(err);
        });
    });
}

//错误处理
function handlerError(error) {
    console.error(`error: ${error}`);
    let directory = './Error';
    let filepath = `./Error/error_${getCurrentTime()}.txt`;
    writeFileWithDirectory(directory, filepath, error);
}

export {
    ipc,
    handlerError
}