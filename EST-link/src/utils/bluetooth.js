import Common from "./common";
import { verifyBinType } from "../config/js/verify.js";
import {
  SOURCE,
  EST_RUN,
  RESET_FWLIB,
  BOOTBIN,
} from "../config/json/verifyTypeConfig.json";
import ipc_Main from "../config/json/ipc.json";
import signType from "../config/json/sign.json";
import { instructions, reg } from "../config/js/instructions.js";

export class Bluetooth extends Common {
  constructor(...args) {
    super(...args);
    this._type = "ble";
    this.peripheralList = new Map();
    this.peripheral = null;
    this.service = null;
    this.serviceUUID = "0000fff0-0000-1000-8000-00805f9b34fb";
    this.characteristicUUID = "0000fff1-0000-1000-8000-00805f9b34fb";
    this.chunkBuffer = [];
    this.chunkBufferSize = 0;
    this.sign = null;
    this.timeOutTimer = null;
    this.checkConnectTimer = null;
    this.verifyType = null;
    this.receiveObj = null;
    this.watchDeviceData = null;
    this.selectedExe = null;
    this.sourceFiles = [];
    this.uploadingFile = null;
    this.receiveData = [];
    this.isStopWatch = false;
    this.bleState = null;
  }

  /**
   * 扫描设备
   * @param {Boolean} open true表示开启扫描, false表示停止扫描
   */
  scanning(event, open) {
    if (open) {
      this.discover(event);
      const eventList = this.noble.eventNames();
      if (!eventList.includes("stateChange")) {
        this.noble.on("stateChange", (state) => {
          this.bleState = state;
          switch (state) {
            case "poweredOn":
              break;
            case "poweredOff":
              this.noble.stopScanning();
              event.reply(ipc_Main.RETURN.BLE.SCANNING, {
                msg: "bleISNotSupported",
              });
              break;
            default:
              break;
          }
        });
      } else {
        this.bleState === "poweredOn"
          ? this.noble.startScanning([], true)
          : event.reply(ipc_Main.RETURN.BLE.SCANNING, {
              msg: "bleISNotSupported",
            });
      }
    } else {
      this.noble.stopScanning();
      this.peripheralList.clear();
    }
  }

  /**
   * 发现设备
   */
  discover(event) {
    const eventList = this.noble.eventNames();
    !eventList.includes("discover") &&
      this.noble.on("discover", (peripheral) => {
        if (!peripheral.id) {
          return;
        }

        const ble = {
          id: peripheral.id,
          uuid: peripheral.uuid,
          address: peripheral.address,
          addressType: peripheral.addressType,
          connectable: peripheral.connectable,
          localName: peripheral.advertisement.localName
            ? peripheral.advertisement.localName
            : "unkown",
          state: peripheral.state,
        };

        this.peripheralList.set(peripheral.id, peripheral);

        event.reply(ipc_Main.RETURN.BLE.GETBlELIST, JSON.stringify(ble));
      });
  }

  /**
   * 打开监听服务
   * @returns
   */
  linkBle() {
    this.ipcMain(ipc_Main.SEND_OR_ON.BLE.CONNECTION, (event, port) => {
      this.peripheral = this.peripheralList.get(port.id);

      if (!this.peripheral) {
        event.reply(ipc_Main.RETURN.BLE.CONNECTION, {
          bleType: this._type,
          msg: "failedConnected",
          success: false,
        });
        return;
      }

      //开启获取文件监听
      this.getBinOrHareWare(ipc_Main.SEND_OR_ON.COMMUNICATION.GETFILES);
      //开启获取主机文件监听
      this.getAppExe(ipc_Main.SEND_OR_ON.EXE.FILES);
      //蓝牙传感器更新
      this.updateSensing(ipc_Main.SEND_OR_ON.SENSING_UPDATE);
      //开启删除程序监听
      this.deleteExe(ipc_Main.SEND_OR_ON.EXE.DELETE);
      //开启设备断开监听
      this.disconnected(ipc_Main.SEND_OR_ON.BLE.DISCONNECTED);
      // 连接蓝牙是否成功
      this.isConnectedSuccess(event);
    });
  }

