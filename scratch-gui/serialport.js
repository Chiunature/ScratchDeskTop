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
// const { ByteLengthParser } = require('@serialport/parser-byte-length');
const { ipcMain } = require("electron");
const { spawn } = require("child_process");

class Serialport {
    port;
    parser;
    chunkBuffer = [];
    chunkIndex = 0;
    sign;
    receiveData;
    timeOutTimer;
    serial;
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
            if (arg) event.reply("closed", "disconnect");
        });
    }

    //连接串口
    linkToSerial(serial, event, sign) {
        this.sendToSerial();
        this.listenError();
        this.disconnectSerial();
    }

    //侦听编译时的错误处理
    listenError() {
        ipcMain.on("transmission-error", (event) => event.reply("completed", { result: false, msg: "uploadError" }));
    }

    //侦听串口关闭
    /* listenPortClosed(event) {
        this.port.on("close", () => {
            if (this.serial) {
                this.linkToSerial(this.serial, event, true);
            } else {
                this.clearSerialPortBuffer();
                this.port = null;
                event.reply("closed", "disconnect");
            }
        });
    } */

    //检测是否超时
    /* checkOverTime(event) {
        this.timeOutTimer = setTimeout(() => {
            event.reply("completed", { result: false, msg: "uploadTimeout" });
            this.clearSerialPortBuffer();
        }, 3000);
    } */


    //清除缓存
    /* clearSerialPortBuffer() {
        if (this.port && this.port.isOpen) this.port.flush();
        this.sign = null;
        this.chunkIndex = 0;
        this.serial = null;
        this.timeOutTimer = null;
    } */

    //开始上传
    startUpload(event) {
        let dir = `./gcc-arm-none-eabi/bin/LB_USER`;
        let workerProcess = spawn("SerialDownload", [this.serial.path], { cwd: dir });
        workerProcess.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
            clearTimeout(this.timeOutTimer);
            this.timeOutTimer = setTimeout(() => {
                event.reply("completed", { result: true, msg: "uploadSuccess" });
                this.timeOutTimer = null;
                workerProcess.kill();
            }, 3000);
        });

        workerProcess.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
            this.handleReadError(event);
        });

        workerProcess.on('close', function (code) {
            console.log('process exited:', code);
        });
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
        ipcMain.on("writeData", (event) => this.debounce(this.startUpload(event), 100));
    }

    //对接收数据的错误处理
    handleReadError(event) {
        // this.clearSerialPortBuffer();
        event.reply("completed", { result: false, msg: "uploadError" });
    }

    //自动接收数据
    /* autoRead(event) {
        if (!this.port) return;
        this.parser.on("data", (chunk) => {
            try {
                this.receiveData = chunk;
                console.log("the received data is:", this.receiveData);
            } catch (error) {
                console.log(error);
                this.handleReadError(event);
            }
        });
    } */


}


module.exports = Serialport