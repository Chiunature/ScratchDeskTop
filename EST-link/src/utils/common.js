/*
 * @Description: New features
 * @Author: jiang
 * @Date: 2023-06-07 08:58:20
 * @LastEditors: jiang
 * @LastEditTime: 2023-06-15 15:30:17
 * @params: {
 *  subFileIndex:子文件遍历下标
 *  files: 文件目录对象
 *  watchDeviceList: 设备监听列表
 * }
 */
const { SOURCE_MUSIC, SOURCE_APP, SOURCE_BOOT, SOURCE_VERSION, SOURCE_CONFIG, BOOTBIN, DELETE_EXE } = require("../config/json/verifyTypeConfig.json");
const ipc_Main = require("../config/json/communication/ipc.json");

const device = {
    '0': '无设备连接',
    'a1': '电机',
    'a2': '颜色识别器',
    'a3': '超声波',
    'a4': '触碰'
};

class Common {

    constructor(...args) {
        args.map(item => {
            Object.keys(item).map(key => {
                this[key] = item[key];
            });
        });
        this.subFileIndex = 0;
        this.files = {};
        this.watchDeviceList = [];
        this.gyroList = [];
        this.flashList = [];
        this.adcList = [];
        this.voice;
    }

    /**
     * 主进程handle方式通信
     * @param {String} eventName 
     * @param {Function} callback 
     */
    ipcHandle(eventName, callback) {
        this.electron.ipcMain.removeHandler(eventName);
        this.electron.ipcMain.handle(eventName, (event, arg) => callback(event, arg));
    }

    /**
     * 主进程通信
     * @param {String} eventName 
     * @param {Function} callback 
     */
    ipcMain(eventName, callback) {
        const eventList = this.electron.ipcMain.eventNames();
        !eventList.includes(eventName) && this.electron.ipcMain.on(eventName, (event, arg) => {
            return callback(event, arg);
        });
    }

    /**
     * 文件名校验位和指令
     * @param {String} item 
     * @param {Number} bits 
     * @returns 
     */
    checkFileName(item, bits) {
        const list = this.stringToHex(item);
        const len = list.length;
        let sum = 0x5a + 0x97 + 0x98 + len + bits;
        list.map(el => sum += el);
        return {
            binArr: [0x5a, 0x97, 0x98, len, bits, ...list, (sum & 0xff), 0xa5],
            crc: sum & 0xff
        };
    }

    /**
     * bin信息指令
     * @param {Array} item 
     * @param {Number} currentIndex 
     * @param {Number} lastIndex 
     * @returns 
     */
    checkBinData(item, currentIndex, lastIndex) {
        const len = item.length;
        const bits = currentIndex == lastIndex ? 0xbb : 0xaa;
        let sum = 0x5a + 0x97 + 0x98 + len + bits;
        item.map(el => sum += el);
        return {
            binArr: [0x5a, 0x97, 0x98, len, bits, ...item, (sum & 0xff), 0xa5],
            crc: sum & 0xff
        };
    }

    /**
     * 发送数据
     * @param {String} eventName 
     * @param {Function} fn 
     */
    sendToSerial(eventName, fn) {
        this.ipcMain(eventName, (event, data) => {
            if (typeof fn === 'function') {
                fn.call(this, event, data);
            }
        });
    }

