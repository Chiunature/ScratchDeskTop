import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import ReactModal from "react-modal";
import VM from "scratch-vm";
import ScratchBlocks from "scratch-blocks";
import { injectIntl, intlShape } from "react-intl";
import extensionLibraryContent from "../lib/libraries/extensions/index.jsx";
import ErrorBoundaryHOC from "../lib/error-boundary-hoc.jsx";
import { getIsError, getIsShowingProject } from "../reducers/project-state";
import {
    activateTab,
    BLOCKS_TAB_INDEX,
    COSTUMES_TAB_INDEX,
    SOUNDS_TAB_INDEX,
} from "../reducers/editor-tab";

import {
    closeCostumeLibrary,
    closeBackdropLibrary,
    closeTelemetryModal,
    openExtensionLibrary,
    openConnectionModal,
} from "../reducers/modals";

import FontLoaderHOC from "../lib/font-loader-hoc.jsx";
import LocalizationHOC from "../lib/localization-hoc.jsx";
import SBFileUploaderHOC from "../lib/sb-file-uploader-hoc.jsx";
import ProjectFetcherHOC from "../lib/project-fetcher-hoc.jsx";
import TitledHOC from "../lib/titled-hoc.jsx";
import ProjectSaverHOC from "../lib/project-saver-hoc.jsx";
import QueryParserHOC from "../lib/query-parser-hoc.jsx";
import storage from "../lib/storage";
import vmListenerHOC from "../lib/vm-listener-hoc.jsx";
import vmManagerHOC from "../lib/vm-manager-hoc.jsx";
import cloudManagerHOC from "../lib/cloud-manager-hoc.jsx";
import { ipc as ipc_Renderer, verifyTypeConfig, deviceIdMap } from "est-link";
import GUIComponent from "../components/gui/gui.jsx";
import { setIsScratchDesktop } from "../lib/isScratchDesktop.js";
import {
    setGen,
    setAiChat,
    setExelistWithPersist,
    setSelectedExeWithPersist,
} from "../reducers/mode.js";
import {
    selectVm,
    selectActiveTabIndex,
    selectAlertsVisible,
    selectUpinVisible,
    selectUpinMsg,
    selectBackdropLibraryVisible,
    selectCostumeLibraryVisible,
    selectConnectionModalVisible,
    selectBleListVisible,
    selectLoadingProjectVisible,
    selectTelemetryModalVisible,
    selectTipsLibraryVisible,
    selectCascaderPanelVisible,
    selectCardsVisible,
    selectDeviceCardsVisible,
    selectDeviceCardsDragging,
    selectProgramSel,
    selectIsFullScreen,
    selectIsPlayerOnly,
    selectIsGen,
    selectIsAiChat,
    selectCode,
    selectCompileList,
    selectBufferList,
    selectMatchMyBlock,
    selectMsgTaskBlock,
    selectExeList,
    selectSelectedExe,
    selectGeneratorName,
    selectPeripheralName,
    selectCompleted,
    selectConnectionVersion,
    selectSoundslist,
    selectDeviceObj,
    selectDeviceStatus,
    selectDeviceType,
    selectCurrentMAC,
    selectWorkspace,
    selectShowFileStytem,
    selectUpdateObj,
    selectLoadingState,
    selectProjectId,
    selectProjectError,
    selectStage,
    selectEditingTarget,
} from "../selectors";
import {
    setCompleted,
    setSourceCompleted,
    setVersion,
    setIsConnectedSerial,
} from "../reducers/connection-modal.js";
import Compile from "../utils/compileGcc.js";
import {
    showAlertWithTimeout,
    showQrcode,
    showUpinThunk,
} from "../reducers/alerts";
import {
    activateDeck,
    setProgramSel,
    viewDeviceCards,
} from "../reducers/cards.js";
import bindAll from "lodash.bindall";
import {
    setCurrentMAC,
    setDeviceObj,
    setDeviceStatus,
} from "../reducers/device.js";
import { setTipsUpdateObj } from "../reducers/tips.js";
import TipsForUpdate from "../components/alerts/tipsForUpdate.jsx";
import getMainMsg from "../lib/alerts/message.js";
import debounce from "lodash.debounce";
import { PYTHON } from "../config/json/generators.json";
import { handleUploadPython } from "../lib/generator/python/index.js";
import { FIREWARE_VERSION } from "../config/json/LB_FWLIB.json";
class GUI extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, ["handleCompile", "handleRunApp", "getMainMessage"]);
        this.handleUploadClick = debounce(this.handleCompile, 300, {
            leading: false,
            trailing: true,
        });
        this.mainMsg = getMainMsg(props.intl);
        this.compile = new Compile();
    }

    componentDidMount() {
        setIsScratchDesktop(this.props.isScratchDesktop);
        this.props.onStorageInit(storage);
        this.props.onVmInit(this.props.vm);
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf("electron/") > -1) {
            requestIdleCallback(
                () => {
                    this.getMainMessage();
                    this.downloadSuccess();
                    this.downloadSource();
                    this.getFirmwareFiles();
                    this.watchDevice();
                    // window.myAPI.ipcInvoke(ipc_Renderer.SEND_OR_ON.SET_STATIC_PATH).then(window.myAPI.commendMake);
                    // window.myAPI.onUpdate((_event, info) => this.props.onSetTipsUpdate(info));
                },
                { timeout: 500 }
            );
        }
    }
    componentDidUpdate(prevProps) {
        if (
            this.props.projectId !== prevProps.projectId &&
            this.props.projectId !== null
        ) {
            this.props.onUpdateProjectId(this.props.projectId);
        }
        if (this.props.isShowingProject && !prevProps.isShowingProject) {
            // this only notifies container when a project changes from not yet loaded to loaded
            // At this time the project view in www doesn't need to know when a project is unloaded
            this.props.onProjectLoaded();
        }
        if (
            !this.props.peripheralName &&
            this.props.peripheralName !== prevProps.peripheralName
        ) {
            this.props.onSetCurrentMAC(null);
        }
    }
    async componentWillUnmount() {
        window.myAPI.delEvents();
    }

    async getMainMessage() {
        await window.myAPI.ipcInvoke(ipc_Renderer.SEND_OR_ON.GETMAINMSG, {
            msg: this.mainMsg,
            autoUpdate: false,
        });
    }

    /**
     * 检查并更新积木块中的电机/设备图标
     * 根据当前连接的设备更新所有 FieldMotor 实例的显示
     */
    blocksMotorCheck() {
        if (!this.props.deviceObj) return;

        let FieldMotor, FieldCombinedMotor;
        this.proxyMotor(
            FieldMotor,
            "FieldMotor",
            this.props.deviceObj.deviceList
        );
        this.proxyMotor(
            FieldCombinedMotor,
            "FieldCombinedMotor",
            this.props.deviceObj.deviceList
        );
    }

    getFirmwareFiles() {
        //获取主机文件监听
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.EXE.FILES,
            callback: (event, arg) => {
                const list = arg
                    .split("/")
                    .filter((item) => /(\.py|\.bin|\.o)/.test(item));
                const exeList = list.map((el, index) => {
                    const current = el.indexOf(".");
                    return {
                        path: el,
                        name: el.replace(/(\.py|\.bin|\.o)/, ""),
                        num: el.slice(0, current),
                        checked: index === 0,
                        index,
                    };
                });
                const oldList = window.myAPI.getStoreValue("exeList");
                const newList = _compareOldList(oldList, [...exeList]);
                this.props.onSetExelist(newList);
            },
        });
        function _compareOldList(oldList, newList) {
            if (!oldList) return newList;
            let list = [],
                i = 0;
            let oldQue = JSON.parse(JSON.stringify(JSON.parse(oldList)));
            if (oldQue.length === 0) return newList;
            while (newList.length > i) {
                const newItem = newList[i];
                if (oldQue.length > 0) {
                    const oldItem = oldQue.shift();
                    if (
                        oldItem.num === newItem.num &&
                        oldItem.name === newItem.name
                    ) {
                        list.push(newItem);
                        i++;
                        continue;
                    } else if (
                        oldItem.num === newItem.num &&
                        oldItem.name !== newItem.name
                    ) {
                        list.push(oldItem);
                        i++;
                        continue;
                    }
                }
                list.push(newItem);
                i++;
            }
            return list;
        }
    }

    //下载资源监听
    downloadSource() {
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.COMMUNICATION.SOURCE.CONPLETED,
            callback: async (event, arg) => {
                this.props.onSetSourceCompleted(false);
                this.props.onShowCompletedAlert(arg.msg);
            },
        });
    }

    //下载成功监听
    downloadSuccess() {
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.COMMUNICATION.BIN.CONPLETED,
            callback: (event, arg) => {
                if (arg.errMsg) {
                    const spath =
                        localStorage.getItem("static_path") ||
                        window.resourcesPath;
                    window.myAPI.handlerError(arg.errMsg, spath);
                }

                arg?.msg && this.props.onShowCompletedAlert(arg.msg);

                if (!arg.result) {
                    this.props.onSetCompleted(false);
                    this.props.onSetSourceCompleted(false);
                    // sessionStorage.setItem('run-app', verifyTypeConfig.NO_RUN_APP);
                }
            },
        });
    }

    /**
     * 更新 FieldMotor 的端口设备列表
     * 通过 Proxy 机制更新所有 FieldMotor 实例的图标显示
     * @param {Object} proxyVal - Proxy 对象
     * @param {string} type - 字段类型（如 "FieldMotor"）
     * @param {Array} data - 设备数据列表
     */
    proxyMotor(proxyVal, type, data) {
        if (!ScratchBlocks[type].proxy) {
            return;
        }

        proxyVal = ScratchBlocks[type].proxy();
        const newList = data.map((el) => el.sensing_device);

        // 比较新旧值,避免不必要的更新
        const oldList = proxyVal.portList || [];
        const isSame =
            Array.isArray(oldList) &&
            Array.isArray(newList) &&
            oldList.length === newList.length &&
            oldList.every((val, idx) => val === newList[idx]);

        // 只有值不同时才更新
        if (!isSame) {
            proxyVal.portList = [...newList];
        }
    }

    //开启监听
    watchDevice() {
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.DEVICE.WATCH,
            callback: (e, newDeviceObj) => {
                // console.log(
                //     "📥 GUI接收设备数据:",
                //     JSON.stringify(newDeviceObj, null, 2)
                // );
                const {
                    deviceObj,
                    version,
                    completed,
                    dragging,
                    deviceType,
                    currentMAC,
                    onSetDeviceStatus,
                    onSetVersion,
                    onSetDeviceObj,
                } = this.props;
                if (completed || dragging) {
                    return;
                }
                // 设备数据为空（断开或未上报）时清空 version/deviceObj，便于 UI 显示未连接/需升级
                if (!newDeviceObj) {
                    if (version != null || deviceObj != null) {
                        if (onSetVersion) onSetVersion(null);
                        if (onSetDeviceObj) onSetDeviceObj(null);
                    }
                    return;
                }

                if (deviceObj?.WillAiState === newDeviceObj?.WillAiState) {
                    onSetDeviceStatus(newDeviceObj.WillAiState);
                }

                if (version !== newDeviceObj?.version) {
                    onSetVersion(newDeviceObj.version);
                }

                if (
                    deviceType === "serialport" &&
                    !currentMAC &&
                    newDeviceObj?.MAC
                ) {
                    this.storageMAC(currentMAC, newDeviceObj.MAC);
                }

                requestIdleCallback(() => {
                    this.initSensingList();
                    this.blocksMotorCheck();
                    onSetDeviceObj(newDeviceObj);
                });
            },
        });
    }

    storageMAC(oldMac, newMac) {
        if (newMac === "") return;

        const MAClist = localStorage.getItem("MAClist") || [];

        if (Array.isArray(MAClist)) {
            localStorage.setItem(
                "MAClist",
                JSON.stringify([...MAClist, newMac])
            );
        } else if (typeof MAClist === "string" && MAClist !== "[]") {
            if (oldMac !== newMac) {
                const newMAClist = [...JSON.parse(MAClist), newMac];
                localStorage.setItem(
                    "MAClist",
                    JSON.stringify([...new Set(newMAClist)])
                );
            }
        }

        this.props.onSetCurrentMAC(newMac);
    }

    checkUpdateFirmware(resourcesPath) {
        //从文件资源中读取固件版本，如果读取失败那就使用写死的版本号
        const firmwareVersion =
            window.myAPI.getVersion(resourcesPath) || FIREWARE_VERSION;
        const currentVer = this.props?.deviceObj?.version;

        if (firmwareVersion && currentVer !== Number(firmwareVersion)) {
            const res = confirm(this.mainMsg.update);
            if (!res) {
                return false;
            }

            this.compile.sendSerial({
                verifyType: verifyTypeConfig.RESET_FWLIB,
            });

            this.props.onSetSourceCompleted(true);
            this.props.onOpenConnectionModal();

            return false;
        }

        return true;
    }

    checkUpdateSensing(resourcesPath) {
        const _type = (deviceItem) => {
            switch (deviceItem) {
                case "big_motor":
                    return 0xa1;
                case "small_motor":
                    return 0xa6;
                case "color":
                    return 0xa2;
                default:
                    return 0xff;
            }
        };

        const dataList = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff];
        const firmwareVersion =
            window.myAPI.getVersion(resourcesPath) || FIREWARE_VERSION;
        if (
            this.props?.deviceObj?.deviceList.length > 0 &&
            this.props?.deviceObj?.version === Number(firmwareVersion)
        ) {
            for (let i = 0; i < this.props?.deviceObj?.deviceList.length; i++) {
                console.log(
                    `目标设备对象${i}`,
                    this.props?.deviceObj.deviceList[i]
                );
                //获取每个目标设备对象
                const item = this.props?.deviceObj?.deviceList[i];
                //获取设备索引(0..)
                const index = parseInt(item["port"]);
                //获取设备类型(motor...)
                const deviceItem = deviceIdMap[item.deviceId];
                if (
                    // 如果不是为0（应该判断字符串），且版本不对的话（会存在版本不在设备对象中）,这个是设备内部对版本号
                    //就是说，判断有设备，且版本不对的话，会覆盖掉0xff(如果存在内部没有版本的情况下就默认不用更新)
                    parseInt(item.deviceId) !== 0 &&
                    item[deviceItem]?.version && // 确保 version 存在
                    item[deviceItem]?.SoftwareVersion && // 确保 SoftwareVersion 存在
                    item[deviceItem]?.version !==
                        item[deviceItem]?.SoftwareVersion
                ) {
                    dataList[index] = _type(deviceItem);
                }
            }
            const isDiff = dataList.find((item) => item !== 0xff);
            //如果isdiff不为0xff，则需要更新
            if (isDiff) {
                const supdate = confirm(this.mainMsg.sensing_update);
                supdate &&
                    window.myAPI.ipcRender({
                        sendName: ipc_Renderer.SEND_OR_ON.SENSING_UPDATE,
                        sendParams: [...dataList],
                    });
                // window.myAPI.ipcRender({ sendName: 'mainOnFocus' });
                return false;
            }
        }

        return true;
    }

    checkWorkspace() {
        const blocks = document.querySelector(
            ".blocklyWorkspace .blocklyBlockCanvas"
        );
        const list = this.props.workspace.getTopBlocks();
        const hasStart = list.some((el) => el.startHat_);
        if (!hasStart || blocks.getBBox().height === 0) {
            this.props.onShowCompletedAlert("workspaceEmpty");
            return false;
        }
        return true;
    }

    async onClickUploadCode(isRun) {
        const static_path =
            localStorage.getItem("static_path") || window.resourcesPath;
        try {
            const selItem = await window.myAPI.getStoreValue("selItem");
            const selectedExe = selItem
                ? JSON.parse(selItem)
                : this.props.selectedExe;
            const verifyType = verifyTypeConfig.BOOTBIN;
            switch (this.props.generatorName) {
                case PYTHON:
                    await handleUploadPython(
                        {
                            verifyType,
                            selectedExe,
                            codeStr: this.props.code,
                            codeType: this.props.generatorName,
                            isRun,
                        },
                        static_path
                    );
                    break;
                default:
                    break;
            }
        } catch (error) {
            this.props.onShowCompletedAlert(error);
            this.props.onSetCompleted(false);
            this.props.onSetSourceCompleted(false);
        }
    }

    async handleCompile(isRun) {
        try {
            const static_path =
                localStorage.getItem("static_path") || window.resourcesPath;

            // 检查固件版本
            const firmwareRes = this.checkUpdateFirmware(static_path);
            if (!firmwareRes) {
                return;
            }

            // 检查传感器版本
            const sensingRes = this.checkUpdateSensing(static_path);
            if (!sensingRes) {
                return;
            }

            // 检查工作区是否为空
            const workspaceRes = this.checkWorkspace();
            if (!workspaceRes) {
                return;
            }

            this.props.onSetCompleted(true);
            this.props.onShowCompletedAlert("uploading");

            // 检查是否需要运行APP
            if (
                this.props?.deviceObj?.WillAiState === verifyTypeConfig.EST_RUN
            ) {
                this.handleRunApp(verifyTypeConfig.EST_RUN);
                await window.myAPI.sleep(2000);
            }

            // 区分是哪种代码类型的下载
            this.onClickUploadCode(isRun);
        } catch (error) {
            // window.myAPI.handlerError(error);
        }
    }

    handleRunApp(status) {
        // sessionStorage.setItem('run-app', verifyTypeConfig.NO_RUN_APP);
        window.myAPI.ipcRender({
            sendName: ipc_Renderer.SEND_OR_ON.EXE.FILES,
            sendParams: { type: "APP", status },
        });
    }

    // 初始化传感器显示列表缓存
    initSensingList() {
        if (sessionStorage.getItem("sensing-unit-list")) {
            return;
        }
        const unitList = window.myAPI.getStoreValue("sensing-unit-list");
        if (!unitList) {
            let list = [];
            for (let i = 0; i < this.props.deviceObj.deviceList.length; i++) {
                const item = this.props.deviceObj.deviceList[i];
                list.push({
                    port: item.port,
                    deviceId: item.deviceId,
                    unit: null,
                });
            }
            sessionStorage.setItem("sensing-unit-list", "done");
            window.myAPI.setStoreValue(
                "sensing-unit-list",
                JSON.stringify(list)
            );
        }
    }

    render() {
        if (this.props.isError) {
            throw new Error(
                `Error in Scratch GUI [location=${window.location}]: ${this.props.error}`
            );
        }
        const {
            /* eslint-disable no-unused-vars */
            assetHost,
            cloudHost,
            error,
            isError,
            isScratchDesktop,
            isShowingProject,
            onProjectLoaded,
            onStorageInit,
            onUpdateProjectId,
            onVmInit,
            onShowCompletedAlert,
            projectHost,
            projectId,
            /* eslint-enable no-unused-vars */
            children,
            fetchingProject,
            isLoading,
            compileList,
            bufferList,
            matchMyBlock,
            msgTaskBlock,
            loadingStateVisible,
            currentMAC,
            onSetCurrentMAC,
            ...componentProps
        } = this.props;
        return (
            <>
                <GUIComponent
                    extensionLibraryContent={extensionLibraryContent}
                    loading={
                        fetchingProject || isLoading || loadingStateVisible
                    }
                    {...componentProps}
                    handleCompile={this.handleUploadClick}
                    handleRunApp={this.handleRunApp}
                    getMainMessage={this.getMainMessage}
                    compile={this.compile}
                >
                    {children}
                </GUIComponent>
                <TipsForUpdate tipsUpdateObj={this.props.updateObj} />
            </>
        );
    }
}

