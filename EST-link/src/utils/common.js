/*
 * @Description: New features
 * @Author: jiang
 * @Date: 2023-06-07 08:58:20
 * @LastEditors: jiang
 * @LastEditTime: 2023-06-15 15:30:17
 * @params: {
 *  subFileIndex:子文件遍历下标
 *  files: 文件目录对象
 * }
 */
const { SOURCE_MUSIC, SOURCE_APP, SOURCE_BOOT, SOURCE_VERSION, SOURCE_CONFIG, BOOTBIN, DELETE_EXE } = require("../config/json/verifyTypeConfig.json");
const ipc_Main = require("../config/json/communication/ipc.json");
class Common {

    constructor(...args) {
        args.map(item => {
            Object.keys(item).map(key => {
                this[key] = item[key];
            });
        });
        this.subFileIndex = 0;
        this.files = {};
    }

    /**
     * 主进程handle方式通信
     * @param {String} eventName 
     * @param {Function} callback 
     */
    ipcHandle(eventName, callback) {
        this.electron.ipcMain.handle(eventName, (event, arg) => callback(event, arg));
    }

    /**
     * 主进程通信
     * @param {String} eventName 
     * @param {Function} callback 
     */
    ipcMain(eventName, callback) {
        const eventList = this.electron.ipcMain.eventNames();
        !eventList.includes(eventName) && this.electron.ipcMain.on(eventName, (event, arg) => {
            return callback(event, arg);
        });
    }

    /**
     * 文件名校验位和指令
     * @param {String} item 
     * @param {Number} bits 
     * @returns 
     */
    checkFileName(item, bits) {
        const list = this.stringToHex(item);
        const len = list.length;
        let sum = 0x5a + 0x97 + 0x98 + len + bits;
        list.map(el => sum += el);
        return {
            binArr: [0x5a, 0x97, 0x98, len, bits, ...list, (sum & 0xff), 0xa5],
            crc: sum & 0xff
        };
    }

    /**
     * bin信息指令
     * @param {Array} item 
     * @param {Number} currentIndex 
     * @param {Number} lastIndex 
     * @returns 
     */
    checkBinData(item, currentIndex, lastIndex) {
        const len = item.length;
        const bits = currentIndex == lastIndex ? 0xbb : 0xaa;
        let sum = 0x5a + 0x97 + 0x98 + len + bits;
        item.map(el => sum += el);
        return {
            binArr: [0x5a, 0x97, 0x98, len, bits, ...item, (sum & 0xff), 0xa5],
            crc: sum & 0xff
        };
    }

    /**
     * 发送数据
     * @param {String} eventName 
     * @param {Function} fn 
     */
    sendToSerial(eventName, fn) {
        this.ipcMain(eventName, (event, data) => {
            if (typeof fn === 'function') {
                fn.call(this, event, data);
            }
        });
    }

    /**
     * 侦听编译时的错误处理
     * @param {String} eventName 
     */
    listenError(eventName) {
        this.ipcMain(eventName, (event) => event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, { result: false, msg: "uploadError" }));
    }

    /**
     * 数据转buffer数组
     * @param {Array} buf 
     * @returns 
     */
    toArrayBuffer(buf) {
        let view = [];
        for (let i = 0; i < buf.length; i++) {
            view.push(buf[i]);
        }
        return new Uint8Array(view);
    }


    /**
     * 将字符串转十六进制
     * @param {String} str 
     * @returns 
     */
    stringToHex(str) {
        let val = [];
        for (let i = 0; i < str.length; i++) {
            const hex = str.charCodeAt(i).toString(16);
            const num = parseInt(hex, 16);
            val.push(num);
        }
        return val;
    }

    /**
     * 检测数据并转buffer数组
     * @param {*} data 
     * @returns 
     */
    Get_CRC(data) {
        let arr = [];
        if (!Array.isArray(data)) {
            arr = this.toArrayBuffer(data);
        } else {
            arr = [...new Uint8Array(data)];
        }
        return arr;
    }

    /**
     * 分段上传
     * @param {Array} data 
     * @param {Number} size 
     * @returns 
     */
    uploadSlice(data, size) {
        let newArr = [];
        const chunkSize = size;
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

    /**
     * 对接收数据的错误处理
     * @param {*} event 
     * @param {Function} fn 
     */
    handleReadError(err, event, fn) {
        event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, { result: false, msg: "uploadError" });
        const mainPath = this.process.cwd();
        const directory = mainPath + '/Error';
        const filepath = `${mainPath}/Error/error_${new Date().toLocaleTimeString().replaceAll(':', '-')}.txt`;
        this.fs.mkdir(directory, { recursive: true }, () => this.fs.writeFile(filepath, err + '', fn.bind(this)));
    }

    /**
     * 从文件夹获取文件名
     * @param {String} folderPath 
     * @returns 
     */
    readmidr(folderPath) {
        const files = this.fs.readdirSync(folderPath);
        return files;
    }

    /**
     * 读取文件内容
     * @param {String} path 
     * @param {String} type 
     * @returns 
     */
    readFiles(path, type) {
        try {
            const data = this.fs.readFileSync(path, type);
            return data;
        } catch (error) {
            return false;
        }
    }

    /**
     * 写入文件
     * @param {String} path 
     * @param {String} type 
     * @returns 
     */
    writeFiles(path, type) {
        try {
            this.fs.writeFileSync(path, type);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * 判断功能码
     * @param {Number} verifyType 
     * @returns 
     */
    getBits(verifyType) {
        switch (verifyType) {
            case BOOTBIN:
                return 0xda;
            case SOURCE_MUSIC:
                return 0xec;
            case SOURCE_APP:
                return 0xda;
            case SOURCE_BOOT:
                return 0xdb;
            case SOURCE_VERSION:
                return 0xdd;
            case SOURCE_CONFIG:
                return 0xdc;
            case DELETE_EXE:
                return 0xdf;
            default:
                break;
        }
    }

    /**
     * 校验数据的switch
     * @param {Object} actions 
     * @param {String} condition 
     * @param {String} type 
     * @returns 
     */
    switch(actions, condition, type = false) {
        if (type) {
            if (actions[condition] && typeof actions[condition] === 'function') {
                return actions[condition]();
            } else {
                return false;
            }
        } else {
            if (actions[condition] && typeof actions[condition] === 'function') {
                actions[condition]();
            } else {
                return false;
            }
        }
    }

}

module.exports = Common;