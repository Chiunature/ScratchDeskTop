const defaultsDeep = require('lodash.defaultsdeep');
var path = require('path');
var os = require('os');
var webpack = require('webpack');
const pkg = require('./package.json');
// Plugins
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
// gzip插件
const CompressionPlugin = require("compression-webpack-plugin");
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
// PostCss
var autoprefixer = require('autoprefixer');
var postcssVars = require('postcss-simple-vars');
var postcssImport = require('postcss-import');

const STATIC_PATH = process.env.STATIC_PATH || '/static';
const MONACO_DIR = path.resolve(__dirname, './node_modules/monaco-editor');

const base = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: process.env.NODE_ENV === 'production' ? 'hidden-source-map' : 'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
        host: '0.0.0.0',
        port: process.env.PORT || 8601
    },
    output: {
        library: 'GUI',
        filename: '[name].js',
        chunkFilename: 'chunks/[name].js'
    },
    resolve: {
        symlinks: false,
        alias: {
            'est-link': path.resolve(__dirname, '../EST-link')
        }
    },
    module: {
        rules: [{
            test: /\.(js?|jsx?|tsx?|ts?)$/,
            include: [
                path.resolve(__dirname, 'src'),
                /node_modules[\\/]scratch-[^\\/]+[\\/]src/,
                /node_modules[\\/]pify/,
                /node_modules[\\/]@vernier[\\/]godirect/
            ],
            exclude: path.resolve(__dirname, 'node_modules'),
            use: {
                loader: 'happypack/loader?id=happyBabel',
            },
        },
        {
            test: /\.css$/,
            exclude: MONACO_DIR,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader?minimize',
                options: {
                    modules: true,
                    importLoaders: 1,
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    camelCase: true
                }
            }, {
                loader: 'postcss-loader',
                options: {
                    ident: 'postcss',
                    plugins: function () {
                        return [
                            postcssImport,
                            postcssVars,
                            autoprefixer
                        ];
                    }
                }
            }]
        },
        {
            test: /\.ttf$/,
            use: ["file-loader"]
        },
        {
            test: /\.css$/,
            include: MONACO_DIR,
            use: ['style-loader', 'css-loader?minimize']
        }]
    },
    optimization: {
        minimizer: [
            new ParallelUglifyPlugin({
                uglifyJS: {
                    include: [/\.min\.js$/, /\.js$/],
                    cacheDir: path.resolve(__dirname, 'cache'),
                    output: {
                      // 最紧凑的输出
                      beautify: false,
                      // 删除所有的注释
                      comments: false,
                    },
                    compress: {
                      // 在UglifyJs删除没有用到的代码时不输出警告
                      warnings: false,
                      // 删除所有的 `console` 语句，可以兼容ie浏览器
                      drop_console: true,
                      // 内嵌定义了但是只用到一次的变量
                      collapse_vars: true,
                      // 提取出出现多次但是没有定义成变量去引用的静态值
                      reduce_vars: true,
                    }
                  },
            }),
            new UglifyJsPlugin({
                include: [/\.min\.js$/, /\.js$/],
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_console: true,
                        collapse_vars: true,
                        reduce_vars: true
                    },
                    output: {
                        beautify: false,
                        comments: false
                    }
                }
            })
        ]
    },
    plugins: [
        new MonacoWebpackPlugin({
            languages: ['c', 'cpp', 'python', 'lua', 'javascript'],
            features: ['!gotoSymbol']
        }),
        new HappyPack({
            id: 'happyBabel',
            loaders: [{
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    plugins: [
                        '@babel/plugin-syntax-dynamic-import',
                        '@babel/plugin-transform-async-to-generator',
                        '@babel/plugin-proposal-object-rest-spread',
                        '@babel/plugin-proposal-optional-chaining',
                        ['react-intl', {
                            messagesDir: './translations/messages/'
                        }]],
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            }],
            threadPool: happyThreadPool,
            verbose: true,
        })
    ]
};

if (!process.env.CI) {
    base.plugins.push(new webpack.ProgressPlugin());
}

