import React from "react";
import styles from "./device.css";

// 颜色面板只展示这几个字段，rgb 固定为 "RGB"，其余查 i18n
const COLOR_BOX_LABELS = {
    lux: { msg: "lightIntensity" },
    rgb: { text: "RGB" },
    version: { msg: "version" },
};

const DeviceBoxColor = ({ color, intl, messages }) => {
    if (!color || Object.keys(color).length === 0) return null;

    const fmt = (key) => intl.formatMessage(messages[key]);

    const getColorLabel = (keyName) => {
        const entry = COLOR_BOX_LABELS[keyName];
        if (!entry) return null;
        return entry.text || fmt(entry.msg);
    };

    return (
        <div className={styles.sensorGrid}>
            {Object.keys(color).map((keyName) => {
                if (keyName === "Not_Run") {
                    return (
                        <div key={keyName}>
                            <span>Error</span>
                        </div>
                    );
                }
                const label = getColorLabel(keyName);
                if (!label) return null;
                return (
                    <div
                        key={keyName}
                        className={`${styles.sensorCard} ${styles.sensorGridCell} ${
                            keyName === "rgb" ? styles.sensorGridFullRow : ""
                        }`}
                    >
                        <span className={styles.sensorLabel}>{label}</span>
                        <span className={`${styles.sensorValue} ${styles.sensorValueRow}`}>
                            {color[keyName]}
                            {keyName === "rgb" && (
                                <span
                                    className={styles.colorRgbSwatch}
                                    style={{
                                        backgroundColor: color[keyName],
                                    }}
                                />
                            )}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default DeviceBoxColor;