GUI.propTypes = {
    assetHost: PropTypes.string,
    children: PropTypes.node,
    cloudHost: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    fetchingProject: PropTypes.bool,
    intl: intlShape,
    isError: PropTypes.bool,
    isLoading: PropTypes.bool,
    isScratchDesktop: PropTypes.bool,
    isShowingProject: PropTypes.bool,
    loadingStateVisible: PropTypes.bool,
    onProjectLoaded: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onStorageInit: PropTypes.func,
    onUpdateProjectId: PropTypes.func,
    onSetCompleted: PropTypes.func,
    onSetSourceCompleted: PropTypes.func,
    onShowCompletedAlert: PropTypes.func,
    onSetExelist: PropTypes.func,
    onSetSelectedExe: PropTypes.func,
    onVmInit: PropTypes.func,
    projectHost: PropTypes.string,
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    telemetryModalVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired,
    onSetProgress: PropTypes.func,
    onActivateDeck: PropTypes.func,
    onOpenConnectionModal: PropTypes.func,
};

GUI.defaultProps = {
    isScratchDesktop: false,
    onStorageInit: (storageInstance) =>
        storageInstance.addOfficialScratchWebStores(),
    onProjectLoaded: () => {},
    onUpdateProjectId: () => {},
    onVmInit: (/* vm */) => {},
};

