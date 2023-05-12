'use strict';

goog.provide('Blockly.cake.motor');

goog.require('Blockly.cake');

Blockly.cake['starting_motor'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let dropdown_spin = block.getFieldValue('SPIN');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['stop_motor'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['speed_motor'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let number_speed = block.getFieldValue('SPEED');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['specifiedunit_motor'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let dropdown_spin = block.getFieldValue('SPIN');
    let count = block.getFieldValue('count');
    let dropdown_style = block.getFieldValue('unit');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['specifiedangle_motor'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let dropdown_spin = block.getFieldValue('SPIN');
    let angle = block.getFieldValue('ANGLE');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['relative_position'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let position = block.getFieldValue('position');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['specified_manner'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let dropdown_style = block.getFieldValue('action');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['rate_motor'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['angle_motor'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};