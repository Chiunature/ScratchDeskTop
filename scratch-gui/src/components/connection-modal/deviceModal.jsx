import React, { useEffect, useState } from 'react';
import Modal from '../../containers/modal.jsx';
import styles from "./connection-modal.css";
import Box from '../box/box.jsx';
import Device from '../device/device.jsx';


export default function DeviceModal(props) {

    const [scale, setScale] = useState(1);

    useEffect(() => {
        handleScreenAuto();
        window.onresize = () => handleScreenAuto();
        return () => {
            window.onresize = null;
        }
    }, [])

    const handleScreenAuto = () => {
        const designDraftWidth = 1920;
        const designDraftHeight = 1080;
        // 根据屏幕的变化适配的比例
        const scale =
            document.documentElement.clientWidth /
                document.documentElement.clientHeight <
                designDraftWidth / designDraftHeight
                ? document.documentElement.clientWidth / designDraftWidth
                : document.documentElement.clientHeight / designDraftHeight;
        setScale(scale.toFixed(2));
    }


    return (
        <Modal
            className={styles.deviceModal}
            headerClassName={styles.header}
            id="DeviceModal"
            onRequestClose={props.onRequestClose}
            intl={props.intl}
            style={{
                content: {
                    scale: scale,
                }
            }}
        >
            <Box className={styles.body}>
                <Device {...props} />
            </Box>
        </Modal>
    )
}
