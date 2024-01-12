import styles from './generators.css';
import React, { useRef, useEffect } from "react";
import classNames from "classnames";
import CodeEditor from '../../containers/code-editor.jsx';

const GenComponent = (props) => {
    const {
        codeEditorLanguage,
        codeEditorOptions,
        codeEditorTheme,
        code,
        onSetGen,
        isGen,
    } = props;
let genRef = useRef();

    useEffect(() => {
        document.addEventListener('mouseup', handleClick);

        return () => {
            document.removeEventListener('mouseup', handleClick);
        }
    }, [isGen]);

    const handleClick = (e) => {
        if (isGen && !genRef.current.contains(e.target)) {
            onSetGen(isGen);
        }
    }

    return (
        <div className={styles.gen} ref={genRef}>
            <div
                className={classNames(styles.genTxt, isGen ? styles.genSlate : '')}
            >

            <CodeEditor value={code}
                    language={codeEditorLanguage}
                    theme={codeEditorTheme}
                    options={codeEditorOptions} />
        </div>
        </div>
    )
}
export default GenComponent;