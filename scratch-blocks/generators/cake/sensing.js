'use strict';

goog.provide('Blockly.cake.sensing');

goog.require('Blockly.cake');

Blockly.cake['sensing_color_judgment'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let color = block.getFieldValue('COLOR');
    let cr = color.replace(/\#/g, '0x');
    // TODO: Assemble cake into code variable.
    let code = `int sensing_color = ${cr.replace(/\'/g, '')};\nSensing_color_judgment(${dropdown_port}, sensing_color);\n`;
    return code;
};

Blockly.cake['sensing_color_detection'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = `Sensing_color_detection(${dropdown_port})\n`;
    return code;
};

Blockly.cake['sensing_color_detectionRGB'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let dropdown_color = block.getFieldValue('color');
    let cr = dropdown_color.replace(/\#/g, '0x');
    // TODO: Assemble cake into code variable.
    let code = `int detectionRGB = ${cr.replace(/\'/g, '')};\nSensing_color_detectionRGB(${dropdown_port}, detectionRGB)\n`;
    return code;
};

Blockly.cake['sensing_reflected_light_judgment'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let dropdown_judgment = block.getFieldValue('judgment');
    let inp = block.getFieldValue('value');
    // TODO: Assemble cake into code variable.
    let code = `Sensing_Reflected_light_judgment(${dropdown_port}, ${dropdown_judgment}, ${inp})\n`;
    return code;
};

Blockly.cake['sensing_reflected_light_detection'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = `Sensing_reflected_light_detection(${dropdown_port})\n`;
    return code;
};

Blockly.cake['sensing_line_inspection_judgment'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let dropdown_line = block.getFieldValue('line');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['sensing_ultrasonic_judgment'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let dropdown_judgment = block.getFieldValue('judgment');
    let inp = block.getFieldValue('value');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['sensing_ultrasonic_detection'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['sensing_sound_intensity'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['sensing_key_judgment'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let dropdown_status = block.getFieldValue('status');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['sensing_key_press'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let dropdown_status = block.getFieldValue('status');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['sensing_gyroscope_acceleration'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['sensing_gyroscope_attitude'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['sensing_gyroscope_angle'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['sensing_magnetic_calibration'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['sensing_magnetism'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['sensing_compass'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['sensing_read_pin'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['sensing_write_pin'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let pin = block.getFieldValue('pin');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['sensing_write_analog'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let pin = block.getFieldValue('pin');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['sensing_read_analog'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['sensing_timer'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['sensing_reset_timer'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};