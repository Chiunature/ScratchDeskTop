import React from "react";
import classNames from "classnames";
import menuBarStyles from "./menu-bar.css";
import { FormattedMessage } from "react-intl";
import dropdownCaret from "./dropdown-caret.svg";
import MenuBarMenu from "./menu-bar-menu.jsx";
import { MenuSection, MenuItem } from "../menu/menu.jsx";
import connectedIcon from "./icon--connected.svg";
import unconnectedIcon from "./icon--unconnected.svg";

function DeviceMenu(props) {
    const {
        peripheralName,
        showDeviceCards,
        showProgramCards,
        onClickDevice,
        onRequestCloseDevice,
        isRtl,
        deviceMenuOpen,
    } = props;

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
            onMouseUp={showProgramCards}
        >
            <img
                className={menuBarStyles.unconnectedIcon}
                src={peripheralName ? connectedIcon : unconnectedIcon}
                alt=""
            />
            <span className={menuBarStyles.collapsibleLabel}>
                <FormattedMessage
                    defaultMessage="Port Data"
                    description="Port data"
                    id="gui.menuBar.port-data"
                />
            </span>
        </div>
    );
}

export default React.memo(DeviceMenu);
