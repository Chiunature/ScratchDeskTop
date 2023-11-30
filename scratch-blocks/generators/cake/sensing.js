'use strict';

goog.provide('Blockly.cake.sensing');

goog.require('Blockly.cake');

Blockly.cake['sensing_color_judgment'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let color = block.getFieldValue("COLOR");
    // TODO: Assemble cake into code variable.
    let code = `Sensing_color_judgment("${dropdown_port}1", ${color})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_color_detection'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = `Sensing_color_detection("${dropdown_port}1")`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_color_detectionRGB'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let color = block.getFieldValue('color');
    let rgb;
    switch (color) {
        case "red":
            rgb = '0xFF0000'
            break;
        case "green":
            rgb = '0x00FF00'
            break;
        case "blue":
            rgb = '0x0000FF'
            break;
        default:
            break;
    }
    // TODO: Assemble cake into code variable.
    let code = `Sensing_color_detectionRGB("${dropdown_port}1", ${rgb.replace(/\'/g, '')})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_reflected_light_judgment'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let dropdown_judgment = block.getFieldValue('judgment');
    let inp = Blockly.cake.valueToCode(block, "value", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `Sensing_Reflected_light_judgment("${dropdown_port}1","${dropdown_judgment}", ${inp})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_reflected_light_detection'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = `Sensing_reflected_light_detection("${dropdown_port}1")`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_line_inspection_judgment'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let dropdown_line = block.getFieldValue('line');
    // TODO: Assemble cake into code variable.
    let code = `Sensing_Line_inspection_judgment("${dropdown_port}1", "${dropdown_line}")`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_ultrasonic_judgment'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let dropdown_judgment = block.getFieldValue('judgment');
    let inp = Blockly.cake.valueToCode(block, "value", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `sensing_ultrasonic_judgment("${dropdown_port}1", "${dropdown_judgment}", ${inp})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_ultrasonic_detection'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = `sensing_ultrasonic_detection("${dropdown_port}1")`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_sound_intensity'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = `sensing_sound_intensity()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_key_judgment'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = `DetectingTouch("${dropdown_port}1")`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_key_press'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let dropdown_status = block.getFieldValue('status');
    // TODO: Assemble cake into code variable.
    let code = `Sensing_key_press("${dropdown_port}1", "${dropdown_status}")`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_gyroscope_acceleration'] = function (block) {
    let directiion = block.getFieldValue('directiion');
    // TODO: Assemble cake into code variable.
    let code = `sensing_gyroscope_acceleration("${directiion}")`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_gyroscope_attitude'] = function (block) {
    let attitude = block.getFieldValue('attitude');
    // TODO: Assemble cake into code variable.
    let code = `sensing_gyroscope_attitude("${attitude}")`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_gyroscope_angle'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = `Sensing_gyroscope_angle("${dropdown_port}1")`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_magnetic_calibration'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = `Sensing_magnetic_calibration();\n`;
    return code;
};

Blockly.cake['sensing_magnetism'] = function (block) {
    let direction = block.getFieldValue('direction');
    // TODO: Assemble cake into code variable.
    let code = `Sensing_magnetism("${direction}")`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_compass'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = `Sensing_compass()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_read_pin'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = `Sensing_read_pin("${dropdown_port}1")`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_write_pin'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let pin = block.getFieldValue('pin');
    // TODO: Assemble cake into code variable.
    let code = `Sensing_write_pin("${dropdown_port}1", ${pin})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_write_analog'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let pin = block.getFieldValue('pin');
    // TODO: Assemble cake into code variable.
    let code = `Sensing_write_analog("${dropdown_port}1", ${pin})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_read_analog'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let code = `Sensing_read_analog("${dropdown_port}1")`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_timer'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = `Sensing_timer()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_reset_timer'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = `Sensing_reset_timer();\n`;
    return code;
};

Blockly.cake['sensing_dayssince2000'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = `Sensing_dayssince()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_current'] = function (block) {
    let current = block.getFieldValue('CURRENTMENU');
    // TODO: Assemble cake into code variable.
    let code = `Sensing_current("${current}")`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_loudness'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = `Sensing_loudness()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};