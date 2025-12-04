import React, { Fragment } from "react";
import styles from "./device.css";
import colorSensingIcon from "scratch-blocks/media/color_sensing.svg";
import motorSensingIcon from "scratch-blocks/media/motor_sensing.svg";
import smallMotorSensingIcon from "scratch-blocks/media/small_motor_sensing.svg";
import superSoundIcon from "scratch-blocks/media/super_sound.svg";
import touchPressIcon from "scratch-blocks/media/touch_press.svg";
import cameraSensingIcon from "scratch-blocks/media/camera.svg";
import nfcSensingIcon from "scratch-blocks/media/nfc.svg";
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
    //返回端口号
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
    //返回图标
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
            case 8:
                return cameraSensingIcon;
            case 9:
                return nfcSensingIcon;
            default:
                break;
        }
    }
    //返回数据
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
            case 8:
                return item.camer;
            case 9:
                return item.nfc;
            default:
                return null;
        }
    }

    function DistinguishTypes(deviceId, unitIndex, keyName, item) {
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
            case 8:
                // 获取 camera 对象
                const camera = item?.camer || item?.camera;
                return cameraData(keyName, camera);
            case 9:
                return nfcData(keyName);
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
                return intl.formatMessage(messages["actualSpeed"]);
            case 2:
                return intl.formatMessage(messages["angle"]);
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

    function cameraData(keyName, camera) {
        // 根据 camera 的 mode 和 keyName 返回对应的显示文本
        if (!camera || !camera.mode) return keyName;

        switch (camera.mode) {
            case 1:
                // mode 1: {"mode":1,"state":1,"x":185,"y":33,"pixel":27392}
                switch (keyName) {
                    case "mode":
                        return "模式";
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
                // mode 2: {"mode":2,"r":23,"g":33,"b":xx}
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
                // 人脸识别
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
                //特征点检测
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
                //Apriltag模式
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

    function nfcData(keyName) {
        switch (keyName) {
            case "id":
                return "标签ID";
            case "version":
                return "版本";
            default:
                return keyName;
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
