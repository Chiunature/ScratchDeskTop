import React, { useRef, useState } from 'react';
import styles from './device.css';
// import dragImg from './drag.svg';
import delImg from './delete.svg';
import downloadImg from './download.svg';


const SelectExe = (props) => {
    const { exeList, completed, selectedExe, handleSelectExe, onSetExelist, handleCompile, handleDelExe } = props;
    let [timer, setTimer] = useState(null);
    // let [currentLi, setCurrentLi] = useState(null);
    // let [cacheList, setCacheList] = useState([]);
    let refObj = useRef({});
    let refUl = useRef();

    const handleInpChange = () => {
        const { num } = selectedExe;
        if (refObj.current[num - 1].value.length <= 0) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
            const newList = exeList.map((item, i) => {
                if (i === num - 1) {
                    item.name = refObj.current[num - 1].value;
                }
                return item;
            });
            onSetExelist(newList);
            localStorage.setItem('exeList', JSON.stringify(newList));
        }, 300);
        setTimer(timer);
    }

    const download = (item) => {
        if (completed) return;
        localStorage.setItem('selItem', JSON.stringify(item));
        handleCompile();
    }

    /* const swapEl = (currentIndex, targetIndex) => {
        const newList = [...exeList];
        [newList[currentIndex], newList[targetIndex]] = [newList[targetIndex], newList[currentIndex]];
        onSetExelist(newList);
        setCacheList(newList);
    }

    const dragStartUl = (e) => {
        e.dataTransfer.effectAllowed = 'move';
        setCurrentLi(e.target);
        setTimeout(() => {
            if (currentLi) currentLi.classList.add('moving');
        });
    }

    const dragEnterUl = (e) => {
        e.preventDefault();
        const list = refUl.current;
        if (e.target === currentLi || e.target === list) {
            return;
        }
        let liArray = Array.from(list.childNodes);
        let currentIndex = liArray.indexOf(currentLi);
        let targetIndex = liArray.indexOf(e.target);
        if (e.target.tagName === 'LI' && currentLi.tagName === 'LI') {
            swapEl(currentIndex, targetIndex);
            if (currentIndex < targetIndex) {
                list.insertBefore(currentLi, e.target.nextElementSibling);
            } else {
                list.insertBefore(currentLi, e.target);
            }
        }
    }

    const dragOverUl = (e) => e.preventDefault();

    const dragEndUl = () => {
        if (currentLi) currentLi.classList.remove('moving');
        localStorage.setItem('exeList', JSON.stringify(cacheList));
    } */

    return (
        <ul className={styles.selExe} ref={refUl}>
            {exeList.map((item, index) => {
                return (
                    item.num !== 'blu' && <li className={completed ? styles.ban : ''} key={item.num} draggable onClick={() => handleSelectExe(item, index)}>
                        <div><input type='radio' checked={item.checked} readOnly />{item.num}</div>
                        <div className={styles.edit}>
                            <input className={item.checked ? styles.check : ''} type='text' disabled={!item.checked} ref={(c) => refObj.current[index] = c} defaultValue={item.name} onChange={handleInpChange} />
                        </div>
                        <div className={styles.img}>
                            <img src={downloadImg} onClick={() => download(item)} />
                            <img src={delImg} onClick={(e) => handleDelExe(item, e)} />
                            {/* <img src={dragImg}/> */}
                        </div>
                    </li>
                )
            })}
        </ul>
    );
}

export default SelectExe;