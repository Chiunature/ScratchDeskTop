import React from "react";
import classNames from "classnames";
import DeviceBoxHeader from "./deviceBoxHeader.jsx";
import DeviceBoxMotor from "./deviceBoxMotor.jsx";
import DeviceBoxUltrasound from "./deviceBoxUltrasound.jsx";
import DeviceBoxTouch from "./deviceBoxTouch.jsx";
import DeviceBoxColor from "./deviceBoxColor.jsx";
import DeviceBoxGray from "./deviceBoxGray.jsx";
import DeviceBoxCamera from "./deviceBoxCamera.jsx";
import DeviceBoxNfc from "./deviceBoxNfc.jsx";
import styles from "./device.css";

const cardStyle = {
    display: "flex",
    flexDirection: "column",
    padding: "15px",
    gap: "10px",
    background: "#ffffff",
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "12px",
};

const hasConnectedData = (device) => {
    if (!device) return false;
    const dataKeys = [
        "motor",
        "ultrasion",
        "touch",
        "color",
        "gray",
        "gray_v2",
        "camera",
        "camer",
        "nfc",
    ];
    return dataKeys.some((key) => {
        const value = device[key];
        if (value == null) return false;
        if (typeof value === "object") return Object.keys(value).length > 0;
        return String(value).trim() !== "";
    });
};

const hasDevNullMarker = (el) => {
    if (!el || typeof el !== "object") {
        return false;
    }
    return (
        Object.prototype.hasOwnProperty.call(el, "dev null") ||
        Object.prototype.hasOwnProperty.call(el, "dev_null")
    );
};

const DeviceBox = ({ list, intl, messages }) => (
    <>
        {list.map((el, index) => {
            const isNoDeviceCard =
                el?.sensing_device === "noDevice" && !hasConnectedData(el);
            const isAbnormalCard =
                !hasConnectedData(el) &&
                (el?.sensing_device === "deviceAbnormal" || hasDevNullMarker(el));
            const isCompactCard = isNoDeviceCard || isAbnormalCard;
            const headerSensing = isAbnormalCard
                ? "deviceAbnormal"
                : el.sensing_device;
            return (
                <div
                    style={cardStyle}
                    className={classNames(
                        isAbnormalCard && styles.deviceCardAbnormal,
                        isNoDeviceCard && styles.deviceCardNoDevice
                    )}
                    key={index}
                >
                    <DeviceBoxHeader
                        port={el.port}
                        sensingDevice={headerSensing}
                        intl={intl}
                        messages={messages}
                        compact={isCompactCard}
                        abnormal={isAbnormalCard}
                    />

                    {!isCompactCard && (
                        <DeviceBoxMotor
                            motor={el.motor}
                            intl={intl}
                            messages={messages}
                        />
                    )}

                    {!isCompactCard && (
                        <DeviceBoxUltrasound
                            ultrasion={el.ultrasion}
                            intl={intl}
                            messages={messages}
                        />
                    )}

                    {!isCompactCard && (
                        <DeviceBoxTouch
                            touch={el.touch}
                            intl={intl}
                            messages={messages}
                        />
                    )}

                    {!isCompactCard && (
                        <DeviceBoxColor
                            color={el.color}
                            intl={intl}
                            messages={messages}
                        />
                    )}

                    {!isCompactCard && (
                        <DeviceBoxGray
                            gray={
                                el.gray && Object.keys(el.gray).length > 0
                                    ? el.gray
                                    : el.gray_v2 &&
                                      Object.keys(el.gray_v2).length > 0
                                    ? el.gray_v2
                                    : null
                            }
                            intl={intl}
                            messages={messages}
                        />
                    )}

                    {!isCompactCard && (
                        <DeviceBoxCamera camera={el.camer || el.camera} />
                    )}

                    {!isCompactCard && <DeviceBoxNfc nfc={el.nfc} />}
                </div>
            );
        })}
    </>
);

export default DeviceBox;
