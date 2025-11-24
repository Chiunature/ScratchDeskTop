/*
 * @Description: New features
 * @Author: jiang
 * @Date: 2023-06-07 08:58:20
 * @LastEditors: jiang
 * @LastEditTime: 2023-06-15 15:30:17
 * @params: {
 *  port: 串口
 *  chunkBuffer: bin文件数据缓存
 *  chunkBufferSize: bin文件数据缓存大小
 *  sign: 步骤标识
 *  timeOutTimer: 超时定时器
 *  checkConnectTimer: 检测连接定时器
 *  verifyType: 判断是发固件文件还是bin数据
 *  receiveObj: 接收到的数据缓存
 *  watchDeviceData: 监听设备数据
 *  selectedExe: 选择exe文件
 *  sourceFiles: 要下载的资源文件组
 *  uploadingFile: 正在上传的文件
 * }
 */
import Common from "./common.js";
import { verifyBinType } from "../config/js/verify.js";
import {
  SOURCE,
  EST_RUN,
  RESET_FWLIB,
  BOOTBIN,
} from "../config/json/verifyTypeConfig.json";
import ipc_Main from "../config/json/ipc.json";
import signType from "../config/json/sign.json";
import { instructions, reg, nameList } from "../config/js/instructions.js";

export class Serialport extends Common {
  constructor(...args) {
    super(...args);
    this._type = "serialport";
    this.port = null;
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
    this.currentPort = null;
  }

  /**
   * 获取串口列表
   */
  getList() {
    this.ipcMain(ipc_Main.SEND_OR_ON.CONNECTION.GETLIST, async (event) => {
      console.log("\n=== 开始扫描串口设备 ===");
      const result = await this.serialport.SerialPort.list();
      console.log(`发现 ${result.length} 个串口设备`);
      const newArr = result.filter((el) =>
        nameList.find(
          (name) => el.friendlyName && el.friendlyName.includes(name)
        )
      );
      console.log(`筛选后符合条件的设备: ${newArr.length} 个`);
      newArr.forEach((el, index) => {
        console.log(`  [${index + 1}] ${el.friendlyName || el.path}`);
      });

      for (const item of newArr) {
        console.log(`\n尝试连接设备: ${item.friendlyName || item.path}`);
        const success = await this.linkToSerial(item, event);

        if (success) {
          console.log(`✓ 设备连接成功！路径: ${item.path}\n`);
          event.reply(ipc_Main.RETURN.CONNECTION.GETLIST, {
            currentPort: item,
          });
          break;
        } else {
          console.log(`✗ 连接失败，继续尝试下一个设备...`);
        }
      }
    });
  }

  /**
   * 断开连接
   * @param {String} eventName
   */
  disconnectSerial(eventName) {
    this.ipcMain(eventName, () => {
      if (this.port && this.port.isOpen) {
        this.port.close();
      }
    });
  }

