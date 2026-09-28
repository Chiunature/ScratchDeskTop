import PropTypes from 'prop-types';
import React, {useCallback, useState} from 'react';
import {injectIntl, intlShape} from 'react-intl';
import styles from './device.css';
import msg from './camera-messages.js';
import {
    getCameraConfigFieldLabel,
    getCameraLegacyLabel,
    getCameraModeTitle
} from './camera-data.js';

const messageDescriptorPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string
});

const cameraPropType = PropTypes.shape({
    mode: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    configs: PropTypes.arrayOf(PropTypes.object)
});

const CameraDataPanel = ({camera, intl}) => {
    const configs = Array.isArray(camera.configs) ? camera.configs : null;

    if (configs) {
        return (
            <div className={styles.cameraDataPanel}>
                {camera.mode !== null && typeof camera.mode !== 'undefined' && (
                    <div className={styles.cameraModeRow}>
                        <span className={styles.sensorLabel}>
                            {intl.formatMessage(msg.mode)}
                        </span>
                        <span className={styles.sensorValue}>
                            {getCameraModeTitle(camera.mode, intl)}
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
                                {intl.formatMessage(msg.target, {number: index + 1})}
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
                                            {getCameraConfigFieldLabel(keyName, intl)}
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
                            {getCameraLegacyLabel(keyName, camera, intl)}
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
    intl,
    buttonClassName = styles.cameraDataButton,
    buttonLabel = msg.dataButton
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
                {intl.formatMessage(buttonLabel)}
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
                            <span>{intl.formatMessage(msg.dataTitle)}</span>
                            <button
                                className={styles.cameraDataCloseButton}
                                type="button"
                                onClick={closeDataModal}
                            >
                                {intl.formatMessage(msg.close)}
                            </button>
                        </div>
                        <CameraDataPanel
                            camera={camera}
                            intl={intl}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

const DeviceBoxCamera = ({camera, intl}) => {
    if (!camera || Object.keys(camera).length === 0) return null;

    return (
        <div className={styles.cameraCard}>
            <div className={styles.cameraActionRow}>
                <CameraDataDetailButton
                    camera={camera}
                    intl={intl}
                />
            </div>
        </div>
    );
};

CameraDataPanel.propTypes = {
    camera: cameraPropType.isRequired,
    intl: intlShape.isRequired
};

CameraDataDetailButton.propTypes = {
    buttonClassName: PropTypes.string,
    buttonLabel: messageDescriptorPropType,
    camera: cameraPropType,
    intl: intlShape.isRequired
};

DeviceBoxCamera.propTypes = {
    camera: cameraPropType,
    intl: intlShape.isRequired
};

const CameraDataDetailButtonWithIntl = injectIntl(CameraDataDetailButton);

export {CameraDataDetailButtonWithIntl as CameraDataDetailButton};
export default injectIntl(DeviceBoxCamera);
