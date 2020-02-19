const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');


const path = require('path');
const cpx = require('cpx');

//const fs = require('fs');

const sourcePath = path.join(__dirname, 'src');
const distPath = path.join(__dirname, 'dist');

module.exports = (env, argv) => {
    env = env ? env : {};
    cpx.copySync('src/assets/**/*', distPath);

    return {
        context: sourcePath,

        entry: {
            main: `${sourcePath}/main.js`,
            sw: `${sourcePath}/service-worker.js`
        },

        output: {
            path: distPath,
            filename: '[name].bundle.js'
        },
        externals: {
            // 'angular': 'angular',
            // 'angular-cookies': 'angular.module("ngCookies")',
            // 'angular-material': 'ngMaterial',
            // 'angular-material/angular-material.css': 'ngMaterial',
            // 'angular-translate': 'angular.module("pascalprecht.translate")',
            // 'moment': 'moment'
        },
        module: {
            rules: [
                {
                    test: /\.html$/,
                    exclude: /node_modules/,
                    loader: 'html-loader'
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function() {
                                    return [
                                        autoprefixer({
                                            remove: false,
                                            browsers: ['last 2 versions', 'ie 10', 'ie 11'],
                                            grid: 'autoplace'
                                        })
                                    ];
                                }
                            }
                        }
                    ],
                },
                {
                    test: /\.scss$/,
                    exclude: /node_modules/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                  test: /\.m?js$/,
                  exclude: /node_modules/,
                  use: [
                    {
                      loader: 'babel-loader',
                      options: {
                        sourceMap: true,
                        presets: ['@babel/preset-env']
                      },
                    },
                  ]
                }


                // {
                //     test: /\.ts$/,
                //     exclude: /node_modules/,
                //     use: [
                //         {
                //             loader: 'ng-annotate-loader',
                //             options: { ngAnnotate: 'ng-annotate-patched', dynamicImport: true },
                //         },
                //         {
                //             loader: 'ts-loader',
                //             options: { transpileOnly: true },
                //         },
                //         'angular2-template-loader'
                //     ],
                // },
                // {
                //     test: /\.json$/,
                //     exclude: /node_modules/,
                //     use: [
                //         'json-loader'
                //     ]
                // }
            ],
        },

        resolve: {
            extensions: ['.ts', '.js', '.json', '.css'],
            modules: [
                path.resolve(__dirname, 'node_modules'),
                sourcePath
            ]
        },

        plugins: [
            new HtmlWebpackPlugin({
                // minify: {
                //     collapseWhitespace: true,
                //     removeRedundantAttributes: true,
                //     removeScriptTypeAttributes: true,
                //     removeStyleLinkTypeAttributes: true,
                //     useShortDoctype: true
                // },
                template: path.join(sourcePath, 'index.html'), //'index.ejs'
                inject: false,
                assetPathString: process.env.NODE_ENV === 'development' ? '.' : 'https://assets.meltwater.io/mi-home-page-web-assets/<%= version %>',
                bffApiKey: process.env.NODE_ENV === 'development' ? 'gJPMVH4Oo95RIOBvOJxeE2maalXr0HI729zlSlBu' : '<%= bffApiKey %>',
                bffUrl: process.env.NODE_ENV === 'development' ? 'https://9mi02zayce.execute-api.eu-west-1.amazonaws.com/v0' : '<%= bffUrl %>',
            })
        ],

        stats: {
            children: false,
            warnings: false
        },

        devServer: argv.mode === 'production' ? undefined : {
            contentBase: [sourcePath, path.join(__dirname, "dist")],
            disableHostCheck: true,
            publicPath: '/',
            historyApiFallback: true,
            host: 'localhost',
            port: 3000,
            https: false,
            compress: false,
            inline: true,
            hot: true,
            stats: {
                assets: true,
                children: false,
                chunks: false,
                hash: false,
                modules: false,
                publicPath: false,
                timings: true,
                version: false,
                warnings: false
            },
        }
    };
};