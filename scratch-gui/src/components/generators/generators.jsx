import styles from './generators.css';
import React from "react";
import classNames from "classnames";
const GenComponent = (props) => {
    return (
        <div className={styles.gen}>
            <textarea className={classNames(styles.genTxt, props.isGen ? styles.genSlate : '')} value={props.code} readOnly></textarea>
        </div>
    )
}
export default GenComponent;