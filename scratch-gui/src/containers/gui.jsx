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
import throttle from 'lodash.throttle';
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
import { setGen, setIsComplete, setExelist, setSelectedExe } from "../reducers/mode.js";
import Compile from "../utils/compileGcc.js";
import { setCompleted, setProgress, setSourceCompleted, setVersion } from "../reducers/connection-modal.js";
import { showAlertWithTimeout, showQrcode } from "../reducers/alerts";
import { activateDeck } from "../reducers/cards.js";
import bindAll from "lodash.bindall";
import { setDeviceObj, setDeviceStatus } from "../reducers/device.js";
import { setTipsUpdateObj } from "../reducers/tips.js";
import TipsForUpdate from "../components/alerts/tipsForUpdate.jsx";
import getMainMsg from "../lib/alerts/message.js";

class GUI extends React.Component {
    constructor(props) {
        super(props);
        this.compile = new Compile();
        bindAll(this, ['handleCompile', 'handleRunApp', 'getMainMessage']);
    }

    async componentDidMount() {
        setIsScratchDesktop(this.props.isScratchDesktop);
        this.props.onStorageInit(storage);
        this.props.onVmInit(this.props.vm);
        const userAgent = navigator.userAgent.toLowerCase();
        const that = this;
        if (userAgent.indexOf("electron/") > -1) {
            this.getMainMessage();
            this.downloadSuccess();
            this.downloadProgress();
            this.downloadSource();
            this.getFirewareFiles();
            const res = await window.myAPI.ipcInvoke(ipc_Renderer.SEND_OR_ON.SET_STATIC_PATH);
            this.watchDevice(res);
            this.checkDriver();
            this.matrixSend('FieldMatrix');
            await window.myAPI.commendMake(res);
            window.myAPI.onUpdate((_event, info) => {
                that.props.onSetTipsUpdate(info);
            });
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
    componentWillUnmount() {
        window.myAPI.delEvents();
    }

    getMainMessage() {
        const mainMsg = getMainMsg(this.props.intl);
        window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.GETMAINMSG, sendParams: mainMsg });
    }

    blocksMotorCheck() {
        if (!this.props.deviceObj) return;
        // 电机模块设备显示监听
        let FieldMotor, FieldCombinedMotor;
        this.proxyMotor(FieldMotor, 'FieldMotor', this.props.deviceObj.deviceList);
        this.proxyMotor(FieldCombinedMotor, 'FieldCombinedMotor', this.props.deviceObj.deviceList);
    }

