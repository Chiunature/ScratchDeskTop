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
import {
    SOURCE_MUSIC,
    SOURCE_APP,
    SOURCE_BOOT,
    SOURCE_VERSION,
    SOURCE_CONFIG,
    BOOTBIN,
    DELETE_EXE,
    SOURCE_SOUNDS
} from "../config/json/verifyTypeConfig.json";
import ipc_Main from "../config/json/ipc.json";
import signType from "../config/json/sign.json";
import { deviceIdMap } from "../config/js/instructions.js";

export class Common {

    constructor(...args) {
        args.forEach(item => {
            Object.keys(item).map(key => {
                this[key] = item[key];
            });
        });
        this.watchDeviceList = [];
        this.deviceIdList = Object.keys(deviceIdMap);
        this.upload_sources_status = null;
        this.isRunAfterUploaded = false;
    }

    /**
     * 初始化设备监听列表
     * @param {Number} n 
     */
    initWatchDeviceList(n) {
        for (let i = 0; i < n; i++) {
            this.watchDeviceList[i] = {
                port: i,
                motor: {},
                color: {},
                ultrasonic: null,
                touch: null,
                sensing_device: deviceIdMap[0],
                deviceId: 0
            }
        }
    }

    /**
     * 清空设备监听列表中的某一项
     * @param {Number} i 
     */
    clearWatchDeviceList(i) {
        this.watchDeviceList[i] = {
            port: i,
            motor: {},
            color: {},
            ultrasonic: null,
            touch: null,
            sensing_device: deviceIdMap[0],
            deviceId: 0
        }
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
     * 删除主进程的事件监听
     * @param {String} listener 
     */
    removeAllMainListeners(listener) {
        const eventList = this.electron.ipcMain.eventNames();
        eventList.forEach(el => {
            if (listener.includes(el)) {
                this.electron.ipcMain.removeAllListeners([el]);
            }
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
        list.forEach(el => sum += el);
        return {
            binArr: [0x5a, 0x97, 0x98, len, bits, ...list, (sum & 0xff), 0xa5],
            crc: sum & 0xff
        };
    }

    /**
     * bin信息指令
     * @param {Array} item 
   * @param {Number} isLast
     * @returns 
     */
    checkBinData(item, isLast) {
        const len = item.length;
        const bits = isLast ? (this.isRunAfterUploaded ? 0xbc : 0xbb) : 0xaa;
        let sum = 0x5a + 0x97 + 0x98 + len + bits;
        item.forEach(el => sum += el);
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
            typeof fn === 'function' && fn.call(this, event, data);
        });
    }

    /**
     * 侦听编译时的错误处理
     * @param {String} eventName 
     */
    listenError(eventName) {
        this.ipcMain(eventName, (event) => event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, {
            result: false,
            msg: "uploadError"
        }));
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
   * @param err
     * @param {*} event 
     * @param {Function} fn 
     */
    handleReadError(err, event, fn) {
        event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, { result: false, msg: "uploadError" });
        // const mainPath = this.process.cwd();
        const directory = './Error';
        const filepath = `${directory}/error_${new Date().toISOString().replace(':', '-').slice(0, 19)}.txt`;
        this.fs.mkdir(directory, { recursive: true }, () => this.fs.writeFile(filepath, err + '', fn.bind(this)));
    }

    /**
     * 从文件夹获取文件名
     * @param {String} folderPath 
     * @returns 
     */
    readmidr(folderPath) {
        return this.fs.readdirSync(folderPath);
    }

    /**
     * 读取文件内容
     * @param {String} path 
     * @param {String} type 
     * @returns 
     */
    readFiles(path, type) {
        try {
            return this.fs.readFileSync(path, type);
        } catch (error) {
            return false;
        }
    }

    /**
     * 写入文件
     * @param {String} path 
   * @param data
     * @returns 
     */
    writeFiles(path, data) {
        try {
            this.fs.writeFileSync(path, data);
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
            case SOURCE_SOUNDS:
                return 0xec;
            default:
                break;
        }
    }

