import React from 'react';
import classNames from 'classnames';
import styles from './button.css';
import stopIcon from "./icon--stop.svg";
import ButtonComponent from "./button.jsx";
import SelectExeBtn from "./selectExeBtn.jsx";
import RunExeBtn from './runExeBtn.jsx';
import { verifyTypeConfig } from 'est-link';

const UploadBtn = (props) => {
    const { completed, exeList, selectedExe, isRtl, handleCompile, isComplete, progress, onSetSelectedExe, onSetExelist, handleRunApp } = props;

    const compile = (flag) => {
        if (completed) {
            return;
        } else {
            handleCompile();
            sessionStorage.setItem('run-app', JSON.stringify(flag));
        }
    }

    return (
        <div className={classNames(styles.btnCon)}>
            <div className={classNames(styles.btnBox)}>
                <SelectExeBtn
                    compile={compile}
                    isRtl={isRtl}
                    exeList={exeList}
                    selectedExe={selectedExe}
                />
                <RunExeBtn
                    compile={compile}
                    isComplete={isComplete}
                    progress={progress}
                    completed={completed}
                    onSetSelectedExe={onSetSelectedExe}
                    onSetExelist={onSetExelist}
                />
                <ButtonComponent
                    onClick={() => handleRunApp(verifyTypeConfig.EST_RUN)}
                    className={classNames(styles.stopBtn)}
                    iconSrc={stopIcon}
                />
            </div>
        </div>
    )
}

export default UploadBtn;