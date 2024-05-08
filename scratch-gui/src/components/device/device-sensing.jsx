import React from 'react';
import styles from './device.css';
import colorSensingIcon from 'scratch-blocks/media/color_sensing.svg';
import motorSensingIcon from 'scratch-blocks/media/motor_sensing.svg';
import smallMotorSensingIcon from 'scratch-blocks/media/small_motor_sensing.svg';
import superSoundIcon from 'scratch-blocks/media/super_sound.svg';
import touchPressIcon from 'scratch-blocks/media/touch_press.svg';
import messages from './deviceMsg';
import DeviceSensingItem from './device-sensing-item.jsx';

const DeviceSensing = ({ deviceObj, intl }) => {

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
            case 5:
                return motorSensingIcon;
            case 6:
                return smallMotorSensingIcon;
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
            default:
                return null;
        }
    }

    function DistinguishTypes(deviceId, index) {
        if (!deviceId) return;
        const num = parseInt(deviceId.slice(-1));
        switch (num) {
            case 1:
            case 5:
            case 6:
                return motorData(index);
            case 2:
                return colorData(index);
            default:
                return;
        }
    }

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

    function colorData(num) {
        switch (num) {
            case 0:
                return intl.formatMessage(messages['lightIntensity']);
            case 1:
                return 'R';
            case 2:
                return 'G';
            case 3:
                return 'B';
            case 4:
                return intl.formatMessage(messages['version']);
            default:
                return;
        }
    }

    return (
        <div className={styles.deviceSensingBox}>
            <ul>
                {(deviceObj && deviceObj.deviceList) && deviceObj.deviceList.map((item, index) => {
                    return (<DeviceSensingItem key={index} index={index} item={item} getPort={getPort} getSensing={getSensing} getType={getType} DistinguishTypes={DistinguishTypes} />)
                })}
            </ul>
        </div>
    )
}

export default DeviceSensing;