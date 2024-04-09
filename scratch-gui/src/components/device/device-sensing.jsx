import React from 'react';
import styles from './device.css';
import colorSensingIcon from 'scratch-blocks/media/color_sensing.svg';
import motorSensingIcon from 'scratch-blocks/media/motor_sensing.svg';
import superSoundIcon from 'scratch-blocks/media/super_sound.svg';
import touchPressIcon from 'scratch-blocks/media/touch_press.svg';

const DeviceSensing = ({ deviceObj }) => {

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

    function getSensing(deviceId) {
        if (!deviceId) return;
        const num = parseInt(deviceId.slice(-1));
        switch (num) {
            case 1:
                return motorSensingIcon;
            case 2:
                return colorSensingIcon;
            case 3:
                return superSoundIcon;
            case 4:
                return touchPressIcon;
            default:
                break;
        }
    }

    function getData(item) {
        if (!item.deviceId) return;
        const num = parseInt(item.deviceId.slice(-1));
        switch (num) {
            case 1:
                return item.motor.speed;
            case 2:
                return item.color.l;
            case 3:
                return item.ultrasion;
            case 4:
                return item.touch.state;
            default:
                break;
        }
    }


    return (
        <div className={styles.deviceSensingBox}>
            <ul>
                {(deviceObj && deviceObj.deviceList) && deviceObj.deviceList.map((item, index) => {
                    return (
                        <li key={index} className={item.deviceId && item.deviceId !== '0' ? '' : styles.hide}>
                            <div className={styles.deviceSensingText}>{getPort(index)}</div>
                            <div className={styles.deviceSensingContent}>
                                <img src={getSensing(item.deviceId)} />
                                <label>{getData(item)}</label>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default DeviceSensing;