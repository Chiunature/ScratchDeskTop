import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import styles from './cascader.css';
import Input from '../forms/input.jsx';




function getId() {
    return Math.random().toString(36).slice(-8);
}

function CascaderComList({ options, setFilterQuery, cascaderRef, valList, setValList }) {
    let [list, setList] = useState([options]);

    let menuList = useMemo(() => {
        return list;
    }, [list])

    function onlyCheck(curIndex, num) {
        if (!list[num]) {
            return;
        }
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < list[i].length; j++) {
                if (num === i && curIndex === j) {
                    list[i][j]['checked'] = true;
                    continue;
                }
                list[i][j]['checked'] = false;
            }
        }
    }

    function handleCheck(el, curIndex, num) {
        onlyCheck(curIndex, num);
        const newIndex = num + 1;
        const newList = [...list];
        const newValList = [...valList];
        newList.splice(newIndex, 1);
        newValList.splice(num, 1);
        newValList[num] = el.value;
        if (el.children) {
            newList[newIndex] = [...el.children];
        }
        setList(newList);
        setValList(newValList);
        setFilterQuery(newValList.join('/'));
    }

    function generateChildList(list, num) {
        return (
            <div className={styles.cascaderMenu} key={num}>
                <div className={styles.cascaderMenuWrap}>
                    <ul className={styles.cascaderMenuWrapList}>
                        {list.map((el, index) => {
                            return (
                                <li className={styles.cascaderNode} key={getId()} onClick={() => handleCheck(el, index, num)}>
                                    <Input className={classNames(styles.fileInpSpan, el.checked && styles.active)}
                                        type="radio"
                                        readOnly
                                        checked={el.checked}
                                    />
                                    <span>{el.label}</span>
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