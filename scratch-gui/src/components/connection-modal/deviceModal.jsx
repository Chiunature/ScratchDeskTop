import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Modal from '../../containers/modal.jsx';
import { FormattedMessage } from "react-intl";
import styles from "./connection-modal.css";
import Box from '../box/box.jsx';
import Device from '../device/device.jsx';
import SelectExe from '../device/selectExe.jsx';
import tabStyles from "react-tabs/style/react-tabs.css";
import { ipc as ipc_Renderer } from 'est-link';




const tabClassNames = {
    tabs: styles.tabs,
    tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
    tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
    tabPanelSelected: classNames(
        tabStyles.reactTabsTabPanelSelected,
        styles.isSelected
    ),
    tabSelected: classNames(
        tabStyles.reactTabsTabSelected,
        styles.isSelected
    ),
};


const DeviceHeader = ({ index, handleSelect }) => (
    <div className={classNames(styles.headerButtons, styles.headerButtonsHidden)} style={{ justifyContent: 'center' }}>
        <div className={tabClassNames.tabs}>
            <ul className={tabClassNames.tabList}>
                <li className={classNames(tabStyles.reactTabsTab, styles.tab, index === 0 ? styles.isSelected : '')} onClick={() => handleSelect(0)}>
                    <div><FormattedMessage
                        defaultMessage="Port Data"
                        description="Port data"
                        id="gui.menuBar.port-data"
                    /></div>
                </li>
                <li className={classNames(tabStyles.reactTabsTab, styles.tab, index === 1 ? styles.isSelected : '')} onClick={() => handleSelect(1)}>
                    <div><FormattedMessage
                        defaultMessage="Program Selection"
                        description="Program selection"
                        id="gui.menuBar.select-exe"
                    /></div>
                </li>
            </ul>
        </div>
    </div>
);

export default function DeviceModal(props) {

    const [styleContent, setStyleContent] = useState('translate(-50%, -50%) scale(1)');
    let [index, setIndex] = useState(0);

    useEffect(() => {
        handleScreenAuto();
        window.onresize = () => handleScreenAuto();
        return () => {
            window.onresize = null;
        }
    }, [])

    const handleScreenAuto = () => {
        const designDraftWidth = 1920;
        const designDraftHeight = 1080;
        // 根据屏幕的变化适配的比例
        const scale =
            document.documentElement.clientWidth /
                document.documentElement.clientHeight <
                designDraftWidth / designDraftHeight
                ? document.documentElement.clientWidth / designDraftWidth
                : document.documentElement.clientHeight / designDraftHeight;
        const newContent = styleContent.replace(/scale\([\s*\S*]*\)/, `scale(${scale.toFixed(2)})`);
        setStyleContent(newContent);
    }

    const handleSelect = (i) => {
        setIndex(i);
        if (!props.completed) {
            if (i === 1) window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.EXE.FILES, sendParams: { type: 'FILE' } });
        }
    }

    const handleDelExe = (item, e) => {
        e.stopPropagation();
        window.myAPI.ipcRender({
            sendName: ipc_Renderer.SEND_OR_ON.EXE.DELETE,
            sendParams: { fileName: item.name + '.bin', verifyType: "DELETE_EXE" },
        });
        window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.EXE.FILES, sendParams: { type: 'FILE' } });
        props.onShowDelExeAlert("delExeSuccess");
    }

    const handleSelectExe = (item, index) => {
        const newList = props.exeList.map((item, i) => {
            item.index = i;
            if (i === index) {
                item.checked = true;
            } else {
                item.checked = false;
            }
            return item;
        });
        props.onSetExelist(newList);
        props.onSetSelectedExe(item);
    }

    return (
        <Modal
            className={styles.deviceModal}
            headerClassName={styles.header}
            id="DeviceModal"
            onRequestClose={props.onRequestClose}
            intl={props.intl}
            style={{
                content: {
                    transform: styleContent,
                }
            }}
            contentLabelNode={<DeviceHeader index={index} handleSelect={handleSelect} />}
        >
            <Box className={styles.body}>
                {index === 0 ? <Device {...props} /> : <SelectExe {...props} handleSelectExe={handleSelectExe} handleDelExe={handleDelExe} />}
            </Box>
        </Modal>
    )
}
