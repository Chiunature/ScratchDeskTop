import React, {useEffect, useCallback, useState} from 'react';
import classNames from "classnames";
import Box from "../box/box.jsx";
import MenuBarMenu from "./menu-bar-menu.jsx";
import { MenuItem } from "../menu/menu.jsx";
import SB3Downloader from "../../containers/sb3-downloader.jsx";
import styles from "./menu-bar.css";
import fileIcon from './icon--file.svg';
import dropdownCaret from "./dropdown-caret.svg";
import sharedMessages from "../../lib/shared-messages";
import { FormattedMessage } from "react-intl";
import debounce from "lodash.debounce";

const saveNowMessage = (
    <FormattedMessage
        defaultMessage="Save now"
        description="Menu bar item for saving now"
        id="gui.menuBar.saveNow"
    />
);
const newProjectMessage = (
    <FormattedMessage
        defaultMessage="New"
        description="Menu bar item for creating a new project"
        id="gui.menuBar.new"
    />
);
const homeMessage = (
    <FormattedMessage
        defaultMessage="File homepage"
        description="Menu bar item for Home"
        id="gui.menuBar.home"
    />
);

function FilesMenu({
    fileMenuOpen,
    onClickFile,
    isRtl,
    onRequestClose,
    onStartSelectingFileUpload,
    intl,
    handleClickHome,
    handleClickNew,
    handleClickSave,
    getSaveToComputerHandler,
    downloadProject,
    openAutoSave,
    onOpenAutoSave,
    autoSaveByBlockType,
    handleSetAutoSaveByBlockType,
    onShowFileNotify,
    showFileNotify,
}) {
    let [timer, setTimer] = useState(null);

    useEffect(() => {
        const flag = window.myAPI.getStoreValue('autoSave');
        if (checkNullOrUndefined(flag)) {
            window.myAPI.setStoreValue('autoSave', true);
        } else {
            onOpenAutoSave(flag);
        }
    }, [])

    useEffect(() => {
        if (openAutoSave) {
            window.myAPI.ipcRender({
                eventName: 'auto-save-file-before-close',
                callback: () => {
                    clearTimeout(timer);
                    setTimer(null);
                    handleClickSave(true);
                    window.myAPI.ipcInvoke('return-close-app', openAutoSave);
                }
            })
        } else {
            window.myAPI.delEvents('auto-save-file-before-close');
        }
    }, [openAutoSave])

    useEffect(() => {
        if (autoSaveByBlockType === 'endDrag' || autoSaveByBlockType === 'change') {
            if(openAutoSave) {
                const t = !timer && setTimeout(() => {
                    autoSave();
                    clearTimeout(timer);
                    setTimer(null);
                }, 10 * 60 * 1000);
                t && setTimer(t);

                !showFileNotify && onShowFileNotify(true);
            } else {
                if(!timer) {
                    clearTimeout(timer);
                    setTimer(null);
                }
            }

            handleSetAutoSaveByBlockType(null);

        }
    }, [autoSaveByBlockType])


    function autoSave() {
        if (openAutoSave) {
            setTimeout(() => handleClickSave(true));
        }
    }

    function handleOpenAutoSave() {
        window.myAPI.setStoreValue('autoSave', !openAutoSave);
        onOpenAutoSave(!openAutoSave);
        onRequestClose();
    }

    function checkNullOrUndefined(value) {
        return Object.prototype.toString.call(value) === '[object Undefined]' || Object.prototype.toString.call(value) === '[object Null]';
    }

    return (
        <Box
            className={classNames(
                styles.menuBarItem,
                styles.hoverable,
                {
                    [styles.active]: fileMenuOpen,
                }
            )}
            onMouseUp={onClickFile}
        >
            <img src={fileIcon} alt="" />
            <span className={styles.collapsibleLabel}>
                <FormattedMessage
                    defaultMessage="File"
                    description="Text for file dropdown menu"
                    id="gui.menuBar.file"
                />
            </span>
            <img src={dropdownCaret} alt="" />
            <MenuBarMenu
                className={classNames(styles.menuBarMenu)}
                open={fileMenuOpen}
                place={isRtl ? "left" : "right"}
                onRequestClose={onRequestClose}
            >
                <MenuItem
                    isRtl={isRtl}
                    onClick={handleClickHome}
                >
                    {homeMessage}
                </MenuItem>
                <MenuItem
                    isRtl={isRtl}
                    onClick={handleClickNew}
                >
                    {newProjectMessage}
                </MenuItem>
                <MenuItem
                    onClick={handleClickSave}
                >
                    {saveNowMessage}
                    <span>（Ctrl+s）</span>
                </MenuItem>
                <MenuItem
                    onClick={onStartSelectingFileUpload}
                >
                    {intl.formatMessage(sharedMessages.loadFromComputerTitle)}
                </MenuItem>
                <SB3Downloader>
                    {(
                        className
                    ) => (
                        <MenuItem
                            className={className}
                            onClick={getSaveToComputerHandler(downloadProject)}
                        >
                            <FormattedMessage
                                defaultMessage="Save to your computer"
                                description="Menu bar item for downloading a project to your computer" // eslint-disable-line max-len
                                id="gui.menuBar.downloadToComputer"
                            />
                            <span>（Ctrl+Shift+s）</span>
                        </MenuItem>
                    )}
                </SB3Downloader>
                <MenuItem onClick={handleOpenAutoSave}>
                    {intl.formatMessage(openAutoSave ? sharedMessages.closeAutoSave : sharedMessages.openAutoSave)}
                </MenuItem>
            </MenuBarMenu>
        </Box>
    )
}

export default FilesMenu;
