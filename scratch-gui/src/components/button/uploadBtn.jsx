import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './button.css';
import stopIcon from "./icon--stop.svg";
import ButtonComponent from "./button.jsx";
import SelectExeBtn from "./selectExeBtn.jsx";
import RunExeBtn from './runExeBtn.jsx';
import { verifyTypeConfig } from 'est-link';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    "openUpload": {
        "id": "gui.main.openUpload",
        "description": "Detected that the firmware version is not the latest and has entered maintenance. It cannot be downloaded temporarily",
        "defaultMessage": "Detected that the firmware version is not the latest and has entered maintenance. It cannot be downloaded temporarily"
    },
})

const SoftWareVersion = '1.4.0';

const UploadBtn = (props) => {
    const { completed, exeList, selectedExe, isRtl, handleCompile, onSetSelectedExe, onSetExelist, handleRunApp, deviceStatus, onSetCompleted, intl } = props;

    let [openUpload, setOpenUpload] = useState(true);
    // let [text, setText] = useState('');

    useEffect(() => {
        checkIsOpenUpload();
    }, []);

    const compile = (flag) => {
        if (!openUpload) {
            alert(intl.formatMessage(messages['openUpload']));
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
            if (Array.isArray(obj['version']) && obj['version'].includes(SoftWareVersion)) {
                setOpenUpload(obj['openUpload']);
            } else {
                setOpenUpload(true);
            }
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