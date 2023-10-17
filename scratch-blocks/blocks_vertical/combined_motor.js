'use strict';

goog.provide('Blockly.Blocks.combined_motor');

goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.constants');
goog.require('Blockly.ScratchBlocks.VerticalExtensions');


Blockly.Blocks['combined_motorOne_menu'] = {
    /**
     * Sound effects drop-down menu.
     * @this Blockly.Block
     */
    init: function() {
      this.jsonInit({
        "message0": "%1",
        "args0": [
          {
            "type": "field_dropdown",
            "name": "COMBINED_MOTORONE_MENU",
            "options": [
                ["A", "A"],
                ["C", "C"],
                ["D", "D"], 
                ["E", "E"], 
                ["F", "F"], 
                ["G", "G"], 
                ["H", "H"]
            ]
          }
        ],
        "colour": Blockly.Colours.combined_motor.primary,
        "colourSecondary": Blockly.Colours.combined_motor.secondary,
        "colourTertiary": Blockly.Colours.combined_motor.tertiary,
        "extensions": ["output_string"]
      });
    }
  };

  Blockly.Blocks['combined_motorTwo_menu'] = {
    /**
     * Sound effects drop-down menu.
     * @this Blockly.Block
     */
    init: function() {
      this.jsonInit({
        "message0": "%1",
        "args0": [
          {
            "type": "field_dropdown",
            "name": "COMBINED_MOTORTWO_MENU",
            "options": [
                ["B", "B"],
                ["C", "C"],
                ["D", "D"], 
                ["E", "E"], 
                ["F", "F"], 
                ["G", "G"], 
                ["H", "H"]
            ]
          }
        ],
        "colour": Blockly.Colours.combined_motor.primary,
        "colourSecondary": Blockly.Colours.combined_motor.secondary,
        "colourTertiary": Blockly.Colours.combined_motor.tertiary,
        "extensions": ["output_string"]
      });
    }
  };

Blockly.Blocks['combined_motor_starting'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.COMBINED_MOTOR_STARTING,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
                    "width": 20,
                    "height": 20,
                    "alt": "*",
                    "flipRtl": false
                },
                {
                    "type": "input_value",
                    "name": "PORT1",
                },
                {
                    "type": "input_value",
                    "name": "PORT2",
                }
            ],
            "category": Blockly.Categories.combined_motor,
            "extensions": ["colours_combined_motor", "shape_statement"],
        });
    }
};

Blockly.Blocks['combined_motor_direction'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.DIRECTION_MOTOR,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
                    "width": 20,
                    "height": 20,
                    "alt": "*",
                    "flipRtl": false
                },
                {
                    "type": "input_value",
                    "name": "PORT1",
                },
                {
                    "type": "input_value",
                    "name": "PORT2",
                },
                {
                    "type": "field_dropdown",
                    "name": "direction",
                    "options": [
                        [
                            {
                                "src": Blockly.mainWorkspace.options.pathToMedia + "rotate-left.svg",
                                "width": 20,
                                "height": 20,
                                "alt": Blockly.Msg.LEFT
                            },
                            "turnleft"
                        ],
                        [
                            {
                                "src": Blockly.mainWorkspace.options.pathToMedia + "rotate-right.svg",
                                "width": 20,
                                "height": 20,
                                "alt": Blockly.Msg.RIGHT
                            },
                            "turnright"
                        ]
                    ]
                }
            ],
            "category": Blockly.Categories.combined_motor,
            "extensions": ["colours_combined_motor", "shape_statement"],
        });
    }
};

Blockly.Blocks['combined_motor_speed'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.COMBINED_MOTOR_SPEED,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
                    "width": 20,
                    "height": 20,
                    "alt": "*",
                    "flipRtl": false
                },
                {
                    "type": "input_value",
                    "name": "PORT1",
                },
                {
                    "type": "input_value",
                    "name": "PORT2",
                },
                {
                    "type": "input_value",
                    "name": "SPEED",
                }
            ],
            "category": Blockly.Categories.combined_motor,
            "extensions": ["colours_combined_motor", "shape_statement"],
        });
    }
};

