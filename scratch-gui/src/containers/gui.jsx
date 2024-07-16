import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import ReactModal from "react-modal";
import VM from "scratch-vm";
import ScratchBlocks from 'scratch-blocks';
import { injectIntl, intlShape } from "react-intl";
import extensionLibraryContent from '../lib/libraries/extensions/index.jsx';
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
import { APLICATION } from "../config/json/LB_USER.json";
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
import { ipc as ipc_Renderer, verifyTypeConfig, instructions } from "est-link";
import GUIComponent from "../components/gui/gui.jsx";
import { setIsScratchDesktop } from "../lib/isScratchDesktop.js";
import { setGen, setExelist, setSelectedExe } from "../reducers/mode.js";
import Compile from "../utils/compileGcc.js";
import { setCompleted, setSourceCompleted, setVersion } from "../reducers/connection-modal.js";
import { showAlertWithTimeout, showQrcode, showUpin } from "../reducers/alerts";
import { activateDeck } from "../reducers/cards.js";
import bindAll from "lodash.bindall";
import { setDeviceObj, setDeviceStatus } from "../reducers/device.js";
import { setTipsUpdateObj } from "../reducers/tips.js";
import TipsForUpdate from "../components/alerts/tipsForUpdate.jsx";
import getMainMsg from "../lib/alerts/message.js";
import debounce from "lodash.debounce";