    /**
     * 根据获取到的功能码判断设备类型
     * @param {Object} watchDeviceData 
     * @returns 
     */
    distinguishDevice(watchDeviceData) {
        for (let i = 0; i < watchDeviceData.deviceList.length; i++) {
            const item = watchDeviceData.deviceList[i];
            item.sensing_device = deviceIdMap[this.deviceIdList[0]];
            item.deviceId = this.deviceIdList[0];
            if (item.color) {
                item.sensing_device = deviceIdMap[this.deviceIdList[2]];
                item.deviceId = this.deviceIdList[2];
                if (!('Not_Run' in item.color)) {
                    item.color = {
                        'l': item.color.l,
                        ...item.color,
                        'rgb': `rgb(${item.color.r >= 255 ? '255' : item.color.r}, ${item.color.g >= 255 ? '255' : item.color.g}, ${item.color.b >= 255 ? '255' : item.color.b})`,
                    }
                }
            } else if (item.big_motor || item.small_motor) {
                item.motor = item.big_motor || item.small_motor;
                item.sensing_device = item.big_motor ? deviceIdMap[this.deviceIdList[5]] : item.small_motor ? deviceIdMap[this.deviceIdList[6]] : deviceIdMap[this.deviceIdList[1]];
                item.deviceId = item.big_motor ? this.deviceIdList[5] : item.small_motor ? this.deviceIdList[6] : this.deviceIdList[1];
            } else if (item.ultrasion) {
                item.sensing_device = deviceIdMap[this.deviceIdList[3]];
                item.deviceId = this.deviceIdList[3];
            } else if (item.touch) {
                item.sensing_device = deviceIdMap[this.deviceIdList[4]];
                item.deviceId = this.deviceIdList[4];
            } else if (item.gray) {
                item.sensing_device = deviceIdMap[this.deviceIdList[7]];
                item.deviceId = this.deviceIdList[7];

                const obj = { n: [], b: [], ...item.gray };
                for (let key in obj) {
                    if (/^\d{1}/.test(key)) {
                        obj['n'].push(` ${key}:${obj[key]} `);
                        delete obj[key];
                    } else if (/b[\d+?]/.test(key)) {
                        obj['b'].push(` ${key}:${obj[key]} `);
                        delete obj[key];
                    }
                }

                if (obj['n'] && obj['b']) {
                    obj['n'] = obj['n'].join('|');
                    obj['b'] = obj['b'].join('|');
                }

                item.gray = { ...obj }
            }
        }

        return { ...watchDeviceData };
    }

