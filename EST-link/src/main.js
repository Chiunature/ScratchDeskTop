
import Serialport from "./utils/serialport";
import Bluetooth from "./utils/bluetooth";
import * as ipc from "./config/json/ipc.json"
import * as verifyTypeConfig from "./config/json/verifyTypeConfig.json";
import { instructions, deviceIdMap, reg } from "./config/js/instructions.js";


export const defaultExports = {
    name: 'est-link',
    Serialport,
    Bluetooth,
    ipc,
    verifyTypeConfig,
    instructions,
    deviceIdMap,
    reg
}

// export default {
//     ...defaultExports
// }

export { 
    Serialport,
    Bluetooth,
    ipc,
    verifyTypeConfig,
    instructions,
    deviceIdMap,
    reg
}