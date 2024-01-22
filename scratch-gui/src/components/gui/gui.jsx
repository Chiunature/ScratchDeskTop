import classNames from "classnames";
import omit from "lodash.omit";
import PropTypes from "prop-types";
import React from "react";
import {
    defineMessages,
    FormattedMessage,
    injectIntl,
    intlShape,
} from "react-intl";
import { connect } from "react-redux";
import MediaQuery from "react-responsive";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import tabStyles from "react-tabs/style/react-tabs.css";
import VM from "scratch-vm";
import Renderer from "scratch-render";

import Blocks from "../../containers/blocks.jsx";
// import CostumeTab from "../../containers/costume-tab.jsx";
// import TargetPane from "../../containers/target-pane.jsx";
import SoundTab from "../../containers/sound-tab.jsx";
import StageWrapper from "../../containers/stage-wrapper.jsx";
import Loader from "../loader/loader.jsx";
import Box from "../box/box.jsx";
import MenuBar from "../menu-bar/menu-bar.jsx";
import CostumeLibrary from "../../containers/costume-library.jsx";
import BackdropLibrary from "../../containers/backdrop-library.jsx";
// import Watermark from "../../containers/watermark.jsx";

// import Backpack from "../../containers/backpack.jsx";
import WebGlModal from "../../containers/webgl-modal.jsx";
import TipsLibrary from "../../containers/tips-library.jsx";
import Cards from "../../containers/cards.jsx";
import Alerts from "../../containers/alerts.jsx";
import DragLayer from "../../containers/drag-layer.jsx";
import ConnectionModal from "../../containers/connection-modal.jsx";
import TelemetryModal from "../telemetry-modal/telemetry-modal.jsx";

import layout, { STAGE_SIZE_MODES } from "../../lib/layout-constants";
import { resolveStageSize } from "../../lib/screen-utils";
import {themeMap} from '../../lib/themes';
import styles from "./gui.css";
import addExtensionIcon from "./icon--extensions.svg";
import codeIcon from "./icon--code.svg";
// import costumesIcon from "./icon--costumes.svg";
import soundsIcon from "./icon--sounds.svg";
// import loadIcon from "./icon--load.svg";
import Generator from "../../components/generators/generators.jsx";
import errorBoundaryHOC from "../../lib/error-boundary-hoc.jsx";

import DeviceCards from "../../containers/deviceCards.jsx";
import UploadBtn from "../button/uploadBtn.jsx";
import SelectExeBtn from "../button/selectExeBtn.jsx";
import FileSystemHoc from "../../containers/file-system.jsx";

/* const messages = defineMessages({
    addExtension: {
        id: "gui.gui.addExtension",
        description: "Button to add an extension in the target pane",
        defaultMessage: "Add Extension",
    },
}); */

// Cache this value to only retrieve it once the first time.
// Assume that it doesn't change for a session.
let isRendererSupported = null;

