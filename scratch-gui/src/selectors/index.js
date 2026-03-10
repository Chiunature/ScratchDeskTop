/**
 * 集中管理所有 state.scratchGui.xxx 访问路径。
 *
 * 使用方式：
 *   import { selectVm, selectIsFullScreen } from '../selectors';
 *   const vm = useSelector(selectVm);
 *   // 或在 mapStateToProps 里：
 *   vm: selectVm(state)
 */

// ─── VM ────────────────────────────────────────────────────────────────────────
export const selectVm = (state) => state.scratchGui.vm;

// ─── 编辑器模式 (mode) ──────────────────────────────────────────────────────────
export const selectMode = (state) => state.scratchGui.mode;
export const selectIsFullScreen = (state) => state.scratchGui.mode.isFullScreen;
export const selectIsPlayerOnly = (state) => state.scratchGui.mode.isPlayerOnly;
export const selectShowBranding = (state) => state.scratchGui.mode.showBranding;
export const selectHasEverEnteredEditor = (state) =>
    state.scratchGui.mode.hasEverEnteredEditor;
export const selectIsGen = (state) => state.scratchGui.mode.isGen;
export const selectCode = (state) => state.scratchGui.mode.code;
export const selectIsComplete = (state) => state.scratchGui.mode.isComplete;
export const selectCompileList = (state) => state.scratchGui.mode.compileList;
export const selectBufferList = (state) => state.scratchGui.mode.bufferList;
export const selectMatchMyBlock = (state) => state.scratchGui.mode.matchMyBlock;
export const selectMsgTaskBlock = (state) => state.scratchGui.mode.msgTaskBlock;
export const selectExeList = (state) => state.scratchGui.mode.exeList;
export const selectSelectedExe = (state) => state.scratchGui.mode.selectedExe;
export const selectGeneratorName = (state) => state.scratchGui.mode.generatorName;

// ─── 设备 (device) ─────────────────────────────────────────────────────────────
export const selectDevice = (state) => state.scratchGui.device;
export const selectDeviceId = (state) => state.scratchGui.device.deviceId;
export const selectDeviceName = (state) => state.scratchGui.device.deviceName;
export const selectDeviceType = (state) => state.scratchGui.device.deviceType;
export const selectDeviceStatus = (state) => state.scratchGui.device.deviceStatus;
export const selectDeviceObj = (state) => state.scratchGui.device.deviceObj;
export const selectCurrentMAC = (state) => state.scratchGui.device.currentMAC;

// ─── 连接弹窗 (connectionModal) ────────────────────────────────────────────────
export const selectConnectionModal = (state) => state.scratchGui.connectionModal;
export const selectExtensionId = (state) =>
    state.scratchGui.connectionModal.extensionId;
export const selectPeripheralName = (state) =>
    state.scratchGui.connectionModal.peripheralName;
export const selectSerialList = (state) =>
    state.scratchGui.connectionModal.serialList;
export const selectPort = (state) => state.scratchGui.connectionModal.port;
export const selectIsConnectedSerial = (state) =>
    state.scratchGui.connectionModal.isConnectedSerial;
export const selectConnectionVersion = (state) =>
    state.scratchGui.connectionModal.version;
export const selectCompleted = (state) =>
    state.scratchGui.connectionModal.completed;
export const selectSourceCompleted = (state) =>
    state.scratchGui.connectionModal.sourceCompleted;
export const selectSoundslist = (state) =>
    state.scratchGui.connectionModal.soundslist;

// ─── 弹窗可见性 (modals) ───────────────────────────────────────────────────────
export const selectModals = (state) => state.scratchGui.modals;
export const selectBackdropLibraryVisible = (state) =>
    state.scratchGui.modals.backdropLibrary;
export const selectCostumeLibraryVisible = (state) =>
    state.scratchGui.modals.costumeLibrary;
export const selectExtensionLibraryVisible = (state) =>
    state.scratchGui.modals.extensionLibrary;
export const selectLoadingProjectVisible = (state) =>
    state.scratchGui.modals.loadingProject;
export const selectTelemetryModalVisible = (state) =>
    state.scratchGui.modals.telemetryModal;
export const selectSoundLibraryVisible = (state) =>
    state.scratchGui.modals.soundLibrary;
export const selectSpriteLibraryVisible = (state) =>
    state.scratchGui.modals.spriteLibrary;
export const selectSoundRecorderVisible = (state) =>
    state.scratchGui.modals.soundRecorder;
export const selectConnectionModalVisible = (state) =>
    state.scratchGui.modals.connectionModal;
export const selectTipsLibraryVisible = (state) =>
    state.scratchGui.modals.tipsLibrary;
export const selectCascaderPanelVisible = (state) =>
    state.scratchGui.modals.cascarderPanel;
export const selectBleListVisible = (state) =>
    state.scratchGui.modals.bleList;

// ─── 提示/卡片 (cards) ─────────────────────────────────────────────────────────
export const selectCards = (state) => state.scratchGui.cards;
export const selectCardsVisible = (state) => state.scratchGui.cards.visible;
export const selectDeviceCardsVisible = (state) =>
    state.scratchGui.cards.deviceCards.deviceVisible;
