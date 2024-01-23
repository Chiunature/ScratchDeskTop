import React from 'react';
import styles from './device.css';
import DeviceBox from './deviceBox.jsx';

const Device = (props) => {
    const { deviceList, gyroList, flashList, adcList, voice } = props.deviceObj;
    const rightList = deviceList.slice(0, 4).reverse();
    const leftList = deviceList.slice(4);

    function preName(index) {
        switch (index) {
            case 0:
                return 'pitch';
            case 1:
                return 'yaw';
            case 2:
                return 'roll';
            default:
                break;
        }
    }

    return (<div className={styles.box}>
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.block}>E</div>
                <div className={styles.block}>F</div>
                <div className={styles.block}>G</div>
                <div className={styles.block}>H</div>
            </div>
            <div className={styles.middle}>
                <div className={styles.midContent}>
                    <div className={styles.midLeft}>
                        <DeviceBox list={leftList} />
                    </div>
                    <div className={styles.midPart}>
                        <div className={styles.midBox}>
                            <p>陀螺仪</p>
                            <ul className={styles.midUl}>
                                {gyroList.length > 0 && gyroList.map((item, index) => {
                                    return (<li key={index}>
                                        <span>{preName(index)}</span>
                                        <span>{item}</span>
                                    </li>)
                                })}
                            </ul>
                        </div>
                        <div className={styles.midBox}>
                            <p>内存</p>
                            <ul className={styles.midUl}>
                                {flashList.length > 0 && flashList.map((item, index) => {
                                    return (<li key={index}>
                                        <span>{index === 0 ? '总容量' : '剩余容量'}</span>
                                        <span>{item}</span>
                                    </li>)
                                })}
                            </ul>
                        </div>
                        <div className={styles.midBox}>
                            <p>电量</p>
                            <ul className={styles.midUl}>
                                <li>
                                    <span>{adcList}</span>
                                    <span>%</span>
                                </li>
                            </ul>
                        </div>
                        <div className={styles.midBox}>
                            <p>声音强度</p>
                            <ul className={styles.midUl}>
                                {voice && <li><span>{voice}</span></li>}
                            </ul>
                        </div>
                    </div>
                    <div className={styles.midRight}>
                        <DeviceBox list={rightList} />
                    </div>
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.block}>D</div>
                <div className={styles.block}>C</div>
                <div className={styles.block}>B</div>
                <div className={styles.block}>A</div>
            </div>
        </div>
    </div>);
}

export default Device;