const mapStateToProps = (state) => {
    const loadingState = selectLoadingState(state);
    const activeTabIndex = selectActiveTabIndex(state);
    const stage = selectStage(state);
    const editingTarget = selectEditingTarget(state);
    return {
        activeTabIndex,
        alertsVisible: selectAlertsVisible(state),
        backdropLibraryVisible: selectBackdropLibraryVisible(state),
        blocksTabVisible: activeTabIndex === BLOCKS_TAB_INDEX,
        cardsVisible: selectCardsVisible(state),
        deviceVisible: selectDeviceCardsVisible(state),
        programSel: selectProgramSel(state),
        bleListVisible: selectBleListVisible(state),
        connectionModalVisible: selectConnectionModalVisible(state),
        costumeLibraryVisible: selectCostumeLibraryVisible(state),
        costumesTabVisible: activeTabIndex === COSTUMES_TAB_INDEX,
        error: selectProjectError(state),
        isError: getIsError(loadingState),
        isFullScreen: selectIsFullScreen(state),
        isPlayerOnly: selectIsPlayerOnly(state),
        isRtl: state.locales.isRtl,
        isShowingProject: getIsShowingProject(loadingState),
        loadingStateVisible: selectLoadingProjectVisible(state),
        projectId: selectProjectId(state),
        soundsTabVisible: activeTabIndex === SOUNDS_TAB_INDEX,
        targetIsStage: stage && stage.id === editingTarget,
        telemetryModalVisible: selectTelemetryModalVisible(state),
        tipsLibraryVisible: selectTipsLibraryVisible(state),
        vm: selectVm(state),
        code: selectCode(state),
        isGen: selectIsGen(state),
        isAiChat: selectIsAiChat(state),
        peripheralName: selectPeripheralName(state),
        completed: selectCompleted(state),
        compileList: selectCompileList(state),
        workspace: selectWorkspace(state),
        bufferList: selectBufferList(state),
        matchMyBlock: selectMatchMyBlock(state),
        msgTaskBlock: selectMsgTaskBlock(state),
        exeList: selectExeList(state),
        selectedExe: selectSelectedExe(state),
        showFileStytem: selectShowFileStytem(state),
        deviceObj: selectDeviceObj(state),
        version: selectConnectionVersion(state),
        updateObj: selectUpdateObj(state),
        deviceStatus: selectDeviceStatus(state),
        soundslist: selectSoundslist(state),
        upinVisible: selectUpinVisible(state),
        upinMsg: selectUpinMsg(state),
        dragging: selectDeviceCardsDragging(state),
        cascarderPanelVisible: selectCascaderPanelVisible(state),
        generatorName: selectGeneratorName(state),
        currentMAC: selectCurrentMAC(state),
        deviceType: selectDeviceType(state),
    };
};

