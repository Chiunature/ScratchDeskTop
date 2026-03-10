import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    extensionId: null,
    peripheralName: null,
    realtimeConnection: false,
    isListAll: false,
    serialList: [],
    port: null,
    completed: false,
    isConnectedSerial: false,
    version: null,
    progress: 0,
    soundslist: [],
    sourceCompleted: false,
};

const connectionModalSlice = createSlice({
    name: "connection-modal",
    initialState,
    reducers: {
        setConnectionModalExtensionId(state, action) {
            state.extensionId = action.payload;
        },
        setConnectionModalPeripheralName(state, action) {
            state.peripheralName = action.payload;
        },
        clearConnectionModalPeripheralName(state) {
            state.peripheralName = null;
        },
        setRealtimeConnection(state, action) {
            state.realtimeConnection = action.payload;
        },
        setListAll(state, action) {
            state.isListAll = action.payload;
        },
        getSerialList(state, action) {
            state.serialList = action.payload ?? [];
        },
        changeSerialList(state, action) {
            const port = action.payload;
            state.serialList = state.serialList.map((el) => ({
                ...el,
                checked: el.id === port.id,
                state: el.id === port.id ? "connected" : "disconnected",
            }));
        },
        setPort(state, action) {
            state.port = action.payload != null ? { ...action.payload } : null;
        },
        setCompleted(state, action) {
            state.completed = action.payload;
        },
        setSourceCompleted(state, action) {
            state.sourceCompleted = action.payload;
        },
        setSoundsList(state, action) {
            state.soundslist = action.payload ?? [];
        },
        setIsConnectedSerial(state, action) {
            state.isConnectedSerial = action.payload;
        },
        setVersion(state, action) {
            state.version = action.payload;
        },
        setProgress(state, action) {
            state.progress = action.payload;
        },
    },
});

export default connectionModalSlice.reducer;
export const connectionModalInitialState = initialState;
export const {
    setConnectionModalExtensionId,
    setConnectionModalPeripheralName,
    clearConnectionModalPeripheralName,
    setRealtimeConnection,
    setListAll,
    getSerialList,
    changeSerialList,
    setPort,
    setCompleted,
    setSoundsList,
    setIsConnectedSerial,
    setVersion,
    setProgress,
    setSourceCompleted,
} = connectionModalSlice.actions;

// 保持对外 API 兼容（原来首字母大写的 ChangeSerialList）
export { changeSerialList as ChangeSerialList };
