import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
// import { ipc } from "est-link";
import LanguageMenu from './language-menu.jsx';
import MenuBarMenu from './menu-bar-menu.jsx';
import ThemeMenu from './theme-menu.jsx';
import { MenuSection, MenuItem } from '../menu/menu.jsx';

import menuBarStyles from './menu-bar.css';
import styles from './settings-menu.css';

import dropdownCaret from './dropdown-caret.svg';
import settingsIcon from './icon--settings.svg';
import HelpMenu from './help-menu.jsx';

const ariaMessages = defineMessages({
    foundUpdate: {
        id: "gui.main.foundUpdate",
        defaultMessage: "Discovered a new version, do you want to go and download it?",
        description: "Discovered a new version, do you want to go and download it?",
    },
    isNew: {
        id: "gui.main.isNew",
        defaultMessage: "It is currently the latest version!",
        description: "It is currently the latest version!",
    },
});

const SettingsMenu = ({
    canChangeLanguage,
    canChangeTheme,
    canChangeHelp,
    isRtl,
    onRequestClose,
    onRequestOpen,
    settingsMenuOpen,
    getMainMessage,
    handleHelp,
    onShowQrcode,
    intl
}) => {

    async function handleCheckUpdate() {
        const res = await fetch("https://zsff.drluck.club/ATC/openUpload.json");
        const result = await res.json();
        const newVersion = _reType(result.newVersion);
        let currentVersion = await window.myAPI.onGetVersion();
        currentVersion = _reType(currentVersion);
        if (newVersion <= currentVersion) {
            alert(intl.formatMessage(ariaMessages.isNew));
        } else {
            const flag = confirm(intl.formatMessage(ariaMessages.foundUpdate));
            if (flag) {
                window.myAPI.openExternal(result.download);
            }
        }
        window.myAPI.ipcRender({ sendName: 'mainOnFocus' });
        function _reType(ver) {
            const str = ver.split('.').join('');
            return parseInt(str);
        }
    }

    return (
        <div
            className={classNames(menuBarStyles.menuBarItem, menuBarStyles.hoverable, menuBarStyles.themeMenu, {
                [menuBarStyles.active]: settingsMenuOpen
            })}
            onMouseUp={onRequestOpen}
        >
            <img
                src={settingsIcon}
            />
            <span className={styles.dropdownLabel}>
                <FormattedMessage
                    defaultMessage="Settings"
                    description="Settings menu"
                    id="gui.menuBar.settings"
                />
            </span>
            <img src={dropdownCaret} alt="" />
            <MenuBarMenu
                className={menuBarStyles.menuBarMenu}
                open={settingsMenuOpen}
                place={isRtl ? 'left' : 'right'}
                onRequestClose={onRequestClose}
            >
                <MenuSection>
                    {canChangeLanguage && <LanguageMenu onRequestCloseSettings={onRequestClose} getMainMessage={getMainMessage} />}
                    {canChangeTheme && <ThemeMenu onRequestCloseSettings={onRequestClose} />}
                    {canChangeHelp && <HelpMenu handleHelp={handleHelp} onRequestCloseSettings={onRequestClose} />}
                    {/* <MenuItem onClick={reUpdateDriver}>
                    <span className={styles.dropdownLabel}>
                        <FormattedMessage
                            defaultMessage="Reinstall driver"
                            description="Reinstall driver"
                            id="gui.menuBar.reinstallDriver"
                        />
                    </span>
                </MenuItem> */}
                    <MenuItem onClick={onShowQrcode}>
                        <span className={styles.dropdownLabel}>
                            <FormattedMessage
                                defaultMessage="Problem feedback"
                                description="Problem feedback"
                                id="gui.menuBar.problemFeedback"
                            />
                        </span>
                    </MenuItem>
                    <MenuItem onClick={handleCheckUpdate}>
                        <span className={styles.dropdownLabel}>
                            <FormattedMessage
                                defaultMessage="Check for updates..."
                                description="Check for updates..."
                                id="gui.main.checkUpdate"
                            />
                        </span>
                    </MenuItem>
                </MenuSection>
            </MenuBarMenu>
        </div>
    )
};

SettingsMenu.propTypes = {
    canChangeLanguage: PropTypes.bool,
    canChangeTheme: PropTypes.bool,
    isRtl: PropTypes.bool,
    onRequestClose: PropTypes.func,
    onRequestOpen: PropTypes.func,
    settingsMenuOpen: PropTypes.bool
};

export default React.memo(SettingsMenu);
