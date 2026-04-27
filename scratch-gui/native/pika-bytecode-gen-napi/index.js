'use strict';

const path = require('path');

function loadAddon() {
    const unpackedPath = path.join(
        __dirname.replace('app.asar', 'app.asar.unpacked'),
        'build',
        'Release',
        'pika_bytecode_gen.node'
    );
    return require(unpackedPath);
}

const addon = loadAddon();

function compile(inputPyPath, outputFilePath) {
    return addon.compile(inputPyPath, outputFilePath);
}

module.exports = {
    compile,
};
