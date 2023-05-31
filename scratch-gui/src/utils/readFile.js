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
        // 将data分段，每段大小512kb，写入另一个文件
        const chunkSize = 512;
        if (data.length < chunkSize) {
            window.electron.ipcRenderer.send("writeData", data);
        } else {
            for (let i = 0; i < data.length; i += chunkSize) {
                const chunk = data.slice(i, i + chunkSize);
                window.electron.ipcRenderer.send("writeData", chunk);
            }
        }
    });
}
