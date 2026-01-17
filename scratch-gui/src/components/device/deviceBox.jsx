import React, { Fragment, useMemo } from "react";
import styles from "./device.css";

const DeviceBox = ({ list, intl, messages }) => {
    let newList = useMemo(() => list, [list]);
    function getPort(index) {
        const num = parseInt(index);
        if (isNaN(num)) return;
        switch (num) {
            case 0:
                return "A";
            case 1:
                return "B";
            case 2:
                return "C";
            case 3:
                return "D";
            case 4:
                return "E";
            case 5:
                return "F";
            case 6:
                return "G";
            case 7:
                return "H";
            default:
                break;
        }
    }

    function motorData(num) {
        switch (num) {
            case 0:
                return intl.formatMessage(messages["circly"]);
            case 1:
                return intl.formatMessage(messages["actualSpeed"]);
            case 2:
                return intl.formatMessage(messages["angle"]);
            case 5:
                return intl.formatMessage(messages["version"]);
            default:
                return;
        }
    }

    // function colorData(keyName) {
    //     switch (keyName) {
    //         case "l":
    //             return intl.formatMessage(messages["lightIntensity"]);
    //         case "rgb":
    //             return "RGB";
    //         case "version":
    //             return intl.formatMessage(messages["version"]);
    //         default:
    //             return "Error";
    //     }
    // }

    function colorData(keyName) {
        switch (keyName) {
            case "lux":
            case "l":
                return intl.formatMessage(messages["lightIntensity"]);
            case "state":
                return "状态";
            case "rgb":
                return "RGB";
            case "version":
                return intl.formatMessage(messages["version"]);
            default:
                return keyName;
        }
    }

    function grayData(keyName) {
        switch (keyName) {
            case "version":
                return intl.formatMessage(messages["version"]);
            case "Softwareversion":
                return "软件版本";
            default:
                return keyName;
        }
    }

    function cameraData(keyName, camera) {
        // 根据 camera 的 mode 和 keyName 返回对应的显示文本
        if (!camera || !camera.mode) return keyName;

        switch (camera.mode) {
            case 1:
                // mode 1: {"mode":1,"state":1,"x":185,"y":33,"pixel":27392}
                switch (keyName) {
                    case "mode":
                        return "Mode";
                    case "state":
                        return "是否找到";
                    case "x":
                        return "X坐标";
                    case "y":
                        return "Y坐标";
                    case "pixel":
                        return "像素点";
                    default:
                        return keyName;
                }
            case 3:
                //颜色检测
                switch (keyName) {
                    case "mode":
                        return "颜色检测";
                    case "r":
                        return "红色值";
                    case "g":
                        return "绿色值";
                    case "b":
                        return "蓝色值";
                    default:
                        return keyName;
                }
            case 4:
                //巡线
                switch (keyName) {
                    case "mode":
                        return "巡线";
                    case "state":
                        return "是否找到";
                    case "sig":
                        return "显著性";
                    case "cm":
                        return "垂度";
                    case "theta":
                        return "角度";
                    default:
                        return keyName;
                }
            case 6:
                //人脸识别
                switch (keyName) {
                    case "mode":
                        return "人脸识别";
                    case "state":
                        return "是否找到";
                    case "x":
                        return "X坐标";
                    case "y":
                        return "Y坐标";
                    default:
                        return keyName;
                }
            case 16:
                // 特征点检测
                switch (keyName) {
                    case "mode":
                        return "特征点检测";
                    case "state":
                        return "是否找到";
                    case "matchine":
                        return "匹配度";
                    case "angle":
                        return "角度";
                    default:
                        return keyName;
                }
            case 12:
                // Apriltag模式
                switch (keyName) {
                    case "mode":
                        return "Apriltag模式";
                    case "state":
                        return "是否找到";
                    case "id":
                        return "标签ID";
                    case "x":
                        return "X坐标";
                    case "y":
                        return "Y坐标";
                    case "angle":
                        return "角度";
                    case "cm":
                        return "距离";
                    default:
                        return keyName;
                }
            default:
                return keyName;
        }
    }

    function nfcData(keyName, nfc) {
        switch (keyName) {
            case "id":
                return "标签ID";
            case "version":
                return "版本";
            default:
                return keyName;
        }
    }
    return (
        <>
            {newList.map((el, index) => {
                return (
                    <div className={styles.midBox} key={index}>
                        <p>
                            {intl.formatMessage(messages["port"])}:{" "}
                            {getPort(el.port)}-
                            {messages[el.sensing_device]
                                ? intl.formatMessage(
                                      messages[el.sensing_device]
                                  )
                                : el.sensing_device || "Unknown"}
                        </p>
                        {el.motor && Object.keys(el.motor).length > 0 && (
                            <ul className={styles.midUl}>
                                {Object.keys(el.motor).map((keyName, index) => {
                                    return (
                                        <Fragment key={index}>
                                            {motorData(index) && (
                                                <li>
                                                    <span>
                                                        {motorData(index)}
                                                    </span>
                                                    <span>
                                                        {el.motor[keyName]}
                                                    </span>
                                                </li>
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </ul>
                        )}
                        {el.ultrasion && (
                            <ul className={styles.midUl}>
                                <li>
                                    <span>
                                        {intl.formatMessage(
                                            messages["distance"]
                                        )}
                                    </span>
                                    <span>{el.ultrasion.cm}</span>
                                    <span>cm</span>
                                </li>
                            </ul>
                        )}
                        {el.touch && (
                            <ul className={styles.midUl}>
                                <li>
                                    <span>
                                        {intl.formatMessage(messages["key"])}
                                    </span>
                                    <span>{el.touch.state}</span>
                                </li>
                            </ul>
                        )}
                        {el.lightIntensity &&
                            Object.keys(el.lightIntensity).length > 0 && (
                                <ul className={styles.midUl}>
                                    {Object.keys(el.lightIntensity).map(
                                        (keyName, index) => {
                                            return (
                                                <Fragment key={index}>
                                                    {(keyName === "lux" ||
                                                        keyName === "l" ||
                                                        keyName === "state" ||
                                                        keyName === "rgb" ||
                                                        keyName === "version" ||
                                                        keyName ===
                                                            "Not_Run") && (
                                                        <li>
                                                            <span>
                                                                {colorData(
                                                                    keyName
                                                                )}
                                                            </span>
                                                            <span>
                                                                {
                                                                    el
                                                                        .lightIntensity[
                                                                        keyName
                                                                    ]
                                                                }
                                                            </span>
                                                            {keyName ===
                                                                "rgb" && (
                                                                <span>
                                                                    <div
                                                                        className={
                                                                            styles.col
                                                                        }
                                                                        style={{
                                                                            backgroundColor:
                                                                                el
                                                                                    .lightIntensity[
                                                                                    keyName
                                                                                ],
                                                                        }}
                                                                    ></div>
                                                                </span>
                                                            )}
                                                        </li>
                                                    )}
                                                </Fragment>
                                            );
                                        }
                                    )}
                                </ul>
                            )}
                        {el.gray && Object.keys(el.gray).length > 0 && (
                            <ul className={styles.midUl}>
                                {Object.keys(el.gray).map((keyName, index) => {
                                    return (
                                        <li key={index}>
                                            <span>
                                                {keyName === "Not_Run"
                                                    ? "Error"
                                                    : grayData(keyName)}
                                            </span>
                                            <span>{el.gray[keyName]}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                        {(el.camer || el.camera) &&
                            Object.keys(el.camer || el.camera).length > 0 && (
                                <ul className={styles.midUl}>
                                    {Object.keys(el.camer || el.camera).map(
                                        (keyName, index) => {
                                            const camera =
                                                el.camer || el.camera;
                                            // 跳过 mode 字段，因为它已经在标题中显示了
                                            if (keyName === "mode") return null;
                                            return (
                                                <li key={index}>
                                                    <span>
                                                        {cameraData(
                                                            keyName,
                                                            camera
                                                        )}
                                                    </span>
                                                    <span>
                                                        {/* 10214654{keyName} */}
                                                        {camera[keyName]}
                                                    </span>
                                                </li>
                                            );
                                        }
                                    )}
                                </ul>
                            )}
                        {el.nfc && Object.keys(el.nfc).length > 0 && (
                            <ul className={styles.midUl}>
                                {Object.keys(el.nfc).map((keyName, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <li>
                                                <span>{nfcData(keyName)}</span>
                                                <span>{el.nfc[keyName]}</span>
                                            </li>
                                        </Fragment>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default DeviceBox;
