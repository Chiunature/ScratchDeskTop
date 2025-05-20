import { ipc as ipc_Renderer } from 'est-link'
import { DIR } from '../../../config/json/LB_USER.json'
export async function handleUploadPython(options, static_path = '') {
    return new Promise(async (resolve, reject) => {
        const { selectedExe, codeStr } = options;

        if (!selectedExe) {
            reject(false);
        }

        try {
            const pyPath = `${DIR}/${selectedExe.num}.py`;
            await window.myAPI.writeFiles(pyPath, codeStr, static_path);


            const res = await window.myAPI.commendMake(static_path);
            if (res) {
                const pyoPath = `${DIR}/${selectedExe.num}.py.o`;
                const result = await window.myAPI.readFiles(pyoPath, static_path, {});

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
                reject(false);
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
            console.error(error.message)
            reject(false);
        }

    })
}

/* function stringToArrayBuffer(str) {
    const encoder = new TextEncoder();
    const res = encoder.encode(str);
    return res.buffer;
} */