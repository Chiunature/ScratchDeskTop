/*
 * @Description: New features
 * @Author: jiang
 * @Date: 2023-06-07 08:58:20
 * @LastEditors: jiang
 * @LastEditTime: 2023-06-09 17:55:33
 * @params: {
 *  mainWindow: 主进程
 *  port: 串口
 *  timer: 延时器
 *  parser: 接受数据解析器
 *  crc: 十六进制校验数
 *  chunkBuffer: bin文件数据缓存
 *  chunkIndex: 切片下标
 *  sign: 检验标识
 * }
 */
const Get_CRC = require("./get_crc");
const { SerialPort } = require("serialport");
const { ByteLengthParser } = require('@serialport/parser-byte-length');
const { ipcMain } = require("electron");

const arr1 = [0xa0, 0xa1, 0xcc, 0xff, 0xff, 0xff, 0xff, 0x09];
const arr3 = [0xa0, 0xa1, 0x5c, 0xff, 0xff, 0xff, 0xff, 0x99];

let port, timer, parser, crc, chunkBuffer = [], chunkIndex = 0, sign;

//获取串口列表
function getList() {
    ipcMain.on("connect", (event, arg) => {
        if (arg) {
            SerialPort.list().then((res) => {
                event.reply("connected", res);
            });
        }
    });
}
//连接串口
function connectSerial() {
    ipcMain.on("connected", (event, arg) => {
        linkToSerial(arg, event);
    });
}
//断开连接
function disconnectSerial(port) {
    ipcMain.on("disconnected", (event) => {
        if (port.isOpen) port.close();
        // event.reply("closed", "disconnect");
    });
}

function linkToSerial(serial, event) {
    if (port) port.close();
    port = new SerialPort(
        {
            path: serial.path,
            baudRate: 115200,
        },
        (err) => {
            if (err) {
                port = null;
                event.reply("open", "failedConnected");
            } else {
                event.reply("open", "successfullyConnected");
            }
        }
    );
    parser = port.pipe(new ByteLengthParser({ length: 8 }));
    sendToSerial();
    disconnectSerial(port);
    port.on("close", () => {
        port = null;
        event.reply("closed", "disconnect");
        console.log("the serialport is closed.");
    });
}

function writeData(data, str) {
    console.log('write ==>', data);
    sign = str;
    port.write(data);
    port.flush();
}
//校验和发送数据
function verify(chunk, callback) {
    switch (sign) {
        case 'Boot_Update':
            //触发第一个块信息长度计算
            if (chunk[chunk.length - 1] === 0x09) checkData(chunkBuffer[chunkIndex].length, 'Block');
            break;
        case 'Block':
            //块信息长度之后触发，写入块
            if (crc && chunk[0] === 0xa1 && chunk[1] === 0xa0) {
                writeData(chunkBuffer[chunkIndex], `BlockRes`);
            }
            break;
        case 'BlockRes':
            //写入块后，得到返回，再写入返回
            if (crc && chunk[0] === 0xa1 && chunk[1] === 0xa0) {
                chunk[0] = 0xa0;
                chunk[1] = 0xa1;
                writeData(chunk, `BlockNext`);
            }
            break;
        case `BlockNext`:
            //写入返回后得到返回，触发下一个块信息长度计算
            if (crc && chunk[0] === 0xa1 && chunk[1] === 0xa0 && chunkIndex < chunkBuffer.length) {
                checkData(chunkBuffer[chunkIndex].length, 'Block');
            }
            break;
        default:
            break;
    }
    if (sign === 'BlockNext' && chunk) return callback(true);
    return callback(false);
}

//接受数据
function received(event) {
    parser.on("data", (chunk) => {
        if (!chunk) {
            port.flush();
            event.reply("completed", {
                result: false,
                msg: "uploadError",
            });
            return;
        } else {
            chunk = Get_CRC(chunk);
            console.log("the received data is:", chunk);
            verify(chunk, (flag) => {
                if (flag && chunkIndex <= chunkBuffer.length) chunkIndex++;
            });
            if (chunkIndex === chunkBuffer.length + 1) {
                writeData(arr3, null);
                chunkIndex++;
            }
        }
    });
}

//发送bin信息长度
function checkData(len, str) {
    let arr2 = [0xa0, 0xa1, 0x5a, (len >> 8), (len & 0xff), 0xff, 0xff];
    let newarr = Get_CRC(arr2);
    crc = newarr[newarr.length - 1];
    writeData(newarr, str);
}

//分段上传
function uploadSlice(data) {
    chunkBuffer = [];
    // 将data分段，每段大小512b
    const chunkSize = 512;
    if (data.length < chunkSize) {
        chunkBuffer.push(data);
    } else {
        for (let i = 0; i < data.length; i += chunkSize) {
            let chunk = data.slice(i, i + chunkSize);
            chunkBuffer.push(chunk);
        }
    }
}

//发送数据
function sendToSerial() {
    ipcMain.on("writeData", (event, data) => {
        uploadSlice(data);
        received(event);
        writeData(arr1, 'Boot_Update');
        clearTimeout(timer);
        timer = setTimeout(() => {
            port.drain((err) => {
                if (err) {
                    event.reply("completed", {
                        result: false,
                        msg: "uploadError",
                    });
                } else {
                    event.reply("completed", {
                        result: false,
                        msg: "uploadSuccess",
                    });
                }
            });
        }, 0);
    });
}

module.exports = {
    getList,
    connectSerial
}