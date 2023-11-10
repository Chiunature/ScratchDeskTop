import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import classNames from "classnames";
import React from "react";

import Box from "../box/box.jsx";
import Dots from "./dots.jsx";
// import helpIcon from "./icons/help.svg";
// import backIcon from "./icons/back.svg";
// import bluetoothIcon from "./icons/bluetooth.svg";
// import scratchLinkIcon from "./icons/scratchlink.svg";

import styles from "./connection-modal.css";

const SerialportList = (props) => (
    <Box className={styles.body}>
        <Box className={styles.activityArea}>
            <div className={styles.scratchLinkHelp}>
                {props.serialList.length > 0 &&
                    props.serialList.map((port, index) => {
                        return (
                            <div
                                className={styles.scratchLinkHelpStep}
                                key={port.pnpId}
                                onClick={() => props.onSelectport(port, index)}
                            >
                                {/* <div className={styles.helpStepNumber}>
                                    {index + 1}
                                </div>
                                <input
                                    type="radio"
                                    name="value"
                                    checked={port.checked}
                                    readOnly
                                /> */}
                                <div className={styles.helpStepText}>
                                    {port.friendlyName}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </Box>
        <Box className={styles.bottomArea}>
            <Dots success className={styles.bottomAreaItem} total={3} />
            <Box
                className={classNames(styles.bottomAreaItem, styles.buttonRow)}
            >
                {/* <button
                    className={classNames(
                        styles.blueButton,
                        styles.connectionButton
                    )}
                    onClick={props.onConnected}
                    disabled={
                        props.port &&
                        props.port.friendlyName !== props.peripheralName
                            ? false
                            : true
                    }
                >
                    {props.peripheralName &&
                    props.port.friendlyName === props.peripheralName ? (
                        <FormattedMessage
                            defaultMessage="Connected"
                            description="Message indicating that a device was connected"
                            id="gui.connection.connected"
                        />
                    ) : (
                        <FormattedMessage
                            defaultMessage="Connect"
                            description="Button to start connecting to a specific device"
                            id="gui.connection.connect"
                        />
                    )}
                </button>
                <button
                    className={classNames(
                        styles.redButton,
                        styles.connectionButton
                    )}
                    onClick={props.onDisconnect}
                    disabled={props.peripheralName ? false : true}
                >
                    <FormattedMessage
                        defaultMessage="Disconnect"
                        description="Button to disconnect the device"
                        id="gui.connection.disconnect"
                    />
                </button> */}
                <button
                    className={classNames(
                        styles.redButton,
                        styles.connectionButton
                    )}
                    disabled
                    //disabled={(props.getVersion() == localStorage.getItem('version')) || props.sourceCompleted ? true : false}
                    onClick={props.onUpdate}
                >
                    {props.sourceCompleted ? (
                        <FormattedMessage
                            defaultMessage="opgradering..."
                            description="Firmware opgradering"
                            id="gui.playbackStep.loadingMsg"
                        />
                        ) : (
                        <FormattedMessage
                            defaultMessage="Firmware opgradering"
                            description="Firmware opgradering"
                            id="gui.connection.firmware"
                        />
                    )}

                </button>
            </Box>
        </Box>
    </Box>
);

SerialportList.propTypes = {
    onHelp: PropTypes.func,
    onScanning: PropTypes.func,
};

export default SerialportList;
