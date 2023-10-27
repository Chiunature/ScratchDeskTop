'use strict';

goog.provide('Blockly.cake.motor');

goog.require('Blockly.cake');

Blockly.cake['motor_starting'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let dropdown_spin = block.getFieldValue('SPIN');
    // TODO: Assemble cake into code variable.
    let code = `motor_Starting("${dropdown_port}1", "${dropdown_spin}");\n`;
    return code;
};

Blockly.cake['motor_stop'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = `motor_Stop("${dropdown_port}1");\n`;
    return code;
};

Blockly.cake['motor_speed'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let speed = Blockly.cake.valueToCode(block, "SPEED", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `motor_Speed("${dropdown_port}1", ${speed});\n`;
    return code;
};

Blockly.cake['motor_specifiedunit'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let dropdown_spin = block.getFieldValue('SPIN');
    let count = Blockly.cake.valueToCode(block, "COUNT", Blockly.cake.ORDER_NONE);
    let unit = block.getFieldValue('unit');
    // TODO: Assemble cake into code variable.
    let code = `motor_specifiedunit("${dropdown_port}1", "${dropdown_spin}", ${count}, "${unit}");\n`;
    return code;
};

Blockly.cake['motor_specifiedangle'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let dropdown_spin = block.getFieldValue('SPIN');
    let angle = Blockly.cake.valueToCode(block, "ANGLE", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `motor_Specifiedangle("${dropdown_port}1", "${dropdown_spin}", "${angle}");\n`;
    return code;
};

Blockly.cake['motor_relative_position'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let position = block.getFieldValue('position');
    // TODO: Assemble cake into code variable.
    let code = `motor_Relative_Position("${dropdown_port}1", "${position}");\n`;
    return code;
};

Blockly.cake['motor_specified_manner'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let action = block.getFieldValue('action');
    // TODO: Assemble cake into code variable.
    let code = `motor_Specified_Manner("${dropdown_port}1", "${action}");\n`;
    return code;
};

Blockly.cake['motor_rate'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = `motor_Rate("${dropdown_port}1")`;
    return code;
};

Blockly.cake['motor_angle'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = `motor_Angle("${dropdown_port}1")`;
    return code;
};