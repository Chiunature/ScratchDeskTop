import React, { useState, useMemo, useEffect, Fragment } from "react";
import styles from './device.css';
import dropdownCaret from '../menu-bar/dropdown-caret.svg';


const DeviceSensingItem = ({ item, getPort, getSensing, getType, DistinguishTypes, index }) => {

    let [showData, setShowData] = useState(0);
    let [unit, setUnit] = useState(null);

    useEffect(() => {
        const obj = getType(item);
        if (!obj) return;
        if (!unit) setUnit(Object.keys(obj)[0]);
        setShowData(obj[data]);
    });

    function selectUnit(el) {
        setUnit(el);
    }

    let data = useMemo(() => {
        return unit;
    }, [unit]);

    let newDeviceId = useMemo(() => {
        return item.deviceId;
    }, [item.deviceId]);

    let oldDeviceId = useMemo(() => {
        console.log(newDeviceId);
        setUnit(null);
        return newDeviceId;
    }, [newDeviceId]);

    return (
        <li className={item.deviceId && item.deviceId !== '0' ? '' : styles.hide}>
            <div className={styles.deviceSensingText}>{getPort(index)}</div>
            <div className={styles.deviceSensingContent}>
                <img src={getSensing(item.deviceId)}/>
                <div className={styles.showUnit}>
                    <label>{showData}</label>
                    <img className={styles.dropdownCaret} src={dropdownCaret}/>
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
