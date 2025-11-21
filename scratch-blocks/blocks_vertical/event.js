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

goog.provide("Blockly.Blocks.event");

goog.require("Blockly.Blocks");
goog.require("Blockly.Colours");
goog.require("Blockly.constants");
goog.require("Blockly.ScratchBlocks.VerticalExtensions");

Blockly.Blocks["event_whentouchingobject"] = {
  /**
   * Block for when a sprite is touching an object.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.EVENT_WHENTOUCHINGOBJECT,
      args0: [
        {
          type: "input_value",
          name: "TOUCHINGOBJECTMENU",
        },
      ],
      category: Blockly.Categories.event,
      extensions: ["colours_event", "shape_hat"],
    });
  },
};

Blockly.Blocks["event_checkcolor"] = {
  /**
   * "Touching [Object]" Block Menu.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.EVENT_CHECKCOLOR,
      args0: [
        {
          type: "field_dropdown",
          name: "PORT",
          options: [
            ["A", "A"],
            ["B", "B"],
            ["C", "C"],
            ["D", "D"],
            ["E", "E"],
            ["F", "F"],
            ["G", "G"],
            ["H", "H"],
          ],
        },
        {
          type: "input_value",
          name: "COLOR",
        },
      ],
      extensions: ["colours_event", "shape_hat"],
    });
  },
};

Blockly.Blocks["event_keyjudement"] = {
  /**
   * "Touching [Object]" Block Menu.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.EVENT_KEYJUDEMENT,
      args0: [
        {
          type: "field_dropdown",
          name: "PORT",
          options: [
            ["A", "A"],
            ["B", "B"],
            ["C", "C"],
            ["D", "D"],
            ["E", "E"],
            ["F", "F"],
            ["G", "G"],
            ["H", "H"],
          ],
        },
        {
          type: "field_dropdown",
          name: "status",
          options: [
            [Blockly.Msg.PRESS, "press"],
            [Blockly.Msg.UNPRESS, "unpress"],
          ],
        },
      ],
      extensions: ["colours_event", "shape_hat"],
    });
  },
};

Blockly.Blocks["event_tilts"] = {
  /**
   * "Touching [Object]" Block Menu.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.EVENT_TILTS,
      args0: [
        {
          type: "field_dropdown",
          name: "direction",
          options: [
            [Blockly.Msg.PLEFT, "left"],
            [Blockly.Msg.PRIGHT, "right"],
            [Blockly.Msg.UP, "up"],
            [Blockly.Msg.DOWN, "down"],
          ],
        },
      ],
      extensions: ["colours_event", "shape_hat"],
    });
  },
};

Blockly.Blocks["event_keypress"] = {
  /**
   * "Touching [Object]" Block Menu.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.EVENT_KEYPRESS,
      args0: [
        {
          type: "field_dropdown",
          name: "direction",
          options: [
            [Blockly.Msg.PLEFT, "left"],
            [Blockly.Msg.PRIGHT, "right"],
            [Blockly.Msg.UP, "up"],
            [Blockly.Msg.DOWN, "down"],
          ],
        },
        {
          type: "field_dropdown",
          name: "status",
          options: [
            [Blockly.Msg.PRESS, "press"],
            [Blockly.Msg.UNPRESS, "unpress"],
          ],
        },
      ],
      extensions: ["colours_event", "shape_hat"],
    });
  },
};

Blockly.Blocks["event_touchingobjectmenu"] = {
  /**
   * "Touching [Object]" Block Menu.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "TOUCHINGOBJECTMENU",
          options: [
            [Blockly.Msg.SENSING_TOUCHINGOBJECT_POINTER, "_mouse_"],
            [Blockly.Msg.SENSING_TOUCHINGOBJECT_EDGE, "_edge_"],
          ],
        },
      ],
      extensions: ["colours_event", "output_string"],
    });
  },
};

Blockly.Blocks["event_whenflagclicked"] = {
  /**
   * Block for when flag clicked.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      id: "event_whenflagclicked",
      message0: Blockly.Msg.EVENT_WHENFLAGCLICKED,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "green-flag.svg",
          width: 24,
          height: 24,
          alt: "flag",
        },
      ],
      category: Blockly.Categories.event,
      extensions: ["colours_event", "shape_hat"],
    });
  },

  /**
   * 检查工作区中是否已存在该积木
   * 注意：此函数已不再用于阻止多个积木的创建，现在允许创建多个 event_whenflagclicked 积木
   * @return {boolean} 始终返回 false，允许创建多个积木
   */
  checkBlockExists: function () {
    // 现在允许创建多个 event_whenflagclicked 积木，每个积木会自动分配唯一的用户名（user1, user2等）
    return false;
  },
};

