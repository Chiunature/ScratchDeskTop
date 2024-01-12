const Common = require("./common");
const ipc_Main = require("../config/json/communication/ipc.json");

class Bluetooth extends Common {
    constructor(...args) {
        super(...args);
        this._type = 'ble';
        this.bleAddress = 'ec:22:05:17:95:a6';
        this.peripheral = [];
        this.service;
        this.serviceUUID = '0000fff0-0000-1000-8000-00805f9b34fb';
        this.characteristicUUID = '0000fff1-0000-1000-8000-00805f9b34fb';
    }

    /**
     * 扫描设备
* @param {Boolean} type true表示开启扫描, false表示停止扫描
     */
    scanning(event, type) {
        this.noble.removeAllListeners('stateChange');
        this.noble.on('stateChange', async (state) => {
            if (state === 'poweredOn' && type) {
                this.noble.startScanning([], true);
const res = await this.linkBle();
                if(res) event.reply(ipc_Main.RETURN.BLE.CONNECTION, res);
            } else {
                this.noble.stopScanning();
            }
        });
    }

    async linkBle() {
        this.peripheral = await this.discover();
        const resForConnect = await this.connect();
        const resForServices = resForConnect ? await this.discoverServices() : null;
        const resForCharacteristics = resForServices ? await this.discoverCharacteristics() : null;
        /* if(resForCharacteristics) {
            this.bleRead('utf-8').then(res => {
                console.log(res);
            })
        } */

        return {
            resBle: resForConnect,
            ble: this.peripheral,
            bleType: this._type,
            msg: resForConnect ? "successfullyConnected" : "failedConnected"
        }
    }


    /**
     * 发现设备
     */
    discover() {
this.noble.removeAllListeners('discover');
        return new Promise((resolve) => {
            this.noble.on('discover', (peripheral) => {
                if (peripheral.address === this.bleAddress && peripheral.advertisement.localName === 'EST_BLUE') {
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
            this.peripheral && this.peripheral.connect((error) => {
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
    disconnect() {
        this.noble.on('disconnect', (err) => {
            console.log(err);
        })
        // this.ipcHandle(ipc_Main.SEND_OR_ON.BLE.DISCONNECTED, (event, arg) => {
        //     this.peripheral && this.peripheral.disconnect((error) => {
        //         if (error) {
        //             console.error('断开连接失败', error);
        //             reject(false);
        //             return;
        //         }
        //         console.log('成功断开连接');
        //         resolve(true);
        //     });
        // });
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
                resolve(characteristics);
            });
        });
    }

    /**
     * 发送数据
     */
    bleWrite() {
        const data = Buffer.from('Hello, World!', 'utf8');
        return new Promise((resolve, reject) => {
            this.characteristic.write(data, true, (error) => {
                if (error) {
                    console.error('发送数据失败', error);
                    reject(error);
                    return;
                }

                console.log('成功发送数据');
                resolve();
            });
        });
    }

    /**
     * 接收数据
     */
    bleRead(encoding) {
        return new Promise((resolve, reject) => {
            this.characteristic.read((err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data.toString(encoding));
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
                    reject(error);
                    return;
                }
                console.log('已启用通知');
                resolve();
            });
        });
    }
}

module.exports = Bluetooth;