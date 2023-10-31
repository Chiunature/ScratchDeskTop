const asarmor = require('asarmor');
const path = require('path');
exports.default = async ({ appOutDir, packager }) => {
    try {
        const asarPath = path.join(packager.getResourcesDir(appOutDir), 'app.asar')
        const archive = await asarmor.open(asarPath)
        archive.patch()
        archive.patch(asarmor.createBloatPatch(1314))
        console.log(`applying asarmor patches to ${asarPath}`)
        await archive.write(asarPath);
    } catch (error) {
        console.error(error)
    }
}