const GUIComponent = (props) => {
    const {
        accountNavOpen,
        activeTabIndex,
        alertsVisible,
        authorId,
        authorThumbnailUrl,
        authorUsername,
        basePath,
        backdropLibraryVisible,
        backpackHost,
        backpackVisible,
        blocksTabVisible,
        blocksId,
        cardsVisible,
        deviceVisible,
        canChangeLanguage,
        canChangeTheme,
        canCreateNew,
        canEditTitle,
        canManageFiles,
        canRemix,
        canSave,
        canCreateCopy,
        canShare,
        canUseCloud,
        children,
        connectionModalVisible,
        costumeLibraryVisible,
        costumesTabVisible,
        peripheralName,
        enableCommunity,
        intl,
        isCreating,
        isFullScreen,
        isPlayerOnly,
        isRtl,
        isShared,
        isTelemetryEnabled,
        loading,
        logo,
        renderLogin,
        onClickAbout,
        onClickAccountNav,
        onCloseAccountNav,
        onLogOut,
        onOpenRegistration,
        onToggleLoginOpen,
        onActivateCostumesTab,
        onActivateSoundsTab,
        onActivateTab,
        onClickLogo,
        onExtensionButtonClick,
        onProjectTelemetryEvent,
        onRequestCloseBackdropLibrary,
        onRequestCloseCostumeLibrary,
        onRequestCloseTelemetryModal,
        onSeeCommunity,
        onShare,
        onShowPrivacyPolicy,
        onStartSelectingFileUpload,
        onTelemetryModalCancel,
        onTelemetryModalOptIn,
        onTelemetryModalOptOut,
        onSetIsComplete,
        onSetSourceCompleted,
        onSetExelist,
        onSetSelectedExe,
        onViewDeviceCards,
        onSetVersion,
        onSetGen,
        onActivateDeck,
        showComingSoon,
        soundsTabVisible,
        stageSizeMode,
        targetIsStage,
        telemetryModalVisible,
        tipsLibraryVisible,
        extensionLibraryContent,
        vm,
        isGen,
        code,
        theme,
        completed,
        sourceCompleted,
        isComplete,
        handleCompile,
        handleSelectExe,
        handleInpChange,
        compile,
        progress,
        exeList,
        selectedExe,
        showFileStytem,
        ...componentProps
    } = omit(props, "dispatch");
    if (children) {
        return <Box {...componentProps}>{children}</Box>;
    }
    const tabClassNames = {
        tabs: styles.tabs,
        tab: classNames(tabStyles.reactTabsTab, styles.tab),
        tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
        tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
        tabPanelSelected: classNames(
            tabStyles.reactTabsTabPanelSelected,
            styles.isSelected
        ),
        tabSelected: classNames(
            tabStyles.reactTabsTabSelected,
            styles.isSelected
        ),
    };

    if (isRendererSupported === null) {
        isRendererSupported = Renderer.isSupported();
    }

    const codeEditorOptions = {
        wordWrap: "off", //是否自动换行
        readOnly: true, //是否只读
        folding: true, // 是否折叠
        foldingHighlight: true, // 折叠等高线
        disableLayerHinting: true, // 等宽优化
        emptySelectionClipboard: false, // 空选择剪切板
        selectionClipboard: false, // 选择剪切板
        automaticLayout: true, // 自动布局
        minimap: {
            enabled: true //开启小地图
        }
    }
    
    return (
        <MediaQuery minWidth={layout.fullSizeMinWidth}>
            {(isFullSize) => {
                const stageSize = resolveStageSize(stageSizeMode, isFullSize);

                return isPlayerOnly ? (
                    <StageWrapper
                        isFullScreen={isFullScreen}
                        isRendererSupported={isRendererSupported}
                        isRtl={isRtl}
                        loading={loading}
                        stageSize={STAGE_SIZE_MODES.large}
                        vm={vm}
                    >
                        {alertsVisible ? (
                            <Alerts className={styles.alertsContainer} />
                        ) : null}
                    </StageWrapper>
                ) : (
                    <Box
                        className={styles.pageWrapper}
                        dir={isRtl ? "rtl" : "ltr"}
                        {...componentProps}
                    >
                        {telemetryModalVisible ? (
                            <TelemetryModal
                                isRtl={isRtl}
                                isTelemetryEnabled={isTelemetryEnabled}
                                onCancel={onTelemetryModalCancel}
                                onOptIn={onTelemetryModalOptIn}
                                onOptOut={onTelemetryModalOptOut}
                                onRequestClose={onRequestCloseTelemetryModal}
                                onShowPrivacyPolicy={onShowPrivacyPolicy}
                            />
                        ) : null}
                        {loading ? <Loader /> : null}
                        {isCreating ? (
                            <Loader messageId="gui.loader.creating" />
                        ) : null}
                        {isRendererSupported ? null : (
                            <WebGlModal isRtl={isRtl} />
                        )}
                        {tipsLibraryVisible ? <TipsLibrary onActivateDeck={onActivateDeck}/> : null}
                        {cardsVisible ? <Cards /> : null}
                        {deviceVisible ? (
                            <DeviceCards 
                                handleCompile={handleCompile} 
                                completed={completed} 
                                exeList={exeList} 
                                selectedExe={selectedExe} 
                                onSetSelectedExe={onSetSelectedExe} 
                                onSetExelist={onSetExelist}/>
                        ) : null}
                        {alertsVisible ? (
                            <Alerts className={styles.alertsContainer} />
                        ) : null}
                        {connectionModalVisible ? (
                            <ConnectionModal vm={vm} compile={compile} onSetSourceCompleted={onSetSourceCompleted} />
                        ) : null}
                        {costumeLibraryVisible ? (
                            <CostumeLibrary
                                vm={vm}
                                onRequestClose={onRequestCloseCostumeLibrary}
                            />
                        ) : null}
                        {backdropLibraryVisible ? (
                            <BackdropLibrary
                                vm={vm}
                                onRequestClose={onRequestCloseBackdropLibrary}
                            />
                        ) : null}
                        {showFileStytem && (
                            <FileSystemHoc vm={vm} intl={intl} canSave={canSave} canCreateNew={canCreateNew} onStartSelectingFileUpload={onStartSelectingFileUpload}/>
                        )}
                        {peripheralName && !soundsTabVisible ? (
                            <>
                                <SelectExeBtn 
                                    isComplete={isComplete} 
                                    progress={progress} 
                                    completed={completed} 
                                    handleCompile={handleCompile} 
                                    isRtl={isRtl} 
                                    onSetSelectedExe={onSetSelectedExe} 
                                    onSetExelist={onSetExelist} 
                                    exeList={exeList} 
                                    selectedExe={selectedExe}
                                />
                            </>
                        ) : null}

                        <MenuBar
                            accountNavOpen={accountNavOpen}
                            authorId={authorId}
                            authorThumbnailUrl={authorThumbnailUrl}
                            authorUsername={authorUsername}
                            canChangeLanguage={canChangeLanguage}
                            blocksId={blocksId}
                            canChangeTheme={canChangeTheme}
                            canCreateCopy={canCreateCopy}
                            canCreateNew={canCreateNew}
                            canEditTitle={canEditTitle}
                            canManageFiles={canManageFiles}
                            canRemix={canRemix}
                            canSave={canSave}
                            canShare={canShare}
                            className={styles.menuBarPosition}
                            enableCommunity={enableCommunity}
                            isShared={isShared}
                            logo={logo}
                            renderLogin={renderLogin}
                            showComingSoon={showComingSoon}
                            onClickAbout={onClickAbout}
                            onClickAccountNav={onClickAccountNav}
                            onClickLogo={onClickLogo}
                            onCloseAccountNav={onCloseAccountNav}
                            onLogOut={onLogOut}
                            onOpenRegistration={onOpenRegistration}
                            onProjectTelemetryEvent={onProjectTelemetryEvent}
                            onSeeCommunity={onSeeCommunity}
                            onShare={onShare}
                            onStartSelectingFileUpload={
                                onStartSelectingFileUpload
                            }
                            onToggleLoginOpen={onToggleLoginOpen}
                            onActivateDeck={onActivateDeck}
                        />
                        <Box className={styles.bodyWrapper}>
                            <Box className={styles.flexWrapper}>
                                <Box className={styles.editorWrapper}>
                                    <Tabs
                                        forceRenderTabPanel
                                        className={tabClassNames.tabs}
                                        selectedIndex={activeTabIndex}
                                        selectedTabClassName={
                                            tabClassNames.tabSelected
                                        }
                                        selectedTabPanelClassName={
                                            tabClassNames.tabPanelSelected
                                        }
                                        onSelect={onActivateTab}
                                    >
                                        <TabList
                                            className={tabClassNames.tabList}
                                        >
                                            <Tab className={tabClassNames.tab}>
                                                <img
                                                    draggable={false}
                                                    src={codeIcon}
                                                />
                                                <FormattedMessage
                                                    defaultMessage="Code"
                                                    description="Button to get to the code panel"
                                                    id="gui.gui.codeTab"
                                                />
                                            </Tab>
                                            {/* <Tab
                                        className={tabClassNames.tab}
                                        onClick={onActivateCostumesTab}
                                    >
                                        <img
                                            draggable={false}
                                            src={costumesIcon}
                                        />
                                        {targetIsStage ? (
                                            <FormattedMessage
                                                defaultMessage="Backdrops"
                                                description="Button to get to the backdrops panel"
                                                id="gui.gui.backdropsTab"
                                            />
                                        ) : (
                                            <FormattedMessage
                                                defaultMessage="Costumes"
                                                description="Button to get to the costumes panel"
                                                id="gui.gui.costumesTab"
                                            />
                                        )}
                                    </Tab> */}
                                            <Tab className={tabClassNames.tab}>
                                                <img
                                                    draggable={false}
                                                    src={soundsIcon}
                                                />
                                                <FormattedMessage
                                                    defaultMessage="Sounds"
                                                    description="Button to get to the sounds panel"
                                                    id="gui.gui.soundsTab"
                                                />
                                            </Tab>
                                        </TabList>
                                        <TabPanel
                                            className={tabClassNames.tabPanel}
                                        >
                                            <Box
                                                className={styles.blocksWrapper}
                                            >
                                                <Blocks
                                                    key={`${blocksId}/${theme}`}
                                                    canUseCloud={canUseCloud}
                                                    grow={1}
                                                    isVisible={blocksTabVisible}
                                                    options={{
                                                        media: `${basePath}static/${themeMap[theme].blocksMediaFolder}/`
                                                    }}
                                                    stageSize={stageSize}
                                                    theme={theme}
                                                    vm={vm}
                                                    compile={compile}
                                                />
                                            </Box>
                                            <Box
                                                className={
                                                    styles.extensionButtonContainer
                                                }
                                            >
                                                <button
                                                    className={
                                                        styles.extensionButton
                                                    }
                                                    // title={intl.formatMessage(
                                                    //     messages.addExtension
                                                    // )}
                                                    onClick={
                                                        onExtensionButtonClick
                                                    }
                                                    disabled={extensionLibraryContent.length > 0 ? false : true}
                                                >
                                                    <img
                                                        className={
                                                            styles.extensionButtonIcon
                                                        }
                                                        draggable={false}
                                                        src={addExtensionIcon}
                                                    />
                                                </button>
                                            </Box>
                                            <Box className={styles.watermark}>
                                                {/* <Watermark /> */}
                                            </Box>
                                        </TabPanel>
                                        {/* <TabPanel className={tabClassNames.tabPanel}>
                                    {costumesTabVisible ? <CostumeTab vm={vm} /> : null}
                                </TabPanel> */}
                                        <TabPanel
                                            className={tabClassNames.tabPanel}
                                        >
                                            {soundsTabVisible ? (
                                                <SoundTab vm={vm} />
                                            ) : null}
                                        </TabPanel>
                                    </Tabs>
                                    <br />
                                    {/* {backpackVisible ? (
                                <Backpack host={backpackHost} />
                            ) : null} */}
                                </Box>

                                <Box
                                    className={classNames(
                                        styles.stageAndTargetWrapper,
                                        styles[stageSize]
                                    )}
                                >
                                    <Generator onSetGen={onSetGen} code={code} isGen={isGen} codeEditorLanguage="cpp" codeEditorOptions= {codeEditorOptions} codeEditorTheme="vs"/>
                                            {/* <StageWrapper
                                        isFullScreen={isFullScreen}
                                        isRendererSupported={isRendererSupported}
                                        isRtl={isRtl}
                                        stageSize={stageSize}
                                        vm={vm}
                                    /> <Box className={styles.targetWrapper}>
                                        <TargetPane
                                            stageSize={stageSize}
                                            vm={vm}
                                        />
                                    </Box> */}
                                </Box>
                            </Box>
                        </Box>
                        <DragLayer />
                    </Box>
                );
            }}
        </MediaQuery>
    );
};

