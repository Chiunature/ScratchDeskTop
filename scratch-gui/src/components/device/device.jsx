import React from 'react';
import classNames from 'classnames';
import styles from './device.css';
const Device = (props) => {
    const { deviceList } = props;
    const rightList = deviceList.slice(0, 4).reverse();
    const leftList = deviceList.slice(4);
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
                                <div className={styles.item} key={index}>
                                    <div>{index === 0 ? 'E' : index === 1 ? 'F' : index === 2 ? 'G' : 'H'}端口: {el.sensing_device}</div>
                                    {Object.keys(el.motor).length > 0 && <div>速度: {el.motor.speed}, 目标速度: {el.motor.aim_speed}, 旋转方向: {el.motor.direction}</div>}
                                    {el.ultrasonic && <div>超声波距离: {el.ultrasonic}mm</div>}
                                    {Object.keys(el.color).length > 0 && <div>颜色: {el.color.rgb}, {el.color.hex}</div>}
                                </div>
                            )
                        })}
                    </div>
                    {/* <div className={styles.midPart}></div> */}
                    <div className={styles.midRight}>
                        {rightList.map((el, index) => {
                            return (
                                <div className={styles.item} key={index}>
                                    <div>{index === 0 ? 'D' : index === 1 ? 'C' : index === 2 ? 'B' : 'A'}端口: {el.sensing_device}</div>
                                    {Object.keys(el.motor).length > 0 && <div>速度: {el.motor.speed}, 目标速度: {el.motor.aim_speed}, 旋转方向: {el.motor.direction}</div>}
                                    {el.ultrasonic && <div>超声波距离: {el.ultrasonic}mm</div>}
                                    {Object.keys(el.color).length > 0 && <div>颜色: {el.color.rgb}, {el.color.hex}</div>}
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