import React from "react";
import styles from "./device.css";

const PORT_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const getPort = (index) =>
    PORT_LABELS[index] !== undefined ? PORT_LABELS[index] : String(index);

const portBadgeStyle = {
    fontSize: "12px",
    fontWeight: "600",
    padding: "6px",
    textAlign: "center",
    borderRadius: "4px",
};

const deviceBadgeStyle = {
    fontSize: "12px",
    fontWeight: "600",
    textAlign: "center",
};

const DeviceBoxHeader = ({ port, sensingDevice, intl, messages, compact = false }) => (
    <div
        className={
            compact ? styles.deviceBoxHeaderCompact : styles.deviceBoxHeaderNormal
        }
    >
        <span
            style={portBadgeStyle}
            className={compact ? styles.portBadgeCompact : styles.portBadgeNormal}
        >
            {intl.formatMessage(messages["port"])}:{getPort(port)}
        </span>
        <span
            style={deviceBadgeStyle}
            className={compact ? styles.deviceBadgeCompact : styles.deviceBadgeNormal}
        >
            {messages[sensingDevice]
                ? intl.formatMessage(messages[sensingDevice])
                : sensingDevice || "Unknown"}
        </span>
    </div>
);

export default DeviceBoxHeader;
