function User_Aplication(index) {
    return `\r\nextern void User_Aplication${index}(void *parameter);`;
}

function Task_Stack(item, index) {
    return `void User_Aplication${index}(void* parameter)\n{\n${item}\nAplicationCreateFLAG = 0;\nvTaskDelete(NULL);\n}\n`;
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