  /**
   * 连接蓝牙是否成功
   */
  async isConnectedSuccess(event) {
    try {
      const resForConnect = this.peripheral && (await this.connectBle(event));

      event.reply(ipc_Main.RETURN.BLE.CONNECTION, {
        bleType: this._type,
        msg: resForConnect ? "successfullyConnected" : "failedConnected",
        success: resForConnect,
      });

      if (!resForConnect) {
        this.peripheral = null;
        this.removeAllMainListeners([
          ipc_Main.SEND_OR_ON.COMMUNICATION.GETFILES,
          ipc_Main.SEND_OR_ON.EXE.DELETE,
          ipc_Main.SEND_OR_ON.EXE.FILES,
          ipc_Main.SEND_OR_ON.BLE.DISCONNECTED,
        ]);
        return;
      }

      this.noble.stopScanning();

      resForConnect &&
        (await this.discoverBleServices()) &&
        (await this.discoverBleCharacteristics()) &&
        (await this.bleSubscribe(event));
    } catch (error) {
      event.reply(ipc_Main.RETURN.BLE.CONNECTION, {
        bleType: this._type,
        msg: "failedConnected",
        success: false,
      });

      if (this.peripheral) {
        this.peripheral.disconnect();
      }
    }
  }

  /**
   * 连接到设备
   */
  connectBle(event) {
    return new Promise((resolve, reject) => {
      this.peripheral.connect((error) => {
        if (error) {
          console.log("连接到设备失败", error);
          reject(false);
        }
        // 断开连接监听
        this.disconnectListen(event);

        resolve(true);
      });
    });
  }

  /**
   * 监听断开连接指令
   * */
  disconnected(eventName) {
    this.ipcHandle(
      eventName,
      () => this.peripheral && this.peripheral.disconnect()
    );
  }

  /**
   * peripheral断开连接监听
   */
  disconnectListen(event) {
    this.peripheral &&
      this.peripheral.once("disconnect", () => {
        event.reply(ipc_Main.RETURN.CONNECTION.CONNECTED, {
          res: false,
          msg: "disconnect",
        });

        this.removeAllMainListeners([
          ipc_Main.SEND_OR_ON.COMMUNICATION.GETFILES,
          ipc_Main.SEND_OR_ON.EXE.DELETE,
          ipc_Main.SEND_OR_ON.EXE.FILES,
          ipc_Main.SEND_OR_ON.BLE.DISCONNECTED,
        ]);

        clearInterval(this.timeOutTimer);
        this.timeOutTimer = null;
        this.peripheral = null;
      });
  }

  /**
   * 发现服务
   */
  discoverBleServices() {
    return new Promise((resolve, reject) => {
      if (!this.peripheral) {
        reject();
      }

      this.peripheral.discoverServices(
        [this.serviceUUID],
        (error, services) => {
          if (error) {
            // console.error('发现服务失败', error);
            reject(error.message);
          }
          this.service = services[0];
          resolve(true);
        }
      );
    });
  }

  /**
   * 发现特征
   */
  discoverBleCharacteristics() {
    return new Promise((resolve, reject) => {
      if (!this.service) {
        reject();
      }

      this.service.discoverCharacteristics(
        [this.characteristicUUID],
        (error, characteristics) => {
          if (error) {
            // console.error('发现特征失败', error);
            reject(error.message);
          }
          this.characteristic = characteristics[0];
          resolve(true);
        }
      );
    });
  }

