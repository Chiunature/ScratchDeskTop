import React, { useState } from 'react';
import styles from './button.css';
import Draggable from 'react-draggable';

const SelectExe = (props) => {
    let [dragging, setDragging] = useState(false);
    
    const onStartDrag = () => {
        setDragging(false);
    }
    const onEndDrag = () => {
        console.log(dragging);
        if(!dragging) setDragging(true);
        else return;
    }

    return (
        <Draggable
            disabled={dragging}
            onMouseDown={onStartDrag}
        >
            <div className={styles.dropdown}>
                <input type="text" className={styles.dropdownSelect} onClick={onEndDrag} onBlur={onStartDrag}/>
                <ul className={styles.dropdownOption}>
                    {props.exeList.map((item, index) => {
                        return(<li key={index}>{item}</li>)
                    })}
                </ul>
            </div>
        </Draggable>
    )
}

export default SelectExe;