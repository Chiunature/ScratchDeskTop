// const process = require('process');
const packageJson = require("../../package.json");
const StoreUtil = require("./StoreUtil.js");
const myStore = new StoreUtil({
    configName: packageJson.name,
});

function handleStore(data, port) {
    const { type, key, value } = data;
    switch (type) {
        case "set":
            myStore.set(key, value);
            port.postMessage({ ...data });
            break;
        case "get":
            const result = myStore.get(key);
            port.postMessage({ type, value: result });
            break;
        default:
            break;
    }
}

process.parentPort.once("message", (e) => {
    const port = e.ports[0];
    port.on("message", (event) => {
        if (typeof event.data === "object") {
            handleStore(event.data, port);
        }
    });
    port.start();
});
