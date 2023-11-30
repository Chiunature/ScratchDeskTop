import React, { useState, useRef } from "react";
import classNames from 'classnames';
import styles from './button.css';

const translate = [
    {
        left: '50%',
        top: 0,
        opacity: 1
    },
    {
        top: '50%',
        left: '100%',
        opacity: 1
    },
    {
        left: '50%',
        top: '100%',
        opacity: 1
    },
    {
        left: 0,
        top: '50%',
        opacity: 1,
    }
];

const SelectExeBtn = ({ exeList, selectedExe, onSetExelist, onSetSelectedExe }) => {
    const refObj = useRef({});
    let [flag, setFlag] = useState(false);
    const { num } = selectedExe;

    const toggle = (e) => {
        if (e.target.tagName !== 'SPAN') return;
        const children = Array.from(refObj.current.round.children);
        const line = refObj.current.line;
        if (e.target.classList.contains(styles.selectExeWrapper)) {
            setFlag(!flag);
            if (flag) {
                children.map(el => {
                    if (el.hasAttribute('style')) {
                        el.removeAttribute('style');
                    }
                });
                line.style['transform'] = 'translate(-50%, -50%) scale(0.5)';
            } else {
                let list = [];
                children.map(el => {
                    if (!el.classList.contains(styles.selectExeWrapper)) {
                        list.push(el);
                    }
                });
                list.map((el, index) => {
                    Object.keys(translate[index]).map(item => {
                        el.style[item] = translate[index][item];
                    });
                });
                line.style['transform'] = 'translate(-50%, -50%) scale(1)';
            }
        } else {
            const currentLi = e.target;
            const targetLi = document.getElementsByClassName(styles.selectExeWrapper)[0];
            currentLi.classList.add(styles.selectExeWrapper);
            targetLi.classList.remove(styles.selectExeWrapper);
            targetLi.setAttribute('style', currentLi.getAttribute('style'));
        }
    }

    const changeExe = (item, index) => {
        item.checked = true;
        const newList = exeList.map((item, i) => {
            if(i === index) {
                item.checked = true;
            }else {
                item.checked = false;
            }
            return item;
        });
        onSetExelist(newList);
        onSetSelectedExe(item);
        localStorage.setItem('exeList', JSON.stringify(newList));
        localStorage.setItem('selItem', JSON.stringify(item));
    }

    return (
        <div className={styles.selectExeBtnCon} onClick={toggle}>
            <div className={classNames(styles.selectExeBox, "exe-box")}>
                <div className={styles.selectExeLine} ref={(c) => refObj.current.line = c}></div>
                <div className={styles.selectExeRound} ref={(c) => refObj.current.round = c}>
                    {exeList.length > 0 && exeList.map((item, index) => {
                        return (
                            <span onClick={() => changeExe(item, index)} key={index} className={classNames(styles.selectExeBlock, num === index + 1 ? styles.selectExeWrapper : '')}>{item.num}</span>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default SelectExeBtn;