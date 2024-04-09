import { defineMessages } from "react-intl";


const MainMessages = defineMessages({
    "exit": {
        id: "gui.main.Exit",
        defaultMessage: "The changes you made may not be saved.",
        description: "The changes you made may not be saved.",
    },
    "cancel": {
        id: "gui.prompt.cancel",
        defaultMessage: "cancel",
        description: "cancel",
    },
    "confirm": {
        id: "gui.prompt.ok",
        defaultMessage: "ok",
        description: "ok",
    },
    "reupdate": {
        id: "gui.main.reupdateFireware",
        defaultMessage: "The firmware is already the latest version. Do you want to update it again?",
        description: "The firmware is already the latest version. Do you want to update it again?",
    },
    "update": {
        id: "gui.main.updateFireware",
        defaultMessage: "Detected that the firmware version is not the latest. Do you want to update it now?",
        description: "Detected that the firmware version is not the latest. Do you want to update it now?",
    },
    "sensing_update": {
        id: "gui.main.sensingUpdate",
        defaultMessage: "Detected that some firmware version is not the latest. Do you want to update it now?",
        description: "Detected that some firmware version is not the latest. Do you want to update it now?",
    },
    "delete": {
        id: "gui.main.delete",
        defaultMessage: "Do you want to delete this record?",
        description: "Do you want to delete this record?",
    },
    "reinstallDriver": {
        id: "gui.main.reinstallDriver",
        defaultMessage: "Are you sure you want to reinstall the driver?",
        description: "Are you sure you want to reinstall the driver?",
    },
    "installDriver": {
        id: "gui.main.installDriver",
        defaultMessage: "Checked that your computer does not have the necessary drivers installed. Would you like to go ahead and install them?",
        description: "Checked that your computer does not have the necessary drivers installed. Would you like to go ahead and install them?",
    }
});


function getMainMsg(intl) {
    let obj = {};
    Object.keys(MainMessages).forEach(item => {
        obj[item] = intl.formatMessage(MainMessages[item]);
    });
    return {
        ...obj
    }
}

export default getMainMsg;