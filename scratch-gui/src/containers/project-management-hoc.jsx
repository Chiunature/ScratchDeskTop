import React, { createRef } from "react";
import ProjectManagement from "../components/project-management/project-management.jsx";
import { connect } from "react-redux";
import bindAll from "lodash.bindall";
import styles from "../components/project-management/project-management.css";
import Box from "../components/box/box.jsx";
import Modal from "./modal.jsx";
import { closeFileStytem, showFileStytem } from "../reducers/file-stytem";
import sharedMessages from "../lib/shared-messages";
import { ipc as ipc_Renderer } from "est-link";
import { onLoadedProject, requestNewProject, getIsLoadingUpload, getIsShowingWithoutId, requestProjectUpload } from "../reducers/project-state";
import { setProjectTitle } from "../reducers/project-title";
import PropTypes from "prop-types";
import getMainMsg from "../lib/alerts/message.js";
// import setProgramList from "../lib/setProgramList.js";
import { closeLoadingProject, openLoadingProject } from "../reducers/modals.js";

class ProjectManagementHoc extends React.PureComponent {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleSelect',
            'handleClickNew',
            'handleDeleteRecord',
            'handleFilterClear',
            'handleFilterChange',
            'handleEditRecord',
            'handleFocus',
            'handleBlur',
            'handleCopyRecord',
            'handleSaveOthers',
            'handleSelectAll',
            'handleDeleteAll',
            'handleCopyAll',
            'handleRenameOne',
            'handleSelectOne',
            'handleDisEditable',
            'changeFilesList',
            'preventDefaultEvents',
            'handleScreenAuto',
            'handleOpen'
        ]);
        this.inp = createRef();
        this.state = {
            fileList: [],
            filterQuery: '',
            checkedList: [],
            content: {
                transform: 'translate(-50%, -50%) scale(1)',
            },
            loading: true
        };
        this.mainMsg = getMainMsg(props.intl);
    }

    componentDidMount() {
        this.initFileList();
        this.handleScreenAuto();
        window.addEventListener('resize', this.handleScreenAuto);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleScreenAuto);
    }

    async initFileList() {
        let data = await window.myAPI.ipcInvoke(ipc_Renderer.WORKER, { type: 'get', key: 'files' });
        let newList = [];
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                const isExists = data[i].filePath && await window.myAPI.FileIsExists(data[i].filePath);
                if (isExists) {
                    newList.push(data[i]);
                }
            }
        }
        this.setState({ fileList: newList, loading: false });
        await window.myAPI.ipcInvoke(ipc_Renderer.WORKER, { type: 'set', key: 'files', value: [...newList] });
    }

    async changeFilesList(editable) {
        !editable && this.handleDisEditable();
        this.setState({
            checkedList: this.state.fileList.filter(el => el.checked)
        });
        await window.myAPI.ipcInvoke(ipc_Renderer.WORKER, { type: 'set', key: 'files', value: [...this.state.fileList] });
    }

    preventDefaultEvents(e) {
        if (e) {
            e?.persist();
            e?.stopPropagation();
            e?.nativeEvent?.stopImmediatePropagation();
        }
    }

    async handleFileReader(url, name) {
        try {
            this.props.onLoadingStarted();
            // const currentContent = await this.props.vm.saveProjectSb3();
            let loadingSuccess = false;
            const res = await window.myAPI.readFiles(url, '', {});
            if (res) {
                const arrayBuffer = res.buffer.slice(res.byteOffset, res.byteOffset + res.byteLength);
                this.props.vm.loadProject(arrayBuffer)
                    .then(() => {
                        this.props.onSetProjectTitle(name);
                        loadingSuccess = true;
                    })
                    .catch(error => {
                        log.warn(error);
                        alert(this.props.intl.formatMessage(sharedMessages.loadError));
                    })
                    .then(async () => {
                        this.props.onLoadingFinished('LOADING_VM_FILE_UPLOAD', loadingSuccess);
                        sessionStorage.setItem('openPath', url);
                        // await setProgramList(name, url, arrayBuffer, currentContent);
                    });
            }
        } catch (error) {
            alert(this.props.intl.formatMessage(sharedMessages.loadError));
        }
        window.myAPI.ipcRender({ sendName: 'mainOnFocus' });
    }

    confirmReadyToReplaceProject(message) {
        let readyToReplaceProject = true;
        if (this.props.projectChanged && !this.props.canCreateNew) {
            readyToReplaceProject = confirm(message);
        }
        window.myAPI.ipcRender({ sendName: 'mainOnFocus' });
        return readyToReplaceProject;
    }

    handleClickNew() {
        const readyToReplaceProject = this.confirmReadyToReplaceProject(
            this.props.intl.formatMessage(sharedMessages.replaceProjectWarning)
        );
        this.props.onRequestClose();
        if (readyToReplaceProject) {
            this.props.onClickNew(this.props.canSave && this.props.canCreateNew);
            sessionStorage.removeItem('setDefaultStartBlock');
        }
    }

    async handleFilterClear() {
        let list = await window.myAPI.ipcInvoke(ipc_Renderer.WORKER, { type: 'get', key: 'files' });
        if (list) {
            this.setState(() => ({
                filterQuery: '',
                fileList: list
            }));
        }
    }

    handleFilterChange() {
        const value = this.inp.current.value;
        if (value.length === 0) {
            this.handleFilterClear();
        } else {
            this.state.fileList = this.state.fileList.filter(el => el.fileName.match(value));
            this.setState(() => ({ filterQuery: value }));
        }
    }

    handleBlur(item, e) {
        this.preventDefaultEvents(e);
        const newName = e.target.value;
        const oldName = item.fileName;
        if (newName !== oldName) {
            const oldPath = item.filePath;
            const newPath = oldPath.replace(oldName, newName);
            window.myAPI.changeFileName(oldPath, newPath);
            item.fileName = newName;
            item.filePath = newPath;
        }
        this.changeFilesList();
    }

    handleFocus(e) {
        this.preventDefaultEvents(e);
    }

    handleSelect(item) {
        this.props.onRequestClose();
        if (item.filePath && item.fileName) {
            this.props.requestProjectUpload(this.props.loadingState);
            this.handleFileReader(item.filePath, item.fileName);
        } else {
            this.props.cancelFileUpload(this.props.loadingState);
        }
    }

    handleSelectOne(item, e) {
        this.preventDefaultEvents(e);
        item.checked = !item.checked;
        this.changeFilesList();
    }


    async handleDeleteRecord(item, index, e) {
        this.preventDefaultEvents(e);
        const res = confirm(this.mainMsg.delete);
        if (res) {
            item.filePath && await window.myAPI.deleteFiles(item.filePath, '');
            this.state.fileList.splice(index, 1);
            this.changeFilesList();
        }
        window.myAPI.ipcRender({ sendName: 'mainOnFocus' });
    }

    handleEditRecord(index, e) {
        this.preventDefaultEvents(e);
        this.state.fileList[index].editable = !this.state.fileList[index].editable;
        this.changeFilesList(true);
    }

    async handleCopyRecord(item, e) {
        this.preventDefaultEvents(e);
        const count = this.state.fileList.filter(el => el.fileName.indexOf(item.fileName + ' ') !== -1).length + 1;
        const newFileName = item.fileName + ' ' + count;
        const oldPath = item.filePath;
        const newPath = item.filePath.replace(item.fileName, newFileName);

        let time = window.myAPI.getCurrentTime();
        let timeList = time.split('_');
        timeList[1] = timeList[1].replaceAll('-', ':');
        this.state.fileList.unshift({ ...item, fileName: newFileName, filePath: newPath, alterTime: timeList.join(' ') });

        const res = await window.myAPI.readFiles(oldPath, '', {});
        await window.myAPI.writeFiles(newPath, res, '');
        if (e) this.changeFilesList();
    }

    async handleSaveOthers(item, index, e) {
        this.preventDefaultEvents(e);
        const res = await window.myAPI.readFiles(item.filePath, '', {});
        const filePath = await window.myAPI.ipcInvoke(ipc_Renderer.FILE.SAVE, {
            file: res,
            filename: item.fileName
        });
        if (filePath) {
            await window.myAPI.deleteFiles(item.filePath, '');
            this.state.fileList[index].filePath = filePath;
            this.changeFilesList();
        }
    }

    async handleOpen(item, e) {
        this.preventDefaultEvents(e);
        item.filePath && await window.myAPI.ipcInvoke('openFileLocation', item.filePath);
    }

    handleDisEditable() {
        for (let i = 0; i < this.state.fileList.length; i++) {
            const item = this.state.fileList[i];
            if (item.editable) item.editable = false;
        }
    }

    handleSelectAll(check) {
        for (let i = 0; i < this.state.fileList.length; i++) {
            this.state.fileList[i].checked = check;
        }
        this.changeFilesList();
    }

    async handleDeleteAll() {
        const res = confirm(this.mainMsg.delete);
        if (!res) return;
        for (let i = 0; i < this.state.checkedList.length; i++) {
            const item = this.state.checkedList[i];
            item.filePath ? await window.myAPI.deleteFiles(item.filePath, '') : item.checked = false;
        }
        this.state.fileList = this.state.fileList.filter(el => !el.checked)
        this.changeFilesList();
        window.myAPI.ipcRender({ sendName: 'mainOnFocus' });
    }

    async handleCopyAll() {
        for (let i = 0; i < this.state.checkedList.length; i++) {
            await this.handleCopyRecord(this.state.checkedList[i]);
        }
        this.handleSelectAll(false);
    }

    handleRenameOne(e) {
        for (let i = 0; i < this.state.fileList.length; i++) {
            const item = this.state.fileList[i];
            item.checked && this.handleEditRecord(i, e);
        }
    }

    handleScreenAuto() {
        const designDraftWidth = 1920;
        const designDraftHeight = 1080;
        const scale =
            document.documentElement.clientWidth /
                document.documentElement.clientHeight <
                designDraftWidth / designDraftHeight
                ? document.documentElement.clientWidth / designDraftWidth
                : document.documentElement.clientHeight / designDraftHeight;
        this.setState((state) => ({
            content: { transform: state.content.transform.replace(/scale\([\s*\S*]*\)/, `scale(${scale})`) }
        }));
    }

    render() {
        return (
            <Modal
                className={styles.modalContent}
                contentLabel={this.props.intl.formatMessage(this.props.name)}
                headerClassName={styles.header}
                id="projectManagement"
                onRequestClose={this.props.onRequestClose}
                style={{ content: this.state.content }}
                intl={this.props.intl}
            >
                <Box className={styles.body}>
                    <ProjectManagement
                        {...this.props}
                        inputRef={this.inp}
                        intl={this.props.intl}
                        loading={this.state.loading}
                        filesList={this.state.fileList}
                        filterQuery={this.state.filterQuery}
                        checkedList={this.state.checkedList}
                        onStartSelectingFileUpload={this.props.onStartSelectingFileUpload}
                        handleSelect={this.handleSelect}
                        handleClickNew={this.handleClickNew}
                        handleDeleteRecord={this.handleDeleteRecord}
                        handleFilterClear={this.handleFilterClear}
                        handleFilterChange={this.handleFilterChange}
                        handleEditRecord={this.handleEditRecord}
                        handleFocus={this.handleFocus}
                        handleBlur={this.handleBlur}
                        handleCopyRecord={this.handleCopyRecord}
                        handleSaveOthers={this.handleSaveOthers}
                        handleSelectAll={this.handleSelectAll}
                        handleDeleteAll={this.handleDeleteAll}
                        handleCopyAll={this.handleCopyAll}
                        handleRenameOne={this.handleRenameOne}
                        handleSelectOne={this.handleSelectOne}
                        handleOpen={this.handleOpen}
                        preventDefaultEvents={this.preventDefaultEvents}
                    />
                </Box>
            </Modal>
        )
    }
}

