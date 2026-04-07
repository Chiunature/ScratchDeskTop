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
  NO_RUN_APP,
  RESET_FWLIB,
  BOOTBIN,
} from "../config/json/verifyTypeConfig.json";
import ipc_Main from "../config/json/ipc.json";
import signType from "../config/json/sign.json";
import { instructions, reg, nameList } from "../config/js/instructions.js";

/**
 * 从缓冲区中切出若干完整顶层 JSON 文本（仅按 {...} 括号配对，不要求换行）。
 * 修复：半包残留如 esponse": null} 中多出的 “}” 在 braceCount 已为 0 时不再执行减一，避免错位与把垃圾拼成“整包”。
 * @param {string} buffer
 * @returns {{ chunks: string[], rest: string }} chunks 为可 JSON.parse 的字符串片段（仍需 try）；rest 为未处理完的尾部
 */
function splitConcatenatedJsonObjects(buffer) {
  const chunks = [];
  let braceCount = 0;
  let startIndex = -1;
  let lastCompleteEnd = 0;

  for (let i = 0; i < buffer.length; i++) {
    const c = buffer[i];
    if (c === "{") {
      if (braceCount === 0) {
        startIndex = i;
      }
      braceCount++;
    } else if (c === "}") {
      if (braceCount > 0) {
        braceCount--;
        if (braceCount === 0 && startIndex !== -1) {
          chunks.push(buffer.substring(startIndex, i + 1));
          lastCompleteEnd = i + 1;
          startIndex = -1;
        }
      }
    }
  }

  let rest;
  if (braceCount > 0 && startIndex !== -1) {
    rest = buffer.substring(startIndex);
  } else {
    rest = buffer.substring(lastCompleteEnd);
    if (rest.length > 0) {
      const fb = rest.indexOf("{");
      if (fb > 0) {
        rest = rest.substring(fb);
      } else if (fb === -1) {
        rest = "";
      }
    }
  }
  return { chunks, rest };
}

/** 文件传输协议中与下位机约定的 Response 取值 */
const FILE_TRANSFER_RESPONSE_VALUES = [
  "rec_ready",
  "rec_done",
  "chk_error",
  "timeout",
];

/**
 * 取下位机协议应答字符串（字段名 Response）。
 * Response 为 null/空时不视为应答（与监控包 {"Response":null} 区分）。
 * @param {Object} parsedData
 * @returns {string|null}
 */
function getDeviceProtocolResponse(parsedData) {
  if (!parsedData || typeof parsedData !== "object") {
    return null;
  }
  const r = parsedData.Response;
  if (r !== undefined && r !== null && r !== "") {
    return String(r);
  }
  return null;
}

/**
 * 用户程序是否在设备上运行：仅字段 Status（stop / run）。
 * 与 scratch-gui 中 verifyTypeConfig.EST_RUN（"run"）一致。
 * @param {Object} parsedData
 * @param {{ deviceStatus: ?string }} sp Serialport 实例
 */
function applyProgramStatusFromJson(parsedData, sp) {
  if (!parsedData || typeof parsedData !== "object") {
    return;
  }
  const raw = parsedData.Status;
  if (raw === undefined || raw === null) {
    return;
  }
  const s = String(raw).trim().toLowerCase();
  if (s === "run" || s === "stop") {
    sp.deviceStatus = s;
  }
}

export class Serialport extends Common {
  constructor(...args) {
    super(...args);
    this._type = "serialport";
    // 用环境变量控制调试日志，避免生产环境串口高频数据刷屏/影响性能
    this._debug = !!process?.env?.EST_LINK_DEBUG;
    this.port = null;
    this.chunkBuffer = [];
    this.chunkBufferSize = 0;
    this.sign = null;
    this.timeOutTimer = null;
    this.checkConnectTimer = null;
    this.verifyType = null;
    this.receiveObj = null;
    this.watchDeviceData = null;
    /** 下位机用户程序是否在跑：来自 JSON 的 Status（run/stop），经 applyProgramStatusFromJson 写入 */
    this.deviceStatus = null;
    this.selectedExe = null;
    this.sourceFiles = [];
    this.receiveData = [];
    this.currentPort = null;
    // 文件传输状态标志，用于避免数据竞争
    this.isWaitingRecReady = false; // 是否正在等待 rec_ready
    this.isWaitingTransferResult = false; // 是否正在等待传输结果
    // 缓存上一次的监控数据JSON字符串，用于去重（避免重复处理相同数据）
    this.lastDeviceDataJson = null;
  }

