import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showFileStytem: false,
};

const fileStytemSlice = createSlice({
    name: "fileStytem",
    initialState,
    reducers: {
        showFileStytem(state) {
            state.showFileStytem = true;
        },
        closeFileStytem(state) {
            state.showFileStytem = false;
        },
    },
});

export default fileStytemSlice.reducer;
export const fileStytemInitialState = initialState;
export const { showFileStytem, closeFileStytem } = fileStytemSlice.actions;
