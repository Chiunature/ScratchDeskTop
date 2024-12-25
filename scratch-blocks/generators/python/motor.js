'use strict';

goog.provide('Blockly.Python.motor');

goog.require('Blockly.Python');

Blockly.Python['motor_box'] = function (block) {
    const menu = block.getFieldValue('MOTOR');
    // TODO: Assemble Python into code variable.
    return [`"${menu}1"`, Blockly.cake.ORDER_ATOMIC];
};

Blockly.Python['motor_acceleration_menu'] = function (block) {
    const menu = block.getFieldValue('MENU');
    // TODO: Assemble Python into code variable.
    return [`"${menu}"`, Blockly.cake.ORDER_ATOMIC];
};

Blockly.Python['motor_starting'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const spin = block.getFieldValue('SPIN');
    // TODO: Assemble Python into code variable.
    const code = `Start(${port}, "${spin}")\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};

Blockly.Python['motor_stop'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    // TODO: Assemble Python into code variable.
    const code = `Stop(${port})\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};

Blockly.Python['motor_speed'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const speed = Blockly.Python.valueToCode(block, "SPEED", Blockly.Python.ORDER_NONE);
    // TODO: Assemble Python into code variable.
    const code = `Speed(${port}, ${speed})\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};

Blockly.Python['motor_specifiedunit'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const spin = block.getFieldValue('SPIN');
    const count = Blockly.Python.valueToCode(block, "COUNT", Blockly.Python.ORDER_NONE);
    const unit = block.getFieldValue('unit');
    // TODO: Assemble Python into code variable.
    const code = `Specifiedunit(${port}, "${spin}", ${count}, "${unit}")\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};

Blockly.Python['motor_specified_manner'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const action = block.getFieldValue('action');
    // TODO: Assemble Python into code variable.
    const code = `StopManner(${port}, "${action}")\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};

Blockly.Python['motor_rate'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    // TODO: Assemble Python into code variable.
    const code = Blockly.Python.handleResult(`rate(${port})`, Blockly.Python.MOTOR_TYPE);
    return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['motor_angle'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    // TODO: Assemble Python into code variable.
    const code = Blockly.Python.handleResult(`angle(${port})`, Blockly.Python.MOTOR_TYPE);
    return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['motor_position'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    // TODO: Assemble Python into code variable.
    const code = Blockly.Python.handleResult(`pos(${port})`, Blockly.Python.MOTOR_TYPE);
    return [code.trim(), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['motor_startWithPower'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const power = Blockly.Python.valueToCode(block, "POWER", Blockly.Python.ORDER_NONE);
    const code = `PowerStart(${port}, ${power})\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};