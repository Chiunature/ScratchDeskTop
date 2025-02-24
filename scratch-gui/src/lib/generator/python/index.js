import { ipc as ipc_Renderer } from 'est-link'
import { DIR } from '../../../config/json/LB_USER.json'
export async function handleUploadPython(options) {
    return new Promise(async (resolve, reject) => {
        const { verifyType, selectedExe, codeStr, codeType } = options;

        if (!selectedExe) {
            reject(false);
        }

        const pyPath = `${DIR}/${selectedExe.num}.py`;
        await window.myAPI.writeFiles(pyPath, codeStr);

        const mainPyStr = `import ${selectedExe.num}`;
        const mainPyPath = `${DIR}/main.py`;
        await window.myAPI.writeFiles(mainPyPath, mainPyStr);

        window.myAPI.commendMake().then(async (res) => {
            if (res) {
                // const OPath = `${DIR}/pikascript-api/${selectedExe.num}.o`;
                const pyoPath = `${DIR}/pikascript-api/${selectedExe.num}.py.o`;
                const result = await window.myAPI.readFiles(pyoPath, '', {});
                // window.myAPI.changeFileName(pyoPath, OPath);

                if (result) {
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

/* function stringToArrayBuffer(str) {
    const encoder = new TextEncoder();
    const res = encoder.encode(str);
    return res.buffer;
} */