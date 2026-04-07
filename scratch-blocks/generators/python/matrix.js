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
"use strict";

goog.provide("Blockly.Python.matrix");

goog.require("Blockly.Python");

Blockly.Python["matrix"] = function (block) {
  // Numeric value.
  var code = block.getFieldValue("MATRIX");
  if (isNaN(code)) {
    code = 0;
  }
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["matrix_x"] = function (block) {
  // Numeric value.
  var code = block.getFieldValue("X");
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["matrix_y"] = function (block) {
  // Numeric value.
  var code = block.getFieldValue("Y");
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["matrix_lamp"] = function (block) {
  let lamp = block.getFieldValue("lamp");
  let lp = Blockly.Python.stringToHex(lamp);
  let code = `display([${lp}])\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.MATRIX_TYPE);
};

Blockly.Python["matrix_lamp_text"] = function (block) {
  let text = Blockly.Python.valueToCode(
    block,
    "matrix_text",
    Blockly.Python.ORDER_NONE
  );
  let code = `scroll_text(${text})\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.MATRIX_TYPE, true);
};

Blockly.Python["matrix_lamp_stop"] = function (block) {
  //清除内容
  let code = `display()\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.MATRIX_TYPE);
};
