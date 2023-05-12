'use strict';

goog.provide('Blockly.cake.motion');

goog.require('Blockly.cake');

Blockly.cake['motion_movesteps'] = function (block) {
    let steps = Blockly.cake.valueToCode(block, "STEPS", Blockly.cake.ORDER_NONE);
    return 'movesteps(' + steps + ')\n';
};

Blockly.cake['motion_turnright'] = function (block) {
    let degress = Blockly.cake.valueToCode(block, "DEGREES", Blockly.cake.ORDER_NONE);
    return 'turnright(' + degress + ')\n';
};

Blockly.cake['motion_turnleft'] = function (block) {
    let degress = Blockly.cake.valueToCode(block, "DEGREES", Blockly.cake.ORDER_NONE);
    return 'turnleft(' + degress + ')\n';
};

Blockly.cake['motion_pointindirection'] = function (block) {
    let degress = Blockly.cake.valueToCode(block, "DIRECTION", Blockly.cake.ORDER_NONE);
    return 'pointindirection(' + degress + ')\n';
};

Blockly.cake['motion_gotoxy'] = function (block) {
    let x = Blockly.cake.valueToCode(block, "X", Blockly.cake.ORDER_NONE);
    let y = Blockly.cake.valueToCode(block, "Y", Blockly.cake.ORDER_NONE);
    return 'gotoxy(' + x + ',' + y + ')\n';
};

Blockly.cake['motion_glideto'] = function (block) {
    let SECS = Blockly.cake.valueToCode(block, "SECS", Blockly.cake.ORDER_NONE);
    let TO = Blockly.cake.valueToCode(block, "TO", Blockly.cake.ORDER_NONE);
    return 'glideto(' + SECS + ',' + TO + ')\n';
};

Blockly.cake['motion_glidesecstoxy'] = function (block) {
    let SECS = Blockly.cake.valueToCode(block, "SECS", Blockly.cake.ORDER_NONE);
    let x = Blockly.cake.valueToCode(block, "X", Blockly.cake.ORDER_NONE);
    let y = Blockly.cake.valueToCode(block, "Y", Blockly.cake.ORDER_NONE);
    return 'glidesecstoxy(' + SECS + ',' + x + ',' + y + ')\n';
};

Blockly.cake['motion_changexby'] = function (block) {
    let DX = Blockly.cake.valueToCode(block, "DX", Blockly.cake.ORDER_NONE);
    return 'changexby(' + DX + ')\n';
};

Blockly.cake['motion_setx'] = function (block) {
    let x = Blockly.cake.valueToCode(block, "X", Blockly.cake.ORDER_NONE);
    return 'setx(' + x + ')\n';
};

Blockly.cake['motion_changeyby'] = function (block) {
    let DY = Blockly.cake.valueToCode(block, "DY", Blockly.cake.ORDER_NONE);
    return 'changeyby(' + DY + ')\n';
};

Blockly.cake['motion_sety'] = function (block) {
    let y = Blockly.cake.valueToCode(block, "Y", Blockly.cake.ORDER_NONE);
    return 'sety(' + y + ')\n';
};

Blockly.cake['motion_ifonedgebounce'] = function (block) {
    return 'ifonedgebounce()\n';
};

Blockly.cake['motion_setrotationstyle'] = function (block) {
    let style = Blockly.cake.valueToCode(block, "STYLE", Blockly.cake.ORDER_NONE);
    return 'setrotationstyle(' + style + ')\n';
};