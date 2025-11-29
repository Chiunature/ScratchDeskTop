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

goog.provide("Blockly.Blocks.cameraRecognition");

goog.require("Blockly.Blocks");
goog.require("Blockly.Colours");
goog.require("Blockly.constants");
goog.require("Blockly.ScratchBlocks.VerticalExtensions");

/**
 * Block to select camera recognition port (A-H)
 * 摄像头识别端口选择积木块（A-H）
 * @this Blockly.Block
 */
Blockly.Blocks["cameraRecognition_menu"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_motor",
          name: "CAMERARECOGNITION_MENU",
          motorList: ["A", "B", "C", "D", "E", "F", "G", "H"],
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      colour: Blockly.Colours.cameraRecognition.primary,
      colourSecondary: Blockly.Colours.cameraRecognition.secondary,
      colourTertiary: Blockly.Colours.cameraRecognition.tertiary,
      extensions: ["output_string"],
    });
  },
};

/**
 * Block to recognize AprilTag label
 * AprilTag 标签识别积木块
 * @this Blockly.Block
 */
Blockly.Blocks["cameraRecognition_discerrn_aprltag_lab"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_discerrn_aprltag_lab",
      message0: Blockly.Msg.CAMERA_RECOGNITION_DISCERRN_APRLTAG_LAB,
      args0: [
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_string"],
    });
  },
};
