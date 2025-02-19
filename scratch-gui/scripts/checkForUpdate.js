const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
function getZip(requestUrl, targetPath, oldPath, callback) {
    return new Promise((resolve) => {
        fetch(requestUrl)
            .then(response => {
                const total = response.headers.get('content-length');
                let loaded = 0;

                const reader = response.body.getReader();
                const stream = new ReadableStream({
                    start(controller) {
                        read();
                        function read() {
                            reader.read().then(({ done, value }) => {
                                if (done) {
                                    controller.close();
                                    return;
                                }
                                loaded += value.length;
                                if (typeof callback === 'function') {
                                    callback(loaded, total);
                                }
                                controller.enqueue(value);
                                read();
                            }).catch(error => controller.error(error));
                        }
                    }
                });

                return new Response(stream, { headers: response.headers }).arrayBuffer();
            })
            .then(data => {
                fs.writeFileSync(targetPath, Buffer.from(data));
                extractZip(targetPath, oldPath).then(() => {
                    resolve(true);
                });
            })
    })
}

async function extractZip(targetPath, oldPath) {
    try {
        //删除旧文件夹以及文件夹下的所有文件
        await deleteOld(oldPath);
        // 解压
        let zip = new AdmZip(targetPath);
        zip.extractAllTo(oldPath, true);
        fs.unlink(targetPath, (err) => console.info(err));
    } catch (error) {
        // console.info(error)
    }
}

function deleteOld(dir) {
    return new Promise(function (resolve) {
        fs.stat(dir, function (err, stat) {
            if (stat.isDirectory()) {
                fs.readdir(dir, function (err, files) {
                    files = files.map(file => path.join(dir, file));
                    files = files.map(file => deleteOld(file));
                    Promise.all(files).then(function () {
                        fs.rmdir(dir, resolve);
                    })
                })
            } else {
                fs.unlink(dir, resolve)
            }
        })
    })
}

module.exports = {
    getZip,
    extractZip,
    deleteOld
}