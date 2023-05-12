'use strict';

goog.provide('Blockly.cake.sound');

goog.require('Blockly.cake');

Blockly.cake['sound_playuntildone'] = function (block) {
    let sound = block.getFieldValue('SOUND_MENU');
    let code = '...';
    return 'playuntildone(' + code + ')\n';
}