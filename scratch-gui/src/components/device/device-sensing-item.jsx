import React, { useState, useMemo, useEffect, Fragment } from "react";
import styles from "./device.css";
import dropdownCaret from "../menu-bar/dropdown-caret.svg";

const DeviceSensingItem = ({
    item,
    getPort,
    getSensing,
    getType,
    DistinguishTypes,
    index,
    changeUnitList,
    _checkTypeIs,
}) => {
    let [showData, setShowData] = useState(0);
    let [unit, setUnit] = useState(null);
    let [unitIndex, setUnitIndex] = useState(0);

    useEffect(() => {
        const obj = getType(item);
        if (!obj) return;

        // 检查当前 unit 是否在新的 obj 中存在
        // 当 camera mode 变化时，obj 的键可能会变化（比如 mode 1 有 x,y,pixel，mode 3 有 r,g,b）
        if (unit && !obj.hasOwnProperty(unit)) {
            // 如果当前 unit 不存在于新的 obj 中，重置 unit 让 initUnit 重新选择
            setUnit(null);
        }

        initUnit(obj);
    }, [item]);

    let newDeviceId = useMemo(() => {
        setUnit(null);
        return item.deviceId;
    }, [item.deviceId]);

    let data = useMemo(() => {
        const type = DistinguishTypes(newDeviceId, unitIndex, unit, item);
        return type ? type + ": " + showData : showData;
    }, [showData, newDeviceId, unitIndex, unit, item]);

    function initUnit(obj) {
        if (!unit) {
            const arr = window.myAPI.getStoreValue("sensing-unit-list");
            let sensingUnitList, unitListItem;
            if (arr) {
                sensingUnitList = JSON.parse(arr);
            }
            if (sensingUnitList) {
                unitListItem = sensingUnitList[index];
            }
            if (!newDeviceId) {
                return;
            }
            const num = parseInt(newDeviceId.slice(-1));
            const isSameDevice = unitListItem?.deviceId === newDeviceId;
            if (isSameDevice) {
                switch (num) {
                    case 1:
                    case 5:
                    case 6:
                        const motorUnit =
                            isSameDevice && unitListItem?.unit
                                ? unitListItem["unit"]
                                : Object.keys(obj)[2];
                        setUnit(motorUnit);
                        initUnitIndex(obj, motorUnit);
                        break;
                    default:
                        const newUnit =
                            isSameDevice && unitListItem?.unit
                                ? unitListItem["unit"]
                                : Object.keys(obj)[0];
                        setUnit(newUnit);
                        initUnitIndex(obj, newUnit);
                        break;
                }
            } else {
                const defaultUnit = Object.keys(obj)[0];
                setUnit(defaultUnit);
                initUnitIndex(obj, defaultUnit);
                changeUnitList(defaultUnit, index, newDeviceId);
            }
        }

        // 无论 unit 是否变化，都要更新 showData
        // 这样当 camera mode 变化时，即使 unit 不变，showData 也会更新为最新的值
        if (
            unit &&
            obj.hasOwnProperty(unit) &&
            !_checkTypeIs(obj[unit], "Undefined") &&
            !_checkTypeIs(obj[unit], "Null")
        ) {
            setShowData(obj[unit]);
        }
    }

    function initUnitIndex(obj, unit) {
        if (!unit || !obj) return;
        const arr = Object.keys(obj);
        setUnitIndex(arr.indexOf(unit));
    }

    function selectUnit(el, unIndex) {
        if (unit === el || unIndex === unitIndex) {
            return;
        }
        setUnit(el);
        setUnitIndex(unIndex);
        changeUnitList(el, index, newDeviceId);
    }

    return (
        <li>
            <div className={styles.deviceSensingText}>{getPort(index)}</div>
            <div className={styles.deviceSensingContent}>
                <img src={getSensing(item.deviceId)} />
                <div className={styles.showUnit}>
                    <label>{data}</label>
                    <img
                        className={styles.dropdownCaret}
                        src={dropdownCaret}
                        alt=""
                    />
                </div>
                <div className={styles.deviceSensingUnit}>
                    <div>
                        {getType(item) &&
                            Object.keys(getType(item)).map((el, unIndex) => {
                                const displayText = DistinguishTypes(
                                    item.deviceId,
                                    unIndex,
                                    el,
                                    item
                                );
                                return el === "Not_Run" ? (
                                    <span key={unIndex}>Error</span>
                                ) : (
                                    <Fragment key={unIndex}>
                                        {displayText && (
                                            <span
                                                onClick={() =>
                                                    selectUnit(el, unIndex)
                                                }
                                            >
                                                {displayText}
                                            </span>
                                        )}
                                    </Fragment>
                                );
                            })}
                    </div>
                </div>
            </div>
        </li>
    );
};

export default DeviceSensingItem;
