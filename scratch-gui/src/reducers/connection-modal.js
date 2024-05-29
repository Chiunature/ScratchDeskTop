const SET_ID = "scratch-gui/connection-modal/setId";
const SET_NAME = "scratch-gui/connection-modal/setName";
const CLEAR_NAME = "scratch-gui/connection-modal/clearName";
const SET_REALTIME_PROTOCAL_CONNECTION =
    "scratch-gui/connection-modal/setRealtimeConnection";
const SET_LIST_ALL = "scratch-gui/connection-modal/setListAll";
const GET_SERIAL_LIST = "scratch-gui/connection-modal/getSerialList";
const CHANGE_SERIAL_LIST = "scratch-gui/connection-modal/changeSerialList";
const SET_PORT = "scratch-gui/connection-modal/setPort";
const SET_COMPLETED = "scratch-gui/connection-modal/completed";
const SET_SOURCE = "scratch-gui/connection-modal/sourceCompleted";
const SET_SOUNDSLIST = "scratch-gui/connection-modal/soundslist";
const SET_ISCONNECTEDSERIAL = "scratch-gui/connection-modal/isConnectedSerial";
const SET_VERSION = "scratch-gui/connection-modal/version";
const SET_PREGRESS = "scratch-gui/connection-modal/progress";
const initialState = {
    extensionId: null,
    peripheralName: null,
    realtimeConnection: false,
    isListAll: false,
    serialList: [],
    port: null,
    completed: false,
    isConnectedSerial: false,
    version: window?.myAPI?.getStoreValue('version'),
    progress: 0,
    soundslist: [],
    sourceCompleted: false
};

const reducer = function (state, action) {
    if (typeof state === "undefined") state = initialState;
    switch (action.type) {
        case SET_ID:
            return Object.assign({}, state, {
                extensionId: action.extensionId,
            });
        case SET_NAME:
            return Object.assign({}, state, {
                peripheralName: action.peripheralName,
            });
        case CLEAR_NAME:
            return Object.assign({}, state, {
                peripheralName: null,
            });
        case SET_REALTIME_PROTOCAL_CONNECTION:
            return Object.assign({}, state, {
                realtimeConnection: action.isConnected,
            });
        case SET_LIST_ALL:
            return Object.assign({}, state, {
                isListAll: action.isListAll,
            });
        case GET_SERIAL_LIST:
            state.serialList = [...action.serialList];
            return Object.assign({}, state);
        case CHANGE_SERIAL_LIST:
            return Object.assign({}, state, {
                serialList: action.serialList,
            });
        case SET_PORT:
            return Object.assign({}, state, {
                port: action.port,
            });
        case SET_COMPLETED:
            return Object.assign({}, state, {
                completed: action.completed,
            });
        case SET_SOURCE:
            return Object.assign({}, state, {
                sourceCompleted: action.sourceCompleted,
            });
        case SET_SOUNDSLIST:
            return Object.assign({}, state, {
                soundslist: action.soundslist,
            });
        case SET_ISCONNECTEDSERIAL:
            return Object.assign({}, state, {
                isConnectedSerial: action.isConnectedSerial,
            });
        case SET_VERSION:
            return Object.assign({}, state, {
                version: action.version,
            });
        case SET_PREGRESS:
            return Object.assign({}, state, {
                progress: action.progress,
            });
        default:
            return state;
    }
};
const setConnectionModalPeripheralName = function (peripheralName) {
    return {
        type: SET_NAME,
        peripheralName: peripheralName,
    };
};

const clearConnectionModalPeripheralName = function () {
    return {
        type: CLEAR_NAME,
    };
};

const setRealtimeConnection = function (isConnected) {
    return {
        type: SET_REALTIME_PROTOCAL_CONNECTION,
        isConnected: isConnected,
    };
};

const setListAll = function (isListAll) {
    return {
        type: SET_LIST_ALL,
        isListAll: isListAll,
    };
};

const getSerialList = function (serialList) {
    return {
        type: GET_SERIAL_LIST,
        serialList: serialList,
    };
};

const ChangeSerialList = function (serialList, index) {
    serialList.map((el, num) => {
        if (num === index) {
            el.checked = !el.checked;
        } else {
            el.checked = false;
        }
    });
    return {
        type: CHANGE_SERIAL_LIST,
        serialList: serialList,
    };
};

const setConnectionModalExtensionId = function (extensionId) {
    return {
        type: SET_ID,
        extensionId: extensionId,
    };
};

const setIsConnectedSerial = function (isConnectedSerial) {
    return {
        type: SET_ISCONNECTEDSERIAL,
        isConnectedSerial: isConnectedSerial,
    };
};

const setPort = function (port) {
    return {
        type: SET_PORT,
        port: port,
    };
};

const setCompleted = function (completed) {
    return {
        type: SET_COMPLETED,
        completed: completed,
    };
};

const setSourceCompleted = function (sourceCompleted) {
    return {
        type: SET_SOURCE,
        sourceCompleted: sourceCompleted,
    };
};

const setSoundsList = function (soundslist) {
    return {
        type: SET_SOUNDSLIST,
        soundslist: soundslist,
    };
};

const setVersion = function (version) {
    return {
        type: SET_VERSION,
        version: version,
    };
};

const setProgress = function (progress) {
    return {
        type: SET_PREGRESS,
        progress: progress,
    };
};

export {
    reducer as default,
    initialState as connectionModalInitialState,
    setConnectionModalExtensionId,
    setConnectionModalPeripheralName,
    clearConnectionModalPeripheralName,
    setRealtimeConnection,
    setListAll,
    getSerialList,
    ChangeSerialList,
    setPort,
    setCompleted,
    setSoundsList,
    setIsConnectedSerial,
    setVersion,
    setProgress,
    setSourceCompleted
};
