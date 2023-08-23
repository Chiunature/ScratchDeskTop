const UPDATE_METRICS = 'scratch-gui/workspace-metrics/UPDATE_METRICS';
const SET_WORKSPACE = 'scratch-gui/workspace-metrics/SET_WORKSPACE';
const initialState = {
    targets: {},
    workspace: {},
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;

    switch (action.type) {
        case UPDATE_METRICS:
            return Object.assign({}, state, {
                targets: Object.assign({}, state.targets, {
                    [action.targetID]: {
                        scrollX: action.scrollX,
                        scrollY: action.scrollY,
                        scale: action.scale
                    }
                })
            });
        case SET_WORKSPACE:
            return Object.assign({}, state, {
                workspace: action.workspace
            });
        default:
            return state;
    }
};

const updateMetrics = function (metrics) {
    return {
        type: UPDATE_METRICS,
        ...metrics
    };
};

const setWorkspace = function (workspace) {
    return {
        type: SET_WORKSPACE,
        workspace
    };
};

export {
    reducer as default,
    initialState as workspaceMetricsInitialState,
    updateMetrics,
    setWorkspace
};
