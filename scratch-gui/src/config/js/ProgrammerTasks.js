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
/* function User_Aplication(index) {
    return `\nvoid User_Aplication${index}(void *parameter);`;
} */

function Task_Stack(item, index) {
    return `void USER_Aplication${index}(void* parameter)\n{\nvTaskDelay(800);\n/*USER APLICATION Write*/\n${item ? item.replaceAll('undefined', '') : item}\n/*USER APLICATION END*/\nvTaskExit("1");\n};\n`;
}

function Task_Info_Item(index) {
    return `\n{\r\n\t\t.Task_Name = "USER_Aplication${index}",\r\n\t\t.Task_StackSize = 1*512,\r\n\t\t.UBase_Proier = 3,\r\n\t\t.TaskFunction = USER_Aplication${index},\r\n\t\t.USER_TASK_Handler = &UserHandle${index}\r\n},\n`;
}

function Task_Info(taskStr) {
    return `MallocTask_Info User_Task[] = {${taskStr}\n};\n`;
}

function Task_Handler(index) {
    return `TaskHandle_t UserHandle${index};\n`;
}

function headMain(myStr) {
    return `#if ExternalPrograment == 1\n/*MyBlock Write*/\n${myStr ? myStr : ''}\n/*MyBlock End*/\n`;
}



export {
    headMain,
    Task_Info,
    Task_Stack,
    Task_Handler,
    Task_Info_Item
}