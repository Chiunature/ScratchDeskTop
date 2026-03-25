export default (filename, blob, onlySave) => {
    if (onlySave) {
        const oldFilePath = sessionStorage.getItem("openPath");
        if (!oldFilePath) return;
        const newFilePath =
            oldFilePath.slice(0, oldFilePath.lastIndexOf("\\") + 1) + filename;
        sessionStorage.setItem("openPath", newFilePath);
        // 返回 Promise：确保上层可等待 replaceFiles 写入完成
        return blob
            .arrayBuffer()
            .then((res) =>
                window.myAPI.replaceFiles(
                    oldFilePath,
                    newFilePath,
                    Buffer.from(res)
                )
            );
    }
};
