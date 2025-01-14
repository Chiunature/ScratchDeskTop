import React, { useMemo } from 'react';
import styles from './device.css';
import { FormattedMessage } from 'react-intl';

const DeviceMain = ({ messages, deviceObj, intl, peripheralName }) => {

    const mem = useMemo(() => deviceObj?.mem, [deviceObj?.mem]);
    const bat = useMemo(() => deviceObj?.bat, [deviceObj?.bat]);
    const version = useMemo(() => deviceObj?.version, [deviceObj?.version]);
    const sound = useMemo(() => deviceObj?.sound, [deviceObj?.sound]);

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
                    {version && <li>
                        <span>{intl.formatMessage(messages['version'])}</span>
                        <span>{version}</span>
                    </li>}
                    {bat && <li>
                        <span>{intl.formatMessage(messages['electricity'])}</span>
                        <span>{bat >= 100 ? '100' : bat}%</span>
                    </li>}
                </ul>
            </div>
            <div className={styles.midBox}>
                <p>{intl.formatMessage(messages['mainControl'])}</p>
                <ul className={styles.midUl}>
                    {mem && Object.keys(mem).length > 0 && Object.keys(mem).map((item, index) => {
                        return (item.indexOf('id') === -1 && <li key={index}>
                            <span>{intl.formatMessage(messages[item])}</span>
                            <span>{mem[item]}</span>
                        </li>)
                    })}
                    {sound && <li>
                        <span>{intl.formatMessage(messages['soundIntensity'])}</span>
                        <span>{sound}</span>
                    </li>}
                </ul>
            </div>
        </>
    )
}

export default DeviceMain;
