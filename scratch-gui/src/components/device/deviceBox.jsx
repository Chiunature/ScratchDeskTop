import React from "react";
import styles from "./device.css";

// ─── Port index → label ───────────────────────────────────────────────────────
const PORT_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const getPort = (index) =>
    PORT_LABELS[index] !== undefined ? PORT_LABELS[index] : String(index);

// ─── 摄像头各 mode 字段标签表（与 device-sensing.jsx 保持一致）─────────────────
const CAMERA_MODE_TITLES = {
    1: "Mode",
    3: "颜色检测",
    4: "巡线",
    6: "人脸识别",
    16: "特征点检测",
    12: "Apriltag模式",
};

const CAMERA_MODE_LABELS = {
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
    if (!camera?.mode) return keyName;
    if (keyName === "mode") return CAMERA_MODE_TITLES[camera.mode] || keyName;
    return CAMERA_MODE_LABELS[camera.mode]?.[keyName] || keyName;
};

// ─── NFC 字段标签 ─────────────────────────────────────────────────────────────
const NFC_LABELS = { id: "标签ID", version: "版本" };
const getNfcLabel = (keyName) => NFC_LABELS[keyName] || keyName;

// ─── 各传感器字段名 → 消息 key / 直接标签 的映射表 ──────────────────────────
const MOTOR_MSG_KEYS = {
    circly: "circly",
    speed: "actualSpeed",
    angle: "angle",
    version: "version",
};

// 颜色面板只展示这几个字段，rgb 固定为 "RGB"，其余查 i18n
const COLOR_BOX_LABELS = {
    lux: { msg: "lightIntensity" },
    rgb: { text: "RGB" },
    version: { msg: "version" },
};

// 灰度面板：version 类字段查 i18n，其余显示原始 key 名
const GRAY_MSG_KEYS = {
    version: "version",
    Softwareversion: "version",
};

// ─── Component ────────────────────────────────────────────────────────────────
const DeviceBox = ({ list, intl, messages }) => {
    const fmt = (key) => intl.formatMessage(messages[key]);

    const getMotorLabel = (keyName) => {
        const msgKey = MOTOR_MSG_KEYS[keyName];
        return msgKey ? fmt(msgKey) : null;
    };

    const getColorLabel = (keyName) => {
        const entry = COLOR_BOX_LABELS[keyName];
        if (!entry) return null;
        return entry.text || fmt(entry.msg);
    };

    const getGrayLabel = (keyName) => {
        const msgKey = GRAY_MSG_KEYS[keyName];
        return msgKey ? fmt(msgKey) : keyName;
    };

    return (
        <>
            {list.map((el, index) => (
                <div className={styles.midBox} key={index}>
                    <p>
                        {intl.formatMessage(messages["port"])}:{" "}
                        {getPort(el.port)}-
                        {messages[el.sensing_device]
                            ? intl.formatMessage(messages[el.sensing_device])
                            : el.sensing_device || "Unknown"}
                    </p>

                    {/* 电机 */}
                    {el.motor && Object.keys(el.motor).length > 0 && (
                        <ul className={styles.midUl}>
                            {Object.keys(el.motor).map((keyName) => {
                                const label = getMotorLabel(keyName);
                                if (!label) return null;
                                return (
                                    <li key={keyName}>
                                        <span>{label}</span>
                                        <span>{el.motor[keyName]}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {/* 超声波 */}
                    {el.ultrasion && (
                        <ul className={styles.midUl}>
                            <li>
                                <span>
                                    {intl.formatMessage(messages["distance"])}
                                </span>
                                <span>{el.ultrasion.cm}</span>
                                <span>cm</span>
                            </li>
                        </ul>
                    )}

                    {/* 触碰 */}
                    {el.touch && (
                        <ul className={styles.midUl}>
                            <li>
                                <span>
                                    {intl.formatMessage(messages["key"])}
                                </span>
                                <span>{el.touch.state}</span>
                            </li>
                        </ul>
                    )}

                    {/* 颜色 */}
                    {el.color && Object.keys(el.color).length > 0 && (
                        <ul className={styles.midUl}>
                            {Object.keys(el.color).map((keyName) => {
                                if (keyName === "Not_Run") {
                                    return (
                                        <li key={keyName}>
                                            <span>Error</span>
                                        </li>
                                    );
                                }
                                const label = getColorLabel(keyName);
                                if (!label) return null;
                                return (
                                    <li key={keyName}>
                                        <span>{label}</span>
                                        <span>{el.color[keyName]}</span>
                                        {keyName === "rgb" && (
                                            <span>
                                                <div
                                                    className={styles.col}
                                                    style={{
                                                        backgroundColor:
                                                            el.color[keyName],
                                                    }}
                                                />
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {/* 灰度 */}
                    {el.gray && Object.keys(el.gray).length > 0 && (
                        <ul className={styles.midUl}>
                            {Object.keys(el.gray).map((keyName) => (
                                <li key={keyName}>
                                    <span>
                                        {keyName === "Not_Run"
                                            ? "Error"
                                            : getGrayLabel(keyName)}
                                    </span>
                                    <span>{el.gray[keyName]}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* 摄像头 */}
                    {(el.camer || el.camera) &&
                        Object.keys(el.camer || el.camera).length > 0 && (
                            <ul className={styles.midUl}>
                                {Object.keys(el.camer || el.camera).map(
                                    (keyName) => {
                                        if (keyName === "mode") return null;
                                        const camera = el.camer || el.camera;
                                        return (
                                            <li key={keyName}>
                                                <span>
                                                    {getCameraLabel(
                                                        keyName,
                                                        camera
                                                    )}
                                                </span>
                                                <span>{camera[keyName]}</span>
                                            </li>
                                        );
                                    }
                                )}
                            </ul>
                        )}

                    {/* NFC */}
                    {el.nfc && Object.keys(el.nfc).length > 0 && (
                        <ul className={styles.midUl}>
                            {Object.keys(el.nfc).map((keyName) => (
                                <li key={keyName}>
                                    <span>{getNfcLabel(keyName)}</span>
                                    <span>{el.nfc[keyName]}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </>
    );
};

export default DeviceBox;
