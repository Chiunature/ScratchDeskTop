"use strict";

goog.provide("Blockly.Python.elect_sensor");

goog.require("Blockly.Python");

Blockly.Python["elect_sensor_menu"] = function (block) {
  const menu = block.getFieldValue("ELECT_SENSOR_MENU");
  return [Blockly.Python.portToNumber(menu), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["elect_sensor_set_state"] = function (block) {
  const port =
    Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE) || "0";
  const state = block.getFieldValue("STATE") || "0";
  const code = Blockly.Python.handleResult(
    `set_state(${port}, ${state})\n`,
    Blockly.Python.ELECT_SENSOR_TYPE,
  );
  return code;
};