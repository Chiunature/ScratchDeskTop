import React from 'react';
import classNames from "classnames";
import styles from "./project-management.css";
import emptyIcon from "./icon--empty.svg";
import Input from "../forms/input.jsx";
import moreIcon from "./icon--more.svg";


const ProjectFilesListItem = (props) => {

    const {
        item,
        index,
        showOperator,
        checkedList,
        handleBlur,
        handleFocus,
        handleSelect,
        handleSelectOne
    } = props;


    return (
        <li onClick={() => handleSelect(item)}>
            <div
                className={classNames(styles.projectNewFile, item.checked && checkedList.length > 0 ? styles.available : '')}>
                <img src={item.pic_url ? item.pic_url : emptyIcon} alt=''/>
                <Input className={styles.selected} type="radio" checked={item.checked} readOnly
                       onClick={(e) => handleSelectOne(index, e)}/>
                <img className={styles.projectMore} src={moreIcon} alt="" onClick={(e) => showOperator(item, index, e)}/>
            </div>
            <span className={styles.name}>
                                  {item.editable ? <Input className={styles.fileInpSpan}
                                                          type="text"
                                                          defaultValue={item.fileName}
                                                          onBlur={(e) => handleBlur(index, e)}
                                                          onClick={handleFocus}
                                  /> : <>{item.fileName}</>}
                            </span>
            <span className={styles.time}>{item.alterTime}</span>
        </li>
    )
}

export default ProjectFilesListItem;
