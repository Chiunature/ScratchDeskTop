/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2023 drluck Inc.
 * http://www.drluck.cn/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview The class representing one block.
 * @author avenger-jxc
 */

/*
* @params: {
 *  port: 串口
 *  chunkBuffer: bin文件数据缓存
 *  chunkIndex: 切片下标
 *  sign: 步骤标识
 *  timeOutTimer: 检测指令是否成功有返回
 *  verifyType: 判断是发固件文件还是bin数据
 *  receiveDataBuffer: 接收到的数据缓存
 *  filesObj: 固件文件对象
 *  stopWatch: 停止设备监听
 * }
 */
const { SerialPort } = require("serialport");
const Common = require("./common.js");
const { verifyActions, processReceivedConfig } = require("../config/js/verify.js");
const { SOURCE, SOURCE_CONFIG } = require("../config/json/verifyTypeConfig.json");


class Serialport extends Common {
    port;
    receiveDataBuffer = [];
    chunkBuffer = [];
    chunkIndex = 0;
    sign;
    timeOutTimer;
    verifyType;
    filesObj;
    stopWatch;

    constructor() {
        super();
    }

    //获取串口列表
    getList() {
        this.ipcMain("getConnectList", (event, arg) => {
            SerialPort.list().then((res) => event.reply("connectList", res));
        });
    }

    //连接串口
    connectSerial() {
        this.ipcMain("connect", (event, arg) => this.linkToSerial(arg, event));
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
                    event.reply("connected", { res: false, msg: "failedConnected" });
                } else if (!err && !sign) {
                    event.reply("connected", { res: true, msg: "successfullyConnected" });
                }
            }
        );
        this.handleRead("readable", event);
        this.listenPortClosed("close", event);
        this.disconnectSerial("disconnected");
        this.sendToSerial("writeData", this.upload);
        this.listenError("transmission-error");
        this.watchDevice("watchDevice");
        this.deleteExe("delete-exe");
        this.getVersion(event);
    }

    //上传文件
    upload(event, data) {
        if(data.verifyType === SOURCE_CONFIG) {
            event.reply("sourceCompleted", { msg: "uploadSuccess" });
        }
        
        if(!data.binData || !data.fileName) return;
        this.chunkBuffer = this.uploadSlice(data.binData, 248);
        this.verifyType = data.verifyType;
        this.filesObj = {
            filesIndex: data.filesIndex,
            filesLen: data.filesLen,
            fileVerifyType: data.verifyType,
            fileName: data.fileName
        };
        const bits = this.getBits(data.verifyType);
        const { binArr } = this.checkFileName(data.fileName, bits);
        this.writeData(binArr, data.binData ? 'Boot_URL' : null, event);
    }

    //侦听串口关闭
    listenPortClosed(eventName, event) {
        this.port.on(eventName, () => {
            event.reply("connected", { res: false, msg: "disconnect" });
            this.clearCache();
        });
    }

    //写入数据
    writeData(data, str, event) {
        if (!this.port) return;
        this.sign = str;
        this.port.write(data);
        if (this.verifyType && this.verifyType.indexOf(SOURCE) == -1) event.reply('progress', Math.ceil((this.chunkIndex / this.chunkBuffer.length) * 100));
        if(str && str.search('Boot') !== -1) this.checkOverTime(event);
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

    //监听设备信息
    watchDevice(eventName) {
        this.ipcMain(eventName, (event, data) => {
            this.stopWatch = data.stopWatch;
            if(!data.stopWatch) this.writeData(data.instruct, 'Watch_Device', event);
        });
    }

    //发bin数据
    sendBin(index, event) {
        if (index < 0) return;
        const element = this.chunkBuffer[index];
        const { binArr } = this.checkBinData(element, index, this.chunkBuffer.length - 1);
        if (index === this.chunkBuffer.length - 1) this.writeData(binArr, 'Boot_End', event);
        else this.writeData(binArr, 'Boot_Bin', event);
    }

    //读取串口数据
    handleRead(eventName, event) {
        if (!this.port) return;
        this.port.on(eventName, () => {
            try {
                this.clearTimer();
                const receiveData = this.port.read();

                const allData = this.catchData(receiveData);
                const verify = this.verification(this.sign, allData, event, this.hexToString.bind(this));

                if (verify) this.processReceivedData(event);
            } catch (error) {
                this.handleReadError(event, this.clearCache);
            }
        });
    }

    //捕捉接收的数据
    catchData(data) {
        if (!this.sign || !data) return;
        const list = this.Get_CRC(data);
        if(list[0] === 0x5a && list[list.length - 1] === 0xa5) {
            return list;
        }else if(list[0] === 0x5a && list[list.length - 1] !== 0xa5) {
            this.receiveDataBuffer = [...list];
        }else {
            this.receiveDataBuffer = this.receiveDataBuffer.concat(list);
            if(this.receiveDataBuffer[0] === 0x5a && list[list.length - 1] === 0xa5) {
                const newList = [...this.receiveDataBuffer];
                this.receiveDataBuffer.splice(0, this.receiveDataBuffer.length);
                return newList;
            }
            return false;
        }
    }

    //校验数据
    verification(sign, data, event, hexToString) {
        if(!data) return false;
        const result = verifyActions(sign, data, event, hexToString);
        if(typeof result === 'object') {
            const action = this.actions(verifyActions(sign, data, event, hexToString));
            return this.switch(action, sign, true);
        }else {
            return result;
        }
    }

    //处理接收到的数据
    processReceivedData(event) {
        if (this.sign == 'Boot_URL') {
            this.sign = 'Boot_Bin';
        } else {
            this.chunkIndex++;
        }
        const actions = processReceivedConfig(event, this.chunkIndex, this.verifyType, this.filesObj, this.sendBin.bind(this), this.clearCache.bind(this));
        this.switch(actions, this.sign);
    }

    //获取主机版本
    getVersion(event) {
        this.writeData([0x5A, 0x97, 0x98, 0x01, 0xE1, 0x01, 0x6C, 0xA5], 'get_version', event);
    }

    //删除主机上的程序
    deleteExe(eventName) {
        this.ipcMain(eventName, (event, data) => {
            const bits = this.getBits(data.verifyType);
            const { binArr } = this.checkFileName(data.fileName, bits);
            this.writeData(binArr, 'delete-exe', event);
        });
    }
}


module.exports = Serialport