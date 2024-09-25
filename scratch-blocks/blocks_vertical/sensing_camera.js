'use strict';

goog.provide('Blockly.Blocks.sensing_camera');

goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.constants');
goog.require('Blockly.ScratchBlocks.VerticalExtensions');


Blockly.Blocks['sensing_camera_menu'] = {
    init: function () {
      this.jsonInit({
        "message0": "%1",
        "args0": [
          {
            "type": "field_motor",
            "name": "SENSING_CAMERA_MENU",
            "motorList": ["A", "B", "C", "D", "E", "F", "G", "H"]
          }
        ],
        "category": Blockly.Categories.sensing_camera,
        "colour": Blockly.Colours.sensing_camera.primary,
        "colourSecondary": Blockly.Colours.sensing_camera.secondary,
        "colourTertiary": Blockly.Colours.sensing_camera.tertiary,
        "extensions": ["output_string"],
      });
    }
};
  
Blockly.Blocks['sensing_camera_find_color_block'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_find_color_block",
        "message0": Blockly.Msg.SENSING_CAMERA_FIND_COLOR_BLOCK,
        "args0": [
          {
            "type": "input_value",
            "name": "PORT"
          },
          {
            "type": "input_value",
            "name": "R"
          },
          {
            "type": "input_value",
            "name": "G"
          },
          {
            "type": "input_value",
            "name": "B"
          },
          {
            "type": "input_value",
            "name": "TOLERANCE"
          },
        ],
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "shape_statement"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_find_color_state'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_find_color_state",
        "message0": Blockly.Msg.SENSING_CAMERA_FIND_COLOR_STATE,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_boolean"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_find_color_block_x'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_find_color_block_x",
        "message0": Blockly.Msg.SENSING_CAMERA_FIND_COLOR_BLOCK_X,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_find_color_block_y'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_find_color_block_y",
        "message0": Blockly.Msg.SENSING_CAMERA_FIND_COLOR_BLOCK_Y,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_find_color_pixel'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_find_color_pixel",
        "message0": Blockly.Msg.SENSING_CAMERA_FIND_COLOR_PIXEL,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_middle_find'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_middle_find",
        "message0": Blockly.Msg.SENSING_CAMERA_MIDDLE_FIND,
        "args0": [
          {
            "type": "input_value",
            "name": "PORT"
          },
          {
            "type": "input_value",
            "name": "RADIUS"
          },
          {
            "type": "input_value",
            "name": "R"
          },
          {
            "type": "input_value",
            "name": "G"
          },
          {
            "type": "input_value",
            "name": "B"
          },
        ],
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "shape_statement"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_middle_find_red'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_middle_find_red",
        "message0": Blockly.Msg.SENSING_CAMERA_MIDDLE_FIND_RED,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_middle_find_green'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_middle_find_green",
        "message0": Blockly.Msg.SENSING_CAMERA_MIDDLE_FIND_GREEN,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_middle_find_blue'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_middle_find_blue",
        "message0": Blockly.Msg.SENSING_CAMERA_MIDDLE_FIND_BLUE,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_extern_color'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_extern_color",
        "message0": Blockly.Msg.SENSING_CAMERA_EXTERN_COLOR,
        "args0": [
          {
            "type": "input_value",
            "name": "PORT"
          },
        ],
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "shape_statement"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_extern_red'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_extern_red",
        "message0": Blockly.Msg.SENSING_CAMERA_EXTERN_RED,
        "args0": [
          {
            "type": "input_value",
            "name": "PORT"
          },
        ],
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_extern_green'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_extern_green",
        "message0": Blockly.Msg.SENSING_CAMERA_EXTERN_GREEN,
        "args0": [
          {
            "type": "input_value",
            "name": "PORT"
          },
        ],
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_extern_blue'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_extern_blue",
        "message0": Blockly.Msg.SENSING_CAMERA_EXTERN_BLUE,
        "args0": [
          {
            "type": "input_value",
            "name": "PORT"
          },
        ],
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  }; 
  
  Blockly.Blocks['sensing_camera_find_line'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_find_line",
        "message0": Blockly.Msg.SENSING_CAMERA_FIND_LINE,
        "args0": [
          {
            "type": "input_value",
            "name": "PORT"
          },
        ],
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "shape_statement"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camer_find_line_state'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camer_find_line_state",
        "message0": Blockly.Msg.SENSING_CAMER_FIND_LINE_STATE,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_boolean"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camer_find_line_showsex'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camer_find_line_showsex",
        "message0": Blockly.Msg.SENSING_CAMER_FIND_LINE_SHOWSEX,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camer_find_line_rho'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camer_find_line_rho",
        "message0": Blockly.Msg.SENSING_CAMER_FIND_LINE_RHO,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camer_find_line_theta'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camer_find_line_theta",
        "message0": Blockly.Msg.SENSING_CAMER_FIND_LINE_THETA,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_number_check'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_number_check",
        "message0": Blockly.Msg.SENSING_CAMERA_NUMBER_CHECK,
        "args0": [
          {
            "type": "input_value",
            "name": "PORT"
          },
        ],
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "shape_statement"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camer_number_state'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camer_number_state",
        "message0": Blockly.Msg.SENSING_CAMER_NUMBER_STATE,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_boolean"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_get_number'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_get_number",
        "message0": Blockly.Msg.SENSING_CAMERA_GET_NUMBER,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_face_check'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_face_check",
        "message0": Blockly.Msg.SENSING_CAMERA_FACE_CHECK,
        "args0": [
          {
            "type": "input_value",
            "name": "PORT"
          },
        ],
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "shape_statement"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_face_state'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_face_state",
        "message0": Blockly.Msg.SENSING_CAMERA_FACE_STATE,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_boolean"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_face_x'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_face_x",
        "message0": Blockly.Msg.SENSING_CAMERA_FACE_X,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_face_y'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_face_y",
        "message0": Blockly.Msg.SENSING_CAMERA_FACE_Y,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_face_trace'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_face_trace",
        "message0": Blockly.Msg.SENSING_CAMERA_FACE_TRACE,
        "args0": [
          {
            "type": "input_value",
            "name": "PORT"
          },
        ],
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "shape_statement"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_face_trace_state'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_face_trace_state",
        "message0": Blockly.Msg.SENSING_CAMERA_FACE_TRACE_STATE,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_boolean"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_face_trace_x'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_face_trace_x",
        "message0": Blockly.Msg.SENSING_CAMERA_FACE_TRACE_X,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_face_trace_y'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_face_trace_y",
        "message0": Blockly.Msg.SENSING_CAMERA_FACE_TRACE_Y,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_qr_check'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_qr_check",
        "message0": Blockly.Msg.SENSING_CAMERA_QR_CHECK,
        "args0": [
          {
            "type": "input_value",
            "name": "PORT"
          },
        ],
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "shape_statement"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_qr_state'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_qr_state",
        "message0": Blockly.Msg.SENSING_CAMERA_QR_STATE,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_boolean"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_apriltag'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_apriltag",
        "message0": Blockly.Msg.SENSING_CAMERA_APRILTAG,
        "args0": [
          {
            "type": "input_value",
            "name": "PORT"
          },
        ],
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "shape_statement"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_apriltag_state'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_apriltag_state",
        "message0": Blockly.Msg.SENSING_CAMERA_APRILTAG_STATE,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_boolean"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_apriltag_id'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_apriltag_id",
        "message0": Blockly.Msg.SENSING_CAMERA_APRILTAG_ID,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_apriltag_x'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_apriltag_x",
        "message0": Blockly.Msg.SENSING_CAMERA_APRILTAG_X,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_apriltag_y'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_apriltag_y",
        "message0": Blockly.Msg.SENSING_CAMERA_APRILTAG_Y,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_apriltag_roll'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_apriltag_roll",
        "message0": Blockly.Msg.SENSING_CAMERA_APRILTAG_ROLL,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_apriltag_distance'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_apriltag_distance",
        "message0": Blockly.Msg.SENSING_CAMERA_APRILTAG_DISTANCE,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  
  Blockly.Blocks['sensing_camera_characteristic'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_characteristic",
        "message0": Blockly.Msg.SENSING_CAMERA_CHARACTERISTIC,
        "args0": [
          {
            "type": "input_value",
            "name": "PORT"
          },
        ],
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "shape_statement"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_characteristic_state'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_characteristic_state",
        "message0": Blockly.Msg.SENSING_CAMERA_CHARACTERISTIC_STATE,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_boolean"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_characteristic_matchine'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_characteristic_matchine",
        "message0": Blockly.Msg.SENSING_CAMERA_CHARACTERISTIC_MATCHINE,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };
  
  Blockly.Blocks['sensing_camera_characteristic_roll'] = {
    init: function () {
      this.jsonInit({
        "type": "sensing_camera_characteristic_roll",
        "message0": Blockly.Msg.SENSING_CAMERA_CHARACTERISTIC_ROLL,
        "category": Blockly.Categories.sensing_camera,
        "extensions": ["colours_sensing_camera", "output_number"]
      });
    }
  };