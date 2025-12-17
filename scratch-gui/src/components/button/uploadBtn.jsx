import React from "react";
import classNames from "classnames";
import styles from "./button.css";
import stopIcon from "./icon--stop.svg";
import ButtonComponent from "./button.jsx";
import RunExeBtn from "./runExeBtn.jsx";
import { verifyTypeConfig } from "est-link";
import upload from "../button/icon--upload.svg";

const UploadBtn = (props) => {
    const {
        completed,
        handleCompile,
        onSetExelist,
        handleRunApp,
        deviceStatus,
        onSetCompleted,
        intl,
        generatorName,
    } = props;

    const compile = (isRun) => {
        if (completed) {
            return;
        }
        handleCompile(isRun);
    };
    console.log(
        "📊 UploadBtn deviceStatus:",
        deviceStatus,
        "type:",
        typeof deviceStatus
    );
    return (
        <div className={classNames(styles.btnCon)}>
            <div className={classNames(styles.btnBox)}>
                <div className={styles.uploadBtn}>
                    <img
                        className={styles.load}
                        src={upload}
                        alt=""
                        onClick={() => handleCompile(false)}
                    />
                </div>
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
                    onClick={() => {
                        console.log("🛑 停止按钮被点击");
                        console.log("当前 deviceStatus:", deviceStatus);
                        console.log(
                            "verifyTypeConfig.EST_RUN:",
                            verifyTypeConfig.EST_RUN
                        );
                        handleRunApp(verifyTypeConfig.EST_RUN);
                    }}
                    className={classNames(
                        styles.stopBtn,
                        deviceStatus !== verifyTypeConfig.EST_RUN
                            ? styles.stopDisable
                            : ""
                    )}
                    disabled={deviceStatus !== verifyTypeConfig.EST_RUN}
                    iconSrc={stopIcon}
                />
            </div>
        </div>
    );
};

// 移除 React.memo 以确保 deviceStatus 更新时组件能重新渲染
export default UploadBtn;
