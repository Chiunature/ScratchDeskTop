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
    let color = Blockly.cake.valueToCode(block, "COLOR", Blockly.cake.ORDER_ATOMIC);
    let lp = Blockly.cake.stringToHex(lamp);
    let cr = color.replace(/\#/g, '0x');
    // TODO: Assemble cake into code variable.
    let code = `uint8_t BMP[] = {${lp}};\nmatrix_lamp(NULL, BMP, ${cr.replace(/\'/g, '')});\n`;
    return code;
};

Blockly.cake['matrix_lamp_stop'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = `matrix_stop_lamp(NULL);\n`;
    return code;
};

Blockly.cake['matrix_lamp_set'] = function (block) {
    let brightness = Blockly.cake.valueToCode(block, "brightness", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `matrix_set_lamp(NULL, ${brightness});\n`;
    return code;
};

Blockly.cake['matrix_lamp_single'] = function (block) {
    let x = block.getFieldValue('x');
    let y = block.getFieldValue('y');
    let brightness = Blockly.cake.valueToCode(block, "brightness", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `matrix_single_lamp(${x}, ${y}, ${brightness});\n`;
    return code;
};

Blockly.cake['matrix_lamp_text'] = function (block) {
    let text = block.getFieldValue('text');
    // let direction = block.getFieldValue('direction');
    let t = Blockly.cake.charToHexArray(text);
    let arr = t.map(el => {
        return '0x' + el;
    });
    // TODO: Assemble cake into code variable.

    let code = `char Text[] = {${arr.join(",")}};\nmatrix_text_lamp(Text, getTaskNumber(Text)/8 ,"left");\n`;
    return code;
};

Blockly.cake['matrix_lamp_setRGB'] = function (block) {
    let order = block.getFieldValue('order');
    let color = Blockly.cake.valueToCode(block, "COLOR", Blockly.cake.ORDER_ATOMIC);
    // TODO: Assemble cake into code variable.
    let code = `matrix_setRGB_lamp(${order}, ${color.replace(/\'/g, '"')});\n`;
    return code;
};

Blockly.cake['matrix_lamp_useRGB'] = function (block) {
    let switchSelect = block.getFieldValue('SWITCH');
    // TODO: Assemble cake into code variable.
    let code = `matrix_useRGB_lamp("${switchSelect}");\n`;
    return code;
};