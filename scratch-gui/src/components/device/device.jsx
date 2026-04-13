import React, { useMemo } from "react";
import styles from "./device.css";
import DeviceBox from "./deviceBox.jsx";
import messages from "./deviceMsg.js";
import DeviceMain from "./device-main.jsx";

const Device = (props) => {
    const newRightList = useMemo(
        () =>
            props.deviceObj?.deviceList
                ? props.deviceObj.deviceList.slice(4)
                : [],
        [props.deviceObj?.deviceList]
    );
    const newLeftList = useMemo(
        () =>
            props.deviceObj?.deviceList
                ? props.deviceObj.deviceList.slice(0, 4)
                : [],
        [props.deviceObj?.deviceList]
    );

    return (
        <div className={styles.box}>
            <div className={styles.container}>
                <div className={styles.midLeft}>
                    <DeviceBox
                        list={newLeftList}
                        intl={props.intl}
                        messages={messages}
                    />
                </div>
                <div className={styles.midPart}>
                    <DeviceMain {...props} messages={messages} />
                </div>
                <div className={styles.midRight}>
                    <DeviceBox
                        list={newRightList}
                        intl={props.intl}
                        messages={messages}
                    />
                </div>
            </div>
        </div>
    );
};

export default Device;
