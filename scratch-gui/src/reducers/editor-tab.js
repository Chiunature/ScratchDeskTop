import { createSlice } from "@reduxjs/toolkit";

export const BLOCKS_TAB_INDEX = 0;
export const COSTUMES_TAB_INDEX = 1;
export const SOUNDS_TAB_INDEX = 1;

const initialState = {
    activeTabIndex: BLOCKS_TAB_INDEX,
};

const editorTabSlice = createSlice({
    name: "editorTab",
    initialState,
    reducers: {
        activateTab(state, action) {
            state.activeTabIndex = action.payload;
        },
    },
});

export default editorTabSlice.reducer;
export const editorTabInitialState = initialState;
export const { activateTab } = editorTabSlice.actions;