export const selectDeviceCardsDragging = (state) =>
    state.scratchGui.cards.deviceCards.dragging;
export const selectProgramSel = (state) => state.scratchGui.cards.programSel;

// ─── 警报 (alerts) ─────────────────────────────────────────────────────────────
export const selectAlerts = (state) => state.scratchGui.alerts;
export const selectAlertsVisible = (state) => state.scratchGui.alerts.visible;
export const selectAlertsList = (state) => state.scratchGui.alerts.alertsList;
export const selectOpenAutoSave = (state) => state.scratchGui.alerts.openAutoSave;
export const selectShowFileNotify = (state) =>
    state.scratchGui.alerts.showFileNotify;
export const selectUpinVisible = (state) => state.scratchGui.alerts.upinVisible;
export const selectUpinMsg = (state) => state.scratchGui.alerts.upinMsg;

// ─── 编辑器标签页 (editorTab) ──────────────────────────────────────────────────
export const selectActiveTabIndex = (state) =>
    state.scratchGui.editorTab.activeTabIndex;

// ─── 舞台尺寸 (stageSize) ──────────────────────────────────────────────────────
export const selectStageSize = (state) => state.scratchGui.stageSize.stageSize;

// ─── 主题 (theme) ─────────────────────────────────────────────────────────────
export const selectTheme = (state) => state.scratchGui.theme.theme;

// ─── 项目状态 (projectState) ──────────────────────────────────────────────────
export const selectProjectState = (state) => state.scratchGui.projectState;
export const selectLoadingState = (state) =>
    state.scratchGui.projectState.loadingState;
export const selectProjectId = (state) =>
    state.scratchGui.projectState.projectId;
export const selectProjectError = (state) =>
    state.scratchGui.projectState.error;

// ─── 项目标题 (projectTitle) ──────────────────────────────────────────────────
export const selectProjectTitle = (state) => state.scratchGui.projectTitle;

// ─── 项目变更标记 (projectChanged) ────────────────────────────────────────────
export const selectProjectChanged = (state) => state.scratchGui.projectChanged;

// ─── 目标 (targets) ───────────────────────────────────────────────────────────
export const selectTargets = (state) => state.scratchGui.targets;
export const selectEditingTarget = (state) =>
    state.scratchGui.targets.editingTarget;
export const selectSprites = (state) => state.scratchGui.targets.sprites;
export const selectStage = (state) => state.scratchGui.targets.stage;
export const selectHighlightedTargetId = (state) =>
    state.scratchGui.targets.highlightedTargetId;
export const selectHighlightedTargetTime = (state) =>
    state.scratchGui.targets.highlightedTargetTime;

// ─── 拖拽 (assetDrag / blockDrag) ─────────────────────────────────────────────
export const selectAssetDrag = (state) => state.scratchGui.assetDrag;
export const selectAssetDragging = (state) =>
    state.scratchGui.assetDrag.dragging;
export const selectAssetDragOffset = (state) =>
    state.scratchGui.assetDrag.currentOffset;
export const selectAssetDragImg = (state) => state.scratchGui.assetDrag.img;
export const selectBlockDrag = (state) => state.scratchGui.blockDrag;

// ─── 工作区指标 (workspaceMetrics) ────────────────────────────────────────────
export const selectWorkspace = (state) =>
    state.scratchGui.workspaceMetrics.workspace;

// ─── 工具箱 (toolbox) ─────────────────────────────────────────────────────────
export const selectToolboxXML = (state) =>
    state.scratchGui.toolbox.toolboxXML;

// ─── 文件系统 (fileStytem) ────────────────────────────────────────────────────
export const selectShowFileStytem = (state) =>
    state.scratchGui.fileStytem.showFileStytem;

// ─── tips (tips) ──────────────────────────────────────────────────────────────
export const selectUpdateObj = (state) => state.scratchGui.tips.updateObj;

// ─── 监视器 (monitors / monitorLayout) ────────────────────────────────────────
export const selectMonitors = (state) => state.scratchGui.monitors;
export const selectMonitorLayout = (state) => state.scratchGui.monitorLayout;

// ─── 字体加载 (fontsLoaded) ───────────────────────────────────────────────────
export const selectFontsLoaded = (state) => state.scratchGui.fontsLoaded;

// ─── 回收站 (restoreDeletion) ─────────────────────────────────────────────────
export const selectDeletedItem = (state) =>
    state.scratchGui.restoreDeletion.deletedItem;
export const selectRestoreFun = (state) =>
    state.scratchGui.restoreDeletion.restoreFun;

// ─── 悬停目标 (hoveredTarget) ─────────────────────────────────────────────────
export const selectHoveredTarget = (state) => state.scratchGui.hoveredTarget;

// ─── 麦克风指示器 (micIndicator) ─────────────────────────────────────────────
export const selectMicIndicator = (state) => state.scratchGui.micIndicator;

// ─── 自定义过程 (customProcedures) ────────────────────────────────────────────
export const selectCustomProceduresMutator = (state) =>
    state.scratchGui.customProcedures.mutator;

// ─── 时间旅行 (timeTravel) ─────────────────────────────────────────────────────
export const selectTimeTravelYear = (state) =>
    state.scratchGui.timeTravel.year;
