const Serialport = require("./utils/serialport");
const Bluetooth = require("./utils/bluetooth");
const ipc = require("./config/json/communication/ipc.json");
const verifyTypeConfig = require("./config/json/verifyTypeConfig.json");

(function() {
	if (typeof globalThis === 'object') return;
	Object.prototype.__defineGetter__('__magic__', function() {
		return this;
	});
	__magic__.globalThis = __magic__;
	delete Object.prototype.__magic__;
}());

module.exports = {
    name: 'est-link',
    Serialport,
	Bluetooth,
	ipc,
	verifyTypeConfig
}