GUIComponent.propTypes = {
    accountNavOpen: PropTypes.bool,
    activeTabIndex: PropTypes.number,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
    backdropLibraryVisible: PropTypes.bool,
    backpackHost: PropTypes.string,
    backpackVisible: PropTypes.bool,
    basePath: PropTypes.string,
    blocksTabVisible: PropTypes.bool,
    canChangeLanguage: PropTypes.bool,
    canChangeTheme: PropTypes.bool,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canManageFiles: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    canUseCloud: PropTypes.bool,
    cardsVisible: PropTypes.bool,
    deviceVisible: PropTypes.bool,
    children: PropTypes.node,
    costumeLibraryVisible: PropTypes.bool,
    costumesTabVisible: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    intl: intlShape.isRequired,
    isCreating: PropTypes.bool,
    isFullScreen: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    loading: PropTypes.bool,
    logo: PropTypes.string,
    onActivateCostumesTab: PropTypes.func,
    onActivateSoundsTab: PropTypes.func,
    onActivateTab: PropTypes.func,
    onClickAccountNav: PropTypes.func,
    onClickLogo: PropTypes.func,
    onCloseAccountNav: PropTypes.func,
    onExtensionButtonClick: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onRequestCloseBackdropLibrary: PropTypes.func,
    onRequestCloseCostumeLibrary: PropTypes.func,
    onRequestCloseTelemetryModal: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onShare: PropTypes.func,
    onShowPrivacyPolicy: PropTypes.func,
    onStartSelectingFileUpload: PropTypes.func,
    onTabSelect: PropTypes.func,
    onTelemetryModalCancel: PropTypes.func,
    onTelemetryModalOptIn: PropTypes.func,
    onTelemetryModalOptOut: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    renderLogin: PropTypes.func,
    showComingSoon: PropTypes.bool,
    soundsTabVisible: PropTypes.bool,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    targetIsStage: PropTypes.bool,
    theme: PropTypes.string,
    telemetryModalVisible: PropTypes.bool,
    tipsLibraryVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired,
    compile: PropTypes.object,
    progress: PropTypes.number,
    selectedExe: PropTypes.object
};
GUIComponent.defaultProps = {
    backpackHost: null,
    backpackVisible: false,
    basePath: "./",
    blocksId: 'original',
    canChangeLanguage: true,
    canChangeTheme: true,
    canCreateNew: false,
    canEditTitle: false,
    canManageFiles: true,
    canRemix: false,
    canSave: false,
    canCreateCopy: false,
    canShare: false,
    canUseCloud: false,
    enableCommunity: false,
    isCreating: false,
    isShared: false,
    loading: false,
    showComingSoon: false,
    stageSizeMode: STAGE_SIZE_MODES.large,
};

const mapStateToProps = (state) => ({
    // This is the button's mode, as opposed to the actual current state
    blocksId: state.scratchGui.timeTravel.year.toString(),
    stageSizeMode: state.scratchGui.stageSize.stageSize,
    theme: state.scratchGui.theme.theme,
    progress: state.scratchGui.connectionModal.progress,
    selectedExe: state.scratchGui.mode.selectedExe
});
const mapDispatchToProps = (dispatch) => ({});
// export default injectIntl(connect(
//     mapStateToProps
// )(GUIComponent));
export default errorBoundaryHOC("GUI")(
    injectIntl(connect(mapStateToProps, mapDispatchToProps)(GUIComponent))
);
