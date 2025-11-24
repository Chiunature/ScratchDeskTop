import { ipc as ipc_Renderer } from "est-link";
import { DIR } from "../../../config/json/LB_USER.json";

/**
 * 辅助函数：将字符串转换为 ArrayBuffer
 */
function stringToArrayBuffer(str) {
    const encoder = new TextEncoder();
    const res = encoder.encode(str);
    return res.buffer;
}

export async function handleUploadPython(options, static_path = "") {
    // let isError = true;
    // const alertMsg = isError ? "compileError" : "fileIsTooBig";

    return new Promise(async (resolve, reject) => {
        const { selectedExe, codeStr, isRun } = options;

        if (!selectedExe) {
            reject(false);
        }

        try {
            const pyPath = `${DIR}/${selectedExe.num}.py`;
            console.log("文件路径", pyPath);
            console.log("代码字符串", codeStr);
            //把代码写入文件里
            await window.myAPI.writeFiles(pyPath, codeStr, static_path);
            console.log("写入文件成功");
            // ========== 新方法：使用新协议直接发送 .py 文件 ==========
            console.log("使用新协议直接发送py 文件");
            console.log(`${selectedExe.num}.py`);
            console.log(
                "new Uint8Array(stringToArrayBuffer(codeStr))",
                new Uint8Array(stringToArrayBuffer(codeStr))
            );
            window.myAPI.ipcRender({
                sendName: ipc_Renderer.SEND_OR_ON.COMMUNICATION.UPLOAD_PYTHON, // 使用新协议事件
                sendParams: {
                    fileName: `${selectedExe.num}.py`,
                    fileData: new Uint8Array(stringToArrayBuffer(codeStr)),
                    isRun: isRun || false, // 传递 isRun 参数，用于决定发送哪种结束标志
                },
            });
            resolve(true);
        } catch (error) {
            reject("uploadError");
        }
    });
}
