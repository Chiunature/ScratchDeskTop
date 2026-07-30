import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { FormattedMessage } from "react-intl";
import Box from "../box/box.jsx";
// import Divider from '../divider/divider.jsx';
import Modal from "../../containers/modal.jsx";
import styles from "./cascader-panel.css";
import Input from "../forms/input.jsx";
import message from "../device/deviceMsg";
import { ipc as ipc_Render, verifyTypeConfig } from "est-link";

/** 可强制更新的传感器类型 id（与 Cascader 选项 id 对应） */
const UPDATABLE_DEVICE_IDS = ["a1", "a5", "a6", "a2", "a7", "b0"];

/** 空设备 / 异常占位：允许自选任意类型更新 */
function isEmptyOrAbnormal(deviceEntry) {
    if (!deviceEntry) {
        return true;
    }
    const deviceId = deviceEntry.deviceId;
    const sensing = deviceEntry.sensing_device;
    if (
        deviceId === "dev_null" ||
        deviceId === 0 ||
        deviceId === "0" ||
        !deviceId ||
        sensing === "deviceAbnormal" ||
        sensing === "noDevice"
    ) {
        return true;
    }
    return false;
}

/** 选项是否与监控识别到的设备类型一致（a1 通用电机兼容大电机 a5） */
function matchesDeviceType(optionId, deviceId) {
    if (!optionId || deviceId == null) {
        return false;
    }
    const id = String(deviceId).toLowerCase();
    const opt = String(optionId).toLowerCase();
    if (opt === id) {
        return true;
    }
    if (id === "a1" && opt === "a5") {
        return true;
    }
    return false;
}

