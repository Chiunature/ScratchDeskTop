const Serialport = require("./utils/serialport");
const verify = require("./config/js/verify");



module.exports = {
    name: 'EST-link',
    Serialport,
    ...verify,
}