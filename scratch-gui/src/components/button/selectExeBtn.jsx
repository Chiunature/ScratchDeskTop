import React, { useState, useRef, useEffect } from "react";
import classNames from 'classnames';
import styles from './button.css';
import Matrix from "./matrix.jsx";
import SelectBox from "../../containers/selectBox.jsx";
import Cirle from "./cirle.jsx";
import yesIcon from "./icon--yes.svg";




const SelectExeBtn = (props) => {
    const { completed, exeList, selectedExe, isRtl, handleCompile, isComplete, progress } = props;
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
        if (completed) {
            return;
        } else {
            handleCompile();
        }
    }

    return (
        <>
            <div className={styles.selectExeBtnCon} >
                <div className={classNames(styles.selectExeBox, "exe-box")} ref={refObj}>
                    <div className={styles.selectExeRound} onClick={toggle}>
                        <span className={classNames(styles.selectExeBlock, styles.selectExeWrapper, isComplete ? styles.isCompleteHide: '')}>
                            <div style={{ 'opacity': isComplete ? '0' : '1' }}>{completed ? <p className={classNames(styles.uploadP)}>{progress}%</p> : <Matrix num={selectedExe.num} />}</div>
                            <Cirle completed={completed} />
                            <img className={isComplete ? '' : styles.yesBtnSpin} src={yesIcon} />
                        </span>

                    </div>
                    <SelectBox handleCompile={compile} flag={flag} isRtl={isRtl} exeList={exeList} selectedExe={selectedExe} />
                </div>
            </div>

        </>
    );
}

export default SelectExeBtn;