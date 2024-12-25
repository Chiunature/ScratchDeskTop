'use strict';

goog.provide('Blockly.Python.motor');

goog.require('Blockly.Python');

Blockly.Python['motor_box'] = function (block) {
    const menu = block.getFieldValue('MOTOR');
    // TODO: Assemble Python into code variable.
    return [menu + '1', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['motor_acceleration_menu'] = function (block) {
    const menu = block.getFieldValue('MENU');
    // TODO: Assemble Python into code variable.
    return [menu, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['motor_starting'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const spin = block.getFieldValue('SPIN');
    // TODO: Assemble Python into code variable.
    const code = `motor_Starting(${port}, ${spin});\n`;
    return code;
};