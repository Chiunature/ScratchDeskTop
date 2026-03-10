import { createSlice } from "@reduxjs/toolkit";

const MENU_ABOUT = "aboutMenu";
const MENU_ACCOUNT = "accountMenu";
const MENU_EDIT = "editMenu";
const MENU_FILE = "fileMenu";
const MENU_LANGUAGE = "languageMenu";
const MENU_LOGIN = "loginMenu";
const MENU_MODE = "modeMenu";
const MENU_SETTINGS = "settingsMenu";
const MENU_THEME = "themeMenu";
const MENU_HELP = "HELPMenu";
const MENU_GEN = "genMenu";
const MENU_DEVICE = "deviceMenu";

class Menu {
    constructor(id) {
        this.id = id;
        this.children = [];
        this.parent = null;
    }

    addChild(menu) {
        this.children.push(menu);
        menu.parent = this;
        return this;
    }

    descendants() {
        return this.children.flatMap((child) => [child, ...child.descendants()]);
    }

    siblings() {
        if (!this.parent) return [];
        return this.parent.children.filter((child) => child.id !== this.id);
    }

    findById(id) {
        if (this.id === id) return this;
        for (const child of this.children) {
            const found = child.findById(id);
            if (found) return found;
        }
        return null;
    }
}

const rootMenu = new Menu("root")
    .addChild(
        new Menu(MENU_SETTINGS)
            .addChild(new Menu(MENU_LANGUAGE))
            .addChild(new Menu(MENU_THEME))
            .addChild(new Menu(MENU_HELP))
    )
    .addChild(new Menu(MENU_FILE))
    .addChild(new Menu(MENU_EDIT))
    .addChild(new Menu(MENU_MODE))
    .addChild(new Menu(MENU_SETTINGS))
    .addChild(new Menu(MENU_LOGIN))
    .addChild(new Menu(MENU_ACCOUNT))
    .addChild(new Menu(MENU_ABOUT))
    .addChild(new Menu(MENU_GEN))
    .addChild(new Menu(MENU_DEVICE));

const initialState = {
    [MENU_ABOUT]: false,
    [MENU_ACCOUNT]: false,
    [MENU_EDIT]: false,
    [MENU_FILE]: false,
    [MENU_LANGUAGE]: false,
    [MENU_LOGIN]: false,
    [MENU_MODE]: false,
    [MENU_SETTINGS]: false,
    [MENU_THEME]: false,
    [MENU_HELP]: false,
    [MENU_GEN]: false,
    [MENU_DEVICE]: false,
};

const menusSlice = createSlice({
    name: "menus",
    initialState,
    reducers: {
        openMenu(state, action) {
            const menu = rootMenu.findById(action.payload);
            const toClose = menu
                .siblings()
                .flatMap((sibling) => [sibling, ...sibling.descendants()]);
            toClose.forEach(({ id }) => {
                state[id] = false;
            });
            state[action.payload] = true;
        },
        closeMenu(state, action) {
            const menu = rootMenu.findById(action.payload);
            const toClose = [menu, ...menu.descendants()];
            toClose.forEach(({ id }) => {
                state[id] = false;
            });
        },
    },
});

export default menusSlice.reducer;
export const menuInitialState = initialState;

const { openMenu, closeMenu } = menusSlice.actions;

export const openAboutMenu = () => openMenu(MENU_ABOUT);
export const closeAboutMenu = () => closeMenu(MENU_ABOUT);
export const aboutMenuOpen = (state) => state.scratchGui.menus[MENU_ABOUT];

export const openAccountMenu = () => openMenu(MENU_ACCOUNT);
export const closeAccountMenu = () => closeMenu(MENU_ACCOUNT);
export const accountMenuOpen = (state) => state.scratchGui.menus[MENU_ACCOUNT];

export const openEditMenu = () => openMenu(MENU_EDIT);
export const closeEditMenu = () => closeMenu(MENU_EDIT);
export const editMenuOpen = (state) => state.scratchGui.menus[MENU_EDIT];

export const openFileMenu = () => openMenu(MENU_FILE);
export const closeFileMenu = () => closeMenu(MENU_FILE);
export const fileMenuOpen = (state) => state.scratchGui.menus[MENU_FILE];

export const openLanguageMenu = () => openMenu(MENU_LANGUAGE);
export const closeLanguageMenu = () => closeMenu(MENU_LANGUAGE);
export const languageMenuOpen = (state) =>
    state.scratchGui.menus[MENU_LANGUAGE];

export const openLoginMenu = () => openMenu(MENU_LOGIN);
export const closeLoginMenu = () => closeMenu(MENU_LOGIN);
export const loginMenuOpen = (state) => state.scratchGui.menus[MENU_LOGIN];

export const openModeMenu = () => openMenu(MENU_MODE);
export const closeModeMenu = () => closeMenu(MENU_MODE);
export const modeMenuOpen = (state) => state.scratchGui.menus[MENU_MODE];

export const openSettingsMenu = () => openMenu(MENU_SETTINGS);
export const closeSettingsMenu = () => closeMenu(MENU_SETTINGS);
export const settingsMenuOpen = (state) =>
    state.scratchGui.menus[MENU_SETTINGS];

export const openThemeMenu = () => openMenu(MENU_THEME);
export const closeThemeMenu = () => closeMenu(MENU_THEME);
export const themeMenuOpen = (state) => state.scratchGui.menus[MENU_THEME];

export const openHelpMenu = () => openMenu(MENU_HELP);
export const closeHelpMenu = () => closeMenu(MENU_HELP);
export const helpMenuOpen = (state) => state.scratchGui.menus[MENU_HELP];

export const openGenMenu = () => openMenu(MENU_GEN);
export const closeGenMenu = () => closeMenu(MENU_GEN);
export const genMenuOpen = (state) => state.scratchGui.menus[MENU_GEN];

export const openDeviceMenu = () => openMenu(MENU_DEVICE);
export const closeDeviceMenu = () => closeMenu(MENU_DEVICE);
export const deviceMenuOpen = (state) => state.scratchGui.menus[MENU_DEVICE];