  /**
   * 发送数据
   */
  bleWrite(data, sign, event, withResponse = true) {
    if (!data || !this.characteristic) return;
    try {
      //修改标识符，根据标识符判断要发送的是文件还是文件名
      this.sign = sign;
      //写入数据
      this.characteristic &&
        this.characteristic.write(Buffer.from(data), withResponse);
      if (sign && sign.includes("Boot_")) {
        this.checkOverTime(event);
      }
    } catch (e) {
      console.error("发送数据失败", e);
      event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, {
        result: false,
        msg: "uploadError",
        errMsg: e,
      });
    }
  }

  /**
   * 检测是否超时
   * @param {*} event
   */
  checkOverTime(event) {
    this.timeOutTimer = setTimeout(() => {
      event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, {
        result: false,
        msg: "uploadTimeout",
      });
      this.clearCache();
    }, 5000);
  }

  /**
   * 清除缓存
   */
  clearCache() {
    if (this.verifyType && this.verifyType.indexOf(SOURCE) === -1) {
      this.sign = null;
    }
    this.chunkBuffer.splice(0, this.chunkBuffer.length);
    clearTimeout(this.checkConnectTimer);
    this.checkConnectTimer = null;
    this.receiveObj = null;
  }

  /**
   * 启用通知
   */
  bleSubscribe(event) {
    const watch = this.throttle(this.watchDevice.bind(this), 100);
    return new Promise((resolve, reject) => {
      if (!this.characteristic) {
        reject();
      }

      let buffer = "";
      const text = new TextDecoder();
      this.characteristic.subscribe((error) => {
        if (error) {
          // console.error('启用通知失败', error);
          this.characteristic.unsubscribe();
          reject(error.message);
        }

        console.log("已启用通知");

        this.characteristic.on("data", (data) => {
          if (!data) {
            return;
          }

          const isBoot = this.sign && this.sign.includes("Boot_");
          if (isBoot || this.sign === signType.EXE.FILES) {
            this.receiveData = [...this.receiveData, ...data];

            //把数据放入处理函数校验是否是完整的一帧并获取数据对象
            this.receiveObj = this.catchData(this.receiveData);
            if (!this.receiveObj) {
              return;
            } else {
              this.receiveData.splice(0, this.receiveData.length);
            }

            //清除超时检测
            this.clearTimer();

            //根据标识符进行校验操作检验数据并返回结果
            const verify = this.verification(this.sign, this.receiveObj, event);

            if (verify) {
              //结果正确进入处理，函数会检测文件数据是否全部发送完毕
              this.processReceivedData(event);
            } else {
              if (isBoot) {
                event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, {
                  result: false,
                  msg: "uploadError",
                });
                this.clearCache();
              } else {
                this.isStopWatch &&
                  this.bleWrite(instructions.stop_watch, null, event);
                this.isStopWatch = false;
                // 重置标识符
                this.sign = null;
              }
            }

            return;
          }

          buffer += text.decode(data);

          // 判断缓冲区中是否存在完整的数据包
          const completePacketIndex = buffer.indexOf("\n");

          if (completePacketIndex !== -1) {
            // 处理完整的数据包
            const completePacket = buffer
              .slice(0, completePacketIndex + 1)
              .trim();
            buffer = buffer.slice(completePacketIndex + 1);

            // 解析JSON字符串为数组格式 [[0,0],[0,0],[0,0],[0,0]]
            let parsedData = null;
            try {
              parsedData = JSON.parse(completePacket);
            } catch (error) {
              console.error("解析设备数据失败:", error, completePacket);
              return;
            }

            // 开启设备数据监控监听
            this.watchDeviceData = this.checkIsDeviceData(parsedData);
            if (this.watchDeviceData) {
              buffer = "";
              let t = setTimeout(() => {
                watch(event);
                clearTimeout(t);
                t = null;
              });
            }
          }
        });

        resolve(true);
      });
    });
  }

  /**
   * 清除所有定时器
   */
  clearTimer() {
    if (!this.timeOutTimer || (this.sign && this.sign.indexOf("Boot_") === -1))
      return;
    clearTimeout(this.timeOutTimer);
    this.timeOutTimer = null;
  }

  /**
   * 监听设备信息
   * @param event
   */
  watchDevice(event) {
    if (!this.watchDeviceData) return;
    const result = this.distinguishDevice(this.watchDeviceData);
    event.reply(ipc_Main.RETURN.DEVICE.WATCH, result);
  }

  /**
   * 处理接收到的数据
   * @param {*} event
   */
  processReceivedData(event) {
    this.processHandle(event);

    const isLast = this.chunkBuffer.length === 0;
    //如果是已经发送了最后一组文件数据，就结束通信，否则继续发送下一组
    if (isLast) {
      //清除缓存
      this.clearCache();

      //检测是那种类型的文件发送完毕
      if (this.verifyType === BOOTBIN) {
        event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, {
          result: true,
          msg: "uploadSuccess",
        });
      }

      if (this.verifyType.includes(SOURCE)) {
        this.sourceFiles.length > 0
          ? this.upload(event)
          : event.reply(ipc_Main.RETURN.COMMUNICATION.SOURCE.CONPLETED, {
              msg: "uploadSuccess",
            });
      }
    } else {
      //继续发送下一组数据
      this.bleWrite(this.chunkBuffer.shift(), signType.BOOT.BIN, event);
    }
  }

  /**
   * 获取渲染进程发过来的bin文件数据准备通信
   * @param {String} eventName
   */
  getBinOrHareWare(eventName) {
    this.ipcMain(eventName, (event, data) => {
      if (data.selectedExe) {
        this.selectedExe = data.selectedExe;
      }

      // 是否需要下载完成后执行程序
      this.isRunAfterUploaded = data.isRun;

      //本身是哭脸的时候，发重置不会断开，正常发送文件
      if (data.verifyType === RESET_FWLIB) {
        this.upload_sources_status = data.verifyType;
        const { binArr } = this.checkFileName(RESET_FWLIB, 0x6f);
        this.bleWrite(binArr, null, event);
        this.checkConnected(event);
        return;
      }
      this.readyToUpload(data, event);
    });
  }

  checkConnected(event) {
    if (this.upload_sources_status === RESET_FWLIB) {
      this.checkConnectTimer = setTimeout(() => {
        this.readyToUpload({ verifyType: SOURCE }, event);
        this.upload_sources_status = null;
      }, 3000);
    }
  }

  readyToUpload(data, event) {
    //处理渲染进程发送过来的通信需要的数据
    const result = verifyBinType.call(
      this,
      {
        ...data,
        selectedExe: this.selectedExe,
      },
      event
    );
    if (Array.isArray(result) && result.length > 0) {
      this.sourceFiles = [...result];
      this.upload(event);
    }
  }

  upload(event) {
    this.uploadingFile = this.sourceFiles.shift();

    this.verifyType = this.uploadingFile.verifyType;

    //根据返回的子文件数据和子文件名进入上传处理
    this.chunkBuffer = this.handleDataOfUpload(this.uploadingFile, 128);

    this.chunkBufferSize = this.chunkBuffer.length;

    if (this.chunkBufferSize > 0) {
      //写入指令，告诉下位机要发送的文件
      this.bleWrite(this.chunkBuffer.shift(), signType.BOOT.BIN, event);
    }
  }

  /**
   * 获取主机有多少个程序或运行程序
   * @param eventName
   */
  getAppExe(eventName) {
    this.ipcMain(eventName, (event, arg) => {
      if (this.sign && this.sign.indexOf("Boot_") !== -1) {
        return;
      }
      switch (arg.type) {
        case "FILE":
          this.bleWrite(instructions.stop_watch, null, event);
          this.isStopWatch = true;
          setTimeout(() => {
            this.bleWrite(instructions.files, signType.EXE.FILES, event);
          }, 500);
          break;
        case "SENSING_UPDATE":
          this.bleWrite(instructions.sensing_update, null, event);
          break;
        case "APP":
          this.bleWrite(
            arg.status === EST_RUN
              ? instructions.app_stop
              : instructions.app_run,
            null,
            event
          );
          break;
        default:
          break;
      }
    });
  }

  /**
   * 判断是否是bin文件通信，bin文件通信需要给渲染进程发送通信进度
   * @param {*} event
   */
  processHandle(event) {
    if (this.verifyType && this.chunkBuffer.length >= 0) {
      const progress = Math.ceil(
        ((this.chunkBufferSize - this.chunkBuffer.length) /
          this.chunkBufferSize) *
          100
      );

      this.verifyType.includes(SOURCE)
        ? event.reply(ipc_Main.RETURN.FILE.NAME, {
            fileName: this.uploadingFile.fileName,
            progress: progress,
          })
        : event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.PROGRESS, progress);
    }
  }

  /**
   * 删除主机上的程序
   * @param {String} eventName
   */
  deleteExe(eventName) {
    this.ipcMain(eventName, (event, data) => {
      const bits = this.getBits(data.verifyType);
      const { binArr } = this.checkFileName(data.fileName, bits);
      this.bleWrite(binArr, null, event);
    });
  }

  //更新传感器
  updateSensing(eventName) {
    this.ipcMain(eventName, (event, dataList) => {
      let sum = 0x5a + 0x97 + 0x98 + 0x08 + 0x32;
      dataList.forEach((el) => (sum += el));
      const list = [
        0x5a,
        0x97,
        0x98,
        0x08,
        0x32,
        ...dataList,
        sum & 0xff,
        0xa5,
      ];
      this.bleWrite(list, null, event);
    });
  }
}

// module.exports = Bluetooth;
// module.exports['default'] = Bluetooth;
export default Bluetooth;
