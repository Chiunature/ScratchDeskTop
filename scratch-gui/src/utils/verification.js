function actions(data) {
    return {
        Boot_URL: () => {
            if (data[0] == 0x5a && data[1] == 0x98 && data[2] == 0x97 && data[3] == 0x01 && data[4] == 0xfd && data[5] == 0x01 && data[data.length - 2] == 0x88 && data[data.length - 1] == 0xa5) {
                return true;
            } else {
                return false;
            }
        },
        Boot_Bin: () => {
            if (data[0] == 0x5a && data[1] == 0x98 && data[2] == 0x97 && data[3] == 0x01 && data[4] == 0xfd && data[5] == 0x01 && data[data.length - 2] == 0x88 && data[data.length - 1] == 0xa5) {
                return true;
            } else {
                return false;
            }
        },
        Boot_End: () => (true),
    }
}

module.exports = actions;