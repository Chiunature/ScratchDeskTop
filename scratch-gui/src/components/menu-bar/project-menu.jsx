import React, { useRef, useEffect, useState } from 'react';
import classNames from "classnames";
import styles from "./menu-bar.css";
import Box from '../box/box.jsx';
// import ProgramList from '../generators/program-list.jsx';
import ProjectTitleInput from './project-title-input.jsx';
// import dropdownCaret from "./dropdown-caret.svg";
import fileSaveIcon from "./icon--file-save.svg";

function ProjectMenu({ projectTitle, vm, intl, MenuBarItemTooltip, getSaveToComputerHandler, downloadProject, onSetProjectTitle }) {

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
                        onClick={getSaveToComputerHandler(() => downloadProject(sessionStorage.getItem('openPath')))} alt="" />
                </MenuBarItemTooltip>
            </Box>
            {/* <ProgramList projectTitle={projectTitle} vm={vm} programRef={programRef} display={display} onSetProjectTitle={onSetProjectTitle} intl={intl} setDisplay={setDisplay} /> */}
        </>
    )
}

export default React.memo(ProjectMenu);