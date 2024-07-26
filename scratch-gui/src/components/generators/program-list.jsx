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
    },
    noSave: {
        id:"gui.main.noSave",
        description: "Not saved",
        defaultMessage: "Not saved"
    }
});

export default function ProgramList({ vm, intl, programRef, display, onSetProjectTitle, setDisplay, projectTitle, saveProjectSb3 }) {

    let [list, setList] = useState([]);
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
        if (!list[curIndex] || (list[curIndex] && list[curIndex].name === projectTitle)) {
            return;
        }
        list[curIndex].name = projectTitle;
        setList([...list]);
        await window.myAPI.setStoreValue('programlist', [...list]);
    }


    async function init() {
        const list = await window.myAPI.getStoreValue('programlist');
        setList([...list]);
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
                window.myAPI.ipcRender({ sendName: 'mainOnFocus' });
            }
        };
        reader.readAsArrayBuffer(content);
    }

    function load(el, index, content, display) {
        if (typeof content === 'string') {
            _loadString(el, index, content, display);
        } else {
            _loadBlob(el, index, content, display);
        }
    }

    async function saveOldProgram() {
        const currentContent = await saveProjectSb3();
        const oldIndex = sessionStorage.getItem('programlist-curIndex');
        list[oldIndex].content = currentContent;
        setList([...list]);
        await window.myAPI.setStoreValue('programlist', [...list]);
    }

    async function select(el, index) {
        if (curIndex === index || !el.content) {
            return;
        }
        setFlag(true);
        await saveOldProgram();
        load(el, index, el.content);
    }

    async function deleteOne(index) {
        if (list.length === 1) {
            return;
        }
        setFlag(true);

        const newList = list.toSpliced(index, 1);
        setList([...newList]);
        await window.myAPI.setStoreValue('programlist', [...newList]);

        if (curIndex === index) {
            const current = index - 1;
            load(list[current], current, list[current].content, 'block');
        } else if (curIndex > index) {
            const newIndex = curIndex - 1;
            sessionStorage.setItem('programlist-curIndex', newIndex);
            setCurIndex(newIndex);
        }
    }

    return (
        <Portal>
            <div className={styles.programDropdown} ref={programRef} style={{ display }}>
                <ul className={styles.operator}>
                    {
                        list.map((el, index) => {
                            return (
                                <li key={index}>
                                    <img
                                        className={classNames(styles.check, {
                                            [styles.selected]: curIndex === index
                                        })}
                                        src={check}
                                        alt=''
                                    />
                                    <span onClick={() => select(el, index)}>{el.name + ` (${el.path ? el.path : intl.formatMessage(messages.noSave)}) `}</span>
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
