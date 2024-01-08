const Common = require("./common");


class Bluetooth extends Common {
    constructor(...args) {
        super(...args);
this._type = 'ble';
        this.peripheral;
        this.service;
        this.serviceUUID = '';
        this.characteristicUUID = '';
    }

    /**
     * 扫描设备
     */
    scanning() {
        this.noble.on('stateChange', (state) => {
            if (state === 'poweredOn') {
                this.noble.startScanning([], true);
            } else {
                this.noble.stopScanning();
            }
        });
    }

    /**
     * 发现设备
     */
    discover() {
        return new Promise((resolve) => {
            this.noble.on('discover', (peripheral) => {
                this.peripheral = peripheral;
                resolve(peripheral);
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
                    reject(error);
                    return;
                }
                console.log('成功连接到设备');
                resolve();
            });
        });
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