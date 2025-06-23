import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './button.css';
import stopIcon from "./icon--stop.svg";
import ButtonComponent from "./button.jsx";
import SelectExeBtn from "./selectExeBtn.jsx";
import RunExeBtn from './runExeBtn.jsx';
import { verifyTypeConfig } from 'est-link';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedExe } from '../../reducers/mode';


// import { defineMessages } from 'react-intl';

/* const messages = defineMessages({
    "openUpload": {
        "id": "gui.main.openUpload",
        "description": "Detected that the firmware version is not the latest and has entered maintenance. It cannot be downloaded temporarily",
        "defaultMessage": "Detected that the firmware version is not the latest and has entered maintenance. It cannot be downloaded temporarily"
    },
}) */


const UploadBtn = (props) => {
    const { completed, exeList, isRtl, handleCompile, onSetExelist, handleRunApp, deviceStatus, onSetCompleted, intl, generatorName } = props;

    // let [openUpload, setOpenUpload] = useState(true);
    // let [text, setText] = useState('');
    const selectedExe = useSelector((state) => state.scratchGui.mode.selectedExe);
    const dispatch = useDispatch();

    /* useEffect(() => {
        checkIsOpenUpload();
    }, []); */

    const onSetSelectedExe = (exe) => {
        return dispatch(setSelectedExe(exe));
    }
    const compile = (isRun) => {
        /* if (!openUpload) {
            alert(text);
            window.myAPI.ipcRender({ sendName: 'mainOnFocus' });
            return;
        } */
        if (completed) {
            return;
        }
        handleCompile(isRun);
    }

    /* const checkIsOpenUpload = async () => {
        try {
            const res = await fetch("https://zsff.drluck.club/ATC/openUpload.json", { cache: "no-cache" });
            const obj = await res.json();
            const sversion = await window.myAPI.onGetVersion();
            if (Array.isArray(obj['version']) && obj['version'].includes(sversion)) {
                setOpenUpload(obj['openUpload']);
                setText(obj['text']);
            } else {
                setOpenUpload(true);
            }
        } catch (error) {
            setOpenUpload(true);
        }
    } */

    return (
        <div className={classNames(styles.btnCon)}>
            <div className={classNames(styles.btnBox)}>
                <SelectExeBtn
                    compile={compile}
                    isRtl={isRtl}
                    exeList={exeList}
                    selectedExe={selectedExe}
                    onSetSelectedExe={onSetSelectedExe}
                />
                <RunExeBtn
                    generatorName={generatorName}
                    deviceStatus={deviceStatus}
                    compile={compile}
                    completed={completed}
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

export default React.memo(UploadBtn);