const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const formatMessage = require('format-message');

const blocksObj = [
    {
        opcode: 'find_color_block',
        blockType: BlockType.COMMAND,
        text: formatMessage({
            id: 'camera.sensing_camera_find_color_block',
            default: '[PORT] Search color block R [R] G [G] B [B] Tolerance [TOLERANCE]',
            description: '[PORT] Search color block R [R] G [G] B [B] Tolerance [TOLERANCE]'
        }),
        arguments: {
            PORT: {
                type: ArgumentType.MOTOR,
            },
            R: {
                type: ArgumentType.NUMBER,
                defaultValue: 255
            },
            G: {
                type: ArgumentType.NUMBER,
                defaultValue: 255
            },
            B: {
                type: ArgumentType.NUMBER,
                defaultValue: 255
            },
            TOLERANCE: {
                type: ArgumentType.NUMBER,
                defaultValue: 10
            }
        },
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'find_color_state',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_find_color_state',
            default: "Get the current state of the color block search",
            description: "Get the current state of the color block search"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'find_color_block_x',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_find_color_block_x',
            default: "Get the x coordinate system of the current color block",
            description: "Get the x coordinate system of the current color block"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'find_color_block_y',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_find_color_block_y',
            default: "Get the y coordinate system of the current color block",
            description: "Get the y coordinate system of the current color block"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'find_color_pixel',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_find_color_pixel',
            default: "Get the pixel value of the current color block",
            description: "Get the pixel value of the current color block"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'middle_find',
        blockType: BlockType.COMMAND,
        text: formatMessage({
            id: 'camera.sensing_camera_middle_find',
            default: "[PORT] Center area color recognition radius [RADIUS] R [R] G [G] B [B]",
            description: "[PORT] Center area color recognition radius [RADIUS] R [R] G [G] B [B]"
        }),
        arguments: {
            PORT: {
                type: ArgumentType.MOTOR,

            },
            RADIUS: {
                type: ArgumentType.NUMBER,
                defaultValue: 10
            },
            R: {
                type: ArgumentType.NUMBER,
                defaultValue: 255
            },
            G: {
                type: ArgumentType.NUMBER,
                defaultValue: 255
            },
            B: {
                type: ArgumentType.NUMBER,
                defaultValue: 255
            },
        },
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'middle_find_red',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_middle_find_red',
            default: "Get the red value component of the center area",
            description: "Get the red value component of the center area"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'middle_find_green',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_middle_find_green',
            default: "Get the green value component of the center area",
            description: "Get the green value component of the center area"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'middle_find_blue',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_middle_find_blue',
            default: "Get the blue value component of the center area",
            description: "Get the blue value component of the center area"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'extern_color',
        blockType: BlockType.COMMAND,
        text: formatMessage({
            id: 'camera.sensing_camera_extern_color',
            default: "[PORT] Global color recognition",
            description: "[PORT] Global color recognition"
        }),
        arguments: {
            PORT: {
                type: ArgumentType.MOTOR,
                

            },
        },
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'extern_red',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_extern_red',
            default: "Get the red component of the global color",
            description: "Get the red component of the global color"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'extern_green',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_extern_green',
            default: "Get the red component of the global color",
            description: "Get the red component of the global color"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'extern_blue',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_extern_blue',
            default: "Get the red component of the global color",
            description: "Get the red component of the global color"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'find_line',
        blockType: BlockType.COMMAND,
        text: formatMessage({
            id: 'camera.sensing_camera_find_line',
            default: "[PORT] Line patrol",
            description: "[PORT] Line patrol"
        }),
        arguments: {
            PORT: {
                type: ArgumentType.MOTOR,
                

            },
        },
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'find_line_state',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_find_line_state',
            default: "Get the status of the line patrol",
            description: "Get the status of the line patrol"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'find_line_showsex',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_find_line_showsex',
            default: "Get the significance of the line patrol",
            description: "Get the significance of the line patrol"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'find_line_rho',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_find_line_rho',
            default: "Get the vertical distance of the patrol line",
            description: "Get the vertical distance of the patrol line"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'find_line_theta',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_find_line_theta',
            default: "Get the angle of the patrol line",
            description: "Get the angle of the patrol line"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'number_check',
        blockType: BlockType.COMMAND,
        text: formatMessage({
            id: 'camera.sensing_camera_number_check',
            default: "[PORT] Identify data",
            description: "[PORT] Identify data"
        }),
        arguments: {
            PORT: {
                type: ArgumentType.MOTOR,

            },
        },
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'number_state',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_number_state',
            default: "Get the state of finding numbers",
            description: "Get the state of finding numbers"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'get_number',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_get_number',
            default: "Get the recognized digital content",
            description: "Get the recognized digital content"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'face_check',
        blockType: BlockType.COMMAND,
        text: formatMessage({
            id: 'camera.sensing_camera_face_check',
            default: "[PORT] Face detection",
            description: "[PORT] Face detection"
        }),
        arguments: {
            PORT: {
                type: ArgumentType.MOTOR,

            },
        },
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'face_state',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_face_state',
            default: "Get the state of finding faces",
            description: "Get the state of finding faces"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'face_x',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_face_x',
            default: "Get the X coordinate value of faces",
            description: "Get the X coordinate value of faces"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'face_y',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_face_y',
            default: "Get the Y coordinate value of faces",
            description: "Get the Y coordinate value of faces"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'face_trace',
        blockType: BlockType.COMMAND,
        text: formatMessage({
            id: 'camera.sensing_camera_face_trace',
            default: "[PORT] Face tracking",
            description: "[PORT] Face tracking"
        }),
        arguments: {
            PORT: {
                type: ArgumentType.MOTOR,

            },
        },
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'face_trace_state',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_face_trace_state',
            default: "Get face tracking status",
            description: "Get face tracking status"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'face_trace_x',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_face_trace_x',
            default: "Get face tracking X coordinate value",
            description: "Get face tracking X coordinate value"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'face_trace_y',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_face_trace_y',
            default: "Get face tracking Y coordinate value",
            description: "Get face tracking Y coordinate value"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'qr_check',
        blockType: BlockType.COMMAND,
        text: formatMessage({
            id: 'camera.sensing_camera_qr_check',
            default: "[PORT] QR code recognition",
            description: "[PORT] QR code recognition"
        }),
        arguments: {
            PORT: {
                type: ArgumentType.MOTOR,

            },
        },
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'qr_state',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_qr_state',
            default: "Get QR code recognition status",
            description: "Get QR code recognition status"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'apriltag',
        blockType: BlockType.COMMAND,
        text: formatMessage({
            id: 'camera.sensing_camera_apriltag',
            default: "[PORT] Tag tracking",
            description: "[PORT] Tag tracking"
        }),
        arguments: {
            PORT: {
                type: ArgumentType.MOTOR,

            },
        },
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'apriltag_state',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_apriltag_state',
            default: "Get AprilTag tag recognition status",
            description: "Get AprilTag tag recognition status"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'apriltag_id',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_apriltag_id',
            default: "Get the ID value of the AprilTag tag",
            description: "Get the ID value of the AprilTag tag"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'apriltag_x',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_apriltag_x',
            default: "Get the X coordinate value of the AprilTag tag",
            description: "Get the X coordinate value of the AprilTag tag"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'apriltag_y',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_apriltag_y',
            default: "Get the Y coordinate value of the AprilTag tag",
            description: "Get the Y coordinate value of the AprilTag tag"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'apriltag_roll',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_apriltag_roll',
            default: "Get the angle value of the AprilTag tag",
            description: "Get the angle value of the AprilTag tag"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'apriltag_distance',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_apriltag_distance',
            default: "Get the distance value of the AprilTag tag",
            description: "Get the distance value of the AprilTag tag"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'characteristic',
        blockType: BlockType.COMMAND,
        text: formatMessage({
            id: 'camera.sensing_camera_characteristic',
            default: "[PORT] Feature point detection",
            description: "[PORT] Feature point detection"
        }),
        arguments: {
            PORT: {
                type: ArgumentType.MOTOR,

            },
        },
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'characteristic_state',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_characteristic_state',
            default: "Get the state value of feature detection",
            description: "Get the state value of feature detection"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'characteristic_matchine',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_characteristic_matchine',
            default: "Get the matching degree of feature detection",
            description: "Get the matching degree of feature detection"
        }),
        filter: [TargetType.SPRITE]
    },
    {
        opcode: 'characteristic_roll',
        blockType: BlockType.REPORTER,
        text: formatMessage({
            id: 'camera.sensing_camera_characteristic_roll',
            default: "Get the rotation angle of feature detection",
            description: "Get the rotation angle of feature detection"
        }),
        filter: [TargetType.SPRITE]
    },
]

module.exports = blocksObj