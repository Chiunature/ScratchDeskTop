import React from "react";
import styles from './file-system.css';
import deleteIcon from '../device/delete.svg';
import Filter from "../filter/filter.jsx";
import { defineMessages } from 'react-intl';
import classNames from "classnames";

const messages = defineMessages({
    filterPlaceholder: {
        id: 'gui.library.filterPlaceholder',
        defaultMessage: 'Search',
        description: 'Placeholder text for library search field'
    },
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
    } = props;
    return (
        <div className={styles.fileBox}>
            <div className={styles.fileContainer}>
                <div className={styles.fileLeft}>
                    <button className={styles.leftBtn} onClick={handleClickNew}>新建</button>
                    <button className={styles.leftBtn} onClick={handleClickRecent}>打开最近的文件</button>
                </div>
                <div className={styles.fileRight}>
                    <h1>我的项目</h1>
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
                            <span>名称</span>
                            <span>大小</span>
                            <span>修改日期</span>
                            <span>操作</span>
                        </li>
                    </ul>
                    <ul className={classNames(styles.fileList, fileList.length === 0 ? styles.isempty : '')}>
                        {fileList.length > 0 ? fileList.map((item, index) => {
                            return (
                                <li key={index} onClick={() => handleSelect(index)}>
                                    <span>{item.fileName}</span>
                                    <span>{item.size}</span>
                                    <span>{item.alterTime}</span>
                                    <span><img src={deleteIcon} onClick={(e) => handleDeleteRecord(index, e)} /></span>
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