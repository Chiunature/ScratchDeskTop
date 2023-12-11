/*
 * @Description: New features
 * @Author: jiang
 * @Date: 2023-06-07 08:58:20
 * @LastEditors: jiang
 * @LastEditTime: 2023-06-15 15:30:17
 * @params: {
 *  port: 串口
 *  chunkBuffer: bin文件数据缓存
 *  chunkIndex: 切片下标
 *  sign: 步骤标识
 *  timeOutTimer: 检测指令是否成功有返回
 *  verifyType: 判断是发固件文件还是bin数据
 *  receiveDataBuffer: 接收到的数据缓存
 *  filesObj: 传输的文件对象
 * }
 */
const Common = require("./common.js");
const { verifyActions, processReceivedConfig, verifyBinType } = require("../config/js/verify.js");
const { SOURCE } = require("../config/json/verifyTypeConfig.json");

class Serialport extends Common {

    constructor(...args) {
        super();
        args.map(item => {
            Object.keys(item).map(key => {
                this[key] = item[key];
            });
        });
        this.port;
        this.receiveDataBuffer = [];
        this.chunkBuffer = [];
        this.chunkIndex = 0;
        this.sign;
        this.timeOutTimer;
        this.verifyType;
        this.filesObj;
    }

    /**
     * 获取串口列表
     */
    getList() {
        this.ipcMain("getConnectList", (event, arg) => {
            this.serialport.SerialPort.list().then((res) => event.reply("connectList", res));
        });
    }

    /**
     * 连接串口
     */
    connectSerial() {
        this.ipcMain("connect", (event, arg) => this.linkToSerial(arg, event));
    }

    /**
     * 断开连接
     * @param {String} eventName 
     */
    disconnectSerial(eventName) {
        this.ipcMain(eventName, () => {
            if (this.port && this.port.isOpen) this.port.close();
        });
    }

    /**
     * 连接串口
     * @param {Object} serial 
     * @param {*} event 
     * @param {String | Null} sign 
     */
    linkToSerial(serial, event, sign) {
        if (this.port && this.port.isOpen && this.port.path === serial.path) {
            return;
        }

        this.port = new this.serialport.SerialPort(
            {
                path: serial.path,
                baudRate: 115200
            },
            (err) => {
                if (err && !sign) {
                    event.reply("connected", { res: false, msg: "failedConnected" });
                } else if (!err && !sign) {
                    event.reply("connected", { res: true, msg: "successfullyConnected" });
                }
            }
        );
        this.handleRead("readable", event);
        this.listenPortClosed("close", event);
        this.disconnectSerial("disconnected");
        this.getBinOrHareWare("getFilesAndCommunication");
        this.listenError("transmission-error");
        this.watchDevice("watchDevice");
        this.deleteExe("delete-exe");
        this.getVersion(event);
    }

    /**
     * 获取渲染进程发过来的bin文件数据准备通信
     * @param {String} eventName 
     */
    getBinOrHareWare(eventName) {
        this.ipcMain(eventName, (event, data) => {
            if (typeof data.subFileIndex === 'number') {
                this.subFileIndex = data.subFileIndex;
            }
            if (data.clearFilesObj) {
                for (const key in this.files) {
                    delete this.files[key];
                }
            }
            const { fileData, fileName } = verifyBinType({
                verifyType: data.verifyType,
                selectedExe: data.selectedExe,
                filesObj: this.files,
                filesIndex: this.subFileIndex,
                readFiles: this.readFiles.bind(this),
                writeFiles: this.writeFiles.bind(this)
            });
            this.upload(event, { fileName, binData: fileData, verifyType: data.verifyType, filesIndex: this.subFileIndex,  filesLen: this.files.filesLen});
        });
    }

    /**
     * 上传文件
     * @param {*} event 
     * @param {Object} data 
     * @returns 
     */
    upload(event, data) {
        if (!data.binData || !data.fileName) return;
        this.chunkBuffer = this.uploadSlice(data.binData, 248);
        this.verifyType = data.verifyType;
        this.filesObj = {
            filesIndex: data.filesIndex,
            fileVerifyType: data.verifyType,
            fileName: data.fileName,
            filesLen: data.filesLen
        };
        const bits = this.getBits(data.verifyType);
        const { binArr } = this.checkFileName(data.fileName, bits);
        this.writeData(binArr, data.binData ? 'Boot_Name' : null, event);
    }

    /**
     * 侦听串口关闭
     * @param {String} eventName 
     * @param {*} event 
     */
    listenPortClosed(eventName, event) {
        this.port.on(eventName, () => {
            event.reply("connected", { res: false, msg: "disconnect" });
            this.clearCache();
        });
    }

