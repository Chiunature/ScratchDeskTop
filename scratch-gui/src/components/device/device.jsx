import React from 'react';
import classNames from 'classnames';
import styles from './device.css';
const Device = () => {
    return (<div className={styles.box}>
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.block}>E</div>
                <div className={styles.block}>F</div>
                <div className={styles.block}>G</div>
                <div className={styles.block}>H</div>
            </div>
            <div className={styles.middle}>
                <div className={styles.midContent}></div>
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