Blockly.Blocks['combined_motor_turn'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.COMBINED_MOTOR_TURN,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
                    "width": 20,
                    "height": 20,
                    "alt": "*",
                    "flipRtl": false
                },
                {
                    "type": "input_value",
                    "name": "PORT1",
                },
                {
                    "type": "input_value",
                    "name": "PORT2",
                },
                {
                    "type": "field_dropdown",
                    "name": "SPIN",
                    "options": [
                        [
                            {
                                "src": Blockly.mainWorkspace.options.pathToMedia + "rotate-right.svg",
                                "width": 20,
                                "height": 20,
                                "alt": Blockly.Msg.RIGHT,
                            },
                            "turnright"
                        ],
                        [
                            {
                                "src": Blockly.mainWorkspace.options.pathToMedia + "rotate-left.svg",
                                "width": 20,
                                "height": 20,
                                "alt": Blockly.Msg.LEFT,
                            },
                            "turnleft"
                        ]
                    ]
                },
                {
                    "type": "input_value",
                    "name": "ANGLE",
                },
                {
                    "type": "field_number",
                    "name": "distance",
                    "value": 0
                },
                {
                    "type": "field_dropdown",
                    "name": "result",
                    "options": [
                        [
                            Blockly.Msg.CIRCLE,
                            "circle"
                        ],
                        [
                            Blockly.Msg.ANGLE,
                            "angle"
                        ],
                        [
                            Blockly.Msg.SECONDS,
                            "seconds"
                        ]
                    ]
                }
            ],
            "category": Blockly.Categories.combined_motor,
            "extensions": ["colours_combined_motor", "shape_statement"],
        });
    }
};

Blockly.Blocks['combined_motor_line'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.COMBINED_MOTOR_LINE,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
                    "width": 20,
                    "height": 20,
                    "alt": "*",
                    "flipRtl": false
                },
                {
                    "type": "input_value",
                    "name": "PORT1",
                },
                {
                    "type": "input_value",
                    "name": "PORT2",
                },
                {
                    "type": "field_dropdown",
                    "name": "line",
                    "options": [
                        [
                            {
                                "src": Blockly.mainWorkspace.options.pathToMedia + "advance.svg",
                                "width": 20,
                                "height": 20,
                                "alt": Blockly.Msg.ADVANCE
                            },
                            "advance"
                        ],
                        [
                            {
                                "src": Blockly.mainWorkspace.options.pathToMedia + "back.svg",
                                "width": 20,
                                "height": 20,
                                "alt": Blockly.Msg.BACK
                            },
                            "back"
                        ],
                    ]
                },
                {
                    "type": "field_number",
                    "name": "distance",
                    "value": 0
                },
                {
                    "type": "field_dropdown",
                    "name": "unit",
                    "options": [
                        [
                            Blockly.Msg.CIRCLE,
                            "circle"
                        ],
                        [
                            Blockly.Msg.ANGLE,
                            "angle"
                        ],
                        [
                            Blockly.Msg.SECONDS,
                            "seconds"
                        ]
                    ]
                }
            ],
            "category": Blockly.Categories.combined_motor,
            "extensions": ["colours_combined_motor", "shape_statement"],
        });
    }
};

Blockly.Blocks['combined_motor_stop'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.COMBINED_MOTOR_STOP,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
                    "width": 20,
                    "height": 20,
                    "alt": "*",
                    "flipRtl": false
                },
                {
                    "type": "input_value",
                    "name": "PORT1",
                },
                {
                    "type": "input_value",
                    "name": "PORT2",
                },
            ],
            "category": Blockly.Categories.combined_motor,
            "extensions": ["colours_combined_motor", "shape_statement"],
        });
    }
};

