"use strict";

/**
 * @fileoverview Python code generation for Camera Recognition blocks.
 * @author Your Name
 */

goog.provide("Blockly.Python.cameraRecognition");

goog.require("Blockly.Python");

/**
 * 摄像头识别端口菜单积木块的代码生成器
 * 返回端口字符串值（如 "A", "B" 等）
 * @param {!Blockly.Block} block - 积木块对象
 * @return {Array} - [代码字符串, 操作符优先级]
 */
Blockly.Python["cameraRecognition_menu"] = function (block) {
  const menu = block.getFieldValue("CAMERARECOGNITION_MENU");
  return [`"${menu}"`, Blockly.Python.ORDER_ATOMIC];
};

/**
 * 将端口转换为数字的函数
 * 将端口字母（A-H）转换为对应的数字（0-7）
 * @param {string} port - 端口字符串，如 "A", "B" 等
 * @return {number|string} - 端口对应的数字，如果无法转换则返回原值
 */
Blockly.Python["cameraRecognition_port_to_number"] = function (port) {
  const portMap = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7 };
  // 清理引号和其他非字母字符，并转换为大写
  const UpperPort = port.toUpperCase().replace(/["']/g, "").trim();
  if (typeof UpperPort !== "string") return port;
  // 如果端口在映射表中，返回对应数字，否则返回原值
  return portMap[UpperPort] !== undefined ? portMap[UpperPort] : UpperPort;
};

/**
 * 生成 AprilTag 标签识别的 Python 代码
 * 这是一个值块（value block），返回识别到的标签字符串
 * @param {!Blockly.Block} block - 积木块对象
 * @return {Array} - [代码字符串, 操作符优先级]
 */
Blockly.Python["cameraRecognition_discerrn_aprltag_lab"] = function (block) {
  // 获取端口输入值，ORDER_NONE 表示不需要考虑操作符优先级
  const port =
    Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE) ||
    '"A"'; // 如果没有端口值，默认使用 "A"

  // 将端口转换为数字
  const portValue = Blockly.Python["cameraRecognition_port_to_number"](port);

  // 生成 Python 代码：调用 discerrn_aprltag_lab 函数
  const code = Blockly.Python.handleResult(
    `discern_apriltag_lab(${portValue})`,
    Blockly.Python.CAMERA_RECOGNITION_TYPE
  );

  // 返回值块需要返回数组：[代码, 操作符优先级]
  // ORDER_ATOMIC 表示这是一个原子值，不需要括号
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};
