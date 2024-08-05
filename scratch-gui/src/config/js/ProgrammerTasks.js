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

function Task_Stack(item, index) {
    return `\nvoid USER_Aplication${index}(void* parameter)\n{\n/*USER APLICATION Write*/\n${item ? item.replaceAll('undefined', '') : item}\n/*USER APLICATION END*/\nvTaskExit("1");\n};\n`;
}

function Task_Info_Item(index) {
    return `\n{\r\n\t\t.Task_Name = "USER_Aplication${index}",\r\n\t\t.Task_StackSize = 256,\r\n\t\t.UBase_Proier = 2,\r\n\t\t.TaskFunction = USER_Aplication${index},\r\n\t\t.USER_TASK_Handler = &UserHandle${index}\r\n},\n`;
}

function Task_Info(taskStr) {
    return `\nMallocTask_Info User_Task[] = {${taskStr}\n};\n`;
}

function Task_Handler(index) {
    return `\nTaskHandle_t UserHandle${index};\n`;
}

function Task_MyBlock(myStr, index) {
    const num = index ? index : 0;
    return `\n/*MyBlock Write${myStr ? num : 0}*/\n${myStr ? myStr : ''}\n/*MyBlock End${myStr ? num : 0}*/\n`;
}

function Task_Open_Gyroscope_Calibration(flag) {
    return `#define OPEN_GYROSCOPE_CALIBRATION ${flag}`;
}

function Task_Info_ItemOfMsgBlock(el, index) {
    const reg = /void (Task_MessageBox\d+)/;
    const match = reg.exec(el);
    const indexStr = match ? match[1] : '';
    return `\n{\r\n\t\t.Task_Name = "${indexStr}",\r\n\t\t.Task_StackSize = 256,\r\n\t\t.UBase_Proier = 2,\r\n\t\t.TaskNumber = ${index},\r\n\t\t.TaskFunction = ${indexStr},\r\n\t\t.USER_TASK_Handler = NULL\r\n},\n`;
}

function Task_MsgBlock(msgList) {
    const msgStr = msgList && msgList.length > 0 ? msgList.join('\n') : '';
    return `\n/*MsgBlock Write*/\n${msgStr}\n/*MsgBlock End*/\n`;
}

export {
    Task_MyBlock,
    Task_Info,
    Task_Stack,
    Task_Handler,
    Task_Info_Item,
    Task_Open_Gyroscope_Calibration,
    Task_Info_ItemOfMsgBlock,
    Task_MsgBlock
}
