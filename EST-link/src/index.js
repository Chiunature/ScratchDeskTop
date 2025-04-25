const Serialport = require("./utils/serialport");
const Bluetooth = require("./utils/bluetooth");
const ipc = require("./config/json/ipc.json");
const verifyTypeConfig = require("./config/json/verifyTypeConfig.json");
const { instructions, deviceIdMap, reg } = require("./config/js/instructions.js");


const defaultExports = {
	name: 'est-link',
	Serialport,
	Bluetooth,
	ipc,
	verifyTypeConfig,
	instructions,
	deviceIdMap,
	reg
}

module.exports = defaultExports
module.exports['default'] = {
	...defaultExports
}