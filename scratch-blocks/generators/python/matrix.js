/**
 * Visual Blocks Language
 *
 * Copyright 2021 openblock.cc.
 * https://github.com/openblockcc/openblock-blocks
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

goog.provide('Blockly.Python.matrix');

goog.require('Blockly.Python');


Blockly.Python['matrix'] = function (block) {
  // Numeric value.
  var code = block.getFieldValue('MATRIX');
  if (isNaN(code)) {
    code = 0;
  }
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['matrix_x'] = function (block) {
  // Numeric value.
  var code = block.getFieldValue('X');
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['matrix_y'] = function (block) {
  // Numeric value.
  var code = block.getFieldValue('Y');
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['matrix_lamp'] = function (block) {
  let lamp = block.getFieldValue('lamp');
  let no, id = block.id, blockDB_ = block.workspace.blockDB_;
  Object.keys(blockDB_).map((el, index) => {
    if (el == id) {
      if (index > 0) no = index - 1;
      else no = index;
    }
  });
  let color = Blockly.Python.valueToCode(block, "COLOR", Blockly.Python.ORDER_ATOMIC);
  let lp = Blockly.Python.stringToHex(lamp);
  let newColor;
  if (typeof color === 'string' && color.indexOf('(') === -1 && color.indexOf('#') !== -1) {
    const pre = Blockly.Python.hexToRgb(color);
    // const target = Blockly.Python.rgbToGrb(pre);
    const last = Blockly.Python.grbToHex(pre);
    if (!pre) {
      return;
    }
    newColor = last.replace(/\'/g, '');
  } else {
    newColor = color;
  }

  // TODO: Assemble Python into code variable.
  let code = `matrix_lamp(${newColor}, ${lp})\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.MATRIX_TYPE);
};

Blockly.Python['matrix_lamp_text'] = function (block) {
  let text = Blockly.Python.valueToCode(block, "matrix_text", Blockly.Python.ORDER_NONE);
  // const regex = /^[A-Za-z0-9]+$/;
  // const match = regex.exec(text);
  // if (match && match.length > 0 && text.indexOf('matrix') === -1) text = match[0].toUpperCase();
  let code = `matrix_text_lamp(${text})\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.MATRIX_TYPE);
};

Blockly.Python['matrix_lamp_set'] = function (block) {
  let brightness = Blockly.Python.valueToCode(block, "brightness", Blockly.Python.ORDER_NONE);
  if (brightness.indexOf('(') === -1 && !isNaN(brightness / 10)) {
    brightness = parseInt(brightness / 10) + '';
  }
  // TODO: Assemble Python into code variable.
  let code = `matrix_set_lamp(${brightness})\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.MATRIX_TYPE);
};

Blockly.Python['matrix_lamp_single'] = function (block) {
  let x = Blockly.Python.valueToCode(block, "x", Blockly.Python.ORDER_ATOMIC);
  let y = Blockly.Python.valueToCode(block, "y", Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  let code = `matrix_lamp_single(${x}, ${y})\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.MATRIX_TYPE);
};

Blockly.Python['matrix_lamp_stop'] = function (block) {
  // TODO: Assemble Python into code variable.
  let code = `matrix_clearAll()\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.MATRIX_TYPE);
};

Blockly.Python['matrix_color'] = function (block) {
  let color = Blockly.Python.valueToCode(block, "COLOR", Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.oldColor = color;
  let newColor;
  if (typeof color === 'string' && color.indexOf('(') === -1 && color.indexOf('#') !== -1) {
    const pre = Blockly.Python.hexToRgb(color);
    // const target = Blockly.Python.rgbToGrb(pre);
    const last = Blockly.Python.grbToHex(pre);
    if (!last) {
      return;
    }
    newColor = last.replace(/\'/g, '');
  } else {
    newColor = color;
  }
  // TODO: Assemble Python into code variable.
  let code = `matrix_color(${newColor})\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.MATRIX_TYPE);
};