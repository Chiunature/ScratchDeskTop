export default (filename, blob, onlySave) => {
    if (onlySave) {
        const oldFilePath = sessionStorage.getItem("openPath");
        if (!oldFilePath) {
            console.warn(
                "[save-blocks] 覆盖保存失败: sessionStorage.openPath 为空，无法替换文件"
            );
            return Promise.reject(
                new Error("openPath is empty: cannot overwrite save")
            );
        }
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
