import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import themeIcon from "./icon--theme.svg";

import {MenuItem, Submenu} from '../menu/menu.jsx';

import {openThemeMenu, themeMenuOpen} from '../../reducers/menus.js';

import styles from './settings-menu.css';
import dropdownCaret from './dropdown-caret.svg';

import ColorPicker from '../color-picker/color-picker.jsx';

const PickerMenu = ({menuOpen, isRtl, onRequestOpen}) => 
        (<MenuItem
                expanded={menuOpen}
            >
                <div
                        className={styles.option}
                        onClick={onRequestOpen}
                    >
                        <img
                            className={styles.icon}
                            src={themeIcon}
                        />
                        <span className={styles.submenuLabel}>
                            <FormattedMessage
                                defaultMessage="Theme"
                                description="Text for menubar Theme button"
                                id="gui.menuBar.Theme"
                            />
                        </span>
                        <img
                        className={styles.expandCaret}
                        src={dropdownCaret}
                    />
                    </div>
                    <Submenu
                    place={isRtl ? 'left' : 'right'}
                >
                    <ColorPicker/>
                </Submenu>
            </MenuItem>);

PickerMenu.propTypes = {
    isRtl: PropTypes.bool,
    menuOpen: PropTypes.bool,
    onRequestOpen: PropTypes.func,
};

const mapStateToProps = state => ({
    isRtl: state.locales.isRtl,
    menuOpen: themeMenuOpen(state),
});

const mapDispatchToProps = (dispatch) => ({
    onRequestOpen: () => dispatch(openThemeMenu())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PickerMenu);
