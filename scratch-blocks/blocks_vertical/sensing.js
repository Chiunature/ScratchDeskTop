/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2016 Massachusetts Institute of Technology
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

goog.provide("Blockly.Blocks.sensing");

goog.require("Blockly.Blocks");
goog.require("Blockly.Colours");
goog.require("Blockly.constants");
goog.require("Blockly.ScratchBlocks.VerticalExtensions");

Blockly.Blocks["sensing_loudness"] = {
  /**
   * Block to report loudness
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.SENSING_LOUDNESS,
      category: Blockly.Categories.sensing,
      checkboxInFlyout: false,
      extensions: ["colours_sensing", "output_number"],
    });
  },
};

//红色/黄色/蓝色/绿色/ 棕色/紫色/黑色/白色
Blockly.Blocks["sensing_color_menu"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "COLOR",
          options: [
            [Blockly.Msg.RED, "0xFF0000"],
            [Blockly.Msg.YELLOW, "0xFFFF00"],
            [Blockly.Msg.BLUE, "0x0000FF"],
            [Blockly.Msg.GREEN, "0x00FF00"],
            [Blockly.Msg.BROWN, "0x804000"],
            [Blockly.Msg.BLACK, "0x000000"],
            [Blockly.Msg.WHITE, "0xffffff"],
            [Blockly.Msg.PURPLE, "0x884898"],
          ],
        },
      ],
      category: Blockly.Categories.sensing,
      colour: Blockly.Colours.sensing.primary,
      colourSecondary: Blockly.Colours.sensing.secondary,
      colourTertiary: Blockly.Colours.sensing.tertiary,
      extensions: ["output_string"],
    });
  },
};

Blockly.Blocks["sensing_menu"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_motor",
          name: "SENSING_MENU",
          motorList: ["A", "B", "C", "D", null, null, null, null],
        },
      ],
      category: Blockly.Categories.sensing,
      colour: Blockly.Colours.sensing.primary,
      colourSecondary: Blockly.Colours.sensing.secondary,
      colourTertiary: Blockly.Colours.sensing.tertiary,
      extensions: ["output_string"],
    });
  },
};

Blockly.Blocks["sensing_line_inspection_judgment"] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      type: "sensing_line_inspection_judgment",
      message0: Blockly.Msg.SENSING_LINE_INSPECTION_JUDGMENT,
      args0: [
        {
          type: "field_dropdown",
          name: "PORT",
          options: [
            ["P0", "P0"],
            ["P1", "P1"],
            ["P2", "P2"],
            ["P3", "P3"],
            ["P4", "P4"],
          ],
        },
        {
          type: "field_dropdown",
          name: "line",
          options: [
            [Blockly.Msg.BLACK, "black"],
            [Blockly.Msg.WHITE, "white"],
          ],
        },
      ],
      category: Blockly.Categories.sensing,
      extensions: ["colours_sensing", "output_boolean"],
    });
  },
};

Blockly.Blocks["sensing_ultrasonic_judgment"] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      type: "sensing_ultrasonic_judgment",
      message0: Blockly.Msg.SENSING_ULTRASONIC_JUDGMENT,
      args0: [
        {
          type: "field_dropdown",
          name: "PORT",
          options: [
            ["1", "1"],
            ["2", "2"],
          ],
        },
        {
          type: "field_dropdown",
          name: "judgment",
          options: [
            [">", ">"],
            ["<", "<"],
            ["=", "="],
          ],
        },
        {
          type: "input_value",
          name: "value",
        },
      ],
      category: Blockly.Categories.sensing,
      extensions: ["colours_sensing", "output_boolean"],
    });
  },
};

Blockly.Blocks["sensing_ultrasonic_detection"] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      type: "sensing_ultrasonic_detection",
      message0: Blockly.Msg.SENSING_ULTRASONIC_DETECTION,
      args0: [
        {
          type: "field_dropdown",
          name: "PORT",
          options: [
            ["1", "1"],
            ["2", "2"],
          ],
        },
      ],
      category: Blockly.Categories.sensing,
      extensions: ["colours_sensing", "output_number"],
    });
  },
};

Blockly.Blocks["sensing_sound_intensity"] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      type: "sensing_sound_intensity",
      message0: Blockly.Msg.SENSING_SOUND_INTENSITY,
      category: Blockly.Categories.sensing,
      extensions: ["colours_sensing", "output_number"],
    });
  },
};

Blockly.Blocks["sensing_key_judgment"] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      type: "sensing_key_judgment",
      message0: Blockly.Msg.SENSING_KEY_JUDGMENT,
      args0: [
        {
          type: "field_dropdown",
          name: "PORT",
          options: [
            ["1", "1"],
            ["2", "2"],
          ],
        },
      ],
      category: Blockly.Categories.sensing,
      extensions: ["colours_sensing", "output_boolean"],
    });
  },
};

Blockly.Blocks["sensing_compass"] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      type: "sensing_compass",
      message0: Blockly.Msg.SENSING_COMPASS,
      category: Blockly.Categories.sensing,
      extensions: ["colours_sensing", "output_number"],
    });
  },
};

Blockly.Blocks["sensing_timer"] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      type: "sensing_timer",
      message0: Blockly.Msg.SENSING_TIMER,
      category: Blockly.Categories.sensing,
      extensions: ["colours_sensing", "output_number"],
    });
  },
};

Blockly.Blocks["sensing_reset_timer"] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      type: "sensing_reset_timer",
      message0: Blockly.Msg.SENSING_RESET_TIMER,
      category: Blockly.Categories.sensing,
      extensions: ["colours_sensing", "shape_statement"],
    });
  },
};

Blockly.Blocks["sensing_isHandling"] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      type: "sensing_isHandling",
      message0: Blockly.Msg.SENSING_ISHANDLING,
      args0: [
        {
          type: "field_dropdown",
          name: "KEYS",
          options: [
            [Blockly.Msg.UP, "up"],
            [Blockly.Msg.DOWN, "down"],
            [Blockly.Msg.PLEFT, "left"],
            [Blockly.Msg.PRIGHT, "right"],
            ["A", "A"],
            ["B", "B"],
          ],
        },
        {
          type: "field_dropdown",
          name: "BUTTON",
          options: [
            [Blockly.Msg.PRESS, "1"],
            [Blockly.Msg.UNPRESS, "0"],
          ],
        },
      ],
      category: Blockly.Categories.sensing,
      extensions: ["colours_sensing", "output_boolean"],
    });
  },
};

Blockly.Blocks["sensing_mainIsPress"] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      type: "sensing_Handling",
      message0: Blockly.Msg.SENSING_MAINISPRESS,
      args0: [
        {
          type: "field_dropdown",
          name: "KEYS",
          options: [
            [Blockly.Msg.PLEFT, "K2"],
            [Blockly.Msg.PRIGHT, "K3"],
          ],
        },
        {
          type: "field_dropdown",
          name: "BUTTON",
          options: [
            [Blockly.Msg.PRESS, "0"],
            [Blockly.Msg.UNPRESS, "1"],
          ],
        },
      ],
      category: Blockly.Categories.sensing,
      extensions: ["colours_sensing", "output_boolean"],
    });
  },
};

Blockly.Blocks["sensing_reflected_light_blackLine"] = {
  init: function () {
    this.jsonInit({
      type: "sensing_reflected_light_blackLine",
      message0: Blockly.Msg.SENSING_REFLECTED_LIGHT_BLACKLINE,
      args0: [
        {
          type: "input_value",
          name: "PORT",
        },
        {
          type: "input_value",
          name: "THRESHOLD",
        },
      ],
      category: Blockly.Categories.sensing,
      extensions: ["colours_sensing", "output_boolean"],
    });
  },
};

Blockly.Blocks["getGear"] = {
  init: function () {
    this.jsonInit({
      type: "getGear",
      message0: Blockly.Msg.GET_GEAR,
      category: Blockly.Categories.sensing,
      extensions: ["colours_sensing", "output_number"],
    });
  },
};
