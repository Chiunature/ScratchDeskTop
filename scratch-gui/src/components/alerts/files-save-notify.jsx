import React, {useMemo} from 'react';
import classNames from "classnames";
import Box from "../box/box.jsx";
import styles from "./alert.css";
import Portal from "./portal.jsx";
import CloseButton from "../close-button/close-button.jsx";
import fileIcon from "../menu-bar/icon--file-save.svg"


function FilesSaveNotify({showFileNotify, onShowFileNotify}) {

    function closeFileNotify() {
        onShowFileNotify(false);
        sessionStorage.setItem('fileNotify', 'close');
    }

    let flag = useMemo(() => {
        if(sessionStorage.getItem('fileNotify')) {
            showFileNotify && onShowFileNotify(false);
            return false;
        }
        return showFileNotify;
    }, [showFileNotify])

    return (
        <Portal>
            <Box className={classNames(styles.fileSaveBox, !flag && styles.hideNotify)}>
                <Box className={styles.fileSaveHeader}>
                    <span>通知:</span>
                    <CloseButton className={styles.alertCloseButton} onClick={closeFileNotify}></CloseButton>
                </Box>
                <Box className={styles.fileSaveBody}>
                    <img src={fileIcon} alt=""/>
                    <div className={styles.fileText}>
                        <span>文件在10分钟后会自动备份</span>
                        <span>保存文件</span>
                    </div>
                </Box>
            </Box>
        </Portal>
    )
}

export default FilesSaveNotify
