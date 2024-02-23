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
const { distinguish, verifyBinType } = require("../config/js/verify.js");
const { SOURCE, EST_RUN } = require("../config/json/verifyTypeConfig.json");
const ipc_Main = require("../config/json/communication/ipc.json");
const signType = require("../config/json/communication/sign.json");

const instruct = {
    version: [0x5A, 0x97, 0x98, 0x01, 0xEA, 0x01, 0x75, 0xA5],
    files: [0x5A, 0x97, 0x98, 0x01, 0xE7, 0x01, 0x72, 0xA5],
    app_run: [0x5A, 0x97, 0x98, 0x01, 0xB6, 0x01, 0x41, 0xA5],
    app_stop: [0x5A, 0x97, 0x98, 0x01, 0xB9, 0x01, 0x44, 0xA5],
    restart: [0x5A, 0x97, 0x98, 0x01, 0xB7, 0x01, 0x42, 0xA5],
    matrix: {
        clear: [0x5A, 0x97, 0x98, 0x01, 0xEE, 0x01, 0x79, 0xA5],
    }
}

class Serialport extends Common {

    constructor(...args) {
        super(...args);
        this._type = 'serialport';
        this.port;
        this.receiveDataBuffer = [];
        this.chunkBuffer = [];
        this.chunkIndex = 0;
        this.sign;
        this.timeOutTimer;
        this.verifyType;
        this.filesObj;
        this.receiveObj;
    }

