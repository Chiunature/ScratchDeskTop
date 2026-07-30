import React from "react";
import styles from "./device.css";

// 摄像头 mode 标题（与积木 changer_camer_mode 对应）
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

// configs 单项字段标签（与 cam_data 积木字段对应）
const CAMERA_CONFIG_LABELS = {
    id: "ID",
    x: "X坐标",
    y: "Y坐标",
    w: "宽度",
    h: "高度",
    pp: "大小",
};

/** id1 / id2 … 统一按 ID 显示 */
const normalizeConfigField = (keyName) =>
    /^id\d+$/i.test(keyName) ? "id" : keyName;

const getConfigFieldLabel = (keyName) =>
    CAMERA_CONFIG_LABELS[normalizeConfigField(keyName)] || keyName;

/** 旧版扁平字段标签（兼容无 configs 的数据） */
const LEGACY_MODE_LABELS = {
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

const getLegacyLabel = (keyName, camera) => {
    if (!camera?.mode) return keyName;
    if (keyName === "mode") return CAMERA_MODE_TITLES[camera.mode] || keyName;
    return LEGACY_MODE_LABELS[camera.mode]?.[keyName] || keyName;
};

const DeviceBoxCamera = ({ camera }) => {
    if (!camera || Object.keys(camera).length === 0) return null;

    const configs = Array.isArray(camera.configs) ? camera.configs : null;

    // 新格式：mode + configs[]
    if (configs) {
        return (
            <div className={styles.cameraCard}>
                {camera.mode != null && (
                    <div className={styles.cameraModeRow}>
                        <span className={styles.sensorLabel}>模式</span>
                        <span className={styles.sensorValue}>
                            {CAMERA_MODE_TITLES[camera.mode] || camera.mode}
                        </span>
                    </div>
                )}
                {configs.map((cfg, index) => (
                    <section key={index} className={styles.cameraTarget}>
                        <div className={styles.cameraTargetTitle}>
                            {`目标${index + 1}`}
                        </div>
                        <div
                            className={`${styles.sensorGrid} ${styles.sensorGridCamera}`}
                        >
                            {Object.keys(cfg).map((keyName) => (
                                <div key={keyName} className={styles.sensorCard}>
                                    <span className={styles.sensorLabel}>
                                        {getConfigFieldLabel(keyName)}
                                    </span>
                                    <span className={styles.sensorValue}>
                                        {cfg[keyName]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        );
    }

    // 旧格式：扁平字段
    return (
        <div className={`${styles.sensorGrid} ${styles.sensorGridCamera}`}>
            {Object.keys(camera).map((keyName) => {
                if (keyName === "mode") return null;
                return (
                    <div key={keyName} className={styles.sensorCard}>
                        <span className={styles.sensorLabel}>
                            {getLegacyLabel(keyName, camera)}
                        </span>
                        <span className={styles.sensorValue}>
                            {camera[keyName]}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default DeviceBoxCamera;
