'use strict';

goog.provide('Blockly.cake.sensing_camera');

goog.require('Blockly.cake');

Blockly.cake['sensing_camera_menu'] = function (block) {
    const menu = block.getFieldValue('SENSING_CAMERA_MENU');
    // TODO: Assemble cake into code variable.
    return [menu + '1', Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_find_color_block'] = function (block) {
    const port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    const R = Blockly.cake.valueToCode(block, "R", Blockly.cake.ORDER_NONE);
    const G = Blockly.cake.valueToCode(block, "G", Blockly.cake.ORDER_NONE);
    const B = Blockly.cake.valueToCode(block, "B", Blockly.cake.ORDER_NONE);
    const T = Blockly.cake.valueToCode(block, "TOLERANCE", Blockly.cake.ORDER_NONE);
    const code = `camera_find_color_block(${Blockly.cake.toStr(port) ? port : '"' + port + '"'}, ${Blockly.cake.toStr(R) ? R : '"' + R + '"'}, ${Blockly.cake.toStr(G) ? G : '"' + G + '"'}, ${Blockly.cake.toStr(B) ? B : '"' + B + '"'}, ${Blockly.cake.toStr(T) ? T : '"' + T + '"'});`;
    return code;
};

Blockly.cake['sensing_camera_find_color_state'] = function (block) {
    const code = `camera_find_color_block_state()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_find_color_block_x'] = function (block) {
    const code = `camera_find_color_block_x()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_find_color_block_y'] = function (block) {
    const code = `camera_find_color_block_y()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_find_color_pixel'] = function (block) {
    const code = `camera_find_color_block_pixel()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_middle_find'] = function (block) {
    const port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    const R = Blockly.cake.valueToCode(block, "R", Blockly.cake.ORDER_NONE);
    const G = Blockly.cake.valueToCode(block, "G", Blockly.cake.ORDER_NONE);
    const B = Blockly.cake.valueToCode(block, "B", Blockly.cake.ORDER_NONE);
    const radius = Blockly.cake.valueToCode(block, "RADIUS", Blockly.cake.ORDER_NONE);
    const code = `camera_middle_find(${Blockly.cake.toStr(port) ? port : '"' + port + '"'}, ${Blockly.cake.toStr(radius) ? radius : '"' + radius + '"'}, ${Blockly.cake.toStr(R) ? R : '"' + R + '"'}, ${Blockly.cake.toStr(G) ? G : '"' + G + '"'}, ${Blockly.cake.toStr(B) ? B : '"' + B + '"'});`;
    return code;
};

Blockly.cake['sensing_camera_middle_find_red'] = function (block) {
    const code = `camera_middle_find_red()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_middle_find_green'] = function (block) {
    const code = `camera_middle_find_green()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_middle_find_blue'] = function (block) {
    const code = `camera_middle_find_blue()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_extern_color'] = function (block) {
    const port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    const code = `camera_extern_color(${Blockly.cake.toStr(port) ? port : '"' + port + '"'});`;
    return code;
};

Blockly.cake['sensing_camera_extern_red'] = function (block) {
    const port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    const code = `camera_extern_red(${Blockly.cake.toStr(port) ? port : '"' + port + '"'})`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_extern_green'] = function (block) {
    const port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    const code = `camera_extern_green(${Blockly.cake.toStr(port) ? port : '"' + port + '"'})`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_extern_blue'] = function (block) {
    const port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    const code = `camera_extern_blue(${Blockly.cake.toStr(port) ? port : '"' + port + '"'})`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_find_line'] = function (block) {
    const port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    const code = `camera_find_line(${Blockly.cake.toStr(port) ? port : '"' + port + '"'});`;
    return code;
};

Blockly.cake['sensing_camer_find_line_state'] = function (block) {
    const code = `camer_find_line_state()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camer_find_line_showsex'] = function (block) {
    const code = `camer_find_line_showsex()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camer_find_line_rho'] = function (block) {
    const code = `camer_find_line_rho()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camer_find_line_theta'] = function (block) {
    const code = `camer_find_line_theta()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_number_check'] = function (block) {
    const port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    const code = `camera_number_check(${Blockly.cake.toStr(port) ? port : '"' + port + '"'});`;
    return code;
};

Blockly.cake['sensing_camer_number_state'] = function (block) {
    const code = `camer_number_state()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_get_number'] = function (block) {
    const code = `camera_get_number()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_face_check'] = function (block) {
    const port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    const code = `camera_face_check(${Blockly.cake.toStr(port) ? port : '"' + port + '"'});`;
    return code;
};

Blockly.cake['sensing_camera_face_state'] = function (block) {
    const code = `camera_face_state()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_face_x'] = function (block) {
    const code = `camera_face_x()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_face_y'] = function (block) {
    const code = `camera_face_y()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_face_trace'] = function (block) {
    const port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    const code = `camera_face_trace(${Blockly.cake.toStr(port) ? port : '"' + port + '"'});`;
    return code;
};

Blockly.cake['sensing_camera_face_trace_state'] = function (block) {
    const code = `camera_face_trace_state()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_face_trace_x'] = function (block) {
    const code = `camera_face_trace_x()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_face_trace_y'] = function (block) {
    const code = `camera_face_trace_y()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_qr_check'] = function (block) {
    const port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    const code = `camera_qr_check(${Blockly.cake.toStr(port) ? port : '"' + port + '"'});`;
    return code;
};

Blockly.cake['sensing_camera_qr_state'] = function (block) {
    const code = `camer_qr_state()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_apriltag'] = function (block) {
    const port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    const code = `camera_apriltag(${Blockly.cake.toStr(port) ? port : '"' + port + '"'});`;
    return code;
};

Blockly.cake['sensing_camera_apriltag_state'] = function (block) {
    const code = `camera_apriltag_state()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_apriltag_id'] = function (block) {
    const code = `camera_apriltag_id()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_apriltag_x'] = function (block) {
    const code = `camera_apriltag_x()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_apriltag_y'] = function (block) {
    const code = `camera_apriltag_y()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_apriltag_roll'] = function (block) {
    const code = `camera_apriltag_roll()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_apriltag_distance'] = function (block) {
    const code = `camera_apriltag_distance()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_characteristic'] = function (block) {
    const port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    const code = `camera_characteristic(${Blockly.cake.toStr(port) ? port : '"' + port + '"'});`;
    return code;
};

Blockly.cake['sensing_camera_characteristic_state'] = function (block) {
    const code = `camera_characteristic_state()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_characteristic_matchine'] = function (block) {
    const code = `camera_characteristic_matchine()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_camera_characteristic_roll'] = function (block) {
    const code = `camera_characteristic_roll()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};