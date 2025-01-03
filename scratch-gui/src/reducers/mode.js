const SET_FULL_SCREEN = 'scratch-gui/mode/SET_FULL_SCREEN';
const SET_PLAYER = 'scratch-gui/mode/SET_PLAYER';
const SET_GEN = 'scratch-gui/mode/SET_GEN';
const GET_CODE = 'scratch-gui/mode/GET_CODE';
const SET_ISCOMPLETE = 'scratch-gui/mode/SET_ISCOMPLETE';
const SET_COMPILELIST = 'scratch-gui/mode/SET_COMPILELIST';
const SET_BUFFERLIST = 'scratch-gui/mode/SET_BUFFERLIST';
const SET_MATCHMYBLOCK = 'scratch-gui/mode/SET_MATCHMYBLOCK';
const SET_EXELIST = 'scratch-gui/mode/SET_EXELIST';
const SET_SELECTEDEXE = 'scratch-gui/mode/SET_SELECTEDEXE';
const SET_GENERATORNAME = 'scratch-gui/mode/SET_GENERATORNAME';
const SET_MATCHMSGBLOCK = 'scratch-gui/mode/SET_MATCHMSGBLOCK';

/**
 * 生成默认程序列表
 * @param {Number} num
 * @returns
 */
/* function getList(num) {
    return new Array(num).fill().map((item, index) => {
        return {
            name: `${index}_APP`,
            num: index,
            checked: index === 0 ? true : false
        }
    })
} */

function initGeneratorName() {
    const generator = window?.myAPI?.getStoreValue('generatorName');
    if (generator) {
        return generator
    } else {
        return 'cake'
    }
}

const initialState = {
    showBranding: false,
    isFullScreen: false,
    isPlayerOnly: false,
    hasEverEnteredEditor: true,
    isGen: false,
    code: ``,
    isComplete: false,
    compileList: [],
    bufferList: [],
    matchMyBlock: [],
    msgTaskBlock: [],
    exeList: [],
    selectedExe: window?.myAPI?.getStoreValue('selItem') ? JSON.parse(window.myAPI.getStoreValue('selItem')) : { name: '0_APP', num: 0, checked: true, index: 0 },
    generatorName: initGeneratorName(),
}

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
        case SET_SELECTEDEXE:
            return Object.assign({}, state, {
                selectedExe: action.selectedExe
            });
        case SET_GENERATORNAME:
            return Object.assign({}, state, {
                generatorName: action.generatorName
            });
        case SET_MATCHMSGBLOCK:
            return Object.assign({}, state, {
                msgTaskBlock: action.msgTaskBlock
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
        isGen: isGen
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
const setMatchMsgTaskBlock = function (msgTaskBlock) {
    return {
        type: SET_MATCHMSGBLOCK,
        msgTaskBlock: msgTaskBlock
    }
};
const setIsComplete = function (isComplete) {
    return {
        type: SET_ISCOMPLETE,
        isComplete: isComplete
    };
};
const setExelist = function (exeList) {
    window.myAPI.setStoreValue('exeList', JSON.stringify(exeList));
    return {
        type: SET_EXELIST,
        exeList: exeList
    };
};
const setSelectedExe = function (selectedExe) {
    window.myAPI.setStoreValue('selItem', JSON.stringify(selectedExe));
    return {
        type: SET_SELECTEDEXE,
        selectedExe: selectedExe
    };
};
const setGeneratorName = function (generatorName) {
    return {
        type: SET_GENERATORNAME,
        generatorName: generatorName
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
    setExelist,
    setSelectedExe,
    setGeneratorName,
    setMatchMsgTaskBlock
};
