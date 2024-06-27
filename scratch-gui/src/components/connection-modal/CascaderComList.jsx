import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import styles from './cascader.css';
import Input from '../forms/input.jsx';




function getId() {
    return Math.random().toString(36).slice(-8);
}

function CascaderComList({ initOptions, setFilterQuery, cascaderRef, setValList, intl }) {
    let [list, setList] = useState([]);
    let [subIndex, setSubIndex] = useState(null);

    useEffect(() => {
        clearCheckAndInit();
    }, [])

    let menuList = useMemo(() => list, [list]);

    async function clearCheckAndInit() {
        const options = await initOptions(intl);
        const newList = [options];
        if (!Array.isArray(newList)) {
            return;
        }
        if (typeof newList[Symbol.iterator] !== 'function') {
            return;
        }
        for (const item of newList) {
            if (item.checked) {
                item.checked = false;
            }
            if (item.children && typeof item.children[Symbol.iterator] === 'function') {
                for (const el of item.children) {
                    if (el.checked) {
                        el.checked = false;
                    }
                }
            }
        }
        setList(newList);
    }

    function onlyCheck(childIndex, fatherIndex) {
        if (!list[fatherIndex]) {
            return;
        }
        const newList = [...list];
        const arr = newList[fatherIndex];
        if (fatherIndex === 0) {
            for (let i = 0; i < arr.length; i++) {
                const child = arr[i];
                if (childIndex === i) {
                    child['checked'] = !child['checked'];
                    if (!child['checked']) {
                        for (const item of child['children']) {
                            item.checked = false;
                        }
                    }
                }
            }
            setSubIndex(childIndex);
        } else {
            for (let i = 0; i < arr.length; i++) {
                const child = arr[i];
                if (childIndex === i) {
                    child['checked'] = !child['checked'];
                } else {
                    child['checked'] = false;
                }
            }
            if (newList[0][subIndex].label === arr[0].father) {
                newList[0][subIndex].children = [...arr];
            }
        }
        setList(newList);
    }

    function changeVal() {
        const newList = [...list];
        const result = [];
        for (const item of newList[0]) {
            const arr = [];
            if (item['checked']) {
                arr.push(item.value);
                if (!item['children']) {
                    continue;
                }
                for (const subItem of item['children']) {
                    if (subItem['checked']) {
                        arr.push(subItem.value);
                    }
                }
            }
            if (arr.length > 0) {
                result.push([arr.join('/')]);
            }
        }
        setValList([...result]);
        setFilterQuery(result.join(', '));
    }

    function handleClick(el, fatherIndex) {
        const newList = [...list];
        const newIndex = fatherIndex + 1;
        newList.splice(newIndex, 1);
        if (el.children) {
            newList[newIndex] = [...el.children];
        } else {
            return;
        }
        setList(newList);
    }

    function handleCheck(childIndex, fatherIndex) {
        onlyCheck(childIndex, fatherIndex);
        changeVal();
    }

    function generateChildList(list, fatherIndex) {
        return (
            <div className={styles.cascaderMenu} key={fatherIndex}>
                <div className={styles.cascaderMenuWrap}>
                    <ul className={styles.cascaderMenuWrapList}>
                        {list.map((el, index) => {
                            return (
                                <li className={styles.cascaderNode} key={getId()} >
                                    <span onClick={() => handleCheck(index, fatherIndex)}>
                                        <Input className={classNames(styles.inpSpan, el.checked && styles.active)}
                                            type={fatherIndex < 1 ? "checkbox" : "radio"}
                                            readOnly
                                            checked={el.checked}
                                        />
                                    </span>
                                    <span onClick={() => handleClick(el, fatherIndex)}>{el.father ? el.father + '~' + el.label : el.label}</span>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.cascaderDropdown} ref={cascaderRef}>
            <div className={styles.cascaderPanel}>
                {menuList?.length > 0 && menuList.map((el, index) => generateChildList(el, index))}
            </div>
        </div>
    )
}

export default CascaderComList;
