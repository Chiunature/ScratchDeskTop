export default async (filename, path, content, currentContent, onSetProjectTitle) => {
    let shouldAddProgram = true, newName = filename;
    const programlist = await window.myAPI.getStoreValue('programlist');
    const currentIndex = sessionStorage.getItem('programlist-curIndex');
    const nextIndex = programlist.length;

    if (Array.isArray(programlist)) {
        // 检查是否已存在相同名称和路径的项目
        for (const item of programlist) {
            if (item.name === newName) {
                if(!item.path && !path) {
                    newName = newName + nextIndex;
                    if (typeof onSetProjectTitle === 'function') {
                        onSetProjectTitle(newName);
                    }
                    break;
                }
                if (path && item.path === path) {
                shouldAddProgram = false;
                break;
                } 
            }
        }
    }

    // 保存项目的时候更新当前项目列表的内容
    if (currentContent) {
        if (currentIndex && programlist[currentIndex]) {
            programlist[currentIndex] = {
                ...programlist[currentIndex],
                content: currentContent
            }
        }
    }

    if (shouldAddProgram && content) {
        // 添加新项目到列表中
        const newItem = {
            name: newName,
            path: path,
            content: content instanceof Blob || typeof content === 'string'
                ? content
                : new Blob([new Uint8Array(content)])
        };
        programlist.push(newItem);
        sessionStorage.setItem('programlist-curIndex', nextIndex);
    }

    await window.myAPI.setStoreValue('programlist', programlist);
}