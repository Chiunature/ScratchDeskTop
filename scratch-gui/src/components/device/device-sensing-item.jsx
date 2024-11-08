import React, { useState, useMemo, useEffect, Fragment } from "react";
import styles from './device.css';
import dropdownCaret from '../menu-bar/dropdown-caret.svg';


const DeviceSensingItem = ({ item, getPort, getSensing, getType, DistinguishTypes, index, changeUnitList, _checkTypeIs }) => {

    let [showData, setShowData] = useState(0);
    let [unit, setUnit] = useState(null);
    let [unitIndex, setUnitIndex] = useState(0);

    useEffect(() => {
        const obj = getType(item);
        if (!obj) return;
        initUnit(obj);
    }, [item]);

    let newDeviceId = useMemo(() => {
        setUnit(null);
        return item.deviceId;
    }, [item.deviceId]);

    let data = useMemo(() => {
        const type = DistinguishTypes(newDeviceId, unitIndex)
        return type ? (type + ': ' + showData) : showData;
    }, [showData, newDeviceId, unitIndex]);

    function initUnit(obj) {
        if (!unit) {
            const arr = window.myAPI.getStoreValue('sensing-unit-list');
            let sensingUnitList, unitListItem;
            if (arr) {
                sensingUnitList = JSON.parse(arr);
            }
            if (sensingUnitList) {
                unitListItem = sensingUnitList[index];
            }
            if(!newDeviceId) {
                return;
            }
            const num = parseInt(newDeviceId.slice(-1));
            const isSameDevice = unitListItem?.deviceId === newDeviceId;
            if(isSameDevice) {
                switch (num) {
                    case 1:
                    case 5:
                    case 6:
                        const motorUnit = isSameDevice && unitListItem?.unit ? unitListItem['unit'] : Object.keys(obj)[2];
                        setUnit(motorUnit);
                        initUnitIndex(obj, motorUnit);
                        break;
                    default:
                        const newUnit = isSameDevice && unitListItem?.unit ? unitListItem['unit'] : Object.keys(obj)[0];
                        setUnit(newUnit);
                        initUnitIndex(obj, newUnit);
                        break;
                }
            }else {
                changeUnitList(unit, index, newDeviceId);
            }
        }

        if (!_checkTypeIs(obj[unit], 'Undefined') && !_checkTypeIs(obj[unit], 'Null')) {
            setShowData(obj[unit]);
        }
    }

    function initUnitIndex(obj, unit) {
        if (!unit || !obj) return;
        const arr = Object.keys(obj);
        setUnitIndex(arr.indexOf(unit));
    }

    function selectUnit(el, unIndex) {
        if(unit === el || unIndex === unitIndex) {
            return;
        }
        setUnit(el);
        setUnitIndex(unIndex);
        changeUnitList(el, index, newDeviceId);
    }

    return (
        <li className={item?.deviceId !== '0' ? '' : styles.hide}>
            <div className={styles.deviceSensingText}>{getPort(index)}</div>
            <div className={styles.deviceSensingContent}>
                <img src={getSensing(item.deviceId)} />
                <div className={styles.showUnit}>
                    <label>{data}</label>
                    <img className={styles.dropdownCaret} src={dropdownCaret} alt=""/>
                </div>
                <div className={styles.deviceSensingUnit}>
                    <div>
                        {getType(item) && Object.keys(getType(item)).map((el, unIndex) => {
                            return (
                                el === 'Not_Run' ? (<span key={unIndex}>Error</span>) :
                                (<Fragment key={unIndex}>
                                    {DistinguishTypes(item.deviceId, unIndex, el) && <span
                                        onClick={() => selectUnit(el, unIndex)}>{DistinguishTypes(item.deviceId, unIndex, el)}</span>}
                                </Fragment>)
                            )
                        })}
                    </div>
                </div>
            </div>
        </li>
    )
}

export default DeviceSensingItem;
