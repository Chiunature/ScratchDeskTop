const SET_FILESTYTEM = 'scratch-gui/file-stytem/SET_FILESTYTEM';


const initialState = {
    showFileStytem: false
}

const reducer = function (state, action) {
    if (typeof state === "undefined") state = initialState;
    switch (action.type) {
        case SET_FILESTYTEM:
            return Object.assign({}, state, {
                showFileStytem: action.showFileStytem,
            });
        default:
            return state;
    }
}

const showFileStytem = function (showFileStytem) {
    return {
        type: SET_FILESTYTEM,
        showFileStytem: showFileStytem,
    };
};

export {
    reducer as default,
    showFileStytem,
    initialState as fileStytemInitialState
}