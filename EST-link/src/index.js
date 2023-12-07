const Serialport = require("./utils/serialport");
const verify = require("./config/js/verify");



module.exports = {
    name: 'est-link',
    Serialport,
    ...verify,
}