    /**
     * 获取串口列表
     */
    getList() {
        this.ipcHandle(ipc_Main.SEND_OR_ON.CONNECTION.GETLIST, async (event, arg) => {
            const result = await this.serialport.SerialPort.list();
            return { result, type: this._type };
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
    /* disconnectSerial(eventName) {
        this.ipcMain(eventName, () => {
            if (this.port && this.port.opening) {
                this.port.close();
            }
        });
    } */

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
        //开启读取数据监听
        this.handleRead("readable", event);
        //开启获取主机版本监听
        this.getVersion(event);
        //开启串口关闭监听
        this.listenPortClosed("close", event);
        //开启获取文件监听
        this.getBinOrHareWare(ipc_Main.SEND_OR_ON.COMMUNICATION.GETFILES);
        //开启传输错误监听
        this.listenError(ipc_Main.SEND_OR_ON.ERROR.TRANSMISSION);
        //开启删除程序监听
        this.deleteExe(ipc_Main.SEND_OR_ON.EXE.DELETE);
        //开启设备数据监控监听
        this.watchDevice(ipc_Main.SEND_OR_ON.DEVICE.WATCH);
        //开启获取主机文件监听
        this.getAppExe(ipc_Main.SEND_OR_ON.EXE.FILES);
        //开始重启主机监听
        this.restartMain(ipc_Main.SEND_OR_ON.RESTART);
        this.matrixSend(ipc_Main.SEND_OR_ON.MATRIX)
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
            //处理渲染进程发送过来的通信需要的数据
            const { fileData, fileName } = verifyBinType.call(this, {
                verifyType: data.verifyType,
                selectedExe: data.selectedExe,
                files: this.files,                  //文件夹对象
                filesIndex: this.subFileIndex       //文件夹内的子文件遍历下标
            });
            //根据返回的子文件数据和子文件名进入上传处理
            this.upload({
                fileName,
                binData: fileData,
                verifyType: data.verifyType,
                filesIndex: this.subFileIndex,      //当前文件所在文件夹中的下标
                filesLen: this.files.filesLen       //文件夹包含的文件数量
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
        //将子文件数据切割成248个
        this.chunkBuffer = this.uploadSlice(data.binData, 248);
        this.verifyType = data.verifyType;
        this.filesObj = {
            filesIndex: data.filesIndex,        //当前文件所在文件夹中的下标
            fileVerifyType: data.verifyType,
            fileName: data.fileName,            //当前文件名
            filesLen: data.filesLen             //当前文件所在的文件夹的文件数量
        };
        //根据文件类型获取功能码
        const bits = this.getBits(data.verifyType);
        //将文件名放入处理函数获取需要发送给下位机的完整指令
        const { binArr } = this.checkFileName(data.fileName, bits);
        //写入文件名和指令，告诉下位机要发送的文件
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
        //修改标识符，根据标识符判断要发送的是文件还是文件名
        this.sign = str;
        //写入数据
        this.port.write(Buffer.from(data));
        // if(!str) console.log("write=>", data);
        //判断是否是bin文件通信，bin文件通信需要给渲染进程发送通信进度
        if (this.verifyType && this.verifyType.indexOf(SOURCE) == -1) {
            event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.PROGRESS, Math.ceil((this.chunkIndex / this.chunkBuffer.length) * 100));
        }
        if (str && str !== signType.VERSION && str !== signType.EXE.FILES) this.checkOverTime(event);
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
        this.deleteObj(this.files, this.filesObj);
        this.receiveDataBuffer = [];
        this.clearTimer();
        this.verifyType = null;
        this.chunkIndex = 0;
        this.sign = null;
    }

    /**
     * 监听设备信息
     * @param {String} eventName 
     */
    watchDevice(eventName) {
        this.ipcMain(eventName, (event, data) => {
            if (data.stopWatch || !this.receiveObj) return false;
            const result = this.distinguishDevice(this.receiveObj, event);
            event.reply(ipc_Main.RETURN.DEVICE.WATCH, result);
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
        //将文件数据放入处理函数获取需要发送给下位机的完整指令
        const { binArr } = this.checkBinData(element, this.chunkIndex, this.chunkBuffer.length - 1);
        //传入bin数据并修改标识符
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
                //清除超时检测
                this.clearTimer();
                //获取下位机发送过来的数据
                const receiveData = this.port.read();
                //把数据放入处理函数校验是否是完整的一帧并获取数据对象
                const receiveObj = this.catchData(receiveData);
                this.receiveObj = { ...receiveObj };

                if (!this.sign) return;
                //根据标识符进行校验操作检验数据并返回结果
                const verify = this.verification(this.sign, receiveObj, event);
                if (verify) {
                    //结果正确进入处理，函数会检测文件数据是否全部发送完毕
                    this.processReceivedData(event);
                }
            } catch (error) {
                this.handleReadError(error, event, this.clearCache);
            }
        });
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
        //如果是已经发送了最后一组文件数据，就结束通信，否则继续发送下一组
        if (isLast) {
            //进入结束后的处理函数，检测是那种类型的文件发送完毕
            distinguish(this.filesObj, this.verifyType, event);
            //清除缓存
            this.clearCache();
        } else {
            this.sendBin(event);
        }
    }

    /**
     * 获取主机版本
     * @param {*} event 
     */
    getVersion(event) {
        this.writeData(instruct.version, signType.VERSION, event);
    }

    /**
     * 获取主机有多少个程序或运行程序
     * @param {*} event 
     */
    getAppExe(eventName) {
        this.ipcMain(eventName, (event, arg) => {
            if (arg === 'FILE') {
                this.writeData(instruct.files, signType.EXE.FILES, event);
                return;
            } else {
                this.writeData(arg.status === EST_RUN ? instruct.app_stop : instruct.app_run, null, event);
            }
        });
    }

    /**
     * 删除主机上的程序
     * @param {String} eventName 
     */
    deleteExe(eventName) {
        this.ipcMain(eventName, (event, data) => {
            const bits = this.getBits(data.verifyType);
            const { binArr } = this.checkFileName(data.fileName, bits);
            this.writeData(binArr, null, event);
        });
    }

    /**
     * 重启主机
     * @param {String} eventName 
     */
    restartMain(eventName) {
        this.ipcMain(eventName, (event, data) => {
            this.writeData(instruct.restart, null, event);
        });
    }

    /**
     * 矩阵灯交互
     * @param {String} eventName 
     */
    matrixSend(eventName) {
        this.ipcMain(eventName, (event, matrix) => {
            // 先清屏
            this.writeData(instruct.matrix.clear, null, event);
            // 等一秒再改变
            const that = this;
            setTimeout(() => {
                let sum = 0x5a + 0x97 + 0x98 + 0x09 + 0xE0;
                for (let i = 0; i < matrix.length; i++) {
                    const item = matrix[i];
                    sum += item
                }
                let list = [0x5A, 0x97, 0x98, 0x09, 0xE0, ...matrix, (sum & 0xff), 0xA5]
                that.writeData(list, null, event);
            }, 100);
        });
    }
}


module.exports = Serialport