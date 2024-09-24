'use strict';

goog.provide('Blockly.cake.sensing');

goog.require('Blockly.cake');


Blockly.cake['sensing_menu'] = function (block) {
    const menu = block.getFieldValue('SENSING_MENU');
    // TODO: Assemble cake into code variable.
    return [menu + '1', Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_color_menu'] = function (block) {
    const menu = block.getFieldValue('COLOR');
    // TODO: Assemble cake into code variable.
    return [menu, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_color_judgment'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    let color = Blockly.cake.valueToCode(block, "COLOR", Blockly.cake.ORDER_NONE);
    let index = '0';
    const list = ["#ff000c", "#ffe360", "#0090f5", "#00cb54", "#914800", "#ad0000", "#000000", "#ffffff"];
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (item == color.replace(/'/g, '')) {
            index = i + 1 + '';
        }
    }
    let code = `Sensing_color_judgment(${Blockly.cake.toStr(port) ? port : '"' + port + '"'}, ${Blockly.cake.toStr(index) ? index : '"' + index + '"'})`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_color_detection'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `Sensing_color_detection(${Blockly.cake.toStr(port) ? port : '"' + port + '"'})`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_color_detectionRGB'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    let color = block.getFieldValue('color');
    let rgb;
    switch (color) {
        case "red":
            // rgb = '0xFF0000';
            rgb = "1";
            break;
        case "green":
            // rgb = '0x00FF00';
            rgb = "4";
            break;
        case "blue":
            // rgb = '0x0000FF';
            rgb = "3";
            break;
        default:
            break;
    }
    // TODO: Assemble cake into code variable.
    let code = `Sensing_color_detectionRGB(${Blockly.cake.toStr(port) ? port : '"' + port + '"'}, ${Blockly.cake.toStr(rgb) ? rgb : '"' + rgb + '"'})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_reflected_light_judgment'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    let judgment = block.getFieldValue('judgment');
    let inp = Blockly.cake.valueToCode(block, "value", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `Sensing_Reflected_light_judgment(${Blockly.cake.toStr(port) ? port : '"' + port + '"'}, ${Blockly.cake.toStr(judgment) ? judgment : '"' + judgment + '"'}, ${Blockly.cake.toStr(inp) ? inp : '"' + inp + '"'})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_reflected_light_detection'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `Sensing_reflected_light_detection(${Blockly.cake.toStr(port) ? port : '"' + port + '"'})`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_line_inspection_judgment'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    let line = block.getFieldValue('line');
    // TODO: Assemble cake into code variable.
    let code = `Sensing_Line_inspection_judgment(${Blockly.cake.toStr(port) ? port : '"' + port + '"'}, ${Blockly.cake.toStr(line) ? line : '"' + line + '"'})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_ultrasonic_judgment'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    let judgment = block.getFieldValue('judgment');
    let inp = Blockly.cake.valueToCode(block, "value", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `sensing_ultrasonic_judgment(${Blockly.cake.toStr(port) ? port : '"' + port + '"'}, ${Blockly.cake.toStr(judgment) ? judgment : '"' + judgment + '"'}, ${Blockly.cake.toStr(inp) ? inp : '"' + inp + '"'})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_ultrasonic_detection'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `sensing_ultrasonic_detection(${Blockly.cake.toStr(port) ? port : '"' + port + '"'})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_sound_intensity'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = `sensing_sound_intensity()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_key_judgment'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `DetectingTouch(${Blockly.cake.toStr(port) ? port : '"' + port + '"'})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};


Blockly.cake['sensing_gyroscope_acceleration'] = function (block) {
    if (!Blockly.cake.OPEN_GYROSCOPE_CALIBRATION.has('sensing_gyroscope_acceleration')) { 
        Blockly.cake.OPEN_GYROSCOPE_CALIBRATION.add('sensing_gyroscope_acceleration');
    }
    let directiion = block.getFieldValue('directiion');
    // TODO: Assemble cake into code variable.
    let value = Blockly.cake.setValueList('sensing');
    let code = `sensing_gyroscope_acceleration(${Blockly.cake.toStr(directiion) ? directiion : '"' + directiion + '"'}, ${value})`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_gyroscope_attitude'] = function (block) {
    if (!Blockly.cake.OPEN_GYROSCOPE_CALIBRATION.has('sensing_gyroscope_attitude')) { 
        Blockly.cake.OPEN_GYROSCOPE_CALIBRATION.add('sensing_gyroscope_attitude');
    }
    let attitude = block.getFieldValue('attitude');
    // TODO: Assemble cake into code variable.
    let code = `sensing_gyroscope_attitude(${Blockly.cake.toStr(attitude) ? attitude : '"' + attitude + '"'})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_gyroscope_angle'] = function (block) {
    if (!Blockly.cake.OPEN_GYROSCOPE_CALIBRATION.has('sensing_gyroscope_angle')) { 
        Blockly.cake.OPEN_GYROSCOPE_CALIBRATION.add('sensing_gyroscope_angle');
    }
    let port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let value = Blockly.cake.setValueList('sensing');
    let code = `sensing_AngleofAttitude(${Blockly.cake.toStr(port) ? port : '"' + port + '"'}, ${value})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};


Blockly.cake['sensing_compass'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = `Sensing_compass()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_timer'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = `time_clock()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_reset_timer'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = `ResetTimeClock();\n`;
    return code;
};

Blockly.cake['sensing_loudness'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = `Sensing_loudness()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_set_yaw_angle'] = function (block) {
    if (!Blockly.cake.OPEN_GYROSCOPE_CALIBRATION.has('sensing_set_yaw_angle')) { 
        Blockly.cake.OPEN_GYROSCOPE_CALIBRATION.add('sensing_set_yaw_angle');
    }
    // TODO: Assemble cake into code variable.
    let code = `sensing_set_yaw_angle();\n`;
    return code;
};

Blockly.cake['sensing_isHandling'] = function (block) {
    let keys = block.getFieldValue('KEYS');
    let button = block.getFieldValue('BUTTON');
    // TODO: Assemble cake into code variable.
    let code = `sensing_isHandling("${keys}", "${button}")`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_Handling'] = function (block) {
    let keys = block.getFieldValue('KEYS');
    let button = block.getFieldValue('BUTTON');
    // TODO: Assemble cake into code variable.
    let value = Blockly.cake.setValueList('sensing');
    let code = `sensing_Handling("${keys}", "${button}", ${value})`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_mainIsPress'] = function (block) {
    let keys = block.getFieldValue('KEYS');
    let button = block.getFieldValue('BUTTON');
    button = button === 'press' ? 1 : 0;
    // TODO: Assemble cake into code variable.
    let code = `Sensing_key_judment("${keys}", "${button}")`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};


Blockly.cake['sensing_color_range'] = function (block) {
  let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
  let rmin = Blockly.cake.valueToCode(block, "RMin", Blockly.cake.ORDER_NONE);
  let gmin = Blockly.cake.valueToCode(block, "GMin", Blockly.cake.ORDER_NONE);
  let bmin = Blockly.cake.valueToCode(block, "BMin", Blockly.cake.ORDER_NONE);
  let rmax = Blockly.cake.valueToCode(block, "RMax", Blockly.cake.ORDER_NONE);
  let gmax = Blockly.cake.valueToCode(block, "GMax", Blockly.cake.ORDER_NONE);
  let bmax = Blockly.cake.valueToCode(block, "BMax", Blockly.cake.ORDER_NONE);
  // TODO: Assemble cake into code variable.
    let code = 'Sensing_HSVColor(' +
    `${Blockly.cake.toStr(port) ? port : '"' + port + '"'}` + ', ' +
    `${Blockly.cake.toStr(rmin) ? rmin : '"' + rmin + '"'}` + ', ' +
    `${Blockly.cake.toStr(rmax) ? rmax : '"' + rmax + '"'}` + ', ' +
    `${Blockly.cake.toStr(gmin) ? gmin : '"' + gmin + '"'}` + ', ' +
    `${Blockly.cake.toStr(gmax) ? gmax : '"' + gmax + '"'}` + ', ' +
    `${Blockly.cake.toStr(bmin) ? bmin : '"' + bmin + '"'}` + ', ' +
    `${Blockly.cake.toStr(bmax) ? bmax : '"' + bmax + '"'}`
    + ')';
  return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_reflected_light_blackLine'] = function (block) {
    const port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    const value = Blockly.cake.valueToCode(block, "THRESHOLD", Blockly.cake.ORDER_NONE);
    const code = `Sensing_reflected_light_BlackLine(${Blockly.cake.toStr(port) ? port : '"' + port + '"'}, ${Blockly.cake.toStr(value) ? value : '"' + value + '"'})`;
    return [code, Blockly.cake.ORDER_ATOMIC];
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