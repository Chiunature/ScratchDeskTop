import React from 'react'
import classNames from 'classnames';
import menuBarStyles from './menu-bar.css';
import { FormattedMessage } from 'react-intl';
import dropdownCaret from './dropdown-caret.svg';
import MenuBarMenu from './menu-bar-menu.jsx';
import { MenuSection, MenuItem } from '../menu/menu.jsx';
import connectedIcon from "./icon--connected.svg";
import unconnectedIcon from "./icon--unconnected.svg";

function DeviceMenu(props) {
    const {  peripheralName, showDeviceCards, showProgramCards, onClickDevice, onRequestCloseDevice, isRtl, deviceMenuOpen } = props;

    return (
        <div
            id="menuBarDevice"
            className={classNames(
                menuBarStyles.menuBarItem,
                menuBarStyles.hoverable,
                menuBarStyles.generator,
                {
                    [menuBarStyles.active]: deviceMenuOpen,
                }
            )}
            onMouseUp={onClickDevice}
        >
            <img className={menuBarStyles.unconnectedIcon} src={peripheralName ? connectedIcon : unconnectedIcon} alt="" />
            <span className={menuBarStyles.collapsibleLabel}>
                <FormattedMessage
                    defaultMessage="Device"
                    description="View device information"
                    id="gui.menuBar.Device"
                />
            </span>
            <img src={dropdownCaret} alt="" />
            <MenuBarMenu
                className={menuBarStyles.menuBarMenu}
                open={deviceMenuOpen}
                place={isRtl ? 'left' : 'right'}
                onRequestClose={onRequestCloseDevice}
            >
                <MenuSection>
                    <MenuItem onClick={showProgramCards}>
                        <FormattedMessage
                            defaultMessage="Port Data"
                            description="Port data"
                            id="gui.menuBar.port-data"
                        />
                    </MenuItem>
                    <MenuItem onClick={showDeviceCards}>
                        <FormattedMessage
                            defaultMessage="Program Selection"
                            description="Program selection"
                            id="gui.menuBar.select-exe"
                        />
                    </MenuItem>
                </MenuSection>
            </MenuBarMenu>
        </div>
    )
}

export default React.memo(DeviceMenu);
