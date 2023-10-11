import styles from './button.css';
import classNames from 'classnames';
import React from "react";
const Circle = (props) => {
    return (
        <div className={classNames(styles.circleBox, props.completed ? '' : styles.hide)}>
            <div className={classNames(styles.circle1)}></div>
            <div className={classNames(styles.circle2)}></div>
            <div className={classNames(styles.circle3)}></div>
        </div>
    )
}

export default Circle;