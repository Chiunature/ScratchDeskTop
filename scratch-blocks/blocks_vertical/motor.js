'use strict';

goog.provide('Blockly.Blocks.motor');

goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.constants');
goog.require('Blockly.ScratchBlocks.VerticalExtensions');

Blockly.Blocks['motor_box'] = {
    /**
     * Block for colour card.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_motor",
                    "name": "MOTOR",
                    "motorList": ["A", "B", "C", "D", "E", "F", "G", "H"]
                }
            ],
            "category": Blockly.Categories.motor,
            "colour": Blockly.Colours.motor.primary,
            "colourSecondary": Blockly.Colours.motor.secondary,
            "colourTertiary": Blockly.Colours.motor.tertiary,
            "extensions": ["output_string"],
        });
    }
};


Blockly.Blocks['motor_menu'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "MOTOR_MENU",
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
            "category": Blockly.Categories.motor,
            "colour": Blockly.Colours.motor.primary,
            "colourSecondary": Blockly.Colours.motor.secondary,
            "colourTertiary": Blockly.Colours.motor.tertiary,
            "extensions": ["output_string"],
        });
    }
};

Blockly.Blocks['motor_acceleration_menu'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "MENU",
                    "options": [
                        [Blockly.Msg.DEFAULT, "default"],
                        [Blockly.Msg.FAST, "fast"],
                        // [Blockly.Msg.BALANCE, "balance"],
                        // [Blockly.Msg.SMOOTH, "smooth"],
                        [Blockly.Msg.SLOW, "slow"],
                        // [Blockly.Msg.SLOWER, "slower"],
                    ]
                },
            ],
            "category": Blockly.Categories.motor,
            "colour": Blockly.Colours.motor.primary,
            "colourSecondary": Blockly.Colours.motor.secondary,
            "colourTertiary": Blockly.Colours.motor.tertiary,
            "extensions": ["output_string"],
        });
    }
};

Blockly.Blocks['motor_acceleration'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.MOTOR_ACCELERATION,
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
                    "name": "MENU",
                },
            ],
            "category": Blockly.Categories.motor,
            "extensions": ["colours_motion", "shape_statement"],
        });
    }
};


Blockly.Blocks['motor_starting'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.STARTING_MOTOR,
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
                    "name": "PORT",
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
                            "Advance"
                        ],
                        [
                            {
                                "src": Blockly.mainWorkspace.options.pathToMedia + "rotate-left.svg",
                                "width": 20,
                                "height": 20,
                                "alt": Blockly.Msg.LEFT,
                            },
                            "Retreat"
                        ]
                    ]
                }
            ],
            "category": Blockly.Categories.motor,
            "extensions": ["colours_motion", "shape_statement"],
        });
    }
};

Blockly.Blocks['motor_stop'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.STOP_MOTOR,
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
                    "name": "PORT",
                },
            ],
            "category": Blockly.Categories.motor,
            "extensions": ["colours_motion", "shape_statement"],
        });
    }
};

Blockly.Blocks['motor_speed'] = {
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
                    "type": "input_value",
                    "name": "PORT",
                },
                {
                    "type": "input_value",
                    "name": "SPEED",
                }
            ],
            "category": Blockly.Categories.motor,
            "extensions": ["colours_motion", "shape_statement"],
        });
    }
};

Blockly.Blocks['motor_specifiedunit'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.SPECIFIEDUNIT_MOTOR,
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
                    "name": "PORT",
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
                            "Advance"
                        ],
                        [
                            {
                                "src": Blockly.mainWorkspace.options.pathToMedia + "rotate-left.svg",
                                "width": 20,
                                "height": 20,
                                "alt": Blockly.Msg.LEFT,
                            },
                            "Retreat"
                        ]
                    ]
                },
                {
                    "type": "input_value",
                    "name": "COUNT",
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
            "category": Blockly.Categories.motor,
            "extensions": ["colours_motion", "shape_statement"],
        });
    }
};

Blockly.Blocks['motor_specifiedangle'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.SPECIFIEDANGLE_MOTOR,
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
                    "name": "PORT",
                },
                {
                    "type": "field_dropdown",
                    "name": "SPIN",
                    "options": [
                        [
                            Blockly.Msg.CLOCKWISE,
                            "clockwise"
                        ],
                        [
                            Blockly.Msg.ANTICLOCKWISE,
                            "anticlockwise"
                        ]
                    ]
                },
                {
                    "type": "input_value",
                    "name": "ANGLE",
                }
            ],
            "category": Blockly.Categories.motor,
            "extensions": ["colours_motion", "shape_statement"],
        });
    }
};

Blockly.Blocks['motor_relative_position'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.RELATIVE_POSITION,
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
                    "name": "PORT",
                },
                {
                    "type": "field_number",
                    "name": "position",
                    "value": 0
                }
            ],
            "category": Blockly.Categories.motor,
            "extensions": ["colours_motion", "shape_statement"],
        });
    }
};

Blockly.Blocks['motor_specified_manner'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.SPECIFIED_MANNER,
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
                    "name": "PORT",
                },
                {
                    "type": "field_dropdown",
                    "name": "action",
                    "options": [
                        [
                            Blockly.Msg.RETARDATION,
                            "breaking"
                        ],
                        [
                            Blockly.Msg.STILL,
                            "hold"
                        ],
                        [
                            Blockly.Msg.FLOAT,
                            "slide"
                        ]
                    ]
                }
            ],
            "category": Blockly.Categories.motor,
            "extensions": ["colours_motion", "shape_statement"],
        });
    }
};

Blockly.Blocks['motor_rate'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.RATE_MOTOR,
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
                    "name": "PORT",
                },
            ],
            "category": Blockly.Categories.motor,
            "extensions": ["colours_motion", "output_number"],
        });
    }
};

Blockly.Blocks['motor_angle'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.ANGLE_MOTOR,
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
                    "name": "PORT",
                },
            ],
            "category": Blockly.Categories.motor,
            "extensions": ["colours_motion", "output_number"],
        });
    }
};

Blockly.Blocks['motor_position'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.MOTOR_POSITION,
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
                    "name": "PORT",
                },
            ],
            "category": Blockly.Categories.motor,
            "extensions": ["colours_motion", "output_number"],
        });
    }
};

Blockly.Blocks['motor_startWithPower'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.MOTOR_STARTWITHPOWER,
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
                    "name": "PORT",
                },
                {
                    "type": "input_value",
                    "name": "POWER",
                },
            ],
            "category": Blockly.Categories.motor,
            "extensions": ["colours_motion", "shape_statement"],
        });
    }
};

Blockly.Blocks['motor_setStill'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.MOTOR_SETSTILL,
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
                    "name": "MOTOR_TYPE",
                    "options": [
                        [
                            Blockly.Msg.BIG_MOTOR,
                            "big_motor_hold_pid"
                        ],
                        [
                            Blockly.Msg.SMALL_MOTOR,
                            "small_motor_hold_pid"
                        ]
                    ]
                },
                {
                    "type": "input_value",
                    "name": "P",
                },
                {
                    "type": "input_value",
                    "name": "I",
                },
                {
                    "type": "input_value",
                    "name": "D",
                },
            ],
            "category": Blockly.Categories.motor,
            "extensions": ["colours_motion", "shape_statement"],
        });
    }
};