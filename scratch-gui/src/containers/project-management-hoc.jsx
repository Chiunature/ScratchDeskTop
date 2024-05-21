import React, {createRef} from "react";
import ProjectManagement from "../components/project-management/project-management.jsx";
import {connect} from "react-redux";
import bindAll from "lodash.bindall";
import styles from "../components/project-management/project-management.css";
import Box from "../components/box/box.jsx";
import Modal from "./modal.jsx";
import {showFileStytem} from "../reducers/file-stytem";
import sharedMessages from "../lib/shared-messages";
import {ipc as ipc_Renderer} from "est-link";
import {requestNewProject} from "../reducers/project-state";
import {setProjectTitle} from "../reducers/project-title";
import PropTypes from "prop-types";

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
            'preventDefaultEvents'
        ]);
        this.inp = createRef();
        this.state = {
            fileList: [],
            filterQuery: '',
            checkedList: []
        };
    }

    componentDidMount() {
        let data = window.myAPI.getStoreValue('files');
        data && this.setState({fileList: data});
    }

    changeFilesList(editable) {
        !editable && this.handleDisEditable();
        window.myAPI.setStoreValue('files', this.state.fileList);
        this.setState((state) => ({
            fileList: [...state.fileList],
            checkedList: [...state.checkedList],
        }));
    }

    preventDefaultEvents(e) {
        if (e) {
            e?.persist();
            e?.stopPropagation();
            e?.nativeEvent?.stopImmediatePropagation();
        }
    }

    async handleFileReader(url) {
        sessionStorage.setItem('openPath', url);
        const res = await window.myAPI.readFiles(url, '', {});
        if (res) {
            const arrayBuffer = res.buffer.slice(res.byteOffset, res.byteOffset + res.byteLength);
            this.props.vm.loadProject(arrayBuffer).then(() => this.props.onShowFileSystem());
        }
    }

    confirmReadyToReplaceProject(message) {
        let readyToReplaceProject = true;
        if (this.props.projectChanged && !this.props.canCreateNew) {
            readyToReplaceProject = confirm(message);
        }
        return readyToReplaceProject;
    }

    handleClickNew() {
        const readyToReplaceProject = this.confirmReadyToReplaceProject(
            this.props.intl.formatMessage(sharedMessages.replaceProjectWarning)
        );
        this.props.onShowFileSystem();
        readyToReplaceProject && this.props.onClickNew(this.props.canSave && this.props.canCreateNew);
    }

    handleFilterClear() {
        let list = window.myAPI.getStoreValue('files');
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
            this.setState(() => ({filterQuery: value}));
        }
    }

    handleBlur(index, e) {
        this.preventDefaultEvents(e);
        const newName = e.target.value;
        const oldName = this.state.fileList[index].fileName;
        if(newName !== oldName) {
            this.state.fileList[index].fileName = newName;
            const oldPath = this.state.fileList[index].filePath;
            const newPath = this.state.fileList[index].filePath.replace(this.state.fileList[index].fileName, e.target.value);
            window.myAPI.changeFileName(oldPath, newPath);
        }
        this.state.fileList[index].editable = false;
        this.changeFilesList();
    }

    handleFocus(e) {
        this.preventDefaultEvents(e);
    }

    handleSelect(item) {
        this.props.onSetProjectTitle(item.fileName);
        this.handleFileReader(item.filePath);
    }

    handleSelectOne(index, e) {
        this.preventDefaultEvents(e);
        this.state.fileList[index].checked = !this.state.fileList[index].checked;
        this.state.checkedList = this.state.fileList.filter(el => el.checked);
        this.changeFilesList();
    }


    async handleDeleteRecord(index, e) {
        this.preventDefaultEvents(e);
        const res = await window.myAPI.ipcInvoke(ipc_Renderer.SEND_OR_ON.FILE.DELETE);
        if (res === 1) {
            this.state.fileList[index].filePath && window.myAPI.deleteFiles(this.state.fileList[index].filePath, '');
            this.state.fileList.splice(index, 1);
            this.changeFilesList();
        }
    }

    handleEditRecord(index, e) {
        this.preventDefaultEvents(e);
        this.state.fileList[index].editable = !this.state.fileList[index].editable;
        this.changeFilesList(true);
    }

    async handleCopyRecord(item, e) {
        this.preventDefaultEvents(e);
        let count = 1;
        for (let i = 0; i < this.state.fileList.length; i++) {
            if (this.state.fileList[i].fileName.indexOf(item.fileName + ' ') !== -1) {
                count++;
            }
        }
        const newFileName = item.fileName + ' ' + count;
        const oldPath = item.filePath;
        const newPath = item.filePath.replace(item.fileName, newFileName);

        let time = window.myAPI.getCurrentTime();
        let timeList = time.split('_');
        timeList[1] = timeList[1].replaceAll('-', ':');

        const obj = {...item, fileName: newFileName, filePath: newPath, alterTime: timeList.join(' ')};
        this.state.fileList.unshift(obj);

        const res = await window.myAPI.readFiles(oldPath, '', {});
        window.myAPI.writeFiles(newPath, res, '');
        if (e) this.changeFilesList();
    }

    async handleSaveOthers(item, index, e) {
        this.preventDefaultEvents(e);
        const res = await window.myAPI.readFiles(item.filePath, '', {});
        window.myAPI.deleteFiles(item.filePath, '');
        this.state.fileList[index].filePath = await window.myAPI.ipcInvoke(ipc_Renderer.FILE.SAVE, {
            file: res,
            filename: item.fileName
        });
        this.changeFilesList();
    }

    handleDisEditable() {
        for (let i = 0; i < this.state.fileList.length; i++) {
            const item = this.state.fileList[i];
            item.editable = false;
        }
    }

    handleSelectAll(check) {
        for (let i = 0; i < this.state.fileList.length; i++) {
            const item = this.state.fileList[i];
            item.checked = check;
        }
        this.state.checkedList = this.state.fileList.filter(el => el.checked);
        this.changeFilesList();
    }

    async handleDeleteAll() {
        const res = await window.myAPI.ipcInvoke(ipc_Renderer.SEND_OR_ON.FILE.DELETE);
        if (res === 0) return;
        for (let i = 0; i < this.state.checkedList.length; i++) {
            const item = this.state.checkedList[i];
            item.filePath ? window.myAPI.deleteFiles(item.filePath, '') : item.checked = false;
        }
        this.state.fileList = this.state.fileList.filter(el => !el.checked);
        this.state.checkedList = this.state.fileList.filter(el => el.checked);
        this.changeFilesList();
    }

     handleCopyAll() {
        for (let i = 0; i < this.state.checkedList.length; i++) {
            const item = this.state.checkedList[i];
            this.handleCopyRecord(item);
        }
        this.handleSelectAll(false);
    }

    handleRenameOne(e) {
        for (let i = 0; i < this.state.fileList.length; i++) {
            const item = this.state.fileList[i];
            item.checked && this.handleEditRecord(i, e);
        }
    }

    render() {
        return (
            <Modal
                className={styles.modalContent}
                contentLabel={this.props.intl.formatMessage(this.props.name)}
                headerClassName={styles.header}
                id="projectManagement"
                onRequestClose={this.props.onRequestClose}
            >
                <Box className={styles.body}>
                    <ProjectManagement
                        {...this.props}
                        inputRef={this.inp}
                        intl={this.props.intl}
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


const mapStateToProps = (state) => ({
    projectChanged: state.scratchGui.projectChanged
})

const mapDispatchToProps = (dispatch) => ({
    onRequestClose: () => dispatch(showFileStytem()),
    onShowFileSystem: () => dispatch(showFileStytem()),
    onClickNew: (needSave) => dispatch(requestNewProject(needSave)),
    onSetProjectTitle: (name) => dispatch(setProjectTitle(name))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectManagementHoc);
