import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal from '../../containers/modal.jsx';
import styles from "./connection-modal.css";
import Box from '../box/box.jsx';
import Device from '../device/device.jsx';
import useResizeObserver from '../../lib/useResizeObserver.js';


export default function DeviceModal(props) {

    // const [scale, setScale] = useState(1);
    const [isMounted, setIsMounted] = useState(false);
    let [elementRef, size, setTrigger] = useResizeObserver();

    useEffect(() => {
        // handleScreenAuto();
        // window.onresize = () => handleScreenAuto();
        setIsMounted(true);
        return () => {
            // window.onresize = null;
            setIsMounted(false);
        }
    }, [])

    const newScale = useMemo(() => {
        if (elementRef && isMounted) {
            const designDraftWidth = 1920;
            const designDraftHeight = 991;
            const { width, height } = size;
            if (width > 0 && height > 0) {
                const scale = width / height < designDraftWidth / designDraftHeight ? width / designDraftWidth : height / designDraftHeight;
                return scale.toFixed(2);
            } else {
                return 1;
            }
        }
        return 1;
    }, [elementRef, size])

    /* const handleScreenAuto = () => {
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
    } */

    const getOverlayRef = (e) => {
        elementRef.current = e
        setTrigger({ ...elementRef })
    }

    return (
        <Modal
            className={styles.deviceModal}
            headerClassName={styles.header}
            id="DeviceModal"
            onRequestClose={() => props.onRequestClose(false)}
            intl={props.intl}
            style={{
                content: {
                    scale: newScale,
                }
            }}
            overlayRef={getOverlayRef}
        >
            <Box className={styles.body}>
                <Device {...props} />
            </Box>
        </Modal>
    )
}
