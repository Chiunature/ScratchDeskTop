'use strict';

goog.provide('Blockly.Blocks.motor');

goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.constants');
goog.require('Blockly.ScratchBlocks.VerticalExtensions');

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
                    "type": "field_dropdown",
                    "name": "action",
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
            ],
            "category": Blockly.Categories.motor,
            "extensions": ["colours_motion", "output_number"],
        });
    }
};