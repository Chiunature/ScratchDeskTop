import React from 'react';
import classNames from 'classnames';
import styles from './ble-list-modal.css';
import bleIcon from '../connection-modal/icons/bluetooth.svg';
import Modal from '../../containers/modal.jsx';
import ButtonComponent from '../button/button.jsx';

export default function BleListModal({ onCancel, messages, intl, bleList, handleSelectPort }) {

    const btnStatus = (device) => {
        if (device.connected) {
            return intl.formatMessage(messages.connectedBtn)
        } else {
            return intl.formatMessage(messages.connectBtn)
        }
    }

    const btnCSSStatus = (device) => {
        if (device.connected) {
            return styles.connected
        } else {
            return ''
        }
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
                {bleList.map((device) => {
                    return (
                        <div className={styles.bleItem} key={device.id}>
                            <img src={bleIcon} alt='' />
                            <div className={styles.bleListItem}>
                                <span>{device?.advertisement?.localName || intl.formatMessage(messages.unsupportedDevice)}</span>
                                <span className={styles.text}>{device.address || device.id}</span>
                            </div>
                            <ButtonComponent
                                className={classNames(styles.bleConnectBtn, btnCSSStatus(device))}
                                onClick={() => handleSelectPort(device)}
                            >{btnStatus(device)}</ButtonComponent>
                            {/* {device.state === 'connected' && <ButtonComponent className={classNames(styles.bleConnectBtn, styles.disconnect)}>{intl.formatMessage(messages.disconnectBtn)}</ButtonComponent>} */}
                        </div>
                    )
                }
                )}
            </div>
        </Modal>
    )
}
