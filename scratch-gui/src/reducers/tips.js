const TIPS_UPDATE = "scratch-gui/tips/TIPS_UPDATE";

const initialState = {
    updateObj: null
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case TIPS_UPDATE: {
            return Object.assign({}, state, {
                updateObj: action.updateObj
            });
        }
        default:
            return state;
    }
}

const setTipsUpdateObj = function (updateObj) {
    return {
        type: TIPS_UPDATE,
        updateObj: { ...updateObj }
    };
};


export {
    reducer as default,
    initialState as tipsInitialState,
    setTipsUpdateObj
};
