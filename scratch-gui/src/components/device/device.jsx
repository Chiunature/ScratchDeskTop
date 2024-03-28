import React from 'react';
import styles from './device.css';
import DeviceBox from './deviceBox.jsx';
import messages from './deviceMsg.js';

const Device = (props) => {
    const { deviceList, gyrolist, flashlist, adclist } = props.deviceObj;
    const rightList = deviceList ? deviceList.slice(4) : [];
    const leftList = deviceList ? deviceList.slice(0, 4) : [];
    let adc = (adclist && adclist.bat) ? (((adclist.bat * 151 / 51 - 7) / 1.4).toFixed(2)) * 100 : null;

    return (<div className={styles.box}>
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.block}>A</div>
                <div className={styles.block}>B</div>
                <div className={styles.block}>C</div>
                <div className={styles.block}>D</div>
            </div>
            <div className={styles.middle}>
                <div className={styles.midContent}>
                    <div className={styles.midLeft}>
                        <DeviceBox list={leftList} intl={props.intl} messages={messages} />
                    </div>
                    <div className={styles.midPart}>
                        {gyrolist && <div className={styles.midBox}>
                            <p>{props.intl.formatMessage(messages['gyroscope'])}</p>
                            <ul className={styles.midUl}>
                                {Object.keys(gyrolist).length > 0 && Object.keys(gyrolist).map((item, index) => {
                                    return (item.indexOf('id') === -1 && <li key={index}>
                                        <span>{props.intl.formatMessage(messages[item])}</span>
                                        <span>{gyrolist[item]}</span>
                                    </li>)
                                })}
                            </ul>
                        </div>}
                        {flashlist && <div className={styles.midBox}>
                            <p>{props.intl.formatMessage(messages['memory'])}</p>
                            <ul className={styles.midUl}>
                                {Object.keys(flashlist).length > 0 && Object.keys(flashlist).map((item, index) => {
                                    return (<li key={index}>
                                        <span>{index === 0 ? props.intl.formatMessage(messages['memoryTotal']) : props.intl.formatMessage(messages['memoryRemaining'])}</span>
                                        <span>{flashlist[item]}</span>
                                        <span>MB</span>
                                    </li>)
                                })}
                            </ul>
                        </div>}
                        {adclist && <div className={styles.midBox}>
                            <p>{props.intl.formatMessage(messages['electricity'])}</p>
                            <ul className={styles.midUl}>
                                {adc && <li>
                                    <span>{adc >= 100 ? '100' : parseInt(adc)}</span>
                                    <span>%</span>
                                </li>}
                            </ul>
                        </div>}
                        {adclist && <div className={styles.midBox}>
                            <p>{props.intl.formatMessage(messages['soundIntensity'])}</p>
                            <ul className={styles.midUl}>
                                {adclist.sound && <li>
                                    <span>{adclist.sound}</span>
                                </li>}
                            </ul>
                        </div>}
                    </div>
                    <div className={styles.midRight}>
                        <DeviceBox list={rightList} intl={props.intl} messages={messages} />
                    </div>
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.block}>E</div>
                <div className={styles.block}>F</div>
                <div className={styles.block}>G</div>
                <div className={styles.block}>H</div>
            </div>
        </div>
    </div>);
}

export default Device;