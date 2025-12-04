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
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_boolean"],
    });
  },
};

Blockly.Blocks["cameraRecognition_apriltaglab_id"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_apriltaglab_id",
      message0: Blockly.Msg.CAMERA_RECOGNITION_APRILTAGLAB_ID,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_number"],
    });
  },
};

Blockly.Blocks["cameraRecognition_apriltaglab_x_point"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_apriltaglab_x_point",
      message0: Blockly.Msg.CAMERA_RECOGNITION_APRILTAGLAB_X_POINT,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_number"],
    });
  },
};

Blockly.Blocks["cameraRecognition_apriltaglab_y_point"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_apriltaglab_y_point",
      message0: Blockly.Msg.CAMERA_RECOGNITION_APRILTAGLAB_Y_POINT,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_number"],
    });
  },
};

Blockly.Blocks["cameraRecognition_apriltaglab_angle"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_apriltaglab_angle",
      message0: Blockly.Msg.CAMERA_RECOGNITION_APRILTAGLAB_ANGLE,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_number"],
    });
  },
};

Blockly.Blocks["cameraRecognition_apriltaglab_cm"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_apriltaglab_cm",
      message0: Blockly.Msg.CAMERA_RECOGNITION_APRILTAGLAB_CM,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_number"],
    });
  },
};

Blockly.Blocks["cameraRecognition_find_match_target"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_find_match_target",
      message0: Blockly.Msg.CAMERA_RECOGNITION_FIND_MATCH_TARGET,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_boolean"],
    });
  },
};

Blockly.Blocks["cameraRecognition_match_target"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_match_target",
      message0: Blockly.Msg.CAMERA_RECOGNITION_MATCH_TARGET,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_number"],
    });
  },
};

Blockly.Blocks["cameraRecognition_target_angle"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_target_angle",
      message0: Blockly.Msg.CAMERA_RECOGNITION_TARGET_ANGLE,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_number"],
    });
  },
};

Blockly.Blocks["cameraRecognition_discern_face"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_discern_face",
      message0: Blockly.Msg.CAMERA_RECOGNITION_DISCERN_FACE,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_boolean"],
    });
  },
};

Blockly.Blocks["cameraRecognition_face_x_point"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_face_x_point",
      message0: Blockly.Msg.CAMERA_RECOGNITION_FACE_X_POINT,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_number"],
    });
  },
};

Blockly.Blocks["cameraRecognition_face_y_point"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_face_y_point",
      message0: Blockly.Msg.CAMERA_RECOGNITION_FACE_Y_POINT,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_number"],
    });
  },
};

Blockly.Blocks["cameraRecognition_find_black_line"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_find_black_line",
      message0: Blockly.Msg.CAMERA_RECOGNITION_FIND_BLACK_LINE,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_boolean"],
    });
  },
};

Blockly.Blocks["cameraRecognition_line_offset_angle"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_line_offset_angle",
      message0: Blockly.Msg.CAMERA_RECOGNITION_LINE_OFFSET_ANGLE,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_number"],
    });
  },
};

Blockly.Blocks["cameraRecognition_line_offset_cm"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_line_offset_cm",
      message0: Blockly.Msg.CAMERA_RECOGNITION_LINE_OFFSET_CM,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_number"],
    });
  },
};

Blockly.Blocks["cameraRecognition_line_segment_promient"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_line_segment_promient",
      message0: Blockly.Msg.CAMERA_RECOGNITION_LINE_SEGMENT_PROMIENT,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_number"],
    });
  },
};

Blockly.Blocks["cameraRecognition_follow_block"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_follow_block",
      message0: Blockly.Msg.CAMERA_RECOGNITION_FOLLOW_BLOCK,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_boolean"],
    });
  },
};

Blockly.Blocks["cameraRecognition_follow_block_size"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_follow_block_size",
      message0: Blockly.Msg.CAMERA_RECOGNITION_FOLLOW_BLOCK_SIZE,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_number"],
    });
  },
};

Blockly.Blocks["cameraRecognition_follow_x_point"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_follow_x_point",
      message0: Blockly.Msg.CAMERA_RECOGNITION_FOLLOW_X_POINT,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_number"],
    });
  },
};

Blockly.Blocks["cameraRecognition_follow_y_point"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_follow_y_point",
      message0: Blockly.Msg.CAMERA_RECOGNITION_FOLLOW_Y_POINT,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_number"],
    });
  },
};

Blockly.Blocks["cameraRecognition_color_blue"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_color_blue",
      message0: Blockly.Msg.CAMERA_RECOGNITION_COLOR_BLUE,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_number"],
    });
  },
};

Blockly.Blocks["cameraRecognition_color_gread"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_color_gread",
      message0: Blockly.Msg.CAMERA_RECOGNITION_COLOR_GREAD,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_number"],
    });
  },
};

Blockly.Blocks["cameraRecognition_color_read"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_color_read",
      message0: Blockly.Msg.CAMERA_RECOGNITION_COLOR_READ,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "output_number"],
    });
  },
};

Blockly.Blocks["cameraRecognition_set_mode"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_set_mode",
      message0: Blockly.Msg.CAMERA_RECOGNITION_SET_MODE,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
        {
          type: "field_dropdown",
          name: "MODE",
          options: [
            [Blockly.Msg.CAMERA_RECOGNITION_GL_COLOR_DETECTION, "0x03"],
            [Blockly.Msg.CAMERA_RECOGNITION_LINE_PATROL, "0x04"],
            [Blockly.Msg.CAMERA_RECOGNITION_FACE_RECOGNITION, "0x06"],
            [Blockly.Msg.CAMERA_RECOGNITION_FEATUREPOINT_DETECTION, "0x10"],
            [Blockly.Msg.CAMERA_RECOGNITION_APRILTAGTAG_MODE, "0x0C"],
          ],
        },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "shape_statement"],
    });
  },
};

Blockly.Blocks["cameraRecognition_set_color_block_mode"] = {
  init: function () {
    this.jsonInit({
      type: "cameraRecognition_set_color_block_mode",
      message0: Blockly.Msg.CAMERA_RECOGNITION_SET_COLOR_BLOCK_MODE,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "camera.svg",
          width: 20,
          height: 20,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
        { type: "input_value", name: "COLOR_R" },
        { type: "input_value", name: "COLOR_G" },
        { type: "input_value", name: "COLOR_B" },
        { type: "input_value", name: "COLOR_PRECENT" },
      ],
      category: Blockly.Categories.cameraRecognition,
      extensions: ["colours_cameraRecognition", "shape_statement"],
    });
  },
};
