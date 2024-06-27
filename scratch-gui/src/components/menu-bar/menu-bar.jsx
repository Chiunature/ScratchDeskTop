import classNames from "classnames";
import { connect } from "react-redux";
import { compose } from "redux";
import { defineMessages, FormattedMessage, injectIntl, intlShape, } from "react-intl";
import PropTypes from "prop-types";
import bindAll from "lodash.bindall";
import bowser from "bowser";
import React from "react";

import VM from "scratch-vm";
import SettingsMenu from './settings-menu.jsx';
import Box from "../box/box.jsx";
import Button from "../button/button.jsx";
import CommunityButton from "./community-button.jsx";
import ShareButton from "./share-button.jsx";
import { ComingSoonTooltip } from "../coming-soon/coming-soon.jsx";
import Divider from "../divider/divider.jsx";
// import LanguageSelector from "../../containers/language-selector.jsx";
// import SaveStatus from "./save-status.jsx";
import ProjectWatcher from "../../containers/project-watcher.jsx";
import MenuBarMenu from "./menu-bar-menu.jsx";
import { MenuItem, MenuSection } from "../menu/menu.jsx";
import ProjectTitleInput from "./project-title-input.jsx";
// import AuthorInfo from "./author-info.jsx";
// import AccountNav from "../../containers/account-nav.jsx";
// import LoginDropdown from "./login-dropdown.jsx";
import SB3Downloader from "../../containers/sb3-downloader.jsx";
import DeletionRestorer from "../../containers/deletion-restorer.jsx";
import TurboMode from "../../containers/turbo-mode.jsx";
import MenuBarHOC from "../../containers/menu-bar-hoc.jsx";
import {
    clearConnectionModalPeripheralName,
    getSerialList,
    setCompleted,
    setConnectionModalPeripheralName,
    setPort,
    setProgress
} from "../../reducers/connection-modal";
import { openCascaderPanelModal, openConnectionModal, openTipsLibrary } from "../../reducers/modals";
import { setGen, setPlayer } from "../../reducers/mode";
import {
    autoUpdateProject,
    getIsShowingProject,
    getIsUpdating,
    manualUpdateProject,
    remixProject,
    requestNewProject,
    saveProjectAsCopy,
} from "../../reducers/project-state";
import {
    aboutMenuOpen,
    accountMenuOpen,
    closeAboutMenu,
    closeAccountMenu,
    closeEditMenu,
    closeFileMenu,
    closeLanguageMenu,
    closeLoginMenu,
    closeSettingsMenu,
    editMenuOpen,
    fileMenuOpen,
    languageMenuOpen,
    loginMenuOpen,
    openAboutMenu,
    openAccountMenu,
    openEditMenu,
    openFileMenu,
    openLanguageMenu,
    openLoginMenu,
    openSettingsMenu,
    settingsMenuOpen
} from "../../reducers/menus";

import collectMetadata from "../../lib/collect-metadata";
import { svgAsDataUri, saveSvgAsPng } from "save-svg-as-png";
import styles from "./menu-bar.css";

// import helpIcon from "../../lib/assets/icon--tutorials.svg";
// import mystuffIcon from "./icon--mystuff.png";
// import profileIcon from "./icon--profile.png";
import remixIcon from "./icon--remix.svg";
import dropdownCaret from "./dropdown-caret.svg";
import aboutIcon from "./icon--about.svg";
import unconnectedIcon from "./icon--unconnected.svg";
import photoIcon from "./icon--photo.svg";
import { ipc as ipc_Renderer, verifyTypeConfig } from 'est-link';
import connectedIcon from "./icon--connected.svg";
import fileSaveIcon from "./icon--file-save.svg";
import genIcon from "./icon--generator.svg";
import fileIcon from './icon--file.svg';
import sharedMessages from "../../lib/shared-messages";
import { showAlertWithTimeout } from "../../reducers/alerts";
import downloadBlob from '../../lib/download-blob';
import { setDeviceCards, viewDeviceCards } from "../../reducers/cards.js";
import { showFileStytem } from "../../reducers/file-stytem.js";
import { projectTitleInitialState, setProjectTitle } from '../../reducers/project-title';
import { HELP_DOCX, HELP_PDF } from "../../config/json/LB_USER.json";
import { HARDWARE, SOFTWARE } from "../../lib/helps/index.js";
import blueToothIcon from "../connection-modal/icons/bluetooth-white.svg";


/* const ariaMessages = defineMessages({
    language: {
        id: "gui.menuBar.LanguageSelector",
        defaultMessage: "language selector",
        description: "accessibility text for the language selection menu",
    },
    tutorials: {
        id: "gui.menuBar.tutorialsLibrary",
        defaultMessage: "Tutorials",
        description: "accessibility text for the tutorials button",
    },
}); */

const saveNowMessage = (
    <FormattedMessage
        defaultMessage="Save now"
        description="Menu bar item for saving now"
        id="gui.menuBar.saveNow"
    />
);
/* const createCopyMessage = (
    <FormattedMessage
        defaultMessage="Save as a copy"
        description="Menu bar item for saving as a copy"
        id="gui.menuBar.saveAsCopy"
    />
); */
const remixMessage = (
    <FormattedMessage
        defaultMessage="Remix"
        description="Menu bar item for remixing"
        id="gui.menuBar.remix"
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


const MenuBarItemTooltip = ({
    children,
    className,
    enable,
    id,
    place = "bottom",
}) => {
    if (enable) {
        return <React.Fragment>{children}</React.Fragment>;
    }
    return (
        <ComingSoonTooltip
            className={classNames(styles.comingSoon, className)}
            place={place}
            tooltipClassName={styles.comingSoonTooltip}
            tooltipId={id}
        >
            {children}
        </ComingSoonTooltip>
    );
};

MenuBarItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    enable: PropTypes.bool,
    id: PropTypes.string,
    place: PropTypes.oneOf(["top", "bottom", "left", "right"]),
};

