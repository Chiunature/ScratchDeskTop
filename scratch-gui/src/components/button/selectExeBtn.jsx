import React, { useState } from "react";
import classNames from 'classnames';
import styles from './button.css';
import Matrix from "./matrix.jsx";
import SelectBox from "../../containers/selectBox.jsx";

const SelectExeBtn = (props) => {
    const { exeList, selectedExe, isRtl, handleCompile } = props;
// const refObj = useRef({});
    let [flag, setFlag] = useState(false);

    const toggle = () => {
        setFlag(!flag);
    }

    return (
        <>
            <div className={styles.selectExeBtnCon} >
                <div className={classNames(styles.selectExeBox, "exe-box")}>
                    <div className={styles.selectExeRound} onClick={toggle}>
                        <span className={classNames(styles.selectExeBlock, styles.selectExeWrapper)}>
                                <Matrix num={selectedExe.num} />
                             </span>
                    </div>
                    <SelectBox handleCompile={handleCompile} flag={flag} isRtl={isRtl} exeList={exeList} selectedExe={selectedExe} />
                </div>
            </div>
            
        </>
    );
}

export default SelectExeBtn;