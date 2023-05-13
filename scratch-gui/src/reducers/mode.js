const SET_FULL_SCREEN = 'scratch-gui/mode/SET_FULL_SCREEN';
const SET_PLAYER = 'scratch-gui/mode/SET_PLAYER';
const SET_GEN = 'scratch-gui/mode/SET_GEN';
const GET_CODE = 'scratch-gui/mode/GET_CODE';
const initialState = {
    showBranding: false,
    isFullScreen: false,
    isPlayerOnly: false,
    hasEverEnteredEditor: true,
    isGen: false,
    code: ""
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case SET_FULL_SCREEN:
            return Object.assign({}, state, {
                isFullScreen: action.isFullScreen,
            });
        case SET_PLAYER:
            return Object.assign({}, state, {
                isPlayerOnly: action.isPlayerOnly,
                hasEverEnteredEditor: state.hasEverEnteredEditor || !action.isPlayerOnly,
            });
        case SET_GEN:
            return Object.assign({}, state, {
                isGen: action.isGen
            });
        case GET_CODE:
            return Object.assign({}, state, {
                code: action.code
            });
        default:
            return state;
    }
};

const setFullScreen = function (isFullScreen) {
    return {
        type: SET_FULL_SCREEN,
        isFullScreen: isFullScreen
    };
};
const setPlayer = function (isPlayerOnly) {
    return {
        type: SET_PLAYER,
        isPlayerOnly: isPlayerOnly
    };
};
const setGen = function (isGen) {
    return {
        type: SET_GEN,
        isGen: !isGen
    };
};
const getCode = function (code) {
    return {
        type: GET_CODE,
        code: code
    }
}
export {
    reducer as default,
    initialState as modeInitialState,
    setFullScreen,
    setPlayer,
    setGen,
    getCode
};
