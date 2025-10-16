import React, { Fragment } from "react";
import styles from "./device.css";
import colorSensingIcon from "scratch-blocks/media/color_sensing.svg";
import motorSensingIcon from "scratch-blocks/media/motor_sensing.svg";
import smallMotorSensingIcon from "scratch-blocks/media/small_motor_sensing.svg";
import superSoundIcon from "scratch-blocks/media/super_sound.svg";
import touchPressIcon from "scratch-blocks/media/touch_press.svg";
import messages from "./deviceMsg";
import DeviceSensingItem from "./device-sensing-item.jsx";

const DeviceSensing = ({ deviceObj, intl }) => {
    function changeUnitList(unit, index, deviceId) {
        let list = window.myAPI.getStoreValue("sensing-unit-list");
        if (list) {
            let newList = JSON.parse(list);
            if (
                newList.length === 0 ||
                (newList[index]?.deviceId === deviceId &&
                    newList[index]?.unit === unit)
            )
                return;
            newList[index]["unit"] = unit;
            newList[index]["deviceId"] = deviceId;
            window.myAPI.setStoreValue(
                "sensing-unit-list",
                JSON.stringify(newList)
            );
        }
    }

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

    function getSensing(deviceId) {
        if (!deviceId) return;
        const num = parseInt(deviceId.slice(-1));
        switch (num) {
            case 1:
            case 5:
                return motorSensingIcon;
            case 6:
                return smallMotorSensingIcon;
            case 2:
            case 7:
                return colorSensingIcon;
            case 3:
                return superSoundIcon;
            case 4:
                return touchPressIcon;
            default:
                break;
        }
    }

    function getType(item) {
        if (!item.deviceId) return;
        const num = parseInt(item.deviceId.slice(-1));
        switch (num) {
            case 1:
            case 5:
            case 6:
                return item.motor;
            case 2:
                return item.color;
            case 3:
                return item.ultrasion;
            case 4:
                return item.touch;
            case 7:
                return item.gray;
            default:
                return null;
        }
    }

    function DistinguishTypes(deviceId, unitIndex, keyName) {
        if (!deviceId) return;
        const num = parseInt(deviceId.slice(-1));
        switch (num) {
            case 1:
            case 5:
            case 6:
                return motorData(unitIndex);
            case 2:
                return colorData(unitIndex);
            case 3:
                return intl.formatMessage(messages["distance"]);
            case 4:
                return intl.formatMessage(messages["key"]);
            case 7:
                return grayData(unitIndex, keyName);
            default:
                return keyName;
        }
    }

    function grayData(num, keyName) {
        switch (num) {
            case 0:
            case 1:
                return keyName;
            default:
                return intl.formatMessage(messages["version"]);
        }
    }

    function motorData(num) {
        switch (num) {
            case 0:
                return intl.formatMessage(messages["circly"]);
            case 1:
                return intl.formatMessage(messages["angle"]);
            case 2:
                return intl.formatMessage(messages["actualSpeed"]);
            case 3:
                return intl.formatMessage(messages["version"]);
            default:
                return;
        }
    }

    function colorData(num) {
        switch (num) {
            case 0:
                return intl.formatMessage(messages["lightIntensity"]);
            case 1:
                return "R";
            case 2:
                return "G";
            case 3:
                return "B";
            case 4:
                return "H";
            case 5:
                return intl.formatMessage(messages["version"]);
            default:
                return;
        }
    }

    function _checkTypeIs(currentType, target) {
        return {}.toString.call(currentType) === "[object " + target + "]";
    }

    return (
        <div className={styles.deviceSensingBox}>
            <ul>
                {deviceObj?.deviceList &&
                    deviceObj.deviceList.map((item, index) => {
                        return (
                            <Fragment key={index}>
                                {item?.deviceId !== "0" && (
                                    <DeviceSensingItem
                                        _checkTypeIs={_checkTypeIs}
                                        changeUnitList={changeUnitList}
                                        index={index}
                                        item={item}
                                        getPort={getPort}
                                        getSensing={getSensing}
                                        getType={getType}
                                        DistinguishTypes={DistinguishTypes}
                                    />
                                )}
                            </Fragment>
                        );
                    })}
            </ul>
        </div>
    );
};

export default DeviceSensing;
