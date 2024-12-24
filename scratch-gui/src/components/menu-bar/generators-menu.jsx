import React, { useState } from 'react'
import classNames from 'classnames';
import menuBarStyles from './menu-bar.css';
import styles from './settings-menu.css';
import { FormattedMessage } from 'react-intl';
import genIcon from "./icon--generator.svg";
import dropdownCaret from './dropdown-caret.svg';
import MenuBarMenu from './menu-bar-menu.jsx';
import { MenuSection, MenuItem } from '../menu/menu.jsx';
import check from "./check.svg";
import ScratchBlocks from "scratch-blocks";
import { genList } from "../../config/json/generators.json";

function GeneratorsMenu(props) {
    const { onSetGen, isGen, onClickGen, onRequestCloseGen, isRtl, genMenuOpen, onSetGeneratorName, generatorName, onGetCode, workspace } = props;

    const [ typeName, setTypeName ] = useState(genList[0].typeName);

    function changeCodeName(item) {
        const code = ScratchBlocks[item.generatorName].workspaceToCode(workspace);
        onGetCode(code);
        setTypeName(item.typeName);
        if (generatorName !== item.generatorName) {
            onSetGeneratorName(item.generatorName);
            if (!isGen) {
                onSetGen(true);
            }
            return;
        }
        onSetGen(!isGen);
    }


    return (
        <div
            id="menuBarGen"
            className={classNames(
                menuBarStyles.menuBarItem,
                menuBarStyles.hoverable,
                menuBarStyles.generator,
                {
                    [menuBarStyles.active]: genMenuOpen,
                }
            )}
            onMouseUp={onClickGen}
        >
            <img className={menuBarStyles.unconnectedIcon} src={genIcon} alt="" />
            <span className={menuBarStyles.collapsibleLabel} style={{ minWidth: '110px'}}>
                <FormattedMessage
                    defaultMessage="Generator"
                    description="Text for menubar Generator button"
                    id="gui.menuBar.Generator"
                />: {typeName}
            </span>
            <img src={dropdownCaret} alt="" />
            <MenuBarMenu
                className={menuBarStyles.menuBarMenu}
                open={genMenuOpen}
                place={isRtl ? 'left' : 'right'}
                onRequestClose={onRequestCloseGen}
            >
                <MenuSection>
                    {
                        genList.map((item, index) => {
                            return (
                                <MenuItem onClick={() => changeCodeName(item)} key={index}>
                                    <img
                                        className={classNames(styles.check, {
                                            [styles.selected]: generatorName === item.generatorName
                                        })}
                                        src={check}
                                        alt=""
                                    />
                                    <span className={styles.dropdownLabel}>{item.typeName}</span>
                                </MenuItem>
                            )
                        })
                    }
                </MenuSection>
            </MenuBarMenu>
        </div>
    )
}

export default React.memo(GeneratorsMenu);
