import styles from './generators.css';
import React from "react";
const GenComponent = (props) => {
    return (
        <div className={styles.gen}>
            <textarea className={styles.genTxt} value={props.code} readOnly></textarea>
        </div>
    )
}
export default GenComponent;