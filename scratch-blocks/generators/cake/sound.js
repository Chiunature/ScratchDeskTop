'use strict';

goog.provide('Blockly.cake.sound');

goog.require('Blockly.cake');


Blockly.cake['sound_sounds_menu'] = function (block) {
    let sound = block.getFieldValue('SOUND_MENU');
    return sound;
}

Blockly.cake['sound_playuntildone'] = function (block) {
    let sound = Blockly.cake.valueToCode(block, "SOUND_MENU", Blockly.cake.ORDER_ATOMIC);
    return `sound_playuntildone("${sound}");\n`;
}

Blockly.cake['sound_play'] = function (block) {
    let sound = Blockly.cake.valueToCode(block, "SOUND_MENU", Blockly.cake.ORDER_ATOMIC);
    return `sound_play("${sound}");\n`;
}

Blockly.cake['sound_stopallsounds'] = function (block) {
    return 'sound_stopallsounds();\n';
}

Blockly.cake['sound_seteffectto'] = function (block) {
    let effect = block.getFieldValue('EFFECT');
    let value = Blockly.cake.valueToCode(block, "VALUE", Blockly.cake.ORDER_ATOMIC);
    return `sound_seteffectto("${effect}", ${value});\n`;
}

Blockly.cake['sound_changeeffectby'] = function (block) {
    let effect = block.getFieldValue('EFFECT');
    let value = Blockly.cake.valueToCode(block, "VALUE", Blockly.cake.ORDER_ATOMIC);
    return `sound_changeeffectby("${effect}", ${value});\n`;
}

Blockly.cake['sound_cleareffects'] = function (block) {
    return 'sound_cleareffects();\n';
}

Blockly.cake['sound_changevolumeby'] = function (block) {
    let volume = Blockly.cake.valueToCode(block, "VOLUME", Blockly.cake.ORDER_ATOMIC);
    return `sound_changevolumeby(${volume});\n`;
}

Blockly.cake['sound_setvolumeto'] = function (block) {
    let volume = Blockly.cake.valueToCode(block, "VOLUME", Blockly.cake.ORDER_ATOMIC);
    return `sound_setvolumeto(${volume});\n`;
}