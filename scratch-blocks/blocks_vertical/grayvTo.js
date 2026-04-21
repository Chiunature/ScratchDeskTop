"use strict";

goog.provide("Blockly.Blocks.grayvTo");

goog.require("Blockly.Blocks");
goog.require("Blockly.Colours");
goog.require("Blockly.constants");
goog.require("Blockly.ScratchBlocks.VerticalExtensions");

Blockly.Blocks["grayv2_menu"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_motor",
          name: "GRAYV2_MENU",
          motorList: ["A", "B", "C", "D", "E", "F", "G", "H"],
        },
      ],
      category: Blockly.Categories.grayv2,
      colour: Blockly.Colours.grayv2.primary,
      colourSecondary: Blockly.Colours.grayv2.secondary,
      colourTertiary: Blockly.Colours.grayv2.tertiary,
      extensions: ["output_string"],
    });
  },
};

Blockly.Blocks["grayv2_if_ch_black"] = {
  init: function () {
    this.jsonInit({
      type: "grayv2_if_ch_black",
      message0: Blockly.Msg.GRAYV2_IF_CH_BLACK,
      args0: [
        {
          type: "input_value",
          name: "PORT",
        },
        {
          type: "field_dropdown",
          name: "CHANNEL",
          options: [
            [Blockly.Msg.CHANNEL_1, "0"],
            [Blockly.Msg.CHANNEL_2, "1"],
            [Blockly.Msg.CHANNEL_3, "2"],
            [Blockly.Msg.CHANNEL_4, "3"],
            [Blockly.Msg.CHANNEL_5, "4"],
            [Blockly.Msg.CHANNEL_6, "5"],
            [Blockly.Msg.CHANNEL_7, "6"],
          ],
        },
      ],
      category: Blockly.Categories.grayv2,
      extensions: ["colours_grayv2", "output_boolean"],
    });
  },
};

Blockly.Blocks["grayv2_read_ch"] = {
  init: function () {
    this.jsonInit({
      type: "grayv2_read_ch",
      message0: Blockly.Msg.GRAYV2_READ_CH,
      args0: [
        {
          type: "input_value",
          name: "PORT",
        },
        {
          type: "field_dropdown",
          name: "CHANNEL",
          options: [
            [Blockly.Msg.CHANNEL_1, "0"],
            [Blockly.Msg.CHANNEL_2, "1"],
            [Blockly.Msg.CHANNEL_3, "2"],
            [Blockly.Msg.CHANNEL_4, "3"],
            [Blockly.Msg.CHANNEL_5, "4"],
            [Blockly.Msg.CHANNEL_6, "5"],
            [Blockly.Msg.CHANNEL_7, "6"],
          ],
        },
      ],
      category: Blockly.Categories.grayv2,
      extensions: ["colours_grayv2", "output_number"],
    });
  },
};

Blockly.Blocks["grayv2_if_all_ch_way_state"] = {
  init: function () {
    this.jsonInit({
      type: "grayv2_if_all_ch_way_state",
      message0: Blockly.Msg.GRAYV2_IF_ALL_CH_WAY_STATE,
      args0: [
        {
          type: "input_value",
          name: "PORT",
        },
        {
          type: "field_dropdown",
          name: "INTERSECTION_TYPE",
          options: [
            [Blockly.Msg.GRAYV2_IntersectionType_1, "0"],
            [Blockly.Msg.GRAYV2_IntersectionType_2, "1"],
            [Blockly.Msg.GRAYV2_IntersectionType_3, "2"],
            [Blockly.Msg.GRAYV2_IntersectionType_4, "3"],
            [Blockly.Msg.GRAYV2_IntersectionType_5, "4"],
            [Blockly.Msg.GRAYV2_IntersectionType_6, "5"],
            [Blockly.Msg.GRAYV2_IntersectionType_7, "6"],
            [Blockly.Msg.GRAYV2_IntersectionType_8, "7"],
            [Blockly.Msg.GRAYV2_IntersectionType_9, "8"],
            [Blockly.Msg.GRAYV2_IntersectionType_10, "9"],
            [Blockly.Msg.GRAYV2_IntersectionType_11, "10"],
          ],
        },
      ],
      category: Blockly.Categories.grayv2,
      extensions: ["colours_grayv2", "output_boolean"],
    });
  },
};