    /**
     * 侦听编译时的错误处理
     * @param {String} eventName 
     */
    listenError(eventName) {
        this.ipcMain(eventName, (event) => event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, { result: false, msg: "uploadError" }));
    }

    /**
     * 数据转buffer数组
     * @param {Array} buf 
     * @returns 
     */
    toArrayBuffer(buf) {
        let view = [];
        for (let i = 0; i < buf.length; i++) {
            view.push(buf[i]);
        }
        return new Uint8Array(view);
    }


    /**
     * 将字符串转十六进制
     * @param {String} str 
     * @returns 
     */
    stringToHex(str) {
        let val = [];
        for (let i = 0; i < str.length; i++) {
            const hex = str.charCodeAt(i).toString(16);
            const num = parseInt(hex, 16);
            val.push(num);
        }
        return val;
    }

    /**
     * 检测数据并转buffer数组
     * @param {*} data 
     * @returns 
     */
    getBufferArray(data) {
        let arr = [];
        if (!Array.isArray(data)) {
            arr = this.toArrayBuffer(data);
        } else {
            arr = [...new Uint8Array(data)];
        }
        return arr;
    }

    /**
     * 分段上传
     * @param {Array} data 
     * @param {Number} size 
     * @returns 
     */
    uploadSlice(data, size) {
        let newArr = [];
        const chunkSize = size;
        if (data.length < chunkSize) {
            newArr.push(data);
        } else {
            for (let i = 0; i < data.length; i += chunkSize) {
                let chunk = data.slice(i, i + chunkSize);
                newArr.push(chunk);
            }
        }
        return newArr;
    }

    /**
     * 对接收数据的错误处理
     * @param {*} event 
     * @param {Function} fn 
     */
    handleReadError(err, event, fn) {
        event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, { result: false, msg: "uploadError" });
        const mainPath = this.process.cwd();
        const directory = mainPath + '/Error';
        const filepath = `${mainPath}/Error/error_${new Date().toISOString().replace(':', '-').slice(0, 19)}.txt`;
        this.fs.mkdir(directory, { recursive: true }, () => this.fs.writeFile(filepath, err + '', fn.bind(this)));
    }

    /**
     * 从文件夹获取文件名
     * @param {String} folderPath 
     * @returns 
     */
    readmidr(folderPath) {
        const files = this.fs.readdirSync(folderPath);
        return files;
    }

    /**
     * 读取文件内容
     * @param {String} path 
     * @param {String} type 
     * @returns 
     */
    readFiles(path, type) {
        try {
            const data = this.fs.readFileSync(path, type);
            return data;
        } catch (error) {
            return false;
        }
    }

    /**
     * 写入文件
     * @param {String} path 
     * @param {String} type 
     * @returns 
     */
    writeFiles(path, type) {
        try {
            this.fs.writeFileSync(path, type);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * 判断功能码
     * @param {Number} verifyType 
     * @returns 
     */
    getBits(verifyType) {
        switch (verifyType) {
            case BOOTBIN:
                return 0xda;
            case SOURCE_MUSIC:
                return 0xec;
            case SOURCE_APP:
                return 0xda;
            case SOURCE_BOOT:
                return 0xdb;
            case SOURCE_VERSION:
                return 0xdd;
            case SOURCE_CONFIG:
                return 0xdc;
            case DELETE_EXE:
                return 0xe8;
            default:
                break;
        }
    }

    /**
     * 校验数据的switch
     * @param {Object} actions 
     * @param {String} condition 
     * @param {String} type 
     * @returns 
     */
    switch(actions, condition, type = false) {
        if (type) {
            if (actions[condition] && typeof actions[condition] === 'function') {
                return actions[condition]();
            } else {
                return false;
            }
        } else {
            if (actions[condition] && typeof actions[condition] === 'function') {
                actions[condition]();
            } else {
                return false;
            }
        }
    }

    /**
         * 根据获取到的功能码判断设备类型
         * @param {Object} receiveObj 
         * @returns 
         */
    distinguishDevice(receiveObj) {
        const { data, bit } = receiveObj;
        if (!data) return false;
        const text = new TextDecoder();
        const list = new Uint8Array(data.slice(5, data.length - 2));
        const res = text.decode(list);
        const arr = res.split('/').filter((el) => (el !== ''));
        if (!arr && arr.length <= 0) return false;
        if (bit !== 0xD8 && this.watchDeviceList.length === 0) return false;
        switch (bit) {
            case 0xD8:
                arr.slice(0, 8).map((item, i) => {
                    this.watchDeviceList[i] = {
                        port: i,
                        motor: {},
                        color: {},
                        ultrasonic: null,
                        touch: null,
                        sensing_device: device[item],
                        deviceId: item
                    }
                });
                break;
            case 0xD1:
                this.gyroList = arr;
                break;
            case 0xD4:
                this.flashList = arr;
                break;
            case 0xD5:
                this.adcList = arr;
                break;
            case 0xD7:
                this.voice = arr[0];
                break;
            default:
                this.checkSensingDevice(arr, bit);
                break;
        }
        return {
            deviceList: this.watchDeviceList,
            gyroList: this.gyroList,
            flashList: this.flashList,
            adcList: this.adcList,
            voice: this.voice
        };
    }

    /**
     * 根据设备id判断数据对应的端口
     * @param {String} deviceId 
     * @param {String} key 
     * @returns 
     */
    checkSensingDevice(arr, key) {
        if (this.watchDeviceList.length === 0) return;
        this.watchDeviceList.forEach(el => {
            if (el.deviceId === arr[0]) {
                _device(el, key, arr);
            }
        });

        function _device(port, key, arr) {
            switch (key) {
                case 0xD0:
                    port.motor = {
                        direction: arr[1] == 1 ? '正转' : arr[1] == 2 ? '反转' : arr[1] == 3 ? '刹车' : '停止',
                        pwm: arr[2],
                        speed: arr[3],
                        aim_speed: arr[4],
                    }
                    break;
                case 0xD6:
                    port.color = {
                        rgb: `rgb(${Math.floor(arr[1])}, ${Math.floor(arr[2])}, ${Math.floor(arr[3])})`,
                        light_intensity: arr[4]
                    }
                    break;
                case 0xD2:
                    port.ultrasonic = Math.round(arr[1]);
                    break;
                case 0xD3:
                    port.touch = arr[1];
                    break;
                default:
                    break;
            }
        }
    }
}

module.exports = Common;