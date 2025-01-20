const Common = require("./common");
const { verifyBinType } = require("../config/js/verify.js");
const { SOURCE, EST_RUN, RESET_FWLIB, BOOTBIN } = require("../config/json/verifyTypeConfig.json");
const ipc_Main = require("../config/json/communication/ipc.json");
const signType = require("../config/json/communication/sign.json");
const { instruct, reg } = require("../config/js/instructions.js");

class Bluetooth extends Common {
    constructor(...args) {
        super(...args);
        this._type = 'ble';
        this.peripheralList = [];
        this.peripheralCacheId = [];
        this.peripheralCacheList = [];
        this.peripheral = null;
        this.newPeripheral = null;
        this.service = null;
        this.serviceUUID = '0000fff0-0000-1000-8000-00805f9b34fb';
        this.characteristicUUID = '0000fff1-0000-1000-8000-00805f9b34fb';
        this.chunkBuffer = [];
        this.chunkBufferSize = 0;
        this.sign = null;
        this.timeOutTimer = null;
        this.checkConnectTimer = null;
        this.verifyType = null;
        this.receiveObj = null;
        this.watchDeviceData = null;
        this.selectedExe = null;
        this.sourceFiles = [];
        this.uploadingFile = null;
        this.receiveData = [];
    }

    /**
     * 扫描设备
     * @param {Boolean} open true表示开启扫描, false表示停止扫描
     */
    scanning(event, open) {
        if (open) {
            const eventList = this.noble.eventNames();
            !eventList.includes('discover') && this.discover(event);
            !eventList.includes('stateChange') && this.noble.on('stateChange', (state) => {
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
    }

    /**
     * 发现设备
     */
    discover(event) {
        this.noble.on('discover', (peripheral) => {
            if (peripheral.advertisement.localName && peripheral.state === 'disconnected') {
                if (this.peripheralCacheId && !this.peripheralCacheId.includes(peripheral.id)) {
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
     * 打开监听服务
     * @returns
     */
    linkBle() {
        this.ipcMain(ipc_Main.SEND_OR_ON.BLE.CONNECTION, (event, data) => {
            if (data.newPort.checked && this.peripheral) {
                this.peripheral.disconnect();
                return;
            }

            this.newPeripheral = this.peripheralList[data.index];
            if (this.peripheral && this.peripheral.id === this.newPeripheral.id) return;
            if (this.peripheral && this.peripheral.state === 'connected' && this.peripheral.id !== this.newPeripheral.id) {
                this.peripheral.disconnect();
            }

            //开启获取文件监听
            this.getBinOrHareWare(ipc_Main.SEND_OR_ON.COMMUNICATION.GETFILES);
            //开启获取主机文件监听
            this.getAppExe(ipc_Main.SEND_OR_ON.EXE.FILES);
            //开启删除程序监听
            this.deleteExe(ipc_Main.SEND_OR_ON.EXE.DELETE);
            // 连接蓝牙是否成功
            this.isConnectedSuccess(event);
        });
    }

    /**
     * 连接蓝牙是否成功
     */
    async isConnectedSuccess(event) {
        this.peripheral = this.newPeripheral;

        const resForConnect = this.peripheral && await this.connectBle(event);

        event.reply(ipc_Main.RETURN.BLE.CONNECTION, {
            bleType: resForConnect ? this._type : null,
            msg: resForConnect ? "successfullyConnected" : "failedConnected",
            success: resForConnect
        });

        if (!resForConnect) {
            this.peripheral = null;
            this.newPeripheral = null;
            this.removeAllMainListeners([
                ipc_Main.SEND_OR_ON.COMMUNICATION.GETFILES,
                ipc_Main.SEND_OR_ON.EXE.DELETE,
                ipc_Main.SEND_OR_ON.EXE.FILES,
            ]);
            return;
        }

        this.noble.stopScanning();

        const resForServices = resForConnect && await this.discoverBleServices();

        const resForCharacteristics = resForServices && await this.discoverBleCharacteristics();

        resForCharacteristics && await this.bleSubscribe(event);
    }

    /**
     * 连接到设备
     */
    connectBle(event) {
        return new Promise((resolve, reject) => {
            this.peripheral.connect((error) => {
                if (error) {
                    console.log('连接到设备失败', error);
                    reject(false);
                }
                // 断开连接监听
                this.disconnect(event);
                resolve(true);
            });
        });
    }

    /**
     * 断开连接
     */
    disconnect(event) {
        this.peripheral && this.peripheral.once('disconnect', () => {
            if (this.peripheral.id === this.newPeripheral.id) {
                event.reply(ipc_Main.RETURN.CONNECTION.CONNECTED, { res: false, msg: "disconnect" });
            }

            clearInterval(this.timeOutTimer);
            this.timeOutTimer = null;
            this.removeAllMainListeners([
                ipc_Main.SEND_OR_ON.COMMUNICATION.GETFILES,
                ipc_Main.SEND_OR_ON.EXE.DELETE,
                ipc_Main.SEND_OR_ON.EXE.FILES,
            ]);

            /* this.peripheralCacheId = this.peripheralCacheId.filter(id => id !== this.peripheral.id);
            this.peripheralCacheList = this.peripheralCacheList.filter(item => item.id !== this.peripheral.id);
            this.peripheralList = this.peripheralList.filter(item => item.id !== this.peripheral.id);
            event.reply(ipc_Main.RETURN.BLE.GETBlELIST, JSON.stringify([...this.peripheralCacheList])); */
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
    bleWrite(data, sign, event, withResponse = true) {
        //修改标识符，根据标识符判断要发送的是文件还是文件名
        this.sign = sign;
        //写入数据
        this.characteristic && this.characteristic.write(Buffer.from(data), withResponse);
        if (sign && sign.includes('Boot_')) {
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
     * 清除缓存
     */
    clearCache() {
        if (this.verifyType && this.verifyType.indexOf(SOURCE) === -1) {
            this.sign = null;
        }
        this.chunkBuffer.splice(0, this.chunkBuffer.length);
        clearTimeout(this.checkConnectTimer);
        this.checkConnectTimer = null;
        this.receiveObj = null;
    }

    /**
     * 启用通知
     */
    bleSubscribe(event) {
        const watch = this.throttle(this.watchDevice.bind(this), 100);
        return new Promise((resolve, reject) => {
            let buffer = '';
            const text = new TextDecoder();
            this.characteristic.subscribe((error) => {
                if (error) {
                    console.error('启用通知失败', error);
                    this.characteristic.unsubscribe();
                    reject(false);
                    return;
                }

                console.log('已启用通知');

                this.characteristic.on('data', (data) => {

                    if (!data) {
                        return;
                    }

                    const isBoot = this.sign && this.sign.includes('Boot_');
                    if (isBoot || this.sign === signType.EXE.FILES) {

                        this.receiveData = [...this.receiveData, ...data];

                        //把数据放入处理函数校验是否是完整的一帧并获取数据对象
                        this.receiveObj = this.catchData(this.receiveData);
                        if (!this.receiveObj) {
                            return;
                        } else {
                            this.receiveData.splice(0, this.receiveData.length);
                        }

                        //清除超时检测
                        this.clearTimer();

                        //根据标识符进行校验操作检验数据并返回结果
                        const verify = this.verification(this.sign, this.receiveObj, event);

                        if (verify) {
                            //结果正确进入处理，函数会检测文件数据是否全部发送完毕
                            this.processReceivedData(event);
                        } else {
                            if (isBoot) {
                                event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, { result: false, msg: "uploadError" });
                                this.clearCache();
                            } else {
                                // 重置标识符
                                this.sign = null;
                            }
                        }

                        return;
                    }

                    buffer += text.decode(data);

                    // 判断缓冲区中是否存在完整的数据包
                    const completePacketIndex = buffer.indexOf('\n');

                    if (completePacketIndex !== -1) {
                        // 处理完整的数据包
                        const completePacket = buffer.slice(0, completePacketIndex + 1);
                        buffer = buffer.slice(completePacketIndex + 1);

                        // 开启设备数据监控监听
                        this.watchDeviceData = this.checkIsDeviceData(completePacket, reg.devicesData);
                        if (this.watchDeviceData) {
                            buffer = ''
                            let t = setTimeout(() => {
                                watch(event);
                                clearTimeout(t);
                                t = null;
                            });
                        }
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
        if (!this.timeOutTimer || (this.sign && this.sign.indexOf('Boot_') === -1)) return;
        clearTimeout(this.timeOutTimer);
        this.timeOutTimer = null;
    }

    /**
     * 监听设备信息
     * @param event
     */
    watchDevice(event) {
        if (!this.watchDeviceData) return;
        const result = this.distinguishDevice(this.watchDeviceData);
        event.reply(ipc_Main.RETURN.DEVICE.WATCH, result);
    }

    /**
     * 处理接收到的数据
     * @param {*} event
     */
    processReceivedData(event) {
        if (this.sign === signType.BOOT.FILENAME) {
            this.sign = signType.BOOT.BIN;
        }

        this.processHandle(event);

        const isLast = this.chunkBuffer.length === 0
        //如果是已经发送了最后一组文件数据，就结束通信，否则继续发送下一组
        if (isLast) {
            //清除缓存
            this.clearCache();

            //检测是那种类型的文件发送完毕
            if (this.verifyType === BOOTBIN) {
                event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, { result: true, msg: "uploadSuccess" });
            }

            if (this.verifyType.indexOf(SOURCE) !== -1) {
                if (this.sourceFiles.length > 0) {
                    this.uploadingFile = this.sourceFiles.shift();
                    this.upload({
                        fileName: this.uploadingFile.fileName,
                        binData: this.uploadingFile.fileData,
                        verifyType: this.uploadingFile.verifyType,
                    }, event);
                } else {
                    event.reply(ipc_Main.RETURN.COMMUNICATION.SOURCE.CONPLETED, { msg: "uploadSuccess" });
                }
            }
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
            if (data.selectedExe) {
                this.selectedExe = data.selectedExe;
            }
            //本身是哭脸的时候，发重置不会断开，正常发送文件
            if (data.verifyType === RESET_FWLIB) {
                this.upload_sources_status = data.verifyType;
                const { binArr } = this.checkFileName(RESET_FWLIB, 0x6F);
                this.bleWrite(binArr, null, event);
                this.checkConnected(event);
                return;
            }
            this.readyToUpload(data, event);
        });
    }

    checkConnected(event) {
        if (this.upload_sources_status === RESET_FWLIB) {
            this.checkConnectTimer = setTimeout(() => {
                this.readyToUpload({ verifyType: SOURCE }, event);
                this.upload_sources_status = null;
            }, 3000);
        }
    }

    readyToUpload(data, event) {
        //处理渲染进程发送过来的通信需要的数据
        const result = verifyBinType.call(this, {
            ...data,
            selectedExe: this.selectedExe
        }, event);
        if (Array.isArray(result)) {
            this.sourceFiles = [...result];
            this.uploadingFile = this.sourceFiles.shift();
            //根据返回的子文件数据和子文件名进入上传处理
            this.upload({
                fileName: this.uploadingFile.fileName,
                binData: this.uploadingFile.fileData,
                verifyType: this.uploadingFile.verifyType,
            }, event);
        }
    }

    /**
     * 获取主机有多少个程序或运行程序
     * @param eventName
     */
    getAppExe(eventName) {
        this.ipcMain(eventName, (event, arg) => {
            if (this.sign && this.sign.indexOf('Boot_') !== -1) {
                return;
            }
            switch (arg.type) {
                case 'FILE':
                    this.bleWrite(instruct.stop_watch, null, event);
                    setTimeout(() => {
                        this.bleWrite(instruct.files, signType.EXE.FILES, event);
                        setTimeout(() => {
                            this.bleWrite(instruct.stop_watch, null, event);
                        }, 900);
                    }, 900);
                    break;
                case 'SENSING_UPDATE':
                    this.bleWrite(instruct.sensing_update, null, event);
                    break;
                case 'APP':
                    this.bleWrite(arg.status === EST_RUN ? instruct.app_stop : instruct.app_run, null, event);
                    break;
                default:
                    break;
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
            this.chunkBufferSize = this.chunkBuffer.length;
            this.verifyType = data.verifyType;
            //根据文件类型获取功能码
            const bits = this.getBits(data.verifyType);
            //将文件名放入处理函数获取需要发送给下位机的完整指令
            const { binArr } = this.checkFileName(data.fileName, bits);
            //写入文件名和指令，告诉下位机要发送的文件
            this.bleWrite(binArr, signType.BOOT.FILENAME, event);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * 发bin数据
     * @param {*} event
     * @returns
     */
    sendBin(event) {
        if (this.chunkBufferSize <= 0) {
            return;
        }
        const element = this.chunkBuffer.shift();
        //将文件数据放入处理函数获取需要发送给下位机的完整指令
        const { binArr } = this.checkBinData(element, this.chunkBuffer.length === 0);
        //传入bin数据并修改标识符
        this.bleWrite(binArr, signType.BOOT.BIN, event);
    }

    /**
    * 判断是否是bin文件通信，bin文件通信需要给渲染进程发送通信进度
    * @param {*} event
    */
    processHandle(event) {
        if (this.verifyType && this.chunkBuffer.length >= 0) {
            const progress = Math.ceil(((this.chunkBufferSize - this.chunkBuffer.length) / this.chunkBufferSize) * 100);
            if (this.verifyType.indexOf(SOURCE) === -1) {
                event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.PROGRESS, progress);
            } else {
                event.reply(ipc_Main.RETURN.FILE.NAME, { fileName: this.uploadingFile.fileName, progress: progress });
            }
        }
    }

    /**
     * 删除主机上的程序
     * @param {String} eventName
     */
    deleteExe(eventName) {
        this.ipcMain(eventName, (event, data) => {
            const bits = this.getBits(data.verifyType);
            const { binArr } = this.checkFileName(data.fileName, bits);
            setTimeout(() => {
                this.bleWrite(binArr, null, event);
            }, 1000);
        });
    }


}

module.exports = Bluetooth;
