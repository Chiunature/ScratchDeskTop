/*
 * @Description: New features
 * @Author: jiang
 * @Date: 2023-06-07 08:58:20
 * @LastEditors: jiang
 * @LastEditTime: 2023-06-15 15:30:17
 * @params: {
 *  mainWindow: 主进程
 *  port: 串口
 *  chunkBuffer: bin文件数据缓存
 *  chunkIndex: 切片下标
 *  sign: 检验标识
 *  intervalTimer: 等待响应之后的延时器
 *  timeOutTimer: 检测指令是否成功有返回
 *  receiveData: 接受的数据
 * }
 */
const { SerialPort } = require("serialport");
const { ByteLengthParser } = require('@serialport/parser-byte-length');
const { ipcMain } = require("electron");

const arr1 = [0x5a, 0x97, 0x98, 0x00, 0xf0, 0x00, 0x79, 0xa5];
const arr3 = [0x5a, 0x97, 0x98, 0x00, 0xf2, 0x00, 0x7b, 0xa5];

class Serialport {
    port;
    parser;
    chunkBuffer = [];
    chunkIndex = 0;
    sign;
    receiveData;
    intervalTimer;
    timeOutTimer;

    //获取串口列表
    getList() {
        ipcMain.on("connect", (event, arg) => {
            if (arg) SerialPort.list().then((res) => event.reply("connected", res));
        });
    }

    //连接串口
    connectSerial() {
        ipcMain.on("connected", (event, arg) => this.linkToSerial(arg, event));
    }

    //断开连接
    disconnectSerial() {
        ipcMain.on("disconnected", (event, arg) => {
            if (this.port && arg && this.port.isOpen) this.port.close();
        });
    }

    //连接串口
    linkToSerial(serial, event) {
        if (this.port) this.port = null;
        this.port = new SerialPort(
            {
                path: serial.path,
                baudRate: 115200
            },
            (err) => {
                if (err) {
                    event.reply("open", { res: false, msg: "failedConnected" });
                    console.log(err);
                } else {
                    event.reply("open", { res: true, msg: "successfullyConnected" });
                }
            }
        );
        this.parser = this.port.pipe(new ByteLengthParser({ length: 8 }));
        this.listenError();
        this.sendToSerial();
        this.disconnectSerial(event);
        this.listenPortClosed(event);
        this.autoRead(event);
    }

    //侦听编译时的错误处理
    listenError() {
        ipcMain.on("transmission-error", (event) => event.reply("completed", { result: false, msg: "uploadError" }));
    }

    //侦听串口关闭
    listenPortClosed(event) {
        this.port.on("close", () => {
            this.clearSerialPortBuffer();
            this.port = null;
            event.reply("closed", "disconnect");
        });
    }

    //数据转buffer数组
    toArrayBuffer(buf) {
        let view = [];
        for (let i = 0; i < buf.length; i++) {
            view.push(buf[i]);
        }
        return view;
    }

    //检测数据并转buffer数组
    Get_CRC(data) {
        let arr = [];
        if (!Array.isArray(data)) {
            arr = this.toArrayBuffer(data);
        } else {
            arr = [...data];
        }
        return arr;
    }

    //写入数据
    writeData(data, str, event) {
        if (!this.port) return;
        this.sign = str;
        this.port.write(data);
        console.log('write ==>', data);
        this.checkOverTime(event);
    }

    //bin信息长度
    checkData(len, index) {
        let sum = 0x5a + 0x97 + 0x98 + (len - 1) + 0xf1;
        this.chunkBuffer[index].forEach(el => sum += el);
        let arr = [0x5a, 0x97, 0x98, (len - 1), 0xf1, ...this.chunkBuffer[index], (sum & 0xff), 0xa5];
        return arr;
    }

    //分段上传
    uploadSlice(data, size) {
        this.chunkBuffer = [];
        let chunkSize = size;
        if (data.length < chunkSize) {
            this.chunkBuffer.push(data);
        } else {
            for (let i = 0; i < data.length; i += chunkSize) {
                let chunk = data.slice(i, i + chunkSize);
                this.chunkBuffer.push(chunk);
            }
        }
    }

