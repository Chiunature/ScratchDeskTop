import React, { useState, useRef } from 'react';
import styles from './button.css';
import Draggable from 'react-draggable';
import classNames from "classnames";

const SelectExe = (props) => {
    let [dragging, setDragging] = useState(false);
    let [timer, setTimer] = useState(null);
    let inp = useRef();
    
    const onStartDrag = () => {
        setDragging(false);
    }
    const onEndDrag = () => {
        setDragging(true);
    }

    const handleSelectExe = (item, index) => {
        inp.current.value = item;
        props.onSetSelectedExe({ name: item, index });
    }

    const handleInpChange = () => {
        if(inp.current.value.length <= 0) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
            const { index } = props.selectedExe;
            props.onSetSelectedExe({ name: inp.current.value, index });
            const newList = props.exeList.map((item, i) => {
                if(i === index) {
                    item = inp.current.value;
                }
                return item;
            });
            props.onSetExelist(newList);
            localStorage.setItem('exeList', JSON.stringify(newList));
        }, 300);
        setTimer(timer);
    }

    return (
        <Draggable
            disabled={dragging}
            cancel=".input-wrapper"
            bounds={{right: 300, left: -1000, top: -100, bottom: 750}}
        >
            <div className={styles.dropdown}>
                <div className={styles.inpBox}>
                    <input type="text" className={classNames(styles.dropdownSelect, 'input-wrapper')} ref={inp} onChange={handleInpChange} onBlur={onStartDrag} onClick={onEndDrag} defaultValue={props.selectedExe.name}/>
                    <ul className={styles.dropdownOption}>
                        {props.exeList.map((item, index) => {
                            return(<li key={index} onClick={() => handleSelectExe(item, index)}>{item}</li>)
                        })}
                    </ul>
                </div>
            </div>
        </Draggable>
    )
}

export default SelectExe;