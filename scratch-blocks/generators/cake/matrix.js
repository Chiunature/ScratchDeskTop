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

goog.provide('Blockly.cake.matrix');

goog.require('Blockly.cake');


Blockly.cake['matrix'] = function (block) {
    // Numeric value.
    var code = block.getFieldValue('MATRIX');
    if (isNaN(code)) {
        code = 0;
    }
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['matrix_lamp'] = function (block) {
    let lamp = block.getFieldValue('lamp');
    let no, id = block.id, blockDB_ = block.workspace.blockDB_;
    Object.keys(blockDB_).map((el, index) => {
        if (el == id) {
            if (index > 0) no = index - 1;
            else no = index;
        }
    });
    let color = Blockly.cake.valueToCode(block, "COLOR", Blockly.cake.ORDER_ATOMIC);
    let lp = Blockly.cake.stringToHex(lamp);
    const pre = Blockly.cake.hexToRgb(color);
    // const target = Blockly.cake.rgbToGrb(pre);
    const last = Blockly.cake.grbToHex(pre);
    if (!last) {
        return;
    }
    let newColor = last.replace(/\'/g, '');
    newColor = parseInt(newColor).toString();
    // TODO: Assemble cake into code variable.
    let code = `uint8_t BMP${no}[] = {${lp}};\nmatrix_lamp(NULL, BMP${no}, ${Blockly.cake.toStr(newColor) ? newColor : '"' + newColor + '"'});\n`;
    return code;
};

Blockly.cake['matrix_lamp_stop'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = `matrix_clearAll();\n`;
    return code;
};

Blockly.cake['matrix_lamp_set'] = function (block) {
    let brightness = Blockly.cake.valueToCode(block, "brightness", Blockly.cake.ORDER_NONE);
    brightness = parseInt(brightness / 10);
    // TODO: Assemble cake into code variable.
    let code = `matrix_set_lamp(NULL, ${Blockly.cake.toStr(brightness) ? brightness : '"' + brightness + '"'});\n`;
    return code;
};

Blockly.cake['matrix_x'] = function (block) {
    // Numeric value.
    var code = block.getFieldValue('X');
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['matrix_y'] = function (block) {
    // Numeric value.
    var code = block.getFieldValue('Y');
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['matrix_lamp_single'] = function (block) {
    let x = Blockly.cake.valueToCode(block, "x", Blockly.cake.ORDER_NONE);
    let y = Blockly.cake.valueToCode(block, "y", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `matrix_single_lamp(${Blockly.cake.toStr(x) ? x : '"' + x + '"'}, ${Blockly.cake.toStr(y) ? y : '"' + y + '"'});\n`;
    return code;
};

Blockly.cake['matrix_lamp_text'] = function (block) {
    let text = Blockly.cake.valueToCode(block, "matrix_text", Blockly.cake.ORDER_NONE);
    // let hex = Blockly.cake.charToHexArray(text);
    // TODO: Assemble cake into code variable.
    const regex = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
    const match = regex.exec(text);
    if (match && match.length > 0 && text.indexOf('matrix') === -1) text = match[0].toUpperCase();
    // let code = `char Text[] = {${hex.join(",")}};\nmatrix_text_lamp(Text);\n`;
    let code = `matrix_text_lamp(${text.indexOf('(') === -1 ? ('"' + text + '"') : text});\n`;
    return code;
};

Blockly.cake['matrix_lamp_setRGB'] = function (block) {
    let order = block.getFieldValue('order');
    let color = Blockly.cake.valueToCode(block, "COLOR", Blockly.cake.ORDER_ATOMIC);
    // TODO: Assemble cake into code variable.
    let code = `matrix_setRGB_lamp(${Blockly.cake.toStr(order) ? order : '"' + order + '"'}, ${color.replace(/\'/g, '"')});\n`;
    return code;
};

Blockly.cake['matrix_lamp_useRGB'] = function (block) {
    let switchSelect = block.getFieldValue('SWITCH');
    // TODO: Assemble cake into code variable.
    let code = `matrix_useRGB_lamp("${switchSelect}");\n`;
    return code;
};

Blockly.cake['matrix_color'] = function (block) {
    let color = Blockly.cake.valueToCode(block, "COLOR", Blockly.cake.ORDER_ATOMIC);
    const pre = Blockly.cake.hexToRgb(color);
    // const target = Blockly.cake.rgbToGrb(pre);
    const last = Blockly.cake.grbToHex(pre);
    if (!last) {
        return;
    }
    let newColor = last.replace(/\'/g, '');
    newColor = parseInt(newColor).toString();
    // TODO: Assemble cake into code variable.
    let code = `matrix_color(NULL, ${Blockly.cake.toStr(newColor) ? newColor : '"' + newColor + '"'});\n`;
    return code;
};