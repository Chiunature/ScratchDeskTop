const Common = require("./common");


class Bluetooth extends Common {
    constructor(...args) {
        super(...args);
        this.peripheral;
        this.service;
        this.serviceUUID = '';
        this.characteristicUUID = '';
    }

    /**
     * 扫描设备
     */
    scanning() {
        this.noble.on('stateChange', function (state) {
            if (state === 'poweredOn') {
                this.noble.startScanning();
            } else {
                this.noble.stopScanning();
            }
        });
    }

    /**
     * 发现设备
     */
    discover() {
        noble.on('discover', function (peripheral) {
            this.peripheral = peripheral;

        });
    }

    /**
     * 连接到设备
     */
    connect() {
        this.peripheral.connect(function (error) {
            if (error) {
                console.error('连接到设备失败', error);
                return;
            }
            console.log('成功连接到设备');

        });
    }

    /**
     * 发现服务
     */
    discoverServices() {
        this.peripheral.discoverServices([this.serviceUUID], function (error, services) {
            if (error) {
                console.error('发现服务失败', error);
                return;
            }

            this.service = services[0];

        });
    }

    /**
     * 发现特征
     */
    discoverCharacteristics() {
        this.service.discoverCharacteristics([this.characteristicUUID], function (error, characteristics) {
            if (error) {
                console.error('发现特征失败', error);
                return;
            }

            this.characteristic = characteristics[0];

        });
    }
    /**
     * 发送数据
     */
    bleWrite() {
        const data = Buffer.from('Hello, World!', 'utf8');
        this.characteristic.write(data, true, function (error) {
            if (error) {
                console.error('发送数据失败', error);
                return;
            }

            console.log('成功发送数据');
        });
    }

    /**
     * 接收数据
     */
    bleRead(encoding) {
        this.characteristic.read((err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data.toString(encoding));
        });
    }

    /**
     * 启用通知
     */
    bleSubscribe() {
        this.characteristic.subscribe(function (error) {
            if (error) {
                console.error('启用通知失败', error);
                this.characteristic.unsubscribe();
                return;
            }
            console.log('已启用通知');
        });
    }
}

module.exports = Bluetooth;