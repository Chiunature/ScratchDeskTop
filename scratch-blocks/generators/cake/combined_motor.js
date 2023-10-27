'use strict';

goog.provide('Blockly.cake.combined_motor');

goog.require('Blockly.cake');

Blockly.cake['combined_motorOne_menu'] = function (block) {
    const menu = block.getFieldValue('COMBINED_MOTORONE_MENU');
    // TODO: Assemble cake into code variable.
    return [menu, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['combined_motorTwo_menu'] = function (block) {
    const menu = block.getFieldValue('COMBINED_MOTORTWO_MENU');
    // TODO: Assemble cake into code variable.
    return [menu, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['combined_motor_starting'] = function (block) {
    const dropdown_port1 = Blockly.cake.valueToCode(block, "PORT1", Blockly.cake.ORDER_NONE);
    const dropdown_port2 = Blockly.cake.valueToCode(block, "PORT2", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    const code = `motor_combined_starting("${dropdown_port1}1+${dropdown_port2}1");\n`;
    return code;
};

Blockly.cake['combined_motor_direction'] = function (block) {
    const dropdown_direction = block.getFieldValue('direction');
    // const {one, two} = Blockly.cake.combinedMotor(block, "PORT1", "PORT2");
    // TODO: Assemble cake into code variable.
    const code = `motor_combined_direction("${dropdown_direction}");\n`;
    return code;
};

Blockly.cake['combined_motor_speed'] = function (block) {
    // const {one, two} = Blockly.cake.combinedMotor(block, "PORT1", "PORT2");
    const speed = Blockly.cake.valueToCode(block, "SPEED", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    // const code = `motor_combined_speed("${one}", "${two}", ${speed});\n`;
    const code = `motor_combined_speed(${speed});\n`;
    return code;
};

Blockly.cake['combined_motor_turn'] = function (block) {
    const dropdown_spin = block.getFieldValue('SPIN');
    const angle = Blockly.cake.valueToCode(block, "ANGLE", Blockly.cake.ORDER_NONE);
    const distance = block.getFieldValue('distance');
    const unit = block.getFieldValue('unit');
    const {one, two} = Blockly.cake.combinedMotor(block, "PORT1", "PORT2");
    // TODO: Assemble cake into code variable.
    const code = `motor_combined_turn("${one}", "${two}", "${dropdown_spin}", ${angle}, ${distance}, "${unit}");\n`;
    return code;
};

Blockly.cake['combined_motor_line'] = function (block) {
    const line = block.getFieldValue('line');
    const distance = Blockly.cake.valueToCode(block, "distance", Blockly.cake.ORDER_NONE);
    const unit = block.getFieldValue('unit');
    // const {one, two} = Blockly.cake.combinedMotor(block, "PORT1", "PORT2");
    // TODO: Assemble cake into code variable.
    // const code = `motor_combined_line("${one}", "${two}", "${line}", ${distance}, "${unit}");\n`;
    const code = `motor_combined_line("${line}", ${distance}, "${unit}");\n`;
    return code;
};

Blockly.cake['combined_motor_stop'] = function (block) {
    // const {one, two} = Blockly.cake.combinedMotor(block, "PORT1", "PORT2");
    // TODO: Assemble cake into code variable.
    // const code = `motor_combined_stop("${one}", "${two}");\n`;
    const code = `motor_combined_stop();\n`;
    return code;
};

Blockly.cake['combined_motor_move'] = function (block) {
    const left = Blockly.cake.valueToCode(block, "left", Blockly.cake.ORDER_NONE);
    const right = Blockly.cake.valueToCode(block, "right", Blockly.cake.ORDER_NONE);
    const distance = block.getFieldValue('distance');
    const result = block.getFieldValue('result');
    // TODO: Assemble cake into code variable.
    const code = `motor_combined_move(${left}, ${right}, ${distance}, "${result}");\n`;
    return code;
};

Blockly.cake['combined_motor_movestep'] = function (block) {
    const left = Blockly.cake.valueToCode(block, "left", Blockly.cake.ORDER_NONE);
    const right = Blockly.cake.valueToCode(block, "right", Blockly.cake.ORDER_NONE);
    // const {one, two} = Blockly.cake.combinedMotor(block, "PORT1", "PORT2");
    // TODO: Assemble cake into code variable.
    // const code = `motor_combined_movestep("${one}", "${two}", ${left}, ${right});\n`;
    const code = `motor_combined_movestep(${left}, ${right});\n`;
    return code;
};

Blockly.cake['combined_motor_angle'] = function (block) {
    const angle = Blockly.cake.valueToCode(block, "ANGLE", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    const code = `motor_combined_angle(${angle});\n`;
    return code;
};

Blockly.cake['combined_motor_stopping'] = function (block) {
    const style = block.getFieldValue('status');
    // const {one, two} = Blockly.cake.combinedMotor(block, "PORT1", "PORT2");
    // TODO: Assemble cake into code variable.
    // const code = `motor_combined_stopping("${one}", "${two}", "${style}");\n`;
    const code = `motor_combined_stopping("${style}");\n`;
    return code;
};