import React, { Fragment } from 'react';
import styles from './device.css';


const DeviceBox = ({ list, intl, messages }) => {

    function getPort(index) {
        const num = parseInt(index);
        if (isNaN(num)) return;
        switch (num) {
            case 0:
                return 'A';
            case 1:
                return 'B';
            case 2:
                return 'C';
            case 3:
                return 'D';
            case 4:
                return 'E';
            case 5:
                return 'F';
            case 6:
                return 'G';
            case 7:
                return 'H';
            default:
                break;
        }
    }

    /* function getMotorDirection(direction) {
        const num = parseInt(direction);
        if (isNaN(num)) return;
        switch (num) {
            case 1:
                return intl.formatMessage(messages['foreward']);
            case 2:
                return intl.formatMessage(messages['reversal']);
            case 3:
                return intl.formatMessage(messages['brake']);
            default:
                return intl.formatMessage(messages['stop']);
        }
    } */

    function motorData(num) {
        switch (num) {
            case 0:
                return intl.formatMessage(messages['circly']);
            case 1:
                return intl.formatMessage(messages['angle']);
            case 2:
                return intl.formatMessage(messages['actualSpeed']);
            case 3:
                return intl.formatMessage(messages['version']);
            default:
                return;
        }
    }

    return (
        <>
            {list.map((el, index) => {
                return (
                    <div className={styles.midBox} key={index}>
                        <p>{intl.formatMessage(messages['port'])}: {getPort(el.port)}-{intl.formatMessage(messages[el.sensing_device])}</p>
                        {el.motor && Object.keys(el.motor).length > 0 && <ul className={styles.midUl}>
                            {Object.keys(el.motor).map((item, index) => {
                                return (motorData(index) && <li key={index}>
                                    <span>{motorData(index)}</span>
                                    <span>{el.motor[item]}</span>
                                </li>)
                            })}
                        </ul>}
                        {el.ultrasion && <ul className={styles.midUl}><li><span>{intl.formatMessage(messages['distance'])}</span><span>{el.ultrasion}</span><span>cm</span></li></ul>}
                        {el.touch && <ul className={styles.midUl}><li><span>{intl.formatMessage(messages['key'])}</span><span>{el.touch.state}</span></li></ul>}
                        {el.color && Object.keys(el.color).length > 0 && <ul className={styles.midUl}>
                            {Object.keys(el.color).map((item, index) => {
                                return (
                                    <Fragment key={index}>
                                        {(item === 'l' || item === 'rgb') && <li>
                                            <span>{item === 'rgb' ? 'RGB' : intl.formatMessage(messages['lightIntensity'])}</span>
                                            <span>{el.color[item]}</span>
                                            {item === 'rgb' && <span><div className={styles.col} style={{ 'backgroundColor': el.color[item] }}></div></span>}
                                        </li>}
                                    </Fragment>
                                )
                            })}
                        </ul>}
                    </div>
                )
            })}
        </>
    )
}

export default DeviceBox;
