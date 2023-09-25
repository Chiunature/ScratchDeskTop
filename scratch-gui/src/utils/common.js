const { ipcMain } = require("electron");
const fs = require("fs");

class Common {
    //进程通信
    ipcMain(eventName, callback) {
        const eventList = ipcMain.eventNames();
        !eventList.includes(eventName) && ipcMain.on(eventName, (event, arg) => {
            return callback(event, arg);
        });
    }

    //获取文件名字
    getBootName(path, type) {
        let name = fs.readFileSync(path, type);
        return name;
    }

    //文件名校验位和指令
    checkFileName(item, bits) {
        let list = this.stringToHex(item);
        let len = list.length;
        let sum = 0x5a + 0x97 + 0x98 + len + bits;
        list.forEach(el => sum += el);
        return {
            binArr: [0x5a, 0x97, 0x98, len, bits, ...list, (sum & 0xff), 0xa5],
            crc: sum & 0xff
        };
    }

    //bin信息指令
    checkBinData(item, currentIndex, lastIndex) {
        let len = item.length;
        let bits = currentIndex == lastIndex ? 0xbb : 0xaa;
        let sum = 0x5a + 0x97 + 0x98 + len + bits;
        item.forEach(el => sum += el);
        return {
            binArr: [0x5a, 0x97, 0x98, len, bits, ...item, (sum & 0xff), 0xa5],
            crc: sum & 0xff
        };
    }

    //发送数据
    sendToSerial(eventName, fn) {
        this.ipcMain(eventName, (event, data) => {
            if (typeof fn === 'function') fn.call(this, event, data);
        });
    }

    //侦听编译时的错误处理
    listenError(eventName) {
        this.ipcMain(eventName, (event) => event.reply("completed", { result: false, msg: "uploadError" }));
    }

    //数据转buffer数组
    toArrayBuffer(buf) {
        let view = [];
        for (let i = 0; i < buf.length; i++) {
            view.push(buf[i]);
        }
        return view;
    }

    //将字符串转十六进制
    stringToHex(str) {
        var val = [];
        for (var i = 0; i < str.length; i++) {
            let hex = str.charCodeAt(i).toString(16);
            let num = parseInt(hex, 16);
            val.push(num);
        }
        return val;
    }

    //检测数据并转buffer数组
    Get_CRC(data) {
        let arr = [];
        if (!Array.isArray(data)) {
            arr = this.toArrayBuffer(data);
        } else {
            arr = [...data];
        }
        return arr;
    }

    //分段上传
    uploadSlice(data, size) {
        let newArr = [];
        let chunkSize = size;
        if (data.length < chunkSize) {
            newArr.push(data);
        } else {
            for (let i = 0; i < data.length; i += chunkSize) {
                let chunk = data.slice(i, i + chunkSize);
                newArr.push(chunk);
            }
        }
        return newArr;
    }

    //对接收数据的错误处理
    handleReadError(event, fn) {
        if (typeof fn === 'function') fn.apply(this);
        event.reply("completed", { result: false, msg: "uploadError" });
    }

    //从文件夹获取文件名
    readmidr(folderPath) {
        let files = fs.readdirSync(folderPath);
        return files;
    }

    //读取文件
    readFiles(path, type) {
        let data = fs.readFileSync(path, type);
        return data;
    }

    switch(actions, condition, type) {
        if(type) {
            if (actions[condition]) {
                return actions[condition]();
            } else {
                return false;
            }
        }else {
            if (actions[condition]) {
                actions[condition]();
            } else {
                return false;
            }
        }
    }

    actions(data) {
        return data
    }

}

module.exports = Common;