    getFirewareFiles() {
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

    getFirewareVersion(firewareVersion, ver) {
        if (this.props.version != ver) this.props.onSetVersion(ver);
        const status = sessionStorage.getItem('isFirewareUpdate');
        const isNew = ver > 0 && ver == firewareVersion;
        if (isNew || status === 'updating') return;
        sessionStorage.setItem('isFirewareUpdate', 'updating');
        this.checkUpdateFireware(firewareVersion);
    }

    //下载资源监听
    downloadSource() {
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.COMMUNICATION.SOURCE.CONPLETED,
            callback: (event, arg) => {
                this.props.onSetSourceCompleted(false);
                this.props.onShowCompletedAlert(arg.msg);
                let t = setTimeout(() => {
                    window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.RESTART });
                    clearTimeout(t);
                    t = null;
                }, 1000);
            },
        });
    }

    //下载进度监听
    downloadProgress() {
        window.myAPI.ipcRender({ eventName: ipc_Renderer.RETURN.COMMUNICATION.BIN.PROGRESS, callback: (event, arg) => this.props.onSetProgress(arg) });
    }

    //下载成功监听
    downloadSuccess() {
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.COMMUNICATION.BIN.CONPLETED,
            callback: (event, arg) => {
                this.props.onShowCompletedAlert(arg.msg);
                if (arg.result) {
                    this.props.onSetIsComplete(true);
                    let time = setTimeout(() => {
                        this.props.onSetIsComplete(false);
                        this.props.onSetCompleted(false);
                        this.props.onSetProgress(0);
                        JSON.parse(sessionStorage.getItem('run-app')) && this.handleRunApp();
                        window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.EXE.FILES, sendParams: { type: 'FILE' } });
                        clearTimeout(time);
                        time = null;
                    }, 1500);
                } else {
                    this.props.onSetCompleted(false);
                    this.props.onSetSourceCompleted(false);
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

    async checkUpdateFireware(firewareVersion) {
        const res = await window.myAPI.ipcInvoke(ipc_Renderer.SEND_OR_ON.VERSION.UPDATE);
        if (res === 0) return;
        this.compile.sendSerial(verifyTypeConfig.SOURCE);
        this.props.onSetSourceCompleted(true);
        this.props.onOpenConnectionModal();
        window.myAPI.setStoreValue('version', firewareVersion);
        sessionStorage.setItem('isFirewareUpdate', 'done');
    }

    //开启监听
    watchDevice(resourcesPath) {
        // const deviceIdList = Object.keys(instructions.device);
        // const list = [deviceIdList[1], deviceIdList[2], deviceIdList[5], deviceIdList[6]];
        const firewareVersion = window.myAPI.getVersion(resourcesPath);
        sessionStorage.setItem('isSensingUpdate', 'done');
        sessionStorage.setItem('isFirewareUpdate', 'done');
        const newGetFirewareVersionFn = throttle(this.getFirewareVersion.bind(this), 5000, { 'leading': true, 'trailing': false });
        let unitList = window.myAPI.getStoreValue('sensing-unit-list');
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.DEVICE.WATCH,
            callback: (e, result) => {
                if (!result || this.props.completed) return;
                if (this.props.deviceObj && this.props.deviceObj.estlist &&
                    result && result.estlist && this.props.deviceObj.estlist.est === result.estlist.est) {
                    this.props.onSetDeviceStatus(this.props.deviceObj.estlist.est);
                }
                this.props.onSetDeviceObj(result);
                this.blocksMotorCheck();
                newGetFirewareVersionFn(firewareVersion, result.versionlist.ver);
                this.initSensingList(unitList);
            }
        });
    }

    /*checkUpdateSensing(list, deviceList, ver) {
        const isUpdate = sessionStorage.getItem('isSensingUpdate');
        const { device } = instructions;
        if (deviceList.length > 0 && isUpdate == 'done' && ver == this.props.version) {
            for (let i = 0; i < deviceList.length; i++) {
                const item = deviceList[i];
                const deviceItem = device[item.deviceId];
                const portItem = item[deviceItem];
                if (deviceItem && portItem) {
                    const not_run = 'Not_Run' in portItem;
                    const isNew = !not_run && portItem['version'] && portItem['version'] > 0 && portItem['version'] != ver;
                    if (list.includes(item.deviceId) && (not_run || isNew)) {
                        sessionStorage.setItem('isSensingUpdate', 'updating');
                        this.updateSensing();
                        break;
                    } else {
                        continue;
                    }
                } else {
                    continue;
                }
            }
        }
    }*/

    async updateSensing() {
        window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.EXE.FILES, sendParams: { type: 'SENSING_UPDATE' } });
        if (sessionStorage.getItem('isSensingUpdate') === 'updating') await window.myAPI.ipcInvoke(ipc_Renderer.SEND_OR_ON.SENSING_UPDATE);
        sessionStorage.setItem('isSensingUpdate', 'done');
    }

    async checkDriver() {
        const driver = window.myAPI.getStoreValue('driver');
        const res = await window.myAPI.ipcInvoke(ipc_Renderer.SEND_OR_ON.DEVICE.CHECK, driver);
        if (res) {
            this.props.onActivateDeck("install-drivers");
            window.myAPI.setStoreValue('driver', ipc_Renderer.DRIVER.INSTALL);
        }
    }


    handleCompile() {
        if (this.props.compileList.length === 0 || !this.props.workspace) {
            this.props.onShowCompletedAlert("workspaceEmpty");
        } else if (this.props.workspace) {
            const list = this.props.workspace.getTopBlocks();
            const hasStart = list.some(el => el.startHat_);
            const selItem = window.myAPI.getStoreValue('selItem');
            if (!hasStart) {
                this.props.onShowCompletedAlert("workspaceEmpty");
            } else {
                if (this.props?.deviceObj?.estlist?.est === verifyTypeConfig.EST_RUN) {
                    this.handleRunApp(verifyTypeConfig.EST_RUN);
                }
                const selectedExe = selItem ? JSON.parse(selItem) : this.props.selectedExe;
                const verifyType = this.props?.soundslist?.length > 0 ? verifyTypeConfig.SOURCE_SOUNDS : verifyTypeConfig.BOOTBIN;
                let t = setTimeout(() => {
                    this.compile.sendSerial(verifyType, this.props.bufferList, this.props.matchMyBlock, selectedExe, this.props.soundslist);
                    clearTimeout(t);
                    t = null;
                }, 2000);
                this.props.onSetCompleted(true);
                this.props.onShowCompletedAlert("uploading");
            }
        }
    }

    handleRunApp(status) {
        window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.EXE.FILES, sendParams: { type: 'APP', status } });
    }

    initSensingList(unitList) {
        if (!unitList || unitList === "[]") {
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
            onSetCompleted,
            onSetProgress,
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
                    handleCompile={this.handleCompile}
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
        isComplete: state.scratchGui.mode.isComplete,
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
    onSetIsComplete: (isComplete) => dispatch(setIsComplete(isComplete)),
    onSetProgress: (progress) => dispatch(setProgress(progress)),
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
    onShowQrcode: () => dispatch(showQrcode())
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
