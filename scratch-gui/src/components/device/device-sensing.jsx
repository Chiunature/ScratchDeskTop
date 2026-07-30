import React, { useCallback } from "react";
import styles from "./device.css";
import colorSensingIcon from "scratch-blocks/media/color_sensing.svg";
import motorSensingIcon from "scratch-blocks/media/motor_sensing.svg";
import smallMotorSensingIcon from "scratch-blocks/media/small_motor_sensing.svg";
import superSoundIcon from "scratch-blocks/media/super_sound.svg";
import touchPressIcon from "scratch-blocks/media/touch_press.svg";
import cameraSensingIcon from "scratch-blocks/media/camera.svg";
import nfcSensingIcon from "scratch-blocks/media/nfc.svg";
import messages from "./deviceMsg";
import DeviceSensingItem from "./device-sensing-item.jsx";
import grayv2SensingIcon from "scratch-blocks/media/grayv2.svg";

// ─── Port index (0–7) → label (A–H) ─────────────────────────────────────────
const PORT_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const getPort = (index) =>
    PORT_LABELS[index] !== undefined ? PORT_LABELS[index] : String(index);

// ─── sensing_device 类型名 → 传感器图标 ──────────────────────────────────────
// sensing_device 由 est-link/common.js 的 distinguishDevice 写入，值为可读字符串
const DEVICE_ICONS = {
    motor: motorSensingIcon,
    big_motor: motorSensingIcon,
    small_motor: smallMotorSensingIcon,
    color: colorSensingIcon,
    gray: colorSensingIcon,
    gray_v2: grayv2SensingIcon,
    superSound: superSoundIcon,
    touch: touchPressIcon,
    camer: cameraSensingIcon,
    nfc: nfcSensingIcon,
};

const getSensing = (sensingDevice) => DEVICE_ICONS[sensingDevice] || null;

// ─── sensing_device 类型名 → item 上对应的数据字段名 ─────────────────────────
// big_motor / small_motor 已在 est-link 中统一挂到 item.motor
const DEVICE_DATA_FIELDS = {
    motor: "motor",
    big_motor: "motor",
    small_motor: "motor",
    color: "color",
    superSound: "ultrasion",
    touch: "touch",
    gray: "gray",
    gray_v2: "gray",
    camer: "camer",
    nfc: "nfc",
};

/** 将 camera.configs 扁平化为下拉可选字段：如 "1.id" / "2.x" */
const flattenCameraForSensing = (camera) => {
    if (!camera || typeof camera !== "object") return null;
    if (Array.isArray(camera.configs)) {
        const flat = {};
        camera.configs.forEach((cfg, index) => {
            if (!cfg || typeof cfg !== "object") return;
            const target = index + 1;
            Object.keys(cfg).forEach((key) => {
                const field = /^id\d+$/i.test(key) ? "id" : key;
                flat[`${target}.${field}`] = cfg[key];
            });
        });
        return Object.keys(flat).length > 0 ? flat : null;
    }
    // 旧格式：去掉 mode，其余字段直接展示
    const { mode, ...rest } = camera;
    return Object.keys(rest).length > 0 ? rest : null;
};

const getType = (item) => {
    if (item.sensing_device === "camer") {
        return flattenCameraForSensing(item.camer || item.camera);
    }
    const field = DEVICE_DATA_FIELDS[item.sensing_device];
    return field ? item[field] || null : null;
};

// ─── 摄像头字段标签（与 deviceBoxCamera / cam_data 积木一致）────────────────
const CAMERA_MODE_TITLES = {
    1: "模式",
    2: "相机",
    3: "人脸识别",
    4: "标签识别",
    5: "物体识别",
    6: "颜色识别",
    7: "道路识别",
    12: "Apriltag模式",
    16: "手势识别",
    17: "人体识别",
    18: "物体分类",
    19: "图像分类",
};

const CAMERA_CONFIG_LABELS = {
    id: "ID",
    x: "X坐标",
    y: "Y坐标",
    w: "宽度",
    h: "高度",
    pp: "大小",
};

const LEGACY_CAMERA_MODE_LABELS = {
    1: { state: "是否找到", x: "X坐标", y: "Y坐标", pixel: "像素点" },
    3: { r: "红色值", g: "绿色值", b: "蓝色值" },
    4: { state: "是否找到", sig: "显著性", cm: "垂度", theta: "角度" },
    6: { state: "是否找到", x: "X坐标", y: "Y坐标" },
    16: { state: "是否找到", matchine: "匹配度", angle: "角度" },
    12: {
        state: "是否找到",
        id: "标签ID",
        x: "X坐标",
        y: "Y坐标",
        angle: "角度",
        cm: "距离",
    },
};

