import React, { useState, useRef, useEffect } from "react";
import classNames from 'classnames';
import styles from './button.css';
import Matrix from "./matrix.jsx";

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

const SelectExeBtn = (props) => {
    const { exeList, selectedExe, onSetExelist, onSetSelectedExe } = props;
    const refObj = useRef({});
    let [flag, setFlag] = useState(false);
    const { num } = selectedExe;


    useEffect(() => {
        document.addEventListener('mouseup', handleClick);

        return () => {
            document.removeEventListener('mouseup', handleClick);
        }
    });

    const handleClick = (e) => {
        if (flag && !refObj.current.box.contains(e.target)) {
            setFlag(false);
            const children = Array.from(refObj.current.round.children);
            const line = refObj.current.line;
            close(line, children);
        }
    }

    const open = (line, children) => {
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

    const close = (line, children) => {
        children.map(el => {
            if (el.hasAttribute('style')) {
                el.removeAttribute('style');
            }
        });
        line.style['transform'] = 'translate(-50%, -50%) scale(0.5)';
    }

    const findOuterSpan = (element) => {
        if (!element.parentElement) {
          return null;
        }
      
        if (element.parentElement.tagName.toLowerCase() === 'span') {
          return element.parentElement;
        }
      
        return findOuterSpan(element.parentElement);
      }


    const toggle = (e) => {
        const target = findOuterSpan(e.target);
        if(!target) {
            return;
        }
        const children = Array.from(refObj.current.round.children);
        const line = refObj.current.line;
        if (target.classList.contains(styles.selectExeWrapper)) {
            setFlag(!flag);
            if (flag) {
                close(line, children);
            } else {
                open(line, children);
            }
        } else {
            const currentLi = target;
            const targetLi = document.getElementsByClassName(styles.selectExeWrapper)[0];
            currentLi.classList.add(styles.selectExeWrapper);
            targetLi.classList.remove(styles.selectExeWrapper);
            targetLi.setAttribute('style', currentLi.getAttribute('style'));
        }
    }

    const changeExe = (item, index) => {
        item.checked = true;
        const newList = exeList.map((item, i) => {
            if (i === index) {
                item.checked = true;
            } else {
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
        <div className={styles.selectExeBtnCon} onClick={toggle} ref={(c) => refObj.current.box = c}>
            <div className={classNames(styles.selectExeBox, "exe-box")}>
                <div className={styles.selectExeLine} ref={(c) => refObj.current.line = c}></div>
                <div className={styles.selectExeRound} ref={(c) => refObj.current.round = c}>
                    {exeList.length > 0 && exeList.map((item, index) => {
                        return (
                            <span onClick={() => changeExe(item, index)} key={index} className={classNames(styles.selectExeBlock, num === index + 1 ? styles.selectExeWrapper : '')}>
                                <Matrix num={item.num}/>
                            </span>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default SelectExeBtn;