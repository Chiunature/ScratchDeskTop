export default async (filename, path, content) => {
    let res = true, name = filename;
    const programlist = await window.myAPI.getForage('programlist');
    if (programlist) {
        for (const item of programlist) {
            if (item.name === name && (item.path && item.path === path)) {
                res = false;
                break;
            } else if (item.name === name && !item.path) {
                name = name + programlist.length;
                break;
            }
        }
    }
    if (!res) {
        return;
    }
    sessionStorage.setItem('programlist-curIndex', programlist.length);
    const obj = {
        name: name,
        path: path,
        content: content instanceof Blob || typeof content === 'string' ? content : new Blob([new Uint8Array(content)])
    }
    programlist.push(obj);
    await window.myAPI.setForage('programlist', [...programlist]);
}