const getCameraLabel = (keyName, camera) => {
    // 新格式扁平键：如 "1.id" → "目标1 ID"
    if (typeof keyName === "string" && keyName.includes(".")) {
        const [target, field] = keyName.split(".");
        const fieldLabel = CAMERA_CONFIG_LABELS[field] || field;
        return `目标${target} ${fieldLabel}`;
    }
    if (!camera?.mode) return keyName;
    if (keyName === "mode") return CAMERA_MODE_TITLES[camera.mode] || keyName;
    return LEGACY_CAMERA_MODE_LABELS[camera.mode]?.[keyName] || keyName;
};

// ─── NFC 字段标签 ─────────────────────────────────────────────────────────────
const NFC_LABELS = { id: "标签ID", version: "版本" };
const getNfcLabel = (keyName) => NFC_LABELS[keyName] || keyName;

// ─── 各传感器字段名 → 消息 key 的映射表（模块级，方便一眼看清所有映射）────────
// 不在表里的字段：电机/颜色返回 null（隐藏），灰度直接显示原始 key 名
const MOTOR_MSG_KEYS = {
    circly: "circly",
    speed: "actualSpeed",
    angle: "angle",
    version: "version",
};

const COLOR_DIRECT_LABELS = { r: "R", g: "G", b: "B", h: "H" };
const COLOR_MSG_KEYS = {
    lux: "lightIntensity",
    version: "version",
    // SoftwareVersion / Softwareversion 与 version 重复，不在下拉菜单中展示
};

const GRAY_MSG_KEYS = {
    version: "version",
    Softwareversion: "version",
    SoftwareVersion: "version",
};

// ─── Component ────────────────────────────────────────────────────────────────
const DeviceSensing = ({ deviceObj, intl }) => {
    const fmt = (key) => intl.formatMessage(messages[key]);

    const getMotorLabel = (keyName) => {
        const msgKey = MOTOR_MSG_KEYS[keyName];
        return msgKey ? fmt(msgKey) : null;
    };

    const getColorLabel = (keyName) => {
        if (COLOR_DIRECT_LABELS[keyName]) return COLOR_DIRECT_LABELS[keyName];
        const msgKey = COLOR_MSG_KEYS[keyName];
        return msgKey ? fmt(msgKey) : null;
    };

    const getGrayLabel = (keyName) => {
        const msgKey = GRAY_MSG_KEYS[keyName];
        return msgKey ? fmt(msgKey) : keyName;
    };

    // 设备类型名 → 标签解析函数
    // sensing_device 由 est-link/common.js 的 distinguishDevice 设置，值如 "motor"/"color"/"gray" 等
    const LABEL_RESOLVERS = {
        motor: (keyName) => getMotorLabel(keyName),
        big_motor: (keyName) => getMotorLabel(keyName),
        small_motor: (keyName) => getMotorLabel(keyName),
        color: (keyName) => getColorLabel(keyName),
        superSound: () => fmt("distance"),
        touch: () => fmt("key"),
        gray: (keyName) => getGrayLabel(keyName),
        gray_v2: (keyName) => getGrayLabel(keyName),
        camer: (keyName, item) =>
            getCameraLabel(keyName, item.camer || item.camera),
        nfc: (keyName) => getNfcLabel(keyName),
    };

    const DistinguishTypes = (keyName, item) => {
        const resolve = LABEL_RESOLVERS[item.sensing_device];
        return resolve ? resolve(keyName, item) : keyName;
    };

    const changeUnitList = useCallback((unit, index, deviceId) => {
        const raw = window.myAPI.getStoreValue("sensing-unit-list");
        if (!raw) return;
        const list = JSON.parse(raw);
        if (
            list.length === 0 ||
            (list[index]?.deviceId === deviceId && list[index]?.unit === unit)
        )
            return;
        list[index] = { ...list[index], unit, deviceId };
        window.myAPI.setStoreValue("sensing-unit-list", JSON.stringify(list));
    }, []);

    return (
        <div className={styles.deviceSensingBox}>
            <ul>
                {deviceObj?.deviceList?.map((item, index) =>
                    item?.deviceId &&
                    item.deviceId !== "0" &&
                    item.sensing_device !== "deviceAbnormal" ? (
                        <DeviceSensingItem
                            key={index}
                            changeUnitList={changeUnitList}
                            index={index}
                            item={item}
                            getPort={getPort}
                            getSensing={getSensing}
                            getType={getType}
                            DistinguishTypes={DistinguishTypes}
                        />
                    ) : null
                )}
            </ul>
        </div>
    );
};

export default DeviceSensing;