  /**
   * 连接串口
   * @param {Object} serial
   * @param {*} event
   */
  async linkToSerial(serial, event) {
    try {
      console.log(`  正在创建串口连接 (波特率: 115200)...`);
      this.port = new this.serialport.SerialPort({
        path: serial.path,
        baudRate: 115200,
        autoOpen: false,
      });
      const open = await this.OpenPort();
      if (open) {
        console.log(`  串口已打开，开始监听数据...`);
        event.reply(ipc_Main.RETURN.CONNECTION.CONNECTED, {
          connectSuccess: true,
          msg: "successfullyConnected",
          serial,
          type: this._type,
        });

        //开启断开连接监听
        this.disconnectSerial(ipc_Main.SEND_OR_ON.CONNECTION.DISCONNECTED);
        //开启读取数据监听
        this.handleRead(event);
        //开启串口关闭监听
        this.listenPortClosed(event);
        //开启获取bin文件或固件下载监听
        this.getBinOrHareWare(ipc_Main.SEND_OR_ON.COMMUNICATION.GETFILES);
        //开启删除程序监听
        this.deleteExe(ipc_Main.SEND_OR_ON.EXE.DELETE);
        //开启获取主机文件监听
        this.getAppExe(ipc_Main.SEND_OR_ON.EXE.FILES);
        //传感器更新
        this.updateSensing(ipc_Main.SEND_OR_ON.SENSING_UPDATE);
        //新的python文件上传监听
        console.log("═══════════════════════════════════════");
        console.log("🔵 [linkToSerial] 准备注册 Python 文件上传监听器...");
        console.log(
          "🔵 [linkToSerial] uploadPythonFile 方法存在:",
          typeof this.uploadPythonFile === "function"
        );
        console.log(
          "🔵 [linkToSerial] uploadPythonFileWithNewProtocol 方法存在:",
          typeof this.uploadPythonFileWithNewProtocol === "function"
        );
        console.log("🔵 [linkToSerial] 即将调用 this.uploadPythonFile()");
        this.uploadPythonFile();
        console.log("🔵 [linkToSerial] this.uploadPythonFile() 调用完成");
        console.log("═══════════════════════════════════════");
      } else {
        console.log(`  串口打开失败`);
        this.port = null;
      }
      return open;
    } catch (error) {
      console.log(`  连接出错: ${error.message}`);
      return false;
    }
  }

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
      this.writeData(list, null, event);
    });
  }

  /**
   * 串口打开
   */
  OpenPort() {
    return new Promise((resolve) => {
      this.port.open((err) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
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
        this.writeData(binArr, null, event);
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
    this.chunkBuffer = this.handleDataOfUpload(this.uploadingFile);

    this.chunkBufferSize = this.chunkBuffer.length;

    if (this.chunkBufferSize > 0) {
      //写入指令，告诉下位机要发送的文件
      this.writeData(this.chunkBuffer.shift(), signType.BOOT.BIN, event);
    }
  }

  /**
   * 侦听串口关闭
   * @param {*} event
   */
  listenPortClosed(event) {
    this.port.on("close", () => {
      console.log("\n=== 串口已关闭，设备已断开连接 ===\n");
      this.removeAllMainListeners([
        ipc_Main.SEND_OR_ON.COMMUNICATION.GETFILES,
        ipc_Main.SEND_OR_ON.EXE.DELETE,
        ipc_Main.SEND_OR_ON.EXE.FILES,
        ipc_Main.SEND_OR_ON.RESTART,
        ipc_Main.SEND_OR_ON.SENSING_UPDATE,
        ipc_Main.SEND_OR_ON.CONNECTION.DISCONNECTED,
      ]);
      this.clearCache();
      event.reply(ipc_Main.RETURN.CONNECTION.CONNECTED, {
        connectSuccess: false,
        msg: "disconnect",
      });
    });
  }

  /**
   * 写入数据
   * @param {Array} data
   * @param {String} sign
   * @param {*} event
   * @returns
   */
  writeData(data, sign, event) {
    if (!this.port || !data) {
      return;
    }
    try {
      //修改标识符，根据标识符判断要发送的是文件还是文件名
      this.sign = sign;
      //写入数据
      this.port.write(Buffer.from(data));

      if (sign && sign.includes("Boot_")) {
        this.checkOverTime(event);
      }
    } catch (e) {
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
   * 清除所有定时器
   */
  clearTimer() {
    if (!this.timeOutTimer || (this.sign && this.sign.indexOf("Boot_") === -1))
      return;
    clearTimeout(this.timeOutTimer);
    this.timeOutTimer = null;
  }

  /**
   * 清除缓存
   */
  clearCache() {
    if (this.port && this.port.isOpen) {
      this.port.flush();
    }
    this.chunkBuffer.splice(0, this.chunkBuffer.length);
    this.receiveData.splice(0, this.receiveData.length);
    clearTimeout(this.checkConnectTimer);
    this.checkConnectTimer = null;
    this.receiveObj = null;
    this.sign = null;
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
   * debug数据
   * @param receiveData
   * @param {*} event
   * @returns
   */
  checkIsDebug(receiveData, event) {
    const text = new TextDecoder();
    const res = text.decode(receiveData);
    if (reg.deBug.test(res)) {
      event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, {
        result: true,
        errMsg: res,
      });
    }
  }

  /* checkIsCalibration(receiveData, event) {
        const text = new TextDecoder();
        const res = text.decode(receiveData.slice(4, -2));
        const num = res.replace(/[^0-9]/ig, '');

        if (num.length > 2) {
            return
        }

        event.reply(ipc_Main.PROGRESSBAR, num);

        if (parseInt(num) === 99) {
            this.sign = null;
        }
    } */

  /**
   * FlowMode读取串口数据
   * @param {*} event
   * @returns
   */
  handleRead(event) {
    if (!this.port) return;
    let buffer = "";
    const text = new TextDecoder();
    const watch = this.throttle(this.watchDevice.bind(this), 100);
    let isFirstDataReceived = false; // 标记是否已接收到第一次监控数据

    this.port.on("data", (data) => {
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
        const completePacket = buffer.slice(0, completePacketIndex + 1);
        buffer = buffer.slice(completePacketIndex + 1);

        // 开启设备数据监控监听
        this.watchDeviceData = this.checkIsDeviceData(
          completePacket,
          reg.devicesData
        );
        if (this.watchDeviceData) {
          // 第一次接收到设备监控数据时打印日志
          if (!isFirstDataReceived) {
            console.log(`\n✓✓✓ 设备真正连接成功！正在接收设备监控数据... ✓✓✓`);
            console.log(`监控数据示例: ${completePacket.trim()}`);
            console.log(`===========================================\n`);
            isFirstDataReceived = true;
          }

          buffer = "";
          let t = setTimeout(() => {
            watch(event);
            clearTimeout(t);
            t = null;
          });
        }
      }
    });
    //本身不是哭脸的时候，发重置会断开，连上后发送文件
    this.checkConnected(event);
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
      if (this.verifyType.includes(BOOTBIN)) {
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
      //发送下一组数据
      this.writeData(this.chunkBuffer.shift(), signType.BOOT.BIN, event);
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
          this.writeData(instructions.files, signType.EXE.FILES, event);
          break;
        case "SENSING_UPDATE":
          this.writeData(instructions.sensing_update, null, event);
          break;
        case "APP":
          this.writeData(
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
   * 删除主机上的程序
   * @param {String} eventName
   */
  deleteExe(eventName) {
    this.ipcMain(eventName, (event, data) => {
      const bits = this.getBits(data.verifyType);
      const { binArr } = this.checkFileName(data.fileName, bits);
      this.writeData(binArr, null, event);
    });
  }

  /**
   * 重启主机
   * @param {String} eventName
   */
  /* restartMain(eventName) {
        this.ipcMain(eventName, (event, data) => {
            this.writeData(instructions.restart, null, event);
        });
    } */

  /**
   * 与主机交互
   * @param {String} eventName
   */
  interactive(eventName) {
    this.ipcMain(eventName, (event, obj) => {
      switch (obj.blockName) {
        case "FieldMatrix":
          this.matrixSend(event, obj);
          break;
        default:
          break;
      }
    });
  }

  matrixSend(event, obj) {
    // 先清屏
    obj.type === "change" &&
      this.writeData(instructions.matrix.clear, null, event);
    const list = this.matrixChange(obj);
    this.writeData(list, null, event);
  }
  /**
   * 使用新协议上传Python文件
   * @param {Object} fileData - { fileName: string, fileData: Buffer/Uint8Array }
   * @param {*} event - IPC事件对象
   */
  async uploadPythonFileWithNewProtocol(fileData, event) {
    //如果串口对象没有或者串口通信未打开则，主进程发给渲染进程错误信息
    if (!this.port || !this.port.isOpen) {
      event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, {
        result: false,
        msg: "portNotOpen",
      });
      return;
    }
    try {
      // 从传入的文件数据中提取文件内容和文件名
      const data = fileData.fileData; //Buffer或Uint8Array 格式的二进制数据
      const fileName = fileData.fileName; //文件名

      //计算校验和（所有字节累加，取低16位）
      let checksum = 0;
      for (let i = 0; i < data.length; i++) {
        checksum += data[i]; //累加每个字节的值
      }
      checksum = checksum & 0xffff; //取低16位作为校验和
      console.log(`开始传输文件：${fileName}，文件大小：${data.length}字节`);

      //发送开始标记
      await this.writeAsync(Buffer.from("##START##\n"));
      console.log("发送开始标记 ##START##");

      //分块发送数据
      const chunkSize = 256;
      const totalChunks = Math.ceil(data.length / chunkSize); //求分包次数

      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        await this.writeAsync(chunk);

        //计算进度
        const progress = Math.ceil(((i + chunkSize) / data.length) * 100);
        event.reply(
          ipc_Main.RETURN.COMMUNICATION.BIN.PROGRESS,
          Math.min(progress, 100)
        );

        // 5ms延时，避免接收端缓冲区溢出
        await this.sleep(5);

        if ((i / chunkSize) % 10 === 0) {
          // 每10块打印一次
          console.log(`进度: ${Math.min(progress, 100)}%`);
        }
      }

      //根据不同点击事件发送不同结束标记和校验和
      // 如果 isRun 为 true，使用 ##END##RUN#SUM= 格式
      // 如果 isRun 为 false，使用 ##END##SUM= 格式
      const isRun = fileData.isRun || false;
      const endMarker = isRun
        ? Buffer.from(`##END##RUN#SUM=${checksum}\n`)
        : Buffer.from(`##END##SUM=${checksum}\n`);
      await this.writeAsync(endMarker);
      console.log(
        `发送结束标记 ${isRun ? "##END##RUN#SUM=" : "##END##SUM="}${checksum}`
      );

      //等待下位机响应（可选，5秒超时）
      const success = await this.waitForResponse(5000);

      if (success) {
        event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, {
          result: true,
          msg: "uploadSuccess",
          fileName: fileName,
        });
        console.log("文件传输成功！");
      } else {
        event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, {
          result: false,
          msg: "uploadTimeout",
        });
        console.log("文件传输超时");
      }
    } catch (err) {
      console.log("传输出错:", err);
      event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, {
        result: false,
        msg: "uploadError",
        errMsg: err.message,
      });
    }
  }
  /**
   * 异步写入数据到串口
   * @param {Buffer} data - 要写入的数据
   * @returns {Promise}
   */
  writeAsync(data) {
    return new Promise((resolve, reject) => {
      if (!this.port || !this.port.isOpen) {
        reject(new Error("串口未打开"));
        return;
      }

      this.port.write(data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * 延时函数
   * @param {number} ms - 延时毫秒数
   * @returns {Promise}
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 等待下位机响应
   * @param {number} timeout - 超时时间（毫秒）
   * @returns {Promise<boolean>}
   */
  waitForResponse(timeout) {
    return new Promise((resolve) => {
      let responseReceived = false;

      //设置超时定时器
      const timer = setTimeout(() => {
        if (!responseReceived) {
          this.port.removeListener("data", onData);
          resolve(false);
        }
      }, timeout);

      //监听下位机返回的确认数据
      const onData = (data) => {
        const text = data.toString();
        // 检查是否包含成功标记（可根据实际协议调整）
        if (text.includes("OK") || text.includes("SUCCESS")) {
          responseReceived = true;
          clearTimeout(timer);
          this.port.removeListener("data", onData);
          resolve(true);
        }
      };

      this.port.on("data", onData);
    });
  }

  /**
   * 监听Python文件上传请求
   */
  // uploadPythonFile() {
  //   const self = this; // 保存 this 引用
  //   console.log("注册 Python 文件上传监听器");
  //   this.ipcMain(
  //     ipc_Main.SEND_OR_ON.COMMUNICATION.UPLOAD_PYTHON,
  //     async function(event, data) {
  //       console.log("收到 Python 文件上传请求:", {
  //         fileName: data?.fileName,
  //         fileDataLength: data?.fileData?.length,
  //         hasMethod: !!self.uploadPythonFileWithNewProtocol,
  //       });

  //       // data 格式: { fileName: "test.py", fileData: Buffer/Uint8Array }
  //       // 使用 self 确保 this 上下文正确
  //       if (self.uploadPythonFileWithNewProtocol) {
  //         await self.uploadPythonFileWithNewProtocol(data, event);
  //       } else {
  //         console.error("uploadPythonFileWithNewProtocol 方法不存在");
  //         event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, {
  //           result: false,
  //           msg: "methodNotFound",
  //           errMsg: "uploadPythonFileWithNewProtocol is not a function",
  //         });
  //       }
  //     }
  //   );
  // }
  uploadPythonFile() {
    console.log("🟢 [uploadPythonFile] ========== 方法开始执行 ==========");
    console.log("🟢 [uploadPythonFile] uploadPythonFile() 方法被调用");
    // console.log("this 对象:", this);
    // console.log(
    //   "this.uploadPythonFileWithNewProtocol:",
    //   this.uploadPythonFileWithNewProtocol
    // );
    // console.log(
    //   "typeof this.uploadPythonFileWithNewProtocol:",
    //   typeof this.uploadPythonFileWithNewProtocol
    // );

    // 在注册监听器前检查方法是否存在
    if (typeof this.uploadPythonFileWithNewProtocol !== "function") {
      console.error(
        "❌ uploadPythonFileWithNewProtocol 不是函数，无法注册监听器"
      );
      console.error(
        "当前 this 对象的方法列表:",
        Object.getOwnPropertyNames(Object.getPrototypeOf(this))
      );
      return;
    }

    console.log("✅ 方法检查通过，准备注册 IPC 监听器");
    const eventName = ipc_Main.SEND_OR_ON.COMMUNICATION.UPLOAD_PYTHON;
    console.log("IPC 事件名:", eventName);

    // 检查事件是否已经注册
    const eventList = this.electron.ipcMain.eventNames();
    const alreadyRegistered = eventList.includes(eventName);
    console.log("事件是否已注册:", alreadyRegistered);

    if (alreadyRegistered) {
      console.log(
        "⚠️ 事件已注册，跳过重复注册（这是正常的，因为 ipcMain 会避免重复）"
      );
    }

    this.ipcMain(eventName, async (event, data) => {
      console.log("📥 IPC 回调被触发，收到数据:", {
        fileName: data?.fileName,
        fileDataType: data?.fileData?.constructor?.name,
        fileDataLength: data?.fileData?.length,
      });
      // data 格式: { fileName: "test.py", fileData: Buffer }
      await this.uploadPythonFileWithNewProtocol(data, event);
    });

    console.log("🟢 [uploadPythonFile] ✅ IPC 监听器注册调用完成");
    console.log("🟢 [uploadPythonFile] ========== 方法执行结束 ==========");
  }
}

// module.exports = Serialport
// module.exports['default'] = Serialport;
export default Serialport;
