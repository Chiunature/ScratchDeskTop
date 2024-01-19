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
                    "matrix": "111111111111111111111111111111111111111111111111111111111111111"
                },
                {
                    "type": "input_value",
                    "name": "COLOR"
                },
            ],
            "category": Blockly.Categories.matrix,
            "colour": "#9966FF",
            "secondaryColour": "#774DCB",
            "extensions": ["colours_pen", "colours_matrix", "shape_statement"],
        });
    }
};

Blockly.Blocks['matrix_lamp_stop'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
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
            "extensions": ["colours_matrix", "shape_statement"],
        });
    }
};

Blockly.Blocks['matrix_lamp_set'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
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
            "extensions": ["colours_matrix", "shape_statement"],
        });
    }
};

Blockly.Blocks['matrix_lamp_setSaturation'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.SET_MATRIX_SATURATION,
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
                    "name": "saturation"
                },
            ],
            "category": Blockly.Categories.matrix,
            "colour": "#9966FF",
            "secondaryColour": "#774DCB",
            "extensions": ["colours_matrix", "shape_statement"],
        });
    }
};

Blockly.Blocks['matrix_lamp_single'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
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
            "extensions": ["colours_matrix", "shape_statement"],
        });
    }
};

Blockly.Blocks['matrix_lamp_text'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
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
                    "type": "input_value",
                    "name": "matrix_text"
                }
            ],
            "category": Blockly.Categories.matrix,
            "colour": "#9966FF",
            "secondaryColour": "#774DCB",
            "extensions": ["colours_matrix", "shape_statement"],
        });
    }
};

Blockly.Blocks['matrix_lamp_setRGB'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
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
            "extensions": ["colours_matrix", "shape_statement"],
        });
    }
};

Blockly.Blocks['matrix_lamp_useRGB'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
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
            "extensions": ["colours_matrix", "shape_statement"],
        });
    }
};

Blockly.Blocks['matrix_color'] = {
    /**
     * Block to move steps.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.MATRIX_COLOR,
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
                    "name": "COLOR"
                },
            ],
            "category": Blockly.Categories.matrix,
            "colour": "#9966FF",
            "secondaryColour": "#774DCB",
            "extensions": ["colours_pen", "colours_matrix", "shape_statement"],
        });
    }
};