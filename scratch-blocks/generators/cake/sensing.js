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

Blockly.cake['sensing_get_gray_line'] = function (block) {
    const port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
    const value = block.getFieldValue("VALUES");
    const code = `sensing_get_gray_line(${Blockly.cake.toStr(port) ? port : '"' + port + '"'}, ${Blockly.cake.toStr(value) ? value : '"' + value + '"'})`;
    return [code, Blockly.cake.ORDER_ATOMIC];
};