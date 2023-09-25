function verifyActions(data) {
    return {
        "Boot_URL": () => {
            if (data[0] == 0x5a && data[1] == 0x98 && data[2] == 0x97 && data[3] == 0x01 && data[4] == 0xfd && data[5] == 0x01 && data[data.length - 2] == 0x88 && data[data.length - 1] == 0xa5) {
                return true;
            } else {
                return false;
            }
        },
        "Boot_Bin": () => {
            if (data[0] == 0x5a && data[1] == 0x98 && data[2] == 0x97 && data[3] == 0x01 && data[4] == 0xfd && data[5] == 0x01 && data[data.length - 2] == 0x88 && data[data.length - 1] == 0xa5) {
                return true;
            } else {
                return false;
            }
        },
        "Boot_End": () => (true),
    }
}

function processReceivedConfig(event, ...arg) {
    return {
        "Boot_Bin": () => {
            if(typeof arg[1] == "function") arg[1](arg[0], event);
        },
        "Boot_End": () => {
            event.reply("completed", { result: true, msg: "uploadSuccess" });
            if(typeof arg[2] == "function") arg[2]();
        }
    }
}

module.exports = {
    verifyActions,
    processReceivedConfig
};