'use strict';

goog.provide('Blockly.cake.sound');

goog.require('Blockly.cake');


Blockly.cake['sound_sounds_menu'] = function (block) {
    let sound = block.getFieldValue('SOUND_MENU');
    return [sound, Blockly.cake.ORDER_ATOMIC];
}

Blockly.cake['sound_playuntildone'] = function (block) {
    let sound = Blockly.cake.valueToCode(block, "SOUND_MENU", Blockly.cake.ORDER_ATOMIC);
    if (!sound) return '';
    const soundItem = `${sound}.wav`;
    if (!Blockly.cake.soundslist.includes(soundItem)) {
        Blockly.cake.soundslist.push(soundItem);
    }
    return `sound_playuntildone("${sound}.wav");\n`;
}

Blockly.cake['sound_play'] = function (block) {
    let sound = Blockly.cake.valueToCode(block, "SOUND_MENU", Blockly.cake.ORDER_ATOMIC);
    if (!sound) return '';
    const soundItem = `${sound}.wav`;
    if (!Blockly.cake.soundslist.includes(soundItem)) {
        Blockly.cake.soundslist.push(soundItem);
    }
    return `sound_play("1:/music/${sound}.wav");\n`;
}

Blockly.cake['sound_stopallsounds'] = function (block) {
    return 'sound_stopallsounds();\n';
}

Blockly.cake['sound_seteffectto'] = function (block) {
    let effect = block.getFieldValue('EFFECT');
    let value = Blockly.cake.valueToCode(block, "VALUE", Blockly.cake.ORDER_ATOMIC);
    return `sound_seteffectto("${effect}", "${value}");\n`;
}

Blockly.cake['sound_changeeffectby'] = function (block) {
    let effect = block.getFieldValue('EFFECT');
    let value = Blockly.cake.valueToCode(block, "VALUE", Blockly.cake.ORDER_ATOMIC);
    return `sound_changeeffectby("${effect}", "${value}");\n`;
}

Blockly.cake['sound_cleareffects'] = function (block) {
    return 'sound_cleareffects();\n';
}

Blockly.cake['sound_changevolumeby'] = function (block) {
    let volume = Blockly.cake.valueToCode(block, "VOLUME", Blockly.cake.ORDER_ATOMIC);
    return `sound_changevolumeby("${volume}");\n`;
}

Blockly.cake['sound_setvolumeto'] = function (block) {
    let volume = Blockly.cake.valueToCode(block, "VOLUME", Blockly.cake.ORDER_ATOMIC);
    return `sound_setvolumeto(${Blockly.cake.toStr(volume) ? volume : '"' + volume + '"'});\n`;
}

Blockly.cake['sound_setPlaySpeed'] = function (block) {
    let speed = Blockly.cake.valueToCode(block, "SPEED", Blockly.cake.ORDER_ATOMIC);
    return `sound_setPlaySpeed(${Blockly.cake.toStr(speed) ? speed : '"' + speed + '"'});\n`;
}

Blockly.cake['sound_PlayMusic'] = function (block) {
    let note = Blockly.cake.valueToCode(block, "NOTE", Blockly.cake.ORDER_ATOMIC);
    let beats = Blockly.cake.valueToCode(block, "BEATS", Blockly.cake.ORDER_ATOMIC);
    return `sound_playMusic(${Blockly.cake.toStr(note) ? note : '"' + note + '"'}, ${Blockly.cake.toStr(beats) ? beats : '"' + beats + '"'});\n`;
}