Blockly.Blocks["grayv2_power_find_if_ch_state"] = {
  init: function () {
    this.jsonInit({
      type: "grayv2_power_find_if_ch_state",
      message0: Blockly.Msg.GRAYV2_POWER_FIND_IF_CH_STATE,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "grayv2.svg",
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
          type: "input_value",
          name: "LEFT_SPEED",
        },
        {
          type: "input_value",
          name: "RIGHT_SPEED",
        },
        {
          type: "field_dropdown",
          name: "CHANNEL",
          options: [
            [Blockly.Msg.CHANNEL_1, "0"],
            [Blockly.Msg.CHANNEL_2, "1"],
            [Blockly.Msg.CHANNEL_3, "2"],
            [Blockly.Msg.CHANNEL_4, "3"],
            [Blockly.Msg.CHANNEL_5, "4"],
            [Blockly.Msg.CHANNEL_6, "5"],
            [Blockly.Msg.CHANNEL_7, "6"],
          ],
        },
      ],
      category: Blockly.Categories.grayv2,
      extensions: ["colours_grayv2", "shape_statement"],
    });
  },
};

Blockly.Blocks["grayv2_power_find_way_type"] = {
  init: function () {
    this.jsonInit({
      type: "grayv2_power_find_way_type",
      message0: Blockly.Msg.GRAYV2_POWER_FIND_WAY_TYPE,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "grayv2.svg",
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
          type: "input_value",
          name: "SPEED",
        },
        {
          type: "field_dropdown",
          name: "INTERSECTION_TYPE",
          options: [
            [Blockly.Msg.GRAYV2_IntersectionType_1, "0"],
            [Blockly.Msg.GRAYV2_IntersectionType_2, "1"],
            [Blockly.Msg.GRAYV2_IntersectionType_3, "2"],
            [Blockly.Msg.GRAYV2_IntersectionType_4, "3"],
            [Blockly.Msg.GRAYV2_IntersectionType_5, "4"],
            [Blockly.Msg.GRAYV2_IntersectionType_6, "5"],
            [Blockly.Msg.GRAYV2_IntersectionType_7, "6"],
            [Blockly.Msg.GRAYV2_IntersectionType_8, "7"],
            [Blockly.Msg.GRAYV2_IntersectionType_9, "8"],
            [Blockly.Msg.GRAYV2_IntersectionType_10, "9"],
            [Blockly.Msg.GRAYV2_IntersectionType_11, "10"],
          ],
        },
        {
          type: "input_value",
          name: "CODE_VALUE",
        },
      ],
      category: Blockly.Categories.grayv2,
      extensions: ["colours_grayv2", "shape_statement"],
    });
  },
};

Blockly.Blocks["grayv2_power_find_line"] = {
  init: function () {
    this.jsonInit({
      type: "grayv2_power_find_line",
      message0: Blockly.Msg.GRAYV2_POWER_FIND_LINE,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "grayv2.svg",
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
          type: "input_value",
          name: "SPEED",
        },
      ],
      category: Blockly.Categories.grayv2,
      extensions: ["colours_grayv2", "shape_statement"],
    });
  },
};

Blockly.Blocks["grayv2_power_find_line_encord"] = {
  init: function () {
    this.jsonInit({
      type: "grayv2_power_find_line_encord",
      message0: Blockly.Msg.GRAYV2_POWER_FIND_LINE_ENCORD,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "grayv2.svg",
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
          type: "input_value",
          name: "SPEED",
        },
        {
          type: "input_value",
          name: "ENCODER_VALUE",
        },
      ],
      category: Blockly.Categories.grayv2,
      extensions: ["colours_grayv2", "shape_statement"],
    });
  },
};

