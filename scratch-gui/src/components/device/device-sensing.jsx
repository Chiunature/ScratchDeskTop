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
    // 根据端口索引返回端口字母，若无端口信息则回退索引
    function getPort(port) {
        return port;
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

    /**
     * 根据设备ID获取对应的传感器数据对象
     * @param {object} item - 设备项，包含 deviceId 和传感器数据
     * @returns {object|null} 传感器数据对象
     */
    function getType(item) {
        if (!item?.deviceId) return null;

        // 设备类型映射表：deviceId最后一位数字 -> 数据字段名
        const deviceTypeMap = {
            1: "motor", // 电机设备
            2: "color", // 颜色传感器
            3: "ultrasion", // 超声波传感器
            4: "touch", // 按键传感器
            5: "motor", // 电机设备
            6: "motor", // 小电机设备
            7: "LineCard", // 巡线卡传感器（注意：实际字段名是 LineCard，不是 gray）
        };

        const deviceType = parseInt(item.deviceId.slice(-1));
        const dataField = deviceTypeMap[deviceType];

        return dataField ? item[dataField] : null;
    }

    /**
     * 根据设备类型和键名获取显示名称（简化版）
     * @param {string} deviceId - 设备ID（必传），用于判断设备类型
     * @param {string} keyName - 数据键名（必传），如 "reflectedLight", "r", "value" 等
     * @returns {string} 显示名称，如果无法映射则返回 keyName
     */
    function DistinguishTypes(deviceId, keyName) {
        if (!keyName) return "";

        const deviceType = deviceId ? parseInt(deviceId.slice(-1)) : null;

        // 统一的键名到显示名称映射表
        const keyNameMap = {
            // 电机设备字段
            circly: intl.formatMessage(messages["circly"]),
            actualSpeed: intl.formatMessage(messages["actualSpeed"]),
            angle: intl.formatMessage(messages["angle"]),

            // 颜色传感器字段
            reflectedLight: intl.formatMessage(messages["lightIntensity"]),
            r: "R",
            g: "G",
            b: "B",
            colorType: "颜色种类",

            // 巡线卡传感器字段
            BWNumber: "黑白线数",
            thoroughfare1: "通道1",
            thoroughfare2: "通道2",
            thoroughfare3: "通道3",
            thoroughfare4: "通道4",

            // 通用版本字段
            version: intl.formatMessage(messages["version"]),
        };

        // 特殊处理：value 字段根据设备类型显示不同名称
        if (keyName === "value") {
            if (deviceType === 3) {
                return intl.formatMessage(messages["distance"]); // 超声波传感器
            } else if (deviceType === 4) {
                return intl.formatMessage(messages["key"]); // 按键传感器
            }
        }

        // 返回映射值，如果没有映射则返回原始键名
        return keyNameMap[keyName] || keyName;
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
                                        item={item}
                                        portText={getPort(item.port)}
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
