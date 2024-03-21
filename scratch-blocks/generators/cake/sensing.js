'use strict';

goog.provide('Blockly.cake.sensing');

goog.require('Blockly.cake');


Blockly.cake['sensing_menu'] = function (block) {
    const menu = block.getFieldValue('SENSING_MENU');
    // TODO: Assemble cake into code variable.
    return [menu, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_color_menu'] = function (block) {
    const menu = block.getFieldValue('COLOR');
    // TODO: Assemble cake into code variable.
    return [menu, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_color_judgment'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    let color = Blockly.cake.valueToCode(block, "COLOR", Blockly.cake.ORDER_NONE);
    let newColor;
    if (color.indexOf('(') === -1) {
        const pre = Blockly.cake.hexToRgb(color);
        // const target = Blockly.cake.rgbToGrb(pre);
        const last = Blockly.cake.grbToHex(pre);
        if (!last) {
            return;
        }
        newColor = last.replace(/\'/g, '');
        newColor = parseInt(newColor).toString();
    } else {
        newColor = color;
    }
    // TODO: Assemble cake into code variable.
    let code = `Sensing_color_judgment(${Blockly.cake.toStr(port) ? port : '"' + port + '1"'}, ${Blockly.cake.toStr(newColor) ? newColor : '"' + newColor + '"'})`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_color_detection'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `Sensing_color_detection(${Blockly.cake.toStr(port) ? port : '"' + port + '1"'})`;
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
    let code = `Sensing_color_detectionRGB(${Blockly.cake.toStr(port) ? port : '"' + port + '1"'}, ${Blockly.cake.toStr(rgb) ? rgb : '"' + rgb + '"'})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_reflected_light_judgment'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    let judgment = block.getFieldValue('judgment');
    let inp = Blockly.cake.valueToCode(block, "value", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `Sensing_Reflected_light_judgment(${Blockly.cake.toStr(port) ? port : '"' + port + '1"'}, ${Blockly.cake.toStr(judgment) ? judgment : '"' + judgment + '"'}, ${Blockly.cake.toStr(inp) ? inp : '"' + inp + '"'})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_reflected_light_detection'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `Sensing_reflected_light_detection(${Blockly.cake.toStr(port) ? port : '"' + port + '1"'})`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_line_inspection_judgment'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    let line = block.getFieldValue('line');
    // TODO: Assemble cake into code variable.
    let code = `Sensing_Line_inspection_judgment(${Blockly.cake.toStr(port) ? port : '"' + port + '1"'}, ${Blockly.cake.toStr(line) ? line : '"' + line + '"'})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_ultrasonic_judgment'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    let judgment = block.getFieldValue('judgment');
    let inp = Blockly.cake.valueToCode(block, "value", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `sensing_ultrasonic_judgment(${Blockly.cake.toStr(port) ? port : '"' + port + '1"'}, ${Blockly.cake.toStr(judgment) ? judgment : '"' + judgment + '"'}, ${Blockly.cake.toStr(inp) ? inp : '"' + inp + '"'})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_ultrasonic_detection'] = function (block) {
    let port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `sensing_ultrasonic_detection(${Blockly.cake.toStr(port) ? port : '"' + port + '1"'})`;
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
    let code = `DetectingTouch(${Blockly.cake.toStr(port) ? port : '"' + port + '1"'})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_key_press'] = function (block) {
    let port = block.getFieldValue('PORT');
    let status = block.getFieldValue('status');
    // TODO: Assemble cake into code variable.
    let code = `Sensing_key_press(${Blockly.cake.toStr(port) ? port : '"' + port + '1"'}, ${Blockly.cake.toStr(status) ? status : '"' + status + '"'})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_gyroscope_acceleration'] = function (block) {
    let directiion = block.getFieldValue('directiion');
    // TODO: Assemble cake into code variable.
    let value = Blockly.cake.setValueList('sensing');
    let code = `sensing_gyroscope_acceleration(${Blockly.cake.toStr(directiion) ? directiion : '"' + directiion + '"'}, ${value})`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_gyroscope_attitude'] = function (block) {
    let attitude = block.getFieldValue('attitude');
    // TODO: Assemble cake into code variable.
    let code = `sensing_gyroscope_attitude(${Blockly.cake.toStr(attitude) ? attitude : '"' + attitude + '"'})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_gyroscope_angle'] = function (block) {
    let port = block.getFieldValue('PORT');
    // TODO: Assemble cake into code variable.
    let value = Blockly.cake.setValueList('sensing');
    let code = `sensing_AngleofAttitude(${Blockly.cake.toStr(port) ? port : '"' + port + '"'}, ${value})`;
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
    let code = `Sensing_magnetism(${Blockly.cake.toStr(direction) ? direction : '"' + direction + '"'})`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_compass'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = `Sensing_compass()`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['sensing_read_pin'] = function (block) {
    let dropdown_port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `Sensing_read_pin("${dropdown_port}1")`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_write_pin'] = function (block) {
    let dropdown_port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    let pin = block.getFieldValue('pin');
    // TODO: Assemble cake into code variable.
    let code = `Sensing_write_pin("${dropdown_port}1", ${pin})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_write_analog'] = function (block) {
    let dropdown_port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    let pin = block.getFieldValue('pin');
    // TODO: Assemble cake into code variable.
    let code = `Sensing_write_analog("${dropdown_port}1", ${pin})`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['sensing_read_analog'] = function (block) {
    let dropdown_port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `Sensing_read_analog("${dropdown_port}1")`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
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

Blockly.cake['sensing_set_yaw_angle'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = `sensing_setYawAngle();\n`;
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