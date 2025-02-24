import { ipc as ipc_Renderer } from 'est-link'
import { DIR } from '../../../config/json/LB_USER.json'
export async function handleUploadPython(options) {
    return new Promise(async (resolve, reject) => {
        const { verifyType, selectedExe, codeStr, codeType } = options;

        const pyPath = `${DIR}/${selectedExe.num}.py`;
        // const isExists = await window.myAPI.FileIsExists(pyPath);
        
        /* if (isExists) {
            window.myAPI.replaceFiles(pyPath, pyPath, codeStr);
        } else {
            await window.myAPI.writeFiles(pyPath, codeStr);
        } */
        await window.myAPI.writeFiles(pyPath, codeStr);

        const mainPyStr = `import ${selectedExe.num}`;
        const mainPyPath = `${DIR}/main.py`;
        // const isMainPyExists = await window.myAPI.FileIsExists(mainPyPath);

        /* if (isMainPyExists) {
            window.myAPI.replaceFiles(mainPyPath, mainPyPath, mainPyStr);
        } else {
            await window.myAPI.writeFiles(mainPyPath, mainPyStr);
        } */
        await window.myAPI.writeFiles(mainPyPath, mainPyStr);

        window.myAPI.commendMake().then(async (res) => {
            if (res) {
                // const OPath = `${DIR}/pikascript-api/${selectedExe.num}.o`;
                const pyoPath = `${DIR}/pikascript-api/${selectedExe.num}.py.o`;
                const result = await window.myAPI.readFiles(pyoPath, '', {});
                // window.myAPI.changeFileName(pyoPath, OPath);

                if (selectedExe && result) {
                    window.myAPI.ipcRender({
                        sendName: ipc_Renderer.SEND_OR_ON.COMMUNICATION.GETFILES,
                        sendParams: {
                            verifyType,
                            selectedExe,
                            codeType,
                            codeStr: result
                        }
                    });
                }
                resolve(true);
            } else {
                reject(false);
            }
        })
    })
}

function stringToArrayBuffer(str) {
    const encoder = new TextEncoder();
    const res = encoder.encode(str);
    return res.buffer;
}