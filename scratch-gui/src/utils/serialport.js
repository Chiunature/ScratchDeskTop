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
 * }
 */
const { SerialPort } = require("serialport");
const Common = require("./common.js");
const actions = require("./verification.js");

class Serialport extends Common {
    port;
    receiveDataBuffer = [];
    chunkBuffer = [];
    chunkIndex = 0;
    sign;
    receiveData;
    timeOutTimer;
    crc;

    constructor() {
        super();
    }

    //获取串口列表
    getList() {
        this.ipcMain("connect", (event, arg) => {
            if (arg) SerialPort.list().then((res) => event.reply("connected", res));
        });
    }

    //连接串口
    connectSerial() {
        this.ipcMain("connected", (event, arg) => this.linkToSerial(arg, event));
    }

    //断开连接
    disconnectSerial(eventName) {
        this.ipcMain(eventName, () => {
            if (this.port && this.port.isOpen) this.port.close();
        });
    }

    //连接串口
    linkToSerial(serial, event, sign) {

        if (this.port && this.port.isOpen && this.port.path == serial.path) {
            return;
        } else if (this.port && this.port.isOpen && this.port.path != serial.path) {
            this.port.close();
        }

        this.port = new SerialPort(
            {
                path: serial.path,
                baudRate: 115200
            },
            (err) => {
                if (err && !sign) {
                    event.reply("open", { res: false, msg: "failedConnected" });
                } else if (!err && !sign) {
                    event.reply("open", { res: true, msg: "successfullyConnected" });
                }
            }
        );
        this.handleRead("readable", event);
        this.listenPortClosed("close", event);
        this.disconnectSerial("disconnected");
        this.sendToSerial("writeData", this.upload);
        this.listenError("transmission-error");
    }

    //上传文件
    upload(event, data) {
        this.chunkBuffer = this.uploadSlice(data.binData, 248);
        let { binArr, crc } = this.checkFileName(data.fileName, data.verifyType === 'SOURCE' ? 0xec : 0xda);
        this.crc = crc;
        this.writeData(binArr, 'Boot_URL', event);
    }

    //侦听串口关闭
    listenPortClosed(eventName, event) {
        this.port.on(eventName, () => {
            event.reply("open", { res: false, msg: "disconnect" });
            this.clearCache();
        });
    }

    //写入数据
    writeData(data, str, event) {
        if (!this.port) return;
        this.sign = str;
        this.port.write(data);
        // console.log("write ==>", data);
        this.checkOverTime(event);
    }

    //检测是否超时
    checkOverTime(event) {
        this.timeOutTimer = setTimeout(() => {
            event.reply("completed", { result: false, msg: "uploadTimeout" });
            this.clearCache();
        }, 5000);
    }

    //清除所有定时器
    clearTimer() {
        clearTimeout(this.timeOutTimer);
        this.timeOutTimer = null;
    }

    //清除缓存
    clearCache() {
        if (this.port && this.port.isOpen) this.port.flush();
        this.receiveDataBuffer = [];
        this.timeOutTimer = null;
        this.chunkIndex = 0;
        this.sign = null;
    }



    //发bin数据
    sendBin(index, event) {
        if (index < 0) return;
        const element = this.chunkBuffer[index];
        let { binArr, crc } = this.checkBinData(element, index, this.chunkBuffer.length - 1);
        this.crc = crc;
        if (index === this.chunkBuffer.length - 1) this.writeData(binArr, 'Boot_End', event);
        else this.writeData(binArr, 'Boot_Bin', event);
    }

    //读取串口数据
    handleRead(eventName, event) {
        if (!this.port) return;
        this.port.on(eventName, () => {
            try {
                this.clearTimer();
                this.receiveData = this.port.read();
                // console.log("the received data is:", this.receiveData);

                let allData = this.catchData(this.receiveData);
                let verify = this.verification(this.receiveDataBuffer);
                if (allData && verify) this.processReceivedData(event);
                else if (!verify) this.checkOverTime(event);
            } catch (error) {
                console.log(error);
                this.handleReadError(event, this.clearCache);
            }
        });
    }

    //捕捉接收的数据
    catchData(data) {
        if (!this.sign || !this.receiveData) return;
        this.receiveDataBuffer = this.receiveDataBuffer.concat(this.Get_CRC(data));
        if (data[data.length - 1] == 0xa5) {
            // console.log("the processed data is:", this.receiveDataBuffer);
            return true;
        }
        return false;
    }

    //校验数据
    verification(data) {
        const action = actions(data);
        return this.switch(action, this.sign, 'verify');
    }

    //处理接收到的数据
    processReceivedData(event) {
        if (this.receiveDataBuffer.length > 0) this.receiveDataBuffer.splice(0, this.receiveDataBuffer.length);
        if (this.sign == 'Boot_URL') this.sign = 'Boot_Bin';
        const actions = {
            Boot_Bin: () => this.sendBin(this.chunkIndex, event),
            Boot_End: () => {
                event.reply("completed", { result: true, msg: "uploadSuccess" });
                this.clearCache();
            }
        };
        this.switch(actions, this.sign, 'process');
        this.chunkIndex++;
    }

}


module.exports = Serialport