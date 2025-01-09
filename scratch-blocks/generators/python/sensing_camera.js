'use strict';

goog.provide('Blockly.Python.sensing_camera');

goog.require('Blockly.Python');

Blockly.Python['sensing_camera_menu'] = function (block) {
    const menu = block.getFieldValue('SENSING_CAMERA_MENU');
    // TODO: Assemble Python into code variable.
    return [`"${menu}"`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_find_color_block'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const R = Blockly.Python.valueToCode(block, "R", Blockly.Python.ORDER_NONE);
    const G = Blockly.Python.valueToCode(block, "G", Blockly.Python.ORDER_NONE);
    const B = Blockly.Python.valueToCode(block, "B", Blockly.Python.ORDER_NONE);
    const T = Blockly.Python.valueToCode(block, "TOLERANCE", Blockly.Python.ORDER_NONE);
    const code = `findColorBlock(${port}, ${R}, ${G}, ${B}, ${T});\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE);
};

Blockly.Python['sensing_camera_find_color_state'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `findColorBlockState(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_find_color_block_x'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `findColorBlockX(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_find_color_block_y'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `findColorBlockY(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_find_color_pixel'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `findColorBlockPixel(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_middle_find'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const R = Blockly.Python.valueToCode(block, "R", Blockly.Python.ORDER_NONE);
    const G = Blockly.Python.valueToCode(block, "G", Blockly.Python.ORDER_NONE);
    const B = Blockly.Python.valueToCode(block, "B", Blockly.Python.ORDER_NONE);
    const radius = Blockly.Python.valueToCode(block, "RADIUS", Blockly.Python.ORDER_NONE);
    const code = `middlefind(${port}, ${radius}, ${R}, ${G}, ${B});\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE);
};

Blockly.Python['sensing_camera_middle_find_red'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `middle_find_red(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_middle_find_green'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `middle_find_green(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_middle_find_blue'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `middle_find_blue(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_extern_color'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `extern_color(${port});\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE);
};

Blockly.Python['sensing_camera_extern_red'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `extern_red(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_extern_green'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `extern_green(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_extern_blue'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `extern_blue(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_find_line'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `find_line(${port});\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE);
};

Blockly.Python['sensing_camera_find_line_state'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `find_line_state(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_find_line_showsex'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `find_line_showsex(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_find_line_rho'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `find_line_rho(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_find_line_theta'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `find_line_theta(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_number_check'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `number_check(${port});\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE);
};

Blockly.Python['sensing_camera_number_state'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `number_state(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_get_number'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `get_number(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_face_check'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `face_check(${port});\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE);
};

Blockly.Python['sensing_camera_face_state'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `face_state(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_face_x'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `face_x(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_face_y'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `face_y(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_face_trace'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `face_trace(${port});\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE);
};

Blockly.Python['sensing_camera_face_trace_state'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `face_trace_state(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_face_trace_x'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `face_trace_x(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_face_trace_y'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `face_trace_y(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_qr_check'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `qr_check(${port});\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE);
};

Blockly.Python['sensing_camera_qr_state'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `qr_state(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_apriltag'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `apriltag(${port});\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE);
};

Blockly.Python['sensing_camera_apriltag_state'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `apriltag_state(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_apriltag_id'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `apriltag_id(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_apriltag_x'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `apriltag_x(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_apriltag_y'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `apriltag_y(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_apriltag_roll'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `apriltag_roll(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_apriltag_distance'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `apriltag_distance(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_characteristic'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `characteristic(${port});\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE);
};

Blockly.Python['sensing_camera_characteristic_state'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `characteristic_state(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_characteristic_matchine'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `characteristic_matchine(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensing_camera_characteristic_roll'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    const code = `characteristic_roll(${port})`;
    return [Blockly.Python.handleResult(code, Blockly.Python.CAM_TYPE), Blockly.Python.ORDER_ATOMIC];
};