  dlog(...args) {
    if (this._debug) console.log(...args);
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
      // 断开连接时清空缓存的监控数据和重置标志位
      this.lastDeviceDataJson = null;
      this.isWaitingRecReady = false;
      this.isWaitingTransferResult = false;
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
      //修改标识符，根据标识符判断要发送的是什么类型的数据
      this.sign = sign;
      //写入数据（兼容 Array/Buffer/string）
      const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
      this.port.write(buf, (err) => {
        if (!err) return;
        // 注意：port.write 的错误是异步回调，try/catch 捕获不到
        console.error("串口写入失败:", err?.message || err);
      });
    } catch (e) {
      console.error("串口写入异常:", e?.message || e);
    }
  }

  /**
   * 检测是否超时
   * @param {*} event
   * @deprecated 不再使用 - Python文件上传使用新协议，不再需要此超时检测
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
    if (!this.timeOutTimer) return;
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
    this.deviceStatus = null; // 重置设备状态
    clearTimeout(this.checkConnectTimer);
    this.checkConnectTimer = null;
    this.receiveObj = null;
    this.sign = null;
    // 确保文件传输标志位被重置
    this.isWaitingRecReady = false;
    this.isWaitingTransferResult = false;
  }

  /**
   * 监听设备信息
   * @param event
   */
  watchDevice(event) {
    const result = this.watchDeviceData
      ? this.distinguishDevice(this.watchDeviceData)
      : { deviceList: [] };
    if (this.deviceStatus !== null && this.deviceStatus !== undefined) {
      result.deviceStatus = this.deviceStatus;
    }
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
    let bufferWarningCount = 0; // 记录 buffer 警告次数
    let lastBufferLength = 0; // 上次 buffer 长度
    let bufferGrowthCount = 0; // buffer 持续增长的次数

    this.port.on("data", (data) => {
      if (!data) {
        return;
      }
      if (this.sign === signType.EXE.FILES) {
        this.receiveData = [...this.receiveData, ...data];

        //把数据放入处理函数校验是否是完整的一帧并获取数据对象
        this.receiveObj = this.catchData(this.receiveData);
        if (!this.receiveObj) {
          return;
        } else {
          this.receiveData.splice(0, this.receiveData.length);
        }

        //根据标识符进行校验操作检验数据并返回结果
        const verify = this.verification(this.sign, this.receiveObj, event);

        // verification 方法会处理文件列表的解析和返回
        // 重置标识符
        this.sign = null;

        return;
      }

      // 文件传输阶段（rec_ready/rec_done/chk_error/timeout）由专门的监听器处理
      // 这里直接跳过，避免重复 JSON.parse + 日志刷屏 + 数据竞争
      // 重要：在添加数据到 buffer 之前就检查，避免文件传输期间 buffer 无限增长
      if (this.isWaitingRecReady || this.isWaitingTransferResult) {
        return;
      }

      //收到数据后，将数据拼接到buffer中
      buffer += text.decode(data);

      // 检测 buffer 是否持续增长（可能是数据解析问题）
      if (buffer.length > lastBufferLength) {
        bufferGrowthCount++;
        lastBufferLength = buffer.length;
      } else {
        bufferGrowthCount = 0;
        lastBufferLength = buffer.length;
      }

      // 如果 buffer 持续增长超过 100 次，可能存在问题
      if (bufferGrowthCount > 100) {
        console.warn(
          "⚠️ handleRead: buffer 持续增长异常，可能存在数据解析问题",
          {
            bufferLength: buffer.length,
            growthCount: bufferGrowthCount,
            bufferPreview: buffer.substring(0, 300) + "...",
            bufferEnd: "..." + buffer.substring(buffer.length - 100),
          }
        );
        bufferGrowthCount = 0;
      }

      // 防止异常数据导致 buffer 无限增长
      // 正常情况下，buffer 只会暂存未完成的 JSON 片段，不会超过几KB
      // 如果超过 64KB，说明出现了异常情况
      if (buffer.length > 64 * 1024) {
        bufferWarningCount++;
        console.warn(
          `⚠️ handleRead: buffer 过大，已重置（第 ${bufferWarningCount} 次，可能收到异常数据流）`,
          {
            bufferLength: buffer.length,
            isWaitingRecReady: this.isWaitingRecReady,
            isWaitingTransferResult: this.isWaitingTransferResult,
            sign: this.sign,
            warningCount: bufferWarningCount,
            bufferPreview: buffer.substring(0, 300) + "...",
            bufferEnd: "..." + buffer.substring(buffer.length - 300),
          }
        );
        buffer = "";
        bufferGrowthCount = 0;
        lastBufferLength = 0;
        return;
      }

      const { chunks: jsonObjects, rest: nextBuf } =
        splitConcatenatedJsonObjects(buffer);
      buffer = nextBuf;

      // rest 仍很大且以非 { 开头时，再次去掉前缀垃圾（半截包后的尾巴）
      if (buffer.length > 10 * 1024) {
        const firstBrace = buffer.indexOf("{");
        if (firstBrace > 0) {
          const discarded = buffer.substring(0, firstBrace);
          console.warn(
            `⚠️ handleRead: 检测到 buffer 中有大量无效数据，已清理 ${firstBrace} 字节`,
            {
              discardedPreview: discarded.substring(0, 200) + "...",
              bufferLength: buffer.length,
              newBufferLength: buffer.length - firstBrace,
            }
          );
          buffer = buffer.substring(firstBrace);
        } else if (firstBrace === -1) {
          console.warn(
            `⚠️ handleRead: buffer 中找不到有效的 JSON 起始符号，已清空`,
            {
              bufferLength: buffer.length,
              bufferPreview: buffer.substring(0, 200) + "...",
            }
          );
          buffer = "";
        }
      }

      for (const jsonStr of jsonObjects) {
        const trimmedStr = jsonStr.trim();
        if (trimmedStr.length === 0) {
          continue;
        }

        // 数据去重优化：如果和上一次的JSON字符串完全相同，跳过解析和处理
        // 设备监控数据大概100ms返回一次，相同数据不需要重复处理
        if (this.lastDeviceDataJson === trimmedStr) {
          this.dlog("📋 跳过重复数据（与上次完全相同）");
          continue;
        }

        let parsedData = null;

        try {
          parsedData = JSON.parse(trimmedStr);
          this.dlog("解析成功 - parsedData:", parsedData);
        } catch (error) {
          // JSON解析失败，可能是数据格式错误
          console.warn("⚠️ JSON解析失败（格式错误）:", {
            错误: error.message,
            数据: trimmedStr.substring(0, 100),
            数据长度: trimmedStr.length,
          });
          continue; // 跳过这个JSON对象，继续处理下一个
        }

        // 如果解析成功且是设备监控数据，缓存JSON字符串用于下次比较
        if (
          parsedData &&
          Array.isArray(parsedData.Data) &&
          parsedData.Data.length
        ) {
          this.lastDeviceDataJson = trimmedStr;
        }

        // 处理解析成功的 JSON 数据
        processJsonData(parsedData);
      }
    });

    // 处理 JSON 数据的辅助函数（解决粘包后的数据处理）
    const processJsonData = (parsedData) => {
      applyProgramStatusFromJson(parsedData, this);

      // 设备监控包：{ Status, Data, Response }

      const protocolRes = getDeviceProtocolResponse(parsedData);
      if (
        parsedData &&
        typeof parsedData === "object" &&
        protocolRes &&
        FILE_TRANSFER_RESPONSE_VALUES.includes(protocolRes)
      ) {
        if (this.isWaitingRecReady || this.isWaitingTransferResult) {
          this.dlog(
            `📋 handleRead: 检测到文件传输响应 ${protocolRes}，交由专门的处理函数处理（避免数据竞争）`
          );
          return;
        }
        console.warn(
          `⚠️ handleRead: 收到文件传输响应 ${protocolRes}，但没有在等待传输响应`
        );
        return;
      }

      const hasDataPayload =
        parsedData && Array.isArray(parsedData.Data);
      const hasStatusPayload =
        parsedData && parsedData.Status !== undefined;

      let scheduledWatch = false;

      if (hasDataPayload) {
        const deviceData = this.checkIsDeviceData(parsedData);
        if (deviceData) {
          this.watchDeviceData = deviceData;

          if (!isFirstDataReceived) {
            console.log(`\n✓✓✓ 设备真正连接成功！正在接收设备监控数据... ✓✓✓`);
            console.log(`监控数据示例:`, parsedData);
            console.log(`===========================================\n`);
            isFirstDataReceived = true;
          }

          scheduledWatch = true;
          let t = setTimeout(() => {
            watch(event);
            clearTimeout(t);
            t = null;
          });
        } else {
          console.warn(
            `⚠️ handleRead: 设备监控 Data 格式不正确:`,
            parsedData.Data
          );
        }
      }

      if (
        !scheduledWatch &&
        hasStatusPayload &&
        (this.watchDeviceData ||
          (this.deviceStatus !== null && this.deviceStatus !== undefined))
      ) {
        let t2 = setTimeout(() => {
          watch(event);
          clearTimeout(t2);
          t2 = null;
        });
      }

      if (!hasDataPayload && !hasStatusPayload) {
        console.warn(`⚠️ handleRead: 收到未知格式的数据:`, parsedData);
      }
    };
    // 注意：checkConnected 用于 RESET_FWLIB 场景，如果不再使用固件重置功能可以移除
    // this.checkConnected(event);
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
    console.log("🔧 正在注册 getAppExe 监听器，事件名:", eventName);
    this.ipcMain(eventName, (event, arg) => {
      console.log("🔔 getAppExe 收到 IPC 消息:", {
        eventName,
        arg,
        sign: this.sign,
      });

      switch (arg.type) {
        case "FILE":
          this.writeData(instructions.files, signType.EXE.FILES, event);
          break;
        case "SENSING_UPDATE":
          this.writeData(instructions.sensing_update, null, event);
          break;
        case "APP":
          // 约定：当 status === EST_RUN 时代表当前正在运行，需要下发"停止"指令
          // 停止命令按需求严格下发：ser.write(b"##STOP##\n")
          if (arg.status === EST_RUN) {
            console.log("写入停止指令");
            this.writeData("##STOP##\n", null, event);

            // 更新本地保存的 deviceStatus
            this.deviceStatus = "stop";

            // 发送停止指令后，立即通知渲染进程更新设备状态
            // deviceStatus 字段代替了原来的 NewAiState 字段
            event.reply(ipc_Main.RETURN.DEVICE.WATCH, {
              deviceList: [],
              version: null,
              MAC: null,
              deviceStatus: "stop", // 程序没有在设备上运行
            });
            console.log("✓ 已发送停止指令并更新设备状态");
          } else {
            console.log("写入运行指令");
            this.writeData(instructions.app_run, null, event);

            // 更新本地保存的 deviceStatus
            this.deviceStatus = "run";

            // 发送运行指令后，立即通知渲染进程更新设备状态
            // deviceStatus 字段代替了原来的 NewAiState 字段
            event.reply(ipc_Main.RETURN.DEVICE.WATCH, {
              deviceList: [],
              version: null,
              MAC: null,
              deviceStatus: "run", // 程序正在设备上运行
            });
            console.log("✓ 已发送运行指令并更新设备状态");
          }
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

      // 等待设备回复 rec_ready（10秒超时）
      console.log("等待设备回复 rec_ready");
      const recReadyResult = await this.waitForRecReady(3000);
      console.log("rec_ready回复结果:", recReadyResult);

      if (!recReadyResult) {
        console.error("❌ 未收到设备 rec_ready 回复，可能设备未准备好");
        event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, {
          result: false,
          msg: "recReadyTimeout",
          errMsg: "设备未准备好",
        });
        return;
      }
      console.log("✅ 收到设备 rec_ready 回复，开始传输数据");

      //分块发送数据
      const chunkSize = 256;
      const totalChunks = Math.ceil(data.length / chunkSize); //求分包次数

      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        await this.writeAsync(chunk);

        //计算进度
        const currentBytes = Math.min(i + chunkSize, data.length);
        const progress = Math.ceil((currentBytes / data.length) * 100);
        event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.PROGRESS, progress);

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

      // 等待设备回复传输结果（rec_done, chk_error, timeout）
      console.log("等待设备回复传输结果");
      const transferResult = await this.waitForTransferResult(3000); // 3秒超时
      console.log("transferResult结果:", transferResult);

      // 根据设备回复的结果进行处理
      if (transferResult.status === "success") {
        event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, {
          result: true,
          msg: "uploadSuccess",
          fileName: fileName,
        });
        console.log("✅ 文件传输成功！设备已确认接收完成");
      } else if (transferResult.status === "chk_error") {
        event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, {
          result: false,
          msg: "chkError",
          errMsg: "设备校验失败",
        });
        console.error("❌ 文件传输失败：设备校验错误（chk_error）");
      } else if (transferResult.status === "timeout") {
        event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, {
          result: false,
          msg: "deviceTimeout",
          errMsg: "设备接收超时",
        });
        console.error("❌ 文件传输失败：设备接收超时（timeout）");
      } else {
        // 等待超时（未收到任何回复）
        event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, {
          result: false,
          msg: "uploadTimeout",
          errMsg: "未收到设备回复",
        });
        console.error("❌ 文件传输失败：等待设备回复超时");
      }
    } catch (err) {
      console.log("传输出错:", err);
      event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, {
        result: false,
        msg: "uploadError",
        errMsg: err.message,
      });
    } finally {
      // 确保清理标志位，避免影响后续传输
      this.isWaitingTransferResult = false;
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
   * 等待设备回复 rec_ready（握手阶段）
   * @param {number} timeout - 超时时间（毫秒），默认10000ms
   * @returns {Promise<boolean>} 是否收到正确的 rec_ready 回复
   */
  waitForRecReady(timeout = 1000) {
    return new Promise((resolve) => {
      if (!this.port || !this.port.isOpen) {
        console.error("串口未打开，无法等待 rec_ready");
        resolve(false);
        return;
      }

      // 设置标志位，避免 handleRead 处理相关数据
      this.isWaitingRecReady = true;

      let responseReceived = false;
      let buffer = "";
      const text = new TextDecoder();

      // 清理函数
      const cleanup = () => {
        this.isWaitingRecReady = false;
        this.port.removeListener("data", onData);
      };

      // 设置超时定时器
      const timer = setTimeout(() => {
        if (!responseReceived) {
          cleanup();
          console.error(`⏱️ 等待 rec_ready 超时（${timeout}ms）`);
          resolve(false);
        }
      }, timeout);

      // 监听下位机返回的数据
      const onData = (data) => {
        if (responseReceived) return;

        buffer += text.decode(data);
        console.log(`📥 收到数据: ${buffer.trim()}`);

        const trimmedBuffer = buffer.trim();
        if (trimmedBuffer.length === 0) {
          return;
        }
        console.log("RCready trimmedBuffer:", trimmedBuffer);
        try {
          const parsedData = JSON.parse(trimmedBuffer);
          console.log(`📦 解析 JSON 成功:`, parsedData);

          // 检查是否是对象格式
          if (
            !parsedData ||
            typeof parsedData !== "object" ||
            Array.isArray(parsedData)
          ) {
            // 如果是数组格式，清空buffer并忽略
            buffer = "";
            return;
          }

          const pr = getDeviceProtocolResponse(parsedData);
          if (pr === "rec_ready") {
            responseReceived = true;
            clearTimeout(timer);
            cleanup();
            console.log("✅ 验证成功：收到 rec_ready 回复");
            resolve(true);
          } else if (parsedData.Data != null) {
            buffer = "";
          } else {
            buffer = "";
          }
        } catch (error) {
          console.log(`⚠️ 不是有效的 JSON 数据: ${trimmedBuffer}`);
          buffer = "";
        }
      };

      this.port.on("data", onData);
    });
  }

  /**
   * 等待文件传输完成后的设备回复（传输结果阶段）
   * @param {number} timeout - 超时时间（毫秒），默认10000ms
   * @returns {Promise<{status: string, msg?: string}>}
   *   - status: "success" | "chk_error" | "timeout" | "wait_timeout"
   *   - msg: 设备返回的原始消息（如果有）
   */
  waitForTransferResult(timeout = 3000) {
    return new Promise((resolve) => {
      if (!this.port || !this.port.isOpen) {
        console.error("串口未打开，无法等待传输结果");
        resolve({ status: "wait_timeout" });
        return;
      }

      // 设置标志位，避免 handleRead 处理相关数据
      this.isWaitingTransferResult = true;

      let responseReceived = false;
      let buffer = "";
      const text = new TextDecoder();

      // 清理函数
      const cleanup = () => {
        this.isWaitingTransferResult = false;
        this.port.removeListener("data", onData);
        if (timer) clearTimeout(timer);
      };

      // 设置超时定时器
      let timer = setTimeout(() => {
        if (!responseReceived) {
          cleanup();
          console.error(`⏱️ 等待传输结果超时（${timeout}ms）`);
          resolve({ status: "wait_timeout" });
        }
      }, timeout);

      // 监听下位机返回的数据
      // 由于主机返回数据是一次性传过来的，所以接收数据后可以一次性解析JSON字符串
      const onData = (data) => {
        if (responseReceived) return; // 已经收到回复，忽略后续数据

        buffer += text.decode(data);
        console.log(`📥 收到传输结果数据: ${buffer.trim()}`);

        // 尝试解析整个buffer（去除首尾空白字符）
        const trimmedBuffer = buffer.trim();
        if (trimmedBuffer.length === 0) {
          return; // 如果buffer为空，继续等待
        }
        console.log("TransferResult trimmedBuffer:", trimmedBuffer);
        try {
          // 直接解析JSON字符串（数据是一次性传过来的）
          const parsedData = JSON.parse(trimmedBuffer);
          console.log(`📦 解析传输结果 JSON 成功:`, parsedData);

          // 检查是否是对象格式
          if (
            !parsedData ||
            typeof parsedData !== "object" ||
            Array.isArray(parsedData)
          ) {
            // 如果是数组格式，清空buffer并忽略
            buffer = "";
            return;
          }

          const responseType = getDeviceProtocolResponse(parsedData);
          if (responseType) {
            if (responseType === "rec_done") {
              responseReceived = true;
              clearTimeout(timer);
              cleanup();
              console.log("✅ 文件传输成功：设备确认接收完成（rec_done）");
              resolve({ status: "success", msg: responseType });
              return;
            } else if (responseType === "chk_error") {
              responseReceived = true;
              clearTimeout(timer);
              cleanup();
              console.error("❌ 文件传输失败：设备校验错误（chk_error）");
              resolve({ status: "chk_error", msg: responseType });
              return;
            } else if (responseType === "timeout") {
              responseReceived = true;
              clearTimeout(timer);
              cleanup();
              console.error("❌ 文件传输失败：设备接收超时（timeout）");
              resolve({ status: "timeout", msg: responseType });
              return;
            } else {
              console.log(
                `⚠️ 收到未知的响应类型: ${responseType}，继续等待...`
              );
              buffer = "";
            }
          } else if (parsedData.Data != null) {
            buffer = "";
          } else {
            console.log(
              `⚠️ JSON 格式正确，但缺少有效的 Response 或监控 Data:`,
              parsedData
            );
            buffer = "";
          }
        } catch (error) {
          // JSON解析失败，可能是数据不完整或格式错误
          console.log(`⚠️ 不是有效的 JSON 数据: ${trimmedBuffer}`);
          // 清空buffer，继续等待下一个数据包
          buffer = "";
        }
      };

      this.port.on("data", onData);
    });
  }

  /**
   * 等待下位机响应（旧方法，保留兼容性）
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
