import React from "react";

const NFC_LABELS = { id: "标签ID", version: "版本" };
const getNfcLabel = (keyName) => NFC_LABELS[keyName] || keyName;

const cellWrapStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "4px",
    background: "#f8fafc",
    borderRadius: "4px",
};

const labelStyle = {
    color: "#94a3b8",
    fontSize: "14px",
    marginBottom: "4px",
    fontWeight: "600",
};

const valueStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#3b82f6",
};

const DeviceBoxNfc = ({ nfc }) => {
    if (!nfc || Object.keys(nfc).length === 0) return null;

    return (
        <>
            {Object.keys(nfc).map((keyName) => (
                <div key={keyName} style={cellWrapStyle}>
                    <span style={labelStyle}>{getNfcLabel(keyName)}</span>
                    <span style={valueStyle}>{nfc[keyName]}</span>
                </div>
            ))}
        </>
    );
};

export default DeviceBoxNfc;
