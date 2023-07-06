'use strict';

goog.provide('Blockly.cake.motor');

goog.require('Blockly.cake');

Blockly.cake['motor_starting'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let dropdown_spin = block.getFieldValue('SPIN');
    // TODO: Assemble cake into code variable.
    let code = `motor_starting("${dropdown_port}", "${dropdown_spin}");\n`;
    return code;
};

Blockly.cake['motor_stop'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = `motor_stop("${dropdown_port}");\n`;
    return code;
};

Blockly.cake['motor_speed'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let speed = Blockly.cake.valueToCode(block, "SPEED", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `motor_speed("${dropdown_port}", ${speed});\n`;
    return code;
};

Blockly.cake['motor_specifiedunit'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let dropdown_spin = block.getFieldValue('SPIN');
    let count = block.getFieldValue('count');
    let unit = block.getFieldValue('unit');
    // TODO: Assemble cake into code variable.
    let code = `motor_specifiedunit("${dropdown_port}", "${dropdown_spin}", ${count}, "${unit}");\n`;
    return code;
};

Blockly.cake['motor_specifiedangle'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let dropdown_spin = block.getFieldValue('SPIN');
    let angle = block.getFieldValue('ANGLE');
    // TODO: Assemble cake into code variable.
    let code = `motor_specifiedangle("${dropdown_port}", "${dropdown_spin}", ${angle});\n`;
    return code;
};

Blockly.cake['motor_relative_position'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let position = block.getFieldValue('position');
    // TODO: Assemble cake into code variable.
    let code = `motor_relative_position("${dropdown_port}", "${position}");\n`;
    return code;
};

Blockly.cake['motor_specified_manner'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let action = block.getFieldValue('action');
    // TODO: Assemble cake into code variable.
    let code = `motor_specified_manner("${dropdown_port}", "${action}");\n`;
    return code;
};

Blockly.cake['motor_rate'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = `motor_rate("${dropdown_port}")`;
    return code;
};

Blockly.cake['motor_angle'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = `motor_angle("${dropdown_port}")`;
    return code;
};