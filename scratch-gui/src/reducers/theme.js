import { createSlice } from "@reduxjs/toolkit";
import { detectTheme } from "../lib/themes/themePersistance";

const initialState = {
    theme: detectTheme(),
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme(state, action) {
            state.theme = action.payload;
        },
    },
});

export default themeSlice.reducer;
export const themeInitialState = initialState;
export const { setTheme } = themeSlice.actions;
