import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    deviceId: null,
    deviceName: null,
    deviceType: "serialport",
    deviceStatus: null,
    currentMAC: null,
    deviceObj: {
        deviceList: [],
        mem: {},
        flashlist: {},
    },
};

const deviceSlice = createSlice({
    name: "device",
    initialState,
    reducers: {
        setDeviceId(state, action) {
            state.deviceId = action.payload;
        },
        clearDeviceId(state) {
            state.deviceId = null;
        },
        setDeviceName(state, action) {
            state.deviceName = action.payload;
        },
        clearDeviceName(state) {
            state.deviceName = null;
        },
        setDeviceType(state, action) {
            state.deviceType = action.payload;
        },
        clearDeviceType(state) {
            state.deviceType = null;
        },
        setDeviceObj(state, action) {
            state.deviceObj = action.payload;
        },
        setDeviceStatus(state, action) {
            state.deviceStatus = action.payload;
        },
        setCurrentMAC(state, action) {
            state.currentMAC = action.payload;
        },
    },
});

export default deviceSlice.reducer;
export const deviceInitialState = initialState;
export const {
    setDeviceId,
    clearDeviceId,
    setDeviceName,
    clearDeviceName,
    setDeviceType,
    clearDeviceType,
    setDeviceObj,
    setDeviceStatus,
    setCurrentMAC,
} = deviceSlice.actions;
