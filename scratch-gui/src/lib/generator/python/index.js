import { ipc as ipc_Renderer } from 'est-link'

export function handleUploadPython(options) {
    const { verifyType, selectedExe, codeStr, codeType } = options;
    const result = stringToArrayBuffer(codeStr);
    if (selectedExe) window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.COMMUNICATION.GETFILES, sendParams: { verifyType, selectedExe, codeType, codeStr: new Uint8Array(result) } });
}

function stringToArrayBuffer(str) {
    const encoder = new TextEncoder();
    const res = encoder.encode(str);
    return res.buffer;
}