// 摄像头 mode 标题（与积木 changer_camer_mode 对应）
export const CAMERA_MODE_TITLES = {
    1: '模式',
    2: '相机',
    3: '人脸识别',
    4: '标签识别',
    5: '物体识别',
    6: '颜色识别',
    7: '道路识别',
    12: 'Apriltag模式',
    16: '手势识别',
    17: '人体识别',
    18: '物体分类',
    19: '图像分类'
};

export const CAMERA_CONFIG_LABELS = {
    id: 'ID',
    x: 'X坐标',
    y: 'Y坐标',
    w: '宽度',
    h: '高度',
    pp: '大小'
};

export const LEGACY_CAMERA_MODE_LABELS = {
    1: {state: '是否找到', x: 'X坐标', y: 'Y坐标', pixel: '像素点'},
    3: {r: '红色值', g: '绿色值', b: '蓝色值'},
    4: {state: '是否找到', sig: '显著性', cm: '垂度', theta: '角度'},
    6: {state: '是否找到', x: 'X坐标', y: 'Y坐标'},
    16: {state: '是否找到', matchine: '匹配度', angle: '角度'},
    12: {
        state: '是否找到',
        id: '标签ID',
        x: 'X坐标',
        y: 'Y坐标',
        angle: '角度',
        cm: '距离'
    }
};

export const normalizeCameraConfigField = keyName =>
    (/^id\d+$/i.test(keyName) ? 'id' : keyName);

export const getCameraModeTitle = mode =>
    CAMERA_MODE_TITLES[mode] || mode;

export const getCameraConfigFieldLabel = keyName =>
    CAMERA_CONFIG_LABELS[normalizeCameraConfigField(keyName)] || keyName;

export const getCameraLegacyLabel = (keyName, camera) => {
    if (!camera?.mode) return keyName;
    if (keyName === 'mode') return getCameraModeTitle(camera.mode);
    return LEGACY_CAMERA_MODE_LABELS[camera.mode]?.[keyName] || keyName;
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

export const getCameraSensingLabel = (keyName, camera) => {
    if (typeof keyName === 'string' && keyName.includes('.')) {
        const [target, field] = keyName.split('.');
        return `目标${target} ${getCameraConfigFieldLabel(field)}`;
    }
    return getCameraLegacyLabel(keyName, camera);
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
