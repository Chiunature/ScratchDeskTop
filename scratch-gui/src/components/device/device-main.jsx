import React, { useMemo } from "react";
import styles from "./device.css";
import { FormattedMessage } from "react-intl";

const DeviceMain = ({ messages, deviceObj, intl, peripheralName }) => {
    const mem = useMemo(() => deviceObj?.mem, [deviceObj?.mem]);
    const bat = useMemo(() => deviceObj?.bat, [deviceObj?.bat]);
    const version = useMemo(() => deviceObj?.version, [deviceObj?.version]);
    const sound = useMemo(() => deviceObj?.sound, [deviceObj?.sound]);

    return (
        <>
            <div className={styles.deviceMainCard}>
                <p className={styles.deviceMainTitle}>
                    <FormattedMessage
                        defaultMessage="Device"
                        description="View device information"
                        id="gui.menuBar.Device"
                    />
                </p>
                <div className={styles.deviceMainFieldsRow}>
                    {peripheralName && (
                        <div className={styles.deviceMainField}>
                            <span className={styles.deviceMainLabel}>
                                {intl.formatMessage(messages["mainName"])}
                            </span>
                            <span className={styles.deviceMainValueBox}>
                                {peripheralName.slice(
                                    0,
                                    peripheralName.indexOf("(")
                                )}
                            </span>
                        </div>
                    )}
                    {version && (
                        <div className={styles.deviceMainField}>
                            <span className={styles.deviceMainLabel}>
                                {intl.formatMessage(messages["version"])}
                            </span>
                            <span className={styles.deviceMainValueBox}>
                                {version}
                            </span>
                        </div>
                    )}
                    {bat && (
                        <div className={styles.deviceMainField}>
                            <span className={styles.deviceMainLabel}>
                                {intl.formatMessage(messages["electricity"])}
                            </span>
                            <span className={styles.deviceMainValueBox}>
                                {bat >= 100 ? "100" : bat}%
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.deviceMainControlCard}>
                <p className={styles.deviceMainControlTitle}>
                    {intl.formatMessage(messages["mainControl"])}
                </p>
                <div className={styles.deviceMainMetrics}>
                    {mem &&
                        Object.keys(mem).length > 0 &&
                        Object.keys(mem).map((item, index) => {
                            return (
                                item.indexOf("id") === -1 && (
                                    <div
                                        className={styles.deviceMainMetricCell}
                                        key={index}
                                    >
                                        <span
                                            className={
                                                styles.deviceMainMetricLabel
                                            }
                                        >
                                            {intl.formatMessage(messages[item])}
                                        </span>
                                        <span
                                            className={
                                                styles.deviceMainMetricValue
                                            }
                                        >
                                            {mem[item]}
                                        </span>
                                    </div>
                                )
                            );
                        })}
                    {sound && (
                        <div className={styles.deviceMainSoundRow}>
                            <span className={styles.deviceMainSoundLabel}>
                                {intl.formatMessage(messages["soundIntensity"])}
                            </span>
                            <span className={styles.deviceMainSoundValue}>
                                {sound}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DeviceMain;
