'use strict';

goog.provide('Blockly.Blocks.combined_motor');

goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.constants');
goog.require('Blockly.ScratchBlocks.VerticalExtensions');

Blockly.Blocks['starting_combined_motor'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "starting_combined_motor",
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

Blockly.Blocks['direction_combined_motor'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "direction_combined_motor",
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

Blockly.Blocks['speed_combined_motor'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "speed_combined_motor",
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
            "category": Blockly.Categories.combined_motor,
            "extensions": ["colours_sounds", "shape_statement"],
        });
    }
};

Blockly.Blocks['turn_combined_motor'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "turn_combined_motor",
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

Blockly.Blocks['line_combined_motor'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "line_combined_motor",
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

Blockly.Blocks['stop_combined_motor'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "stop_combined_motor",
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

Blockly.Blocks['move_combined_motor'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "move_combined_motor",
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
                    "type": "field_slider",
                    "name": "left",
                    "value": "0",
                    "precision": 1,
                    "min": "0",
                    "max": "100"
                },
                {
                    "type": "field_slider",
                    "name": "right",
                    "value": "0",
                    "precision": 1,
                    "min": "0",
                    "max": "100"
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

Blockly.Blocks['movestep_combined_motor'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "movestep_combined_motor",
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
                    "type": "field_slider",
                    "name": "left",
                    "value": "0",
                    "precision": 1,
                    "min": "0",
                    "max": "100"
                },
                {
                    "type": "field_slider",
                    "name": "right",
                    "value": "0",
                    "precision": 1,
                    "min": "0",
                    "max": "100"
                }
            ],
            "category": Blockly.Categories.combined_motor,
            "extensions": ["colours_sounds", "shape_statement"],
        });
    }
};

Blockly.Blocks['movepower_combined_motor'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "movepower_combined_motor",
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
                    "type": "field_slider",
                    "name": "power",
                    "value": "0",
                    "precision": 1,
                    "min": "0",
                    "max": "100"
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

Blockly.Blocks['stopping_combined_motor'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "stopping_combined_motor",
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