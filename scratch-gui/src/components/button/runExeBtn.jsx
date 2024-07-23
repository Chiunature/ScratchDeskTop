import React, { useState, useRef, useEffect, useMemo } from "react";
import classNames from 'classnames';
import styles from './button.css';
import ButtonComponent from "./button.jsx";
import Cirle from "./cirle.jsx";
import yesIcon from "./icon--yes.svg";
import startIcon from "./icon--start.svg";
import { ipc as ipc_Renderer } from "est-link";


const RunExeBtn = (props) => {
    const { completed, compile, deviceStatus, onSetCompleted } = props;
    let refObj = useRef();
    let [progress, setProgress] = useState(0);
    let [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        getProgress();
        return () => {
            window.myAPI.delEvents(ipc_Renderer.RETURN.COMMUNICATION.BIN.PROGRESS);
            setIsMounted(false);
        }
    }, [isMounted]);

    let newProgress = useMemo(() => {
        if (progress > 99) {
            window.myAPI.sleep(1000).then(() => {
                setProgress(0);
                onSetCompleted(false);
            });
        }
        return progress;
    }, [progress]);

    function getProgress() {
        window.myAPI.ipcRender({ eventName: ipc_Renderer.RETURN.COMMUNICATION.BIN.PROGRESS, callback: (event, arg) => setProgress(arg) });
    }


    function toggle() {
        if(completed) {
            return;
        }
        setProgress(0);
        compile(true);
    }

    return (
        <div className={styles.selectExeBtnCon} >
            <div className={classNames(styles.selectExeBox, "exe-box")} ref={refObj}>
                <div className={styles.selectExeRound}>
                    <div className={classNames(styles.selectExeBlock, styles.selectExeWrapper, newProgress > 99 ? styles.isCompleteHide : '')}>
                        <div style={{ 'opacity': newProgress > 99 ? '0' : '1' }}>
                            {completed ? <p className={classNames(styles.uploadP)}>{newProgress}%</p> :
                                <ButtonComponent
                                    onClick={toggle}
                                    className={classNames(styles.uploadBtn)}
                                    iconSrc={startIcon}
                                />}
                        </div>
                        <Cirle completed={completed} deviceStatus={deviceStatus} />
                        <img className={newProgress > 99 ? '' : styles.yesBtnSpin} src={yesIcon} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RunExeBtn;
