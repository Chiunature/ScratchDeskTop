import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SelectBoxCom from '../components/box/selectBox.jsx';
import { setExelist } from '../reducers/mode.js';


export default function SelectBox({ selectedExe, onSetSelectedExe, completed, handleCompile, isRtl, flag }) {
    let [index, setIndex] = useState(selectedExe.num);
    let [sx, setSx] = useState(selectedExe.num * 96);
    const exeList = useSelector(state => state.scratchGui.mode.exeList);
    const dispatch = useDispatch();


    const onSetExelist = (exeList) => dispatch(setExelist(exeList));

    function changeSelectExe(current) {
        onSetSelectedExe({
            num: current,
            checked: true,
            name: `${current}_APP`
        });
        const newList = exeList.map((item, i) => {
            if (item.num == current) {
                item.checked = true;
            } else {
                item.checked = false;
            }
            return item;
        });
        onSetExelist(newList);
    }


    function handleRight(ul) {
        let current = index;
        if (current >= ul.current.children[0].children.length - 1) {
            current = 0;
        } else {
            current++;
        }
        setIndex(current);
        setSx(current * (ul.current.offsetWidth - 2));
        changeSelectExe(current);
    }

    function handleLeft(ul) {
        let current = index;
        if (current <= 0) {
            current = ul.current.children[0].children.length - 1;
        } else {
            current--;
        }
        setIndex(current);
        setSx(current * (ul.current.offsetWidth - 2));
        changeSelectExe(current);
    }

    return (
        <SelectBoxCom
            completed={completed}
            handleCompile={handleCompile}
            isRtl={isRtl}
            sx={sx}
            flag={flag}
            handleRight={handleRight}
            handleLeft={handleLeft}
        />
    )
}
