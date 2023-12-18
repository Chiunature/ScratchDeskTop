import React, { Component, createRef } from 'react'
import FileStystem from '../components/file-system/file-system.jsx';
import { connect } from 'react-redux';
import { showFileStytem } from '../reducers/file-stytem.js';
import Modal from "./modal.jsx";
import { dataURLToBlob, ipc } from '../utils/ipcRender.js';
import { requestNewProject } from '../reducers/project-state.js';
import sharedMessages from '../lib/shared-messages.js';

class FileSystemHoc extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            filterQuery: ''
        };
        this.inp = createRef();
    }


    componentDidMount() {
        let data = localStorage.getItem('file');
        if (data) {
            this.setState(() => ({
                fileList: JSON.parse(data)
            }));
        }
    }

    handleFileReader(url) {
        const { vm, onShowFileStytem } = this.props;
        const fr = new FileReader();
        fr.readAsArrayBuffer(dataURLToBlob(url));
        fr.onload = (e) => {
            vm.loadProject(e.target.result)
                .then(() => {
                    onShowFileStytem(false);
                });
        }
    }

    handleSelect(index) {
        const list = JSON.parse(localStorage.getItem('file'));
        this.handleFileReader(list[index].url);
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
        this.props.onShowFileStytem(false);
        if (readyToReplaceProject) {
            this.props.onClickNew(
                this.props.canSave && this.props.canCreateNew
            );
        }
    }

    handleClickRecent() {
        if (localStorage.getItem('recentFile')) {
            const obj = JSON.parse(localStorage.getItem('recentFile'));
            this.handleFileReader(obj.url);
        }else {
            return;
        }
    }

    handleDeleteRecord(index, e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        ipc({
            sendName: 'delRecord',
            eventName: 'return_delRecord',
            callback: (event, result) => {
                if(result === 1) {
                    this.state.fileList.splice(index, 1);
                    localStorage.setItem('file', JSON.stringify(this.state.fileList));
                    this.setState((state) => ({
                        fileList: state.fileList
                    }));
                }else {
                    return;
                }
            }
        });
    }

    handleFilterClear() {
        this.setState({ filterQuery: '' });
    }

    handleFilterChange() {
        const value = this.inp.current.value;
        if (value.length === 0) {
            const list = JSON.parse(localStorage.getItem('file'));
            this.setState(() => ({
                filterQuery: value,
                fileList: list
            }));
        } else {
            this.state.fileList = this.state.fileList.filter(el => (el.fileName.match(value) || el.size.match(value) || el.alterTime.match(value)));
            this.setState(() => ({
                filterQuery: value
            }));
        }
    }

    render() {
        return (
            <Modal fullScreen
                id="fileStystem"
                onRequestClose={this.props.onRequestClose}>
                <FileStystem
                    inputRef={this.inp}
                    intl={this.props.intl}
                    fileList={this.state.fileList}
                    filterQuery={this.state.filterQuery}
                    onStartSelectingFileUpload={this.props.onStartSelectingFileUpload}
                    handleSelect={this.handleSelect.bind(this)}
                    handleClickNew={this.handleClickNew.bind(this)}
                    handleClickRecent={this.handleClickRecent.bind(this)}
                    handleDeleteRecord={this.handleDeleteRecord.bind(this)}
                    handleFilterClear={this.handleFilterClear.bind(this)}
                    handleFilterChange={this.handleFilterChange.bind(this)}
                />
            </Modal>
        )
    }
}


const mapStateToProps = (state) => ({
    projectChanged: state.scratchGui.projectChanged
});

const mapDispatchToProps = (dispatch) => ({
    onRequestClose: () => dispatch(showFileStytem()),
    onShowFileStytem: (n) => dispatch(showFileStytem(n)),
    onClickNew: (needSave) => dispatch(requestNewProject(needSave)),
});
export default connect(mapStateToProps, mapDispatchToProps)(FileSystemHoc);