import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styles from "./project-management.css";
import addIcon from "./icon--add.svg";
import Box from "../box/box.jsx";
import messages from "./messages";
import ProjectFilesListItem from "./project-files-listItem.jsx";
import ReactDOM from "react-dom";
import Spinner from "../spinner/spinner.jsx";

const Portal = ({ children }) =>
    typeof document === 'object' ? ReactDOM.createPortal(children, document.body) : null;

const ProjectFilesList = (props) => {
    const {
        intl,
        loading,
        filesList,
        handleClickNew,
        handleDeleteRecord,
        handleEditRecord,
        handleCopyRecord,
        handleSaveOthers,
        preventDefaultEvents,
    } = props;

    let [selectItem, setSelectItem] = useState({});
    let refOperator = useRef(null)

    useEffect(() => {
        document.addEventListener('mouseup', showOperator);

        return () => {
            document.removeEventListener('mouseup', showOperator);
        }
    }, []);

    let isload = useMemo(() => loading, [loading]);
    let obj = useMemo(() => selectItem, [selectItem]);
    let setObj = useCallback((item, index) => setSelectItem({item, index}), [obj]);
    let showOperator = useCallback((item, index, e) => clickMore(item, index, e), [refOperator]);

    function clickMore(item, index, e) {
        preventDefaultEvents(e);
        if(typeof item === 'object' && typeof index === 'number') setObj(item, index);
        if(e) {
            if(!refOperator.current.contains(e.target) && e.target.className.indexOf('project-more') === -1) {
                refOperator.current.style.display = 'none';
                return;
            }
            const {x, y} = e.target.getBoundingClientRect();
            refOperator.current.style.left = `${x + 32}px`;
            refOperator.current.style.top = `${y - 100}px`;
            refOperator.current.style.display = 'block';
        }else {
            refOperator.current.style.display = 'none';
        }
    }

    return (
        <Box className={styles.projectFiles}>
            {isload && <div className={styles.listMask}><Spinner className={styles.listSpinner} level="success"/></div>}
            <ul className={styles.projectFilesList}>
                <li onClick={handleClickNew}>
                    <div className={styles.projectNewFile}>
                        <img src={addIcon} alt=''/>
                    </div>
                    <span>{intl.formatMessage(messages.newProjectMessage)}</span>
                </li>
                {filesList.length > 0 && filesList.map((item, index) => {
                    return (<ProjectFilesListItem showOperator={showOperator} refOperator={refOperator} key={item.filePath} index={index} item={item} {...props}/>)
                })}
            </ul>
            <Portal>
                <ul className={styles.operator} ref={refOperator}>
                    <li onClick={(e) => handleDeleteRecord(obj.item, obj.index, e)}>{intl.formatMessage(messages.deleteMessage)}</li>
                    <li onClick={(e) => handleCopyRecord(obj.item, e)}>{intl.formatMessage(messages.copyMessage)}</li>
                    <li onClick={(e) => handleEditRecord(obj.index, e)}>{intl.formatMessage(messages.renameMessage)}</li>
                    <li onClick={(e) => handleSaveOthers(obj.item, obj.index, e)}>{intl.formatMessage(messages.saveAsMessage)}</li>
                </ul>
            </Portal>
        </Box>
    )
}

export default ProjectFilesList;
