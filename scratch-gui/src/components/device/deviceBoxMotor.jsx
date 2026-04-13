import React from "react";
import styles from "./device.css";

const MOTOR_MSG_KEYS = {
    circly: "circly",
    speed: "actualSpeed",
    angle: "angle",
    version: "version",
};

const DeviceBoxMotor = ({ motor, intl, messages }) => {
    if (!motor || Object.keys(motor).length === 0) return null;

    const fmt = (key) => intl.formatMessage(messages[key]);

    const getMotorLabel = (keyName) => {
        const msgKey = MOTOR_MSG_KEYS[keyName];
        return msgKey ? fmt(msgKey) : null;
    };

    return (
        <div className={styles.motorGrid}>
            {Object.keys(motor).map((keyName) => {
                const label = getMotorLabel(keyName);
                if (!label) return null;
                return (
                    <div key={keyName} className={styles.motorCell}>
                        <span className={styles.motorLabel}>{label}</span>
                        <span className={styles.motorValue}>
                            {motor[keyName]}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default DeviceBoxMotor;
