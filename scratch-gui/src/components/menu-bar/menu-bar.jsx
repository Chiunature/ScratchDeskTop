import classNames from "classnames";
import { connect } from "react-redux";
import { compose } from "redux";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";
import bindAll from "lodash.bindall";
import debounce from "lodash.debounce";
import bowser from "bowser";
import React from "react";

import VM from "scratch-vm";
import SettingsMenu from "./settings-menu.jsx";
import Box from "../box/box.jsx";
import Button from "../button/button.jsx";
import { ComingSoonTooltip } from "../coming-soon/coming-soon.jsx";
import Divider from "../divider/divider.jsx";
import MenuBarHOC from "../../containers/menu-bar-hoc.jsx";
import {
    clearConnectionModalPeripheralName,
    getSerialList,
    setCompleted,
    setConnectionModalPeripheralName,
    setPort,
} from "../../reducers/connection-modal";
import {
    closeBleListModal,
    openBleListModal,
    openConnectionModal,
    openTipsLibrary,
} from "../../reducers/modals";
import {
    getCode,
    setGen,
    setGeneratorName,
    setPlayer,
} from "../../reducers/mode";
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
    closeGenMenu,
    closeDeviceMenu,
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
    settingsMenuOpen,
    openGenMenu,
    genMenuOpen,
    openDeviceMenu,
    deviceMenuOpen,
} from "../../reducers/menus";

import collectMetadata from "../../lib/collect-metadata";
import { svgAsDataUri, saveSvgAsPng } from "save-svg-as-png";
import styles from "./menu-bar.css";

