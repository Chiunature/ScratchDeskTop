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
    // TODO: Assemble cake into code variable.
    let code = `matrix_lamp("${lamp}", ${color.replace(/\'/g, '"')});\n`;
    return code;
};

Blockly.cake['stop_matrix_lamp'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = `matrix_stop_lamp()\n`;
    return code;
};

Blockly.cake['set_matrix_lamp'] = function (block) {
    let brightness = Blockly.cake.valueToCode(block, "brightness", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `matrix_set_lamp(${brightness});\n`;
    return code;
};

Blockly.cake['single_matrix_lamp'] = function (block) {
    let x = block.getFieldValue('x');
    let y = block.getFieldValue('y');
    let brightness = Blockly.cake.valueToCode(block, "brightness", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `matrix_single_lamp(${x}, ${y}, ${brightness});\n`;
    return code;
};

Blockly.cake['text_matrix_lamp'] = function (block) {
    let text = block.getFieldValue('text');
    let direction = block.getFieldValue('direction');
    // TODO: Assemble cake into code variable.
    let code = `matrix_text_lamp("${text}", "${direction}");\n`;
    return code;
};

Blockly.cake['setRGB_matrix_lamp'] = function (block) {
    let order = block.getFieldValue('order');
    let color = Blockly.cake.valueToCode(block, "COLOR", Blockly.cake.ORDER_ATOMIC);
    // TODO: Assemble cake into code variable.
    let code = `matrix_setRGB_lamp(${order}, ${color.replace(/\'/g, '"')});\n`;
    return code;
};

Blockly.cake['useRGB_matrix_lamp'] = function (block) {
    let switchSelect = block.getFieldValue('SWITCH');
    // TODO: Assemble cake into code variable.
    let code = `matrix_useRGB_lamp("${switchSelect}");\n`;
    return code;
};