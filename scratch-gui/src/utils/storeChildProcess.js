// const process = require('process');
const StoreUtil = require('./StoreUtil.js');
const myStore = new StoreUtil({});


function handleStore({ type, key, value = null }, port) {
    switch (type) {
        case 'set':
            myStore.set(key, value);
            break;
        case 'get':
            const result = myStore.get(key);
            port.postMessage({type, value: result});
            break;
        default:
            break;
    }
}

process.parentPort.once('message', (e) => {
    const port = e.ports[0];
    port.on('message', (event) => {
        if (typeof event.data === 'object') {
            handleStore(event.data, port);
    }
    })
    port.start();
});