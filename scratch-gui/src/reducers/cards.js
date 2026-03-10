import { createSlice } from "@reduxjs/toolkit";
import analytics from "../lib/analytics";
import decks from "../lib/libraries/decks/index.jsx";

const initialState = {
    visible: false,
    content: decks,
    activeDeckId: null,
    step: 0,
    x: 0,
    y: 0,
    expanded: true,
    dragging: false,
    deviceCards: {
        deviceVisible: false,
        position: { x: 0, y: 0 },
        expanded: true,
        dragging: false,
    },
    programSel: false,
};

const cardsSlice = createSlice({
    name: "cards",
    initialState,
    reducers: {
        closeCards(state) {
            state.visible = false;
        },
        shrinkExpandCards(state) {
            state.expanded = !state.expanded;
        },
        viewCards(state) {
            state.visible = true;
        },
        activateDeck(state, action) {
            state.activeDeckId = action.payload;
            state.step = 0;
            state.x = 0;
            state.y = 0;
            state.expanded = true;
            state.visible = true;
        },
        nextStep(state) {
            if (state.activeDeckId !== null) {
                state.step += 1;
            }
        },
        prevStep(state) {
            if (state.activeDeckId !== null && state.step > 0) {
                state.step -= 1;
            }
        },
        dragCard(state, action) {
            state.x = action.payload.x;
            state.y = action.payload.y;
        },
        startDrag(state) {
            state.dragging = true;
        },
        endDrag(state) {
            state.dragging = false;
        },
        viewDeviceCards(state, action) {
            if (state.deviceCards.deviceVisible === action.payload) return;
            state.deviceCards = {
                deviceVisible: !state.deviceCards.deviceVisible,
                x: 0,
                y: 0,
                expanded: true,
            };
        },
        setDeviceCards(state, action) {
            state.deviceCards = action.payload;
        },
        setProgramSel(state, action) {
            state.programSel = action.payload;
        },
    },
});

export default cardsSlice.reducer;
export const cardsInitialState = initialState;
export const {
    closeCards,
    shrinkExpandCards,
    viewCards,
    activateDeck,
    nextStep,
    prevStep,
    dragCard,
    startDrag,
    endDrag,
    viewDeviceCards,
    setDeviceCards,
    setProgramSel,
} = cardsSlice.actions;

/**
 * nextStep 的带 analytics 副作用版本（原 reducer 里调用了 analytics.event）
 * 若业务需要埋点，可将调用改为 dispatch(nextStepWithAnalytics())
 */
export const nextStepWithAnalytics = () => (dispatch, getState) => {
    const { activeDeckId, step } = getState().scratchGui.cards;
    if (activeDeckId !== null) {
        analytics.event({
            category: "how-to",
            action: "next step",
            label: `${activeDeckId} - ${step}`,
        });
        dispatch(nextStep());
    }
};
