import React from "react";
import styles from "./device.css";

// 摄像头各 mode 字段标签表（与 device-sensing.jsx 保持一致）
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

const DeviceBoxCamera = ({ camera }) => {
    if (!camera || Object.keys(camera).length === 0) return null;

    return (
        <div className={`${styles.sensorGrid} ${styles.sensorGridCamera}`}>
            {Object.keys(camera).map((keyName) => {
                if (keyName === "mode") return null;
                return (
                    <div key={keyName} className={styles.sensorCard}>
                        <span className={styles.sensorLabel}>
                            {getCameraLabel(keyName, camera)}
                        </span>
                        <span className={styles.sensorValue}>{camera[keyName]}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default DeviceBoxCamera;
