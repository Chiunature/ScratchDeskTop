import PropTypes from 'prop-types';
import React, {useCallback, useState} from 'react';
import styles from './device.css';
import {
    getCameraConfigFieldLabel,
    getCameraLegacyLabel,
    getCameraModeTitle
} from './camera-data.js';

const CAMERA_MODE_LABEL = '模式';
const CAMERA_DATA_TITLE = '摄像头数据';
const CAMERA_DATA_BUTTON_LABEL = '查看摄像头数据';
const CLOSE_LABEL = '关闭';

const cameraPropType = PropTypes.shape({
    mode: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    configs: PropTypes.arrayOf(PropTypes.object)
});

const CameraDataPanel = ({camera}) => {
    const configs = Array.isArray(camera.configs) ? camera.configs : null;

    if (configs) {
        return (
            <div className={styles.cameraDataPanel}>
                {camera.mode !== null && typeof camera.mode !== 'undefined' && (
                    <div className={styles.cameraModeRow}>
                        <span className={styles.sensorLabel}>
                            {CAMERA_MODE_LABEL}
                        </span>
                        <span className={styles.sensorValue}>
                            {getCameraModeTitle(camera.mode)}
                        </span>
                    </div>
                )}
                <div className={styles.cameraConfigsScroll}>
                    {configs.map((cfg, index) => (
                        <section
                            key={index}
                            className={styles.cameraTarget}
                        >
                            <div className={styles.cameraTargetTitle}>
                                {`目标${index + 1}`}
                            </div>
                            <div
                                className={`${styles.sensorGrid} ${styles.sensorGridCamera}`}
                            >
                                {Object.keys(cfg).map(keyName => (
                                    <div
                                        key={keyName}
                                        className={styles.sensorCard}
                                    >
                                        <span className={styles.sensorLabel}>
                                            {getCameraConfigFieldLabel(keyName)}
                                        </span>
                                        <span className={styles.sensorValue}>
                                            {cfg[keyName]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div
            className={`${styles.sensorGrid} ${styles.sensorGridCamera} ${styles.cameraDataPanel}`}
        >
            {Object.keys(camera).map(keyName => {
                if (keyName === 'mode') return null;
                return (
                    <div
                        key={keyName}
                        className={styles.sensorCard}
                    >
                        <span className={styles.sensorLabel}>
                            {getCameraLegacyLabel(keyName, camera)}
                        </span>
                        <span className={styles.sensorValue}>
                            {camera[keyName]}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

const CameraDataDetailButton = ({
    camera,
    buttonLabel = CAMERA_DATA_BUTTON_LABEL,
    buttonClassName = styles.cameraDataButton
}) => {
    const [isDataModalOpen, setIsDataModalOpen] = useState(false);
    const openDataModal = useCallback(() => setIsDataModalOpen(true), []);
    const closeDataModal = useCallback(() => setIsDataModalOpen(false), []);
    const stopModalClick = useCallback(event => event.stopPropagation(), []);

    if (!camera || Object.keys(camera).length === 0) return null;

    return (
        <>
            <button
                className={buttonClassName}
                type="button"
                onClick={openDataModal}
            >
                {buttonLabel}
            </button>

            {isDataModalOpen && (
                <div
                    className={styles.cameraDataModalMask}
                    onClick={closeDataModal}
                >
                    <div
                        className={styles.cameraDataModal}
                        onClick={stopModalClick}
                    >
                        <div className={styles.cameraDataModalHeader}>
                            <span>{CAMERA_DATA_TITLE}</span>
                            <button
                                className={styles.cameraDataCloseButton}
                                type="button"
                                onClick={closeDataModal}
                            >
                                {CLOSE_LABEL}
                            </button>
                        </div>
                        <CameraDataPanel camera={camera} />
                    </div>
                </div>
            )}
        </>
    );
};

const DeviceBoxCamera = ({camera}) => {
    if (!camera || Object.keys(camera).length === 0) return null;

    return (
        <div className={styles.cameraCard}>
            <div className={styles.cameraActionRow}>
                <CameraDataDetailButton camera={camera} />
            </div>
        </div>
    );
};

CameraDataPanel.propTypes = {
    camera: cameraPropType.isRequired
};

CameraDataDetailButton.propTypes = {
    buttonClassName: PropTypes.string,
    buttonLabel: PropTypes.string,
    camera: cameraPropType
};

DeviceBoxCamera.propTypes = {
    camera: cameraPropType
};

export {CameraDataDetailButton};
export default DeviceBoxCamera;
