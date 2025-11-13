"use strict";

goog.provide("Blockly.Python.motor");

goog.require("Blockly.Python");

Blockly.Python["motor_box"] = function (block) {
  const menu = block.getFieldValue("MOTOR");
  return [`"${menu}"`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["motor_box_abef"] = function (block) {
  const menu = block.getFieldValue("MOTOR");
  return [`"${menu}"`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["motor_acceleration_menu"] = function (block) {
  const menu = block.getFieldValue("MENU");
  // TODO: Assemble Python into code variable.
  return [`"${menu}"`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["motor_starting"] = function (block) {
  const port = Blockly.Python.valueToCode(
    block,
    "PORT",
    Blockly.Python.ORDER_NONE
  );
  let spin = block.getFieldValue("SPIN");
  spin = spin[0].toLowerCase() + spin.slice(1);
  const spinValue = parseInt(spin, 10);
  const code = `set_motor_run(${port}, ${spinValue})\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE, true);
};

Blockly.Python["motor_stop"] = function (block) {
  const port = Blockly.Python.valueToCode(
    block,
    "PORT",
    Blockly.Python.ORDER_NONE
  );
  // TODO: Assemble Python into code variable.
  const code = `set_motor_run(${port})\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE, true);
};

Blockly.Python["motor_speed"] = function (block) {
  const port = Blockly.Python.valueToCode(
    block,
    "PORT",
    Blockly.Python.ORDER_NONE
  );
  const speed = Blockly.Python.valueToCode(
    block,
    "SPEED",
    Blockly.Python.ORDER_NONE
  );
  // TODO: Assemble Python into code variable.
  const code = `set_motor_speed(${port}, ${speed})\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};

Blockly.Python["motor_specifiedunit"] = function (block) {
  const port = Blockly.Python.valueToCode(
    block,
    "PORT",
    Blockly.Python.ORDER_NONE
  );
  let spin = block.getFieldValue("SPIN");
  spin = spin[0].toLowerCase() + spin.slice(1);
  const spinValue = parseInt(spin, 10);
  const count = Blockly.Python.valueToCode(
    block,
    "COUNT",
    Blockly.Python.ORDER_NONE
  );
  // TODO: Assemble Python into code variable.
  const code = `set_motor_run(${port}, ${spinValue}, time=${count})\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE, true);
};

Blockly.Python["motor_specified_manner"] = function (block) {
  const port = Blockly.Python.valueToCode(
    block,
    "PORT",
    Blockly.Python.ORDER_NONE
  );
  const action = block.getFieldValue("action");
  // 将字符串数值转换为整数
  const actionValue = parseInt(action, 10);
  const code = `set_stop_mode(${port}, ${actionValue})\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE, true);
};

Blockly.Python["motor_startWithPower"] = function (block) {
  const port = Blockly.Python.valueToCode(
    block,
    "PORT",
    Blockly.Python.ORDER_NONE
  );
  const power = Blockly.Python.valueToCode(
    block,
    "POWER",
    Blockly.Python.ORDER_NONE
  );
  const code = `set_motor_run(${port}, speed=${power})\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE, true);
};
