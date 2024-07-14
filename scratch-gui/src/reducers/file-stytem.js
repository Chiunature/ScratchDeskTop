const SET_FILESTYTEM = 'scratch-gui/file-stytem/SET_FILESTYTEM';
const CLOSE_FILESTYTEM = 'scratch-gui/file-stytem/CLOSE_FILESTYTEM';

const initialState = {
    showFileStytem: false
}

const reducer = function (state, action) {
    if (typeof state === "undefined") state = initialState;
    switch (action.type) {
        case SET_FILESTYTEM:
            return Object.assign({}, state, {
                showFileStytem: true,
            });
        case CLOSE_FILESTYTEM:
            return Object.assign({}, state, {
                showFileStytem: false,
            });
        default:
            return state;
    }
}

const showFileStytem = function () {
    return {
        type: SET_FILESTYTEM
    };
};

const closeFileStytem = function () {
    return {
        type: CLOSE_FILESTYTEM
    };
};

export {
    reducer as default,
    showFileStytem,
    closeFileStytem,
    initialState as fileStytemInitialState
}
