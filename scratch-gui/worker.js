const { parentPort } = require('worker_threads');
// const path = require("path");


// function dynamicallyRequire(moduleName) {
//     let modulePath = getNodeModulesPath(moduleName);
//     return require(modulePath);
// }
// function getNodeModulesPath(moduleName) {
//     return workerData.env ? moduleName : path.join(process.cwd(), 'resources/app.asar.unpacked', moduleName);
// }

// const StoreUtil = dynamicallyRequire("./src/utils/StoreUtil.js");
// const store = new StoreUtil({});

parentPort.on('message', function (data) {
    if (typeof data === 'object') {
        handleStore(data);
    }
});

function handleStore(data) {
    const { type } = data;
    switch (type) {
        case 'set':
            parentPort.postMessage({...data});
            break;
        case 'get':
            parentPort.postMessage({...data});
            break;
        default:
            break;
    }
}

