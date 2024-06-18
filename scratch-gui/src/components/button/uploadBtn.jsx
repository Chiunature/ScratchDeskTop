import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './button.css';
import stopIcon from "./icon--stop.svg";
import ButtonComponent from "./button.jsx";
import SelectExeBtn from "./selectExeBtn.jsx";
import RunExeBtn from './runExeBtn.jsx';
import { verifyTypeConfig } from 'est-link';

const UploadBtn = (props) => {
    const { completed, exeList, selectedExe, isRtl, handleCompile, onSetSelectedExe, onSetExelist, handleRunApp, deviceStatus, onSetCompleted } = props;

    let [openUpload, setOpenUpload] = useState(true);

    useEffect(() => {
        checkIsOpenUpload();
    }, [openUpload]);

    const compile = (flag) => {
        if (!openUpload) {
            alert('禁止下载');
            return;
        }
        if (completed) {
            return;
        } else {
            handleCompile();
            sessionStorage.setItem('run-app', JSON.stringify(flag));
        }
    }

    const checkIsOpenUpload = async () => {
        try {
            const res = await fetch("https://zsff.drluck.club/ATC/openUpload.json");
            const obj = await res.json();
            setOpenUpload(obj['openUpload']);
        } catch (error) {
            setOpenUpload(true);
        }
    }

    return (
        <div className={classNames(styles.btnCon)}>
            <div className={classNames(styles.btnBox)}>
                <SelectExeBtn
                    compile={() => compile(false)}
                    isRtl={isRtl}
                    exeList={exeList}
                    selectedExe={selectedExe}
                />
                <RunExeBtn
                    deviceStatus={deviceStatus}
                    compile={() => compile(true)}
                    completed={completed}
                    onSetSelectedExe={onSetSelectedExe}
                    onSetExelist={onSetExelist}
                    onSetCompleted={onSetCompleted}
                    handleRunApp={handleRunApp}
                />
                <ButtonComponent
                    onClick={() => handleRunApp(verifyTypeConfig.EST_RUN)}
                    className={classNames(styles.stopBtn, deviceStatus !== verifyTypeConfig.EST_RUN ? styles.stopDisable : '')}
                    disabled={deviceStatus !== verifyTypeConfig.EST_RUN}
                    iconSrc={stopIcon}
                />
            </div>
        </div>
    )
}

export default UploadBtn;