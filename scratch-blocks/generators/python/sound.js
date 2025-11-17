"use strict";

goog.provide("Blockly.Python.sound");

goog.require("Blockly.Python");

Blockly.Python["sound_sounds_menu"] = function (block) {
  let sound = block.getFieldValue("SOUND_MENU");
  return [sound, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["sound_playuntildone"] = function (block) {
  let sound = Blockly.Python.valueToCode(
    block,
    "SOUND_MENU",
    Blockly.Python.ORDER_ATOMIC
  );
  if (!sound) return "";
  sound = sound.replace(/\d/g, "");
  const soundItem = `${sound}.wav`;
  if (!Blockly.Python.soundslist.includes(soundItem)) {
    Blockly.Python.soundslist.push(soundItem);
  }
  const code = `untildone("${sound}.wav")\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.SOUND_TYPE);
};

Blockly.Python["sound_play"] = function (block) {
  let sound = Blockly.Python.valueToCode(
    block,
    "SOUND_MENU",
    Blockly.Python.ORDER_ATOMIC
  );
  if (!sound) return "";
  sound = sound.replace(/\d/g, "");
  const soundItem = `${sound}.wav`;
  if (!Blockly.Python.soundslist.includes(soundItem)) {
    Blockly.Python.soundslist.push(soundItem);
  }
  const code = `start("${sound}.wav")\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.SOUND_TYPE);
};

Blockly.Python["sound_stopallsounds"] = function (block) {
  const code = `stop()\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.SOUND_TYPE);
};

Blockly.Python["sound_setvolumeto"] = function (block) {
  let volume = Blockly.Python.valueToCode(
    block,
    "VOLUME",
    Blockly.Python.ORDER_ATOMIC
  );
  const code = `setvolumeto(${volume})\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.SOUND_TYPE);
};

Blockly.Python["sound_PlayMusic"] = function (block) {
  let note = Blockly.Python.valueToCode(
    block,
    "NOTE",
    Blockly.Python.ORDER_ATOMIC
  );
  note = note.toUpperCase();
  const beats = Blockly.Python.valueToCode(
    block,
    "BEATS",
    Blockly.Python.ORDER_ATOMIC
  );
  const code = `asyncio.create_task(note_play(${note}, ${beats}))\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.SOUND_TYPE);
};
