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


/* Blockly.Blocks['sensing_card'] = {
  init: function () {
      this.jsonInit({
          "type": "sensing_card",
          "message0": "%1",
          "args0": [
              {
                  "type": "input_value",
                  "name": "COLOR"
              },
          ],
          "category": Blockly.Categories.sensing,
          "colour": "#9966FF",
          "secondaryColour": "#774DCB",
          "extensions": ["colours_pen", "colours_sensing", "output_boolean"],
      });
  }
}; */

Blockly.Blocks['sensing_touchingobject'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.SENSING_TOUCHINGOBJECT,
      "args0": [
        {
          "type": "input_value",
          "name": "TOUCHINGOBJECTMENU"
        }
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_touchingobjectmenu'] = {
  /**
   * "Touching [Object]" Block Menu.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": "%1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "TOUCHINGOBJECTMENU",
          "options": [
            [Blockly.Msg.SENSING_TOUCHINGOBJECT_POINTER, '_mouse_'],
            [Blockly.Msg.SENSING_TOUCHINGOBJECT_EDGE, '_edge_']
          ]
        }
      ],
      "extensions": ["colours_sensing", "output_string"]
    });
  }
};

Blockly.Blocks['sensing_touchingcolor'] = {
  /**
   * Block to Report if its touching a certain Color.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.SENSING_TOUCHINGCOLOR,
      "args0": [
        {
          "type": "input_value",
          "name": "COLOR"
        }
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_coloristouchingcolor'] = {
  /**
   * Block to Report if a color is touching a certain Color.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.SENSING_COLORISTOUCHINGCOLOR,
      "args0": [
        {
          "type": "input_value",
          "name": "COLOR"
        },
        {
          "type": "input_value",
          "name": "COLOR2"
        }
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_distanceto'] = {
  /**
   * Block to Report distance to another Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.SENSING_DISTANCETO,
      "args0": [
        {
          "type": "input_value",
          "name": "DISTANCETOMENU"
        }
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_distancetomenu'] = {
  /**
   * "Distance to [Object]" Block Menu.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": "%1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "DISTANCETOMENU",
          "options": [
            [Blockly.Msg.SENSING_DISTANCETO_POINTER, '_mouse_']
          ]
        }
      ],
      "extensions": ["colours_sensing", "output_string"]
    });
  }
};

Blockly.Blocks['sensing_askandwait'] = {
  /**
   * Block to ask a question and wait
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.SENSING_ASKANDWAIT,
      "args0": [
        {
          "type": "input_value",
          "name": "QUESTION"
        }
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "shape_statement"]
    });
  }
};

Blockly.Blocks['sensing_answer'] = {
  /**
   * Block to report answer
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.SENSING_ANSWER,
      "category": Blockly.Categories.sensing,
      "checkboxInFlyout": true,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_keypressed'] = {
  /**
   * Block to Report if a key is pressed.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.SENSING_KEYPRESSED,
      "args0": [
        {
          "type": "input_value",
          "name": "KEY_OPTION"
        }
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_keyoptions'] = {
  /**
   * Options for Keys
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": "%1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "KEY_OPTION",
          "options": [
            [Blockly.Msg.EVENT_WHENKEYPRESSED_SPACE, 'space'],
            [Blockly.Msg.EVENT_WHENKEYPRESSED_UP, 'up arrow'],
            [Blockly.Msg.EVENT_WHENKEYPRESSED_DOWN, 'down arrow'],
            [Blockly.Msg.EVENT_WHENKEYPRESSED_RIGHT, 'right arrow'],
            [Blockly.Msg.EVENT_WHENKEYPRESSED_LEFT, 'left arrow'],
            [Blockly.Msg.EVENT_WHENKEYPRESSED_ANY, 'any'],
            ['a', 'a'],
            ['b', 'b'],
            ['c', 'c'],
            ['d', 'd'],
            ['e', 'e'],
            ['f', 'f'],
            ['g', 'g'],
            ['h', 'h'],
            ['i', 'i'],
            ['j', 'j'],
            ['k', 'k'],
            ['l', 'l'],
            ['m', 'm'],
            ['n', 'n'],
            ['o', 'o'],
            ['p', 'p'],
            ['q', 'q'],
            ['r', 'r'],
            ['s', 's'],
            ['t', 't'],
            ['u', 'u'],
            ['v', 'v'],
            ['w', 'w'],
            ['x', 'x'],
            ['y', 'y'],
            ['z', 'z'],
            ['0', '0'],
            ['1', '1'],
            ['2', '2'],
            ['3', '3'],
            ['4', '4'],
            ['5', '5'],
            ['6', '6'],
            ['7', '7'],
            ['8', '8'],
            ['9', '9']
          ]
        }
      ],
      "extensions": ["colours_sensing", "output_string"]
    });
  }
};

Blockly.Blocks['sensing_mousedown'] = {
  /**
   * Block to Report if the mouse is down.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.SENSING_MOUSEDOWN,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_mousex'] = {
  /**
   * Block to report mouse's x position
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.SENSING_MOUSEX,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_mousey'] = {
  /**
   * Block to report mouse's y position
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.SENSING_MOUSEY,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_setdragmode'] = {
  /**
   * Block to set drag mode.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.SENSING_SETDRAGMODE,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "DRAG_MODE",
          "options": [
            [Blockly.Msg.SENSING_SETDRAGMODE_DRAGGABLE, 'draggable'],
            [Blockly.Msg.SENSING_SETDRAGMODE_NOTDRAGGABLE, 'not draggable']
          ]
        }
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "shape_statement"]
    });
  }
};

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

Blockly.Blocks['sensing_loud'] = {
  /**
   * Block to report if the loudness is "loud" (greater than 10). This is an
   * obsolete block that is implemented for compatibility with Scratch 2.0 and
   * 1.4 projects.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.SENSING_LOUD,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_timer'] = {
  /**
   * Block to report timer
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.SENSING_TIMER,
      "category": Blockly.Categories.sensing,
      "checkboxInFlyout": false,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_resettimer'] = {
  /**
   * Block to reset timer
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.SENSING_RESETTIMER,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "shape_statement"]
    });
  }
};

Blockly.Blocks['sensing_of_object_menu'] = {
  /**
   * "* of _" object menu.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": "%1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "OBJECT",
          "options": [
            ['Sprite1', 'Sprite1'],
            ['Stage', '_stage_']
          ]
        }
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_string"]
    });
  }
};


Blockly.Blocks['sensing_of'] = {
  /**
   * Block to report properties of sprites.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.SENSING_OF,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "PROPERTY",
          "options": [
            [Blockly.Msg.SENSING_OF_XPOSITION, 'x position'],
            [Blockly.Msg.SENSING_OF_YPOSITION, 'y position'],
            [Blockly.Msg.SENSING_OF_DIRECTION, 'direction'],
            [Blockly.Msg.SENSING_OF_COSTUMENUMBER, 'costume #'],
            [Blockly.Msg.SENSING_OF_COSTUMENAME, 'costume name'],
            [Blockly.Msg.SENSING_OF_SIZE, 'size'],
            [Blockly.Msg.SENSING_OF_VOLUME, 'volume'],
            [Blockly.Msg.SENSING_OF_BACKDROPNUMBER, 'backdrop #'],
            [Blockly.Msg.SENSING_OF_BACKDROPNAME, 'backdrop name']
          ]
        },
        {
          "type": "input_value",
          "name": "OBJECT"
        }
      ],
      "output": true,
      "category": Blockly.Categories.sensing,
      "outputShape": Blockly.OUTPUT_SHAPE_ROUND,
      "extensions": ["colours_sensing"]
    });
  }
};

Blockly.Blocks['sensing_current'] = {
  /**
   * Block to Report the current option.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.SENSING_CURRENT,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "CURRENTMENU",
          "options": [
            [Blockly.Msg.SENSING_CURRENT_YEAR, 'YEAR'],
            [Blockly.Msg.SENSING_CURRENT_MONTH, 'MONTH'],
            [Blockly.Msg.SENSING_CURRENT_DATE, 'DATE'],
            [Blockly.Msg.SENSING_CURRENT_DAYOFWEEK, 'DAYOFWEEK'],
            [Blockly.Msg.SENSING_CURRENT_HOUR, 'HOUR'],
            [Blockly.Msg.SENSING_CURRENT_MINUTE, 'MINUTE'],
            [Blockly.Msg.SENSING_CURRENT_SECOND, 'SECOND']
          ]
        }
      ],
      "category": Blockly.Categories.sensing,
      "checkboxInFlyout": false,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_dayssince2000'] = {
  /**
   * Block to report days since 2000
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.SENSING_DAYSSINCE2000,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_username'] = {
  /**
   * Block to report user's username
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.SENSING_USERNAME,
      "category": Blockly.Categories.sensing,
      "checkboxInFlyout": true,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_userid'] = {
  /**
   * Block to report user's ID. Does not actually do anything. This is an
   * obsolete block that is implemented for compatibility with Scratch 2.0
   * projects.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.SENSING_USERID,
      "category": Blockly.Categories.sensing,
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

/* Blockly.Blocks['sensing_menu'] = {
    init: function () {
    this.jsonInit({
      "message0": "%1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "SENSING_MENU",
          "options": [
            ["A", "A"],
            ["B", "B"],
            ["C", "C"],
            ["D", "D"],
            ["E", "E"],
            ["F", "F"],
            ["G", "G"],
            ["H", "H"]
          ]
        },
      ],
      "category": Blockly.Categories.sensing,
      "colour": Blockly.Colours.sensing.primary,
      "colourSecondary": Blockly.Colours.sensing.secondary,
      "colourTertiary": Blockly.Colours.sensing.tertiary,
      "extensions": ["output_string"],
    });
  }
}; */
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

Blockly.Blocks['sensing_key_press'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_key_press",
      "message0": Blockly.Msg.SENSING_KEY_PRESS,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "PORT",
          "options": [
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
        {
          "type": "field_dropdown",
          "name": "status",
          "options": [
            [
              Blockly.Msg.PRESS,
              "press"
            ],
            [
              Blockly.Msg.UNPRESS,
              "unpress"
            ],
          ]
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
              Blockly.Msg.PLEFT,
              "left"
            ],
            [
              Blockly.Msg.PRIGHT,
              "right"
            ],
            [
              Blockly.Msg.DOWN,
              "down"
            ],
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
              Blockly.Msg.FLOATING,
              "Pitch"
            ],
            [
              Blockly.Msg.ROLL,
              "Roll"
            ],
            [
              Blockly.Msg.YAW,
              "Yaw"
            ]
          ]
        },
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_number"]
    });
  }
};