ProjectManagementHoc.propTypes = {
    onRequestClose: PropTypes.func,
    onShowFileSystem: PropTypes.func,
    onClickNew: PropTypes.func,
    onSetProjectTitle: PropTypes.func,
}

const mapStateToProps = (state) => {
    const loadingState = state.scratchGui.projectState.loadingState;
    return {
        isLoadingUpload: getIsLoadingUpload(loadingState),
        isShowingWithoutId: getIsShowingWithoutId(loadingState),
        loadingState: loadingState,
        projectChanged: state.scratchGui.projectChanged,
        vm: state.scratchGui.vm
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(
    {}, stateProps, dispatchProps, ownProps
);

const mapDispatchToProps = (dispatch, ownProps) => ({
    onRequestClose: () => dispatch(closeFileStytem()),
    onShowFileSystem: () => dispatch(showFileStytem()),
    onClickNew: (needSave) => dispatch(requestNewProject(needSave)),
    onSetProjectTitle: (name) => dispatch(setProjectTitle(name)),
    onLoadingStarted: () => dispatch(openLoadingProject()),
    onLoadingFinished: (loadingState, success) => {
        dispatch(onLoadedProject(loadingState, ownProps.canSave, success));
        dispatch(closeLoadingProject());
    },
    requestProjectUpload: loadingState => dispatch(requestProjectUpload(loadingState)),
    cancelFileUpload: loadingState => dispatch(onLoadedProject(loadingState, false, false)),
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ProjectManagementHoc);
