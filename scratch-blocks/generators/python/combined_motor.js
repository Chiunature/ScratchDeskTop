'use strict';

goog.provide('Blockly.Python.combined_motor');

goog.require('Blockly.Python');

Blockly.Python['combined_motor_box'] = function (block) {
    const menu = block.getFieldValue('MOTOR');
    // TODO: Assemble Python into code variable.
    return [menu, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['combined_motorOne_menu'] = function (block) {
    const menu = block.getFieldValue('COMBINED_MOTORONE_MENU');
    // TODO: Assemble Python into code variable.
    return [menu, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['combined_motorTwo_menu'] = function (block) {
    const menu = block.getFieldValue('COMBINED_MOTORTWO_MENU');
    // TODO: Assemble Python into code variable.
    return [menu, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['combined_motor_starting'] = function (block) {
    const port = Blockly.Python.valueToCode(block, "PORT", Blockly.Python.ORDER_NONE);
    let newPort;
    if(typeof port === 'string') {
        newPort = port.split('+');
    }else {
        newPort = port;
    }
    if(newPort.length > 1) {
        newPort = newPort.join('+');
    }else {
        newPort = newPort[0];
    }
    // TODO: Assemble Python into code variable.
    const code = `SetDoubleMotorid(${Blockly.Python.toStr(newPort) ? newPort : '"' + newPort + '"'})\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};

Blockly.Python['combined_motor_direction'] = function (block) {
    let direction = block.getFieldValue('direction');
    direction = direction[0].toLowerCase() + direction.slice(1);
    // const {one, two} = Blockly.Python.combinedMotor(block, "PORT1", "PORT2");
    // TODO: Assemble Python into code variable.
    const code = `DoubleMotorStart("${direction}")\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};

Blockly.Python['combined_motor_speed'] = function (block) {
    // const {one, two} = Blockly.Python.combinedMotor(block, "PORT1", "PORT2");
    const speed = Blockly.Python.valueToCode(block, "SPEED", Blockly.Python.ORDER_NONE);
    // TODO: Assemble Python into code variable.
    // const code = `motor_combined_speed("${one}", "${two}", ${speed});\n`;
    const code = `DoubleMotorSpeed(${speed})\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};

Blockly.Python['combined_motor_turn'] = function (block) {
    const spin = block.getFieldValue('SPIN');
    const angle = Blockly.Python.valueToCode(block, "ANGLE", Blockly.Python.ORDER_NONE);
    const distance = block.getFieldValue('distance');
    const unit = block.getFieldValue('unit');
    const {one, two} = Blockly.Python.combinedMotor(block, "PORT1", "PORT2");
    // TODO: Assemble Python into code variable.
    const code = `motor_combined_turn(`+`${Blockly.Python.toStr(one) ? one : '"' + one + '"'},`+ 
    `${Blockly.Python.toStr(two) ? two : '"' + two + '"'},`+
    `${Blockly.Python.toStr(spin) ? spin : '"' + spin + '"'},`+
    `${Blockly.Python.toStr(angle) ? angle : '"' + angle + '"'},`+ 
    `${Blockly.Python.toStr(distance) ? distance : '"' + distance + '"'},`+
    `${Blockly.Python.toStr(unit) ? unit : '"' + unit + '"'})\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};

Blockly.Python['combined_motor_line'] = function (block) {
    let line = block.getFieldValue('line');
    line = line[0].toLowerCase() + line.slice(1);
    const distance = Blockly.Python.valueToCode(block, "distance", Blockly.Python.ORDER_NONE);
    const unit = block.getFieldValue('unit');
    // const {one, two} = Blockly.Python.combinedMotor(block, "PORT1", "PORT2");
    // TODO: Assemble Python into code variable.
    // const code = `motor_combined_line("${one}", "${two}", "${line}", ${distance}, "${unit}");\n`;
    const code = `DoubleMotorLine("${line}", ${distance}, "${unit}")\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};

Blockly.Python['combined_motor_stop'] = function (block) {
    // const {one, two} = Blockly.Python.combinedMotor(block, "PORT1", "PORT2");
    // TODO: Assemble Python into code variable.
    // const code = `motor_combined_stop("${one}", "${two}");\n`;
    const code = `DoubleMotorStop()\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};

Blockly.Python['combined_motor_move'] = function (block) {
    const left = Blockly.Python.valueToCode(block, "left", Blockly.Python.ORDER_NONE);
    const right = Blockly.Python.valueToCode(block, "right", Blockly.Python.ORDER_NONE);
    const distance = block.getFieldValue('distance');
    const result = block.getFieldValue('result');
    // TODO: Assemble Python into code variable.
    const code = `motor_combined_move(${Blockly.Python.toStr(left) ? left : '"' + left + '"'}, ${Blockly.Python.toStr(right) ? right : '"' + right + '"'}, ${Blockly.Python.toStr(distance) ? distance : '"' + distance + '"'}, ${Blockly.Python.toStr(result) ? result : '"' + result + '"'})\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};

Blockly.Python['combined_motor_movestep'] = function (block) {
    const left = Blockly.Python.valueToCode(block, "left", Blockly.Python.ORDER_NONE);
    const right = Blockly.Python.valueToCode(block, "right", Blockly.Python.ORDER_NONE);
    // const {one, two} = Blockly.Python.combinedMotor(block, "PORT1", "PORT2");
    // TODO: Assemble Python into code variable.
    // const code = `motor_combined_movestep("${one}", "${two}", ${left}, ${right});\n`;
    const code = `SetDoubleMotorSpeed(${left}, ${right})\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};

Blockly.Python['combined_motor_angle'] = function (block) {
    const angle = Blockly.Python.valueToCode(block, "ANGLE", Blockly.Python.ORDER_NONE);
    // TODO: Assemble Python into code variable.
    const code = `motor_combined_angle(${Blockly.Python.toStr(angle) ? angle : '"' + angle + '"'})\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};

Blockly.Python['combined_motor_stopping'] = function (block) {
    const style = block.getFieldValue('status');
    // const {one, two} = Blockly.Python.combinedMotor(block, "PORT1", "PORT2");
    // TODO: Assemble Python into code variable.
    // const code = `motor_combined_stopping("${one}", "${two}", "${style}");\n`;
    const code = `SetDoubleStopMode("${style}")\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};

Blockly.Python['combined_motor_startWithPower'] = function (block) {
    const one = Blockly.Python.valueToCode(block, "POWER_ONE", Blockly.Python.ORDER_NONE);
    const two = Blockly.Python.valueToCode(block, "POWER_TWO", Blockly.Python.ORDER_NONE);
    const code = `DoubleMotorPowerStart(${one}, ${two})\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};

Blockly.Python['combined_motor_startWithPowerObj'] = function (block) {
    const one = Blockly.Python.valueToCode(block, "POWER_ONE", Blockly.Python.ORDER_NONE);
    const two = Blockly.Python.valueToCode(block, "POWER_TWO", Blockly.Python.ORDER_NONE);
    const count = Blockly.Python.valueToCode(block, "COUNT", Blockly.Python.ORDER_NONE);
    const unit = block.getFieldValue('unit');
    const code = `DoubleMotorPowerObj(${one}, ${two}, ${count}, "${unit}")\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};

Blockly.Python['combined_motor_moveByYawAngle'] = function (block) {
    const count = Blockly.Python.valueToCode(block, "COUNT", Blockly.Python.ORDER_NONE);
    const KP = Blockly.Python.valueToCode(block, "KP", Blockly.Python.ORDER_NONE);
    const unit = block.getFieldValue('unit');
    let direction = block.getFieldValue('direction');
    direction = direction[0].toLowerCase() + direction.slice(1);
    const code = `DoubleMotorStraight("${direction}", ${count}, "${unit}", ${KP})\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
}; 

Blockly.Python['combined_motor_spinByYawAngle'] = function (block) {
    const angle = Blockly.Python.valueToCode(block, "ANGLE", Blockly.Python.ORDER_NONE);
    const code = `DoubleMotorRangerAngle(${angle})\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};

Blockly.Python['combined_motor_pwm'] = function (block) {
    const left = Blockly.Python.valueToCode(block, "LEFT_PWM", Blockly.Python.ORDER_NONE);
    const right = Blockly.Python.valueToCode(block, "RIGHT_PWM", Blockly.Python.ORDER_NONE);
    // TODO: Assemble Python into code variable.
    const code = `motor_combined_pwm(${Blockly.Python.toStr(left) ? left : '"' + left + '"'}, ${Blockly.Python.toStr(right) ? right : '"' + right + '"'})\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.MOTOR_TYPE);
};