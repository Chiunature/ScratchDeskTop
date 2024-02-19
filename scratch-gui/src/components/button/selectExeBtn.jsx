import React, { useState, useRef, useEffect } from "react";
import classNames from 'classnames';
import styles from './button.css';
import Matrix from "./matrix.jsx";
import SelectBox from "../../containers/selectBox.jsx";
import yesIcon from "./icon--yes.svg";




const SelectExeBtn = (props) => {
    const { exeList, selectedExe, isRtl, compile } = props;
    let refObj = useRef();
    let [flag, setFlag] = useState(false);

    useEffect(() => {
        document.addEventListener('mouseup', handleClick);

        return () => {
            document.removeEventListener('mouseup', handleClick);
        }
    }, [flag]);

    const handleClick = (e) => {
        if (flag && !refObj.current.contains(e.target)) {
            setFlag(false);
        }
    }

    const toggle = () => {
        setFlag(!flag);
    }

    
    return (
        <div className={styles.selectExeBtnCon} >
            <div className={classNames(styles.selectExeBox, "exe-box")} ref={refObj}>
                <div className={styles.selectExeRound}>
                    <div className={classNames(styles.selectExeBlock, styles.selectExeWrapper)}>
                        <div onClick={toggle}>
                            <Matrix num={selectedExe.num} />
                        </div>
                    </div>
                </div>
                <SelectBox handleCompile={compile} flag={flag} isRtl={isRtl} exeList={exeList} selectedExe={selectedExe} />
            </div>
        </div>
    );
}

export default SelectExeBtn;