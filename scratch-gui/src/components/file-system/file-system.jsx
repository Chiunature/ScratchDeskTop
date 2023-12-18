import React from "react";
import styles from './file-system.css';
import deleteIcon from '../device/delete.svg';
import Filter from "../filter/filter.jsx";
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from "classnames";
import sharedMessages from "../../lib/shared-messages.js";

const messages = defineMessages({
    filterPlaceholder: {
        id: 'gui.library.filterPlaceholder',
        defaultMessage: 'Search',
        description: 'Placeholder text for library search field'
    },
    newProjectMessage: {
        defaultMessage: "New",
        description: "Menu bar item for creating a new project",
        id: "gui.menuBar.new"
    },
    openRecentMessage: {
        defaultMessage: "Open Recent Files",
        description: "Menu bar item for Open Recent Files",
        id: "gui.menuBar.recent"
    },
    titleMessage: {
        defaultMessage: "My Projects",
        description: "My Projects",
        id: "gui.menuBar.myProjects"
    },
    projectNameMessage: {
        defaultMessage: "Name",
        description: "Project's name",
        id: "gui.menuBar.projectName"
    },
    sizeMessage: {
        defaultMessage: "Size",
        description: "Project's size",
        id: "gui.SpriteInfo.size"
    },
    editMessage: {
        defaultMessage: "Modification date",
        description: "Modification date",
        id: "gui.menuBar.modificationDate"
    },
    operateMessage: {
        defaultMessage: "Operate",
        description: "Operate",
        id: "gui.menuBar.operate"
    }
});

const FileStystem = (props) => {
    const {
        intl,
        inputRef,
        fileList,
        filterQuery,
        handleSelect,
        handleClickNew,
        handleClickRecent,
        handleFilterClear,
        handleDeleteRecord,
        handleFilterChange,
        onStartSelectingFileUpload
    } = props;
    return (
        <div className={styles.fileBox}>
            <div className={styles.fileContainer}>
                <div className={styles.fileLeft}>
                    <button className={styles.leftBtn} onClick={handleClickNew}>{intl.formatMessage(messages.newProjectMessage)}</button>
                    <button className={styles.leftBtn} onClick={handleClickRecent}>{intl.formatMessage(messages.openRecentMessage)}</button>
                    <button className={styles.leftBtn} onClick={onStartSelectingFileUpload}>{intl.formatMessage(sharedMessages.loadFromComputerTitle)}</button>
                </div>
                <div className={styles.fileRight}>
                    <h1>{intl.formatMessage(messages.titleMessage)}</h1>
                    <div className={styles.fileInp}>
                        <Filter
                            className={classNames(
                                styles.filterBarItem,
                                styles.filter
                            )}
                            inputRef={inputRef}
                            filterQuery={filterQuery}
                            inputClassName={styles.filterInput}
                            placeholderText={intl.formatMessage(messages.filterPlaceholder)}
                            onChange={handleFilterChange}
                            onClear={handleFilterClear}
                        />
                    </div>
                    <ul className={styles.fileHead}>
                        <li>
                            <span>{intl.formatMessage(messages.projectNameMessage)}</span>
                            <span>{intl.formatMessage(messages.sizeMessage)}</span>
                            <span>{intl.formatMessage(messages.editMessage)}</span>
                            <span>{intl.formatMessage(messages.operateMessage)}</span>
                        </li>
                    </ul>
                    <ul className={classNames(styles.fileList, fileList.length === 0 ? styles.isempty : '')}>
                        {fileList.length > 0 ? fileList.map((item, index) => {
                            return (
                                <li key={index} onClick={() => handleSelect(index)}>
                                    <span>{item.fileName}</span>
                                    <span>{item.size}</span>
                                    <span>{item.alterTime}</span>
                                    <span><img src={deleteIcon} onClick={(e) => handleDeleteRecord(index, e)}/></span>
                                </li>
                            )
                        }) : <h1 className={styles.empty}>EST3.0</h1>}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default FileStystem;