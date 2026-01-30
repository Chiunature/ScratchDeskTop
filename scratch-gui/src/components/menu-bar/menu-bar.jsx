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
    openCascaderPanelModal,
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
import DeviceMenu from "./device-menu.jsx";
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
            "showDeviceCards",
            "showProgramCards",
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

    showDeviceCards() {
        if (!this.props.peripheralName) {
            this.props.onShowCompletedAlert("selectADeviceFirst");
        } else {
            if (!this.props.completed)
                window.myAPI.ipcRender({
                    sendName: ipc_Renderer.SEND_OR_ON.EXE.FILES,
                    sendParams: { type: "FILE" },
                });
            this.props.onViewDeviceCards();
        }
    }

    showProgramCards() {
        if (!this.props.peripheralName) {
            this.props.onShowCompletedAlert("selectADeviceFirst");
        } else {
            this.props.onSetProgramSel(true);
        }
    }

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

    /**
     * 检查项目中是否有代码块
     * @returns {boolean} 如果至少有一个target包含代码块，返回true
     */
    checkProjectHasBlocks() {
        if (!this.props.vm || !this.props.vm.runtime) {
            return false;
        }
        
        const targets = this.props.vm.runtime.targets || [];
        
        // 检查每个target是否有代码块（排除舞台，因为舞台通常没有代码块）
        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            if (target && target.blocks && target.blocks._blocks) {
                const blockCount = Object.keys(target.blocks._blocks).length;
                if (blockCount > 0) {
                    return true;
                }
            }
        }
        
        return false;
    }

    /**
     * 打印保存时的项目内容日志
     * @param {Blob} content - 保存的项目内容（ZIP格式）
     */
    async printSaveLog(content) {
        console.log('==========================================');
        console.log('【保存项目日志】');
        console.log('==========================================');
        console.log(`保存时间: ${new Date().toLocaleString('zh-CN')}`);
        console.log(`文件名: ${this.props.projectFilename}`);
        console.log('');

        // 打印项目基本信息
        if (this.props.vm && this.props.vm.runtime) {
            const runtime = this.props.vm.runtime;
            const targets = runtime.targets || [];
            
            console.log('【项目基本信息】');
            console.log(`- 角色/精灵数量: ${targets.length}`);
            console.log(`- 扩展列表: ${(runtime.getExtensionIDs && runtime.getExtensionIDs().length) || 0} 个`);
            console.log('');

            // 打印每个target的详细信息
            console.log('【角色/精灵详情】');
            targets.forEach((target, idx) => {
                const targetName = target.isStage ? '舞台' : (target.sprite ? target.sprite.name : `角色${idx + 1}`);
                console.log(`\n  ${idx + 1}. ${targetName}${target.isStage ? ' (Stage)' : ''}`);
                
                // 代码块信息
                const blocks = target.blocks ? target.blocks._blocks : {};
                const blockCount = Object.keys(blocks).length;
                console.log(`    代码块数量: ${blockCount}`);
                
                if (blockCount > 0) {
                    // 统计代码块类型
                    const blockTypes = {};
                    const topLevelBlocks = [];
                    
                    Object.entries(blocks).forEach(([blockId, block]) => {
                        if (Array.isArray(block)) {
                            blockTypes['primitive'] = (blockTypes['primitive'] || 0) + 1;
                        } else if (block.opcode) {
                            const category = block.opcode.split('_')[0];
                            blockTypes[category] = (blockTypes[category] || 0) + 1;
                            if (block.topLevel) {
                                topLevelBlocks.push({
                                    id: blockId,
                                    opcode: block.opcode,
                                    x: block.x,
                                    y: block.y
                                });
                            }
                        }
                    });
                    
                    console.log(`    代码块类型分布:`, blockTypes);
                    console.log(`    顶层脚本数量: ${topLevelBlocks.length}`);
                    if (topLevelBlocks.length > 0) {
                        console.log(`    顶层脚本列表:`);
                        topLevelBlocks.forEach((script, i) => {
                            console.log(`      ${i + 1}. ${script.opcode} (ID: ${script.id.substring(0, 20)}...) at (${script.x}, ${script.y})`);
                        });
                    }
                }
                
                // 变量信息
                const varCount = Object.keys(target.variables || {}).length;
                const listCount = Object.keys(target.lists || {}).length;
                const broadcastCount = Object.keys(target.broadcasts || {}).length;
                console.log(`    变量: ${varCount} 个, 列表: ${listCount} 个, 广播: ${broadcastCount} 个`);
                
                // 造型和声音
                const costumeCount = target.sprite ? (target.sprite.costumes ? target.sprite.costumes.length : 0) : 0;
                const soundCount = target.sprite ? (target.sprite.sounds ? target.sprite.sounds.length : 0) : 0;
                console.log(`    造型: ${costumeCount} 个, 声音: ${soundCount} 个`);
            });
            console.log('');
        }

        // 解析并打印ZIP文件内容
        try {
            console.log('【文件内容格式】');
            const arrayBuffer = await content.arrayBuffer();
            console.log(`- 文件类型: ZIP压缩包 (LBS格式)`);
            console.log(`- 文件大小: ${(arrayBuffer.byteLength / 1024).toFixed(2)} KB`);
            console.log('');
            
            // 尝试动态导入JSZip（如果可用）
            let JSZip;
            try {
                // 在浏览器环境中，尝试使用动态import或require
                if (typeof require !== 'undefined') {
                    JSZip = require('jszip');
                } else {
                    throw new Error('require not available');
                }
            } catch (e) {
                // 如果无法加载JSZip，只打印基本信息
                console.log('  注意: 无法加载JSZip库，跳过ZIP文件结构详细解析');
                console.log('  (文件已成功保存，但无法在浏览器中解析ZIP内容)');
                return;
            }
            
            const zip = await JSZip.loadAsync(arrayBuffer);
            
            console.log('【ZIP文件结构】');
            const fileList = [];
            zip.forEach((relativePath, file) => {
                if (!file.dir) {
                    const size = file._data ? file._data.compressedSize : 0;
                    fileList.push({
                        name: relativePath,
                        size: size
                    });
                }
            });
            
            fileList.forEach(file => {
                const sizeKB = (file.size / 1024).toFixed(2);
                console.log(`  - ${file.name} (${sizeKB} KB)`);
            });
            console.log('');

            // 解析project.json
            const projectJsonFile = zip.file('project.json');
            if (projectJsonFile) {
                console.log('【project.json 内容摘要】');
                const projectJsonContent = await projectJsonFile.async('string');
                const projectData = JSON.parse(projectJsonContent);
                
                console.log(`- JSON大小: ${(projectJsonContent.length / 1024).toFixed(2)} KB`);
                console.log(`- 版本: ${projectData.meta?.semver || 'N/A'}`);
                console.log(`- VM版本: ${projectData.meta?.vm || 'N/A'}`);
                console.log(`- 扩展数量: ${(projectData.extensions || []).length}`);
                console.log(`- 监视器数量: ${(projectData.monitors || []).length}`);
                console.log(`- Target数量: ${(projectData.targets || []).length}`);
                
                // 统计所有代码块
                let totalBlocks = 0;
                (projectData.targets || []).forEach(target => {
                    const blocks = target.blocks || {};
                    totalBlocks += Object.keys(blocks).length;
                });
                console.log(`- 总代码块数: ${totalBlocks}`);
                console.log('');
                
                // 打印JSON结构（简化版）
                console.log('【JSON结构】');
                console.log(JSON.stringify({
                    meta: projectData.meta,
                    extensions: projectData.extensions,
                    monitors: projectData.monitors?.length || 0,
                    targets: projectData.targets?.map(t => ({
                        name: t.name,
                        isStage: t.isStage,
                        blocksCount: Object.keys(t.blocks || {}).length,
                        variablesCount: Object.keys(t.variables || {}).length,
                        costumesCount: (t.costumes || []).length,
                        soundsCount: (t.sounds || []).length
                    }))
                }, null, 2));
            }
        } catch (error) {
            console.error('解析文件内容时出错:', error);
        }
        
        console.log('==========================================');
        console.log('【保存日志结束】');
        console.log('==========================================\n');
    }

    downloadProject(onlySave, isAutoSave) {
        // 检查代码块是否存在
        const hasBlocks = this.checkProjectHasBlocks();
        if (!hasBlocks) {
            // 如果没有代码块，询问用户是否继续保存
            const message = this.props.intl.formatMessage({
                id: 'menuBar.saveWithoutBlocks',
                defaultMessage: '警告：当前项目没有代码块。保存的项目将不包含任何代码逻辑。是否继续保存？'
            });
            const shouldContinue = confirm(message); // eslint-disable-line no-alert
            if (!shouldContinue) {
                // 用户取消保存
                return;
            }
        }
        
        this.props.saveProjectSb3().then(async (content) => {
            // 打印保存日志
            await this.printSaveLog(content);
            
            if (this.props.onSaveFinished) {
                this.props.onSaveFinished();
            }

            // 有保存过
            if (onlySave) {
                downloadBlob(this.props.projectFilename, content, onlySave);
                const filePath = isAutoSave
                    ? sessionStorage.getItem("open-auto-save-path")
                    : sessionStorage.getItem("openPath");
                filePath && (await this.setCacheForSave(filePath));
                (filePath || isAutoSave) &&
                    this.props.onShowCompletedAlert("saveNowSuccess");
                //await setProgramList(this.props.projectFilename, filePath, null, content);
                return;
            }

            // 没有保存过
            const res = await content.arrayBuffer();
            if (isAutoSave) {
                const { homedir } = await window.myAPI.getHomeDir();
                const path = `${homedir}\\${this.props.projectFilename}`;
                sessionStorage.setItem("open-auto-save-path", path);
                await window.myAPI.writeFiles(path, Buffer.from(res), "");
                this.props.onShowCompletedAlert("saveNowSuccess");
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
                // await setProgramList(resultName, filePath, null, content);
                await this.setCacheForSave(filePath);
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
                        <Box
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
                        </Box>
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
                        <DeviceMenu
                            peripheralName={this.props.peripheralName}
                            onClickDevice={this.props.onClickDevice}
                            onRequestCloseDevice={
                                this.props.onRequestCloseDevice
                            }
                            isRtl={this.props.isRtl}
                            deviceMenuOpen={this.props.deviceMenuOpen}
                            showDeviceCards={this.showDeviceCards}
                            showProgramCards={this.showProgramCards}
                        />
                        <div
                            className={classNames(
                                styles.menuBarItem,
                                styles.hoverable,
                                styles.generator,
                                {
                                    [styles.active]: "",
                                }
                            )}
                            onMouseUp={() =>
                                this.props.onOpenCascaderPanelModal()
                            }
                        >
                            <img
                                className={styles.unconnectedIcon}
                                src={foucsUpdateIcon}
                                alt=""
                            />
                            <span className={styles.collapsibleLabel}>
                                <FormattedMessage
                                    defaultMessage="Force updates"
                                    description="Force updates"
                                    id="gui.device.updateSensing"
                                />
                            </span>
                        </div>
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
    return `${filenameTitle.substring(0, 100)}.newai`;
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
    onShowCompletedAlert: (item) => showAlertWithTimeout(dispatch, item),
    onSetDeviceCards: (deviceCards) => dispatch(setDeviceCards(deviceCards)),
    onSetCompleted: (completed) => dispatch(setCompleted(completed)),
    onShowFileSystem: () => dispatch(showFileStytem()),
    onSetProjectTitle: (name) => dispatch(setProjectTitle(name)),
    onOpenCascaderPanelModal: () => dispatch(openCascaderPanelModal()),
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