const MenuItemTooltip = ({ id, isRtl, children, className }) => (
    <ComingSoonTooltip
        className={classNames(styles.comingSoon, className)}
        isRtl={isRtl}
        place={isRtl ? "left" : "right"}
        tooltipClassName={styles.comingSoonTooltip}
        tooltipId={id}
    >
        {children}
    </ComingSoonTooltip>
);

MenuItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string,
    isRtl: PropTypes.bool,
};

const AboutButton = (props) => (
    <Button
        className={classNames(styles.menuBarItem, styles.hoverable)}
        iconClassName={styles.aboutIcon}
        iconSrc={aboutIcon}
        onClick={props.onClick}
    />
);

AboutButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            "handleClickNew",
            "handleClickRemix",
            "handleClickSave",
            "handleClickSaveAsCopy",
            "handleClickSeeCommunity",
            "handleClickShare",
            "handleKeyPress",
            "handleLanguageMouseUp",
            "handleRestoreOption",
            "getSaveToComputerHandler",
            "restoreOptionMessage",
            "handleConnectionMouseUp",
            "handleConnection",
            "handleConnectedSerialPort",
            "handleDisconnect",
            "scanConnection",
            "showDeviceCards",
            "handleClickHome",
            "reUpdateDriver",
            "handleHelp",
            "handleProblem",
            "saveSvg"
        ]);
        this.timer = null;
        this.closeTimer = null;
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress);
        this.scanConnection();
        this.disconnectListen();
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress);
    }

    handleClickHome() {
        this.props.onRequestCloseFile();
        this.props.onShowFileSystem();
    }

    handleClickNew() {
        // if the project is dirty, and user owns the project, we will autosave.
        // but if they are not logged in and can't save, user should consider
        // downloading or logging in first.
        // Note that if user is logged in and editing someone else's project,
        // they'll lose their work.
        const readyToReplaceProject = this.props.confirmReadyToReplaceProject(
            this.props.intl.formatMessage(sharedMessages.replaceProjectWarning)
        );
        this.props.onRequestCloseFile();
        if (readyToReplaceProject) {
            this.props.onClickNew(
                this.props.canSave && this.props.canCreateNew
            );
        }
        this.props.onRequestCloseFile();
    }

    handleClickRemix() {
        this.props.onClickRemix();
        this.props.onRequestCloseFile();
    }

    handleClickSave() {
        this.getSaveToComputerHandler(this.downloadProject.bind(this, sessionStorage.getItem('openPath') === 'undefined'))();
        this.props.onClickSave();
        this.props.onRequestCloseFile();
    }

    handleClickSaveAsCopy() {
        this.props.onClickSaveAsCopy();
        this.props.onRequestCloseFile();
    }

    handleClickSeeCommunity(waitForUpdate) {
        if (this.props.shouldSaveBeforeTransition()) {
            this.props.autoUpdateProject(); // save before transitioning to project page
            waitForUpdate(true); // queue the transition to project page
        } else {
            waitForUpdate(false); // immediately transition to project page
        }
    }

    handleClickShare(waitForUpdate) {
        if (!this.props.isShared) {
            if (this.props.canShare) {
                // save before transitioning to project page
                this.props.onShare();
            }
            if (this.props.canSave) {
                // save before transitioning to project page
                this.props.autoUpdateProject();
                waitForUpdate(true); // queue the transition to project page
            } else {
                waitForUpdate(false); // immediately transition to project page
            }
        }
    }

    handleRestoreOption(restoreFun) {
        return () => {
            restoreFun();
            this.props.onRequestCloseEdit();
        };
    }

    handleKeyPress(event) {
        const modifier = bowser.mac ? event.metaKey : event.ctrlKey;
        const key_s = event.key === "s" || event.key === "S";
        if (modifier && !event.shiftKey && key_s) {
            this.handleClickSave();
            event.preventDefault();
        } else if (modifier && event.shiftKey && key_s) {
            this.getSaveToComputerHandler(this.downloadProject.bind(this))();
            event.preventDefault();
        }
    }

    getSaveToComputerHandler(downloadProjectCallback) {
        return () => {
            this.props.onRequestCloseFile();
            downloadProjectCallback();
            if (this.props.onProjectTelemetryEvent) {
                const metadata = collectMetadata(
                    this.props.vm,
                    this.props.projectTitle,
                    this.props.locale
                );
                this.props.onProjectTelemetryEvent("projectDidSave", metadata);
            }
        };
    }

    handleLanguageMouseUp(e) {
        if (!this.props.languageMenuOpen) {
            this.props.onClickLanguage(e);
        }
    }

    restoreOptionMessage(deletedItem) {
        switch (deletedItem) {
            case "Sprite":
                return (
                    <FormattedMessage
                        defaultMessage="Restore Sprite"
                        description="Menu bar item for restoring the last deleted sprite."
                        id="gui.menuBar.restoreSprite"
                    />
                );
            case "Sound":
                return (
                    <FormattedMessage
                        defaultMessage="Restore Sound"
                        description="Menu bar item for restoring the last deleted sound."
                        id="gui.menuBar.restoreSound"
                    />
                );
            case "Costume":
                return (
                    <FormattedMessage
                        defaultMessage="Restore Costume"
                        description="Menu bar item for restoring the last deleted costume."
                        id="gui.menuBar.restoreCostume"
                    />
                );
            default: {
                return (
                    <FormattedMessage
                        defaultMessage="Restore"
                        description="Menu bar item for restoring the last deleted item in its disabled state." /* eslint-disable-line max-len */
                        id="gui.menuBar.restore"
                    />
                );
            }
        }
    }

    buildAboutMenu(onClickAbout) {
        if (!onClickAbout) {
            // hide the button
            return null;
        }
        if (typeof onClickAbout === "function") {
            // make a button which calls a function
            return <AboutButton onClick={onClickAbout} />;
        }
        // assume it's an array of objects
        // each item must have a 'title' FormattedMessage and a 'handleClick' function
        // generate a menu with items for each object in the array
        return (
            <div
                className={classNames(styles.menuBarItem, styles.hoverable, {
                    [styles.active]: this.props.aboutMenuOpen,
                })}
                onMouseUp={this.props.onRequestOpenAbout}
            >
                <img className={styles.aboutIcon} src={aboutIcon} alt="" />
                <MenuBarMenu
                    className={classNames(styles.menuBarMenu)}
                    open={this.props.aboutMenuOpen}
                    place={this.props.isRtl ? "right" : "left"}
                    onRequestClose={this.props.onRequestCloseAbout}
                >
                    {onClickAbout.map((itemProps) => (
                        <MenuItem
                            key={itemProps.title}
                            isRtl={this.props.isRtl}
                            onClick={this.wrapAboutMenuCallback(
                                itemProps.onClick
                            )}
                        >
                            {itemProps.title}
                        </MenuItem>
                    ))}
                </MenuBarMenu>
            </div>
        );
    }

    wrapAboutMenuCallback(callback) {
        return () => {
            callback();
            this.props.onRequestCloseAbout();
        };
    }

    scanConnection() {
        this.timer = !this.timer && setInterval(() => {
            if (this.props.deviceType && this.props.deviceType !== verifyTypeConfig.SERIALPORT) {
                clearInterval(this.timer);
                this.timer = null;
                return;
            }
            this.handleConnection();
        }, 1500);
    }

    async handleConnection() {
        let userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf(" electron/") > -1) {
            const { result } = await window.myAPI.ipcInvoke(ipc_Renderer.SEND_OR_ON.CONNECTION.GETLIST);
            if (result) {
                clearInterval(this.timer);
                this.timer = null;
                this.handleConnectedSerialPort(result);
            }
        }
    }

    setPortItem(list, type, name) {
        this.props.onSetPort(list[0]);
        this.props.onGetSerialList([...list]);
        this.props.onSetDeviceType(type);
        this.props.onSetConnectionModalPeripheralName(name);
    }

    handleConnectionMouseUp() {
        this.props.onOpenConnectionModal();
    }

    handleConnectedSerialPort(port) {
        if (!port) return;
        window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.CONNECTION.CONNECTED, sendParams: port });
    }

    handleDisconnect(msg) {
        if (this.props.deviceType === verifyTypeConfig.SERIALPORT) {
            this.props.onGetSerialList([]);
        } else {
            this.props.serialList.forEach(el => {
                if (this.props?.port?.id === el.id) {
                    el.checked = false;
                }
            });
        }
        this.props.onClearConnectionModalPeripheralName();
        this.props.onSetProgress(0);
        this.props.onSetCompleted(false);
        this.props.onSetDeviceType(null);
        this.props.onSetDeviceCards({ deviceVisible: false });
        this.props.onSetDeviceObj(null);
        msg.length > 0 && this.props.onShowDisonnectAlert(msg);
        window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.CONNECTION.DISCONNECTED });
        sessionStorage.setItem(' isFirmwareUpdate', 'done');
    }

    disconnectListen() {
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.CONNECTION.CONNECTED,
            callback: (event, arg) => {
                if (arg.res) {
                    clearTimeout(this.closeTimer);
                    this.closeTimer = null;
                    if (!this.props.peripheralName) {
                        this.props.onSetDeviceType(arg.type);
                        this.setPortItem([arg.serial], arg.type, arg.serial.friendlyName);
                        this.props.onShowConnectAlert(arg.msg);
                    }
                } else {
                    this.scanConnection();
                    if (this.props.deviceType === verifyTypeConfig.SERIALPORT) {
                        this.closeTimer = !this.closeTimer && setTimeout(() => {
                            arg.msg.length > 0 && this.handleDisconnect(arg.msg);
                        }, 2000);
                    } else {
                        this.handleDisconnect(arg.msg);
                    }
                }
            },
        });
    }

    showDeviceCards() {
        if (!this.props.peripheralName) {
            this.props.onShowCompletedAlert("selectADeviceFirst");
        } else {
            this.props.onViewDeviceCards();
        }
    }

    async reUpdateDriver() {
        const res = await window.myAPI.ipcInvoke(ipc_Renderer.SEND_OR_ON.DEVICE.CHECK, ipc_Renderer.DRIVER.REUPDATE);
        if (res) {
            this.props.onActivateDeck("install-drivers");
            window.myAPI.setStoreValue('driver', ipc_Renderer.DRIVER.INSTALL);
        }
    }

    handleHelp(type) {
        switch (type) {
            case HARDWARE:
                window.myAPI.getDocxUrl(window.resourcesPath, HELP_PDF);
                break;
            case SOFTWARE:
                window.myAPI.getDocxUrl(window.resourcesPath, HELP_DOCX);
                break;
            default:
                break;
        }
    }

    handleProblem() {
        this.props.onShowQrcode();
    }
    saveSvg() {
        const dom = this.props.workspace.svgBlockCanvas_;
        const name = this.props.projectFilename.slice(0, this.props.projectFilename.lastIndexOf("."));
        saveSvgAsPng(dom, name, { backgroundColor: '#ffffff' });
    }
    
    async screenPrintWorkspace() {
        return await svgAsDataUri(this.props.workspace.svgBlockCanvas_, { backgroundColor: '#ffffff' });
    }

    downloadProject(onlySave) {
        this.props.saveProjectSb3().then(async content => {
            if (this.props.onSaveFinished) {
                this.props.onSaveFinished();
            }
            downloadBlob(this.props.projectFilename, content, onlySave);
            if (onlySave) {
                const filePath = sessionStorage.getItem('openPath');
                filePath && this.props.onShowCompletedAlert("saveNowSuccess");
                filePath && await this.setCacheForSave(filePath);
                return;
            }
            const res = await content.arrayBuffer();
            const filePath = await window.myAPI.ipcInvoke(ipc_Renderer.FILE.SAVE, {
                file: Buffer.from(res),
                filename: this.props.projectFilename
            });
            if (filePath) {
                sessionStorage.setItem('openPath', filePath);
                const newName = filePath.slice(filePath.lastIndexOf('\\') + 1);
                const resultName = newName.slice(0, newName.lastIndexOf('.'));
                this.props.onSetProjectTitle(resultName);
                await this.setCacheForSave(filePath);
            }
        });
    }

    async setCacheForSave(filePath) {
        const imgUrl = await this.screenPrintWorkspace();
        let list = [];
        const data = await window.myAPI.ipcInvoke(ipc_Renderer.WORKER, { type: 'get', key: 'files' });
        if (data) {
            list = [...data];
        }
        let time = window.myAPI.getCurrentTime();
        let timeList = time.split('_');
        timeList[1] = timeList[1].replaceAll('-', ':');
        const obj = {
            fileName: this.props.projectFilename.slice(0, this.props.projectFilename.lastIndexOf('.')),
            filePath: filePath,
            alterTime: timeList.join(' '),
            editable: false,
            checked: false,
            pic_url: imgUrl
        }
        const newList = [obj, ...list];
        let que = {};
        const result = newList.reduce((pre, cur) => {
            que[cur.filePath] ? null : que[cur.filePath] = pre.push(cur);
            return pre;
        }, []);
        await window.myAPI.ipcInvoke(ipc_Renderer.WORKER, { type: 'set', key: 'files', value: result });
    }

    render() {
        const remixButton = (
            <Button
                className={classNames(styles.menuBarButton, styles.remixButton)}
                iconClassName={styles.remixButtonIcon}
                iconSrc={remixIcon}
                onClick={this.handleClickRemix}
            >
                {remixMessage}
            </Button>
        );
        // Show the About button only if we have a handler for it (like in the desktop app)
        // const aboutButton = this.buildAboutMenu(this.props.onClickAbout);
        return (
            <Box className={classNames(this.props.className, styles.menuBar)}>
                <Box className={styles.mainMenu}>
                    <Box className={styles.fileGroup}>
                        {(this.props.canChangeTheme || this.props.canChangeLanguage || this.props.canChangeHelp) && (
                            <SettingsMenu
                                reUpdateDriver={this.reUpdateDriver}
                                handleHelp={this.handleHelp}
                                handleProblem={this.handleProblem}
                                canChangeLanguage={this.props.canChangeLanguage}
                                canChangeTheme={this.props.canChangeTheme}
                                canChangeHelp={this.props.canChangeHelp}
                                isRtl={this.props.isRtl}
                                onRequestClose={this.props.onRequestCloseSettings}
                                onRequestOpen={this.props.onClickSettings}
                                settingsMenuOpen={this.props.settingsMenuOpen}
                                getMainMessage={this.props.getMainMessage}
                            />)}
                        {this.props.canManageFiles && (
                            <div
                                className={classNames(
                                    styles.menuBarItem,
                                    styles.hoverable,
                                    {
                                        [styles.active]:
                                            this.props.fileMenuOpen,
                                    }
                                )}
                                onMouseUp={this.props.onClickFile}
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
                                    open={this.props.fileMenuOpen}
                                    place={this.props.isRtl ? "left" : "right"}
                                    onRequestClose={
                                        this.props.onRequestCloseFile
                                    }
                                >
                                    <MenuSection>
                                        <MenuItem
                                            isRtl={this.props.isRtl}
                                            onClick={this.handleClickHome}
                                        >
                                            {homeMessage}
                                        </MenuItem>
                                    </MenuSection>
                                    <MenuSection>
                                        <MenuItem
                                            isRtl={this.props.isRtl}
                                            onClick={this.handleClickNew}
                                        >
                                            {newProjectMessage}
                                        </MenuItem>
                                        <MenuItem
                                            onClick={
                                                this.handleClickSave
                                            }
                                        >
                                            {saveNowMessage}
                                            <span>（Ctrl+s）</span>
                                        </MenuItem>
                                        <MenuItem
                                            onClick={
                                                this.props
                                                    .onStartSelectingFileUpload
                                            }
                                        >
                                            {this.props.intl.formatMessage(
                                                sharedMessages.loadFromComputerTitle
                                            )}
                                        </MenuItem>
                                        <SB3Downloader>
                                            {(
                                                className
                                            ) => (
                                                <MenuItem
                                                    className={className}
                                                    onClick={this.getSaveToComputerHandler(this.downloadProject.bind(this))}
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
                                    </MenuSection>
                                </MenuBarMenu>
                            </div>
                        )}
                        {/* <div
                            className={classNames(
                                styles.menuBarItem,
                                styles.hoverable,
                                {
                                    [styles.active]: this.props.editMenuOpen,
                                },
                                styles.hide
                            )}
                            onMouseUp={this.props.onClickEdit}
                        >
                            <div className={classNames(styles.editMenu)}>
                                <FormattedMessage
                                    defaultMessage="Edit"
                                    description="Text for edit dropdown menu"
                                    id="gui.menuBar.edit"
                                />
                            </div>
                            <MenuBarMenu
                                className={classNames(styles.menuBarMenu)}
                                open={this.props.editMenuOpen}
                                place={this.props.isRtl ? "left" : "right"}
                                onRequestClose={this.props.onRequestCloseEdit}
                            >
                                <DeletionRestorer>
                                    {(
                                        handleRestore,
                                        { restorable, deletedItem }
                                    ) => (
                                        <MenuItem
                                            className={classNames({
                                                [styles.disabled]: !restorable,
                                            })}
                                            onClick={this.handleRestoreOption(
                                                handleRestore
                                            )}
                                        >
                                            {this.restoreOptionMessage(
                                                deletedItem
                                            )}
                                        </MenuItem>
                                    )}
                                </DeletionRestorer>
                                <MenuSection>
                                    <TurboMode>
                                        {(toggleTurboMode, { turboMode }) => (
                                            <MenuItem onClick={toggleTurboMode}>
                                                {turboMode ? (
                                                    <FormattedMessage
                                                        defaultMessage="Turn off Turbo Mode"
                                                        description="Menu bar item for turning off turbo mode"
                                                        id="gui.menuBar.turboModeOff"
                                                    />
                                                ) : (
                                                    <FormattedMessage
                                                        defaultMessage="Turn on Turbo Mode"
                                                        description="Menu bar item for turning on turbo mode"
                                                        id="gui.menuBar.turboModeOn"
                                                    />
                                                )}
                                            </MenuItem>
                                        )}
                                    </TurboMode>
                                </MenuSection>
                            </MenuBarMenu>
                        </div> */}
                    </Box>
                    {/* <Divider className={classNames(styles.divider)} />
                    <div
                        aria-label={this.props.intl.formatMessage(
                            ariaMessages.tutorials
                        )}
                        className={classNames(
                            styles.menuBarItem,
                            styles.hoverable
                        )}
                        onClick={this.props.onOpenTipLibrary}
                    >
                        <img className={styles.helpIcon} src={helpIcon} />
                        <FormattedMessage {...ariaMessages.tutorials} />
                    </div> */}
                    <Divider className={classNames(styles.divider)} />
                    <div
                        className={classNames(
                            styles.menuBarItem,
                            styles.hoverable,
                            styles.generator
                        )}
                        onMouseUp={this.handleConnectionMouseUp}
                    >
                        {this.props.peripheralName ? (
                            <>
                                <img
                                    className={styles.connectedIcon}
                                    src={connectedIcon}
                                    alt="" />
                                <span className={styles.collapsibleLabel}>{this.props.peripheralName.slice(0, this.props.peripheralName.indexOf('('))}</span>
                            </>
                        ) : (
                            <>
                                <img
                                    className={styles.unconnectedIcon}
                                    src={unconnectedIcon}
                                    alt="" />
                                <span className={styles.collapsibleLabel}><FormattedMessage
                                    defaultMessage="Unconnected"
                                    description="Text for menubar unconnected button"
                                    id="gui.menuBar.noConnection"
                                /></span>
                            </>
                        )}
                    </div>
                    {/* <Divider className={classNames(styles.divider)} /> */}
                    {/* {this.props.canEditTitle ? (
                        <div className={classNames(styles.menuBarItem, styles.growable)}>
                            <MenuBarItemTooltip
                                enable
                                id="title-field"
                            >
                                <ProjectTitleInput
                                    className={classNames(styles.titleFieldGrowable)}
                                />
                            </MenuBarItemTooltip>
                        </div>
                    ) : ((this.props.authorUsername && this.props.authorUsername !== this.props.username) ? (
                        <AuthorInfo
                            className={styles.authorInfo}
                            imageUrl={this.props.authorThumbnailUrl}
                            projectTitle={this.props.projectTitle}
                            userId={this.props.authorId}
                            username={this.props.authorUsername}
                        />
                    ) : null)} */}
                    {/* <div
                        className={classNames(styles.menuBarItem, styles.hide)}
                    >
                        {this.props.canShare ? (
                            (this.props.isShowingProject ||
                                this.props.isUpdating) && (
                                <ProjectWatcher
                                    onDoneUpdating={this.props.onSeeCommunity}
                                >
                                    {(waitForUpdate) => (
                                        <ShareButton
                                            className={styles.menuBarButton}
                                            isShared={this.props.isShared}
                                            onClick={() => {
                                                this.handleClickShare(
                                                    waitForUpdate
                                                );
                                            }}
                                        />
                                    )}
                                </ProjectWatcher>
                            )
                        ) : this.props.showComingSoon ? (
                            <MenuBarItemTooltip id="share-button">
                                <ShareButton className={styles.menuBarButton} />
                            </MenuBarItemTooltip>
                        ) : (
                            []
                        )}
                        {this.props.canRemix ? remixButton : []}
                    </div> */}
                    <div
                        className={classNames(
                            styles.menuBarItem,
                            styles.communityButtonWrapper,
                            styles.hide
                        )}
                    >
                        {this.props.enableCommunity ? (
                            (this.props.isShowingProject ||
                                this.props.isUpdating) && (
                                <ProjectWatcher
                                    onDoneUpdating={this.props.onSeeCommunity}
                                >
                                    {(waitForUpdate) => (
                                        <CommunityButton
                                            className={styles.menuBarButton}
                                            /* eslint-disable react/jsx-no-bind */
                                            onClick={() => {
                                                this.handleClickSeeCommunity(
                                                    waitForUpdate
                                                );
                                            }}
                                        /* eslint-enable react/jsx-no-bind */
                                        />
                                    )}
                                </ProjectWatcher>
                            )
                        ) : this.props.showComingSoon ? (
                            <MenuBarItemTooltip id="community-button">
                                <CommunityButton
                                    className={styles.menuBarButton}
                                />
                            </MenuBarItemTooltip>
                        ) : (
                            []
                        )}
                    </div>
                </Box>
                <Box className={classNames(styles.mainMenuInp)}>
                    <div
                        className={classNames(
                            styles.menuBarItem,
                            styles.growable
                        )}
                    >
                        <MenuBarItemTooltip enable id="title-field">
                            <ProjectTitleInput readOnly={false}
                                className={classNames(
                                    styles.titleFieldGrowable
                                )}
                            />
                            <img className={styles.fileSaveIcon} src={fileSaveIcon}
                                onClick={this.getSaveToComputerHandler(this.downloadProject.bind(this, sessionStorage.getItem('openPath') === 'undefined'))} alt="" />
                        </MenuBarItemTooltip>
                    </div>
                </Box>
                <Box className={classNames(styles.mainMenuTwo)}>
                    {/* <div
                        className={classNames(
                            styles.menuBarItem,
                            styles.hoverable,
                            styles.generator,
                            {
                                [styles.active]: "",
                            }
                        )}
                        onMouseUp={this.handleConnectionMouseUp}
                    >
                        <img className={styles.screenShotLogo} src={blueToothIcon} alt="" />
                        <span className={styles.collapsibleLabel}><FormattedMessage
                            defaultMessage="Bluetooth"
                            description="Bluetooth"
                            id="gui.connection.bluetooth"
                        /></span>
                    </div> */}
                    <div
                        className={classNames(
                            styles.menuBarItem,
                            styles.hoverable,
                            styles.generator,
                            {
                                [styles.active]: "",
                            }
                        )}
                        onClick={this.saveSvg}
                    >
                        <img className={styles.screenShotLogo} src={photoIcon} alt="" />
                    </div>
                    <Divider className={classNames(styles.divider)} />
                    <div
                        className={classNames(
                            styles.menuBarItem,
                            styles.hoverable,
                            styles.generator,
                            {
                                [styles.active]: "",
                            }
                        )}
                        onMouseUp={() => this.props.onOpenCascaderPanelModal()}
                    >
                        <FormattedMessage
                                defaultMessage="Force updates"
                                description="Force updates"
                                id="gui.device.updateSensing"
                            />
                    </div>
                    <div
                        className={classNames(
                            styles.menuBarItem,
                            styles.hoverable,
                            styles.generator,
                            {
                                [styles.active]: "",
                            }
                        )}
                        onClick={this.showDeviceCards}
                    >
                        {this.props.peripheralName ?
                            <img className={styles.connectedIcon} src={connectedIcon} alt="" /> :
                            <img className={styles.unconnectedIcon} src={unconnectedIcon} alt="" />}
                        <span className={styles.collapsibleLabel}><FormattedMessage
                            defaultMessage="Device"
                            description="View device information"
                            id="gui.menuBar.Device"
                        /></span>
                    </div>
                    <div
                        id="menuBarGen"
                        className={classNames(
                            styles.menuBarItem,
                            styles.hoverable,
                            styles.generator,
                            {
                                [styles.active]: "",
                            }
                        )}
                        onClick={() => this.props.onSetGen(this.props.isGen)}
                    >
                        <img className={styles.unconnectedIcon} src={genIcon} alt="" />
                        <span className={styles.collapsibleLabel}><FormattedMessage
                            defaultMessage="Generator"
                            description="Text for menubar Generator button"
                            id="gui.menuBar.Generator"
                        /></span>
                    </div>
                </Box>
                {/* show the proper UI in the account menu, given whether the user is
                logged in, and whether a session is available to log in with */}
                {/* <div
                    className={classNames(styles.accountInfoGroup, styles.hide)}
                >
                    <div className={styles.menuBarItem}>
                        {this.props.canSave && <SaveStatus />}
                    </div>
                    {this.props.sessionExists ? (
                        this.props.username ? (
                            // ************ user is logged in ************
                            <React.Fragment>
                                <a href="/mystuff/">
                                    <div
                                        className={classNames(
                                            styles.menuBarItem,
                                            styles.hoverable,
                                            styles.mystuffButton
                                        )}
                                    >
                                        <img
                                            className={styles.mystuffIcon}
                                            src={mystuffIcon}
                                        />
                                    </div>
                                </a>
                                <AccountNav
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.hoverable,
                                        {
                                            [styles.active]:
                                                this.props.accountMenuOpen,
                                        }
                                    )}
                                    isOpen={this.props.accountMenuOpen}
                                    isRtl={this.props.isRtl}
                                    menuBarMenuClassName={classNames(
                                        styles.menuBarMenu
                                    )}
                                    onClick={this.props.onClickAccount}
                                    onClose={this.props.onRequestCloseAccount}
                                    onLogOut={this.props.onLogOut}
                                />
                            </React.Fragment>
                        ) : (
                            // ********* user not logged in, but a session exists
                            // ********* so they can choose to log in
                            <React.Fragment>
                                <div
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.hoverable
                                    )}
                                    key="join"
                                    onMouseUp={this.props.onOpenRegistration}
                                >
                                    <FormattedMessage
                                        defaultMessage="Join Scratch"
                                        description="Link for creating a Scratch account"
                                        id="gui.menuBar.joinScratch"
                                    />
                                </div>
                                <div
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.hoverable
                                    )}
                                    key="login"
                                    onMouseUp={this.props.onClickLogin}
                                >
                                    <FormattedMessage
                                        defaultMessage="Sign in"
                                        description="Link for signing in to your Scratch account"
                                        id="gui.menuBar.signIn"
                                    />
                                    <LoginDropdown
                                        className={classNames(
                                            styles.menuBarMenu
                                        )}
                                        isOpen={this.props.loginMenuOpen}
                                        isRtl={this.props.isRtl}
                                        renderLogin={this.props.renderLogin}
                                        onClose={this.props.onRequestCloseLogin}
                                    />
                                </div>
                            </React.Fragment>
                        )
                    ) : (
                        // ******** no login session is available, so don't show login stuff
                        <React.Fragment>
                            {this.props.showComingSoon ? (
                                <React.Fragment>
                                    <MenuBarItemTooltip id="mystuff">
                                        <div
                                            className={classNames(
                                                styles.menuBarItem,
                                                styles.hoverable,
                                                styles.mystuffButton
                                            )}
                                        >
                                            <img
                                                className={styles.mystuffIcon}
                                                src={mystuffIcon}
                                            />
                                        </div>
                                    </MenuBarItemTooltip>
                                    <MenuBarItemTooltip
                                        id="account-nav"
                                        place={
                                            this.props.isRtl ? "right" : "left"
                                        }
                                    >
                                        <div
                                            className={classNames(
                                                styles.menuBarItem,
                                                styles.hoverable,
                                                styles.accountNavMenu
                                            )}
                                        >
                                            <img
                                                className={styles.profileIcon}
                                                src={profileIcon}
                                            />
                                            <span>{"cat"}</span>
                                            <img
                                                className={
                                                    styles.dropdownCaretIcon
                                                }
                                                src={dropdownCaret}
                                            />
                                        </div>
                                    </MenuBarItemTooltip>
                                </React.Fragment>
                            ) : (
                                []
                            )}
                        </React.Fragment>
                    )}
                </div> */}

                {/* {aboutButton} */}
            </Box>
        );
    }
}

MenuBar.propTypes = {
    aboutMenuOpen: PropTypes.bool,
    accountMenuOpen: PropTypes.bool,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    autoUpdateProject: PropTypes.func,
    canChangeLanguage: PropTypes.bool,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canManageFiles: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    className: PropTypes.string,
    confirmReadyToReplaceProject: PropTypes.func,
    editMenuOpen: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    fileMenuOpen: PropTypes.bool,
    intl: intlShape,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    isShowingProject: PropTypes.bool,
    isUpdating: PropTypes.bool,
    languageMenuOpen: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    loginMenuOpen: PropTypes.bool,
    logo: PropTypes.string,
    onClickAbout: PropTypes.oneOfType([
        PropTypes.func, // button mode: call this callback when the About button is clicked
        PropTypes.arrayOf(
            // menu mode: list of items in the About menu
            PropTypes.shape({
                title: PropTypes.string, // text for the menu item
                onClick: PropTypes.func, // call this callback when the menu item is clicked
            })
        ),
    ]),
    onClickAccount: PropTypes.func,
    onClickEdit: PropTypes.func,
    onClickFile: PropTypes.func,
    onClickLanguage: PropTypes.func,
    onClickLogin: PropTypes.func,
    onClickLogo: PropTypes.func,
    onClickNew: PropTypes.func,
    onClickRemix: PropTypes.func,
    onClickSave: PropTypes.func,
    onClickSaveAsCopy: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onOpenTipLibrary: PropTypes.func,
    onProjectTelemetryEvent: PropTypes.func,
    onRequestOpenAbout: PropTypes.func,
    onRequestCloseAbout: PropTypes.func,
    onRequestCloseAccount: PropTypes.func,
    onRequestCloseEdit: PropTypes.func,
    onRequestCloseFile: PropTypes.func,
    onRequestCloseLanguage: PropTypes.func,
    onRequestCloseLogin: PropTypes.func,
    onRequestCloseSettings: PropTypes.func,
    onClickSettings: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onShare: PropTypes.func,
    onStartSelectingFileUpload: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    onSetGen: PropTypes.func,
    onViewDeviceCards: PropTypes.func,
    projectTitle: PropTypes.string,
    peripheralName: PropTypes.string,
    deviceId: PropTypes.string,
    renderLogin: PropTypes.func,
    sessionExists: PropTypes.bool,
    settingsMenuOpen: PropTypes.bool,
    shouldSaveBeforeTransition: PropTypes.func,
    showComingSoon: PropTypes.bool,
    userOwnsProject: PropTypes.bool,
    username: PropTypes.string,
    vm: PropTypes.instanceOf(VM).isRequired,
    onShowFileSystem: PropTypes.func
};

MenuBar.defaultProps = {
    logo: '',
    onShare: () => {
    },
};

const getProjectFilename = (curTitle, defaultTitle) => {
    let filenameTitle = curTitle;
    if (!filenameTitle || filenameTitle.length === 0) {
        filenameTitle = defaultTitle;
    }
    return `${filenameTitle.substring(0, 100)}.lbs`;
};

const mapStateToProps = (state, ownProps) => {
    const loadingState = state.scratchGui.projectState.loadingState;
    const user =
        state.session && state.session.session && state.session.session.user;
    return {
        aboutMenuOpen: aboutMenuOpen(state),
        accountMenuOpen: accountMenuOpen(state),
        fileMenuOpen: fileMenuOpen(state),
        editMenuOpen: editMenuOpen(state),
        settingsMenuOpen: settingsMenuOpen(state),
        isRtl: state.locales.isRtl,
        isUpdating: getIsUpdating(loadingState),
        isShowingProject: getIsShowingProject(loadingState),
        languageMenuOpen: languageMenuOpen(state),
        locale: state.locales.locale,
        loginMenuOpen: loginMenuOpen(state),
        projectTitle: state.scratchGui.projectTitle,
        sessionExists:
            state.session && typeof state.session.session !== "undefined",
        username: user ? user.username : null,
        userOwnsProject:
            ownProps.authorUsername &&
            user &&
            ownProps.authorUsername === user.username,
        vm: state.scratchGui.vm,
        isGen: state.scratchGui.mode.isGen,
        peripheralName: state.scratchGui.connectionModal.peripheralName,
        deviceId: state.scratchGui.device.deviceId,
        deviceName: state.scratchGui.device.deviceName,
        deviceType: state.scratchGui.device.deviceType,
        serialList: state.scratchGui.connectionModal.serialList,
        saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm),
        projectFilename: getProjectFilename(state.scratchGui.projectTitle, projectTitleInitialState),
        workspace: state.scratchGui.workspaceMetrics.workspace,
        port: state.scratchGui.connectionModal.port
    };
};

