import styles from './generators.css';
import React from "react";
import classNames from "classnames";
import CodeEditor from '../../containers/code-editor.jsx';
const GenComponent = (props) => {
    const {
        codeEditorLanguage,
        codeEditorOptions,
        codeEditorTheme,
        code
    } = props;
    return (
        <div className={styles.gen}>
            <div
            className={classNames(styles.genTxt, props.isGen ? styles.genSlate : '')}
        >
            <CodeEditor value={code}
                    language={codeEditorLanguage}
                    theme={codeEditorTheme}
                    options={codeEditorOptions}/>
        </div>
        </div>
    )
}
export default GenComponent;