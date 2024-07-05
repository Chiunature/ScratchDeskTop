import styles from './generators.css';
import React, { useRef, useEffect, useState, useMemo } from "react";
import classNames from "classnames";
import CodeEditor from '../../containers/code-editor.jsx';
import showIcon from 'scratch-blocks/media/show.svg';

const GenComponent = ({
    codeEditorLanguage,
    codeEditorOptions,
    codeEditorTheme,
    code,
    onSetGen,
    isGen,
}) => {

    let genRef = useRef();
    let showImgRef = useRef();
    let [isDrag, setIsDrag] = useState(false);
    let [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        if (containerWidth === 0) {
            document.removeEventListener('mouseup', handleClick);
        }
        if(containerWidth > 0 && !isDrag) {
            document.addEventListener('mouseup', handleClick);
        }
    }, [containerWidth, isDrag]);

    let newIsGen = useMemo(() => {
        if (!isDrag) {
            if (isGen) {
                setContainerWidth(450);
            } else {
                setContainerWidth(0);
            }
        }
        return isGen;
    }, [isGen]);

    function handleClick(e) {
        if (!isDrag && !genRef.current.contains(e.target)) {
            const menuBarGen = document.getElementById("menuBarGen");
            if (menuBarGen.contains(e.target)) {
                return;
            }
            onSetGen(false);
        }
    }

    function handleDragStart() {
        setIsDrag(true);
        if (!isGen) {
            onSetGen(true);
        }
        document.onmouseup = handleDragEnd;
        document.onmousemove = (e) => {
            const width = Math.min(Math.max(window.innerWidth - e.pageX, 0), window.innerWidth / 2);
            setContainerWidth(width);
        }
    }


    function handleDragEnd(e) {
        if (window.innerWidth - e.pageX < 450) {
            onSetGen(false);
            setContainerWidth(0);
        }
        if (window.innerWidth - e.pageX >= window.innerWidth / 2) {
            onSetGen(true);
        }
        setIsDrag(false);
        document.onmouseup = null;
        document.onmousemove = null;
    }

    return (
        <div className={styles.gen}>
            <div ref={genRef} className={classNames(styles.genTxt, isDrag ? styles.genWid : '')} style={{ width: containerWidth + 'px' }}>
                <CodeEditor
                    value={code}
                    language={codeEditorLanguage}
                    theme={codeEditorTheme}
                    options={codeEditorOptions}
                />
                <img
                    ref={showImgRef}
                    className={styles.showImg}
                    src={showIcon}
                    draggable={false}
                    onMouseDown={handleDragStart}
                    alt=''
                />
            </div>
        </div>
    )
}
export default GenComponent;