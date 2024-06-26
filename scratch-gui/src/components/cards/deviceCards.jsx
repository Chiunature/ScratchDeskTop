import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import Draggable from 'react-draggable';
import { ipc as ipc_Renderer } from 'est-link';
import styles from './card.css';
import shrinkIcon from './icon--shrink.svg';
import expandIcon from './icon--expand.svg';
import connectedIcon from "../menu-bar/icon--connected.svg";
import closeIcon from './icon--close.svg';
import Device from '../device/device.jsx';
import tabStyles from "react-tabs/style/react-tabs.css";
import SelectExe from '../device/selectExe.jsx';
import Box from "../box/box.jsx";
// import DataViewCom from '../device/data-view.jsx';

const tabClassNames = {
    tabs: styles.tabs,
    tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
    tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
    tabPanelSelected: classNames(
        tabStyles.reactTabsTabPanelSelected,
        styles.isSelected
    ),
    tabSelected: classNames(
        tabStyles.reactTabsTabSelected,
        styles.isSelected
    ),
};

const DeviecCardHeader = ({ onCloseCards, onShrinkExpandCards, expanded, index, handleSelect }) => (
    <div className={expanded ? styles.headerButtons : classNames(styles.headerButtons, styles.headerButtonsHidden)}>
        <div
            className={styles.deviceButton}
        >
            <img className={styles.connectedIcon} src={connectedIcon} />
            <FormattedMessage
                defaultMessage="Device"
                description="View device information"
                id="gui.menuBar.Device"
            />
        </div>
        <div className={tabClassNames.tabs}>
            <ul className={tabClassNames.tabList}>
                <li className={classNames(tabStyles.reactTabsTab, styles.tab, index === 0 ? styles.isSelected : '')} onClick={() => handleSelect(0)}>
                    <div><FormattedMessage
                        defaultMessage="Port Data"
                        description="Port data"
                        id="gui.menuBar.port-data"
                    /></div>
                </li>
                <li className={classNames(tabStyles.reactTabsTab, styles.tab, index === 1 ? styles.isSelected : '')} onClick={() => handleSelect(1)}>
                    <div><FormattedMessage
                        defaultMessage="Program Selection"
                        description="Program selection"
                        id="gui.menuBar.select-exe"
                    /></div>
                </li>
                {/* <li className={classNames(tabStyles.reactTabsTab, styles.tab, index === 2 ? styles.isSelected : '')} onClick={() => handleSelect(2)}>
                    <div><FormattedMessage
                        defaultMessage="Data View"
                        description="Data View"
                        id="gui.menuBar.data-view"
                    /></div>
                </li> */}
            </ul>
        </div>
        <div className={styles.headerButtonsRight}>
            <div
                className={styles.shrinkExpandButton}
                onClick={onShrinkExpandCards}
            >
                <img
                    draggable={false}
                    src={expanded ? shrinkIcon : expandIcon}
                />
                {expanded ?
                    <FormattedMessage
                        defaultMessage="Shrink"
                        description="Title for button to shrink how-to card"
                        id="gui.cards.shrink"
                    /> :
                    <FormattedMessage
                        defaultMessage="Expand"
                        description="Title for button to expand how-to card"
                        id="gui.cards.expand"
                    />
                }
            </div>
            <div
                className={styles.removeButton}
                onClick={onCloseCards}
            >
                <img
                    className={styles.closeIcon}
                    src={closeIcon}
                />
                <FormattedMessage
                    defaultMessage="Close"
                    description="Title for button to close how-to card"
                    id="gui.cards.close"
                />
            </div>
        </div>
    </div>
);

