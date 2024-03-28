import React from "react";
import styles from './button.css';
import classNames from 'classnames';
import { verifyTypeConfig } from 'est-link';

const Circle = ({ completed, deviceStatus }) => {
    return (
        <div className={classNames(styles.circleBox, completed || deviceStatus === verifyTypeConfig.EST_RUN ? '' : styles.hide)}>
            <div className={classNames(styles.circle1)}></div>
            <div className={classNames(styles.circle2)}></div>
            <div className={classNames(styles.circle3)}></div>
        </div>
    )
}

export default Circle;