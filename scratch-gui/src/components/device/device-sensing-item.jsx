import React, { useMemo, Fragment } from "react";
import styles from "./device.css";

const DeviceSensingItem = ({
    item,
    portText,
    getSensing,
    getType,
    DistinguishTypes,
    _checkTypeIs,
}) => {
    // 获取传感器数据对象
    const sensorData = useMemo(() => {
        return getType(item);
    }, [item, getType]);

    // 渲染所有数据项
    const renderDataItems = () => {
        if (!sensorData) return null;

        return Object.keys(sensorData).map((key, unIndex) => {
            // 跳过 Not_Run 和无效值
            if (key === "Not_Run") {
                return (
                    <div key={unIndex} className={styles.dataItem}>
                        <span className={styles.dataLabel}>Error</span>
                    </div>
                );
            }

            const value = sensorData[key];
            // 过滤 Undefined 和 Null
            if (
                _checkTypeIs(value, "Undefined") ||
                _checkTypeIs(value, "Null")
            ) {
                return null;
            }

            // 获取显示名称（只需要 deviceId 和 keyName）
            const displayName = DistinguishTypes(item.deviceId, key) || key;

            return (
                <div key={unIndex} className={styles.dataItem}>
                    <span className={styles.dataLabel}>{displayName}</span>
                    <span className={styles.dataValue}>{value}</span>
                </div>
            );
        });
    };

    return (
        <li>
            <div className={styles.deviceSensingText}>{portText}</div>
            <div className={styles.deviceSensingContent}>
                <img src={getSensing(item.deviceId)} alt="sensor icon" />
                <div className={styles.showAllData}>{renderDataItems()}</div>
            </div>
        </li>
    );
};

export default DeviceSensingItem;
