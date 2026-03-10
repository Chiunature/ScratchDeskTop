import { createSlice } from "@reduxjs/toolkit";
import alertsData, { AlertTypes, AlertLevels } from "../lib/alerts/index.jsx";
import extensionData from "../lib/libraries/extensions/index.jsx";

const initialState = {
    visible: true,
    alertsList: [],
    QrcodeVisible: false,
    upinVisible: false,
    upinMsg: "",
    openAutoSave: false,
    autoSaveByBlockType: null,
    showFileNotify: false,
};

const alertsSlice = createSlice({
    name: "alerts",
    initialState,
    reducers: {
        showStandardAlert(state, action) {
            const alertId = action.payload;
            if (!alertId) return;
            const newAlert = { alertId, level: AlertLevels.WARN };
            const alertData = alertsData.find(
                (d) => d.alertId === alertId
            );
            if (!alertData) return;

            const newList = state.alertsList.filter(
                (curAlert) =>
                    !alertData.clearList ||
                    alertData.clearList.indexOf(curAlert.alertId) === -1
            );
            newAlert.alertType = alertData.alertType || AlertTypes.STANDARD;
            newAlert.closeButton = alertData.closeButton;
            newAlert.content = alertData.content;
            newAlert.iconURL = alertData.iconURL;
            newAlert.iconSpinner = alertData.iconSpinner;
            newAlert.level = alertData.level;
            newAlert.showDownload = alertData.showDownload;
            newAlert.showSaveNow = alertData.showSaveNow;
            newAlert.progress = alertData.progress;
            newList.push(newAlert);
            state.alertsList = newList;
        },
        showStandardAlertWithData(state, action) {
            const { alertId, data } = action.payload;
            if (!alertId) return;
            const newAlert = { alertId, level: AlertLevels.WARN };
            const alertData = alertsData.find(
                (d) => d.alertId === alertId
            );
            if (!alertData) return;

            const newList = state.alertsList.filter(
                (curAlert) =>
                    !alertData.clearList ||
                    alertData.clearList.indexOf(curAlert.alertId) === -1
            );
            if (data && data.message) newAlert.message = data.message;
            newAlert.alertType = alertData.alertType || AlertTypes.STANDARD;
            newAlert.closeButton = alertData.closeButton;
            newAlert.content = alertData.content;
            newAlert.iconURL = alertData.iconURL;
            newAlert.iconSpinner = alertData.iconSpinner;
            newAlert.level = alertData.level;
            newAlert.showDownload = alertData.showDownload;
            newAlert.showSaveNow = alertData.showSaveNow;
            newAlert.progress = alertData.progress;
            newList.push(newAlert);
            state.alertsList = newList;
        },
        showExtensionAlert(state, action) {
            const { extensionId } = action.payload;
            if (!extensionId) return;
            const extension = extensionData.find(
                (ext) => ext.extensionId === extensionId
            );
            if (!extension) return;
            state.alertsList.push({
                alertType: AlertTypes.EXTENSION,
                closeButton: true,
                extensionId,
                extensionName: extension.name,
                iconURL: extension.connectionSmallIconURL,
                level: AlertLevels.WARN,
                showReconnect: true,
            });
        },
        closeAlert(state, action) {
            const index = action.payload;
            state.alertsList.splice(index, 1);
        },
        closeAlertWithId(state, action) {
            const alertId = action.payload;
            const index = state.alertsList.findIndex(
                (a) => a.alertId === alertId
            );
            if (index === -1) return;
            state.alertsList.splice(index, 1);
        },
        closeAlertsWithId(state, action) {
            state.alertsList = state.alertsList.filter(
                (curAlert) => curAlert.alertId !== action.payload
            );
        },
        showQrcode(state) {
            state.QrcodeVisible = !state.QrcodeVisible;
        },
        showUpin(state) {
            state.upinVisible = false;
        },
        openAutoSave(state, action) {
            state.openAutoSave = action.payload;
        },
        onAutoSaveByBlockType(state, action) {
            state.autoSaveByBlockType = action.payload;
        },
        showFileNotify(state, action) {
            state.showFileNotify = action.payload;
        },
    },
});

export default alertsSlice.reducer;
export const alertsInitialState = initialState;
export const {
    showStandardAlert,
    showStandardAlertWithData,
    showExtensionAlert,
    closeAlert,
    closeAlertWithId,
    closeAlertsWithId,
    showQrcode,
    showUpin,
    openAutoSave,
    onAutoSaveByBlockType,
    showFileNotify,
} = alertsSlice.actions;

export const filterPopupAlerts = (alertsList) =>
    alertsList.filter(
        (curAlert) =>
            curAlert.alertType === AlertTypes.STANDARD ||
            curAlert.alertType === AlertTypes.EXTENSION
    );

export const filterInlineAlerts = (alertsList) =>
    alertsList.filter(
        (curAlert) => curAlert.alertType === AlertTypes.INLINE
    );

/**
 * showUpin 的副作用版本（原旧代码在 action creator 里做了 fetch，迁移后改为 thunk）
 * gui.jsx 若需要保留 fetch 逻辑，可将调用改为 dispatch(showUpinThunk())
 */
export const showUpinThunk = () => (dispatch) => {
    fetch("scripts/hotVersion.json")
        .then((res) => res.json())
        .then((data) => window.myAPI.setStoreValue("upin", data.version));
    dispatch(showUpin());
};

/**
 * 带超时自动关闭的 alert 派发函数（非纯 action creator，保持原有调用方式不变）
 */
export const showAlertWithTimeout = function (dispatch, alertId) {
    const alertData = alertsData.find(
        (thisAlertData) => thisAlertData.alertId === alertId
    );
    if (alertData) {
        dispatch(showStandardAlert(alertId));
        if (alertData.maxDisplaySecs) {
            setTimeout(() => {
                dispatch(closeAlertsWithId(alertId));
            }, alertData.maxDisplaySecs * 1000);
        }
    }
};
