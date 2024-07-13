import React, { useEffect, useMemo, useState } from 'react';
import { defineMessages } from "react-intl";
import classNames from 'classnames';
import Portal from '../alerts/portal.jsx';
import styles from './generators.css';
import check from '../menu-bar/check.svg';
import log from '../../lib/log.js';
import closeIcon from '../close-button/icon--close.svg';

const messages = defineMessages({
    loadError: {
        id: 'gui.projectLoader.loadError',
        defaultMessage: 'The project file that was selected failed to load.',
        description: 'An error that displays when a local project file fails to load.'
    }
});

export default function ProgramList({ vm, intl, programRef, display, onSetProjectTitle, setDisplay, projectTitle }) {

    let [programlist, setProgramList] = useState([]);
    let [curIndex, setCurIndex] = useState(0);
    let [flag, setFlag] = useState(false);

    useMemo(() => {
        if (display === 'block') {
            init();
            const index = sessionStorage.getItem('programlist-curIndex');
            index && setCurIndex(parseInt(index));
        }
    }, [display])

    useEffect(() => {
        if (!flag) {
            changeProgramList();
        } else {
            setFlag(false);
        }
    }, [projectTitle])

    async function changeProgramList() {
        const list = await window.myAPI.getForage('programlist');
        if (!list[curIndex] || (list[curIndex] && list[curIndex].name === projectTitle)) {
            return;
        }
        list[curIndex].name = projectTitle;
        setProgramList([...list]);
        await window.myAPI.setForage('programlist', [...list]);
    }


    async function init() {
        const list = await window.myAPI.getForage('programlist');
        setProgramList([...list]);
    }

    async function _loadString(el, index, result, display = 'none') {
        await vm.loadProject(result);
        sessionStorage.setItem('openPath', el.path);
        sessionStorage.setItem('programlist-curIndex', index);
        setCurIndex(index);
        setDisplay(display);
        onSetProjectTitle(el.name);
    }

    function _loadBlob(el, index, content, display = 'none') {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                _loadString(el, index, reader.result, display);
            } catch (error) {
                log.warn(error);
                alert(intl.formatMessage(messages.loadError));
            }
        };
        reader.readAsArrayBuffer(content);
    }

    function load(el, index, content, display) {
        setFlag(true);
        if (typeof content === 'string') {
            _loadString(el, index, content, display);
        } else {
            _loadBlob(el, index, content, display);
        }
    }

    function select(el, index) {
        if (curIndex === index || !el.content) {
            return;
        }
        load(el, index, el.content);
    }

    async function deleteOne(index) {
        let list = await window.myAPI.getForage('programlist');
        if (list.length === 1) {
            return;
        }

        const newList = list.toSpliced(index, 1);
        await window.myAPI.setForage('programlist', [...newList]);
        setProgramList([...newList]);

        const current = index - 1;
        if (curIndex === index) {
            load(list[current], current, list[current].content, 'block');
        } else {
            sessionStorage.setItem('programlist-curIndex', curIndex - 1);
            setCurIndex(curIndex - 1);
            return;
        }
    }

    return (
        <Portal>
            <div className={styles.programDropdown} ref={programRef} style={{ display }}>
                <ul className={styles.operator}>
                    {
                        programlist.map((el, index) => {
                            return (
                                <li key={index}>
                                    <img
                                        className={classNames(styles.check, {
                                            [styles.selected]: curIndex === index
                                        })}
                                        src={check}
                                        alt=''
                                    />
                                    <span onClick={() => select(el, index)}>{el.name}</span>
                                    <img
                                        className={classNames(styles.closeIcon)}
                                        src={closeIcon}
                                        alt=''
                                        onClick={() => deleteOne(index)}
                                    />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </Portal>
    )
}
