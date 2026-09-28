import {defineMessages} from 'react-intl';

// 摄像头面板文案的唯一来源。
// id 必须与 scratch-l10n/editor/interface/{zh-cn,en,pt}.json 中的 key 一致；
// defaultMessage 与 en.json 保持一致，作为未翻译语言的回退。
const cameraMessages = defineMessages({
    mode: {id: 'gui.device.cameraMode', defaultMessage: 'Mode'},
    dataTitle: {id: 'gui.device.cameraDataTitle', defaultMessage: 'Camera Data'},
    dataButton: {id: 'gui.device.cameraDataButton', defaultMessage: 'View Camera Data'},
    detailButton: {id: 'gui.device.cameraDetailButton', defaultMessage: 'Details'},
    close: {id: 'gui.device.cameraClose', defaultMessage: 'Close'},
    target: {id: 'gui.device.cameraTarget', defaultMessage: 'Target {number}'},
    targetField: {id: 'gui.device.cameraTargetField', defaultMessage: 'Target {number} {field}'},

    // 识别模式标题（mode 编号见 camera-data.js）
    modeGeneric: {id: 'gui.device.cameraModeGeneric', defaultMessage: 'Mode'},
    modeCamera: {id: 'gui.device.cameraModeCamera', defaultMessage: 'Camera'},
    modeFace: {id: 'gui.device.cameraModeFaceRecognition', defaultMessage: 'Face Recognition'},
    modeTag: {id: 'gui.device.cameraModeTagRecognition', defaultMessage: 'Tag Recognition'},
    modeObject: {id: 'gui.device.cameraModeObjectRecognition', defaultMessage: 'Object Recognition'},
    modeColor: {id: 'gui.device.cameraModeColorRecognition', defaultMessage: 'Color Recognition'},
    modeRoad: {id: 'gui.device.cameraModeRoadRecognition', defaultMessage: 'Road Recognition'},
    modeAprilTag: {id: 'gui.device.cameraModeAprilTag', defaultMessage: 'AprilTag Mode'},
    modeGesture: {id: 'gui.device.cameraModeGestureRecognition', defaultMessage: 'Gesture Recognition'},
    modeBody: {id: 'gui.device.cameraModeBodyRecognition', defaultMessage: 'Body Recognition'},
    modeObjectClass: {id: 'gui.device.cameraModeObjectClassification', defaultMessage: 'Object Classification'},
    modeImageClass: {id: 'gui.device.cameraModeImageClassification', defaultMessage: 'Image Classification'},

    // 新协议 configs[] 中的字段
    fieldId: {id: 'gui.device.cameraFieldId', defaultMessage: 'ID'},
    fieldX: {id: 'gui.device.cameraFieldX', defaultMessage: 'X Coordinate'},
    fieldY: {id: 'gui.device.cameraFieldY', defaultMessage: 'Y Coordinate'},
    fieldW: {id: 'gui.device.cameraFieldW', defaultMessage: 'Width'},
    fieldH: {id: 'gui.device.cameraFieldH', defaultMessage: 'Height'},
    fieldPp: {id: 'gui.device.cameraFieldPp', defaultMessage: 'Size'},
    fieldConf: {id: 'gui.device.cameraFieldConf', defaultMessage: 'Confidence'},
    fieldLearned: {id: 'gui.device.cameraFieldLearned', defaultMessage: 'Learned'},
    fieldName: {id: 'gui.device.cameraFieldName', defaultMessage: 'Name'},

    // 旧协议扁平字段（同名字段在不同 mode 下含义不同，如 cm）
    legacyState: {id: 'gui.device.cameraLegacyState', defaultMessage: 'Found'},
    legacyPixel: {id: 'gui.device.cameraLegacyPixel', defaultMessage: 'Pixels'},
    legacyR: {id: 'gui.device.cameraLegacyR', defaultMessage: 'Red Value'},
    legacyG: {id: 'gui.device.cameraLegacyG', defaultMessage: 'Green Value'},
    legacyB: {id: 'gui.device.cameraLegacyB', defaultMessage: 'Blue Value'},
    legacySig: {id: 'gui.device.cameraLegacySig', defaultMessage: 'Significance'},
    legacyCm: {id: 'gui.device.cameraLegacyCm', defaultMessage: 'Droop'},
    legacyTheta: {id: 'gui.device.cameraLegacyTheta', defaultMessage: 'Angle'},
    legacyMatchine: {id: 'gui.device.cameraLegacyMatchine', defaultMessage: 'Match Rate'},
    legacyAngle: {id: 'gui.device.cameraLegacyAngle', defaultMessage: 'Angle'},
    legacyTagId: {id: 'gui.device.cameraLegacyTagId', defaultMessage: 'Tag ID'},
    legacyDistance: {id: 'gui.device.cameraLegacyDistance', defaultMessage: 'Distance'}
});

export default cameraMessages;
