const SET_FULL_SCREEN = 'scratch-gui/mode/SET_FULL_SCREEN';
const SET_PLAYER = 'scratch-gui/mode/SET_PLAYER';
const SET_GEN = 'scratch-gui/mode/SET_GEN';
const GET_CODE = 'scratch-gui/mode/GET_CODE';
const SET_ISCOMPLETE = 'scratch-gui/mode/SET_ISCOMPLETE';
const SET_COMPILELIST = 'scratch-gui/mode/SET_COMPILELIST';
const SET_BUFFERLIST = 'scratch-gui/mode/SET_BUFFERLIST';
const SET_MATCHMYBLOCK = 'scratch-gui/mode/SET_MATCHMYBLOCK';
const SET_EXELIST = 'scratch-gui/mode/SET_EXELIST';
const initialState = {
    showBranding: false,
    isFullScreen: false,
    isPlayerOnly: false,
    hasEverEnteredEditor: true,
    isGen: false,
    code: `#include <stdio.h>\n#include <stdlib.h>\nint main() {\n\n\n}`,
    isComplete: false,
    compileList: [],
    bufferList: [],
    matchMyBlock: [],
    exeList: ['1_APP', '2_APP', '3_APP', '4_APP', '5_APP']
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
        case SET_ISCOMPLETE:
            return Object.assign({}, state, {
                isComplete: action.isComplete
            });
        case SET_COMPILELIST:
            return Object.assign({}, state, {
                compileList: action.compileList
            });
        case SET_BUFFERLIST:
            return Object.assign({}, state, {
                bufferList: action.bufferList
            });
        case SET_MATCHMYBLOCK:
            return Object.assign({}, state, {
                matchMyBlock: action.matchMyBlock
            });
        case SET_EXELIST:
            return Object.assign({}, state, {
                exeList: action.exeList
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
};
const setCompileList = function (compileList) {
    return {
        type: SET_COMPILELIST,
        compileList: compileList
    }
};
const setBufferList = function (bufferList) {
    return {
        type: SET_BUFFERLIST,
        bufferList: bufferList
    }
};
const setMatchMyBlock = function (matchMyBlock) {
    return {
        type: SET_MATCHMYBLOCK,
        matchMyBlock: matchMyBlock
    }
};
const setIsComplete = function (isComplete) {
    return {
        type: SET_ISCOMPLETE,
        isComplete: isComplete
    };
};
const setExelist = function (exeList) {
    return {
        type: SET_EXELIST,
        exeList: exeList
    };
};
export {
    reducer as default,
    initialState as modeInitialState,
    setFullScreen,
    setPlayer,
    setGen,
    getCode,
    setIsComplete,
    setCompileList,
    setBufferList,
    setMatchMyBlock,
    setExelist
};
