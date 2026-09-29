"use strict";

goog.provide("Blockly.Python.infrared");

goog.require("Blockly.Python");

/**
 * Infrared sensor: set the light color.
 * Generates `_ir_remote.set_color(port, state)`, where state is
 * 0-off / 1-red / 2-green / 3-blue.
 * @param {!Blockly.Block} block - block instance
 * @return {string} Generated Python code
 */
Blockly.Python["sensing_infrared_set_color"] = function (block) {
  const port = Blockly.Python.valueToCode(
    block,
    "PORT",
    Blockly.Python.ORDER_NONE
  );
  const state = block.getFieldValue("STATE");
  const portValue = Blockly.Python["sensing_port_to_number"](port);
  return Blockly.Python.handleResult(
    `set_color(${portValue}, ${state})\n`,
    Blockly.Python.IR_REMOTE_TYPE
  );
};