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
        document.addEventListener('mouseup', handleClick);

        return () => {
            document.removeEventListener('mouseup', handleClick);
        }
    }, [isGen]);

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

    const handleClick = (e) => {
        if (isGen && !isDrag && !genRef.current.contains(e.target)) {
            const menuBarGen = document.getElementById("menuBarGen");
            if (menuBarGen.contains(e.target)) {
                return;
            }
            onSetGen(isGen);
        }
    }

    function handleDragStart() {
        setIsDrag(true);
        onSetGen(false);
        document.onmouseup = handleDragEnd;
        document.onmousemove = (e) => {
            const width = Math.min(Math.max(window.innerWidth - e.pageX, 0), window.innerWidth / 2);
            if (width === 0) {
                onSetGen(true);
            }
            setContainerWidth(width);
        }
    }


    function handleDragEnd(e) {
        const width = window.innerWidth - e.pageX;
        if (width < 450) {
            setContainerWidth(0);
            onSetGen(true);
        }
        document.onmouseup = null;
        document.onmousemove = null;
        setIsDrag(false);
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