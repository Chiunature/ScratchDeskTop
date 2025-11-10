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
   * @return {boolean} 如果已存在则返回 true
   */
  checkBlockExists: function () {
    if (this.isInFlyout) {
      return false; // 工具箱中的积木不检查
    }

    var workspace = this.workspace;
    if (!workspace) {
      return false;
    }

    var allBlocks = workspace.getAllBlocks();
    for (var i = 0; i < allBlocks.length; i++) {
      var block = allBlocks[i];
      if (block.type === "event_whenflagclicked" && block.id !== this.id) {
        return true; // 找到了另一个相同类型的积木
      }
    }
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

Blockly.Blocks["event_broadcastandwait"] = {
  /**
   * Block to send a broadcast.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.EVENT_BROADCASTANDWAIT,
      args0: [
        /*{
          "type": "input_value",
          "name": "BROADCAST_INPUT"
        }*/
        {
          type: "field_dropdown",
          name: "BROADCAST_INPUT",
          options: [
            ["MSG1", "0"],
            ["MSG2", "1"],
            ["MSG3", "2"],
            ["MSG4", "3"],
            ["MSG5", "4"],
            ["MSG6", "5"],
            ["MSG7", "6"],
            ["MSG8", "7"],
            ["MSG9", "8"],
            ["MSG10", "9"],
            ["MSG11", "10"],
            ["MSG12", "11"],
            ["MSG13", "12"],
            ["MSG14", "13"],
            ["MSG15", "14"],
            ["MSG16", "15"],
            ["MSG17", "16"],
            ["MSG18", "17"],
            ["MSG19", "18"],
            ["MSG20", "19"],
            ["MSG21", "20"],
            ["MSG22", "21"],
            ["MSG23", "22"],
            ["MSG24", "23"],
            ["MSG25", "24"],
            ["MSG26", "25"],
            ["MSG27", "26"],
            ["MSG28", "27"],
            ["MSG29", "28"],
            ["MSG30", "29"],
            ["MSG31", "30"],
            ["MSG32", "31"],
          ],
        },
      ],
      category: Blockly.Categories.event,
      extensions: ["colours_event", "shape_statement"],
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
