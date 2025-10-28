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
            case 3:
                return intl.formatMessage(messages["version"]);
            default:
                return;
        }
    }

    function colorData(keyName) {
        switch (keyName) {
            case "l":
                return intl.formatMessage(messages["lightIntensity"]);
            case "rgb":
                return "RGB";
            case "version":
                return intl.formatMessage(messages["version"]);
            default:
                return "Error";
        }
    }

    function grayData(keyName) {
        switch (keyName) {
            case "version":
                return intl.formatMessage(messages["version"]);
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
                            {intl.formatMessage(messages[el.sensing_device])}
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
                        {el.color && Object.keys(el.color).length > 0 && (
                            <ul className={styles.midUl}>
                                {Object.keys(el.color).map((keyName, index) => {
                                    return (
                                        <Fragment key={index}>
                                            {(keyName === "l" ||
                                                keyName === "rgb" ||
                                                keyName === "version" ||
                                                keyName === "Not_Run") && (
                                                <li>
                                                    <span>
                                                        {colorData(keyName)}
                                                    </span>
                                                    <span>
                                                        {el.color[keyName]}
                                                    </span>
                                                    {keyName === "rgb" && (
                                                        <span>
                                                            <div
                                                                className={
                                                                    styles.col
                                                                }
                                                                style={{
                                                                    backgroundColor:
                                                                        el
                                                                            .color[
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
                                })}
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
                    </div>
                );
            })}
        </>
    );
};

export default DeviceBox;
