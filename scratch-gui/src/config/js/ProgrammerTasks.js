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
function User_Aplication(index) {
    return `\r\nextern void User_Aplication${index}(void *parameter);`;
}

function Task_Stack(item, index) {
    return `void User_Aplication${index}(void* parameter)\n{\n${item ? item.replaceAll('undefined', '') : item}\nAplicationCreateFLAG = 0;\nvTaskDelete(NULL);\n}\n`;
}

function Task_Info_Item(index) {
    return `\n{\r\n\t\t.Task_Name = "User_Aplication${index}",\r\n\t\t.Task_StackSize = 128,\r\n\t\t.UBase_Proier = 6,\r\n\t\t.TaskFunction = User_Aplication${index},\r\n\t\t.USER_TASK_Handler = NULL\r\n},\n`;
}


function Task_Info(taskStr) {
    return `\nTask_Info user_task[] = {${taskStr}\n}`;
}

function headMain(codeStr) {
    return `#include "main.h"\n${codeStr}\n`;
}



export {
    headMain,
    Task_Info,
    Task_Stack,
    Task_Info_Item,
    User_Aplication
}