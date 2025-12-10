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
  SOURCE_SOUNDS,
} from "../config/json/verifyTypeConfig.json";
import ipc_Main from "../config/json/ipc.json";
import signType from "../config/json/sign.json";
import { deviceIdMap } from "../config/js/instructions.js";

export class Common {
  constructor(...args) {
    args.forEach((item) => {
      Object.keys(item).map((key) => {
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
        deviceId: 0,
      };
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
      deviceId: 0,
    };
  }

  /**
   * 主进程handle方式通信
   * @param {String} eventName
   * @param {Function} callback
   */
  ipcHandle(eventName, callback) {
    this.electron.ipcMain.removeHandler(eventName);
    this.electron.ipcMain.handle(eventName, (event, arg) =>
      callback(event, arg)
    );
  }

  /**
   * 主进程通信
   * @param {String} eventName
   * @param {Function} callback
   */
  ipcMain(eventName, callback) {
    const eventList = this.electron.ipcMain.eventNames();

    // 避免重复监听同一个事件
    if (!eventList.includes(eventName)) {
      this.electron.ipcMain.on(eventName, (event, arg) => {
        return callback(event, arg);
      });
    }
  }

  /**
   * 删除主进程的事件监听
   * @param {String} listener
   */
  removeAllMainListeners(listener) {
    const eventList = this.electron.ipcMain.eventNames();
    eventList.forEach((el) => {
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
    list.forEach((el) => (sum += el));
    return {
      binArr: [0x5a, 0x97, 0x98, len, bits, ...list, sum & 0xff, 0xa5],
      crc: sum & 0xff,
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
    item.forEach((el) => (sum += el));
    return {
      binArr: [0x5a, 0x97, 0x98, len, bits, ...item, sum & 0xff, 0xa5],
      crc: sum & 0xff,
    };
  }

  /**
   * 发送数据
   * @param {String} eventName
   * @param {Function} fn
   */
  sendToSerial(eventName, fn) {
    this.ipcMain(eventName, (event, data) => {
      typeof fn === "function" && fn.call(this, event, data);
    });
  }

  /**
   * 侦听编译时的错误处理
   * @param {String} eventName
   */
  listenError(eventName) {
    this.ipcMain(eventName, (event) =>
      event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, {
        result: false,
        msg: "uploadError",
      })
    );
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
    event.reply(ipc_Main.RETURN.COMMUNICATION.BIN.CONPLETED, {
      result: false,
      msg: "uploadError",
    });
    // const mainPath = this.process.cwd();
    const directory = "./Error";
    const filepath = `${directory}/error_${new Date()
      .toISOString()
      .replace(":", "-")
      .slice(0, 19)}.txt`;
    this.fs.mkdir(directory, { recursive: true }, () =>
      this.fs.writeFile(filepath, err + "", fn.bind(this))
    );
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
  /**
   * 将数组格式的设备数据转换为设备对象格式
   * 输入格式：[[0,0],[0,0],[0,0],[0,0]] - 索引0-3分别代表A、B、C、D端口
   * 传感器类型：
   *   [1,0,0,0] - 按键传感器
   *   [0,0] - 没有传感器
   *   [2,0,0,0,0] - 颜色光感传感器
   *   [3,0,0,0,0] - 超声波传感器
   *   [4,0,0,0,0] - 巡线卡传感器
   * @param {Array} watchDeviceData 设备数据数组 [[portA], [portB], [portC], [portD]]
   * @returns {Object} 转换后的设备对象，包含deviceList数组
   */
  distinguishDevice(watchDeviceData) {
    const deviceList = [];
    const portNames = ["A", "B", "C", "D"]; // 端口名称映射

    // 遍历4个端口（A、B、C、D）
    for (let i = 0; i < watchDeviceData.length; i++) {
      const portData = watchDeviceData[i];
      const port = portNames[i];

      // 如果没有数据或数据长度为0，跳过
      if (!portData || portData.length === 0) {
        continue;
      }

      // 判断传感器类型：第一个元素表示传感器类型
      const sensorType = portData[0];

      // [0,0] 表示没有传感器接入，跳过
      if (sensorType === 0 && portData.length === 2) {
        continue;
      }

      // 创建设备对象
      const deviceItem = {
        port: port,
        deviceId: null,
        sensing_device: null,
      };
      // console.log("sensorType", sensorType);
      // console.log("portData", portData);
      // 根据传感器类型设置设备信息
      switch (sensorType) {
        case 1: // 按键传感器 [1,0,0,0]
          deviceItem.deviceId = this.deviceIdList[4]; // touch
          deviceItem.sensing_device = deviceIdMap[this.deviceIdList[4]];
          deviceItem.touch = {
            value: portData[1][0] || 0,
          };
          break;
        case 2: // 颜色光感传感器 [2,0,0,0,0]
          deviceItem.deviceId = this.deviceIdList[2]; // color
          deviceItem.sensing_device = deviceIdMap[this.deviceIdList[2]];
          deviceItem.color = {
            reflectedLight: portData[1][0] || 0,
            r: portData[1][1] || 0,
            g: portData[1][2] || 0,
            b: portData[1][3] || 0,
            colorType: portData[1][4] || 0,
          };
          break;

        case 3: // 超声波传感器 [3,0,0,0,0]
          deviceItem.deviceId = this.deviceIdList[3]; // ultrasion
          deviceItem.sensing_device = deviceIdMap[this.deviceIdList[3]];
          deviceItem.ultrasion = {
            value: portData[1][0] || 0,
          };
          break;

        case 4: // 巡线卡传感器 [4,0,0,0,0]
          deviceItem.deviceId = this.deviceIdList[7]; // gray
          deviceItem.sensing_device = deviceIdMap[this.deviceIdList[7]];
          deviceItem.LineCard = {
            BWNumber: portData[1][0] || 0,
            thoroughfare1: portData[1][1] || 0,
            thoroughfare2: portData[1][2] || 0,
            thoroughfare3: portData[1][3] || 0,
            thoroughfare4: portData[1][4] || 0,
          };
          break;
      }

      deviceList.push(deviceItem);
    }

    // 返回符合原有格式的对象结构
    return {
      deviceList: deviceList,
      // 保留其他可能的字段（如果有的话）
      version: watchDeviceData.version || null,
      MAC: watchDeviceData.MAC || null,
      NewAiState: watchDeviceData.NewAiState || null,
    };
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
    if (
      list[start] === 0x5a &&
      (list[start + 1] === 0x97 || list[start + 1] === 0x98) &&
      (list[start + 2] === 0x97 || list[start + 2] === 0x98)
    ) {
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
        if (data && bit === 0x7f) {
          const names = text.decode(
            Buffer.from(data.slice(5, data.length - 2))
          );
          event.reply(ipc_Main.RETURN.EXE.FILES, names);
        }
        return false;
      case signType.BOOT.BIN: //文件数据
        const listBin = data.slice(0, -2);
        let sum = 0;
        listBin.forEach((item) => (sum += item));
        return _intercept(
          listBin.concat(sum & 0xff, data[data.length - 1]),
          data
        );
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
    args.forEach((el) => {
      if (typeof el === "object") {
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
    const matrix = obj["obj"].matrix;
    switch (obj.type) {
      case "change":
        list = this.getInstructLIst(0x09, 0xe0, matrix);
        break;
      case "color":
        matrix.unshift(0x00);
        list = this.getInstructLIst(0x04, 0xe2, matrix);
        break;
      case "brightness":
        list = this.getInstructLIst(0x01, 0xe1, parseInt(matrix));
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
    const motor = obj["obj"];
    switch (obj.type) {
      case "speed":
        let data = _stringToHex(`${motor.port}/${motor.speed}`);
        list = this.getInstructLIst(data.length, 0xb0, data);
        break;
      case "spin":
        let dataSpin = _stringToHex(`${motor.port}/${motor.spin}`);
        list = this.getInstructLIst(dataSpin.length, 0xb2, dataSpin);
        break;
      case "spinCirle":
        let dataSpinCirle = _stringToHex(
          `${motor.port}/${motor.spin}/${motor.value}`
        );
        if (motor.type === "angle") {
          list = this.getInstructLIst(
            dataSpinCirle.length,
            0xb3,
            dataSpinCirle
          );
        } else {
          list = this.getInstructLIst(
            dataSpinCirle.length,
            0xb1,
            dataSpinCirle
          );
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
        const hex = "0x" + char.charCodeAt(0).toString(16);
        arr.push(Number(hex));
      }
      return arr;
    }
  }

  sumData(data) {
    let num = 0;
    for (let i = 0; i < data.length; i++) {
      num += data[i];
    }
    return num;
  }

  getInstructLIst(dataLen, bit, data) {
    let arr, sum;
    if (Array.isArray(data)) {
      sum = 0x5a + 0x97 + 0x98 + dataLen + bit + this.sumData(data);
      arr = [0x5a, 0x97, 0x98, dataLen, bit, ...data, sum & 0xff, 0xa5];
    } else if (typeof data === "string") {
      sum = 0x5a + 0x97 + 0x98 + dataLen + bit;
      arr = [0x5a, 0x97, 0x98, dataLen, bit, ...data, sum & 0xff, 0xa5];
    } else {
      sum = 0x5a + 0x97 + 0x98 + dataLen + bit + parseInt(data);
      arr = [0x5a, 0x97, 0x98, dataLen, bit, parseInt(data), sum & 0xff, 0xa5];
    }
    return arr;
  }

  /**
   * 检查是否是有效的设备数据
   * 新格式：[[0,0],[0,0],[0,0],[0,0]] - 4个端口（A、B、C、D）的数据数组
   * @param {Array} data 设备数据数组
   * @returns {boolean|Array} 如果是有效数据返回数据本身，否则返回false
   */
  checkIsDeviceData(data) {
    // 检查是否是数组格式，且长度为4（代表A、B、C、D四个端口）
    if (Array.isArray(data) && data.length === 4) {
      // 验证每个端口的数据也是数组
      const isValid = data.every((port) => Array.isArray(port));
      return isValid ? data : false;
    }
    return false;
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
    };
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
    }, []);

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
