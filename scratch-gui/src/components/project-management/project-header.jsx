import React, {useCallback, useMemo} from "react";
import styles from "./project-management.css";
import Filter from "../filter/filter.jsx";
import classNames from "classnames";
import messages from "./messages";
import Box from "../box/box.jsx";

const ProjectHeader = (props) => {

    const {
        intl,
        inputRef,
        filesList,
        filterQuery,
        checkedList,
        handleFilterChange,
        handleFilterClear,
        handleSelectAll,
        handleDeleteAll,
        handleCopyAll,
        handleRenameOne
    } = props;

    let isSelectAll = useMemo(() => {
        return checkedList.length > 0 && checkedList.length === filesList.length;
    }, [checkedList, filesList])

    let selectAll = useCallback(() => handleSelectAll(!isSelectAll), [isSelectAll]);

    return (
        <Box className={styles.projectHeader} justifyContent="space-between" alignItems="center">
            <div className={styles.projectTitle}>最近项目</div>
            <Filter
                className={classNames(styles.filterBarItem, styles.filter)}
                inputRef={inputRef}
                filterQuery={filterQuery}
                inputClassName={styles.filterInput}
                placeholderText={intl.formatMessage(messages.filterPlaceholder)}
                onChange={handleFilterChange}
                onClear={handleFilterClear}
            />
            <ul className={classNames(styles.headerList, checkedList.length > 0 ? '' : styles.listDisable)}>
                <li onClick={selectAll}>{isSelectAll ? '取消全选' : '全部选择'}</li>
                <li onClick={handleDeleteAll}>删除</li>
                <li onClick={handleCopyAll}>复制</li>
                <li className={classNames(checkedList.length === 1 ? styles.allowed : styles.disabled)}
                    onClick={handleRenameOne}>重命名
                </li>
            </ul>
        </Box>
    )
}

export default ProjectHeader;
