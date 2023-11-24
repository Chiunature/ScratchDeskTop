import React, {useRef, useState} from 'react';
import styles from './device.css';
// import dragImg from './drag.svg';
import delImg from './delete.svg';
import downloadImg from './download.svg';


const SelectExe = (props) => {
    const {exeList, completed, selectedExe, handleSelectExe, onSetExelist, handleCompile, handleStopWatch, handleDelExe} = props;
    let [timer, setTimer] = useState(null);
    let refObj = useRef({});
    
    const handleInpChange = () => {
        const { num } = selectedExe;
        if(refObj.current[num - 1].value.length <= 0) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
            handleSelectExe({ name: refObj.current[num - 1].value, num });
            const newList = exeList.map((item, i) => {
                if(i === num - 1) {
                    item.name = refObj.current[num - 1].value;
                }
                return item;
            });
            onSetExelist(newList);
            localStorage.setItem('exeList', JSON.stringify(newList));
        }, 300);
        setTimer(timer);
    }

    const download = () => {
        if(completed) return;
        handleStopWatch(true);
        handleCompile();
    }
    
    return (
        <ul className={styles.selExe}>
            {exeList.map((item, index) => {
                return (
                    <li className={completed ? styles.ban : ''} key={index} draggable onClick={() => handleSelectExe(item)}>
                        <div><input type='radio' checked={item.checked} readOnly/>{item.num}</div>
                        <div className={styles.edit}>
                            <input className={item.checked ? styles.check : ''} type='text' disabled={!item.checked} ref={(c) => refObj.current[index] = c} defaultValue={item.name} onChange={handleInpChange}/>
                        </div>
                        <div className={styles.img}>
                            <img src={downloadImg} onClick={() => download()}/>
                            <img src={delImg} onClick={() => handleDelExe(item)}/>
                            {/* <img src={dragImg}/> */}
                        </div>
                    </li>
                )
            })}
        </ul>
    );
}

export default SelectExe;