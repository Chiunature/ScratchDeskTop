// est-link/webpack.config.js
const path = require('path');

const esmConfig = {
    entry: './src/main.js',
    experiments: { outputModule: true }, // 启用ES模块输出
    output: {
        path: path.resolve(__dirname, 'dist/esm'),
        filename: 'bundle.js',
        library: { type: 'module' },       // 输出ES模块格式
        globalObject: 'this',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
};

const cjsConfig = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist/cjs'),
        filename: 'bundle.js',
        library: { type: 'commonjs2' },     // 输出CommonJS格式
        globalObject: 'this',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { modules: 'commonjs' }] // 强制转换模块语法
                        ]
                    }
                },
                exclude: /node_modules/
            }
        ]
    }
};

module.exports = [esmConfig, cjsConfig];
