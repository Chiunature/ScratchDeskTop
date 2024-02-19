import React, { useState, useRef, useEffect } from "react";
import classNames from 'classnames';
import styles from './button.css';
import ButtonComponent from "./button.jsx";
import Cirle from "./cirle.jsx";
import yesIcon from "./icon--yes.svg";
import startIcon from "./icon--start.svg";



const RunExeBtn = (props) => {
    const { completed, compile, isComplete, progress } = props;
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
                    <div className={classNames(styles.selectExeBlock, styles.selectExeWrapper, isComplete ? styles.isCompleteHide : '')}>
                        <div onClick={toggle} style={{ 'opacity': isComplete ? '0' : '1' }}>
                            {completed ? <p className={classNames(styles.uploadP)}>{progress}%</p> : 
                                <ButtonComponent
                                    onClick={() => compile(true)}
                                    className={classNames(styles.uploadBtn)}
                                    iconSrc={startIcon}
                                />}
                        </div>
                        <Cirle completed={completed} />
                        <img className={isComplete ? '' : styles.yesBtnSpin} src={yesIcon} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RunExeBtn;