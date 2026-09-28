import msg from './camera-messages.js';

// mode 编号（与积木 changer_camer_mode 对应）→ 标题
const MODE_TITLES = {
    1: msg.modeGeneric,
    2: msg.modeCamera,
    3: msg.modeFace,
    4: msg.modeTag,
    5: msg.modeObject,
    6: msg.modeColor,
    7: msg.modeRoad,
    12: msg.modeAprilTag,
    16: msg.modeGesture,
    17: msg.modeBody,
    18: msg.modeObjectClass,
    19: msg.modeImageClass
};

// 新协议：configs[] 中每个目标的字段 → 标签
const CONFIG_FIELD_LABELS = {
    id: msg.fieldId,
    x: msg.fieldX,
    y: msg.fieldY,
    w: msg.fieldW,
    h: msg.fieldH,
    pp: msg.fieldPp,
    conf: msg.fieldConf,
    learned: msg.fieldLearned,
    name: msg.fieldName
};

// 旧协议：mode → 扁平字段 → 标签（同名字段在不同 mode 下含义不同，如 cm）
const LEGACY_FIELD_LABELS = {
    1: {state: msg.legacyState, x: msg.fieldX, y: msg.fieldY, pixel: msg.legacyPixel},
    3: {r: msg.legacyR, g: msg.legacyG, b: msg.legacyB},
    4: {state: msg.legacyState, sig: msg.legacySig, cm: msg.legacyCm, theta: msg.legacyTheta},
    6: {state: msg.legacyState, x: msg.fieldX, y: msg.fieldY},
    12: {
        state: msg.legacyState,
        id: msg.legacyTagId,
        x: msg.fieldX,
        y: msg.fieldY,
        angle: msg.legacyAngle,
        cm: msg.legacyDistance
    },
    16: {state: msg.legacyState, matchine: msg.legacyMatchine, angle: msg.legacyAngle}
};

export const normalizeCameraConfigField = keyName =>
    (/^id\d+$/i.test(keyName) ? 'id' : keyName);

// 未登记的 mode / 字段原样显示，固件新增字段时不会空白或报错
const formatOr = (intl, descriptor, fallback) =>
    (descriptor ? intl.formatMessage(descriptor) : fallback);

export const getCameraModeTitle = (mode, intl) =>
    formatOr(intl, MODE_TITLES[mode], mode);

export const getCameraConfigFieldLabel = (keyName, intl) =>
    formatOr(intl, CONFIG_FIELD_LABELS[normalizeCameraConfigField(keyName)], keyName);

export const getCameraLegacyLabel = (keyName, camera, intl) => {
    if (!camera?.mode) return keyName;
    if (keyName === 'mode') return getCameraModeTitle(camera.mode, intl);
    return formatOr(intl, LEGACY_FIELD_LABELS[camera.mode]?.[keyName], keyName);
};

export const flattenCameraForSensing = camera => {
    if (!camera || typeof camera !== 'object') return null;
    if (Array.isArray(camera.configs)) {
        const flat = {};
        camera.configs.forEach((cfg, index) => {
            if (!cfg || typeof cfg !== 'object') return;
            const target = index + 1;
            Object.keys(cfg).forEach(key => {
                flat[`${target}.${normalizeCameraConfigField(key)}`] = cfg[key];
            });
        });
        return Object.keys(flat).length > 0 ? flat : null;
    }

    const rest = {...camera};
    delete rest.mode;
    return Object.keys(rest).length > 0 ? rest : null;
};

// 传感器下拉菜单的 key：新协议为 "目标序号.字段"（见 flattenCameraForSensing），旧协议为原字段名
export const getCameraSensingLabel = (keyName, camera, intl) => {
    if (typeof keyName === 'string' && keyName.includes('.')) {
        const [number, field] = keyName.split('.');
        return intl.formatMessage(msg.targetField, {
            number,
            field: getCameraConfigFieldLabel(field, intl)
        });
    }
    return getCameraLegacyLabel(keyName, camera, intl);
};

export const getSavedCameraSensingUnit = ({sensingData, deviceIndex, deviceId}) => {
    const keys = sensingData ? Object.keys(sensingData) : [];
    if (keys.length === 0) return null;

    if (typeof window === 'undefined' || !window.myAPI?.getStoreValue) {
        return keys[0];
    }

    try {
        const raw = window.myAPI.getStoreValue('sensing-unit-list');
        if (!raw) return keys[0];
        const list = JSON.parse(raw);
        const entry = list?.[deviceIndex];
        return entry?.deviceId === deviceId && entry.unit in sensingData ?
            entry.unit :
            keys[0];
    } catch {
        return keys[0];
    }
};
