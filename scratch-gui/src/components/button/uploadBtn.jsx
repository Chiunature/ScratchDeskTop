import React from 'react';
import classNames from 'classnames';
import styles from './button.css';
import startIcon from "./icon--start.svg";
import stopIcon from "./icon--stop.svg";
import ButtonComponent from "./button.jsx";
import SelectExeBtn from "./selectExeBtn.jsx";


const UploadBtn = (props) => {
    const { completed, exeList, selectedExe, isRtl, handleCompile, isComplete, progress, onSetSelectedExe, onSetExelist } = props;
    return (
        <div className={classNames(styles.btnCon)}>
            <div className={classNames(styles.btnBox)}>
                <SelectExeBtn
                    isComplete={isComplete}
                    progress={progress}
                    completed={completed}
                    handleCompile={handleCompile}
                    isRtl={isRtl}
                    onSetSelectedExe={onSetSelectedExe}
                    onSetExelist={onSetExelist}
                    exeList={exeList}
                    selectedExe={selectedExe}
                />
                <ButtonComponent
                    className={classNames(styles.uploadBtn)}
                    iconSrc={startIcon}
                />
                <ButtonComponent
                    className={classNames(styles.stopBtn)}
                    iconSrc={stopIcon}
                />
            </div>
        </div>
    )
}

export default UploadBtn;