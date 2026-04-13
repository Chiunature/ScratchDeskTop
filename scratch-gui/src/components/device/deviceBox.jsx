import React from "react";
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

const DeviceBox = ({ list, intl, messages }) => (
    <>
        {list.map((el, index) => {
            const isNoDeviceCard =
                el?.sensing_device === "noDevice" && !hasConnectedData(el);
            return (
                <div
                    style={cardStyle}
                    className={isNoDeviceCard ? styles.deviceCardNoDevice : ""}
                    key={index}
                >
                    <DeviceBoxHeader
                        port={el.port}
                        sensingDevice={el.sensing_device}
                        intl={intl}
                        messages={messages}
                        compact={isNoDeviceCard}
                    />

                    {!isNoDeviceCard && (
                        <DeviceBoxMotor
                            motor={el.motor}
                            intl={intl}
                            messages={messages}
                        />
                    )}

                    {!isNoDeviceCard && (
                        <DeviceBoxUltrasound
                            ultrasion={el.ultrasion}
                            intl={intl}
                            messages={messages}
                        />
                    )}

                    {!isNoDeviceCard && (
                        <DeviceBoxTouch
                            touch={el.touch}
                            intl={intl}
                            messages={messages}
                        />
                    )}

                    {!isNoDeviceCard && (
                        <DeviceBoxColor
                            color={el.color}
                            intl={intl}
                            messages={messages}
                        />
                    )}

                    {!isNoDeviceCard && (
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

                    {!isNoDeviceCard && (
                        <DeviceBoxCamera camera={el.camer || el.camera} />
                    )}

                    {!isNoDeviceCard && <DeviceBoxNfc nfc={el.nfc} />}
                </div>
            );
        })}
    </>
);

export default DeviceBox;
