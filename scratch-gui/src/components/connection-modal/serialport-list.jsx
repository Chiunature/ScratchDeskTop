import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import classNames from "classnames";
import React, {useCallback, useMemo, useRef, useState} from "react";
import Box from "../box/box.jsx";
import Dots from "./dots.jsx";
import styles from "./connection-modal.css";
import Input from "../forms/input.jsx";
import { verifyTypeConfig } from "est-link";
import Filter from "../filter/filter.jsx";

const filterPlaceholder = {
    id: 'gui.library.filterPlaceholder',
    defaultMessage: 'Search',
    description: 'Placeholder text for library search field'
}

const SerialportList = (props) => {

    let inputRef = useRef();
    let [filterQuery, setFilterQuery] = useState('');

    let portList = useMemo(() => {
        return props.serialList.filter(el => el?.advertisement?.localName.indexOf(filterQuery) !== -1);
    }, [props.serialList, filterQuery]);
    let deviceType = useMemo(() => props.deviceType, [props.deviceType]);
    let select = useCallback((port, index) => props.onSelectport(port, index), [props.onSelectport]);

   
    function handleFilterChange() {
        const value = inputRef.current.value;
        if (value.length === 0) {
            handleFilterClear();
        } else {
            setFilterQuery(value);
        }
    }

    function handleFilterClear() {
        setFilterQuery('');
    }

    return (
    <Box className={styles.body}>
            {deviceType !== verifyTypeConfig.SERIALPORT && <Box className={styles.headArea}>
                <Filter
                    className={classNames(styles.filterBarItem, styles.filter)}
                    inputRef={inputRef}
                    filterQuery={filterQuery}
                    inputClassName={styles.filterInput}
                    placeholderText={props.intl.formatMessage(filterPlaceholder)}
                    onChange={handleFilterChange}
                    onClear={handleFilterClear}/>
            </Box>}
        <Box className={styles.activityArea}>
                <Box className={styles.linkHelp} style={{justifyContent: portList.length === 1 && deviceType === verifyTypeConfig.SERIALPORT && "center"}}>
                    {portList.length > 0 &&
                        portList.map((port, index) => {
                        return (
                            <div
                                    className={styles.linkHelpStep}
                                key={index}
                                    onClick={() => select(port, index)}
                            >
                                    {deviceType !== verifyTypeConfig.SERIALPORT && <>
                                        <div className={styles.helpStepNumber}>
                                    {index + 1}
                                </div>
                                        <Input
                                    type="radio"
                                    name="value"
                                    checked={port.checked}
                                    readOnly
                                        />
                                    </>}
                                <div className={styles.helpStepText}>
                                        {port.friendlyName || port?.advertisement?.localName}
                                </div>
                            </div>
                        );
                    })}
                </Box>
        </Box>
        <Box className={styles.bottomArea}>
            <Dots success className={styles.bottomAreaItem} total={3}/>
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
                        <FormattedMessage
                            defaultMessage="opgradering..."
                            description="Firmware opgradering"
                            id="gui.playbackStep.loadingMsg"
                        />
                        ) : <>
                        {props.version == props.firewareVersion ? (<FormattedMessage
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
            </Box>
        </Box>
    </Box>
    )
};

SerialportList.propTypes = {
    onHelp: PropTypes.func,
    onScanning: PropTypes.func,
};

export default SerialportList;