import aboutIcon from "./icon--about.svg";
import unconnectedIcon from "./icon--unconnected.svg";
import photoIcon from "./icon--photo.svg";
import { ipc as ipc_Renderer, verifyTypeConfig } from "est-link";
import connectedIcon from "./icon--connected.svg";
import foucsUpdateIcon from "./icon--foucsupdate.svg";
import sharedMessages from "../../lib/shared-messages";
import {
    openAutoSave,
    showAlertWithTimeout,
    showFileNotify,
} from "../../reducers/alerts";
import downloadBlob from "../../lib/download-blob";
import {
    setDeviceCards,
    setProgramSel,
    viewDeviceCards,
} from "../../reducers/cards.js";
import { showFileStytem } from "../../reducers/file-stytem.js";
import {
    projectTitleInitialState,
    setProjectTitle,
} from "../../reducers/project-title";
import {
    HELP_SOFT_PDF,
    HELP_FIRM_PDF,
    HELP_SOFT_EN_PDF,
} from "../../config/json/LB_USER.json";
import { HARDWARE, SOFTWARE } from "../../lib/helps/index.js";
import ProjectMenu from "./project-menu.jsx";
import FilesMenu from "./files-menu.jsx";
import FilesSaveNotify from "../alerts/files-save-notify.jsx";
import GeneratorsMenu from "./generators-menu.jsx";
// import DeviceMenu from "./device-menu.jsx"; // 已删除端口数据功能
import blueToothIcon from "../connection-modal/icons/bluetooth-white.svg";

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
            "handleClickSave",
            "handleClickSaveAsCopy",
            "handleKeyPress",
            "getSaveToComputerHandler",
            "handleConnectionMouseUp",
            "handleConnection",
            "handleDisconnect",
            "scanConnection",
            // "showProgramCards", // 已删除端口数据功能
            "handleClickHome",
            "reUpdateDriver",
            "handleHelp",
            "saveSvg",
            "downloadProject",
            "reConnect",
        ]);
        this.timer = null;
        this.closeTimer = null;
        this.keyPress = debounce(this.handleKeyPress, 1000);
    }

    componentDidMount() {
        document.addEventListener("keydown", this.keyPress);
        requestIdleCallback(() => {
            this.scanConnection();
            this.disconnectListen();
        });
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyPress);
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.deviceType === verifyTypeConfig.BLUETOOTH &&
            prevProps.deviceType !== this.props.deviceType
        ) {
            this.scanConnection();
        }
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
            sessionStorage.removeItem("setDefaultStartBlock");
        }
    }

    handleClickSave(isAutoSave) {
        const openPath = sessionStorage.getItem("openPath");
        const onlySave =
            openPath && openPath !== "null" && openPath !== "undefined";
        this.getSaveToComputerHandler(() =>
            this.downloadProject(onlySave, isAutoSave)
        )();
        this.props.onClickSave();
        this.props.onRequestCloseFile();
        this.props.openAutoSave &&
            this.props.showFileNotify &&
            this.props.onShowFileNotify(false);
    }

    handleClickSaveAsCopy() {
        this.props.onClickSaveAsCopy();
        this.props.onRequestCloseFile();
    }

    handleKeyPress(event) {
        event.preventDefault();
        const modifier = bowser.mac ? event.metaKey : event.ctrlKey;
        const key_s = event.key === "s" || event.key === "S";
        const flag = modifier && key_s;
        if (flag && !event.shiftKey) {
            this.handleClickSave();
        } else if (flag && event.shiftKey) {
            this.getSaveToComputerHandler(this.downloadProject)();
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

    scanConnection() {
        this.timer =
            !this.timer &&
            setInterval(() => {
                if (
                    this.props.deviceType &&
                    this.props.deviceType === verifyTypeConfig.BLUETOOTH
                ) {
                    clearInterval(this.timer);
                    this.timer = null;
                    return;
                }
                this.handleConnection();
            }, 3000);
    }

    async handleConnection() {
        let userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf(" electron/") > -1) {
            window.myAPI.ipcRender({
                sendName: ipc_Renderer.SEND_OR_ON.CONNECTION.GETLIST,
                eventName: ipc_Renderer.RETURN.CONNECTION.GETLIST,
                callback: (event, data) => {
                    const { currentPort } = data;
                    if (currentPort) {
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                },
            });
        }
    }

    setPortItem(serial, type) {
        this.props.onSetPort(serial);
        this.props.onGetSerialList([serial]);
        this.props.onSetDeviceType(type);
        this.props.onSetConnectionModalPeripheralName(serial.friendlyName);
    }

    handleConnectionMouseUp(deviceType) {
        if (!this.props.peripheralName) {
            this.props.onSetDeviceType(deviceType);

            deviceType === verifyTypeConfig.BLUETOOTH
                ? this.props.onOpenBleListModal()
                : this.props.onOpenConnectionModal();
        } else {
            if (this.props.deviceType === verifyTypeConfig.SERIALPORT) {
                if (deviceType === verifyTypeConfig.BLUETOOTH) {
                    this.props.onShowCompletedAlert("deviceISConnected");
                    return;
                }

                this.props.onOpenConnectionModal();
            } else {
                this.props.onOpenBleListModal();
            }
        }
    }

    handleDisconnect(msg) {
        this.props.onSetPort(null);
        this.props.onGetSerialList([]);
        this.props.onSetDeviceObj(null);
        this.props.onSetCompleted(false);
        this.props.onSetProgramSel(false);
        this.props.onViewDeviceCards(false);
        this.props.onClearConnectionModalPeripheralName();
        msg.length > 0 && this.props.onShowDisonnectAlert(msg);
        this.props.onSetDeviceStatus(verifyTypeConfig.NO_RUN_APP);
        window.myAPI.ipcRender({
            sendName: ipc_Renderer.SEND_OR_ON.CONNECTION.DISCONNECTED,
        });
    }

    disconnectListen() {
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.CONNECTION.CONNECTED,
            callback: (event, args) => {
                if (args.connectSuccess) {
                    clearTimeout(this.closeTimer);
                    this.closeTimer = null;
                    if (!this.props.peripheralName) {
                        this.props.onSetDeviceType(args.type);
                        this.setPortItem(args.serial, args.type);
                        this.props.onShowConnectAlert(args.msg);
                        this.props.onCloseBleListModal();
                    }
                } else {
                    if (this.props.deviceType === verifyTypeConfig.SERIALPORT) {
                        this.closeTimer =
                            !this.closeTimer &&
                            setTimeout(() => {
                                this.reConnect(args.msg);
                            }, 2000);
                    } else {
                        this.reConnect(args.msg);
                    }
                }
            },
        });
    }

    reConnect(msg) {
        // 重新连接时保持 deviceObj 数据，避免设备信息在连接过程中丢失
        this.props.onSetPort(null);
        this.props.onGetSerialList([]);
        // 注意：不清空 deviceObj，保持设备数据连续性
        this.props.onSetCompleted(false);
        this.props.onSetProgramSel(false);
        this.props.onViewDeviceCards(false);
        this.props.onClearConnectionModalPeripheralName();
        msg.length > 0 && this.props.onShowDisonnectAlert(msg);

        !this.props.bleListVisible && this.scanConnection();
    }

    // showProgramCards() {
    //     if (!this.props.peripheralName) {
    //         this.props.onShowCompletedAlert("selectADeviceFirst");
    //     } else {
    //         this.props.onSetProgramSel(true);
    //     }
    // }
    // 已删除端口数据功能，不再需要此方法

    async reUpdateDriver() {
        /* const res = await window.myAPI.ipcInvoke(ipc_Renderer.SEND_OR_ON.DEVICE.CHECK, ipc_Renderer.DRIVER.REUPDATE);
        if (res) {
            this.props.onActivateDeck("install-drivers");
            window.myAPI.setStoreValue('driver', ipc_Renderer.DRIVER.INSTALL);
        } */
    }

    handleHelp(type) {
        const spath =
            localStorage.getItem("static_path") || window.resourcesPath;
        switch (type) {
            case HARDWARE:
                window.myAPI.getDocxUrl(spath, HELP_FIRM_PDF);
                break;
            case SOFTWARE:
                window.myAPI.getDocxUrl(
                    spath,
                    this.props.locale === "zh-cn"
                        ? HELP_SOFT_PDF
                        : HELP_SOFT_EN_PDF
                );
                break;
            default:
                break;
        }
    }

    saveSvg() {
        const blocks = document.querySelector(
            ".blocklyWorkspace .blocklyBlockCanvas"
        );
        if (blocks.getBBox().height === 0) {
            this.props.onShowCompletedAlert("workspaceEmpty");
        } else {
            const transform = blocks.getAttribute("transform");
            const scale = parseFloat(
                transform.substring(
                    transform.indexOf("scale") + 6,
                    transform.length - 1
                )
            );
            const name = this.props.projectFilename.slice(
                0,
                this.props.projectFilename.lastIndexOf(".")
            );
            saveSvgAsPng(blocks, `${name}.png`, {
                left: blocks.getBBox().x * scale,
                top: blocks.getBBox().y * scale,
                height: blocks.getBBox().height * scale,
                width: blocks.getBBox().width * scale,
                scale: 2 / scale,
                encoderOptions: 1,
            });
        }
    }

    async screenPrintWorkspace() {
        const blocks = document.querySelector(
            ".blocklyWorkspace .blocklyBlockCanvas"
        );
        const transform = blocks.getAttribute("transform");
        const scale = parseFloat(
            transform.substring(
                transform.indexOf("scale") + 6,
                transform.length - 1
            )
        );
        return await svgAsDataUri(blocks, {
            backgroundColor: "#ffffff",
            left: blocks.getBBox().x * scale,
            top: blocks.getBBox().y * scale,
            height: blocks.getBBox().height * scale,
            width: blocks.getBBox().width * scale,
            scale: 2 / scale,
            encoderOptions: 1,
        });
    }

    downloadProject(onlySave, isAutoSave) {
        this.props.saveProjectSb3().then(async (content) => {
            if (this.props.onSaveFinished) {
                this.props.onSaveFinished();
            }

            if (onlySave) {
                downloadBlob(this.props.projectFilename, content, onlySave);
                const filePath = isAutoSave
                    ? sessionStorage.getItem("open-auto-save-path")
                    : sessionStorage.getItem("openPath");

                filePath && (await this.setCacheForSave(filePath));
                if (filePath || isAutoSave) {
                    const displayPath =
                        filePath ||
                        sessionStorage.getItem("open-auto-save-path");
                    const successMessage = displayPath
                        ? `保存成功！\n保存位置：${displayPath}`
                        : "保存成功！";
                    this.props.onShowCompletedAlert("saveNowSuccess", {
                        message: successMessage,
                    });
                }
                return;
            }

            const res = await content.arrayBuffer();
            if (isAutoSave) {
                const { homedir } = await window.myAPI.getHomeDir();
                const path = `${homedir}\\${this.props.projectFilename}`;

                sessionStorage.setItem("open-auto-save-path", path);
                await window.myAPI.writeFiles(path, Buffer.from(res), "");
                this.props.onShowCompletedAlert("saveNowSuccess", {
                    message: `保存成功！\n保存位置：${path}`,
                });
                return;
            }

            const filePath = await window.myAPI.ipcInvoke(
                ipc_Renderer.FILE.SAVE,
                {
                    file: Buffer.from(res),
                    filename: this.props.projectFilename,
                }
            );
            if (filePath) {
                sessionStorage.setItem("openPath", filePath);
                const newName = filePath.slice(filePath.lastIndexOf("\\") + 1);
                const resultName = newName.slice(0, newName.lastIndexOf("."));
                this.props.onSetProjectTitle(resultName);
                await this.setCacheForSave(filePath);
                this.props.onShowCompletedAlert("saveNowSuccess", {
                    message: `保存成功！\n保存位置：${filePath}`,
                });
            }
        });
    }

    async setCacheForSave(filePath) {
        const imgUrl = await this.screenPrintWorkspace();
        let list = [];
        const data = await window.myAPI.ipcInvoke(ipc_Renderer.WORKER, {
            type: "get",
            key: "files",
        });
        if (data) {
            list = [...data];
        }
        let time = window.myAPI.getCurrentTime();
        let timeList = time.split("_");
        timeList[1] = timeList[1].replaceAll("-", ":");
        const obj = {
            fileName: this.props.projectFilename.slice(
                0,
                this.props.projectFilename.lastIndexOf(".")
            ),
            filePath: filePath,
            alterTime: timeList.join(" "),
            editable: false,
            checked: false,
            pic_url: imgUrl,
        };
        const newList = [obj, ...list];
        let que = {};
        const result = newList.reduce((pre, cur) => {
            que[cur.filePath] ? null : (que[cur.filePath] = pre.push(cur));
            return pre;
        }, []);
        await window.myAPI.ipcInvoke(ipc_Renderer.WORKER, {
            type: "set",
            key: "files",
            value: result,
        });
    }

    render() {
        return (
            <>
                <Box
                    className={classNames(this.props.className, styles.menuBar)}
                >
                    <Box className={styles.mainMenu}>
                        <Box className={styles.fileGroup}>
                            {(this.props.canChangeTheme ||
                                this.props.canChangeLanguage ||
                                this.props.canChangeHelp) && (
                                <SettingsMenu
                                    reUpdateDriver={this.reUpdateDriver}
                                    handleHelp={this.handleHelp}
                                    onShowQrcode={this.props.onShowQrcode}
                                    canChangeLanguage={
                                        this.props.canChangeLanguage
                                    }
                                    canChangeTheme={this.props.canChangeTheme}
                                    canChangeHelp={this.props.canChangeHelp}
                                    isRtl={this.props.isRtl}
                                    onRequestClose={
                                        this.props.onRequestCloseSettings
                                    }
                                    onRequestOpen={this.props.onClickSettings}
                                    settingsMenuOpen={
                                        this.props.settingsMenuOpen
                                    }
                                    getMainMessage={this.props.getMainMessage}
                                    intl={this.props.intl}
                                />
                            )}
                            {this.props.canManageFiles && (
                                <FilesMenu
                                    ref={this.filesMenuRef}
                                    fileMenuOpen={this.props.fileMenuOpen}
                                    onClickFile={this.props.onClickFile}
                                    isRtl={this.props.isRtl}
                                    onRequestClose={
                                        this.props.onRequestCloseFile
                                    }
                                    onStartSelectingFileUpload={
                                        this.props.onStartSelectingFileUpload
                                    }
                                    intl={this.props.intl}
                                    autoSaveByBlockType={
                                        this.props.autoSaveByBlockType
                                    }
                                    openAutoSave={this.props.openAutoSave}
                                    onOpenAutoSave={this.props.onOpenAutoSave}
                                    handleClickHome={this.handleClickHome}
                                    handleClickNew={this.handleClickNew}
                                    handleClickSave={this.handleClickSave}
                                    getSaveToComputerHandler={
                                        this.getSaveToComputerHandler
                                    }
                                    downloadProject={this.downloadProject}
                                    handleSetAutoSaveByBlockType={
                                        this.props.handleSetAutoSaveByBlockType
                                    }
                                    onShowFileNotify={
                                        this.props.onShowFileNotify
                                    }
                                    showFileNotify={this.props.showFileNotify}
                                />
                            )}
                        </Box>
                        <Divider className={classNames(styles.divider)} />
                        <Box
                            className={classNames(
                                styles.menuBarItem,
                                styles.hoverable,
                                styles.generator
                            )}
                            onMouseUp={() =>
                                this.handleConnectionMouseUp(
                                    verifyTypeConfig.SERIALPORT
                                )
                            }
                        >
                            <img
                                className={styles.unconnectedIcon}
                                src={
                                    this.props.peripheralName
                                        ? connectedIcon
                                        : unconnectedIcon
                                }
                                alt=""
                            />
                            <span className={styles.collapsibleLabel}>
                                {this.props.peripheralName ? (
                                    this.props.peripheralName.slice(
                                        0,
                                        this.props.peripheralName.indexOf("(")
                                    )
                                ) : (
                                    <FormattedMessage
                                        defaultMessage="Unconnected"
                                        description="Text for menubar unconnected button"
                                        id="gui.menuBar.noConnection"
                                    />
                                )}
                            </span>
                        </Box>
                        {/* <Box
                            className={classNames(
                                styles.menuBarItem,
                                styles.hoverable,
                                styles.generator,
                                {
                                    [styles.active]: "",
                                }
                            )}
                            onMouseUp={() =>
                                this.handleConnectionMouseUp(
                                    verifyTypeConfig.BLUETOOTH
                                )
                            }
                        >
                            <img
                                className={styles.screenShotLogo}
                                src={blueToothIcon}
                                alt=""
                            />
                            <span className={styles.collapsibleLabel}>
                                <FormattedMessage
                                    defaultMessage="Bluetooth"
                                    description="Bluetooth"
                                    id="gui.connection.bluetooth"
                                />
                            </span>
                        </Box> */}
                    </Box>
                    <Box className={classNames(styles.mainMenuInp)}>
                        <ProjectMenu
                            vm={this.props.vm}
                            intl={this.props.intl}
                            MenuBarItemTooltip={MenuBarItemTooltip}
                            downloadProject={this.downloadProject}
                            projectTitle={this.props.projectTitle}
                            onSetProjectTitle={this.props.onSetProjectTitle}
                            saveProjectSb3={this.props.saveProjectSb3}
                            handleClickSave={this.handleClickSave}
                        />
                    </Box>
                    <Box className={classNames(styles.mainMenuTwo)}>
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
                            <img
                                className={styles.screenShotLogo}
                                src={photoIcon}
                                alt=""
                            />
                        </div>
                        <Divider className={classNames(styles.divider)} />
                        <GeneratorsMenu
                            onClickGen={this.props.onClickGen}
                            onRequestCloseGen={this.props.onRequestCloseGen}
                            onSetGen={this.props.onSetGen}
                            isGen={this.props.isGen}
                            isRtl={this.props.isRtl}
                            genMenuOpen={this.props.genMenuOpen}
                            onSetGeneratorName={this.props.onSetGeneratorName}
                            generatorName={this.props.generatorName}
                            onGetCode={this.props.onGetCode}
                            workspace={this.props.workspace}
                        />
                    </Box>
                </Box>
                <FilesSaveNotify
                    showFileNotify={this.props.showFileNotify}
                    onShowFileNotify={this.props.onShowFileNotify}
                />
            </>
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
    onShowFileSystem: PropTypes.func,
};

MenuBar.defaultProps = {
    logo: "",
    onShare: () => {},
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
        genMenuOpen: genMenuOpen(state),
        deviceMenuOpen: deviceMenuOpen(state),
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
        saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(
            state.scratchGui.vm
        ),
        projectFilename: getProjectFilename(
            state.scratchGui.projectTitle,
            projectTitleInitialState
        ),
        workspace: state.scratchGui.workspaceMetrics.workspace,
        port: state.scratchGui.connectionModal.port,
        generatorName: state.scratchGui.mode.generatorName,
        openAutoSave: state.scratchGui.alerts.openAutoSave,
        showFileNotify: state.scratchGui.alerts.showFileNotify,
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
    onOpenBleListModal: () => dispatch(openBleListModal()),
    onDeviceIsEmpty: () => showAlertWithTimeout(dispatch, "selectADeviceFirst"),
    onGetSerialList: (serialList) => dispatch(getSerialList(serialList)),
    onSetPort: (port) => dispatch(setPort(port)),
    onSetConnectionModalPeripheralName: (peripheralName) =>
        dispatch(setConnectionModalPeripheralName(peripheralName)),
    onShowConnectAlert: (item) => showAlertWithTimeout(dispatch, item),
    onShowDisonnectAlert: (item) => showAlertWithTimeout(dispatch, item),
    onClearConnectionModalPeripheralName: () =>
        dispatch(clearConnectionModalPeripheralName()),
    onViewDeviceCards: (flag) => dispatch(viewDeviceCards(flag)),
    onSetProgramSel: (flag) => dispatch(setProgramSel(flag)),
    onShowCompletedAlert: (item, data) =>
        showAlertWithTimeout(dispatch, item, data),
    onSetDeviceCards: (deviceCards) => dispatch(setDeviceCards(deviceCards)),
    onSetCompleted: (completed) => dispatch(setCompleted(completed)),
    onShowFileSystem: () => dispatch(showFileStytem()),
    onSetProjectTitle: (name) => dispatch(setProjectTitle(name)),
    onClickGen: () => dispatch(openGenMenu()),
    onRequestCloseGen: () => dispatch(closeGenMenu()),
    onClickDevice: () => dispatch(openDeviceMenu()),
    onRequestCloseDevice: () => dispatch(closeDeviceMenu()),
    onSetGeneratorName: (generatorName) =>
        dispatch(setGeneratorName(generatorName)),
    onGetCode: (code) => dispatch(getCode(code)),
    onOpenAutoSave: (autoSave) => dispatch(openAutoSave(autoSave)),
    onShowFileNotify: (fileNotify) => dispatch(showFileNotify(fileNotify)),
    onCloseBleListModal: () => dispatch(closeBleListModal()),
});

export default compose(
    injectIntl,
    MenuBarHOC,
    connect(mapStateToProps, mapDispatchToProps)
)(MenuBar);
