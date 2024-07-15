import React, { useRef, useEffect, useState } from 'react';
import classNames from "classnames";
import styles from "./menu-bar.css";
import Box from '../box/box.jsx';
// import ProgramList from '../generators/program-list.jsx';
import ProjectTitleInput from './project-title-input.jsx';
// import dropdownCaret from "./dropdown-caret.svg";
import fileSaveIcon from "./icon--file-save.svg";

function ProjectMenu({ projectTitle, vm, intl, MenuBarItemTooltip, getSaveToComputerHandler, downloadProject, onSetProjectTitle, saveProjectSb3 }) {

    let programRef = useRef();
    let imgRef = useRef();
    let [display, setDisplay] = useState('none');


    useEffect(() => {
        if (display === 'none') {
            document.onmouseup = null;      
        } else {
            document.onmouseup = clickProgram;
        }
    }, [display]);

    function clickProgram(e) {
        if (e) {
            if (!programRef?.current) {
                return;
            }
            if (!programRef?.current?.contains(e.target) && !e?.target?.classList?.contains(styles.profileIcon)) {
                setDisplay('none');
                return;
            }
            const { x, y } = imgRef.current.getBoundingClientRect();
            programRef.current.style.left = `${x}px`;
            programRef.current.style.top = `${y + imgRef.current.offsetHeight}px`;
            setDisplay('block');
        } else {
            setDisplay('none');
        }
    }

    function saveFile() {
        const openPath = sessionStorage.getItem('openPath');
        const onlySave = openPath && openPath !== 'null' && openPath !== 'undefined';
        getSaveToComputerHandler(() => downloadProject(onlySave))
    }


    return (
        <>
            <Box
                className={classNames(
                    styles.menuBarItem,
                    styles.growable
                )}
            >
                <MenuBarItemTooltip enable id="title-field">
                    {/* <img className={classNames(styles.menuBarItem, styles.hoverable, styles.generator, styles.profileIcon)} src={dropdownCaret}
                        alt="" ref={imgRef} onMouseOver={clickProgram} /> */}
                    <ProjectTitleInput readOnly={false} className={classNames(styles.titleFieldGrowable)} />
                    <img className={classNames(styles.menuBarItem, styles.hoverable, styles.fileSaveIcon)} src={fileSaveIcon}
                        onClick={saveFile} alt="" />
                </MenuBarItemTooltip>
            </Box>
            {/* <ProgramList
                projectTitle={projectTitle}
                vm={vm}
                programRef={programRef}
                display={display}
                onSetProjectTitle={onSetProjectTitle}
                intl={intl}
                setDisplay={setDisplay}
                saveProjectSb3={saveProjectSb3}
            /> */}
        </>
    )
}

export default React.memo(ProjectMenu);