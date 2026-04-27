import { ipc as ipc_Renderer } from "est-link";
import { DIR } from "../../../config/json/LB_USER.json";
export async function handleUploadPython(options, static_path = "") {
    let isError = true;
    const alertMsg = isError ? "compileError" : "fileIsTooBig";

    return new Promise(async (resolve, reject) => {
        const { selectedExe, codeStr } = options;
        console.log("[PY_COMPILE][renderer] handleUploadPython start", {
            static_path,
            selectedExe,
            codeLength: typeof codeStr === "string" ? codeStr.length : -1,
            taskType: options?.taskType,
            codeType: options?.codeType,
            isRun: options?.isRun,
        });

        if (!selectedExe) {
            console.error("[PY_COMPILE][renderer] selectedExe missing");
            reject(false);
        }

        try {
            const pyPath = `${DIR}/${selectedExe.num}.py`;
            //把代码写入文件里
            console.log("[PY_COMPILE][renderer] write python file", {
                pyPath,
                static_path,
            });
            const writeRes = await window.myAPI.writeFiles(
                pyPath,
                codeStr,
                static_path
            );
            console.log("[PY_COMPILE][renderer] write python file result", {
                writeRes,
                pyPath,
            });
            const res = await window.myAPI.commendMake(
                static_path,
                selectedExe
            );
            console.log("[PY_COMPILE][renderer] commendMake result", {
                res,
                selectedExe,
            });
            if (res) {
                const fileName = `${selectedExe.num}.py.o`;
                const oPath = `${DIR}/${fileName}`;
                const size = window.myAPI.getFileSize(oPath, static_path);
                console.log("[PY_COMPILE][renderer] output file status", {
                    oPath,
                    size,
                });
                if (size === 0) {
                    console.error("[PY_COMPILE][renderer] output file is empty", {
                        oPath,
                        size,
                    });
                    reject(alertMsg);
                }

                const tooBigOfPyo = window.myAPI.compareSize(
                    oPath,
                    32,
                    static_path
                );
                console.log("[PY_COMPILE][renderer] output file size check", {
                    oPath,
                    tooBigOfPyo,
                    limitKB: 32,
                });

                if (tooBigOfPyo) {
                    isError = false;
                    console.error("[PY_COMPILE][renderer] output file too big", {
                        oPath,
                        size,
                    });
                    reject(alertMsg);
                }

                const result = await window.myAPI.readFiles(
                    oPath,
                    static_path,
                    {}
                );
                console.log("[PY_COMPILE][renderer] read output result", {
                    oPath,
                    hasResult: Boolean(result),
                    resultLength: result?.length,
                });

                if (result) {
                    console.log("[PY_COMPILE][renderer] send compiled file", {
                        fileName: fileName.replace(".py", ""),
                        verifyType: options?.verifyType,
                        taskType: options?.taskType,
                    });
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
                console.error("[PY_COMPILE][renderer] commendMake returned false", {
                    res,
                });
                reject(alertMsg);
            }
        } catch (error) {
            console.error("[PY_COMPILE][renderer] handleUploadPython exception", error);
            reject(alertMsg);
        }
    });
}
