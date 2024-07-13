export default async (filename, path, content, currentContent) => {
    let newName = filename;
    const programlist = await window.myAPI.getStoreValue('programlist');
    const currentIndex = sessionStorage.getItem('programlist-curIndex');
    const nextIndex = programlist.length;

    if (currentContent) {
        // 更新当前项目的内容
        if (currentIndex !== null && programlist[currentIndex]) {
        programlist[currentIndex].content = currentContent;
            if (path && !programlist[currentIndex].path) {
                programlist[currentIndex].path = path;
                programlist[currentIndex].name = newName;
            }
            await window.myAPI.setStoreValue('programlist', programlist);
        }
        return;
    }

    let shouldAddProgram = true;
    
    if (programlist) {
        // 检查是否已存在相同名称和路径的项目
        for (const item of programlist) {
            if (item.name === newName && item.path === path) {
                shouldAddProgram = false;
                break;
            } else if(item.name === newName && !path){
                newName = newName + nextIndex;
                break;
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
        await window.myAPI.setStoreValue('programlist', programlist);
    }
}