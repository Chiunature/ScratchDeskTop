import React from "react";
import styles from "./device.css";

const DeviceBoxTouch = ({ touch, intl, messages }) => {
    if (!touch) return null;

    return (
        <div className={styles.sensorCard}>
            <span className={styles.sensorLabel}>
                {intl.formatMessage(messages["key"])}
            </span>
            <span className={styles.sensorValue}>{touch.state}</span>
        </div>
    );
};

export default DeviceBoxTouch;
