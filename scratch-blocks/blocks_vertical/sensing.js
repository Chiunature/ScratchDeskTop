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

'use strict';

goog.provide('Blockly.Blocks.sensing');

goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.constants');
goog.require('Blockly.ScratchBlocks.VerticalExtensions');


Blockly.Blocks['sensing_loudness'] = {
  /**
   * Block to report loudness
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.SENSING_LOUDNESS,
      "category": Blockly.Categories.sensing,
      "checkboxInFlyout": false,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

//红色/黄色/蓝色/绿色/ 棕色/紫色/黑色/白色
Blockly.Blocks['sensing_color_menu'] = {
  init: function () {
    this.jsonInit({
      "message0": "%1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "COLOR",
          "options": [
            [Blockly.Msg.RED, "0xFF0000"],
            [Blockly.Msg.YELLOW, "0xFFFF00"],
            [Blockly.Msg.BLUE, "0x0000FF"],
            [Blockly.Msg.GREEN, "0x00FF00"],
            [Blockly.Msg.BROWN, "0x804000"],
            [Blockly.Msg.BLACK, '0x000000'],
            [Blockly.Msg.WHITE, '0xffffff'],
            [Blockly.Msg.PURPLE, '0x884898'],
          ]
        },
      ],
      "category": Blockly.Categories.sensing,
      "colour": Blockly.Colours.sensing.primary,
      "colourSecondary": Blockly.Colours.sensing.secondary,
      "colourTertiary": Blockly.Colours.sensing.tertiary,
      "extensions": ["output_string"]
    });
  }
}

Blockly.Blocks['sensing_menu'] = {
  init: function () {
    this.jsonInit({
      "message0": "%1",
      "args0": [
        {
          "type": "field_motor",
          "name": "SENSING_MENU",
          "motorList": ["A", "B", "C", "D", "E", "F", "G", "H"]
        }
      ],
      "category": Blockly.Categories.sensing,
      "colour": Blockly.Colours.sensing.primary,
      "colourSecondary": Blockly.Colours.sensing.secondary,
      "colourTertiary": Blockly.Colours.sensing.tertiary,
      "extensions": ["output_string"],
    });
  }
};

Blockly.Blocks['sensing_color_judgment'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit(
      {
        "type": "sensing_color_judgment",
        "message0": Blockly.Msg.SENSING_COLOR_JUDGMENT,
        "args0": [
          {
            "type": "input_value",
            "name": "PORT",
          },
          {
            "type": "input_value",
            "name": "COLOR",
          }
        ],
        "category": Blockly.Categories.sensing,
        "extensions": ["colours_sensing", "output_boolean"]
      });
  }
};

Blockly.Blocks['sensing_color_detection'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_color_detection",
      "message0": Blockly.Msg.SENSING_COLOR_DETECTION,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT",
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_color_detectionRGB'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_color_detectionRGB",
      "message0": Blockly.Msg.SENSING_COLOR_DETECTIONRGB,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT",
        },
        {
          "type": "field_dropdown",
          "name": "color",
          "options": [
            [
              Blockly.Msg.RED,
              "red"
            ],
            [
              Blockly.Msg.GREEN,
              "green"
            ],
            [
              Blockly.Msg.BLUE,
              "blue"
            ],
          ]
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_reflected_light_judgment'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_reflected_light_judgment",
      "message0": Blockly.Msg.SENSING_REFLECTED_LIGHT_JUDGMENT,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT",
        },
        {
          "type": "field_dropdown",
          "name": "judgment",
          "options": [
            [
              ">",
              ">"
            ],
            [
              "<",
              "<"
            ],
            [
              "=",
              "="
            ]
          ]
        },
        {
          "type": "input_value",
          "name": "value",
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_reflected_light_detection'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_reflected_light_detection",
      "message0": Blockly.Msg.SENSING_REFLECTED_LIGHT_DETECTION,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT",
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_line_inspection_judgment'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_line_inspection_judgment",
      "message0": Blockly.Msg.SENSING_LINE_INSPECTION_JUDGMENT,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "PORT",
          "options": [
            [
              "P0",
              "P0"
            ],
            [
              "P1",
              "P1"
            ],
            [
              "P2",
              "P2"
            ],
            [
              "P3",
              "P3"
            ],
            [
              "P4",
              "P4"
            ],
          ]
        },
        {
          "type": "field_dropdown",
          "name": "line",
          "options": [
            [
              Blockly.Msg.BLACK,
              "black"
            ],
            [
              Blockly.Msg.WHITE,
              "white"
            ],
          ]
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_ultrasonic_judgment'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_ultrasonic_judgment",
      "message0": Blockly.Msg.SENSING_ULTRASONIC_JUDGMENT,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT",
        },
        {
          "type": "field_dropdown",
          "name": "judgment",
          "options": [
            [
              ">",
              ">"
            ],
            [
              "<",
              "<"
            ],
            [
              "=",
              "="
            ]
          ]
        },
        {
          "type": "input_value",
          "name": "value",
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_ultrasonic_detection'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_ultrasonic_detection",
      "message0": Blockly.Msg.SENSING_ULTRASONIC_DETECTION,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT",
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_sound_intensity'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_sound_intensity",
      "message0": Blockly.Msg.SENSING_SOUND_INTENSITY,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_key_judgment'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_key_judgment",
      "message0": Blockly.Msg.SENSING_KEY_JUDGMENT,
      "args0": [
        // {
        //   "type": "field_dropdown",
        //   "name": "PORT",
        //   "options": [
        //     [
        //       Blockly.Msg.PLEFT,
        //       "left"
        //     ],
        //     [
        //       Blockly.Msg.PRIGHT,
        //       "right"
        //     ]
        //   ]
        // },
        {
          "type": "input_value",
          "name": "PORT",
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_gyroscope_acceleration'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_gyroscope_acceleration",
      "message0": Blockly.Msg.SENSING_GYROSCOPE_ACCELERATION,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "directiion",
          "options": [
            [
              "X",
              "X"
            ],
            [
              "Y",
              "Y"
            ],
            [
              "Z",
              "Z"
            ],
          ]
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_gyroscope_attitude'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_gyroscope_attitude",
      "message0": Blockly.Msg.SENSING_GYROSCOPE_ATTITUDE,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "attitude",
          "options": [
            [
              Blockly.Msg.UP,
              "up"
            ],
            [
              Blockly.Msg.DOWN,
              "down"
            ],
            [
              Blockly.Msg.PLEFT,
              "left"
            ],
            [
              Blockly.Msg.PRIGHT,
              "right"
            ]
          ]
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_gyroscope_angle'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_gyroscope_angle",
      "message0": Blockly.Msg.SENSING_GYROSCOPE_ANGLE,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "PORT",
          "options": [
            [
              Blockly.Msg.YAW,
              "Yaw"
            ],
            [
              Blockly.Msg.FLOATING,
              "Pitch"
            ],
            [
              Blockly.Msg.ROLL,
              "Roll"
            ]
          ]
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_compass'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_compass",
      "message0": Blockly.Msg.SENSING_COMPASS,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_timer'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_timer",
      "message0": Blockly.Msg.SENSING_TIMER,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_reset_timer'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_reset_timer",
      "message0": Blockly.Msg.SENSING_RESET_TIMER,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "shape_statement"]
    });
  }
};

Blockly.Blocks['sensing_set_yaw_angle'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit(
      {
        "type": "sensing_set_yaw_angle",
        "message0": Blockly.Msg.SENSING_SET_YAW_ANGLE,
        "category": Blockly.Categories.sensing,
        "extensions": ["colours_sensing", "shape_statement"]
      });
  }
};

Blockly.Blocks['sensing_isHandling'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_isHandling",
      "message0": Blockly.Msg.SENSING_ISHANDLING,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "KEYS",
          "options": [
            [Blockly.Msg.UP, "up"],
            [Blockly.Msg.DOWN, "down"],
            [Blockly.Msg.PLEFT, "left"],
            [Blockly.Msg.PRIGHT, "right"],
            ["X", "X"],
            ["Y", "Y"],
            ["A", "A"],
            ["B", "B"],
            ["L1", "L1"],
            ["L2", "L2"],
            ["R1", "R1"],
            ["R2", "R2"],
          ]
        },
        {
          "type": "field_dropdown",
          "name": "BUTTON",
          "options": [
            [Blockly.Msg.PRESS, "press"],
            [Blockly.Msg.UNPRESS, "unpress"],
          ]
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_Handling'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_Handling",
      "message0": Blockly.Msg.SENSING_HANDLING,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "KEYS",
          "options": [
            [Blockly.Msg.PLEFT, "left"],
            [Blockly.Msg.PRIGHT, "right"],
          ]
        },
        {
          "type": "field_dropdown",
          "name": "BUTTON",
          "options": [
            [Blockly.Msg.MOTION_XPOSITION, "X"],
            [Blockly.Msg.MOTION_YPOSITION, "Y"],
          ]
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};


Blockly.Blocks['sensing_mainIsPress'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_Handling",
      "message0": Blockly.Msg.SENSING_MAINISPRESS,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "KEYS",
          "options": [
            [Blockly.Msg.PLEFT, "left"],
            [Blockly.Msg.PRIGHT, "right"],
          ]
        },
        {
          "type": "field_dropdown",
          "name": "BUTTON",
          "options": [
            [Blockly.Msg.PRESS, "press"],
            [Blockly.Msg.UNPRESS, "unpress"],
          ]
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_color_range'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_color_range",
      "message0": Blockly.Msg.SENSING_COLOR_RANGE,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT"
        },
        {
          "type": "input_value",
          "name": "RMin"
        },
        {
          "type": "input_value",
          "name": "RMax"
        },
        {
          "type": "input_value",
          "name": "GMin"
        },
        {
          "type": "input_value",
          "name": "GMax"
        },
        {
          "type": "input_value",
          "name": "BMin"
        },
        {
          "type": "input_value",
          "name": "BMax"
        }
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_reflected_light_blackLine'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_reflected_light_blackLine",
      "message0": Blockly.Msg.SENSING_REFLECTED_LIGHT_BLACKLINE,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT"
        },
        {
          "type": "input_value",
          "name": "THRESHOLD"
        }
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_camera_find_color_block'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_find_color_block",
      "message0": Blockly.Msg.SENSING_CAMERA_FIND_COLOR_BLOCK,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT"
        },
        {
          "type": "input_value",
          "name": "R"
        },
        {
          "type": "input_value",
          "name": "G"
        },
        {
          "type": "input_value",
          "name": "B"
        },
        {
          "type": "input_value",
          "name": "TOLERANCE"
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "shape_statement"]
    });
  }
};

Blockly.Blocks['sensing_camera_find_color_state'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_find_color_state",
      "message0": Blockly.Msg.SENSING_CAMERA_FIND_COLOR_STATE,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_camera_find_color_block_x'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_find_color_block_x",
      "message0": Blockly.Msg.SENSING_CAMERA_FIND_COLOR_BLOCK_X,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camera_find_color_block_y'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_find_color_block_y",
      "message0": Blockly.Msg.SENSING_CAMERA_FIND_COLOR_BLOCK_Y,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camera_find_color_pixel'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_find_color_pixel",
      "message0": Blockly.Msg.SENSING_CAMERA_FIND_COLOR_PIXEL,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camera_middle_find'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_middle_find",
      "message0": Blockly.Msg.SENSING_CAMERA_MIDDLE_FIND,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT"
        },
        {
          "type": "input_value",
          "name": "RADIUS"
        },
        {
          "type": "input_value",
          "name": "R"
        },
        {
          "type": "input_value",
          "name": "G"
        },
        {
          "type": "input_value",
          "name": "B"
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "shape_statement"]
    });
  }
};

Blockly.Blocks['sensing_camera_middle_find_red'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_middle_find_red",
      "message0": Blockly.Msg.SENSING_CAMERA_MIDDLE_FIND_RED,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camera_middle_find_green'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_middle_find_green",
      "message0": Blockly.Msg.SENSING_CAMERA_MIDDLE_FIND_GREEN,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camera_middle_find_blue'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_middle_find_blue",
      "message0": Blockly.Msg.SENSING_CAMERA_MIDDLE_FIND_BLUE,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camera_extern_color'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_extern_color",
      "message0": Blockly.Msg.SENSING_CAMERA_EXTERN_COLOR,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT"
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "shape_statement"]
    });
  }
};

Blockly.Blocks['sensing_camera_extern_red'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_extern_red",
      "message0": Blockly.Msg.SENSING_CAMERA_EXTERN_RED,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT"
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camera_extern_green'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_extern_green",
      "message0": Blockly.Msg.SENSING_CAMERA_EXTERN_GREEN,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT"
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camera_extern_blue'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_extern_blue",
      "message0": Blockly.Msg.SENSING_CAMERA_EXTERN_BLUE,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT"
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
}; 

Blockly.Blocks['sensing_camera_find_line'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_find_line",
      "message0": Blockly.Msg.SENSING_CAMERA_FIND_LINE,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT"
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "shape_statement"]
    });
  }
};

Blockly.Blocks['sensing_camer_find_line_state'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camer_find_line_state",
      "message0": Blockly.Msg.SENSING_CAMER_FIND_LINE_STATE,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_camer_find_line_showsex'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camer_find_line_showsex",
      "message0": Blockly.Msg.SENSING_CAMER_FIND_LINE_SHOWSEX,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camer_find_line_rho'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camer_find_line_rho",
      "message0": Blockly.Msg.SENSING_CAMER_FIND_LINE_RHO,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camer_find_line_theta'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camer_find_line_theta",
      "message0": Blockly.Msg.SENSING_CAMER_FIND_LINE_THETA,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camera_number_check'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_number_check",
      "message0": Blockly.Msg.SENSING_CAMERA_NUMBER_CHECK,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT"
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "shape_statement"]
    });
  }
};

Blockly.Blocks['sensing_camer_number_state'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camer_number_state",
      "message0": Blockly.Msg.SENSING_CAMER_NUMBER_STATE,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_camera_get_number'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_get_number",
      "message0": Blockly.Msg.SENSING_CAMERA_GET_NUMBER,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camera_face_check'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_face_check",
      "message0": Blockly.Msg.SENSING_CAMERA_FACE_CHECK,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT"
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "shape_statement"]
    });
  }
};

Blockly.Blocks['sensing_camera_face_state'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_face_state",
      "message0": Blockly.Msg.SENSING_CAMERA_FACE_STATE,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_camera_face_x'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_face_x",
      "message0": Blockly.Msg.SENSING_CAMERA_FACE_X,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camera_face_y'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_face_y",
      "message0": Blockly.Msg.SENSING_CAMERA_FACE_Y,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camera_face_trace'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_face_trace",
      "message0": Blockly.Msg.SENSING_CAMERA_FACE_TRACE,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT"
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "shape_statement"]
    });
  }
};

Blockly.Blocks['sensing_camera_face_trace_state'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_face_trace_state",
      "message0": Blockly.Msg.SENSING_CAMERA_FACE_TRACE_STATE,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_camera_face_trace_x'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_face_trace_x",
      "message0": Blockly.Msg.SENSING_CAMERA_FACE_TRACE_X,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camera_face_trace_y'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_face_trace_y",
      "message0": Blockly.Msg.SENSING_CAMERA_FACE_TRACE_Y,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camera_qr_check'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_qr_check",
      "message0": Blockly.Msg.SENSING_CAMERA_QR_CHECK,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT"
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "shape_statement"]
    });
  }
};

Blockly.Blocks['sensing_camera_qr_state'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_qr_state",
      "message0": Blockly.Msg.SENSING_CAMERA_QR_STATE,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_camera_apriltag'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_apriltag",
      "message0": Blockly.Msg.SENSING_CAMERA_APRILTAG,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT"
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "shape_statement"]
    });
  }
};

Blockly.Blocks['sensing_camera_apriltag_state'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_apriltag_state",
      "message0": Blockly.Msg.SENSING_CAMERA_APRILTAG_STATE,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_camera_apriltag_id'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_apriltag_id",
      "message0": Blockly.Msg.SENSING_CAMERA_APRILTAG_ID,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camera_apriltag_x'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_apriltag_x",
      "message0": Blockly.Msg.SENSING_CAMERA_APRILTAG_X,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camera_apriltag_y'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_apriltag_y",
      "message0": Blockly.Msg.SENSING_CAMERA_APRILTAG_Y,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camera_apriltag_roll'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_apriltag_roll",
      "message0": Blockly.Msg.SENSING_CAMERA_APRILTAG_ROLL,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camera_apriltag_distance'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_apriltag_distance",
      "message0": Blockly.Msg.SENSING_CAMERA_APRILTAG_DISTANCE,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};


Blockly.Blocks['sensing_camera_characteristic'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_characteristic",
      "message0": Blockly.Msg.SENSING_CAMERA_CHARACTERISTIC,
      "args0": [
        {
          "type": "input_value",
          "name": "PORT"
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "shape_statement"]
    });
  }
};

Blockly.Blocks['sensing_camera_characteristic_state'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_characteristic_state",
      "message0": Blockly.Msg.SENSING_CAMERA_CHARACTERISTIC_STATE,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_camera_characteristic_matchine'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_characteristic_matchine",
      "message0": Blockly.Msg.SENSING_CAMERA_CHARACTERISTIC_MATCHINE,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_camera_characteristic_roll'] = {
  init: function () {
    this.jsonInit({
      "type": "sensing_camera_characteristic_roll",
      "message0": Blockly.Msg.SENSING_CAMERA_CHARACTERISTIC_ROLL,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};