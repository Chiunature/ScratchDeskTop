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
    console.log("newLeftList", newLeftList);
    return (
        <div className={styles.box}>
            <div className={styles.container}>
                <div className={styles.left}>
                    <div className={styles.block}>A</div>
                    <div className={styles.block}>B</div>
                    <div className={styles.block}>C</div>
                    <div className={styles.block}>D</div>
                </div>
                <div className={styles.middle}>
                    <div className={styles.midContent}>
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
                <div className={styles.right}>
                    <div className={styles.block}>E</div>
                    <div className={styles.block}>F</div>
                    <div className={styles.block}>G</div>
                    <div className={styles.block}>H</div>
                </div>
            </div>
        </div>
    );
};

export default Device;
