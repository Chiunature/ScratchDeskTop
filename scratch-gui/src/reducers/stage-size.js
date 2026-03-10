import { createSlice } from "@reduxjs/toolkit";
import { STAGE_DISPLAY_SIZES } from "../lib/layout-constants.js";

const initialState = {
    stageSize: STAGE_DISPLAY_SIZES.large,
};

const stageSizeSlice = createSlice({
    name: "stageSize",
    initialState,
    reducers: {
        setStageSize(state, action) {
            state.stageSize = action.payload;
        },
    },
});

export default stageSizeSlice.reducer;
export const stageSizeInitialState = initialState;
export const { setStageSize } = stageSizeSlice.actions;
