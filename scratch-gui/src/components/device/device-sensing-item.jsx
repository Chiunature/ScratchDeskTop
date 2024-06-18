import React, { useState, useMemo, useEffect, Fragment, useCallback } from "react";
import styles from './device.css';
import dropdownCaret from '../menu-bar/dropdown-caret.svg';


const DeviceSensingItem = ({ item, getPort, getSensing, getType, DistinguishTypes, index, changeUnitList }) => {

    let [showData, setShowData] = useState(0);
    let [unit, setUnit] = useState(null);

    useEffect(() => {
        const obj = getType(item);
        if (!obj) return;
        initUnit(obj);
    });

    let selectUnit = useCallback((el) => setUnit(el), [unit]);

    let data = useMemo(() => showData, [showData]);

    let unitItem = useMemo(() => {
        if (unit) {
            changeUnitList(unit, index);
        }
        return unit;
    }, [unit]);

    let newDeviceId = useMemo(() => {
        setUnit(null);
        return item.deviceId;
    }, [item.deviceId]);

    function initUnit(obj) {
        if (!unitItem) {
            const arr = window.myAPI.getStoreValue('sensing-unit-list');
            let unitList, unitListItem;
            if (arr) {
                unitList = JSON.parse(arr);
            }
            if (unitList) {
                unitListItem = unitList[index];
            }
            if (!item.deviceId) {
                return;
            }
            const num = parseInt(item.deviceId.slice(-1));
            switch (num) {
                case 1:
                case 5:
                case 6:
                    setUnit(unitListItem?.unit ? unitListItem['unit'] : Object.keys(obj)[2]);
                    break;
                default:
                    setUnit(unitListItem?.unit ? unitListItem['unit'] : Object.keys(obj)[0]);
                    break;
            }
        }
        setShowData(obj[unitItem]);
    }

    return (
        <li className={item?.deviceId !== '0' ? '' : styles.hide}>
            <div className={styles.deviceSensingText}>{getPort(index)}</div>
            <div className={styles.deviceSensingContent}>
                <img src={getSensing(item.deviceId)} />
                <div className={styles.showUnit}>
                    <label>{data}</label>
                    <img className={styles.dropdownCaret} src={dropdownCaret} />
                </div>
                <div className={styles.deviceSensingUnit}>
                    <div>
                        {getType(item) && Object.keys(getType(item)).map((el, i) => {
                            return (
                                <Fragment key={i}>
                                    {DistinguishTypes(item.deviceId, i) && <span
                                        onClick={() => selectUnit(el)}>{DistinguishTypes(item.deviceId, i)}</span>}
                                </Fragment>
                            )
                        })}
                    </div>
                </div>
            </div>
        </li>
    )
}

export default DeviceSensingItem;