Blockly.Blocks["grayv2_power_find_line_ms"] = {
  init: function () {
    this.jsonInit({
      type: "grayv2_power_find_line_ms",
      message0: Blockly.Msg.GRAYV2_POWER_FIND_LINE_MS,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "grayv2.svg",
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
          type: "input_value",
          name: "SPEED",
        },
        {
          type: "input_value",
          name: "MILLISECONDS",
        },
      ],
      category: Blockly.Categories.grayv2,
      extensions: ["colours_grayv2", "shape_statement"],
    });
  },
};

Blockly.Blocks["grayv2_start_calibrate"] = {
  init: function () {
    this.jsonInit({
      type: "grayv2_start_calibrate",
      message0: Blockly.Msg.GRAYV2_START_CALIBRATE,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "grayv2.svg",
          width: 32,
          height: 32,
          alt: "*",
          flipRtl: false,
        },
        { type: "input_value", name: "PORT" },
      ],
      category: Blockly.Categories.grayv2,
      extensions: ["colours_grayv2", "shape_statement"],
    });
  },
};
Blockly.Blocks["grayv2_set_threshold"] = {
  init: function () {
    this.jsonInit({
      type: "grayv2_set_threshold",
      message0: Blockly.Msg.GRAYV2_SET_THRESHOLD,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "grayv2.svg",
          width: 32,
          height: 32,
          alt: "*",
          flipRtl: false,
        },
        { type: "input_value", name: "PORT" },
        {
          type: "field_dropdown",
          name: "CHANNEL",
          options: [
            [Blockly.Msg.CHANNEL_1, "0"],
            [Blockly.Msg.CHANNEL_2, "1"],
            [Blockly.Msg.CHANNEL_3, "2"],
            [Blockly.Msg.CHANNEL_4, "3"],
            [Blockly.Msg.CHANNEL_5, "4"],
            [Blockly.Msg.CHANNEL_6, "5"],
            [Blockly.Msg.CHANNEL_7, "6"],
          ],
        },
        { type: "input_value", name: "RANGE" },
      ],
      category: Blockly.Categories.grayv2,
      extensions: ["colours_grayv2", "shape_statement"],
    });
  },
};

Blockly.Blocks["grayv2_set_rgb"] = {
  init: function () {
    this.jsonInit({
      type: "grayv2_set_rgb",
      message0: Blockly.Msg.GRAYV2_SET_RGB,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "grayv2.svg",
          width: 32,
          height: 32,
          alt: "*",
          flipRtl: false,
        },
        { type: "input_value", name: "PORT" },
        {
          type: "field_dropdown",
          name: "R",
          options: [
            [Blockly.Msg.GRAYV2_RGB_1, "0"],
            [Blockly.Msg.GRAYV2_RGB_2, "1"],
            [Blockly.Msg.GRAYV2_RGB_3, "2"],
            [Blockly.Msg.GRAYV2_RGB_4, "3"],
            [Blockly.Msg.GRAYV2_RGB_5, "4"],
            [Blockly.Msg.GRAYV2_RGB_6, "5"],
            [Blockly.Msg.GRAYV2_RGB_7, "6"],
            [Blockly.Msg.GRAYV2_RGB_8, "7"],
          ],
        },
      ],
      category: Blockly.Categories.grayv2,
      extensions: ["colours_grayv2", "shape_statement"],
    });
  },
};

Blockly.Blocks["grayv2_set_pid"] = {
  init: function () {
    this.jsonInit({
      type: "grayv2_set_pid",
      message0: Blockly.Msg.GRAYV2_SET_PID,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "grayv2.svg",
          width: 32,
          height: 32,
          alt: "*",
          flipRtl: false,
        },
        { type: "input_value", name: "PORT" },
        { type: "input_value", name: "KP" },
        { type: "input_value", name: "KI" },
      ],
      category: Blockly.Categories.grayv2,
      extensions: ["colours_grayv2", "shape_statement"],
    });
  },
};
