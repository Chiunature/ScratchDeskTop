import PropTypes from 'prop-types';
import React, { useState } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import Draggable from 'react-draggable';

import styles from './card.css';

import shrinkIcon from './icon--shrink.svg';
import expandIcon from './icon--expand.svg';
import connectedIcon from "../menu-bar/icon--connected.svg";
import closeIcon from './icon--close.svg';
import Device from '../device/device.jsx';
import tabStyles from "react-tabs/style/react-tabs.css";
import SelectExe from '../device/selectExe.jsx';

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
                <li className={classNames(tabStyles.reactTabsTab, styles.tab, index === 0 ? styles.isSelected : '')} onClick={() => handleSelect(0)}><div>程序选择</div></li>
                <li className={classNames(tabStyles.reactTabsTab, styles.tab, index === 1 ? styles.isSelected : '')} onClick={() => handleSelect(1)}><div>端口数据</div></li>
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

const DeviceCards = props => {
    const {
        isRtl,
        onSetDeviceCards,
        deviceCards,
        exeList,
        onSetSelectedExe,
        onSetExelist,
        handleStopWatch,
    } = props;
    let { x, y, expanded } = deviceCards;

    const onCloseCards = () => onSetDeviceCards({ ...deviceCards, deviceVisible: false });
    const onShrinkExpandCards = () => onSetDeviceCards({ ...deviceCards, expanded: !expanded });
    const onDrag = (e_, data) => onSetDeviceCards({ ...deviceCards, x: data.x, y: data.y });
    const onStartDrag = () => onSetDeviceCards({ ...deviceCards, dragging: true });
    const onEndDrag = () => onSetDeviceCards({ ...deviceCards, dragging: false });
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
        const tallCardHeight = 320;
        const bottomMargin = 60; // To avoid overlapping the backpack region
        y = window.innerHeight - tallCardHeight - bottomMargin - menuBarHeight - 310;
    }

    const [index, setIndex] = useState(0);
    const handleSelect = (i) => {
        setIndex(i);
        if(i === 0 ) {
            handleStopWatch(true);
        }else {
            handleStopWatch(false);
        }
    }
    const handleSelectExe = (item) => {
        const index = item.num - 1;
        const newList = exeList.map((item, i) => {
            if(i === index) {
                item.checked = true;
            }else {
                item.checked = false;
            }
            return item;
        });
        onSetExelist(newList);
        onSetSelectedExe(item);
        localStorage.setItem('exeList', JSON.stringify(newList));
        localStorage.setItem('selItem', JSON.stringify(item));
    }

    return (
        // Custom overlay to act as the bounding parent for the draggable, using values from above
        <div
            className={styles.cardContainerOverlay}
            style={{
                width: `${window.innerWidth + (2 * cardHorizontalDragOffset)}px`,
                height: `${window.innerHeight - menuBarHeight + cardVerticalDragOffset}px`,
                top: `${menuBarHeight}px`,
                left: `${-cardHorizontalDragOffset}px`
            }}
        >
            <Draggable
                bounds="parent"
                cancel=".input-wrapper"
                position={{ x: x, y: y }}
                onDrag={onDrag}
                onStart={onStartDrag}
                onStop={onEndDrag}
            >
                <div className={styles.cardContainer}>
                    <div className={styles.card}>
                        <DeviecCardHeader
                            index={index}
                            expanded={expanded}
                            onCloseCards={onCloseCards}
                            onShrinkExpandCards={onShrinkExpandCards}
                            handleSelect={handleSelect}
                        />
                        <div className={classNames(expanded ? styles.stepBody : styles.hidden, 'input-wrapper')}>
                            {index === 1 && <Device {...props}/>}
                            {index === 0 && <SelectExe {...props} handleSelectExe={handleSelectExe}/>}
                        </div>
                    </div>
                </div>
            </Draggable>
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