const mapDispatchToProps = (dispatch) => ({
    onExtensionButtonClick: () => {
        if (extensionLibraryContent.length === 0) {
            showAlertWithTimeout(dispatch, "noExtensions");
            return;
        } else {
            dispatch(openExtensionLibrary());
        }
    },
    onActivateTab: (tab) => {
        dispatch(activateTab(tab));
    },
    onActivateCostumesTab: () => dispatch(activateTab(COSTUMES_TAB_INDEX)),
    onActivateSoundsTab: () => dispatch(activateTab(SOUNDS_TAB_INDEX)),
    onRequestCloseBackdropLibrary: () => dispatch(closeBackdropLibrary()),
    onRequestCloseCostumeLibrary: () => dispatch(closeCostumeLibrary()),
    onRequestCloseTelemetryModal: () => dispatch(closeTelemetryModal()),
    onSetCompleted: (completed) => dispatch(setCompleted(completed)),
    onShowCompletedAlert: (item) => showAlertWithTimeout(dispatch, item),
    onSetSourceCompleted: (sourceCompleted) =>
        dispatch(setSourceCompleted(sourceCompleted)),
    onSetExelist: (exeList) => dispatch(setExelistWithPersist(exeList)),
    onSetSelectedExe: (selectedExe) =>
        dispatch(setSelectedExeWithPersist(selectedExe)),
    onActivateDeck: (id) => dispatch(activateDeck(id)),
    onSetVersion: (version) => dispatch(setVersion(version)),
    onSetIsConnectedSerial: (isConnectedSerial) =>
        dispatch(setIsConnectedSerial(isConnectedSerial)),
    onSetGen: (gen) => dispatch(setGen(gen)),
    onSetAiChat: (isAiChat) => dispatch(setAiChat(isAiChat)),
    onOpenConnectionModal: () => dispatch(openConnectionModal()),
    onSetDeviceObj: (obj) => dispatch(setDeviceObj(obj)),
    onSetTipsUpdate: (obj) => dispatch(setTipsUpdateObj(obj)),
    onSetDeviceStatus: (status) => dispatch(setDeviceStatus(status)),
    onShowQrcode: () => dispatch(showQrcode()),
    onShowUpin: () => dispatch(showUpinThunk()),
    onViewDeviceCards: () => dispatch(viewDeviceCards()),
    onSetProgramSel: (flag) => dispatch(setProgramSel(flag)),
    onSetCurrentMAC: (mac) => dispatch(setCurrentMAC(mac)),
});

const ConnectedGUI = injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(GUI)
);

// note that redux's 'compose' function is just being used as a general utility to make
// the hierarchy of HOC constructor calls clearer here; it has nothing to do with redux's
// ability to compose reducers.
const WrappedGui = compose(
    LocalizationHOC,
    ErrorBoundaryHOC("Top Level App"),
    FontLoaderHOC,
    QueryParserHOC,
    ProjectFetcherHOC,
    TitledHOC,
    ProjectSaverHOC,
    vmListenerHOC,
    vmManagerHOC,
    SBFileUploaderHOC,
    cloudManagerHOC
)(ConnectedGUI);

WrappedGui.setAppElement = ReactModal.setAppElement;
export default WrappedGui;
