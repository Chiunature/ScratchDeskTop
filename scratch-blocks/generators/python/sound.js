"use strict";

goog.provide("Blockly.Python.sound");

goog.require("Blockly.Python");

Blockly.Python["sound_sounds_menu"] = function (block) {
  let sound = block.getFieldValue("SOUND_MENU");
  return [sound, Blockly.Python.ORDER_ATOMIC];
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
