// est-link/webpack.config.js
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const esmConfig = {
    entry: './src/main.js',
    experiments: { outputModule: true }, // 启用ES模块输出
    output: {
        path: path.resolve(__dirname, 'dist/esm'),
        filename: 'bundle.js',
        library: { type: 'module' },       // 输出ES模块格式
        globalObject: 'this',
    },
    externals: [nodeExternals()],
    target: 'node', // 必须声明Node环境
    node: {
        __dirname: false, // 保留目录路径
        __filename: false // 保留文件路径
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.node$/,
                use: 'node-loader'
            }
        ]
    },
};

const cjsConfig = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist/cjs'),
        filename: 'bundle.js',
        library: { type: 'commonjs2' },     // 输出CommonJS格式
        globalObject: 'this',
    },
    externals: [nodeExternals()],
    target: 'node', // 必须声明Node环境
    node: {
        __dirname: false, // 保留目录路径
        __filename: false // 保留文件路径
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
            },
            {
                test: /\.node$/,
                use: 'node-loader'
            }
        ]
    },
};

module.exports = [esmConfig, cjsConfig];
