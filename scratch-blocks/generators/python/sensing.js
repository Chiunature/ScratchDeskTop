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
  const code = `restyaw()\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.MEM_TYPE);
};

Blockly.Python["sensing_gyroscope_acceleration"] = function (block) {
  const directiion = block.getFieldValue("directiion");
  const directionValue = parseInt(directiion, 10);
  const code = Blockly.Python.handleResult(
    `acc(${directiion})`,
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
  const portValue = parseInt(port, 10);
  const code = Blockly.Python.handleResult(
    `gencory(${portValue})`,
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
  const str = `${rmin} < get_color(${port},1) < ${rmax} and ${gmin} < get_color(${port},2) < ${gmax} and ${bmin} < get_color(${port},3) < ${bmax}`;
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
    "#8b4513",
    "#ff3030",
    "#ff9300",
    "#fffb0d",
    "#00f91a",
    "#E1FFFF",
    "#0532ff",
    "#9370DB",
    "#686868",
    "#ffffff",
    "#000000",
  ];

  // 清理颜色值：移除引号（单引号和双引号）、空格，转换为小写进行匹配
  const cleanColor = color.replace(/['"]/g, "").trim().toLowerCase();

  for (let i = 0; i < list.length; i++) {
    const item = list[i].toLowerCase();
    if (item === cleanColor) {
      index = i + 1 + "";
      break; // 找到匹配后立即退出循环
    }
  }
  const code = Blockly.Python.handleResult(
    `get_color(${port},4)==${index}`,
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
  const code = Blockly.Python.handleResult(
    `get_color(${port},4)`,
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
      rgb = "2";
      break;
    case "blue":
      // rgb = '0x0000FF';
      rgb = "3";
      break;
    default:
      break;
  }
  const code = Blockly.Python.handleResult(
    `get_color(${port}, ${rgb})`,
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
  const code = Blockly.Python.handleResult(
    `get_sensor_data(${port},2)${judgment}${inp}`,
    Blockly.Python.LIGHT_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_reflected_light_detection"] = function (block) {
  const port = Blockly.Python.valueToCode(
    block,
    "PORT",
    Blockly.Python.ORDER_NONE
  );
  const code = Blockly.Python.handleResult(
    `get_sensor_data(${port},2)`,
    Blockly.Python.LIGHT_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sensing_sound_intensity"] = function (block) {
  // TODO: Assemble Python into code variable.
  const code = Blockly.Python.handleResult(`voic()`, Blockly.Python.TIMER_TYPE);
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
  const code = Blockly.Python.handleResult(
    `get_ul(${port}) ${judgment} ${inp}`,
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
  const code = Blockly.Python.handleResult(
    `get_ul(${port})`,
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
  const code = Blockly.Python.handleResult(
    `get_sensor_data(${port},1)==1`,
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
    `key_remote("${button}", "${keys}")`,
    Blockly.Python.KEY_TYPE
  );
  return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

//遥控器获取坐标
Blockly.Python["sensing_Handling"] = function (block) {
  const keys = block.getFieldValue("KEYS");
  const button = block.getFieldValue("BUTTON");
  const code = Blockly.Python.handleResult(
    `key_remote("${keys}", "${button}")`,
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
    `get_line_value(${port}, ${value})`,
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
    `get_line_state(${port}, ${value}) == 1`,
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
    `get_line_state(${port}, ${status})`,
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
