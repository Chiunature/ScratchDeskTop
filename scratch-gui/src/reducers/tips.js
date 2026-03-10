import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    updateObj: null,
};

const tipsSlice = createSlice({
    name: "tips",
    initialState,
    reducers: {
        setTipsUpdateObj(state, action) {
            state.updateObj = action.payload ? { ...action.payload } : null;
        },
    },
});

export default tipsSlice.reducer;
export const tipsInitialState = initialState;
export const { setTipsUpdateObj } = tipsSlice.actions;
