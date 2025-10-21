"use strict";

goog.provide("Blockly.Python.sensing");

goog.require("Blockly.Python");

Blockly.Python["sensing_menu"] = function (block) {
  const menu = block.getFieldValue("SENSING_MENU");
  // TODO: Assemble Python into code variable.
  return [`"${menu}"`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_set_yaw_angle"] = function (block) {
  // TODO: Assemble Python into code variable.
  const code = `resetyaw()\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.MEM_TYPE);
};

Blockly.Python["sensing_gyroscope_acceleration"] = function (block) {
  const directiion = block.getFieldValue("directiion");
  // TODO: Assemble Python into code variable.
  const code = Blockly.Python.handleResult(
    `acceleration("${directiion}")`,
    Blockly.Python.MEM_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_gyroscope_attitude"] = function (block) {
  const attitude = block.getFieldValue("attitude");
  // TODO: Assemble Python into code variable.
  const code = Blockly.Python.handleResult(
    `attitude("${attitude}")`,
    Blockly.Python.MEM_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_gyroscope_angle"] = function (block) {
  let port = block.getFieldValue("PORT");
  port = port[0].toLowerCase() + port.slice(1);
  // TODO: Assemble Python into code variable.
  const code = Blockly.Python.handleResult(
    `angleofattitude("${port}")`,
    Blockly.Python.MEM_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_color_range"] = function (block) {
  const port = Blockly.Python.valueToCode(
    block,
    "PORT",
    Blockly.Python.ORDER_NONE
  );
  const rmin = Blockly.Python.valueToCode(
    block,
    "RMin",
    Blockly.Python.ORDER_NONE
  );
  const gmin = Blockly.Python.valueToCode(
    block,
    "GMin",
    Blockly.Python.ORDER_NONE
  );
  const bmin = Blockly.Python.valueToCode(
    block,
    "BMin",
    Blockly.Python.ORDER_NONE
  );
  const rmax = Blockly.Python.valueToCode(
    block,
    "RMax",
    Blockly.Python.ORDER_NONE
  );
  const gmax = Blockly.Python.valueToCode(
    block,
    "GMax",
    Blockly.Python.ORDER_NONE
  );
  const bmax = Blockly.Python.valueToCode(
    block,
    "BMax",
    Blockly.Python.ORDER_NONE
  );
  // TODO: Assemble Python into code variable.
  const str =
    "cmp_hsv(" +
    `${port}` +
    ", " +
    `${rmin}` +
    ", " +
    `${rmax}` +
    ", " +
    `${gmin}` +
    ", " +
    `${gmax}` +
    ", " +
    `${bmin}` +
    ", " +
    `${bmax}` +
    ")";
  const code = Blockly.Python.handleResult(str, Blockly.Python.COLOR_TYPE);
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_color_judgment"] = function (block) {
  const port = Blockly.Python.valueToCode(
    block,
    "PORT",
    Blockly.Python.ORDER_NONE
  );
  const color = Blockly.Python.valueToCode(
    block,
    "COLOR",
    Blockly.Python.ORDER_NONE
  );
  let index = "0";
  const list = [
    "#ff000c",
    "#ffe360",
    "#0090f5",
    "#00cb54",
    "#914800",
    "#ad0000",
    "#000000",
    "#ffffff",
  ];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (item == color.replace(/'/g, "")) {
      index = i + 1 + "";
    }
  }
  const code = Blockly.Python.handleResult(
    `cmp_color(${port}, ${index})`,
    Blockly.Python.COLOR_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_color_detection"] = function (block) {
  const port = Blockly.Python.valueToCode(
    block,
    "PORT",
    Blockly.Python.ORDER_NONE
  );
  // TODO: Assemble Python into code variable.
  const code = Blockly.Python.handleResult(
    `dectection(${port})`,
    Blockly.Python.COLOR_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_color_detectionRGB"] = function (block) {
  const port = Blockly.Python.valueToCode(
    block,
    "PORT",
    Blockly.Python.ORDER_NONE
  );
  const color = block.getFieldValue("color");
  let rgb;
  switch (color) {
    case "red":
      // rgb = '0xFF0000';
      rgb = "1";
      break;
    case "green":
      // rgb = '0x00FF00';
      rgb = "4";
      break;
    case "blue":
      // rgb = '0x0000FF';
      rgb = "3";
      break;
    default:
      break;
  }
  // TODO: Assemble Python into code variable.
  const code = Blockly.Python.handleResult(
    `rgb(${port}, ${rgb})`,
    Blockly.Python.COLOR_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_reflected_light_judgment"] = function (block) {
  const port = Blockly.Python.valueToCode(
    block,
    "PORT",
    Blockly.Python.ORDER_NONE
  );
  const judgment = block.getFieldValue("judgment");
  const inp = Blockly.Python.valueToCode(
    block,
    "value",
    Blockly.Python.ORDER_NONE
  );
  // TODO: Assemble Python into code variable.
  const code = Blockly.Python.handleResult(
    `cmp_lux(${port}, "${judgment}", ${inp})`,
    Blockly.Python.COLOR_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_reflected_light_detection"] = function (block) {
  const port = Blockly.Python.valueToCode(
    block,
    "PORT",
    Blockly.Python.ORDER_NONE
  );
  // TODO: Assemble Python into code variable.
  const code = Blockly.Python.handleResult(
    `lux(${port})`,
    Blockly.Python.COLOR_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_sound_intensity"] = function (block) {
  // TODO: Assemble Python into code variable.
  const code = Blockly.Python.handleResult(`voic()`, Blockly.Python.SOUND_TYPE);
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_ultrasonic_judgment"] = function (block) {
  const port = Blockly.Python.valueToCode(
    block,
    "PORT",
    Blockly.Python.ORDER_NONE
  );
  const judgment = block.getFieldValue("judgment");
  const inp = Blockly.Python.valueToCode(
    block,
    "value",
    Blockly.Python.ORDER_NONE
  );
  // TODO: Assemble Python into code variable.
  const code = Blockly.Python.handleResult(
    `sensing_ultrasionic_judgment(${port}, "${judgment}", ${inp})`,
    Blockly.Python.ULTRASIONIC_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_ultrasonic_detection"] = function (block) {
  const port = Blockly.Python.valueToCode(
    block,
    "PORT",
    Blockly.Python.ORDER_NONE
  );
  // TODO: Assemble Python into code variable.
  const code = Blockly.Python.handleResult(
    `sensing_ultrasionic_detection(${port})`,
    Blockly.Python.ULTRASIONIC_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_key_judgment"] = function (block) {
  const port = Blockly.Python.valueToCode(
    block,
    "PORT",
    Blockly.Python.ORDER_NONE
  );
  // TODO: Assemble Python into code variable.
  const code = Blockly.Python.handleResult(
    `DetectingTouch(${port})`,
    Blockly.Python.TOUCH_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_mainIsPress"] = function (block) {
  const keys = block.getFieldValue("KEYS");
  const btn = block.getFieldValue("BUTTON");
  // TODO: Assemble Python into code variable.
  const code = Blockly.Python.handleResult(
    `Sensing_key_judment("${keys}", ${btn})`,
    Blockly.Python.TOUCH_TYPE
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

Blockly.Python["sensing_isHandling"] = function (block) {
  const keys = block.getFieldValue("KEYS");
  const button = block.getFieldValue("BUTTON");
  // TODO: Assemble Python into code variable.
  const code = Blockly.Python.handleResult(
    `isHandling("${button}", "${keys}")`,
    Blockly.Python.KEY_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_Handling"] = function (block) {
  const keys = block.getFieldValue("KEYS");
  const button = block.getFieldValue("BUTTON");
  // TODO: Assemble Python into code variable.
  const code = Blockly.Python.handleResult(
    `Handling("${keys}", "${button}")`,
    Blockly.Python.KEY_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_get_gray_line"] = function (block) {
  const port = Blockly.Python.valueToCode(
    block,
    "PORT",
    Blockly.Python.ORDER_NONE
  );
  const value = block.getFieldValue("VALUES");
  const code = Blockly.Python.handleResult(
    `line(${port}, "${value}")`,
    Blockly.Python.GRAY_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_get_gray_lineState"] = function (block) {
  const port = Blockly.Python.valueToCode(
    block,
    "PORT",
    Blockly.Python.ORDER_NONE
  );
  const value = block.getFieldValue("VALUES");
  const code = Blockly.Python.handleResult(
    `lineSingleState(${port}, "${value}")`,
    Blockly.Python.GRAY_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_judgelineState"] = function (block) {
  const port = Blockly.Python.valueToCode(
    block,
    "PORT",
    Blockly.Python.ORDER_NONE
  );
  const status = block.getFieldValue("STATEUS");
  const code = Blockly.Python.handleResult(
    `judgelineState(${port}, ${status})`,
    Blockly.Python.GRAY_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_timer"] = function (block) {
  // TODO: Assemble Python into code variable.
  const code = Blockly.Python.handleResult(
    `timer()`,
    Blockly.Python.TIMER_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_reset_timer"] = function (block) {
  // TODO: Assemble Python into code variable.
  let code = `resetTimer()\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.TIMER_TYPE);
};
