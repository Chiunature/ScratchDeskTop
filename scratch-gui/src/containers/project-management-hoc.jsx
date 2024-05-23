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
            'preventDefaultEvents',
            'handleScreenAuto'
        ]);
        this.inp = createRef();
        this.state = {
            fileList: [],
            filterQuery: '',
            checkedList: [],
            content: {
                transform: 'translate(-50%, -50%) scale(1)',
            }
        };
    }

    componentDidMount() {
        this.initFileList();
        window.addEventListener('resize', this.handleScreenAuto);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleScreenAuto);
    }

    async initFileList() {
        let data = window.myAPI.getStoreValue('files');
        let newList = [];
        if(data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                const isExists = data[i].filePath && await window.myAPI.FileIsExists(data[i].filePath);
                if(isExists) newList.push(data[i]);
            }
        }
        data && this.setState({fileList: newList});
    }

    changeFilesList(editable) {
        !editable && this.handleDisEditable();
        setTimeout(() => window.myAPI.setStoreValue('files', this.state.fileList));
        this.setState({
            checkedList: this.state.fileList.filter(el => el.checked)
        });
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

    handleBlur(item, e) {
        this.preventDefaultEvents(e);
        const newName = e.target.value;
        const oldName = item.fileName;
        if(newName !== oldName) {
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
        this.props.onSetProjectTitle(item.fileName);
        this.handleFileReader(item.filePath);
    }

    handleSelectOne(item, e) {
        this.preventDefaultEvents(e);
        item.checked = !item.checked;
        this.changeFilesList();
    }


    async handleDeleteRecord(item, index, e) {
        this.preventDefaultEvents(e);
        const res = await window.myAPI.ipcInvoke(ipc_Renderer.SEND_OR_ON.FILE.DELETE);
        if (res === 1) {
            item.filePath && await window.myAPI.deleteFiles(item.filePath, '');
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
        const count = this.state.fileList.filter(el => el.fileName.indexOf(item.fileName + ' ') !== -1).length + 1;
        const newFileName = item.fileName + ' ' + count;
        const oldPath = item.filePath;
        const newPath = item.filePath.replace(item.fileName, newFileName);

        let time = window.myAPI.getCurrentTime();
        let timeList = time.split('_');
        timeList[1] = timeList[1].replaceAll('-', ':');
        this.state.fileList.unshift({...item, fileName: newFileName, filePath: newPath, alterTime: timeList.join(' ')});

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
        if(filePath) {
            await window.myAPI.deleteFiles(item.filePath, '');
            this.state.fileList[index].filePath  = filePath;
            this.changeFilesList();
        }
    }

    handleDisEditable() {
        for (let i = 0; i < this.state.fileList.length; i++) {
            const item = this.state.fileList[i];
            if(item.editable) item.editable = false;
        }
    }

    handleSelectAll(check) {
        for (let i = 0; i < this.state.fileList.length; i++) {
            this.state.fileList[i].checked = check;
        }
        this.changeFilesList();
    }

    async handleDeleteAll() {
        const res = await window.myAPI.ipcInvoke(ipc_Renderer.SEND_OR_ON.FILE.DELETE);
        if (res === 0) return;
        for (let i = 0; i < this.state.checkedList.length; i++) {
            const item = this.state.checkedList[i];
            item.filePath ? await window.myAPI.deleteFiles(item.filePath, '') : item.checked = false;
        }
        this.state.fileList = this.state.fileList.filter(el => !el.checked)
        this.changeFilesList();
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
            content : {transform: state.content.transform.replace(/scale\([\s*\S*]*\)/, `scale(${scale})`)}
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
                style={{content: this.state.content}}
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
