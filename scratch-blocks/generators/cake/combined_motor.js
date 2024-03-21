'use strict';

goog.provide('Blockly.cake.combined_motor');

goog.require('Blockly.cake');

Blockly.cake['combined_motor_box'] = function (block) {
    const menu = block.getFieldValue('MOTOR');
    // TODO: Assemble cake into code variable.
    return [menu, Blockly.cake.ORDER_ATOMIC];
};

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
    const port = Blockly.cake.valueToCode(block, "PORT", Blockly.cake.ORDER_NONE);
let newPort;
    if(typeof port === 'string') {
        newPort = port.split('+');
        for (let i = 0; i < newPort.length; i++) {
            newPort[i] = newPort[i] + '1';
        }
    }else {
        newPort = port;
    }
    if(newPort.length > 1) {
        newPort = newPort.join('+');
    }else {
        newPort = newPort[0];
    }
    // TODO: Assemble cake into code variable.
    const code = `motor_combined_starting(${Blockly.cake.toStr(newPort) ? newPort : '"' + newPort + '"'});\n`;
    return code;
};

Blockly.cake['combined_motor_direction'] = function (block) {
    const direction = block.getFieldValue('direction');
    // const {one, two} = Blockly.cake.combinedMotor(block, "PORT1", "PORT2");
    // TODO: Assemble cake into code variable.
    const code = `motor_combined_direction(${Blockly.cake.toStr(direction) ? direction : '"' + direction + '"'});\n`;
    return code;
};

Blockly.cake['combined_motor_speed'] = function (block) {
    // const {one, two} = Blockly.cake.combinedMotor(block, "PORT1", "PORT2");
    const speed = Blockly.cake.valueToCode(block, "SPEED", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    // const code = `motor_combined_speed("${one}", "${two}", ${speed});\n`;
    const code = `motor_combined_speed(${Blockly.cake.toStr(speed) ? speed : '"' + speed + '"'});\n`;
    return code;
};

Blockly.cake['combined_motor_turn'] = function (block) {
    const spin = block.getFieldValue('SPIN');
    const angle = Blockly.cake.valueToCode(block, "ANGLE", Blockly.cake.ORDER_NONE);
    const distance = block.getFieldValue('distance');
    const unit = block.getFieldValue('unit');
    const {one, two} = Blockly.cake.combinedMotor(block, "PORT1", "PORT2");
    // TODO: Assemble cake into code variable.
    const code = `motor_combined_turn(`+`${Blockly.cake.toStr(one) ? one : '"' + one + '"'},`+ 
    `${Blockly.cake.toStr(two) ? two : '"' + two + '"'},`+
    `${Blockly.cake.toStr(spin) ? spin : '"' + spin + '"'},`+
    `${Blockly.cake.toStr(angle) ? angle : '"' + angle + '"'},`+ 
    `${Blockly.cake.toStr(distance) ? distance : '"' + distance + '"'},`+
    `${Blockly.cake.toStr(unit) ? unit : '"' + unit + '"'});\n`;
    return code;
};

Blockly.cake['combined_motor_line'] = function (block) {
    const line = block.getFieldValue('line');
    const distance = Blockly.cake.valueToCode(block, "distance", Blockly.cake.ORDER_NONE);
    const unit = block.getFieldValue('unit');
    // const {one, two} = Blockly.cake.combinedMotor(block, "PORT1", "PORT2");
    // TODO: Assemble cake into code variable.
    // const code = `motor_combined_line("${one}", "${two}", "${line}", ${distance}, "${unit}");\n`;
    const code = `motor_combined_line(${Blockly.cake.toStr(line) ? line : '"' + line + '"'}, ${Blockly.cake.toStr(distance) ? distance : '"' + distance + '"'}, ${Blockly.cake.toStr(unit) ? unit : '"' + unit + '"'});\n`;
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
    const code = `motor_combined_move(${Blockly.cake.toStr(left) ? left : '"' + left + '"'}, ${Blockly.cake.toStr(right) ? right : '"' + right + '"'}, ${Blockly.cake.toStr(distance) ? distance : '"' + distance + '"'}, ${Blockly.cake.toStr(result) ? result : '"' + result + '"'});\n`;
    return code;
};

Blockly.cake['combined_motor_movestep'] = function (block) {
    const left = Blockly.cake.valueToCode(block, "left", Blockly.cake.ORDER_NONE);
    const right = Blockly.cake.valueToCode(block, "right", Blockly.cake.ORDER_NONE);
    // const {one, two} = Blockly.cake.combinedMotor(block, "PORT1", "PORT2");
    // TODO: Assemble cake into code variable.
    // const code = `motor_combined_movestep("${one}", "${two}", ${left}, ${right});\n`;
    const code = `motor_combined_movestep(${Blockly.cake.toStr(left) ? left : '"' + left + '"'}, ${Blockly.cake.toStr(right) ? right : '"' + right + '"'});\n`;
    return code;
};

Blockly.cake['combined_motor_angle'] = function (block) {
    const angle = Blockly.cake.valueToCode(block, "ANGLE", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    const code = `motor_combined_angle(${Blockly.cake.toStr(angle) ? angle : '"' + angle + '"'});\n`;
    return code;
};

Blockly.cake['combined_motor_stopping'] = function (block) {
    const style = block.getFieldValue('status');
    // const {one, two} = Blockly.cake.combinedMotor(block, "PORT1", "PORT2");
    // TODO: Assemble cake into code variable.
    // const code = `motor_combined_stopping("${one}", "${two}", "${style}");\n`;
    const code = `motor_combined_stopping(${Blockly.cake.toStr(style) ? style : '"' + style + '"'});\n`;
    return code;
};

Blockly.cake['combined_motor_startWithPower'] = function (block) {
    const one = Blockly.cake.valueToCode(block, "POWER_ONE", Blockly.cake.ORDER_NONE);
    const two = Blockly.cake.valueToCode(block, "POWER_TWO", Blockly.cake.ORDER_NONE);
    const code = `combined_motor_startWithPower(${Blockly.cake.toStr(one) ? one : '"' + one + '"'}, ${Blockly.cake.toStr(two) ? two : '"' + two + '"'});\n`;
    return code;
};