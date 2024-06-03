import React, {useMemo} from 'react'
import Modal from '../../containers/modal.jsx';
import CodeEditor from '../../containers/code-editor.jsx';
import styles from "./tips.css";


const codeEditorOptions = {
    wordWrap: "on", //是否自动换行
    readOnly: true, //是否只读
    folding: true, // 是否折叠
    foldingHighlight: true, // 折叠等高线
    disableLayerHinting: true, // 等宽优化
    emptySelectionClipboard: false, // 空选择剪切板
    selectionClipboard: false, // 选择剪切板
    automaticLayout: true, // 自动布局
    minimap: {
        enabled: false //开启小地图
    }
}

const UpdateInformation = ({ upinMsg, onRequestClose }) => {

    let oldVal = useMemo(() => upinMsg, [upinMsg]);

    return (
        <Modal
            className={styles.tipsModal}
            fullScreen
            id="UpdateInformation"
            onRequestClose={onRequestClose}
            contentLabel="">
            <div
                className={styles.tipsTxt}
            >
            <CodeEditor 
                value={oldVal}
                language="cpp"
                theme="vs"
                    options={codeEditorOptions} />
                </div>
        </Modal>
    )
}

export default UpdateInformation;
