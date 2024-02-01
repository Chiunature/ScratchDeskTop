const Common = require("./common");
const { verifyActions, distinguish, verifyBinType } = require("../config/js/verify.js");
const { SOURCE } = require("../config/json/verifyTypeConfig.json");
const ipc_Main = require("../config/json/communication/ipc.json");
const signType = require("../config/json/communication/sign.json");
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
        const resbleSubscribe = resForCharacteristics && await this.bleSubscribe();
        if (!resForConnect || !resForServices || !resForCharacteristics) {
            return {
                ble: null,
                bleType: null,
                msg: "failedConnected"
            }
        }
        if (resbleSubscribe) {
            //开启获取文件监听
            this.getBinOrHareWare(ipc_Main.SEND_OR_ON.COMMUNICATION.GETFILES);
        }
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
                console.log('成功连接到设备');
                resolve(true);
            });
        });
    }

    /**
     * 断开连接
     */
    disconnect(event) {
        this.peripheral.on('disconnect', (err) => {
            console.log('成功断开连接');
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
            if (str && str.search('Boot') !== -1) {
                this.checkOverTime(event);
            }
            //写入数据
            this.characteristic.write(writeData, withResponse, (error) => {
                if (error) {
                    console.error('发送数据失败', error);
                    reject(false);
                    return;
                }
                console.log('成功发送数据=>', writeData);
            });
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
        this.peripheral = [];
        this.service = null;
        this.receiveDataBuffer = [];
        this.timeOutTimer = null;
        this.verifyType = null;
        this.chunkIndex = 0;
        this.sign = null;
    }

    /**
     * 接收数据
     */
    bleRead(event) {
        return new Promise((resolve, reject) => {
            this.characteristic.read((err, data) => {
                if (err) {
                    return reject(err);
                }
                console.log(data);
                //把数据放入处理函数校验是否是完整的一帧并获取数据对象
                // const receiveObj = this.catchData(data);
                // this.receiveObj = { ...receiveObj };
                // if (!this.sign) return;
                //根据标识符进行校验操作检验数据并返回结果
                // const verify = this.verification(this.sign, receiveObj, event);
                resolve(true);
            });
        });
    }

    /**
     * 启用通知
     */
    bleSubscribe() {
        return new Promise((resolve, reject) => {
            this.characteristic.subscribe((error) => {
                if (error) {
                    console.error('启用通知失败', error);
                    this.characteristic.unsubscribe();
                    reject(false);
                    return;
                }
                console.log('已启用通知');
                resolve(true);
            });
        });
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
    async upload(data, event) {
        try {
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
            const writeRes = await this.bleWrite(binArr, signType.BOOT.FILENAME, event);
            //读取发送文件名后下位机返回的数据
            const readRes = writeRes && await this.bleRead();
            //数据校验成功就发bin数据
            if (readRes) this.sendBin(event);
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
        if (this.sign === signType.BOOT.FILENAME) {
            this.sign = signType.BOOT.BIN;
        }
        const item = this.chunkBuffer[this.chunkIndex];
        const { binArr } = this.checkBinData(item, this.chunkIndex, this.chunkBuffer.length - 1);
        const writeRes = await this.bleWrite(binArr, signType.BOOT.BIN, event);
        const readRes = writeRes && await this.bleRead();
        this.chunkIndex++;
        if (readRes) {
            const isLast = this.chunkIndex > this.chunkBuffer.length - 1;
            //如果是已经发送了最后一组文件数据，就结束通信，否则继续发送下一组
            if (isLast) {
                //进入结束后的处理函数，检测是那种类型的文件发送完毕
                distinguish(this.filesObj, this.verifyType, event);
                //清除缓存
                this.clearCache();
                return;
            } else {
                this.sendBin(event);
            }
        }
    }


}

module.exports = Bluetooth;