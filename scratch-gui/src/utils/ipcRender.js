/*
 * @Description: New features
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

//错误处理
function handlerError(error) {
    console.error(`error: ${error}`);
    if (error) ipc({ sendName: "transmission-error" });
}

export {
    ipc,
    handlerError
}