const regOpenGyroscope = /\#define OPEN_GYROSCOPE_CALIBRATION \w+/;
const FIRMWARE_VERSION = '206';
class GUI extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, ['handleCompile', 'handleRunApp', 'getMainMessage']);
        this.compile = new Compile();
        this.handleUploadClick = debounce(this.handleCompile, 300, { leading: false, trailing: true });
        this.mainMsg = getMainMsg(props.intl);
    }

    componentDidMount() {
        setIsScratchDesktop(this.props.isScratchDesktop);
        this.props.onStorageInit(storage);
        this.props.onVmInit(this.props.vm);
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf("electron/") > -1) {
            requestIdleCallback(() => {
                this.getMainMessage();
                this.downloadSuccess();
                this.downloadSource();
                this.getFirmwareFiles();
                this.watchDevice();
                this.matrixSend('FieldMatrix');
                // window.myAPI.ipcInvoke(ipc_Renderer.SEND_OR_ON.SET_STATIC_PATH).then(window.myAPI.commendMake);
                // window.myAPI.onUpdate((_event, info) => this.props.onSetTipsUpdate(info));
            }, { timeout: 500 })
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
    }
    async componentWillUnmount() {
        window.myAPI.delEvents();
        // await window.myAPI.removeForage("programlist");
    }

    async getMainMessage() {
        await window.myAPI.ipcInvoke(ipc_Renderer.SEND_OR_ON.GETMAINMSG, { msg: this.mainMsg, autoUpdate: false });
    }

    blocksMotorCheck() {
        if (!this.props.deviceObj) return;
        // 电机模块设备显示监听
        let FieldMotor, FieldCombinedMotor;
        this.proxyMotor(FieldMotor, 'FieldMotor', this.props.deviceObj.deviceList);
        this.proxyMotor(FieldCombinedMotor, 'FieldCombinedMotor', this.props.deviceObj.deviceList);
    }

    getFirmwareFiles() {
        //获取主机文件监听
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.EXE.FILES,
            callback: (event, arg) => {
                const list = arg.split('/').filter(item => item.indexOf('_APP') !== -1);
                const exeList = list.map((el, index) => {
                    const current = el.indexOf('_');
                    return {
                        name: el.replace('.bin', ''),
                        num: el.slice(0, current),
                        checked: index === 0,
                        index
                    }
                });
                const oldList = window.myAPI.getStoreValue('exeList');
                const newList = _compareOldList(oldList, [...exeList]);
                this.props.onSetExelist(newList);
            }
        });
        function _compareOldList(oldList, newList) {
            if (!oldList) return newList;
            let list = [], i = 0;
            let oldQue = JSON.parse(JSON.stringify(JSON.parse(oldList)));
            if (oldQue.length === 0) return newList;
            while (newList.length > i) {
                const newItem = newList[i];
                if (oldQue.length > 0) {
                    const oldItem = oldQue.shift();
                    if (oldItem.num === newItem.num && oldItem.name === newItem.name) {
                        list.push(newItem);
                        i++;
                        continue;
                    } else if (oldItem.num === newItem.num && oldItem.name !== newItem.name) {
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

    /* getFirmwareVersion(firmwareVersion, ver) {
        const status = sessionStorage.getItem('isFirmwareUpdate');
        const isNew = ver > 0 && ver == firmwareVersion;
        if (isNew || status === 'updating') {
            return;
        }
        sessionStorage.setItem('isFirmwareUpdate', 'updating');
        this.checkUpdateFirmware(firmwareVersion);
    } */

    //下载资源监听
    downloadSource() {
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.COMMUNICATION.SOURCE.CONPLETED,
            callback: async (event, arg) => {
                this.props.onSetSourceCompleted(false);
                this.props.onShowCompletedAlert(arg.msg);
                await window.myAPI.sleep(1000);
                window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.RESTART });
            },
        });
    }


    //下载成功监听
    downloadSuccess() {
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.COMMUNICATION.BIN.CONPLETED,
            callback: (event, arg) => {
                this.props.onShowCompletedAlert(arg.msg);
                if (!arg.result) {
                    this.props.onSetCompleted(false);
                    this.props.onSetSourceCompleted(false);
                    sessionStorage.setItem('run-app', verifyTypeConfig.NO_RUN_APP);
                }
                if (arg.errMsg) {
                    const spath = sessionStorage.getItem("static_path") || window.resourcesPath;
                    window.myAPI.handlerError(arg.errMsg, spath);
                }
            }
        });
    }

    matrixSend(blockName) {
        const that = this;
        ScratchBlocks[blockName].callback = (type, obj) => {
            if (!that.props.completed) window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.MATRIX, sendParams: { type, obj, blockName } });
        }
    }

    proxyMotor(proxyVal, type, data) {
        if (!ScratchBlocks[type].proxy) return;
        proxyVal = ScratchBlocks[type].proxy();
        const newList = data.map(el => el.sensing_device);
        proxyVal.portList = [...newList];
    }

    checkUpdateFirmware(firmwareVersion) {
        const res = confirm(this.mainMsg.update);
        if (!res) {
            return;
        }
        this.compile.sendSerial(verifyTypeConfig.RESET_FWLIB);
        this.props.onSetSourceCompleted(true);
        this.props.onOpenConnectionModal();
        window.myAPI.setStoreValue('version', firmwareVersion);
    }

    //开启监听
    watchDevice() {
        let unitList = window.myAPI.getStoreValue('sensing-unit-list');
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.DEVICE.WATCH,
            callback: (e, result) => {
                if (!result || this.props.completed || this.props.dragging) {
                    return;
                }
                const { deviceObj, version, onSetDeviceStatus, onSetVersion, onSetDeviceObj } = this.props;
                const { estlist, versionlist } = result;
                if (deviceObj?.estlist?.est === estlist?.est) {
                    onSetDeviceStatus(estlist.est);
                }
                if (version !== versionlist.ver) {
                    onSetVersion(versionlist.ver);
                }
                onSetDeviceObj(result);

                requestIdleCallback(() => {
                    this.blocksMotorCheck();
                    this.initSensingList(unitList);
                    const runApp = sessionStorage.getItem('run-app') === verifyTypeConfig.RUN_APP;
                    const updateSensing = sessionStorage.getItem('update-sensing') === verifyTypeConfig.DOING;
                    if (runApp) {
                        this.handleRunApp();
                    }
                    if (updateSensing) {
                        sessionStorage.setItem('update-sensing', verifyTypeConfig.DONE);
                    }
                }, { timeout: 500 });
            }
        });
    }

    checkUpdateSensing() {
        return new Promise((resolve) => {
            const dataList = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];
            const { device } = instructions;
            const firmwareVersion = window.myAPI.getVersion(resourcesPath) || FIRMWARE_VERSION;
            if (this.props?.deviceObj?.deviceList.length > 0 && this.props?.deviceObj?.versionlist?.ver === Number(firmwareVersion)) {
                for (let i = 0; i < this.props?.deviceObj?.deviceList.length; i++) {
                    const item = this.props?.deviceObj?.deviceList[i];
                    const index = parseInt(item['port']);
                    const deviceItem = device[item.deviceId];
                    if (parseInt(item.deviceId) !== 0 && item[deviceItem]?.version !== item[deviceItem]?.Software) {
                        dataList[index] = _type(deviceItem);
                    }
                }
                const isDiff = dataList.find(item => item !== 0xff);
                if (isDiff) {
                    const supdate = confirm(this.mainMsg.sensing_update);
                    supdate && window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.SENSING_UPDATE, sendParams: [...dataList] });
                    resolve(false);
                }
            }
            resolve(true);
        })

        function _type(deviceItem) {
            switch (deviceItem) {
                case 'big_motor':
                    return 0xA1;
                case 'small_motor':
                    return 0xA6;
                case 'color':
                    return 0xA2;
                default:
                    return 0xff;
            }
        }
    }


    /* async checkDriver() {
        const driver = window.myAPI.getStoreValue('driver');
        const res = await window.myAPI.ipcInvoke(ipc_Renderer.SEND_OR_ON.DEVICE.CHECK, driver);
        if (res) {
            this.props.onActivateDeck("install-drivers");
            window.myAPI.setStoreValue('driver', ipc_Renderer.DRIVER.INSTALL);
        }
    } */

    async checkIsOpenGyroscope() {
        const spath = sessionStorage.getItem("static_path") || window.resourcesPath;
        let result = await window.myAPI.readFiles(APLICATION, spath);
        if (!result) {
            return;
        }
        const res = ScratchBlocks['cake'].OPEN_GYROSCOPE_CALIBRATION.size > 0 ? 1 : 0;
        const newStr = `#define OPEN_GYROSCOPE_CALIBRATION ${res}`;
        const str = result.match(regOpenGyroscope);
        if (str && str[0] === newStr) {
            return;
        }
        result = result.replace(regOpenGyroscope, newStr);
        await window.myAPI.writeFiles(APLICATION, result, spath);
    }


    async handleCompile(isRun) {
        const spath = sessionStorage.getItem("static_path") || window.resourcesPath;
        try {
            const firmwareVersion = window.myAPI.getVersion(spath) || FIRMWARE_VERSION;
            if (firmwareVersion && this.props?.deviceObj?.versionlist?.ver !== Number(firmwareVersion)) {
                this.checkUpdateFirmware(firmwareVersion);
                return;
            }

            const isTrue = await this.checkUpdateSensing();
            if (!isTrue) {
                return;
            }

            if (this.props.compileList.length === 0 || !this.props.workspace) {
                this.props.onShowCompletedAlert("workspaceEmpty");
                return;
            }

            await this.checkIsOpenGyroscope();

            const list = this.props.workspace.getTopBlocks();
            const hasStart = list.some(el => el.startHat_);
            if (!hasStart) {
                this.props.onShowCompletedAlert("workspaceEmpty");
                return;
            }

            this.props.onSetCompleted(true);
            this.props.onShowCompletedAlert("uploading");

            if (this.props?.deviceObj?.estlist?.est === verifyTypeConfig.EST_RUN) {
                this.handleRunApp(verifyTypeConfig.EST_RUN);
            }

            const selItem = window.myAPI.getStoreValue('selItem');
            const selectedExe = selItem ? JSON.parse(selItem) : this.props.selectedExe;
            const verifyType = this.props.soundslist?.length > 0 ? verifyTypeConfig.SOURCE_SOUNDS : verifyTypeConfig.BOOTBIN;
            await window.myAPI.sleep(2000);
            this.compile.sendSerial(verifyType, this.props.bufferList, this.props.matchMyBlock, selectedExe, this.props.soundslist);
            sessionStorage.setItem('run-app', isRun ? verifyTypeConfig.RUN_APP : verifyTypeConfig.NO_RUN_APP);
        } catch (error) {
            window.myAPI.handlerError(error, spath);
        }
    }

    handleRunApp(status) {
        sessionStorage.setItem('run-app', verifyTypeConfig.NO_RUN_APP);
        window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.EXE.FILES, sendParams: { type: 'APP', status } });
    }

    deepEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }

        for (let i = 0; i < arr1.length; i++) {
            const val1 = arr1[i];
            const val2 = arr2[i];

            if (val1.deviceId !== val2.deviceId || val1.port !== val2.port) {
                return false;
            }
        }

        return true;
    }

    initSensingList(unitList) {
        if (!unitList || unitList === "[]" || !this.deepEqual(JSON.parse(unitList), this.props.deviceObj.deviceList)) {
            let list = [];
            for (let i = 0; i < this.props.deviceObj.deviceList.length; i++) {
                const item = this.props.deviceObj.deviceList[i];
                list.push({
                    port: item.port,
                    deviceId: item.deviceId,
                    unit: null
                });
            }
            window.myAPI.setStoreValue('sensing-unit-list', JSON.stringify(list));
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
            loadingStateVisible,
            ...componentProps
        } = this.props;
        return (
            <>
                <GUIComponent
                    extensionLibraryContent={extensionLibraryContent}
                    loading={fetchingProject || isLoading || loadingStateVisible}
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
    compile: PropTypes.object,
    onSetProgress: PropTypes.func,
    onActivateDeck: PropTypes.func,
    onOpenConnectionModal: PropTypes.func
};

GUI.defaultProps = {
    isScratchDesktop: false,
    onStorageInit: (storageInstance) =>
        storageInstance.addOfficialScratchWebStores(),
    onProjectLoaded: () => { },
    onUpdateProjectId: () => { },
    onVmInit: (/* vm */) => { },
};

const mapStateToProps = (state) => {
    const loadingState = state.scratchGui.projectState.loadingState;
    return {
        activeTabIndex: state.scratchGui.editorTab.activeTabIndex,
        alertsVisible: state.scratchGui.alerts.visible,
        backdropLibraryVisible: state.scratchGui.modals.backdropLibrary,
        blocksTabVisible:
            state.scratchGui.editorTab.activeTabIndex === BLOCKS_TAB_INDEX,
        cardsVisible: state.scratchGui.cards.visible,
        deviceVisible: state.scratchGui.cards.deviceCards.deviceVisible,
        connectionModalVisible: state.scratchGui.modals.connectionModal,
        costumeLibraryVisible: state.scratchGui.modals.costumeLibrary,
        costumesTabVisible:
            state.scratchGui.editorTab.activeTabIndex === COSTUMES_TAB_INDEX,
        error: state.scratchGui.projectState.error,
        isError: getIsError(loadingState),
        isFullScreen: state.scratchGui.mode.isFullScreen,
        isPlayerOnly: state.scratchGui.mode.isPlayerOnly,
        isRtl: state.locales.isRtl,
        isShowingProject: getIsShowingProject(loadingState),
        loadingStateVisible: state.scratchGui.modals.loadingProject,
        projectId: state.scratchGui.projectState.projectId,
        soundsTabVisible:
            state.scratchGui.editorTab.activeTabIndex === SOUNDS_TAB_INDEX,
        targetIsStage:
            state.scratchGui.targets.stage &&
            state.scratchGui.targets.stage.id ===
            state.scratchGui.targets.editingTarget,
        telemetryModalVisible: state.scratchGui.modals.telemetryModal,
        tipsLibraryVisible: state.scratchGui.modals.tipsLibrary,
        vm: state.scratchGui.vm,
        code: state.scratchGui.mode.code,
        isGen: state.scratchGui.mode.isGen,
        peripheralName: state.scratchGui.connectionModal.peripheralName,
        completed: state.scratchGui.connectionModal.completed,
        compileList: state.scratchGui.mode.compileList,
        workspace: state.scratchGui.workspaceMetrics.workspace,
        bufferList: state.scratchGui.mode.bufferList,
        matchMyBlock: state.scratchGui.mode.matchMyBlock,
        exeList: state.scratchGui.mode.exeList,
        selectedExe: state.scratchGui.mode.selectedExe,
        showFileStytem: state.scratchGui.fileStytem.showFileStytem,
        deviceObj: state.scratchGui.device.deviceObj,
        version: state.scratchGui.connectionModal.version,
        updateObj: state.scratchGui.tips.updateObj,
        deviceStatus: state.scratchGui.device.deviceStatus,
        soundslist: state.scratchGui.connectionModal.soundslist,
        upinVisible: state.scratchGui.alerts.upinVisible,
        upinMsg: state.scratchGui.alerts.upinMsg,
        dragging: state.scratchGui.cards.deviceCards.dragging,
        cascarderPanelVisible: state.scratchGui.modals.cascarderPanel,
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
    onSetSourceCompleted: (sourceCompleted) => dispatch(setSourceCompleted(sourceCompleted)),
    onSetExelist: (exeList) => dispatch(setExelist(exeList)),
    onSetSelectedExe: (selectedExe) => dispatch(setSelectedExe(selectedExe)),
    onActivateDeck: id => dispatch(activateDeck(id)),
    onSetVersion: (version) => dispatch(setVersion(version)),
    onSetGen: (gen) => dispatch(setGen(gen)),
    onOpenConnectionModal: () => dispatch(openConnectionModal()),
    onSetDeviceObj: (obj) => dispatch(setDeviceObj(obj)),
    onSetTipsUpdate: (obj) => dispatch(setTipsUpdateObj(obj)),
    onSetDeviceStatus: (status) => dispatch(setDeviceStatus(status)),
    onShowQrcode: () => dispatch(showQrcode()),
    onShowUpin: () => dispatch(showUpin())
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