let top = -30;
const DeviceCards = props => {
    const {
        isRtl,
        onSetDeviceCards,
        deviceCards,
        exeList,
        onSetSelectedExe,
        onSetExelist,
        onShowDelExeAlert,
        completed
    } = props;
    let { x, y, expanded } = deviceCards;
    let screenRef = useRef(null);
    let [index, setIndex] = useState(0);

    useEffect(() => {
        handleScreenAuto();
        window.onresize = () => handleScreenAuto();
        return () => {
            window.onresize = null;
        }
    }, [screenRef])

    const onCloseCards = useCallback(() => onSetDeviceCards({ ...deviceCards, deviceVisible: false }), [deviceCards]);
    const onShrinkExpandCards = useCallback(() => onSetDeviceCards({ ...deviceCards, expanded: !expanded }), [deviceCards]);
    const onStartDrag = useCallback(() => onSetDeviceCards({ ...deviceCards, dragging: true }), [deviceCards]);
    const onEndDrag = useCallback(() => onSetDeviceCards({ ...deviceCards, dragging: false }), [deviceCards]);
    const onDrag = useCallback((e_, data) => onSetDeviceCards({ ...deviceCards, x: data.x, y: data.y }), [deviceCards]);
    // Tutorial cards need to calculate their own dragging bounds
    // to allow for dragging the cards off the left, right and bottom
    // edges of the workspace.
    const cardHorizontalDragOffset = 400; // ~80% of card width
    const cardVerticalDragOffset = expanded ? 257 : 0; // ~80% of card height, if expanded
    const menuBarHeight = 48; // TODO: get pre-calculated from elsewhere?
    const wideCardWidth = 500;

    if (x === 0 && y === 0) {
        // initialize positions
        x = isRtl ? (-190 - wideCardWidth - cardHorizontalDragOffset) : 292;
        x += cardHorizontalDragOffset;
        // The tallest cards are about 320px high, and the default position is pinned
        // to near the bottom of the blocks palette to allow room to work above.
        // const tallCardHeight = 320;
        // const bottomMargin = 60; // To avoid overlapping the backpack region
        // y = window.innerHeight - tallCardHeight - bottomMargin - menuBarHeight;
    }


    const select = (i) => {
        setIndex(i);
        if (!completed) {
            if (i === 1) window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.EXE.FILES, sendParams: { type: 'FILE' } });
        }
    }

    const handleSelect = useCallback((i) => select(i), [index]);

    const handleSelectExe = (item, index) => {
        const newList = exeList.map((item, i) => {
            item.index = i;
            if (i === index) {
                item.checked = true;
            } else {
                item.checked = false;
            }
            return item;
        });
        onSetExelist(newList);
        onSetSelectedExe(item);
    }
    const handleDelExe = (item, e) => {
        e.stopPropagation();
        window.myAPI.ipcRender({
            sendName: ipc_Renderer.SEND_OR_ON.EXE.DELETE,
            sendParams: { fileName: item.name + '.bin', verifyType: "DELETE_EXE" },
        });
        window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.EXE.FILES, sendParams: { type: 'FILE' } });
        onShowDelExeAlert("delExeSuccess");
    }

    const handleScreenAuto = useCallback(() => {
        const designDraftWidth = 1920;
        const designDraftHeight = 1080;
        // 根据屏幕的变化适配的比例
        const scale =
            document.documentElement.clientWidth /
                document.documentElement.clientHeight <
                designDraftWidth / designDraftHeight
                ? document.documentElement.clientWidth / designDraftWidth
                : document.documentElement.clientHeight / designDraftHeight;
        const newScale = `scale(${scale})`;
        top = Math.ceil(Math.ceil(-30 * (1 / scale)) * (1 / scale) * 1.4);
        // 缩放比例
        if (screenRef.current.style.transform.indexOf('scale') === -1) {
            screenRef.current.style.transform += newScale;
        } else {
            screenRef.current.style.transform = screenRef.current.style.transform.replace(/scale\([\s*\S*]*\)/, newScale);
        }
    }, [screenRef]);

    const handleScale = () => {
        if (!screenRef || !screenRef.current || index > 0) return;
        const box = screenRef.current;
        const originalWidth = box.offsetWidth;
        const originalHeight = box.offsetHeight;

        // 计算缩放比例
        const scaleX = box.offsetWidth / originalWidth;
        const scaleY = box.offsetHeight / originalHeight;

        // 计算拖动范围
        return {
            left: -20,
            top: top,
            right: originalWidth * scaleX,
            bottom: originalHeight * scaleY
        }
    }

    const changeBounds = useMemo(() => handleScale(), [screenRef]);

    return (
        // Custom overlay to act as the bounding parent for the draggable, using values from above
        <div
            className={styles.cardContainerOverlay}
            id='screen'
            style={{
                width: `${window.innerWidth + (2 * cardHorizontalDragOffset)}px`,
                height: `${window.innerHeight - menuBarHeight + cardVerticalDragOffset}px`,
                top: `${menuBarHeight}px`,
                left: `${-cardHorizontalDragOffset}px`
            }}
        >
            <Box className={styles.cardBox}>
                <Draggable
                    bounds={changeBounds}
                    cancel=".input-wrapper"
                    position={{ x: x, y: y }}
                    onDrag={onDrag}
                    onStart={onStartDrag}
                    onStop={onEndDrag}
                >
                    <div className={styles.cardContainer} ref={screenRef}>
                        <div className={styles.card}>
                            <DeviecCardHeader
                                index={index}
                                expanded={expanded}
                                onCloseCards={onCloseCards}
                                onShrinkExpandCards={onShrinkExpandCards}
                                handleSelect={handleSelect}
                            />
                            <div className={classNames(expanded ? styles.stepBody : styles.hidden, styles.stepDeviceBody, 'input-wrapper')}>
                                {index === 0 && <Device {...props} />}
                                {index === 1 && <SelectExe {...props} handleSelectExe={handleSelectExe} handleDelExe={handleDelExe} />}
                                {/* {index === 2 && <DataViewCom {...props} />} */}
                            </div>
                        </div>
                    </div>
                </Draggable>
            </Box>
        </div>
    );
};

DeviceCards.propTypes = {
    isRtl: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
};


export {
    DeviceCards as default
};
