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
const { verifyActions, distinguish, verifyBinType } = require("../config/js/verify.js");
const { SOURCE } = require("../config/json/verifyTypeConfig.json");
const ipc_Main = require("../config/json/communication/ipc.json");
const signType = require("../config/json/communication/sign.json");
class Serialport extends Common {

    constructor(...args) {
        super(...args);
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
        this.ipcHandle(ipc_Main.SEND_OR_ON.CONNECTION.GETLIST, async (event, arg) => {
            const res = await this.serialport.SerialPort.list();
            return res;
        });
    }

    /**
     * 连接串口
     */
    connectSerial() {
        this.ipcMain(ipc_Main.SEND_OR_ON.CONNECTION.CONNECTED, (event, arg) => this.linkToSerial(arg, event));
    }

    /**
     * 断开连接
     * @param {String} eventName 
     */
    disconnectSerial(eventName) {
        this.ipcMain(eventName, () => {
            if (this.port && this.port.opening) {
                this.port.close();
            }
        });
    }

    /**
     * 连接串口
     * @param {Object} serial 
     * @param {*} event 
     */
    linkToSerial(serial, event) {
        if (this.port && this.port.opening && this.port.path === serial.path) {
            this.port.close();
            return;
        } else {
            this.port = new this.serialport.SerialPort({ path: serial.path, baudRate: 115200, autoOpen: false });
            this.OpenPort(event);
        }
        this.handleRead("readable", event);
        this.listenPortClosed("close", event);
        this.disconnectSerial(ipc_Main.SEND_OR_ON.CONNECTION.DISCONNECTED);
        this.getBinOrHareWare(ipc_Main.SEND_OR_ON.COMMUNICATION.GETFILES);
        this.listenError(ipc_Main.SEND_OR_ON.ERROR.TRANSMISSION);
        this.watchDevice(ipc_Main.SEND_OR_ON.DEVICE.WATCH);
        this.deleteExe(ipc_Main.SEND_OR_ON.EXE.DELETE);
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
            const { fileData, fileName } = verifyBinType.call(this, {
                verifyType: data.verifyType,
                selectedExe: data.selectedExe,
                files: this.files,
                filesIndex: this.subFileIndex
            });
            this.upload({
                fileName, 
                binData: fileData, 
                verifyType: data.verifyType, 
                filesIndex: this.subFileIndex, 
                filesLen: this.files.filesLen 
            }, event);
        });
    }

    /**
     * 上传文件
     * @param {*} event 
     * @param {Object} data 
     * @returns 
     */
    upload(data, event) {
        if (!data.binData || !data.fileName) {
            return;
}
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
        this.writeData(binArr, signType.BOOT.FILENAME, event);
    }

    /**
     * 串口打开
     * @param {*} event 
     */
    OpenPort(event) {
        this.port.open((err) => {
            if (err) {
                event.reply(ipc_Main.RETURN.CONNECTION.CONNECTED, { res: false, msg: "failedConnected" });
            } else {
                event.reply(ipc_Main.RETURN.CONNECTION.CONNECTED, { res: true, msg: "successfullyConnected" });
            }
        });
    }

    /**
     * 侦听串口关闭
     * @param {String} eventName 
     * @param {*} event 
     */
    listenPortClosed(eventName, event) {
        this.port.on(eventName, () => {
            event.reply(ipc_Main.RETURN.CONNECTION.CONNECTED, { res: false, msg: "disconnect" });
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
        if (!this.port) {
            return;
        }
        this.sign = str;
        this.port.write(data);
        // console.log("write=>", data);
        if (this.verifyType && this.verifyType.indexOf(SOURCE) == -1) {
            event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.PROGRESS, Math.ceil((this.chunkIndex / this.chunkBuffer.length) * 100));
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
            event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, { result: false, msg: "uploadTimeout" });
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
        if (this.port && this.port.opening) {
            this.port.flush();
        }
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
            if (!data.stopWatch) {
                this.writeData(data.instruct, signType.DEVICE.WATCH, event);
            }
        });
    }

    /**
     * 发bin数据
     * @param {Number} index 
     * @param {*} event 
     * @returns 
     */
    sendBin(event) {
        if (this.chunkIndex < 0) {
            return;
        }
        const element = this.chunkBuffer[this.chunkIndex];
        const { binArr } = this.checkBinData(element, this.chunkIndex, this.chunkBuffer.length - 1);
        this.writeData(binArr, signType.BOOT.BIN, event);
    }

    /**
     * 读取串口数据
     * @param {String} eventName 
     * @param {*} event 
     * @returns 
     */
    handleRead(eventName, event) {
        if (!this.port) {
            return;
        }
        this.port.on(eventName, () => {
            try {
                this.clearTimer();
                const receiveData = this.port.read();
                const receiveObj = this.catchData(receiveData);
                const verify = this.verification(this.sign, receiveObj, event);
                if (verify) {
                    this.processReceivedData(event);
                }
            } catch (error) {
                this.handleReadError(error, event, this.clearCache);
            }
        });
    }

    /**
     * 捕捉接收的数据
     * @param {String} data 
     * @returns 
     */
    catchData(data) {
        if (!this.sign || !data) {
            return;
        }
        const list = this.getBufferArray(data);
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
     * @returns 
     */
    verification(sign, obj, event) {
        if (!obj || (obj.data && obj.data.length <= 0)) {
            return false;
        }
        const result = verifyActions(sign, obj, event);
        if (typeof result === 'object') {
            return this.switch(result, sign, true);
        } else {
            return result;
        }
    }

    /**
     * 处理接收到的数据
     * @param {*} event 
     */
    processReceivedData(event) {
        if (this.sign === signType.BOOT.FILENAME) {
            this.sign = signType.BOOT.BIN;
        } else {
            this.chunkIndex++;
        }
        const isLast = this.chunkIndex > this.chunkBuffer.length - 1;
        if(isLast) {
            distinguish(this.filesObj, this.verifyType, event);
            this.clearCache();
        }else {
            this.sendBin(event);
        }
    }

    /**
     * 获取主机版本
     * @param {*} event 
     */
    getVersion(event) {
        this.writeData([0x5A, 0x97, 0x98, 0x01, 0xE1, 0x01, 0x6C, 0xA5], signType.VERSION, event);
    }

    /**
     * 删除主机上的程序
     * @param {String} eventName 
     */
    deleteExe(eventName) {
        this.ipcMain(eventName, (event, data) => {
            const bits = this.getBits(data.verifyType);
            const { binArr } = this.checkFileName(data.fileName, bits);
            this.writeData(binArr, signType.EXE.DELETE, event);
        });
    }
}


module.exports = Serialport