    /**
     * 捕捉接收的数据
     * @param {String} data 
     * @returns 
     */
    catchData(data) {
        if (!data) return;
        //将接收到的数据转成buffer数组
        const list = this.getBufferArray(data);
        const start = list.indexOf(0x5a);
        let newList = [];
        if (list[start] === 0x5a && (list[start + 1] === 0x97 || list[start + 1] === 0x98) && (list[start + 2] === 0x97 || list[start + 2] === 0x98)) {
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
   * @param recevieObj
         * @param {*} event 
         * @returns 
         */
    verification(sign, recevieObj, event) {
        if (!recevieObj) return;
        const { data, bit } = recevieObj;
        if (!data) return;
        const text = new TextDecoder();
        switch (sign) {
            case signType.EXE.FILES:
                if (data && bit === 0x7F) {
                    const names = text.decode(Buffer.from(data.slice(5, data.length - 2)));
                    event.reply(ipc_Main.RETURN.EXE.FILES, names);
                }
                return false;
            case signType.BOOT.BIN:         //文件数据
                const listBin = data.slice(0, -2);
                let sum = 0;
                listBin.forEach(item => sum += item)
                return _intercept(listBin.concat((sum & 0xff), data[data.length - 1]), data);
            default:
                return false;
        }

        function _intercept(list, data) {
            let res = true;
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                if (item !== parseInt(list[i])) {
                    res = false;
                    break;
                }
            }
            return res;
        }
    }

    /**
     * 清空对象
     * @param  {...any} args 
     */
    deleteObj(...args) {
        args.forEach(el => {
            if (typeof el === 'object') {
                for (const key in el) {
                    delete el[key];
                }
            }
        });
    }

    /**
     * 矩阵灯交互
     * @param {Object} obj 
     */
    matrixChange(obj) {
        let list;
        const matrix = obj['obj'].matrix;
        switch (obj.type) {
            case 'change':
                list = this.getInstructLIst(0x09, 0xE0, matrix);
                break;
            case 'color':
                matrix.unshift(0x00);
                list = this.getInstructLIst(0x04, 0xE2, matrix);
                break;
            case 'brightness':
                list = this.getInstructLIst(0x01, 0xE1, parseInt(matrix));
                break;
            default:
                break;
        }
        return list;
    }

    /**
     * 电机交互
     * @param {Object} obj 
     */
    motorChange(obj) {
        let list;
        const motor = obj['obj'];
        switch (obj.type) {
            case 'speed':
                let data = _stringToHex(`${motor.port}/${motor.speed}`);
                list = this.getInstructLIst(data.length, 0xB0, data);
                break;
            case 'spin':
                let dataSpin = _stringToHex(`${motor.port}/${motor.spin}`);
                list = this.getInstructLIst(dataSpin.length, 0xB2, dataSpin);
                break;
            case 'spinCirle':
                let dataSpinCirle = _stringToHex(`${motor.port}/${motor.spin}/${motor.value}`);
                if (motor.type === 'angle') {
                    list = this.getInstructLIst(dataSpinCirle.length, 0xB3, dataSpinCirle);
                } else {
                    list = this.getInstructLIst(dataSpinCirle.length, 0xB1, dataSpinCirle);
                }
                break;
            default:
                break;
        }
        return list;

        function _stringToHex(str) {
            let arr = [];
            for (let index = 0; index < str.length; index++) {
                const char = str[index];
                const hex = '0x' + char.charCodeAt(0).toString(16);
                arr.push(Number(hex));
            }
            return arr;
        }
    }

    sumData(data) {
        let num = 0;
        for (let i = 0; i < data.length; i++) {
            num += data[i]
        }
        return num;
    }

    getInstructLIst(dataLen, bit, data) {
        let arr, sum;
        if (Array.isArray(data)) {
            sum = 0x5a + 0x97 + 0x98 + dataLen + bit + this.sumData(data);
            arr = [0x5A, 0x97, 0x98, dataLen, bit, ...data, (sum & 0xff), 0xA5];
        } else if (typeof data === 'string') {
            sum = 0x5a + 0x97 + 0x98 + dataLen + bit;
            arr = [0x5A, 0x97, 0x98, dataLen, bit, ...data, (sum & 0xff), 0xA5];
        } else {
            sum = 0x5a + 0x97 + 0x98 + dataLen + bit + parseInt(data);
            arr = [0x5A, 0x97, 0x98, dataLen, bit, parseInt(data), (sum & 0xff), 0xA5];
        }
        return arr;
    }

    checkIsDeviceData(data, reg) {
        try {
            const result = data.match(reg);
            if (result && result[0].length > 0) {
                return JSON.parse(result[0]);
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    }

    throttle(fn, delay, isImmediate = true) {
        let last = Date.now();
        return function () {
            let now = Date.now();
            if (isImmediate) {
                fn.apply(this, arguments);
                isImmediate = false;
                last = now;
            }
            if (now - last >= delay) {
                fn.apply(this, arguments);
                last = now;
            }
        }
    }

    /**
     * 处理要上传的文件数据
     * @param {Object} data
     * @returns {Array}
     */
    handleDataOfUpload(data, sliceLength = 248) {
        if (!data.fileData || !data.fileName) {
            return;
        }

        //将子文件数据切割成248个
        const sliceList = this.uploadSlice(data.fileData, sliceLength);

        const newList = sliceList.reduce((pre, cur, index) => {
            //将文件数据放入处理函数获取需要发送给下位机的完整指令
            const { binArr } = this.checkBinData(cur, index === sliceList.length - 1);
            pre.push(binArr);
            return pre;
        }, [])

        //根据文件类型获取功能码
        const bits = this.getBits(data.verifyType);

        //将文件名放入处理函数获取需要发送给下位机的完整指令
        const { binArr } = this.checkFileName(data.fileName, bits);

        newList.unshift(binArr);

        return newList;
    }
}

// module.exports = Common;
// module.exports['default'] = Common;

export default Common;