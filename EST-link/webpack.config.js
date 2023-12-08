var path = require('path');

module.exports = {
    entry: {
        index: './src/index.js'
    },
    devtool: 'cheap-module-source-map',
    output: {
        library: 'est-link',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    optimization: {
        minimize: false
    },
    performance: {
        hints: false
    },
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    module: {
        rules: [{
            test: /\.js$/,
            include: path.resolve(__dirname, 'src'),
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: [
                        '@babel/plugin-proposal-object-rest-spread',
                        '@babel/plugin-syntax-dynamic-import',
                        '@babel/plugin-transform-async-to-generator'
                    ]
                }
            }
        }]
    },
}