Blockly.Blocks['combined_motor_move'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.COMBINED_MOTOR_MOVE,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
                    "width": 20,
                    "height": 20,
                    "alt": "*",
                    "flipRtl": false
                },
                {
                    "type": "input_value",
                    "name": "left",
                },
                {
                    "type": "input_value",
                    "name": "right",
                },
                {
                    "type": "field_number",
                    "name": "distance",
                    "value": 10,
                    "min": -100,
                    "max": 100
                },
                {
                    "type": "field_dropdown",
                    "name": "unit",
                    "options": [
                        [
                            Blockly.Msg.CIRCLE,
                            "circle"
                        ],
                        [
                            Blockly.Msg.ANGLE,
                            "angle"
                        ],
                        [
                            Blockly.Msg.SECONDS,
                            "seconds"
                        ]
                    ]
                }
            ],
            "category": Blockly.Categories.combined_motor,
            "extensions": ["colours_combined_motor", "shape_statement"],
        });
    }
};

Blockly.Blocks['combined_motor_movestep'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.COMBINED_MOTOR_MOVESTEP,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
                    "width": 20,
                    "height": 20,
                    "alt": "*",
                    "flipRtl": false
                },
                {
                    "type": "input_value",
                    "name": "PORT1",
                },
                {
                    "type": "input_value",
                    "name": "PORT2",
                },
                {
                    "type": "input_value",
                    "name": "left",
                },
                {
                    "type": "input_value",
                    "name": "right",
                }
            ],
            "category": Blockly.Categories.combined_motor,
            "extensions": ["colours_combined_motor", "shape_statement"],
        });
    }
};

Blockly.Blocks['combined_motor_movepower'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.COMBINED_MOTOR_MOVEPOWER,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
                    "width": 20,
                    "height": 20,
                    "alt": "*",
                    "flipRtl": false
                },
                {
                    "type": "input_value",
                    "name": "power",
                },
                {
                    "type": "field_dropdown",
                    "name": "direction",
                    "options": [
                        [
                            {
                                "src": Blockly.mainWorkspace.options.pathToMedia + "rotate-left.svg",
                                "width": 20,
                                "height": 20,
                                "alt": Blockly.Msg.LEFT
                            },
                            "turnleft"
                        ],
                        [
                            {
                                "src": Blockly.mainWorkspace.options.pathToMedia + "rotate-right.svg",
                                "width": 20,
                                "height": 20,
                                "alt": Blockly.Msg.RIGHT
                            },
                            "turnright"
                        ],
                        // [
                        //     {
                        //         "src": Blockly.mainWorkspace.options.pathToMedia + "advance.svg",
                        //         "width": 20,
                        //         "height": 20,
                        //         "alt": Blockly.Msg.ADVANCE
                        //     },
                        //     "advance"
                        // ],
                        // [
                        //     {
                        //         "src": Blockly.mainWorkspace.options.pathToMedia + "back.svg",
                        //         "width": 20,
                        //         "height": 20,
                        //         "alt": Blockly.Msg.BACK
                        //     },
                        //     "back"
                        // ],
                    ]
                },
                {
                    "type": "input_value",
                    "name": "ANGLE",
                }
            ],
            "category": Blockly.Categories.combined_motor,
            "extensions": ["colours_combined_motor", "shape_statement"],
        });
    }
};

Blockly.Blocks['combined_motor_stopping'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.COMBINED_MOTOR_STOPPING,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "combined_motor.svg",
                    "width": 20,
                    "height": 20,
                    "alt": "*",
                    "flipRtl": false
                },
                {
                    "type": "input_value",
                    "name": "PORT1",
                },
                {
                    "type": "input_value",
                    "name": "PORT2",
                },
                {
                    "type": "field_dropdown",
                    "name": "status",
                    "options": [
                        [
                            Blockly.Msg.RETARDATION,
                            "retardation"
                        ],
                        [
                            Blockly.Msg.STILL,
                            "still"
                        ],
                        [
                            Blockly.Msg.FLOAT,
                            "float"
                        ]
                    ]
                }
            ],
            "category": Blockly.Categories.combined_motor,
            "extensions": ["colours_combined_motor", "shape_statement"],
        });
    }
};