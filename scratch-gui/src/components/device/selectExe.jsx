import React, { useRef, useState } from 'react';
import styles from './device.css';
import delImg from './delete.svg';
import downloadImg from './download.svg';


const SelectExe = (props) => {
    const { exeList, completed, selectedExe, handleSelectExe, onSetExelist, handleCompile, handleDelExe } = props;
    let [timer, setTimer] = useState(null);
    let refObj = useRef({});
    let refUl = useRef();

    const handleInpChange = () => {
        const { index } = selectedExe;
        if (refObj.current[index].value.length <= 0) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
            const newList = exeList.map((item, i) => {
                if (i === index) {
                    item.name = refObj.current[index].value;
                }
                return item;
            });
            onSetExelist(newList);
            window.myAPI.setStoreValue('exeList', JSON.stringify(newList));
        }, 300);
        setTimer(timer);
    }

    const download = (item) => {
        if (completed) return;
        window.myAPI.setStoreValue('selItem', JSON.stringify(item));
        handleCompile();
    }


    return (
        <ul className={styles.selExe} ref={refUl}>
            {exeList.map((item, index) => {
                return (
                    <li className={completed ? styles.ban : ''} key={item.num} draggable onClick={() => handleSelectExe(item, index)}>
                        <div><input type='radio' checked={item.checked} readOnly />{item.num}</div>
                        <div className={styles.edit}>
                            <input className={item.checked ? styles.check : ''} type='text' disabled={!item.checked} ref={(c) => refObj.current[index] = c} defaultValue={item.name} onChange={handleInpChange} />
                        </div>
                        <div className={styles.img}>
                            <img src={downloadImg} onClick={() => download(item)} />
                            <img src={delImg} onClick={(e) => handleDelExe(item, e)} />
                        </div>
                    </li>
                )
            })}
        </ul>
    );
}

export default SelectExe;