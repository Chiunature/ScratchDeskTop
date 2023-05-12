'use strict';

goog.provide('Blockly.cake.combined_motor');

goog.require('Blockly.cake');

Blockly.cake['starting_combined_motor'] = function (block) {
    let dropdown_port1 = block.getFieldValue('PORT1');
    let dropdown_port2 = block.getFieldValue('PORT2');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['direction_combined_motor'] = function (block) {
    let dropdown_direction = block.getFieldValue('direction');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['speed_combined_motor'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let speed = block.getFieldValue('SPEED');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['turn_combined_motor'] = function (block) {
    let dropdown_spin = block.getFieldValue('SPIN');
    let angle = block.getFieldValue('angle');
    let distance = block.getFieldValue('distance');
    let unit = block.getFieldValue('unit');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['line_combined_motor'] = function (block) {
    let line = block.getFieldValue('line');
    let distance = block.getFieldValue('distance');
    let unit = block.getFieldValue('unit');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['stop_combined_motor'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['move_combined_motor'] = function (block) {
    let left = block.getFieldValue('left');
    let right = block.getFieldValue('right');
    let distance = block.getFieldValue('distance');
    let result = block.getFieldValue('result');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['movestep_combined_motor'] = function (block) {
    let left = block.getFieldValue('left');
    let right = block.getFieldValue('right');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['movepower_combined_motor'] = function (block) {
    let power = block.getFieldValue('power');
    let direction = block.getFieldValue('direction');
    let angle = block.getFieldValue('angle');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['stopping_combined_motor'] = function (block) {
    let style = block.getFieldValue('status');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};