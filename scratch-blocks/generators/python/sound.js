'use strict';

goog.provide('Blockly.Python.sound');

goog.require('Blockly.Python');


Blockly.Python['sound_sounds_menu'] = function (block) {
    let sound = block.getFieldValue('SOUND_MENU');
    return [sound, Blockly.Python.ORDER_ATOMIC];
}

Blockly.Python['sound_playuntildone'] = function (block) {
    let sound = Blockly.Python.valueToCode(block, "SOUND_MENU", Blockly.Python.ORDER_ATOMIC);
    if (!sound) return '';
    const soundItem = `${sound}.wav`;
    if (!Blockly.Python.soundslist.includes(soundItem)) {
        Blockly.Python.soundslist.push(soundItem);
    }
    const code = `untildone("${sound}.wav")\n`
    return Blockly.Python.handleResult(code, Blockly.Python.SOUND_TYPE);
}

Blockly.Python['sound_play'] = function (block) {
    let sound = Blockly.Python.valueToCode(block, "SOUND_MENU", Blockly.Python.ORDER_ATOMIC);
    if (!sound) return '';
    const soundItem = `${sound}.wav`;
    if (!Blockly.Python.soundslist.includes(soundItem)) {
        Blockly.Python.soundslist.push(soundItem);
    }
    const code = `play("${sound}.wav")\n`
    return Blockly.Python.handleResult(code, Blockly.Python.SOUND_TYPE);
}

Blockly.Python['sound_stopallsounds'] = function (block) {
    const code = `stop()\n`
    return Blockly.Python.handleResult(code, Blockly.Python.SOUND_TYPE);
}

Blockly.Python['sound_setvolumeto'] = function (block) {
    let volume = Blockly.Python.valueToCode(block, "VOLUME", Blockly.Python.ORDER_ATOMIC);
    const code = `setvolumeto(${volume})\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.SOUND_TYPE);
}

Blockly.Python['sound_PlayMusic'] = function (block) {
    let note = Blockly.Python.valueToCode(block, "NOTE", Blockly.Python.ORDER_ATOMIC);
    if (note === '0') {
        note = 'C';
    }
    note = note[0].toLowerCase() + note.slice(1);
    if (note.length === 1) {
        note = note + '-';
    }
    const beats = Blockly.Python.valueToCode(block, "BEATS", Blockly.Python.ORDER_ATOMIC);
    const code = `soundPianomusic("${note}.wav", ${beats})\n`;
    return Blockly.Python.handleResult(code, Blockly.Python.SOUND_TYPE);
}