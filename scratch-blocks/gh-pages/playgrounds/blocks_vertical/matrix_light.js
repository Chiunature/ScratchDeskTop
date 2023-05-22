'use strict';

goog.provide('Blockly.Blocks.matrix');

goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.constants');
goog.require('Blockly.ScratchBlocks.VerticalExtensions');

Blockly.Blocks['matrix_lamp'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "matrix_lamp",
            "message0": Blockly.Msg.MATRIX_LAMP,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "matrix.svg",
                    "width": 24,
                    "height": 24,
                    "alt": "*",
                    "flipRtl": false
                },
                {
                    "type": "field_matrix",
                    "name": "lamp",
                    "matrix": "1111111111111111111111111111111111111111111111111111111111111111"
                },
                {
                    "type": "input_value",
                    "name": "COLOR"
                },
            ],
            "category": Blockly.Categories.matrix,
            "colour": "#9966FF",
            "secondaryColour": "#774DCB",
            "extensions": ["colours_pen", "colours_looks", "shape_statement"],
        });
    }
};

Blockly.Blocks['stop_matrix_lamp'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "stop_matrix_lamp",
            "message0": Blockly.Msg.STOP_MATRIX_LAMP,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "matrix.svg",
                    "width": 24,
                    "height": 24,
                    "alt": "*",
                    "flipRtl": false
                },
            ],
            "category": Blockly.Categories.matrix,
            "colour": "#9966FF",
            "secondaryColour": "#774DCB",
            "extensions": ["colours_looks", "shape_statement"],
        });
    }
};

Blockly.Blocks['set_matrix_lamp'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "set_matrix_lamp",
            "message0": Blockly.Msg.SET_MATRIX_LAMP,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "matrix.svg",
                    "width": 24,
                    "height": 24,
                    "alt": "*",
                    "flipRtl": false
                },
                {
                    "type": "input_value",
                    "name": "brightness"
                },
            ],
            "category": Blockly.Categories.matrix,
            "colour": "#9966FF",
            "secondaryColour": "#774DCB",
            "extensions": ["colours_looks", "shape_statement"],
        });
    }
};

Blockly.Blocks['single_matrix_lamp'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "single_matrix_lamp",
            "message0": Blockly.Msg.SINGLE_MATRIX_LAMP,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "matrix.svg",
                    "width": 24,
                    "height": 24,
                    "alt": "*",
                    "flipRtl": false
                },
                {
                    "type": "field_number",
                    "name": "x",
                    "value": 0,
                    "min": 0,
                    "max": 5
                },
                {
                    "type": "field_number",
                    "name": "y",
                    "value": 0,
                    "min": 0,
                    "max": 5
                },
                {
                    "type": "input_value",
                    "name": "brightness",
                }
            ],
            "category": Blockly.Categories.matrix,
            "colour": "#9966FF",
            "secondaryColour": "#774DCB",
            "extensions": ["colours_looks", "shape_statement"],
        });
    }
};

Blockly.Blocks['text_matrix_lamp'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "text_matrix_lamp",
            "message0": Blockly.Msg.TEXT_MATRIX_LAMP,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "matrix.svg",
                    "width": 24,
                    "height": 24,
                    "alt": "*",
                    "flipRtl": false
                },
                {
                    "type": "field_input",
                    "name": "text",
                    "text": ""
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
                                "alt": Blockly.Msg.PLEFT
                            },
                            "left"
                        ],
                        [
                            {
                                "src": Blockly.mainWorkspace.options.pathToMedia + "rotate-right.svg",
                                "width": 20,
                                "height": 20,
                                "alt": Blockly.Msg.PRIGHT
                            },
                            "right"
                        ],
                        [
                            {
                                "src": Blockly.mainWorkspace.options.pathToMedia + "advance.svg",
                                "width": 20,
                                "height": 20,
                                "alt": Blockly.Msg.UP
                            },
                            "up"
                        ],
                        [
                            {
                                "src": Blockly.mainWorkspace.options.pathToMedia + "back.svg",
                                "width": 20,
                                "height": 20,
                                "alt": Blockly.Msg.DOWN
                            },
                            "down"
                        ],
                    ]
                },
            ],
            "category": Blockly.Categories.matrix,
            "colour": "#9966FF",
            "secondaryColour": "#774DCB",
            "extensions": ["colours_looks", "shape_statement"],
        });
    }
};

Blockly.Blocks['setRGB_matrix_lamp'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "setRGB_matrix_lamp",
            "message0": Blockly.Msg.SETRGB_MATRIX_LAMP,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "matrix.svg",
                    "width": 24,
                    "height": 24,
                    "alt": "*",
                    "flipRtl": false
                },
                {
                    "type": "field_number",
                    "name": "order",
                    "value": 0,
                },
                {
                    "type": "input_value",
                    "name": "COLOR"
                },
            ],
            "category": Blockly.Categories.matrix,
            "colour": "#9966FF",
            "secondaryColour": "#774DCB",
            "extensions": ["colours_looks", "shape_statement"],
        });
    }
};

Blockly.Blocks['useRGB_matrix_lamp'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "useRGB_matrix_lamp",
            "message0": Blockly.Msg.USERGB_MATRIX_LAMP,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "matrix.svg",
                    "width": 24,
                    "height": 24,
                    "alt": "*",
                    "flipRtl": false
                },
                {
                    "type": "field_dropdown",
                    "name": "SWITCH",
                    "options": [
                        [
                            Blockly.Msg.OPEN,
                            "open"
                        ],
                        [
                            Blockly.Msg.CLOSE,
                            "close"
                        ],
                    ]
                },
            ],
            "category": Blockly.Categories.matrix,
            "colour": "#9966FF",
            "secondaryColour": "#774DCB",
            "extensions": ["colours_looks", "shape_statement"],
        });
    }
};