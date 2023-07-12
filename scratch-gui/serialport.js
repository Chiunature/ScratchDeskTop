/*
 * @Description: New features
 * @Author: jiang
 * @Date: 2023-06-07 08:58:20
 * @LastEditors: jiang
 * @LastEditTime: 2023-06-15 15:30:17
 * @params: {
 *  mainWindow: 主进程
 *  port: 串口
 *  timer: 延时器
 *  parser: 接受数据解析器
 *  crc: 十六进制校验数
 *  chunkBuffer: bin文件数据缓存
 *  chunkIndex: 切片下标
 *  sign: 检验标识
 *  checkTimer: 检测是否超时的延时器
 * }
 */
const { SerialPort } = require("serialport");
const { ByteLengthParser } = require('@serialport/parser-byte-length');
const { ipcMain } = require("electron");

const arr1 = [0xa0, 0xa1, 0xcc, 0xff, 0xff, 0xff, 0xff, 0x09];
const arr3 = [0xa0, 0xa1, 0x5c, 0xff, 0xff, 0xff, 0xff, 0x99];

class Serialport {
    port;
    timer;
    parser;
    crc;
    chunkBuffer = [];
    chunkIndex = 0;
    sign;
    checkTimer;

    //获取串口列表
    getList() {
        ipcMain.on("connect", (event, arg) => {
            if (arg) {
                SerialPort.list().then((res) => {
                    event.reply("connected", res);
                });
            }
        });
    }

    //连接串口
    connectSerial() {
        ipcMain.on("connected", (event, arg) => {
            this.linkToSerial(arg, event);
        });
    }

    //断开连接
    disconnectSerial(port) {
        ipcMain.on("disconnected", (event) => {
            if (port.isOpen) {
                this.clearSerialPortBuffer();
                port.close();
            }
        });
    }

    //数据转buffer
    toArrayBuffer(buf) {
        let view = [];
        for (let i = 0; i < buf.length; ++i) {
            view.push(buf[i]);
        }
        return view;
    }

    //检测数据并转buffer形式
    Get_CRC(data) {
        let arr = [];
        if (!Array.isArray(data)) {
            arr = toArrayBuffer(data);
        } else {
            arr = [...data];
        }
        if (data.length < 8) {
            let crc = 0;
            for (let i = 0; i < data.length; i++) {
                crc += data[i];
            }
            crc &= 0xff;
            arr.push(crc);
        }
        return arr;
    }

    //侦听编译时的错误处理
    listenError() {
        ipcMain.on("transmission-error", (event) => {
            event.reply("completed", {
                result: false,
                msg: "uploadError",
            });
        })
    }

    //侦听串口关闭
    listenPortClosed(event) {
        const registeredEvents = ["connect", "connected", "disconnected", "transmission-error", "writeData"];
        this.port.on("close", () => {
            this.port = null;
            this.parser = null;
            registeredEvents.forEach((eventName) => ipcMain.removeListener(eventName));
            registeredEvents.length = 0;
            event.reply("closed", "disconnect");
        });
    }

    //连接串口
    linkToSerial(serial, event) {
        if (this.port) this.port.close();
        this.port = new SerialPort(
            {
                path: serial.path,
                baudRate: 115200,
            },
            (err) => {
                if (err) {
                    this.port = null;
                    event.reply("open", "failedConnected");
                } else {
                    event.reply("open", "successfullyConnected");
                }
            }
        );
        this.parser = this.port.pipe(new ByteLengthParser({ length: 8 }));
        this.listenError();
        this.sendToSerial();
        this.disconnectSerial(this.port);
        this.listenPortClosed(event);
    }

    //写入数据
    writeData(data, str, event) {
        console.log('write ==>', data);
        this.sign = str;
        this.port.write(data);
        if (this.sign === 'Boot_Update') {
            this.checkTimer = setTimeout(() => {
                event.reply("completed", {
                    result: false,
                    msg: "uploadTimeout",
                });
            }, 5000);
        } else {
            clearTimeout(this.checkTimer);
        }
    }

    //清除缓存
    clearSerialPortBuffer() {
        this.port.flush(err => {
            if (err) {
                console.log('clear failed:', err);
            } else {
                console.log('the cache is clear');
            }
        });
    }

    //校验和发送数据
    verify(chunk, callback) {
        switch (this.sign) {
            case 'Boot_Update':
                //触发第一个块信息长度计算
                if (chunk[chunk.length - 1] === 0x09) checkData(this.chunkBuffer[this.chunkIndex].length, 'Block');
                break;
            case 'Block':
                //块信息长度之后触发，写入块
                if (this.crc && chunk[0] === 0xa1 && chunk[1] === 0xa0) {
                    this.writeData(this.chunkBuffer[this.chunkIndex], `BlockRes`);
                }
                break;
            case 'BlockRes':
                //写入块后，得到返回，再写入返回
                if (this.crc && chunk[0] === 0xa1 && chunk[1] === 0xa0) {
                    chunk[0] = 0xa0;
                    chunk[1] = 0xa1;
                    this.writeData(chunk, `BlockNext`);
                }
                break;
            case `BlockNext`:
                //写入返回后得到返回，触发下一个块信息长度计算
                if (this.crc && chunk[0] === 0xa1 && chunk[1] === 0xa0 && this.chunkIndex < this.chunkBuffer.length) {
                    this.checkData(this.chunkBuffer[this.chunkIndex].length, 'Block');
                }
                break;
            default:
                break;
        }
        if (this.sign === 'BlockNext' && chunk) return callback(true);
        return callback(false);
    }

    //接受数据
    received(event) {
        this.parser.on("data", (chunk) => {
            if (!chunk) {
                this.clearSerialPortBuffer();
                event.reply("completed", {
                    result: false,
                    msg: "uploadError",
                });
                return;
            } else {
                chunk = this.Get_CRC(chunk);
                console.log("the received data is:", chunk);
                this.verify(chunk, (flag) => {
                    if (flag && this.chunkIndex <= this.chunkBuffer.length) this.chunkIndex++;
                });
                if (this.chunkIndex === this.chunkBuffer.length + 1) {
                    this.writeData(arr3, null);
                    this.chunkIndex++;
                } else if (this.chunkIndex === this.chunkBuffer.length + 2) {
                    this.chunkIndex = 0;
                    this.clearSerialPortBuffer();
                    event.reply("completed", {
                        result: true,
                        msg: "uploadSuccess",
                    });
                }
            }
        });
    }

    //发送bin信息长度
    checkData(len, str) {
        let arr2 = [0xa0, 0xa1, 0x5a, (len >> 8), (len & 0xff), 0xff, 0xff];
        let newarr = this.Get_CRC(arr2);
        this.crc = newarr[newarr.length - 1];
        this.writeData(newarr, str);
    }

    //分段上传
    uploadSlice(data) {
        // 将data分段，每段大小512b
        this.chunkBuffer = [];
        const chunkSize = 512;
        if (data.length < chunkSize) {
            this.chunkBuffer.push(data);
        } else {
            for (let i = 0; i < data.length; i += chunkSize) {
                let chunk = data.slice(i, i + chunkSize);
                this.chunkBuffer.push(chunk);
            }
        }
    }

    //发送数据
    sendToSerial() {
        ipcMain.on("writeData", (event, data) => {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.received(event);
                this.uploadSlice(data);
                this.writeData(arr1, 'Boot_Update', event);
            }, 0);
        });
    }
}


module.exports = Serialport