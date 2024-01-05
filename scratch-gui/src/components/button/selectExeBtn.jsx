import React, { useState, useRef, useEffect } from "react";
import classNames from 'classnames';
import styles from './button.css';
import Matrix from "./matrix.jsx";
import SelectBox from "../../containers/selectBox.jsx";

const SelectExeBtn = (props) => {
    const { completed, exeList, selectedExe, isRtl, handleCompile } = props;
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

    const compile = () => {
        if(completed) {
            return;
        }else {
            handleCompile();
        }
    }

    return (
        <>
            <div className={styles.selectExeBtnCon} >
                <div className={classNames(styles.selectExeBox, "exe-box")} ref={refObj}>
                    <div className={styles.selectExeRound} onClick={toggle}>
                        <span className={classNames(styles.selectExeBlock, styles.selectExeWrapper)}>
                                <Matrix num={selectedExe.num} />
                             </span>
                    </div>
                    <SelectBox handleCompile={compile} flag={flag} isRtl={isRtl} exeList={exeList} selectedExe={selectedExe} />
                </div>
            </div>
            
        </>
    );
}

export default SelectExeBtn;