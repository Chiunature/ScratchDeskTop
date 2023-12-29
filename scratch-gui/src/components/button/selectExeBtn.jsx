import React, { useState } from "react";
import classNames from 'classnames';
import styles from './button.css';
import Matrix from "./matrix.jsx";
import SelectBox from "../../containers/selectBox.jsx";

const SelectExeBtn = (props) => {
    const { exeList, selectedExe, isRtl } = props;
    let [flag, setFlag] = useState(false);

    const toggle = () => {
        setFlag(!flag);
    }

    return (
        <>
            <div className={styles.selectExeBtnCon} onClick={toggle}>
                <div className={classNames(styles.selectExeBox, "exe-box")}>
                    <div className={styles.selectExeLine}></div>
                    <div className={styles.selectExeRound}>
                        {exeList.length > 0 && exeList.map((item, index) => {
                            return (
                                <span key={index} className={classNames(styles.selectExeBlock, selectedExe.num === index + 1 ? styles.selectExeWrapper : '')}>
                                    <Matrix num={item.num} />
                                </span>
                            )
                        })}
                    </div>
                </div>
            </div>
            <SelectBox flag={flag} isRtl={isRtl} exeList={exeList} selectedExe={selectedExe} />
        </>
    );
}

export default SelectExeBtn;