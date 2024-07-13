export default async (filename, path, content, currentContent) => {
    let res = true, name = filename;
    const programlist = await window.myAPI.getStoreValue('programlist');
    const currentIndex = sessionStorage.getItem('programlist-curIndex');
    const nextIndex = programlist.length;

    if (currentContent) {
        // 修改之前先存上一个的内容
        programlist[currentIndex].content = currentContent;
    }
    
    if (programlist) {
        for (const item of programlist) {
            if (item.name === name && (item.path && item.path === path)) {
                res = false;
                break;
            } else if (item.name === name && !item.path) {
                name = name + nextIndex;
                break;
            }
        }
        sessionStorage.setItem('programlist-curIndex', nextIndex);
    }
    if (!res) {
        return;
    }

    programlist.push({
        name: name,
        path: path,
        content: content instanceof Blob || typeof content === 'string' ? content : new Blob([new Uint8Array(content)])
    });
    await window.myAPI.setStoreValue('programlist', [...programlist]);
}