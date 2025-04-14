import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import classNames from "classnames";
import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import Box from "../box/box.jsx";
// import Dots from "./dots.jsx";
import styles from "./connection-modal.css";
import Input from "../forms/input.jsx";
import { verifyTypeConfig, ipc as ipc_Renderer } from "est-link";
import Filter from "../filter/filter.jsx";

const filterPlaceholder = {
    id: 'gui.library.filterPlaceholder',
    defaultMessage: 'Search',
    description: 'Placeholder text for library search field'
}

const SerialportList = (props) => {

    let [filterQuery, setFilterQuery] = useState('');
    let [fileList, setFileList] = useState([]);
    const [total, setTotal] = useState(0);
    const [isShow, setIsShow] = useState(false);
    const [isScroll, setIsScroll] = useState(true);
    // let inputRef = useRef();
    let boxRef = useRef();

    useEffect(() => {
        if (boxRef.current && isScroll) {
            boxRef.current.scrollTop = boxRef.current.scrollHeight;
        }
    }, [fileList, isScroll]);

    useEffect(() => {
        getFileName();
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.COMMUNICATION.SOURCE.LENGTH,
            callback: (e, data) => {
                if (!data) return;
                setTotal(data);
            }
        })
        return () => {
            window.myAPI.delEvents([ipc_Renderer.RETURN.COMMUNICATION.SOURCE.LENGTH, ipc_Renderer.RETURN.FILE.NAME]);
        }
    }, [])

    const handleScroll = () => {
        if (boxRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = boxRef.current;
            // 如果用户滚动到列表底部，启用自动滚动
            if (scrollTop + clientHeight >= scrollHeight) {
                setIsScroll(true);
            } else {
                // 否则禁用自动滚动
                setIsScroll(false);
            }
        }
    }

    let portList = useMemo(() => props.serialList.filter(el => el?.advertisement?.localName.indexOf(filterQuery) !== -1), [props.serialList, filterQuery]);
    let deviceType = useMemo(() => props.deviceType, [props.deviceType]);
    let select = useCallback((port, index) => props.onSelectport(port, index), [props.onSelectport]);

    function getFileName() {
        let fileName;
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.FILE.NAME,
            callback: (e, data) => {
                if (!data) return;
                if (!isShow) {
                    setIsShow(true);
                }
                if (data?.fileName !== fileName) {
                    fileList.push({ fileName: data.fileName, progress: data.progress });
                    setFileList([...fileList]);
                    fileName = data.fileName;
                } else if (fileList.length > 0 && data?.fileName === fileName) {
                    const newList = [...fileList];
                    newList[newList.length - 1].progress = data.progress;
                    setFileList(newList);
                }
            }
        })
    }

    /* function handleFilterChange() {
        const value = inputRef.current.value;
        if (value.length === 0) {
            handleFilterClear();
        } else {
            setFilterQuery(value);
        }
    } */

    /* function handleFilterClear() {
        setFilterQuery('');
    } */

    function lookRecord() {
        setIsShow(!isShow);
    }

    function getPortName(port) {
        return deviceType === verifyTypeConfig.SERIALPORT ? port?.friendlyName || port?.advertisement?.localName : `${port?.friendlyName || port?.localName} (${port?.address})`;
    }

    return (
        <Box className={styles.body}>
            {/* {deviceType !== verifyTypeConfig.SERIALPORT && <Box className={styles.headArea}>
                <Filter
                    className={classNames(styles.filterBarItem, styles.filter)}
                    inputRef={inputRef}
                    filterQuery={filterQuery}
                    inputClassName={styles.filterInput}
                    placeholderText={props.intl.formatMessage(filterPlaceholder)}
                    onChange={handleFilterChange}
                    onClear={handleFilterClear}
                />
            </Box>} */}
            <Box className={styles.activityArea} componentRef={boxRef} onScroll={handleScroll}>
                <Box className={styles.linkHelp} style={{
                    justifyContent: (isShow || deviceType === verifyTypeConfig.BLUETOOTH) ? "flex-start" : "center",
                    alignItems: (isShow || deviceType === verifyTypeConfig.BLUETOOTH) && "flex-start"
                }}>
                    {
                        isShow ?
                            <>
                                {fileList.length > 0 &&
                                    fileList.map((file, index) => {
                                        return (
                                            <div
                                                className={styles.linkHelpStep}
                                                key={index}
                                            >
                                                <div className={styles.helpStepNumber}>
                                                    {index + 1}
                                                </div>
                                                <div className={styles.helpStepText}>
                                                    {file.fileName + '——' + file.progress}%
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                            :
                            <>
                                {portList.length > 0 &&
                                    portList.map((port, index) => {
                                        return (
                                            <div
                                                className={styles.linkHelpStep}
                                                key={index}
                                                onClick={() => select(port, index)}
                                            >
                                                <div className={styles.helpStepText}>
                                                    {getPortName(port)}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                    }
                </Box>
            </Box>
            {deviceType === verifyTypeConfig.SERIALPORT && <Box className={styles.bottomArea}>
                <Box className={classNames(styles.bottomAreaItem, styles.buttonRow)}>
                    <button
                        className={classNames(
                            styles.redButton,
                            styles.connectionButton
                        )}

                        disabled={props.sourceCompleted}
                        onClick={props.onUpdate}
                    >
                        {props.sourceCompleted ? (
                            <>
                                <FormattedMessage
                                    defaultMessage="opgradering..."
                                    description="Firmware opgradering"
                                    id="gui.playbackStep.loadingMsg"
                                />
                                {`${fileList.length}/${total}`}
                            </>
                        ) : <>
                            {props.version === props.firewareVersion ? (<FormattedMessage
                                defaultMessage="The latest version"
                                description="The firmware is already the latest version"
                                id="gui.connection.isNewFirmware"
                            />) :
                                (<FormattedMessage
                                    defaultMessage="Firmware opgradering"
                                    description="Firmware opgradering"
                                    id="gui.connection.firmware"
                                />)
                            }
                        </>
                        }
                    </button>
                    <button
                        className={styles.connectionButton}
                        disabled={props.sourceCompleted}
                        onClick={lookRecord}
                    >查看本次记录</button>
                </Box>
            </Box>}
        </Box>
    )
};

SerialportList.propTypes = {
    onHelp: PropTypes.func,
    onScanning: PropTypes.func,
};

export default SerialportList;
