import React from 'react';
import styles from './device.css';


const DeviceBox = ({ list }) => {

    function getPort(index) {
        switch (index) {
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

    return (
        <>
            {list.map((el, index) => {
                return (
                    <div className={styles.midBox} key={index}>
                        <p>端口: {getPort(el.port)}-{el.sensing_device}</p>
                        {Object.keys(el.motor).length > 0 && <ul className={styles.midUl}>
                            {Object.keys(el.motor).map((item, index) => {
                                return (<li key={index}>
                                    <span>{index === 0 ? '速度' : index === 1 ? '目标速度' : '旋转方向'}</span>
                                    <span>{el.motor[item]}</span>
                                </li>)
                            })}
                        </ul>}
                        {el.ultrasonic && <ul className={styles.midUl}><li><span>距离</span><span>{el.ultrasonic}</span><span>mm</span></li></ul>}
                        {el.touch && <ul className={styles.midUl}><li><span>按键</span><span>{el.touch === 0 ? 'press' : 'unpress'}</span></li></ul>}
                        {Object.keys(el.color).length > 0 && <ul className={styles.midUl}>
                            {Object.keys(el.color).map((item, index) => {
                                return (<li key={index}>
                                    <span>{index === 0 ? 'RGB' : 'HEX'}</span>
                                    <span>{el.color[item]}</span>
                                    <span><div className={styles.col} style={{ 'backgroundColor': el.color[item] }}></div></span>
                                </li>)
                            })}
                        </ul>}
                    </div>
                )
            })}
        </>
    )
}

export default DeviceBox;