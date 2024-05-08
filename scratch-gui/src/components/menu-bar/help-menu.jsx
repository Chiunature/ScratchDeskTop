import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import check from './check.svg';
import { MenuItem, Submenu } from '../menu/menu.jsx';
import { openHelpMenu, helpMenuOpen } from '../../reducers/menus.js';
import {HARDWARE, SOFTWARE, helpMap} from '../../lib/helps';
import helpIcon from "../../lib/assets/icon--tutorials.svg";
import styles from './settings-menu.css';
import dropdownCaret from './dropdown-caret.svg';

const HelpMenuItem = props => {
    const helpInfo = helpMap[props.help];

    return (
        <MenuItem onClick={props.onClick}>
            <div className={styles.option}>
                <img
                    className={classNames(styles.check, { [styles.selected]: props.isSelected })}
                    src={check}
                />
                <FormattedMessage {...helpInfo.label} />
            </div>
        </MenuItem>);
};

HelpMenuItem.propTypes = {
    isSelected: PropTypes.bool,
    onClick: PropTypes.func,
    help: PropTypes.string
};

const HelpMenu = ({
    isRtl,
    menuOpen,
    onRequestOpen,
    onRequestCloseSettings,
    handleHelp,
    help
}) => {
    const enabledHelps = [HARDWARE, SOFTWARE];


    function helpFunc(enabledHelp) {
        handleHelp(enabledHelp);
        onRequestCloseSettings();
    }


    return (
        <MenuItem expanded={menuOpen}>
            <div
                className={styles.option}
                onClick={onRequestOpen}
            >
                <img className={styles.icon} src={helpIcon} />
                <span className={styles.submenuLabel}>
                    <FormattedMessage
                        defaultMessage="Help"
                        description="Button to view help content"
                        id="gui.connection.unavailable.helpbutton"
                    />
                </span>
                <img
                    className={styles.expandCaret}
                    src={dropdownCaret}
                />
            </div>
            <Submenu place={isRtl ? 'left' : 'right'}>
                {enabledHelps.map(enabledHelp => (
                    <HelpMenuItem
                        key={enabledHelp}
                        isSelected={help === enabledHelp}
                        onClick={() => helpFunc(enabledHelp)}
                        help={enabledHelp}
                    />)
                )}
            </Submenu>
        </MenuItem>
    );
};

HelpMenu.propTypes = {
    isRtl: PropTypes.bool,
    menuOpen: PropTypes.bool,
    onChangeHelp: PropTypes.func,
    // eslint-disable-next-line react/no-unused-prop-types
    onRequestCloseSettings: PropTypes.func,
    onRequestOpen: PropTypes.func,
};

const mapStateToProps = state => ({
    isRtl: state.locales.isRtl,
    menuOpen: helpMenuOpen(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onRequestOpen: () => dispatch(openHelpMenu())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HelpMenu);
