import React from 'react';
import classNames from 'classnames';
import styles from './device.css';
const Device = (props) => {
    const { deviceList, gyroList, flashList, adcList, voice } = props;
    const rightList = deviceList.slice(0, 4).reverse();
    const leftList = deviceList.slice(4);

    function preName(index) {
        switch (index) {
            case 0:
                return 'ax';
            case 1:
                return 'ay';
            case 2:
                return 'az';
            case 3:
                return 'gx';
            case 4:
                return 'gy';
            case 5:
                return 'gz';
            case 6:
                return 'max';
            case 7:
                return 'may';
            case 8:
                return 'maz';
            case 9:
                return 'pitch';
            case 10:
                return 'roll';
            case 11:
                return 'yaw';
            default:
                break;
        }
    }

    function appendName(index) {
        if (index <= 2) {
            return 'G';
        } else if (index > 2 && index <= 5) {
            return '角速度/s';
        } else if (index > 5 && index <= 8) {
            return 'Gs';
        } else {
            return '度';
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
                        {leftList.map((el, index) => {
                            return (
                                <div className={styles.midBox} key={index}>
                                    <p>{index === 0 ? 'E' : index === 1 ? 'F' : index === 2 ? 'G' : 'H'}端口: {el.sensing_device}</p>
                                    {Object.keys(el.motor).length > 0 && <ul className={styles.midUl}>
                                        {Object.keys(el.motor).map((item, index) => {
                                            return (<li key={index}>
                                                <span>{index === 0 ? '速度' : index === 1 ? '目标速度' : '旋转方向'}</span>
                                                <span>{el.motor[item]}</span>
                                            </li>)
                                        })}
                                    </ul>}
                                    {el.ultrasonic && <ul className={styles.midUl}><li><span>距离</span><span>{el.ultrasonic}</span><span>mm</span></li></ul>}
                                    {Object.keys(el.color).length > 0 && <ul className={styles.midUl}>
                                        {Object.keys(el.color).map((item, index) => {
                                            return (<li key={index}>
                                                <span>{index === 0 ? 'RGB' : 'HEX'}</span>
                                                <span>{el.color[item]}</span>
                                                <span><div className={styles.col} style={{'backgroundColor': el.color[item]}}></div></span>
                                            </li>)
                                        })}
                                    </ul>}
                                </div>
                            )
                        })}
                    </div>
                    <div className={styles.midPart}>
                        <div className={styles.midBox}>
                            <p>陀螺仪</p>
                            <ul className={styles.midUl}>
                                {gyroList.length > 0 && gyroList.map((item, index) => {
                                    return (<li key={index}>
                                        <span>{preName(index)}</span>
                                        <span>{item}</span>
                                        <span>{appendName(index)}</span>
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
                            <p>电池电压</p>
                            <ul className={styles.midUl}>
                                {adcList.length > 0 && adcList.map((item, index) => {
                                    return (<li key={index}>
                                        <span>{item}</span>
                                        <span>V</span>
                                    </li>)
                                })}
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
                        {rightList.map((el, index) => {
                            return (
                                <div className={styles.midBox} key={index}>
                                    <p>{index === 0 ? 'D' : index === 1 ? 'C' : index === 2 ? 'B' : 'A'}端口: {el.sensing_device}</p>
                                    {Object.keys(el.motor).length > 0 && <ul className={styles.midUl}>
                                        {Object.keys(el.motor).map((item, index) => {
                                            return (<li key={index}>
                                                <span>{index === 0 ? '速度' : index === 1 ? '目标速度' : '旋转方向'}</span>
                                                <span>{el.motor[item]}</span>
                                            </li>)
                                        })}
                                    </ul>}
                                    {el.ultrasonic && <ul className={styles.midUl}><li><span>距离</span><span>{el.ultrasonic}</span><span>mm</span></li></ul>}
                                    {Object.keys(el.color).length > 0 && <ul className={styles.midUl}>
                                        {Object.keys(el.color).map((item, index) => {
                                            return (<li key={index}>
                                                <span>{index === 0 ? 'RGB' : 'HEX'}</span>
                                                <span>{el.color[item]}</span>
                                                <span><div className={styles.col} style={{'backgroundColor': el.color[item]}}></div></span>
                                            </li>)
                                        })}
                                    </ul>}
                                </div>
                            )
                        })}
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