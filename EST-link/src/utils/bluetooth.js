const Common = require("./common");
const { distinguish, verifyBinType } = require("../config/js/verify.js");
const { SOURCE, EST_RUN } = require("../config/json/verifyTypeConfig.json");
const ipc_Main = require("../config/json/communication/ipc.json");
const signType = require("../config/json/communication/sign.json");
const { instruct } = require("../config/js/instructions.js");

const reg = /\{\s*\"deviceList\"\:\s*\[[\s\S]*?\]\,[\s\S]*?\"estlist\"\:\s*[\s\S]*?\}\}\s*/i;

class Bluetooth extends Common {
    constructor(...args) {
        super(...args);
        this._type = 'ble';
        this.peripheralList = [];
        this.peripheralCacheId = [];
        this.peripheralCacheList = [];
        this.peripheralIndex = 0;
        this.peripheral = null;
        this.newPeripheral = null;
        this.service = null;
        this.serviceUUID = '0000fff0-0000-1000-8000-00805f9b34fb';
        this.characteristicUUID = '0000fff1-0000-1000-8000-00805f9b34fb';
        this.chunkBuffer = [];
        this.chunkIndex = 0;
        this.sign = null;
        this.timeOutTimer = null;
        this.verifyType = null;
        this.filesObj = null;
        this.receiveObj = null;
    }

    /**
     * 扫描设备
     * @param {Boolean} open true表示开启扫描, false表示停止扫描
     */
    scanning(open) {
        if (open) {
            const eventList = this.noble.eventNames();
            !eventList.includes('stateChange') && this.noble.on('stateChange', async (state) => {
                if (state === 'poweredOn') {
                this.noble.startScanning([], true);
            } else {
                this.noble.stopScanning();
            }
        });
        } else {
            this.noble.stopScanning();
            this.noble.removeAllListeners('discover');
            this.peripheral = null;
            this.newPeripheral = null;
            this.peripheralList.splice(0, this.peripheralList.length);
            this.peripheralCacheId.splice(0, this.peripheralCacheId.length);
            this.peripheralCacheList.splice(0, this.peripheralCacheList.length);
        }
        return this;
    }

    /**
     * 打开监听服务
         * @returns 
         */
    linkBle() {
        this.ipcMain(ipc_Main.SEND_OR_ON.BLE.CONNECTION, (event, data) => {
            this.peripheralIndex = data.index;
            this.newPeripheral = this.peripheralList[data.index];
            if (this.peripheral && (this.peripheral.state === 'connected' || this.peripheral.id !== this.newPeripheral.id)) {
                this.peripheral.disconnect();
                return;
            }
            this.isConnectedSuccess(event);
            /*//开启获取文件监听
        this.getBinOrHareWare(ipc_Main.SEND_OR_ON.COMMUNICATION.GETFILES);
        //开启获取主机文件监听
        this.getAppExe(ipc_Main.SEND_OR_ON.EXE.FILES);
        // 切换到串口
            this.bleWrite(instruct.ble, null, event);*/
        });
    }

    /**
     * 连接蓝牙是否成功
     */
    async isConnectedSuccess(event) {
        this.peripheral = this.newPeripheral;
        const resForConnect = this.peripheral && await this.connectBle();
        event.reply(ipc_Main.RETURN.BLE.CONNECTION, {
            bleType: resForConnect ? this._type : null,
            msg: resForConnect ? "successfullyConnected" : "failedConnected",
            success: resForConnect
        });
        if (!resForConnect) return;
        this.noble.stopScanning();
        const resForServices = resForConnect && await this.discoverBleServices();
        const resForCharacteristics = resForServices && await this.discoverBleCharacteristics();
        resForCharacteristics && await this.bleSubscribe(event);
        // 断开连接监听
        this.disconnect(event);
    }

    /**
     * 发现设备
     */
    discover(event) {
        this.noble.removeAllListeners('discover');
            this.noble.on('discover', (peripheral) => {
                if (peripheral.advertisement.localName === 'EST_BLUE' && peripheral.state === 'disconnected') {
                if (!this.peripheralCacheId.includes(peripheral.id)) {
                    this.peripheralCacheId.push(peripheral.id);
                    this.peripheralList.push(peripheral);
                    this.peripheralCacheList.push({
                        id: peripheral.id,
                        uuid: peripheral.uuid,
                        address: peripheral.address,
                        addressType: peripheral.addressType,
                        connectable: peripheral.connectable,
                        advertisement: { ...peripheral.advertisement },
                        state: peripheral.state,
                        checked: false
                    });
                    event.reply(ipc_Main.RETURN.BLE.GETBlELIST, JSON.stringify([...this.peripheralCacheList]));
                }
            }
        });
    }

    /**
     * 连接到设备
     */
    connectBle() {
        return new Promise((resolve, reject) => {
            this.peripheral.connect((error) => {
                if (error) {
                    console.log('连接到设备失败', error);
                    reject(false);
                }
                resolve(true);
            });
        });
    }

    /**
     * 断开连接
     */
    disconnect(event) {
        this.peripheral && this.peripheral.on('disconnect', () => {
            if (this.peripheral.id === this.newPeripheral.id) {
                event.reply(ipc_Main.RETURN.CONNECTION.CONNECTED, { res: false, msg: "disconnect" });
            }
            clearInterval(this.timeOutTimer);
            this.timeOutTimer = null;
        })
    }

    /**
     * 发现服务
     */
    discoverBleServices() {
        return new Promise((resolve, reject) => {
            this.peripheral.discoverServices([this.serviceUUID], (error, services) => {
                if (error) {
                    console.error('发现服务失败', error);
                    reject(error);
                    return;
                }
                this.service = services[0];
                resolve(true);
            });
        });
    }

    /**
     * 发现特征
     */
    discoverBleCharacteristics() {
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
    bleWrite(data, str, event, withResponse = true) {
        const writeData = Buffer.from(data);
            //修改标识符，根据标识符判断要发送的是文件还是文件名
            this.sign = str;
            //写入数据
        this.characteristic && this.characteristic.write(writeData, withResponse);
        if (this.verifyType && this.verifyType.indexOf(SOURCE) === -1) {
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
     * 启用通知
     */
    bleSubscribe(event) {
        const func = this.throttle(this.watchDevice.bind(this), 100);
        return new Promise((resolve, reject) => {
            this.characteristic.subscribe((error) => {
                if (error) {
                    console.error('启用通知失败', error);
                    this.characteristic.unsubscribe();
                    reject(false);
                    return;
                }
                // console.log('已启用通知');
                this.characteristic.on('data', (data) => {
                    //清除超时检测
                    this.clearTimer();
                    // console.log(data);
                    //把数据放入处理函数校验是否是完整的一帧并获取数据对象
                    this.receiveObj = this.catchData(data);
                    //开启设备数据监控监听
                    this.watchDeviceData = data && this.checkIsDeviceData(data, reg);
                    let t = this.watchDeviceData && setTimeout(() => {
                        func(event);
                        clearTimeout(t);
                        t = null;
                    });

                    //根据标识符进行校验操作检验数据并返回结果
                    const verify = this.verification(this.sign, this.receiveObj, event);
                    if (!this.sign || (this.sign && this.sign.indexOf('Boot_') === -1) || !this.receiveObj) return;
                    //清除超时检测
                    this.clearTimer();
                    if (verify) {
                        //结果正确进入处理，函数会检测文件数据是否全部发送完毕
                        this.processReceivedData(event);
                    } else {
                        event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, { result: false, msg: "uploadError" });
                        this.clearCache();
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
     * @param event
     */
    watchDevice(event) {
        if (!this.receiveObj) return false;
        const result = this.distinguishDevice(this.receiveObj);
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
     * @param eventName
     */
    getAppExe(eventName) {
        this.ipcMain(eventName, (event, arg) => {
            if (arg === 'FILE') {
                this.bleWrite(instruct.files, signType.EXE.FILES, event);
            } else {
                this.bleWrite(arg.status === EST_RUN ? instruct.app_stop : instruct.app_run, null, event);
            }
        });
    }

    /**
     * 上传文件
     * @param {*} event 
     * @param {Object} data 
     * @returns 
     */
    upload(data, event) {
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
            this.bleWrite(binArr, signType.BOOT.FILENAME, event);
        } catch (error) {
            console.log(error);
            this.handleReadError(error, event, this.clearCache);
        }
    }

    /**
     * 发bin数据
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
        this.bleWrite(binArr, signType.BOOT.BIN, event);
    }


}

module.exports = Bluetooth;
