import React, { useState, useMemo, useEffect, useCallback } from "react";
import styles from "./device.css";
import dropdownCaret from "../menu-bar/dropdown-caret.svg";

// 判断值是否为有效数据（非 null/undefined）
const isValid = (val) =>
    val !== undefined && val !== null;

// 颜色识别对象是否含 lux 字段（决定默认优先展示 lux）
const isColorWithLux = (obj) =>
    obj && "lux" in obj && ("r" in obj || "g" in obj || "b" in obj);

// 电机类型的 sensing_device 名称集合
const MOTOR_TYPES = new Set(["motor", "big_motor", "small_motor"]);

// 从本地存储读取当前端口的已保存单位
const getSavedUnit = (index, deviceId) => {
    const raw = window.myAPI.getStoreValue("sensing-unit-list");
    if (!raw) return null;
    try {
        const list = JSON.parse(raw);
        const entry = list?.[index];
        return entry?.deviceId === deviceId ? (entry.unit || null) : null;
    } catch {
        return null;
    }
};

// 取默认单位：颜色识别优先 lux，电机取第 3 个字段（pos），其余取第 1 个
const getDefaultUnit = (obj, sensingDevice) => {
    if (isColorWithLux(obj)) return "lux";
    const keys = Object.keys(obj);
    return MOTOR_TYPES.has(sensingDevice)
        ? (keys[2] !== undefined ? keys[2] : keys[0])
        : keys[0];
};

const DeviceSensingItem = ({
    item,
    getPort,
    getSensing,
    getType,
    DistinguishTypes,
    index,
    changeUnitList,
}) => {
    const [unit, setUnit] = useState(null);

    // 设备切换时重置选中单位
    useEffect(() => {
        setUnit(null);
    }, [item.deviceId]);

    // unit 为 null 时进行初始化（优先读本地存储，其次取默认）
    useEffect(() => {
        if (unit !== null) return;
        const obj = getType(item);
        if (!obj || !item.deviceId) return;

        const saved = getSavedUnit(index, item.deviceId);
        const next =
            saved && saved in obj
                ? saved
                : getDefaultUnit(obj, item.sensing_device);

        setUnit(next);
        changeUnitList(next, index, item.deviceId);
    }, [unit, item, index]);

    // 当前数据中不存在该 unit 时重置（例如 camera mode 切换导致字段消失）
    useEffect(() => {
        const obj = getType(item);
        if (obj && unit && !(unit in obj)) {
            setUnit(null);
        }
    }, [item]);

    const obj = getType(item);

    // 当前展示数值（派生值，无需独立 state）
    const showData = useMemo(() => {
        if (!obj || !unit || !(unit in obj)) return 0;
        const val = obj[unit];
        return isValid(val) ? val : 0;
    }, [obj, unit]);

    // 组合显示文案："标签: 数值"
    const label = useMemo(() => {
        const typeName = DistinguishTypes(unit, item);
        return typeName ? `${typeName}: ${showData}` : `${showData}`;
    }, [showData, unit, item]);

    const handleSelectUnit = useCallback(
        (key) => {
            if (key === unit) return;
            setUnit(key);
            changeUnitList(key, index, item.deviceId);
        },
        [unit, index, item.deviceId]
    );

    const options = obj ? Object.keys(obj) : [];

    return (
        <li>
            <div className={styles.deviceSensingText}>{getPort(index)}</div>
            <div className={styles.deviceSensingContent}>
                <img src={getSensing(item.sensing_device)} alt="" />
                <div className={styles.showUnit}>
                    <label>{label}</label>
                    <img
                        className={styles.dropdownCaret}
                        src={dropdownCaret}
                        alt=""
                    />
                </div>
                <div className={styles.deviceSensingUnit}>
                    <div>
                        {options.map((key) => {
                            if (key === "Not_Run") {
                                return <span key={key}>Error</span>;
                            }
                            const text = DistinguishTypes(key, item);
                            if (!text) return null;
                            return (
                                <span
                                    key={key}
                                    onClick={() => handleSelectUnit(key)}
                                >
                                    {text}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        </li>
    );
};

export default DeviceSensingItem;
