"use strict";

goog.provide("Blockly.Python.sensing");

goog.require("Blockly.Python");

Blockly.Python["sensing_menu"] = function (block) {
  const menu = block.getFieldValue("SENSING_MENU");
  // TODO: Assemble Python into code variable.
  return [`"${menu}"`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_sound_intensity"] = function (block) {
  // TODO: Assemble Python into code variable.
  const code = `MICADC.read()`;
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_ultrasonic_judgment"] = function (block) {
  const port = block.getFieldValue("PORT");
  const judgment = block.getFieldValue("judgment");
  const inp = Blockly.Python.valueToCode(
    block,
    "value",
    Blockly.Python.ORDER_NONE
  );
  const code = Blockly.Python.handleResult(
    `get_ul(${port}) ${judgment} ${inp}`,
    Blockly.Python.ULTRASIONIC_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_ultrasonic_detection"] = function (block) {
  const port = block.getFieldValue("PORT");
  const code = Blockly.Python.handleResult(
    `get_ul(${port})`,
    Blockly.Python.ULTRASIONIC_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_key_judgment"] = function (block) {
  const port = block.getFieldValue("PORT");
  const code = Blockly.Python.handleResult(
    `get_key(${port})==1`,
    Blockly.Python.TOUCH_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_mainIsPress"] = function (block) {
  const keys = block.getFieldValue("KEYS");
  const btn = block.getFieldValue("BUTTON");
  // TODO: Assemble Python into code variable.
  const code = Blockly.Python.handleResult(
    `keys["${keys}"].value()==${btn}`,
    Blockly.Python.KEY_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_key_press"] = function (block) {
  const port = block.getFieldValue("PORT");
  const status = block.getFieldValue("status");
  // TODO: Assemble Python into code variable.
  const code = Blockly.Python.handleResult(
    `Sensing_key_press(${port}, "${status}")`,
    Blockly.Python.TOUCH_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};
//查看遥控器是否按下
Blockly.Python["sensing_isHandling"] = function (block) {
  const keys = block.getFieldValue("KEYS");
  const button = block.getFieldValue("BUTTON");
  // TODO: Assemble Python into code variable.
  const code = Blockly.Python.handleResult(
    `get_remote_key("${keys}")==${button}`,
    Blockly.Python.KEY_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_timer"] = function (block) {
  // TODO: Assemble Python into code variable.
  const code = `get_timer()`;
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_reset_timer"] = function (block) {
  // TODO: Assemble Python into code variable.
  let code = `timer_clear()\n`;
  return code;
};

Blockly.Python["getGear"] = function (block) {
  const code = `get_remote_key("GEAR")`;
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};
