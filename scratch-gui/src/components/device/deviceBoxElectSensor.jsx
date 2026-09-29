import React from "react";
import styles from "./device.css";

const hasValue = (value) => value !== undefined && value !== null;

const getStateLabel = (state, intl, messages) => {
    if (String(state) === "0") {
        return intl.formatMessage(messages.electSensorDisconnected);
    }
    if (String(state) === "1") {
        return intl.formatMessage(messages.electSensorEngaged);
    }
    return state;
};

const DeviceBoxElectSensor = ({ electSensor, intl, messages }) => {
    if (!electSensor || Object.keys(electSensor).length === 0) return null;

    const cells = [];
    if (hasValue(electSensor.state)) {
        cells.push({
            key: "state",
            label: intl.formatMessage(messages.electSensorState),
            value: getStateLabel(electSensor.state, intl, messages),
        });
    }
    if (hasValue(electSensor.SoftwareVersion)) {
        cells.push({
            key: "SoftwareVersion",
            label: intl.formatMessage(messages.electSensorSoftwareVersion),
            value: electSensor.SoftwareVersion,
        });
    }

    if (cells.length === 0) return null;

    return (
        <div className={styles.sensorGrid}>
            {cells.map(({ key, label, value }) => (
                <div key={key} className={styles.sensorCard}>
                    <span className={styles.sensorLabel}>{label}</span>
                    <span className={styles.sensorValue}>{value}</span>
                </div>
            ))}
        </div>
    );
};

export default DeviceBoxElectSensor;