    /**
     * 写入数据
     * @param {Array} data 
     * @param {String} str 
     * @param {*} event 
     * @returns 
     */
    writeData(data, str, event) {
        if (!this.port) return;
        this.sign = str;
        this.port.write(data);
        // console.log("write=>", data);
        if (this.verifyType && this.verifyType.indexOf(SOURCE) == -1) {
            event.reply('progress', Math.ceil((this.chunkIndex / this.chunkBuffer.length) * 100));
        }
        if (str && str.search('Boot') !== -1) {
            this.checkOverTime(event);
        }
    }

    /**
     * 检测是否超时
     * @param {*} event 
     */
    checkOverTime(event) {
        this.timeOutTimer = setTimeout(() => {
            event.reply("completed", { result: false, msg: "uploadTimeout" });
            this.clearCache();
        }, 5000);
    }

    /**
     * 清除所有定时器
     */
    clearTimer() {
        clearTimeout(this.timeOutTimer);
        this.timeOutTimer = null;
    }

    /**
     * 清除缓存
     */
    clearCache() {
        if (this.port && this.port.isOpen) this.port.flush();
        this.receiveDataBuffer = [];
        this.timeOutTimer = null;
        this.chunkIndex = 0;
        this.sign = null;
    }

    /**
     * 监听设备信息
     * @param {String} eventName 
     */
    watchDevice(eventName) {
        this.ipcMain(eventName, (event, data) => {
            if (!data.stopWatch) this.writeData(data.instruct, 'Watch_Device', event);
        });
    }

    /**
     * 发bin数据
     * @param {Number} index 
     * @param {*} event 
     * @returns 
     */
    sendBin(index, event) {
        if (index < 0) return;
        const element = this.chunkBuffer[index];
        const { binArr } = this.checkBinData(element, index, this.chunkBuffer.length - 1);
        if (index === this.chunkBuffer.length - 1) {
            this.writeData(binArr, 'Boot_End', event);
        } else {
            this.writeData(binArr, 'Boot_Bin', event);
        }
    }

    /**
     * 读取串口数据
     * @param {String} eventName 
     * @param {*} event 
     * @returns 
     */
    handleRead(eventName, event) {
        if (!this.port) return;
        this.port.on(eventName, () => {
            try {
                this.clearTimer();
                const receiveData = this.port.read();
                const receiveObj = this.catchData(receiveData);
                const verify = this.verification(this.sign, receiveObj, event, this.hexToString.bind(this));
                if (verify) this.processReceivedData(event);
            } catch (error) {
                this.handleReadError(event, this.clearCache);
            }
        });
    }

    /**
     * 捕捉接收的数据
     * @param {String} data 
     * @returns 
     */
    catchData(data) {
        if (!this.sign || !data) return;
        const list = this.Get_CRC(data);
        const start = list.indexOf(0x5a);
        let newList = [];
        if (list[start] === 0x5a && list[start + 1] === 0x98 && list[start + 2] === 0x97) {
            for (let i = start; i < list[start + 3] + 7; i++) {
                newList.push(list[i]);
            }
            return { data: newList, bit: newList[4] };
        } else {
            return false;
        }
    }

    /**
     * 校验数据
     * @param {String | Null} sign 
     * @param {Array} data 
     * @param {*} event 
     * @param {Function} hexToString 
     * @returns 
     */
    verification(sign, obj, event, hexToString) {
        if (!obj) return false;
        if (obj.data && obj.data.length <= 0) return false;
        const result = verifyActions(sign, obj, event, hexToString);
        if (typeof result === 'object') {
            const action = this.actions(result);
            return this.switch(action, sign, true);
        } else {
            return result;
        }
    }

    /**
     * 处理接收到的数据
     * @param {*} event 
     */
    processReceivedData(event) {
        if (this.sign == 'Boot_Name') {
            this.sign = 'Boot_Bin';
        } else {
            this.chunkIndex++;
        }
        const actions = processReceivedConfig({
            event,
            chunkIndex: this.chunkIndex,
            verifyType: this.verifyType,
            filesObj: this.filesObj,
            sendBin: this.sendBin.bind(this),
            clearCache: this.clearCache.bind(this)
        });
        this.switch(actions, this.sign);
    }

    /**
     * 获取主机版本
     * @param {*} event 
     */
    getVersion(event) {
        this.writeData([0x5A, 0x97, 0x98, 0x01, 0xE1, 0x01, 0x6C, 0xA5], 'get_version', event);
    }

    /**
     * 删除主机上的程序
     * @param {String} eventName 
     */
    deleteExe(eventName) {
        this.ipcMain(eventName, (event, data) => {
            const bits = this.getBits(data.verifyType);
            const { binArr } = this.checkFileName(data.fileName, bits);
            this.writeData(binArr, 'delete-exe', event);
        });
    }
}


module.exports = Serialport