Blockly.Blocks['sensing_magnetic_calibration'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_magnetic_calibration",
      "message0": Blockly.Msg.SENSING_MAGNETIC_CALIBRATION,
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "shape_statement"]
    });
  }
};

Blockly.Blocks['sensing_magnetism'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_magnetism",
      "message0": Blockly.Msg.SENSING_MAGNETISM,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "direction",
          "options": [
            [
              "X",
              "X"
            ],
            [
              "Y",
              "Y"
            ],
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

Blockly.Blocks['sensing_read_pin'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_read_pin",
      "message0": Blockly.Msg.SENSING_READ_PIN,
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
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "output_boolean"]
    });
  }
};

Blockly.Blocks['sensing_write_pin'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_write_pin",
      "message0": Blockly.Msg.SENSING_WRITE_PIN,
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
          "type": "field_number",
          "name": "pin",
          "value": 15,
          "min": -100,
          "max": 100
        }
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "shape_statement"]
    });
  }
};

Blockly.Blocks['sensing_write_analog'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_write_analog",
      "message0": Blockly.Msg.SENSING_WRITE_ANALOG,
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
          "type": "field_number",
          "name": "pin",
          "value": 15,
          "min": -100,
          "max": 100
        }
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "shape_statement"]
    });
  }
};

Blockly.Blocks['sensing_read_analog'] = {
  /**
   * Block to Report if its touching a Object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "type": "sensing_read_analog",
      "message0": Blockly.Msg.SENSING_READ_ANALOG,
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
      ],
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
            [Blockly.Msg.PLEFT ,"left"],
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