    //检测是否超时
    checkOverTime(event) {
        this.timeOutTimer = setTimeout(() => {
            clearInterval(this.intervalTimer);
            event.reply("completed", { result: false, msg: "uploadTimeout" });
            this.timeOutTimer = null;
        }, 3000);
    }

    //清除所有定时器和延时器
    clearTimer() {
        clearInterval(this.intervalTimer);
        clearTimeout(this.timeOutTimer);
        this.intervalTimer = null;
        this.timeOutTimer = null;
    }

    //清除缓存
    clearSerialPortBuffer() {
        if (this.port && this.port.isOpen) this.port.flush();
        this.sign = null;
        this.chunkIndex = 0;
        this.intervalTimer = null;
        this.timeOutTimer = null;
    }

    //开始上传
    startUpload(event, data) {
        this.clearSerialPortBuffer();
        this.uploadSlice(data, 256);
        this.writeData(arr1, 'Boot_Start', event);
    }

    //防抖防止重复发送数据
    debounce(func, delay) {
        let timerId;
        return function (...args) {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    //向串口发送数据
    sendToSerial() {
        ipcMain.on("writeData", (event, data) => this.debounce(this.startUpload(event, data), 100));
    }

    //发bin数据
    sendBin(event) {
        if (this.chunkIndex >= 0) {
            this.chunkIndex++;
            const element = this.chunkBuffer[this.chunkIndex];
            const binArr = this.checkData(element.length, this.chunkIndex);
            if (this.chunkIndex === this.chunkBuffer.length - 1) this.writeData(binArr, 'Boot_End', event);
            else this.writeData(binArr, 'Boot_Bin', event);
        }
    }

    //自动接收数据
    autoRead(event) {
        if (!this.port) return;
        this.parser.on("data", (chunk) => {
            try {
                this.clearTimer();
                this.receiveData = chunk;
                console.log("the received data is:", this.receiveData);
                if (this.receiveData && this.sign && this.verification(this.receiveData)) this.processReceivedData(this.Get_CRC(this.receiveData), event);
                else if (!this.verification(this.receiveData)) this.checkOverTime(event);
            } catch (error) {
                console.log(error);
                this.clearSerialPortBuffer();
                event.reply("completed", { result: false, msg: "uploadError" });
            }
        });
    }

    //校验数据
    verification(data) {
        switch (this.sign) {
            case 'Boot_Start':
                if (data[0] == 0x5a && data[1] == 0x98 && data[2] == 0x97 && data[3] == 0x00 && data[4] == 0xf0 && data[5] == 0x00 && data[6] == 0x79 && data[7] == 0xa5) return true;
                else return false;
            case 'Boot_Update':
                if (data[0] == 0x5a && data[1] == 0x98 && data[2] == 0x97 && data[3] == 0x00 && data[4] == 0xf0 && data[5] == 0x00 && data[6] == 0x79 && data[7] == 0xa5) return true;
                else return false;
            case 'Boot_Bin':
                if (data[0] == 0x5a && data[1] == 0x98 && data[2] == 0x97 && data[3] == 0x01 && data[4] == 0xf1 && data[5] == 0x00 && data[6] == 0x7b && data[7] == 0xa5) return true;
                else return false;
            case 'Boot_End':
            case 'Boot_Compelete':
                return true;
            default:
                break;
        }
    }

    //处理接收到的数据
    processReceivedData(data, event) {
        switch (this.sign) {
            case 'Boot_Start':
                this.writeData(arr1, 'Boot_Update', event);
                break;
            case 'Boot_Update':
                this.timeOutTimer = setTimeout(() => {
                    const binArr = this.checkData(this.chunkBuffer[0].length, 0);
                    this.writeData(binArr, 'Boot_Bin', event);
                }, 1000);
                break;
            case 'Boot_Bin':
                this.sendBin(data, event);
                break;
            case 'Boot_End':
                this.writeData(arr3, 'Boot_Compelete', event);
                break;
            case 'Boot_Compelete':
                this.timeOutTimer = setTimeout(() => {
                    event.reply("completed", { result: true, msg: "uploadSuccess" });
                    this.clearSerialPortBuffer();
                }, 1000);
                break;
            default:
                break;
        }
    }

}


module.exports = Serialport