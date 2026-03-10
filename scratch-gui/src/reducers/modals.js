import { createSlice } from "@reduxjs/toolkit";

const MODAL_BACKDROP_LIBRARY = "backdropLibrary";
const MODAL_COSTUME_LIBRARY = "costumeLibrary";
const MODAL_EXTENSION_LIBRARY = "extensionLibrary";
const MODAL_LOADING_PROJECT = "loadingProject";
const MODAL_TELEMETRY = "telemetryModal";
const MODAL_SOUND_LIBRARY = "soundLibrary";
const MODAL_SPRITE_LIBRARY = "spriteLibrary";
const MODAL_SOUND_RECORDER = "soundRecorder";
const MODAL_CONNECTION = "connectionModal";
const MODAL_TIPS_LIBRARY = "tipsLibrary";
const MODAL_CASCADER_PANEL = "cascarderPanel";
const MODAL_BLELIST = "bleList";

const initialState = {
    [MODAL_BACKDROP_LIBRARY]: false,
    [MODAL_COSTUME_LIBRARY]: false,
    [MODAL_EXTENSION_LIBRARY]: false,
    [MODAL_LOADING_PROJECT]: false,
    [MODAL_TELEMETRY]: false,
    [MODAL_SOUND_LIBRARY]: false,
    [MODAL_SPRITE_LIBRARY]: false,
    [MODAL_SOUND_RECORDER]: false,
    [MODAL_CONNECTION]: false,
    [MODAL_TIPS_LIBRARY]: false,
    [MODAL_CASCADER_PANEL]: false,
    [MODAL_BLELIST]: false,
};

const modalsSlice = createSlice({
    name: "modals",
    initialState,
    reducers: {
        openModal(state, action) {
            state[action.payload] = true;
        },
        closeModal(state, action) {
            state[action.payload] = false;
        },
    },
});

export default modalsSlice.reducer;
export const modalsInitialState = initialState;

const { openModal, closeModal } = modalsSlice.actions;

export const openBackdropLibrary = () => openModal(MODAL_BACKDROP_LIBRARY);
export const openCostumeLibrary = () => openModal(MODAL_COSTUME_LIBRARY);
export const openExtensionLibrary = () => openModal(MODAL_EXTENSION_LIBRARY);
export const openLoadingProject = () => openModal(MODAL_LOADING_PROJECT);
export const openTelemetryModal = () => openModal(MODAL_TELEMETRY);
export const openSoundLibrary = () => openModal(MODAL_SOUND_LIBRARY);
export const openSpriteLibrary = () => openModal(MODAL_SPRITE_LIBRARY);
export const openSoundRecorder = () => openModal(MODAL_SOUND_RECORDER);
export const openConnectionModal = () => openModal(MODAL_CONNECTION);
export const openCascaderPanelModal = () => openModal(MODAL_CASCADER_PANEL);
export const openBleListModal = () => openModal(MODAL_BLELIST);
export const openTipsLibrary = () => openModal(MODAL_TIPS_LIBRARY);

export const closeBackdropLibrary = () => closeModal(MODAL_BACKDROP_LIBRARY);
export const closeCostumeLibrary = () => closeModal(MODAL_COSTUME_LIBRARY);
export const closeExtensionLibrary = () => closeModal(MODAL_EXTENSION_LIBRARY);
export const closeLoadingProject = () => closeModal(MODAL_LOADING_PROJECT);
export const closeTelemetryModal = () => closeModal(MODAL_TELEMETRY);
export const closeSpriteLibrary = () => closeModal(MODAL_SPRITE_LIBRARY);
export const closeSoundLibrary = () => closeModal(MODAL_SOUND_LIBRARY);
export const closeSoundRecorder = () => closeModal(MODAL_SOUND_RECORDER);
export const closeTipsLibrary = () => closeModal(MODAL_TIPS_LIBRARY);
export const closeConnectionModal = () => closeModal(MODAL_CONNECTION);
export const closeCascaderPanelModal = () => closeModal(MODAL_CASCADER_PANEL);
export const closeBleListModal = () => closeModal(MODAL_BLELIST);