const mapDispatchToProps = (dispatch) => ({
    autoUpdateProject: () => dispatch(autoUpdateProject()),
    onOpenTipLibrary: () => dispatch(openTipsLibrary()),
    onClickAccount: () => dispatch(openAccountMenu()),
    onRequestCloseAccount: () => dispatch(closeAccountMenu()),
    onClickFile: () => dispatch(openFileMenu()),
    onRequestCloseFile: () => dispatch(closeFileMenu()),
    onClickEdit: () => dispatch(openEditMenu()),
    onRequestCloseEdit: () => dispatch(closeEditMenu()),
    onClickLanguage: () => dispatch(openLanguageMenu()),
    onRequestCloseLanguage: () => dispatch(closeLanguageMenu()),
    onClickLogin: () => dispatch(openLoginMenu()),
    onRequestCloseLogin: () => dispatch(closeLoginMenu()),
    onRequestOpenAbout: () => dispatch(openAboutMenu()),
    onRequestCloseAbout: () => dispatch(closeAboutMenu()),
    onRequestCloseSettings: () => dispatch(closeSettingsMenu()),
    onClickSettings: () => dispatch(openSettingsMenu()),
    onClickNew: (needSave) => dispatch(requestNewProject(needSave)),
    onClickRemix: () => dispatch(remixProject()),
    onClickSave: () => dispatch(manualUpdateProject()),
    onClickSaveAsCopy: () => dispatch(saveProjectAsCopy()),
    onSeeCommunity: () => dispatch(setPlayer(true)),
    onSetGen: (isGen) => dispatch(setGen(isGen)),
    onOpenConnectionModal: () => dispatch(openConnectionModal()),
    onDeviceIsEmpty: () => showAlertWithTimeout(dispatch, "selectADeviceFirst"),
    onGetSerialList: (serialList) => dispatch(getSerialList(serialList)),
    onSetPort: (port) => dispatch(setPort(port)),
    onSetConnectionModalPeripheralName: (peripheralName) =>
        dispatch(setConnectionModalPeripheralName(peripheralName)),
    onShowConnectAlert: (item) => showAlertWithTimeout(dispatch, item),
    onShowDisonnectAlert: (item) => showAlertWithTimeout(dispatch, item),
    onClearConnectionModalPeripheralName: () =>
        dispatch(clearConnectionModalPeripheralName()),
    onViewDeviceCards: () => dispatch(viewDeviceCards()),
    onShowCompletedAlert: (item) => showAlertWithTimeout(dispatch, item),
    onSetDeviceCards: (deviceCards) => dispatch(setDeviceCards(deviceCards)),
    onSetCompleted: (completed) => dispatch(setCompleted(completed)),
    onShowFileSystem: () => dispatch(showFileStytem()),
    onSetProgress: (progress) => dispatch(setProgress(progress)),
    onSetProjectTitle: (name) => dispatch(setProjectTitle(name)),
    onOpenCascaderPanelModal: () => dispatch(openCascaderPanelModal())
});

export default compose(
    injectIntl,
    MenuBarHOC,
    connect(mapStateToProps, mapDispatchToProps)
)(MenuBar);
