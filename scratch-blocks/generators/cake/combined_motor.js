'use strict';

goog.provide('Blockly.cake.combined_motor');

goog.require('Blockly.cake');

Blockly.cake['combined_motorOne_menu'] = function (block) {
    let menu = block.getFieldValue('COMBINED_MOTORONE_MENU');
    // TODO: Assemble cake into code variable.
    return [menu, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['combined_motorTwo_menu'] = function (block) {
    let menu = block.getFieldValue('COMBINED_MOTORTWO_MENU');
    // TODO: Assemble cake into code variable.
    return [menu, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['combined_motor_starting'] = function (block) {
    let dropdown_port1 = Blockly.cake.valueToCode(block, "PORT1", Blockly.cake.ORDER_NONE);
    let dropdown_port2 = Blockly.cake.valueToCode(block, "PORT2", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `combined_motor_starting("${dropdown_port1}", "${dropdown_port2}");\n`;
    return code;
};

Blockly.cake['combined_motor_direction'] = function (block) {
    let dropdown_direction = block.getFieldValue('direction');
    // TODO: Assemble cake into code variable.
    let code = `combined_motor_direction("${dropdown_direction}");\n`;
    return code;
};

Blockly.cake['combined_motor_speed'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let speed = Blockly.cake.valueToCode(block, "SPEED", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `combined_motor_speed(${speed});\n`;
    return code;
};

Blockly.cake['combined_motor_turn'] = function (block) {
    let dropdown_spin = block.getFieldValue('SPIN');
    let angle = Blockly.cake.valueToCode(block, "ANGLE", Blockly.cake.ORDER_NONE);
    let distance = block.getFieldValue('distance');
    let unit = block.getFieldValue('result');
    // TODO: Assemble cake into code variable.
    let code = `combined_motor_turn("${dropdown_spin}", ${angle}, ${distance}, "${unit}");\n`;
    return code;
};

Blockly.cake['combined_motor_line'] = function (block) {
    let line = block.getFieldValue('line');
    let distance = block.getFieldValue('distance');
    let unit = block.getFieldValue('unit');
    // TODO: Assemble cake into code variable.
    let code = `combined_motor_line("${line}", ${distance}, "${unit}");\n`;
    return code;
};

Blockly.cake['combined_motor_stop'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = `combined_motor_stop();\n`;
    return code;
};

Blockly.cake['combined_motor_move'] = function (block) {
    let left = Blockly.cake.valueToCode(block, "left", Blockly.cake.ORDER_NONE);
    let right = Blockly.cake.valueToCode(block, "right", Blockly.cake.ORDER_NONE);
    let distance = block.getFieldValue('distance');
    let result = block.getFieldValue('result');
    // TODO: Assemble cake into code variable.
    let code = `combined_motor_move(${left}, ${right}, ${distance}, "${result}");\n`;
    return code;
};

Blockly.cake['combined_motor_movestep'] = function (block) {
    let left = Blockly.cake.valueToCode(block, "left", Blockly.cake.ORDER_NONE);
    let right = Blockly.cake.valueToCode(block, "right", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `combined_motor_movestep(${left}, ${right});\n`;
    return code;
};

Blockly.cake['combined_motor_movepower'] = function (block) {
    let power = Blockly.cake.valueToCode(block, "power", Blockly.cake.ORDER_NONE);
    let direction = block.getFieldValue('direction');
    let angle = Blockly.cake.valueToCode(block, "ANGLE", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `combined_motor_movepower(${power}, "${direction}", ${angle});\n`;
    return code;
};

Blockly.cake['combined_motor_stopping'] = function (block) {
    let style = block.getFieldValue('status');
    // TODO: Assemble cake into code variable.
    let code = `combined_motor_stopping("${style}");\n`;
    return code;
};