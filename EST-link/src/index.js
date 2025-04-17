const Serialport = require("./utils/serialport");
const Bluetooth = require("./utils/bluetooth");
const ipc = require("./config/json/communication/ipc.json");
const verifyTypeConfig = require("./config/json/verifyTypeConfig.json");
const instructions = require("./config/js/instructions.js");

module.exports = {
	name: 'est-link',
	Serialport,
	Bluetooth,
	ipc,
	verifyTypeConfig,
	instructions
}