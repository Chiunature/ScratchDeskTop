'use strict';

goog.provide('Blockly.Blocks.motor');

goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.constants');
goog.require('Blockly.ScratchBlocks.VerticalExtensions');

Blockly.Blocks['starting_motor'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "starting_motor",
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
                }
            ],
            "category": Blockly.Categories.motor,
            "extensions": ["colours_motion", "shape_statement"],
        });
    }
};

Blockly.Blocks['stop_motor'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "stop_motor",
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

Blockly.Blocks['speed_motor'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "speed_motor",
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
                    "type": "field_slider",
                    "name": "SPEED",
                    "value": "0",
                    "precision": 1,
                    "min": "0",
                    "max": "100"
                }
            ],
            "category": Blockly.Categories.motor,
            "extensions": ["colours_motion", "shape_statement"],
        });
    }
};

Blockly.Blocks['specifiedunit_motor'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "specifiedunit_motor",
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
                            "trunright"
                        ],
                        [
                            {
                                "src": Blockly.mainWorkspace.options.pathToMedia + "rotate-left.svg",
                                "width": 20,
                                "height": 20,
                                "alt": Blockly.Msg.LEFT,
                            },
                            "trunleft"
                        ]
                    ]
                },
                {
                    "type": "field_number",
                    "name": "count",
                    "value": 1,
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

Blockly.Blocks['specifiedangle_motor'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "specifiedangle_motor",
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
                            Blockly.Msg.PATH,
                            "path"
                        ],
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
                    "type": "field_angle",
                    "name": "ANGLE",
                    "angle": 0
                }
            ],
            "colour": Blockly.Colours.motion.secondary,
            "colourSecondary": Blockly.Colours.motion.secondary,
            "colourTertiary": Blockly.Colours.motion.tertiary,
            "category": Blockly.Categories.motor,
            "extensions": ["colours_motion", "shape_statement"],
        });
    }
};

Blockly.Blocks['relative_position'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "relative_position",
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
                    "type": "field_input",
                    "name": "position",
                    "text": "0"
                }
            ],
            "category": Blockly.Categories.motor,
            "extensions": ["colours_motion", "shape_statement"],
        });
    }
};

Blockly.Blocks['specified_manner'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "specified_manner",
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

Blockly.Blocks['rate_motor'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "rate_motor",
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

Blockly.Blocks['angle_motor'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "angle_motor",
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