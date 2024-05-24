const { parentPort } = require('worker_threads');
const StoreUtil = require("./src/utils/StoreUtil");
const store = new StoreUtil({});

parentPort.on('message',  function(data) {
    if (typeof data === 'object') {
        handleStore(store, data);
    }
});

function handleStore(store, {type, key, value = null}) {
    switch (type) {
        case 'set':
            store.set(key, value);
            break;
        case 'get':
            parentPort.postMessage(store.get(key));
            break;
        default:
            break;
    }
}