function CascaderPanelModalCom(props) {
    let [list, setList] = useState([]);
    let [valList, setValList] = useState([]);
    let [hasEmptySelection, setHasEmptySelection] = useState(false);

    useEffect(() => {
        clearCheckAndInit();
    }, []);

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
            if (
                item.children &&
                typeof item.children[Symbol.iterator] === "function"
            ) {
                for (const el of item.children) {
                    if (el.checked) {
                        el.checked = false;
                    }
                }
            }
        }
        setList(newList);
        setHasEmptySelection(false);
    }

    function applyCheck(childIndex, fatherIndex) {
        if (!list[fatherIndex]) {
            return;
        }
        const newList = list.map((port, pIndex) => {
            if (pIndex !== fatherIndex) {
                return port;
            }
            return {
                ...port,
                children: port.children.map((child, i) => ({
                    ...child,
                    checked: i === childIndex ? !child.checked : false,
                })),
            };
        });
        setList(newList);
        changeVal(newList);
    }

    function changeVal(nextList = list) {
        const result = [];
        let emptySelected = false;
        for (const item of nextList) {
            const arr = [];
            if (!item["children"]) {
                continue;
            }
            for (const subItem of item["children"]) {
                if (subItem["checked"]) {
                    arr.push(subItem.father, subItem.value);
                    const portIndex = getIndex(subItem.father);
                    const deviceEntry =
                        props?.deviceObj?.deviceList?.[portIndex];
                    if (isEmptyOrAbnormal(deviceEntry)) {
                        emptySelected = true;
                    }
                }
            }
            if (arr.length > 0) {
                result.push([arr.join("/")]);
            }
        }
        setValList(result);
        setHasEmptySelection(emptySelected);
    }

    function getDeviceEntryForOption(el) {
        const index = getIndex(el.father);
        return props?.deviceObj?.deviceList?.[index];
    }

    function isOptionAllowed(el) {
        const deviceEntry = getDeviceEntryForOption(el);
        if (isEmptyOrAbnormal(deviceEntry)) {
            return true;
        }
        const deviceId = deviceEntry.deviceId;
        // 已识别但类型不在可更新列表内：该口不可强制更新
        if (!UPDATABLE_DEVICE_IDS.includes(String(deviceId).toLowerCase())) {
            return false;
        }
        return matchesDeviceType(el.id, deviceId);
    }

    function handleCheck(item, childIndex, fatherIndex) {
        if (!item.checked) {
            if (!isOptionAllowed(item)) {
                const deviceEntry = getDeviceEntryForOption(item);
                if (
                    deviceEntry &&
                    !isEmptyOrAbnormal(deviceEntry) &&
                    !UPDATABLE_DEVICE_IDS.includes(
                        String(deviceEntry.deviceId).toLowerCase()
                    )
                ) {
                    alert("该端口设备类型不支持强制更新!");
                } else {
                    alert("已识别设备只能选择当前类型进行更新!");
                }
                window.myAPI.ipcRender({ sendName: "mainOnFocus" });
                return;
            }
        }
        applyCheck(childIndex, fatherIndex);
    }

    function getIndex(data) {
        const portList = ["A", "B", "C", "D", "E", "F", "G", "H"];
        return portList.indexOf(data);
    }

    function update() {
        if (valList.length === 0 || !props.peripheralName || props.completed) {
            return;
        }
        const dataList = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff];
        for (const item of valList) {
            const newItem = item[0].split("/");
            const index = getIndex(newItem[0]);
            switch (newItem[1]) {
                case props.intl.formatMessage(message.big_motor):
                    dataList[index] = 0xa1; //161
                    break;
                case props.intl.formatMessage(message.small_motor):
                    dataList[index] = 0xa6; //166
                    break;
                case props.intl.formatMessage(message.color):
                    dataList[index] = 0xa2; //162
                    break;
                case props.intl.formatMessage(message.gray):
                    dataList[index] = 0xa9; //169
                    break;
                case props.intl.formatMessage(message.gray_v2):
                    dataList[index] = 0xb0; //176
                    break;
                default:
                    break;
            }
        }
        console.log("dataList", dataList);
        window.myAPI.ipcRender({
            sendName: ipc_Render.SEND_OR_ON.SENSING_UPDATE,
            sendParams: [...dataList],
        });
    }

    /* function calibration() {
        props.onShowCompletedAlert("calibration");
        setTimeout(() => {
            window.myAPI.ipcRender({ sendName: ipc_Render.SEND_OR_ON.EXE.FILES, sendParams: { type: ipc_Render.SEND_OR_ON.CALIBRATION } });
        }, 1000);
    } */

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
        >
            <Box className={styles.body}>
                <Box className={styles.headArea}>
                    {headList.map((el, index) => {
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
                                    <li>
                                        <FormattedMessage
                                            defaultMessage="Gray"
                                            description="Gray"
                                            id="gui.device.gray"
                                        />
                                    </li>
                                    <li>
                                        <FormattedMessage
                                            defaultMessage="Gray sensor V2"
                                            description="Gray sensor V2"
                                            id="gui.device.gray_v2"
                                        />
                                    </li>
                                </ul>
                            </Box>
                        );
                    })}
                </Box>
                <Box className={styles.activityArea}>
                    {menuList.map((el, fatherIndex) => {
                        return (
                            <Box
                                className={styles.activityUl}
                                key={fatherIndex}
                            >
                                <div>{el.label}</div>
                                <ul>
                                    {el?.children &&
                                        el.children.map((item, childIndex) => {
                                            const allowed = isOptionAllowed(item);
                                            return (
                                                <li
                                                    key={childIndex}
                                                    className={classNames(
                                                        !allowed && styles.optionDisabled
                                                    )}
                                                    title={
                                                        allowed
                                                            ? undefined
                                                            : "已识别设备只能选择当前类型"
                                                    }
                                                >
                                                    <Input
                                                        className={classNames(
                                                            styles.inpSpan,
                                                            !allowed && styles.inpDisabled
                                                        )}
                                                        type="radio"
                                                        readOnly
                                                        checked={item.checked}
                                                        disabled={!allowed}
                                                        onClick={() =>
                                                            handleCheck(
                                                                item,
                                                                childIndex,
                                                                fatherIndex
                                                            )
                                                        }
                                                    />
                                                </li>
                                            );
                                        })}
                                </ul>
                            </Box>
                        );
                    })}
                </Box>
                <Box className={styles.bottomArea}>
                    <Box className={styles.alert}>
                        注意：
                        *已识别设备只能选择当前类型更新；空设备/异常设备可选任意类型，但选错可能导致无法刷回。
                        *更新过程中请勿拔插端口数据线，请勿重复点击强制更新按钮。
                    </Box>
                    {hasEmptySelection && (
                        <Box className={styles.alertDanger}>
                            当前包含空设备/异常端口：请确认所选传感器类型正确，选错可能无法恢复！
                        </Box>
                    )}
                    <Box
                        className={classNames(
                            styles.bottomAreaItem,
                            styles.buttonRow
                        )}
                    >
                        <button
                            className={classNames(
                                styles.redButton,
                                styles.connectionButton
                            )}
                            onClick={update}
                            disabled={valList.length === 0}
                        >
                            <FormattedMessage
                                defaultMessage="Force updates"
                                description="Force updates"
                                id="gui.device.updateSensing"
                            />
                        </button>
                        {/* <Divider /> */}
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}

export default CascaderPanelModalCom;
