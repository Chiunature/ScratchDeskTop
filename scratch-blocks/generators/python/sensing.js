'use strict';

goog.provide('Blockly.Python.sensing');

goog.require('Blockly.Python');

const MEM_TYPE = 'MEM';

Blockly.Python['sensing_menu'] = function (block) {
    const menu = block.getFieldValue('SENSING_MENU');
    // TODO: Assemble Python into code variable.
    return [menu + '1', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_set_yaw_angle'] = function (block) {
    // TODO: Assemble Python into code variable.
    let code = `Resetyaw()\n`;
    return Blockly.Python.handleResult(code, MEM_TYPE);
};

Blockly.Python['sensing_gyroscope_acceleration'] = function (block) {
    let directiion = block.getFieldValue('directiion');
    // TODO: Assemble Python into code variable.
    let code = Blockly.Python.handleResult(`acceleration(${directiion})`, MEM_TYPE);
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_gyroscope_attitude'] = function (block) {
    let attitude = block.getFieldValue('attitude');
    // TODO: Assemble Python into code variable.
    let code = Blockly.Python.handleResult(`attitude(${attitude})`, MEM_TYPE);
    return [code, Blockly.Python.ORDER_RELATIONAL];
};

Blockly.cake['sensing_gyroscope_angle'] = function (block) {
    let port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = Blockly.Python.handleResult(`angleofattitude(${port})`, MEM_TYPE);
    return [code, Blockly.cake.ORDER_RELATIONAL];
};