Blockly.Blocks["event_whenthisspriteclicked"] = {
  /**
   * Block for when this sprite clicked.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.EVENT_WHENTHISSPRITECLICKED,
      category: Blockly.Categories.event,
      extensions: ["colours_event", "shape_hat"],
    });
  },
};

Blockly.Blocks["event_whenstageclicked"] = {
  /**
   * Block for when the stage is clicked.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.EVENT_WHENSTAGECLICKED,
      category: Blockly.Categories.event,
      extensions: ["colours_event", "shape_hat"],
    });
  },
};

Blockly.Blocks["event_whenbackdropswitchesto"] = {
  /**
   * Block for when the current backdrop switched to a selected backdrop.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.EVENT_WHENBACKDROPSWITCHESTO,
      args0: [
        {
          type: "field_dropdown",
          name: "BACKDROP",
          options: [["backdrop1", "BACKDROP1"]],
        },
      ],
      category: Blockly.Categories.event,
      extensions: ["colours_event", "shape_hat"],
    });
  },
};

Blockly.Blocks["event_whengreaterthan"] = {
  /**
   * Block for when loudness/timer/video motion is greater than the value.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.EVENT_WHENGREATERTHAN,
      args0: [
        {
          type: "field_dropdown",
          name: "WHENGREATERTHANMENU",
          options: [
            [Blockly.Msg.EVENT_WHENGREATERTHAN_LOUDNESS, "LOUDNESS"],
            [Blockly.Msg.EVENT_WHENGREATERTHAN_TIMER, "TIMER"],
          ],
        },
        {
          type: "input_value",
          name: "VALUE",
        },
      ],
      category: Blockly.Categories.event,
      extensions: ["colours_event", "shape_hat"],
    });
  },
};

Blockly.Blocks["event_broadcast_menu"] = {
  /**
   * Broadcast drop-down menu.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_variable",
          name: "BROADCAST_OPTION",
          variableTypes: [Blockly.BROADCAST_MESSAGE_VARIABLE_TYPE],
          variable: "msg1",
        },
      ],
      colour: Blockly.Colours.event.secondary,
      colourSecondary: Blockly.Colours.event.secondary,
      colourTertiary: Blockly.Colours.event.tertiary,
      extensions: ["output_string"],
    });
  },
};

/*Blockly.Blocks['event_whenkeypressed'] = {
  /!**
   * Block to send a broadcast.
   * @this Blockly.Block
   *!/
  init: function () {
    this.jsonInit({
      "id": "event_whenkeypressed",
      "message0": Blockly.Msg.EVENT_WHENKEYPRESSED,
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
      "category": Blockly.Categories.event,
      "extensions": ["colours_event", "shape_hat"]
    });
  }
};*/

Blockly.Blocks["event_when"] = {
  /**
   * Block to send a broadcast.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      id: "event_whenkeypressed",
      message0: Blockly.Msg.EVENT_WHEN,
      message1: "%1",
      args0: [
        {
          type: "input_value",
          name: "CONDITION",
          check: "Boolean",
        },
      ],
      args1: [
        {
          type: "input_statement",
          name: "SUBSTACK",
        },
      ],
      category: Blockly.Categories.event,
      extensions: ["colours_event", "shape_startAndEnd"],
    });
  },
};
