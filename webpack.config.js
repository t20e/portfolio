const path = require('path');

// this is the plugin that auto regenerates our dist/htmls
const HtmlWebpackPlugin = require('html-webpack-plugin');
const loader = require('sass-loader');
import html from './src/template.html'
// analyzer plugin to help see insights into app
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    mode: 'development',
    // can set entry to multiple points do entry : {bundle: path.re...}
    entry: { main: path.resolve(__dirname, 'src/script.js') },
    output: {
        path: path.resolve(__dirname, 'dist'),
        // [name] is what i call in entry.main [contenthash] generates a hash for the name
        filename: '[name][contenthash].js',
        clean: true,
        // this will keep the img filenames the same in dist folder
        // assetModuleFilename: '[name][ext]'
        assetModuleFilename: 'assets/[hash][ext][query]'
    },
    // helps find bugs faster
    devtool: 'source-map',
    // set up the dev server
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true
    },
    // setting up loaders
    module: {
        // the rules area for each file type loader
        rules: [
            {
                // any files that end with the extension of .scss apply these loaders
                test: /\.scss$/,
                use: [
                    'style-loader', 'css-loader', 'sass-loader'
                ]
            },
            {
                // for babel loader, for better web connectivity to older browsers
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: { presets: ['@babel/preset-env'] },
                }
            },
            {
                // add images loader
                // the i add the end of the test is for case insensitive names
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(glb|gltf)$/i,
                type: 'asset/resource',
                // use:
                // [
                //     {
                //         // loader: 'gltf-loader',
                //         options:
                //         {
                //             name: '[path][name].[ext]',
                //             outputPath: 'assets/models/'
                //         }
                //     }
                // ],
            },
            { test: /\.html$/, loader: 'html-loader?attrs[]=video:src' },
            { test: /\.(mov|mp4)$/, loader: 'url-loader' },
            {
                test: /\.html$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "html-loader",
                        options: {
                            sources: {
                                list: [
                                    {
                                        tag: "video",
                                        attribute: "src",
                                        type: "src"
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
              
        ]
    },
    // add plugins here
    plugins: [
        new HtmlWebpackPlugin({
            title: 'portfolio',
            filename: 'index.html',
            // this template is what the dist index.html is generated from
            template: path.resolve(__dirname, 'src/template.html'),
        }),
        // new BundleAnalyzerPlugin(),
    ]
}

