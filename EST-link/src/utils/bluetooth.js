const Common = require("./common");
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
    },
    ble: [0x5A, 0x97, 0x98, 0x01, 0xB8, 0x01, 0x43, 0xA5]
}

class Bluetooth extends Common {
    constructor(...args) {
        super(...args);
        this._type = 'ble';
        this.peripheral = [];
        this.service;
        this.serviceUUID = '0000fff0-0000-1000-8000-00805f9b34fb';
        this.characteristicUUID = '0000fff1-0000-1000-8000-00805f9b34fb';
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
     * 扫描设备
* @param {Boolean} type true表示开启扫描, false表示停止扫描
     */
    scanning(type) {
        this.noble.removeAllListeners('stateChange');
        this.noble.on('stateChange', async (state) => {
            if (state === 'poweredOn' && type) {
                this.noble.startScanning([], true);
            } else {
                this.noble.stopScanning();
            }
        });
        return this;
    }

    /**
         * 连接蓝牙并打开监听服务
         * @returns 
         */
    async linkBle(event) {
        this.peripheral = await this.discover();
        const resForConnect = this.peripheral && await this.connect();
        const resForServices = resForConnect && await this.discoverServices();
        const resForCharacteristics = resForServices && await this.discoverCharacteristics();
        resForCharacteristics && await this.bleSubscribe(event);
        if (!resForConnect || !resForServices || !resForCharacteristics) {
            return {
                ble: null,
                bleType: null,
                msg: "failedConnected"
            }
        }
        //开启获取文件监听
        this.getBinOrHareWare(ipc_Main.SEND_OR_ON.COMMUNICATION.GETFILES);
        //开启获取主机文件监听
        this.getAppExe(ipc_Main.SEND_OR_ON.EXE.FILES);
        // 切换到串口
        this.bleWrite(instruct.ble, null, event);
        // 断开连接监听
        this.disconnect(event);
        return {
            ble: this.peripheral,
            bleType: this._type,
            msg: resForConnect ? "successfullyConnected" : "failedConnected",
        }
    }

    /**
     * 发现设备
     */
    discover() {
        this.noble.removeAllListeners('discover');
        return new Promise((resolve) => {
            this.noble.on('discover', (peripheral) => {
                if (peripheral.advertisement.localName === 'EST_BLUE' && peripheral.state === 'disconnected') {
                    this.noble.stopScanning();
                    resolve(peripheral);
                }
            });
        });
    }

    /**
     * 连接到设备
     */
    connect() {
        return new Promise((resolve, reject) => {
            this.peripheral.connect((error) => {
                if (error) {
                    console.error('连接到设备失败', error);
                    reject(false);
                    return;
                }
                resolve(true);
            });
        });
    }

    /**
     * 断开连接
     */
    disconnect(event) {
        this.peripheral.on('disconnect', (err) => {
            clearInterval(this.timeOutTimer);
            event.reply(ipc_Main.RETURN.BLE.DISCONNECTED, "disconnect");
        })
    }

    /**
     * 发现服务
     */
    discoverServices() {
        return new Promise((resolve, reject) => {
            this.peripheral.discoverServices([this.serviceUUID], (error, services) => {
                if (error) {
                    console.error('发现服务失败', error);
                    reject(error);
                    return;
                }

                this.service = services[0];
                resolve(services);
            });
        });
    }

    /**
     * 发现特征
     */
    discoverCharacteristics() {
        return new Promise((resolve, reject) => {
            this.service.discoverCharacteristics([this.characteristicUUID], (error, characteristics) => {
                if (error) {
                    console.error('发现特征失败', error);
                    reject(error);
                    return;
                }

                this.characteristic = characteristics[0];
                resolve(true);
            });
        });
    }


    /**
     * 发送数据
     */
    async bleWrite(data, str, event, withResponse = true) {
        const writeData = Buffer.from(data);
        return new Promise((resolve, reject) => {
            //修改标识符，根据标识符判断要发送的是文件还是文件名
            this.sign = str;
            //写入数据
            this.characteristic.write(writeData, withResponse, (error) => {
                if (error) {
                    console.error('发送数据失败', error);
                    reject(false);
                    return;
                }
                // console.log('成功发送数据=>', writeData);
            });
            if (this.verifyType && this.verifyType.indexOf(SOURCE) == -1) {
                event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.PROGRESS, Math.ceil((this.chunkIndex / this.chunkBuffer.length) * 100));
            }
            if (str && str !== signType.VERSION && str !== signType.EXE.FILES) this.checkOverTime(event);
            resolve(true);
        });
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
     * 清除缓存
     */
    clearCache() {
        this.deleteObj(this.files, this.filesObj);
        this.receiveDataBuffer = [];
        this.clearTimer();
        this.verifyType = null;
        this.chunkIndex = 0;
        this.sign = null;
    }


    /**
     * 接收数据(这个方法不好用)
     */
    /* bleRead(event) {
        return new Promise((resolve, reject) => {
            this.characteristic.read((err, data) => {
                if (err) {
                    return reject(err);
                }
                console.log(data);
                //把数据放入处理函数校验是否是完整的一帧并获取数据对象
                this.receiveObj = this.catchData(data);
                //开启设备数据监控监听
                setTimeout(() => that.watchDevice(event));
                if (!this.sign) return;
                //根据标识符进行校验操作检验数据并返回结果
                const verify = this.verification(this.sign, this.receiveObj, event);
                if (verify) resolve(true);
resolve();
            });
        });
    } */

    /**
     * 启用通知
     */
    bleSubscribe(event) {
        return new Promise((resolve, reject) => {
            this.characteristic.subscribe((error) => {
                if (error) {
                    console.error('启用通知失败', error);
                    this.characteristic.unsubscribe();
                    reject(false);
                    return;
                }
                // console.log('已启用通知');
                const that = this;
                this.characteristic.on('data', (data) => {
                    //清除超时检测
                    this.clearTimer();
                    // console.log(data);
                    //把数据放入处理函数校验是否是完整的一帧并获取数据对象
                    this.receiveObj = this.catchData(data);
                    //开启设备数据监控监听
                    setTimeout(() => that.watchDevice(event));

                    if (!this.sign) return;
                    //根据标识符进行校验操作检验数据并返回结果
                    const verify = this.verification(this.sign, this.receiveObj, event);
                    if (verify) {
                        //结果正确进入处理，函数会检测文件数据是否全部发送完毕
                        this.processReceivedData(event);
                    }
                });
                resolve(true);
            });
        });
    }

    /**
     * 清除所有定时器
     */
    clearTimer() {
        clearTimeout(this.timeOutTimer);
        this.timeOutTimer = null;
    }

    /**
     * 监听设备信息
     * @param {String} eventName 
     */
    watchDevice(event) {
        if (!this.receiveObj) return false;
        const result = this.distinguishDevice(this.receiveObj, event);
        event.reply(ipc_Main.RETURN.DEVICE.WATCH, result);
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
     * 获取主机有多少个程序或运行程序
     * @param {*} event 
     */
    getAppExe(eventName) {
        this.ipcMain(eventName, async (event, arg) => {
            if (arg === 'FILE') {
                await this.bleWrite(instruct.files, signType.EXE.FILES, event);
                return;
            } else {
                await this.bleWrite(arg.status === EST_RUN ? instruct.app_stop : instruct.app_run, null, event);
            }
        });
    }

    /**
     * 上传文件
     * @param {*} event 
     * @param {Object} data 
     * @returns 
     */
    async upload(data, event) {
        try {
            if (!data.binData || !data.fileName) {
                return;
            }
            //将子文件数据切割成248个
            this.chunkBuffer = this.uploadSlice(data.binData, 128);
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
            await this.bleWrite(binArr, signType.BOOT.FILENAME, event);
        } catch (error) {
            console.log(error);
            this.handleReadError(error, event, this.clearCache);
        }
    }

    /**
     * 发bin数据
     * @param {Number} index 
     * @param {*} event 
     * @returns 
     */
    async sendBin(event) {
        if (this.chunkIndex < 0) {
            return;
        }
        const element = this.chunkBuffer[this.chunkIndex];
        //将文件数据放入处理函数获取需要发送给下位机的完整指令
        const { binArr } = this.checkBinData(element, this.chunkIndex, this.chunkBuffer.length - 1);
        //传入bin数据并修改标识符
        await this.bleWrite(binArr, signType.BOOT.BIN, event);
    }


}

module.exports = Bluetooth;