import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showBranding: false,
    isFullScreen: false,
    isPlayerOnly: false,
    hasEverEnteredEditor: true,
    isGen: false,
    isAiChat: false,
    code: ``,
    isComplete: false,
    compileList: [],
    bufferList: [],
    matchMyBlock: [],
    msgTaskBlock: [],
    exeList: [],
    selectedExe: window?.myAPI?.getStoreValue("selItem")
        ? JSON.parse(window.myAPI.getStoreValue("selItem"))
        : { name: "0_APP", num: 0, checked: true, index: 0 },
    generatorName: "Python",
};

const modeSlice = createSlice({
    name: "mode",
    initialState,
    reducers: {
        setFullScreen(state, action) {
            state.isFullScreen = action.payload;
        },
        setPlayer(state, action) {
            state.isPlayerOnly = action.payload;
            state.hasEverEnteredEditor =
                state.hasEverEnteredEditor || !action.payload;
        },
        setGen(state, action) {
            state.isGen = action.payload;
        },
        setAiChat(state, action) {
            state.isAiChat = action.payload;
        },
        getCode(state, action) {
            state.code = action.payload;
        },
        setIsComplete(state, action) {
            state.isComplete = action.payload;
        },
        setCompileList(state, action) {
            state.compileList = action.payload;
        },
        setBufferList(state, action) {
            state.bufferList = action.payload;
        },
        setMatchMyBlock(state, action) {
            state.matchMyBlock = action.payload;
        },
        setMatchMsgTaskBlock(state, action) {
            state.msgTaskBlock = action.payload;
        },
        setExelist(state, action) {
            state.exeList = action.payload;
        },
        setSelectedExe(state, action) {
            state.selectedExe = action.payload;
        },
        setGeneratorName(state, action) {
            state.generatorName = action.payload;
        },
    },
});

export default modeSlice.reducer;
export const modeInitialState = initialState;
export const {
    setFullScreen,
    setPlayer,
    setGen,
    setAiChat,
    getCode,
    setIsComplete,
    setCompileList,
    setBufferList,
    setMatchMyBlock,
    setMatchMsgTaskBlock,
    setExelist,
    setSelectedExe,
    setGeneratorName,
} = modeSlice.actions;

/**
 * setExelist 的带持久化副作用版本（原 action creator 调用了 window.myAPI.setStoreValue）
 */
export const setExelistWithPersist = (exeList) => (dispatch) => {
    window.myAPI.setStoreValue("exeList", JSON.stringify(exeList));
    dispatch(setExelist(exeList));
};

/**
 * setSelectedExe 的带持久化副作用版本
 */
export const setSelectedExeWithPersist = (selectedExe) => (dispatch) => {
    window.myAPI.setStoreValue("selItem", JSON.stringify(selectedExe));
    dispatch(setSelectedExe(selectedExe));
};