module.exports = [
    // to run editor examples
    defaultsDeep({}, base, {
        entry: {
            'lib.min': ['react', 'react-dom'],
            'gui': './src/playground/index.jsx',
            'blocksonly': './src/playground/blocks-only.jsx',
            'compatibilitytesting': './src/playground/compatibility-testing.jsx',
            'player': './src/playground/player.jsx'
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: '[name].js'
        },
        module: {
            rules: base.module.rules.concat([
                {
                    test: /\.(svg|png|wav|mp3|gif|jpg)$/,
                    loader: 'file-loader',
                    options: {
                        outputPath: 'static/assets/',
                        // publicPath: `${STATIC_PATH}/assets/`
                    }
                }
            ])
        },
        optimization: {
            splitChunks: {
                chunks: 'all',
                name: 'lib.min'
            },
            runtimeChunk: {
                name: 'lib.min'
            }
        },
        plugins: base.plugins.concat([
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"' + process.env.NODE_ENV + '"',
                'process.env.DEBUG': Boolean(process.env.DEBUG),
                'process.env.GA_ID': '"' + (process.env.GA_ID || 'UA-000000-01') + '"'
            }),
            new CompressionPlugin({
                filename: '[path][base].gz',
                algorithm: 'gzip', // 算法       
                test: new RegExp('\\.(js|css)$'), // 压缩 js 与 css
                threshold: 10240, // 只处理比这个值大的资源。按字节计算
                minRatio: 0.8 // 只有压缩率比这个值小的资源才会被处理
            }),
            new HtmlWebpackPlugin({
                chunks: ['lib.min', 'gui'],
                template: 'src/playground/index.ejs',
                title: 'NEW-AI极睿 V' + pkg.version
            }),
            new HtmlWebpackPlugin({
                chunks: ['lib.min', 'blocksonly'],
                template: 'src/playground/index.ejs',
                filename: 'blocks-only.html',
                title: 'NEW-AI极睿 V' + pkg.version + ': Blocks Only Example'
            }),
            new HtmlWebpackPlugin({
                chunks: ['lib.min', 'compatibilitytesting'],
                template: 'src/playground/index.ejs',
                filename: 'compatibility-testing.html',
                title: 'NEW-AI极睿 V' + pkg.version + ': Compatibility Testing'
            }),
            new HtmlWebpackPlugin({
                chunks: ['lib.min', 'player'],
                template: 'src/playground/index.ejs',
                filename: 'player.html',
                title: 'NEW-AI极睿 V' + pkg.version + ': Player Example'
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'static',
                        to: 'static'
                    },
                    {
                        from: 'worker.js',
                        to: 'worker.js'
                    },
                    {
                        from: 'launch.html',
                        to: 'launch.html'
                    },
                    {
                        from: 'README.md',
                        to: 'README.md'
                    }
                ]
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'node_modules/scratch-blocks/media',
                        to: 'static/blocks-media'
                    }
                ]
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'extensions/**',
                        to: 'static',
                        context: 'src/examples'
                    }
                ]
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'extension-worker.{js,js.map}',
                        context: 'node_modules/scratch-vm/dist/web',
                        noErrorOnMissing: true
                    }
                ]
            })
        ])
    })
].concat(
    process.env.NODE_ENV === 'production' || process.env.BUILD_MODE === 'dist' ? (
        // export as library
        defaultsDeep({}, base, {
            target: 'web',
            entry: {
                'new-ai': './src/index.js'
            },
            output: {
                libraryTarget: 'umd',
                path: path.resolve('dist'),
                publicPath: `${STATIC_PATH}/`
            },
            externals: {
                'react': 'react',
                'react-dom': 'react-dom',
                'electron': 'electron'
            },
            module: {
                rules: base.module.rules.concat([
                    {
                        test: /\.(svg|png|wav|mp3|gif|jpg)$/,
                        loader: 'file-loader',
                        options: {
                            outputPath: 'static/assets/',
                            publicPath: `${STATIC_PATH}/assets/`
                        }
                    }
                ])
            },
            plugins: base.plugins.concat([
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: 'node_modules/scratch-blocks/media',
                            to: 'static/blocks-media'
                        }
                    ]
                }),
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: 'extension-worker.{js,js.map}',
                            context: 'node_modules/scratch-vm/dist/web',
                            noErrorOnMissing: true
                        }
                    ]
                }),
                // Include library JSON files for scratch-desktop to use for downloading
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: 'src/lib/libraries/*.json',
                            to: 'libraries',
                            flatten: true
                        }
                    ]
                })
            ])
        })) : []
);
