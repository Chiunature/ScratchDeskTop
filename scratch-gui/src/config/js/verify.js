/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2023 drluck Inc.
 * http://www.drluck.cn/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview The class representing one block.
 * @author avenger-jxc
 */
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
    let obj = {};
    arg.map(item => {
        if (typeof item == "function") {
            switch (item.name) {
                case "bound sendBin":
                    obj['Boot_Bin'] = () => item(arg[0], event);
                    break;
                case "bound clearCache":
                    obj['Boot_End'] = () => {
                        event.reply("completed", { result: true, msg: "uploadSuccess" });
                        item();
                    }
                    break;
                default:
                    break;
            }
        }
    });
    return obj;
}

module.exports = {
    verifyActions,
    processReceivedConfig
};