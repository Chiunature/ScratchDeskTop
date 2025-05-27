import { ipc as ipc_Renderer } from 'est-link'
import { DIR } from '../../../config/json/LB_USER.json'
export async function handleUploadPython(options, static_path = '') {

    let isError = false;
    const alertMsg = isError ? "uploadError" : "fileIsTooBig";

    return new Promise(async (resolve, reject) => {
        const { selectedExe, codeStr } = options;

        if (!selectedExe) {
            reject(false);
        }

        try {
            const pyPath = `${DIR}/${selectedExe.num}.py`;
            await window.myAPI.writeFiles(pyPath, codeStr, static_path);

            // const tooBigOfPy = window.myAPI.compareSize(pyPath, 16, static_path);
            // if (tooBigOfPy) {
            //     reject(alertMsg);
            // }

            const res = await window.myAPI.commendMake(static_path);
            if (res) {
                const oPath = `${DIR}/${selectedExe.num}.py.o`;

                const tooBigOfPyo = window.myAPI.compareSize(oPath, 32, static_path);
                if (tooBigOfPyo) {
                    reject(alertMsg);
                }

                const result = await window.myAPI.readFiles(oPath, static_path, {});

                if (result) {
                    window.myAPI.ipcRender({
                        sendName: ipc_Renderer.SEND_OR_ON.COMMUNICATION.GETFILES,
                        sendParams: {
                            ...options,
                            codeStr: result,
                        }
                    });
                }
                resolve(true);
            } else {
                reject(alertMsg);
            }
            /* window.myAPI.ipcRender({
                sendName: ipc_Renderer.SEND_OR_ON.COMMUNICATION.GETFILES,
                sendParams: {
                    ...options,
                    codeStr: new Uint8Array(stringToArrayBuffer(codeStr)),
                }
            });
            resolve(true); */
        } catch (error) {
            reject(alertMsg);
        }

    })
}

/* function stringToArrayBuffer(str) {
    const encoder = new TextEncoder();
    const res = encoder.encode(str);
    return res.buffer;
} */