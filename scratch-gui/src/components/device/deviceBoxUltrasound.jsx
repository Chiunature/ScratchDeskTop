import React from "react";
import styles from "./device.css";

const DeviceBoxUltrasound = ({ ultrasion, intl, messages }) => {
    if (!ultrasion) return null;

    return (
        <div className={styles.sensorCard}>
            <span className={styles.sensorLabel}>
                {intl.formatMessage(messages["distance"])}(cm)
            </span>
            <span className={styles.sensorValue}>{ultrasion.cm}</span>
        </div>
    );
};

export default DeviceBoxUltrasound;
