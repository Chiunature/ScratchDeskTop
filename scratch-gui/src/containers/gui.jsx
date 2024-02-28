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
import { ipc as ipc_Renderer, verifyTypeConfig } from "est-link";
import GUIComponent from "../components/gui/gui.jsx";
import { setIsScratchDesktop } from "../lib/isScratchDesktop.js";
import { setGen, setIsComplete, setExelist, setSelectedExe } from "../reducers/mode.js";
import Compile from "../utils/compileGcc.js";
import { setCompleted, setProgress, setSourceCompleted, setVersion } from "../reducers/connection-modal.js";
import { showAlertWithTimeout } from "../reducers/alerts";
import { activateDeck } from "../reducers/cards.js";
import bindAll from "lodash.bindall";

class GUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceObj: {
                deviceList: [],
                gyroList: new Array(3).fill(0),
                flashList: new Array(2).fill(0),
                adcList: 0,
                voice: 0,
                deviceStatus: verifyTypeConfig.EST_STOP
            }
        }
        bindAll(this, ['handleCompile', 'handleRunApp']);
    }

    async componentDidMount() {
        setIsScratchDesktop(this.props.isScratchDesktop);
        this.props.onStorageInit(storage);
        this.props.onVmInit(this.props.vm);
        this.initDeviceList();
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf("electron/") > -1) {
            this.downloadSuccess();
            this.downloadProgress();
            this.downloadSource();
            this.getFirewareVersion();
            this.getFirewareFiles();
            // 设备信息监听
            this.watchDevice();
            this.blocksMotorCheck();
            this.checkDriver();
            this.matrixSend();
            await window.myAPI.commendMake();
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

    blocksMotorCheck() {
        // 电机模块设备显示监听
        let FieldMotor, FieldCombinedMotor;
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.DEVICE.PORT,
            callback: (event, data) => {
                this.proxyMotor(FieldMotor, 'FieldMotor', data);
                this.proxyMotor(FieldCombinedMotor, 'FieldCombinedMotor', data);
                this.setState((state) => ({ deviceObj: state.deviceObj }));
            }
        });
    }

    getFirewareFiles() {
        //获取主机文件监听
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.EXE.FILES,
            callback: (event, arg) => {
                const list = arg.split('/').filter(Boolean);
                const exeList = list.map((el, index) => {
                    const current = el.indexOf('_');
                    return {
                        name: el.replace('.bin', ''),
                        num: el.slice(0, current),
                        checked: index === 0 ? true : false
                    }
                });
                this.props.onSetExelist(exeList);
            }
        });
    }

    getFirewareVersion() {
        //获取主机版本监听
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.VERSION,
            callback: (event, arg) => {
                const version = window.myAPI.getVersion(arg);
                this.props.onSetVersion(version);
                window.myAPI.delEvents(ipc_Renderer.RETURN.VERSION);
                if (!version) this.checkUpdateFireware();
            }
        });
    }

    downloadSource() {
        //下载资源监听
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.COMMUNICATION.SOURCE.CONPLETED,
            callback: (event, arg) => {
                this.props.onSetSourceCompleted(false);
                this.props.onSetVersion(true);
                this.props.onShowCompletedAlert(arg.msg);
                setTimeout(() => window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.RESTART }), 1000);
            },
        });
    }

    downloadProgress() {
        //下载进度监听
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.COMMUNICATION.BIN.PROGRESS,
            callback: (event, arg) => {
                this.props.onSetProgress(arg);
            },
        });
    }

    downloadSuccess() {
        //下载成功监听
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.COMMUNICATION.BIN.CONPLETED,
            callback: (event, arg) => {
                this.props.onShowCompletedAlert(arg.msg);
                if (arg.result) {
                    this.props.onSetIsComplete(true);
                    window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.EXE.FILES, sendParams: 'FILE' });
                    let time = setTimeout(() => {
                        this.props.onSetIsComplete(false);
                        this.props.onSetCompleted(false);
                        this.props.onSetProgress(0);
                        JSON.parse(sessionStorage.getItem('run-app')) && this.handleRunApp();
                        clearTimeout(time);
                    }, 2000);
                } else {
                    this.props.onSetCompleted(false);
                    this.props.onSetSourceCompleted(false);
                }
            },
        });
    }

    matrixSend() {
        ScratchBlocks['FieldMatrix'].callback = (type, matrix) => {
            window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.MATRIX, sendParams: { type, matrix } });
        }
    }

    proxyMotor(proxyVal, type, data) {
        if (!ScratchBlocks[type].proxy) return;
        // if(ScratchBlocks.FieldMotor.portList.length > 0) {
        //     const flag = data.find((el, index) => (el !== ScratchBlocks.FieldMotor.portList[index]));
        //     if(!flag) return;
        // }
        proxyVal = ScratchBlocks[type].proxy();
        proxyVal.portList = [...data];
    }

    async checkUpdateFireware() {
        const res = await window.myAPI.ipcInvoke(ipc_Renderer.SEND_OR_ON.VERSION.UPDATE);
        if (res === 0) {
            return;
        }
        new Compile().sendSerial(verifyTypeConfig.SOURCE);
        this.props.onSetSourceCompleted(true);
        this.props.onOpenConnectionModal();
    }

    //初始化设备
    initDeviceList() {
        let list = [];
        for (let i = 0; i < 8; i++) {
            const obj = {
                port: i,
                motor: {},
                color: {},
                ultrasonic: null,
                deviceId: null,
                sensing_device: '无设备连接'
            }
            list.push(obj);
        }
        this.state.deviceObj.deviceList = list;
        this.setState((state) => ({ deviceObj: state.deviceObj }));
    }
    //开启监听
    watchDevice() {
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.DEVICE.WATCH,
            callback: (e, result) => {
                if (!result) return;
                this.state.deviceObj = { ...result, deviceList: result.deviceList.length > 0 ? [...result.deviceList] : [...this.state.deviceObj.deviceList] };
            }
        });
    }

    async checkDriver() {
        const driver = localStorage.getItem('driver');
        const res = await window.myAPI.ipcInvoke(ipc_Renderer.SEND_OR_ON.DEVICE.CHECK, driver);
        if (res) {
            this.props.onActivateDeck("install-drivers");
            localStorage.setItem('driver', res);
        }
    }


    handleCompile() {
        if (this.props.compileList.length === 0 || !this.props.workspace) {
            this.props.onShowCompletedAlert("workspaceEmpty");
        } else if (this.props.workspace) {
            const list = this.props.workspace.getTopBlocks();
            const hasStart = list.some(el => el.startHat_);
            if (!hasStart) {
                this.props.onShowCompletedAlert("workspaceEmpty");
            } else {
                if (this.state.deviceObj.deviceStatus === verifyTypeConfig.EST_RUN) {
                    this.handleRunApp(this.state.deviceObj.deviceStatus);
                }
                const selectedExe = JSON.parse(localStorage.getItem('selItem'));
                const compile = new Compile();
                compile.sendSerial(verifyTypeConfig.BOOTBIN, this.props.bufferList, this.props.matchMyBlock, selectedExe);
                this.props.onSetCompleted(true);
                this.props.onShowCompletedAlert("uploading");
            }
        }
    }

    handleRunApp(status) {
        window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.EXE.FILES, sendParams: { type: 'APP', status } });
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
            <GUIComponent
                extensionLibraryContent={extensionLibraryContent}
                loading={fetchingProject || isLoading || loadingStateVisible}
                {...componentProps}
                handleCompile={this.handleCompile}
                handleRunApp={this.handleRunApp}
                compile={new Compile()}
                deviceObj={this.state.deviceObj}
            >
                {children}
            </GUIComponent>
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
