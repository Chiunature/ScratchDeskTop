"use strict";

goog.provide("Blockly.Blocks.combined_motor");

goog.require("Blockly.Blocks");
goog.require("Blockly.Colours");
goog.require("Blockly.constants");
goog.require("Blockly.ScratchBlocks.VerticalExtensions");

Blockly.Blocks["combined_motor_box"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_combined_motor",
          name: "MOTOR",
          motorList: ["null", "null", "null", "null", "E", "F", "G", "H"],
        },
      ],
      category: Blockly.Categories.combined_motor,
      colour: Blockly.Colours.combined_motor.primary,
      colourSecondary: Blockly.Colours.combined_motor.secondary,
      colourTertiary: Blockly.Colours.combined_motor.tertiary,
      extensions: ["output_string"],
    });
  },
};

Blockly.Blocks["combined_motorOne_menu"] = {
  /**
   * Sound effects drop-down menu.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "COMBINED_MOTORONE_MENU",
          options: [
            ["A", "A"],
            ["C", "C"],
            ["D", "D"],
            ["E", "E"],
            ["F", "F"],
            ["G", "G"],
            ["H", "H"],
          ],
        },
      ],
      colour: Blockly.Colours.combined_motor.primary,
      colourSecondary: Blockly.Colours.combined_motor.secondary,
      colourTertiary: Blockly.Colours.combined_motor.tertiary,
      extensions: ["output_string"],
    });
  },
};

Blockly.Blocks["combined_motorTwo_menu"] = {
  /**
   * Sound effects drop-down menu.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "COMBINED_MOTORTWO_MENU",
          options: [
            ["B", "B"],
            ["C", "C"],
            ["D", "D"],
            ["E", "E"],
            ["F", "F"],
            ["G", "G"],
            ["H", "H"],
          ],
        },
      ],
      colour: Blockly.Colours.combined_motor.primary,
      colourSecondary: Blockly.Colours.combined_motor.secondary,
      colourTertiary: Blockly.Colours.combined_motor.tertiary,
      extensions: ["output_string"],
    });
  },
};

Blockly.Blocks["combined_motor_starting"] = {
  /**
   * Block to move steps.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.COMBINED_MOTOR_STARTING,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
          width: 32,
          height: 32,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT",
        },
      ],
      category: Blockly.Categories.combined_motor,
      extensions: ["colours_combined_motor", "shape_statement"],
    });
  },
};

Blockly.Blocks["combined_motor_direction"] = {
  /**
   * Block to move steps.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.DIRECTION_MOTOR,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
          width: 32,
          height: 32,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "field_dropdown",
          name: "direction",
          options: [
            [
              {
                src: Blockly.mainWorkspace.options.pathToMedia + "advance.svg",
                width: 25,
                height: 25,
                alt: Blockly.Msg.ADVANCE,
              },
              "Advance",
            ],
            [
              {
                src: Blockly.mainWorkspace.options.pathToMedia + "back.svg",
                width: 25,
                height: 25,
                alt: Blockly.Msg.BACK,
              },
              "Retreat",
            ],
            [
              {
                src:
                  Blockly.mainWorkspace.options.pathToMedia + "turn-left.svg",
                width: 25,
                height: 25,
                alt: Blockly.Msg.TURNLEFT,
              },
              "left",
            ],
            [
              {
                src:
                  Blockly.mainWorkspace.options.pathToMedia + "turn-right.svg",
                width: 25,
                height: 25,
                alt: Blockly.Msg.TURNRIGHT,
              },
              "right",
            ],
            [
              {
                src: Blockly.mainWorkspace.options.pathToMedia + "stop.svg",
                width: 25,
                height: 25,
                alt: Blockly.Msg.STOP,
              },
              "stop",
            ],
          ],
        },
      ],
      category: Blockly.Categories.combined_motor,
      extensions: ["colours_combined_motor", "shape_statement"],
    });
  },
};

Blockly.Blocks["combined_motor_speed"] = {
  /**
   * Block to move steps.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.COMBINED_MOTOR_SPEED,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
          width: 32,
          height: 32,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "SPEED",
        },
      ],
      category: Blockly.Categories.combined_motor,
      extensions: ["colours_combined_motor", "shape_statement"],
    });
  },
};

Blockly.Blocks["combined_motor_turn"] = {
  /**
   * Block to move steps.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.COMBINED_MOTOR_TURN,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
          width: 32,
          height: 32,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "PORT1",
        },
        {
          type: "input_value",
          name: "PORT2",
        },
        {
          type: "field_dropdown",
          name: "SPIN",
          options: [
            [
              {
                src:
                  Blockly.mainWorkspace.options.pathToMedia +
                  "rotate-right.svg",
                width: 32,
                height: 32,
                alt: Blockly.Msg.RIGHT,
              },
              "trueright",
            ],
            [
              {
                src:
                  Blockly.mainWorkspace.options.pathToMedia + "rotate-left.svg",
                width: 32,
                height: 32,
                alt: Blockly.Msg.LEFT,
              },
              "trueleft",
            ],
          ],
        },
        {
          type: "input_value",
          name: "ANGLE",
        },
        {
          type: "field_number",
          name: "distance",
          value: 0,
        },
        {
          type: "field_dropdown",
          name: "result",
          options: [
            [Blockly.Msg.CIRCLE, "circle"],
            [Blockly.Msg.ANGLE, "angle"],
            [Blockly.Msg.SECONDS, "seconds"],
          ],
        },
      ],
      category: Blockly.Categories.combined_motor,
      extensions: ["colours_combined_motor", "shape_statement"],
    });
  },
};

Blockly.Blocks["combined_motor_line"] = {
  /**
   * Block to move steps.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.COMBINED_MOTOR_LINE,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
          width: 32,
          height: 32,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "field_dropdown",
          name: "line",
          options: [
            [
              {
                src: Blockly.mainWorkspace.options.pathToMedia + "advance.svg",
                width: 25,
                height: 25,
                alt: Blockly.Msg.ADVANCE,
              },
              "Advance",
            ],
            [
              {
                src: Blockly.mainWorkspace.options.pathToMedia + "back.svg",
                width: 25,
                height: 25,
                alt: Blockly.Msg.BACK,
              },
              "Retreat",
            ],
            [
              {
                src:
                  Blockly.mainWorkspace.options.pathToMedia + "turn-left.svg",
                width: 25,
                height: 25,
                alt: Blockly.Msg.TURNLEFT,
              },
              "left",
            ],
            [
              {
                src:
                  Blockly.mainWorkspace.options.pathToMedia + "turn-right.svg",
                width: 25,
                height: 25,
                alt: Blockly.Msg.TURNRIGHT,
              },
              "right",
            ],
          ],
        },
        {
          type: "input_value",
          name: "distance",
        },
        {
          type: "field_dropdown",
          name: "unit",
          options: [
            [Blockly.Msg.CIRCLE, "circly"],
            [Blockly.Msg.ANGLE, "angle"],
            [Blockly.Msg.SECONDS, "seconds"],
          ],
        },
      ],
      category: Blockly.Categories.combined_motor,
      extensions: ["colours_combined_motor", "shape_statement"],
    });
  },
};

Blockly.Blocks["combined_motor_stop"] = {
  /**
   * Block to move steps.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.COMBINED_MOTOR_STOP,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
          width: 32,
          height: 32,
          alt: "*",
          flipRtl: false,
        },
      ],
      category: Blockly.Categories.combined_motor,
      extensions: ["colours_combined_motor", "shape_statement"],
    });
  },
};

Blockly.Blocks["combined_motor_move"] = {
  /**
   * Block to move steps.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.COMBINED_MOTOR_MOVE,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
          width: 32,
          height: 32,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "left",
        },
        {
          type: "input_value",
          name: "right",
        },
        {
          type: "field_number",
          name: "distance",
          value: 10,
          min: -100,
          max: 100,
        },
        {
          type: "field_dropdown",
          name: "unit",
          options: [
            [Blockly.Msg.CIRCLE, "circle"],
            [Blockly.Msg.ANGLE, "angle"],
            [Blockly.Msg.SECONDS, "seconds"],
          ],
        },
      ],
      category: Blockly.Categories.combined_motor,
      extensions: ["colours_combined_motor", "shape_statement"],
    });
  },
};

Blockly.Blocks["combined_motor_angle"] = {
  /**
   * Block to move steps.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.COMBINED_MOTOR_ANGLE,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
          width: 32,
          height: 32,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "ANGLE",
        },
      ],
      category: Blockly.Categories.combined_motor,
      extensions: ["colours_combined_motor", "shape_statement"],
    });
  },
};

Blockly.Blocks["combined_motor_stopping"] = {
  /**
   * Block to move steps.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.COMBINED_MOTOR_STOPPING,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
          width: 32,
          height: 32,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "field_dropdown",
          name: "status",
          options: [
            [Blockly.Msg.RETARDATION, "1"],
            [Blockly.Msg.FLOAT, "0"],
          ],
        },
      ],
      category: Blockly.Categories.combined_motor,
      extensions: ["colours_combined_motor", "shape_statement"],
    });
  },
};

Blockly.Blocks["combined_motor_startWithPower"] = {
  /**
   * Block to move steps.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.COMBINED_MOTOR_STARTWITHPOWER,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
          width: 32,
          height: 32,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "POWER_ONE",
        },
        {
          type: "input_value",
          name: "POWER_TWO",
        },
      ],
      category: Blockly.Categories.combined_motor,
      extensions: ["colours_combined_motor", "shape_statement"],
    });
  },
};

Blockly.Blocks["combined_motor_startWithPowerObj"] = {
  /**
   * Block to move steps.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.COMBINED_MOTOR_STARTWITHPOWEROBJ,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
          width: 32,
          height: 32,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "POWER_ONE",
        },
        {
          type: "input_value",
          name: "POWER_TWO",
        },
        {
          type: "input_value",
          name: "COUNT",
        },
      ],
      category: Blockly.Categories.combined_motor,
      extensions: ["colours_combined_motor", "shape_statement"],
    });
  },
};

Blockly.Blocks["combined_motor_moveByYawAngle"] = {
  /**
   * Block to move steps.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.COMBINED_MOTOR_MOVEBYYAWANGLE,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
          width: 32,
          height: 32,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "field_dropdown",
          name: "direction",
          options: [
            [
              {
                src: Blockly.mainWorkspace.options.pathToMedia + "advance.svg",
                width: 25,
                height: 25,
                alt: Blockly.Msg.ADVANCE,
              },
              "Advance",
            ],
            [
              {
                src: Blockly.mainWorkspace.options.pathToMedia + "back.svg",
                width: 25,
                height: 25,
                alt: Blockly.Msg.BACK,
              },
              "Retreat",
            ],
          ],
        },
        {
          type: "input_value",
          name: "COUNT",
        },
        {
          type: "field_dropdown",
          name: "unit",
          options: [
            [Blockly.Msg.CIRCLE, "circly"],
            [Blockly.Msg.ANGLE, "angle"],
            [Blockly.Msg.SECONDS, "seconds"],
          ],
        },
      ],
      category: Blockly.Categories.combined_motor,
      extensions: ["colours_combined_motor", "shape_statement"],
    });
  },
};

Blockly.Blocks["combined_motor_spinByYawAngle"] = {
  /**
   * Block to move steps.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.COMBINED_MOTOR_SPINBYYAWANGLE,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
          width: 32,
          height: 32,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "ANGLE",
        },
      ],
      category: Blockly.Categories.combined_motor,
      extensions: ["colours_combined_motor", "shape_statement"],
    });
  },
};

Blockly.Blocks["combined_motor_pwm"] = {
  /**
   * Block to move steps.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.COMBINED_MOTOR_PWM,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
          width: 32,
          height: 32,
          alt: "*",
          flipRtl: false,
        },
        {
          type: "input_value",
          name: "LEFT_PWM",
        },
        {
          type: "input_value",
          name: "RIGHT_PWM",
        },
      ],
      category: Blockly.Categories.combined_motor,
      extensions: ["colours_combined_motor", "shape_statement"],
    });
  },
};

Blockly.Blocks["combined_linepatrolInit"] = {
  init: function () {
    this.jsonInit({
      type: "combined_linepatrolInit",
      message0: Blockly.Msg.SENSING_LINEPATROLINIT,
      args0: [],
      category: Blockly.Categories.combined_motor,
      extensions: ["colours_combined_motor", "shape_statement"],
    });
  },
};

Blockly.Blocks["combined_linepatrol"] = {
  init: function () {
    this.jsonInit({
      type: "combined_linepatrol",
      message0: Blockly.Msg.SENSING_LINEPATROL,
      args0: [
        {
          type: "input_value",
          name: "PORT_ONE",
        },
        {
          type: "input_value",
          name: "PORT_TWO",
        },
        {
          type: "input_value",
          name: "SPEED",
        },
        {
          type: "input_value",
          name: "KP",
        },
        {
          type: "input_value",
          name: "KD",
        },
        // {
        //   type: "input_value",
        //   name: "SPIN_PARAMS",
        // },
      ],
      category: Blockly.Categories.combined_motor,
      extensions: ["colours_combined_motor", "shape_statement"],
    });
  },
};

Blockly.Blocks["combined_linepatrol_ltr"] = {
  init: function () {
    this.jsonInit({
      type: "combined_linepatrol_ltr",
      message0: Blockly.Msg.SENSING_LINEPATROL_LTR,
      args0: [
        {
          type: "input_value",
          name: "PORT_ONE",
        },
        {
          type: "input_value",
          name: "PORT_TWO",
        },
        {
          type: "input_value",
          name: "LEFT",
        },
        {
          type: "input_value",
          name: "RIGHT",
        },
        {
          type: "input_value",
          name: "KP",
        },
        {
          type: "input_value",
          name: "KD",
        },
        // {
        //   type: "input_value",
        //   name: "SPIN_PARAMS",
        // },
      ],
      category: Blockly.Categories.combined_motor,
      extensions: ["colours_combined_motor", "shape_statement"],
    });
  },
};
