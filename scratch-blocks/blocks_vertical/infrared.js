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

goog.provide("Blockly.Blocks.infrared");

goog.require("Blockly.Blocks");
goog.require("Blockly.Colours");
goog.require("Blockly.constants");
goog.require("Blockly.ScratchBlocks.VerticalExtensions");

/**
 * Infrared sensor: set the light color.
 * Generated code looks like `_ir_remote.set_color(port, state)`,
 * where state is 0-off / 1-red / 2-green / 3-blue.
 * @this Blockly.Block
 */
Blockly.Blocks["sensing_infrared_set_color"] = {
  init: function () {
    this.jsonInit({
      type: "sensing_infrared_set_color",
      message0: Blockly.Msg.SENSING_INFRARED_SET_COLOR,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "IrRemote.svg",
          width: 32,
          height: 32,
          alt: Blockly.Msg.SENSING_INFRARED_ALT,
          flipRtl: false,
        },
        { type: "field_vertical_separator" },
        {
          type: "input_value",
          name: "PORT",
        },
        {
          type: "field_dropdown",
          name: "STATE",
          options: [
            [Blockly.Msg.CLOSE, "0"],
            [Blockly.Msg.RED, "1"],
            [Blockly.Msg.GREEN, "2"],
            [Blockly.Msg.BLUE, "3"],
          ],
        },
      ],
      category: Blockly.Categories.sensing,
      extensions: ["colours_sensing", "shape_statement"],
    });
  },
};