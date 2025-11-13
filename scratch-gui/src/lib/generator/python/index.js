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
        const { selectedExe, codeStr } = options;

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
            // return;
            // ========== 旧方法：编译成 .o 文件（已注释） ==========
            /* 
            const res = await window.myAPI.commendMake(static_path);
            if (res) {
                const fileName = `${selectedExe.num}.py.o`;
                const oPath = `${DIR}/${fileName}`;
                const size = window.myAPI.getFileSize(oPath, static_path);
                if (size === 0) {
                    reject(alertMsg);
                }

                const tooBigOfPyo = window.myAPI.compareSize(
                    oPath,
                    32,
                    static_path
                );

                if (tooBigOfPyo) {
                    isError = false;
                    reject(alertMsg);
                }

                const result = await window.myAPI.readFiles(
                    oPath,
                    static_path,
                    {}
                );

                if (result) {
                    window.myAPI.ipcRender({
                        sendName:
                            ipc_Renderer.SEND_OR_ON.COMMUNICATION.GETFILES,
                        sendParams: {
                            ...options,
                            codeStr: result,
                            fileName: fileName.replace(".py", ""),
                        },
                    });
                }
                resolve(true);
            } else {
                reject(alertMsg);
            }
            */

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
                    // 注意：新协议只需要 fileName 和 fileData
                },
            });
            resolve(true);
        } catch (error) {
            reject("uploadError");
        }
    });
}
