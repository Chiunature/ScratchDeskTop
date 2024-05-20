import React from 'react';
import styles from './device.css';
import { FormattedMessage } from 'react-intl';

const DeviceMain = ({ messages, deviceObj, intl, peripheralName }) => {
    const { gyrolist, adclist, versionlist } = deviceObj;
    return (
        <>
            <div className={styles.midBox}>
                <p><FormattedMessage
                    defaultMessage="Device"
                    description="View device information"
                    id="gui.menuBar.Device"
                /></p>
                <ul className={styles.midUl}>
                    {peripheralName && <li>
                        <span>{intl.formatMessage(messages['mainName'])}</span>
                        <span>{peripheralName.slice(0, peripheralName.indexOf('('))}</span>
                    </li>}
                    {versionlist?.ver && <li>
                        <span>{intl.formatMessage(messages['version'])}</span>
                        <span>{versionlist.ver}</span>
                    </li>}
                    {adclist?.bat && <li>
                        <span>{intl.formatMessage(messages['electricity'])}</span>
                        <span>{adclist.bat >= 100 ? '100' : adclist.bat}%</span>
                    </li>}
                </ul>
            </div>
            <div className={styles.midBox}>
                <p>{intl.formatMessage(messages['mainControl'])}</p>
                <ul className={styles.midUl}>
                    {gyrolist && Object.keys(gyrolist).length > 0 && Object.keys(gyrolist).map((item, index) => {
                        return (item.indexOf('id') === -1 && <li key={index}>
                            <span>{intl.formatMessage(messages[item])}</span>
                            <span>{gyrolist[item]}</span>
                        </li>)
                    })}
                    {adclist?.sound && <li>
                        <span>{intl.formatMessage(messages['soundIntensity'])}</span>
                        <span>{adclist.sound}</span>
                    </li>}
                </ul>
            </div>
        </>
    )
}

export default DeviceMain;
