import React from 'react';
import classNames from 'classnames';
import styles from './ble-list-modal.css';
import bleIcon from '../connection-modal/icons/bluetooth.svg';
import Modal from '../../containers/modal.jsx';
import ButtonComponent from '../button/button.jsx';
import radarIcon from '../connection-modal/icons/searching.png';

export default function BleListModal({ onCancel, messages, intl, bleList, selectedBle, handleSelectPort, handleBleDisconnect }) {

    const btnStatus = (device) => {
        return device.state === 'connected' ? intl.formatMessage(messages.connectedBtn) : intl.formatMessage(messages.connectBtn);
    }

    const btnCSSStatus = (device) => {
        return device.state === 'connected' ? styles.connected : '';
    }

    const bleName = (device) => {
        return device.localName === 'unkown' ? intl.formatMessage(messages.unsupportedDevice) : device.localName;
    }

    return (
        <Modal
            id="ble-list-modal"
            className={styles.modalContent}
            contentLabel={intl.formatMessage(messages.bluetooth)}
            onRequestClose={onCancel}
            intl={intl}
        >
            <div className={styles.bleList}>
                <div className={styles.bleItem}>
                    <p>{intl.formatMessage(messages.connectedBle)}</p>
                    {!selectedBle && <img className={classNames(styles.radarSmall, styles.radarSpin)} src={radarIcon} alt='' />}
                </div>
                {
                    (selectedBle && selectedBle.id) && (
                        <>
                            <div className={styles.bleItem}>
                                <img src={bleIcon} alt='' />
                                <div className={styles.bleListItem}>
                                    <span>{selectedBle?.localName || intl.formatMessage(messages.unsupportedDevice)}</span>
                                    <span className={styles.text}>{selectedBle.address || selectedBle.id}</span>
                                </div>
                                <ButtonComponent
                                    className={classNames(styles.bleConnectBtn, btnCSSStatus(selectedBle))}
                                >
                                    {btnStatus(selectedBle)}
                                </ButtonComponent>
                                {
                                    selectedBle.state === 'connected' &&
                                    <ButtonComponent
                                        className={classNames(styles.bleConnectBtn, styles.disconnect)}
                                        onClick={() => handleBleDisconnect(selectedBle)}
                                    >
                                        {intl.formatMessage(messages.disconnectBtn)}
                                    </ButtonComponent>
                                }
                            </div>
                            <br />
                        </>
                    )
                }
                {bleList.sort((a, b) => (b.localName.length - a.localName.length)).map((device) => {
                    return (
                        <div className={styles.bleItem} key={device.id}>
                            <img src={bleIcon} alt='' />
                            <div className={styles.bleListItem}>
                                <span>{bleName(device)}</span>
                                <span className={styles.text}>{device.address || device.id}</span>
                            </div>
                            <ButtonComponent
                                className={classNames(styles.bleConnectBtn, btnCSSStatus(device))}
                                onClick={() => handleSelectPort(device)}
                            >
                                {btnStatus(device)}
                            </ButtonComponent>
                        </div>
                    )
                }
                )}
            </div>
        </Modal>
    )
}
