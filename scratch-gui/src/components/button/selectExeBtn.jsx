import React, { useState, useRef } from "react";
import classNames from 'classnames';
import styles from './button.css';
import Matrix from "./matrix.jsx";
import SelectBox from "../../containers/selectBox.jsx";
// import Cirle from "./cirle.jsx";
// import yesIcon from "./icon--yes.svg";




const SelectExeBtn = (props) => {
    const { exeList, selectedExe, isRtl, compile, onSetSelectedExe } = props;
    let refObj = useRef();
    let [flag, setFlag] = useState(false);
    let [timer, setTimer] = useState(null);

    /* useEffect(() => {
        document.addEventListener('mouseup', handleClick);

        return () => {
            document.removeEventListener('mouseup', handleClick);
        }
    }, [flag]); */

    /* const handleClick = (e) => {
        if (flag && !refObj.current.contains(e.target)) {
            setFlag(false);
        }
    } */

    const toggle = (type) => {
        clearTimeout(timer);
        if (type === 'enter') {
            setFlag(true);
        } else {
            timer = setTimeout(() => {
                setFlag(false);
            }, 500);
            setTimer(timer);
        }
    }

    
    return (
        <div className={styles.selectExeBtnCon} onMouseEnter={() => toggle('enter')} onMouseLeave={() => toggle('leave')}>
            <div className={classNames(styles.selectExeBox, "exe-box")} ref={refObj}>
                <div className={styles.selectExeRound}>
                    <div className={classNames(styles.selectExeBlock, styles.selectExeWrapper)}>
                        <div>
                            <Matrix num={selectedExe.num} />
                        </div>
                    </div>
                </div>
                <SelectBox handleCompile={compile} flag={flag} isRtl={isRtl} exeList={exeList} selectedExe={selectedExe} onSetSelectedExe={onSetSelectedExe} />
            </div>
        </div>
    );
}

export default SelectExeBtn;