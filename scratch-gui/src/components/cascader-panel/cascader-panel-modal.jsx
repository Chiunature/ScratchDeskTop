import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from "react-intl";
import Box from "../box/box.jsx";
import Modal from "../../containers/modal.jsx";
import styles from "./cascader-panel.css";
import Input from '../forms/input.jsx';
import message from '../device/deviceMsg';
import { ipc as ipc_Render, verifyTypeConfig } from 'est-link';

function CascaderPanelModalCom(props) {

    let [list, setList] = useState([]);
    let [valList, setValList] = useState([]);

    useEffect(() => {
        clearCheckAndInit();
    }, [])

    let menuList = useMemo(() => list, [list]);

    let headList = useMemo(() => new Array(2).fill(null), [list]);

    async function clearCheckAndInit() {
        const options = await props.initOptions(props.intl);
        const newList = [...options];
        if (!Array.isArray(newList)) {
            return;
        }
        for (const item of newList) {
            if (item.checked) {
                item.checked = false;
            }
            if (item.children && typeof item.children[Symbol.iterator] === 'function') {
                for (const el of item.children) {
                    if (el.checked) {
                        el.checked = false;
                    }
                }
            }
        }
        setList(newList);
    }

    function onlyCheck(childIndex, fatherIndex) {
        if (!list[fatherIndex]) {
            return;
        }
        const newList = [...list];
        const arr = newList[fatherIndex];
        for (let i = 0; i < arr.children.length; i++) {
            const child = arr.children[i];
            if (childIndex === i) {
                child['checked'] = !child['checked'];
            } else {
                child['checked'] = false;
            }
        }
        setList(newList);
    }

    function changeVal() {
        const newList = [...list];
        const result = [];
        for (const item of newList) {
            const arr = [];
            if (!item['children']) {
                continue;
            }
            for (const subItem of item['children']) {
                if (subItem['checked']) {
                    arr.push(subItem.father, subItem.value);
                }
            }
            if (arr.length > 0) {
                result.push([arr.join('/')]);
            }
        }
        setValList([...result]);
    }

    function handleCheck(childIndex, fatherIndex) {
        onlyCheck(childIndex, fatherIndex);
        changeVal();
    }

    function getIndex(data) {
        const portList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        return portList.indexOf(data);
    }

    function update() {
        if (valList.length === 0 || !props.peripheralName || props.completed || sessionStorage.getItem('update-sensing') === verifyTypeConfig.DOING) {
            return;
        }
        const dataList = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];
        for (const item of valList) {
            const newItem = item[0].split('/');
            const index = getIndex(newItem[0]);
            switch (newItem[1]) {
                case props.intl.formatMessage(message.big_motor):
                    dataList[index] = 0xA1;
                    break;
                case props.intl.formatMessage(message.small_motor):
                    dataList[index] = 0xA6;
                    break;
                case props.intl.formatMessage(message.color):
                    dataList[index] = 0xA2;
                    break;
                default:
                    break;
            }
        }
        window.myAPI.ipcRender({ sendName: ipc_Render.SEND_OR_ON.SENSING_UPDATE, sendParams: [...dataList] });
        sessionStorage.setItem('update-sensing', verifyTypeConfig.DOING);
    }

    return (
        <Modal
            className={styles.modalContent}
            contentLabel={props.name}
            headerClassName={styles.header}
            headerImage={props.connectionSmallIconURL}
            id="CascaderPanelModal"
            onRequestClose={props.onCancel}
            intl={props.intl}
            peripheralName={props.peripheralName}
            onHelp={() => { }}
        >
            <Box className={styles.body}>
                <Box className={styles.headArea}>
                    {
                        headList.map((el, index) => {
                            return (
                                <Box className={styles.headUl} key={index}>
                                    <div>
                                        <FormattedMessage
                                            defaultMessage="Port"
                                            description="Port"
                                            id="gui.device.port"
                                        />
                                    </div>
                                    <ul>
                                        <li>
                                            <FormattedMessage
                                                defaultMessage="Big motor"
                                                description="Big motor"
                                                id="gui.device.big_motor"
                                            />
                                        </li>
                                        <li>
                                            <FormattedMessage
                                                defaultMessage="Small motor"
                                                description="Small motor"
                                                id="gui.device.small_motor"
                                            />
                                        </li>
                                        <li>
                                            <FormattedMessage
                                                defaultMessage="Color recognizer"
                                                description="Color recognizer"
                                                id="gui.device.color"
                                            />
                                        </li>
                                    </ul>
                                </Box>
                            )
                        })
                    }
                </Box>
                <Box className={styles.activityArea}>
                    {
                        menuList.map((el, fatherIndex) => {
                            return (
                                <Box className={styles.activityUl} key={fatherIndex}>
                                    <div>{el.label}</div>
                                    <ul>
                                        {
                                            el?.children && el.children.map((item, childIndex) => {
                                                return (
                                                    <li key={childIndex}>
                                                        <Input className={styles.inpSpan}
                                                            type="radio"
                                                            readOnly
                                                            checked={item.checked}
                                                            onClick={() => handleCheck(childIndex, fatherIndex)}
                                                        />
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </Box>
                            )
                        })
                    }
                </Box>
                <Box className={styles.bottomArea}>
                    <Box className={styles.alert}>注意: *更新过程中请勿拔插端口数据线，否则易造成更新错误等不可逆状况。</Box>
                    <Box className={classNames(styles.bottomAreaItem, styles.buttonRow)}>
                        <button className={classNames(styles.redButton, styles.connectionButton)} onClick={update}>
                            <FormattedMessage
                                defaultMessage="Force updates"
                                description="Force updates"
                                id="gui.device.updateSensing"
                            />
                        </button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    )
}

export default CascaderPanelModalCom;