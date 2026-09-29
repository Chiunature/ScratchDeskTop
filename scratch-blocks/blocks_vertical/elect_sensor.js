"use strict";

goog.provide("Blockly.Blocks.elect_sensor");

goog.require("Blockly.Blocks");
goog.require("Blockly.Colours");
goog.require("Blockly.constants");
goog.require("Blockly.ScratchBlocks.VerticalExtensions");

Blockly.Blocks["elect_sensor_menu"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_motor",
          name: "ELECT_SENSOR_MENU",
          motorList: ["A", "B", "C", "D", "E", "F", "G", "H"],
        },
      ],
      category: Blockly.Categories.elect_sensor,
      colour: Blockly.Colours.electSensor.primary,
      colourSecondary: Blockly.Colours.electSensor.secondary,
      colourTertiary: Blockly.Colours.electSensor.tertiary,
      extensions: ["output_number"],
    });
  },
};

Blockly.Blocks["elect_sensor_set_state"] = {
  init: function () {
    this.jsonInit({
      type: "elect_sensor_set_state",
      message0: Blockly.Msg.ELECT_SENSOR_SET_STATE,

      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "elect_sensor.svg",
          width: 32,
          height: 32,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
        {
          type: "field_dropdown",
          name: "STATE",
          options: [
            [Blockly.Msg.ELECT_SENSOR_STATE_DISCONNECTED, "0"],
            [Blockly.Msg.ELECT_SENSOR_STATE_ENGAGED, "1"],
          ],
        },
      ],
      category: Blockly.Categories.elect_sensor,
      extensions: ["colours_electSensor", "shape_statement"],
    });
  },
};
