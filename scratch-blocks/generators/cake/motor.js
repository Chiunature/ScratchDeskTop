'use strict';

goog.provide('Blockly.cake.motor');

goog.require('Blockly.cake');

Blockly.cake['motor_box'] = function (block) {
    const menu = block.getFieldValue('MOTOR');
    // TODO: Assemble cake into code variable.
    return [menu, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['motor_menu'] = function (block) {
    const menu = block.getFieldValue('MOTOR_MENU');
    // TODO: Assemble cake into code variable.
    return [menu, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['motor_starting'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    let spin = block.getFieldValue('SPIN');
    // TODO: Assemble cake into code variable.
    let code = `motor_Starting(${Blockly.cake.toStr(port) ? port : '"' + port + '1"'}, ${Blockly.cake.toStr(spin) ? spin : '"' + spin + '"'});\n`;
    return code;
};

Blockly.cake['motor_stop'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `motor_Stop(${Blockly.cake.toStr(port) ? port : '"' + port + '1"'});\n`;
    return code;
};

Blockly.cake['motor_speed'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    let speed = Blockly.cake.valueToCode(block, "SPEED", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `motor_Speed(${Blockly.cake.toStr(port) ? port : '"' + port + '1"'}, ${Blockly.cake.toStr(speed) ? speed : '"' + speed + '"'});\n`;
    return code;
};

Blockly.cake['motor_specifiedunit'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    let spin = block.getFieldValue('SPIN');
    let count = Blockly.cake.valueToCode(block, "COUNT", Blockly.cake.ORDER_NONE);
    let unit = block.getFieldValue('unit');
    // TODO: Assemble cake into code variable.
    let code = `motor_specifiedunit(${Blockly.cake.toStr(port) ? port : '"' + port + '1"'}, ${Blockly.cake.toStr(spin) ? spin : '"' + spin + '"'}, ${Blockly.cake.toStr(count) ? count : '"' + count + '"'}, ${Blockly.cake.toStr(unit) ? unit : '"' + unit + '"'});\n`;
    return code;
};

Blockly.cake['motor_specifiedangle'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    let spin = block.getFieldValue('SPIN');
    let angle = Blockly.cake.valueToCode(block, "ANGLE", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `motor_Specifiedangle(${Blockly.cake.toStr(port) ? port : '"' + port + '1"'}, ${Blockly.cake.toStr(spin) ? spin : '"' + spin + '"'}, ${Blockly.cake.toStr(angle) ? angle : '"' + angle + '"'});\n`;
    return code;
};

Blockly.cake['motor_relative_position'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    let position = block.getFieldValue('position');
    // TODO: Assemble cake into code variable.
    let code = `motor_Relative_Position(${Blockly.cake.toStr(port) ? port : '"' + port + '1"'}, ${Blockly.cake.toStr(position) ? position : '"' + position + '"'});\n`;
    return code;
};

Blockly.cake['motor_specified_manner'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    let action = block.getFieldValue('action');
    // TODO: Assemble cake into code variable.
    let code = `motor_specified_manner(${Blockly.cake.toStr(port) ? port : '"' + port + '1"'}, ${Blockly.cake.toStr(action) ? action : '"' + action + '"'});\n`;
    return code;
};

Blockly.cake['motor_rate'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `motor_rate(${Blockly.cake.toStr(port) ? port : '"' + port + '1"'})`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['motor_angle'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `motor_angle(${Blockly.cake.toStr(port) ? port : '"' + port + '1"'})`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};


Blockly.cake['motor_position'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `motor_position(${Blockly.cake.toStr(port) ? port : '"' + port + '1"'})`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};