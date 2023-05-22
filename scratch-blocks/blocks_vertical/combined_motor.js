'use strict';

goog.provide('Blockly.Blocks.combined_motor');

goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.constants');
goog.require('Blockly.ScratchBlocks.VerticalExtensions');

Blockly.Blocks['combined_motor_starting'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.STARTING_COMBINED_MOTOR,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "motor.svg",
                    "width": 20,
                    "height": 20,
                    "alt": "*",
                    "flipRtl": false
                },
                {
                    "type": "field_dropdown",
                    "name": "PORT1",
                    "options": [
                        [
                            "A",
                            "A"
                        ],
                        [
                            "B",
                            "B"
                        ],
                        [
                            "C",
                            "C"
                        ],
                        [
                            "D",
                            "D"
                        ], ["E", "E"], ["F", "F"], ["G", "G"], ["H", "H"]
                    ]
                },
                {
                    "type": "field_dropdown",
                    "name": "PORT2",
                    "options": [
                        [
                            "A",
                            "A"
                        ],
                        [
                            "B",
                            "B"
                        ],
                        [
                            "C",
                            "C"
                        ],
                        [
                            "D",
                            "D"
                        ], ["E", "E"], ["F", "F"], ["G", "G"], ["H", "H"]
                    ]
                },
            ],
            "category": Blockly.Categories.combined_motor,
            "colour": 315,
            "extensions": ["colours_sounds", "shape_statement"],
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
                    "src": Blockly.mainWorkspace.options.pathToMedia + "motor.svg",
                    "width": 20,
                    "height": 20,
                    "alt": "*",
                    "flipRtl": false
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
                }
            ],
            "category": Blockly.Categories.combined_motor,
            "extensions": ["colours_sounds", "shape_statement"],
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
            "message0": Blockly.Msg.SPEED_MOTOR,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "motor.svg",
                    "width": 20,
                    "height": 20,
                    "alt": "*",
                    "flipRtl": false
                },
                {
                    "type": "field_dropdown",
                    "name": "PORT",
                    "options": [
                        [
                            "A",
                            "A"
                        ],
                        [
                            "B",
                            "B"
                        ],
                        [
                            "C",
                            "C"
                        ],
                        [
                            "D",
                            "D"
                        ], ["E", "E"], ["F", "F"], ["G", "G"], ["H", "H"]
                    ]
                },
                {
                    "type": "input_value",
                    "name": "SPEED",
                }
            ],
            "category": Blockly.Categories.combined_motor,
            "extensions": ["colours_sounds", "shape_statement"],
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
            "message0": Blockly.Msg.TURN_COMBINED_MOTOR,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "motor.svg",
                    "width": 20,
                    "height": 20,
                    "alt": "*",
                    "flipRtl": false
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
                    "type": "field_angle",
                    "name": "angle",
                    "angle": 0
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
                            Blockly.Msg.CENTIMETRE,
                            "cm"
                        ],
                        [
                            Blockly.Msg.INCH,
                            "inch"
                        ],
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
            "extensions": ["colours_sounds", "shape_statement"],
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
            "message0": Blockly.Msg.LINE_COMBINED_MOTOR,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "motor.svg",
                    "width": 20,
                    "height": 20,
                    "alt": "*",
                    "flipRtl": false
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
                            Blockly.Msg.CENTIMETRE,
                            "cm"
                        ],
                        [
                            Blockly.Msg.INCH,
                            "inch"
                        ],
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
            "extensions": ["colours_sounds", "shape_statement"],
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
            "message0": Blockly.Msg.STOP_COMBINED_MOTOR,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "motor.svg",
                    "width": 20,
                    "height": 20,
                    "alt": "*",
                    "flipRtl": false
                },
            ],
            "category": Blockly.Categories.combined_motor,
            "extensions": ["colours_sounds", "shape_statement"],
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
            "message0": Blockly.Msg.MOVE_COMBINED_MOTOR,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "motor.svg",
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
                            Blockly.Msg.CENTIMETRE,
                            "cm"
                        ],
                        [
                            Blockly.Msg.INCH,
                            "inch"
                        ],
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
            "extensions": ["colours_sounds", "shape_statement"],
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
            "message0": Blockly.Msg.MOVESTEP_COMBINED_MOTOR,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "motor.svg",
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
                }
            ],
            "category": Blockly.Categories.combined_motor,
            "extensions": ["colours_sounds", "shape_statement"],
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
            "message0": Blockly.Msg.MOVEPOWER_COMBINED_MOTOR,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "motor.svg",
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
                    "type": "field_angle",
                    "name": "angle",
                    "angle": 0
                }
            ],
            "category": Blockly.Categories.combined_motor,
            "extensions": ["colours_sounds", "shape_statement"],
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
            "message0": Blockly.Msg.STOPPING_COMBINED_MOTOR,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "motor.svg",
                    "width": 20,
                    "height": 20,
                    "alt": "*",
                    "flipRtl": false
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
            "extensions": ["colours_sounds", "shape_statement"],
        });
    }
};