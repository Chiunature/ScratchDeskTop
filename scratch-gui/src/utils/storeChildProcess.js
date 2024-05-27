const process = require('process');
const StoreUtil = require('./StoreUtil.js');
const myStore = new StoreUtil({});


function handleStore({ type, key, value = null }) {
    switch (type) {
        case 'set':
            myStore.set(key, value);
            break;
        case 'get':
            const result = myStore.get(key);
            process.send({type, value: result});
            break;
        default:
            break;
    }
}

process.on('message', (message) => {
    if (typeof message === 'object') {
        handleStore(message);
    }
});