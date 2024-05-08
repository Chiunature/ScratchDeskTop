import React from 'react';
import styles from './code-editor.css';
import qrcodeImg from './qrcode.png';

const Qrcode = ({onShowQrcode}) => {
    return (
        <div className={styles.qrBox}>
            <img src={qrcodeImg} />
            <div className={styles.qrMask} onClick={onShowQrcode}></div>
        </div>
    )
}

export default Qrcode;