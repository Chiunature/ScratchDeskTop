/*
 * @Description: New features
 * @Author: jiang
 * @Date: 2023-05-31 11:32:51
 * @LastEditors: jiang
 * @LastEditTime: 2023-05-31 13:39:49
 */
const fs = window.fs;

export function getFiles(path) {
    fs.readFile(path, (err, data) => {
        if (err) throw err;
        window.electron.ipcRenderer.send("writeData", data);
    });
}
