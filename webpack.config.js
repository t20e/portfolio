const path = require('path');
// this is the plugin that auto regenerates our dist/htmls
const HtmlWebpackPlugin = require('html-webpack-plugin');
// analyzer plugin to help see insights into app
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// u only need the cleanwebpack plugin for production, dev mode saves to memory
// TODO put in dev mode
// const CleanWebPackPlugin = require('clean-webpack-plugin');


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
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                }
            },
            {
                // any files that end with the extension of .scss apply these loaders
                test: /\.(scss|css)$/i,
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
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                }
            },
            {
                // add images loader
                // the i add the end of the test is for case insensitive names
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                type: 'asset/resource',
                // use: {
                //     // file-loader needs to be installed with npm
                //     loader: 'file-loader',
                //     options: {
                //         name: "[name].[hash].[ext]",
                //         outputPath: "assets"
                //     }
                // }
            },
            {
                test: /\.pdf$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]'
                        }
                    }
                ]
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
                //             outputPath: 'assets/models'
                //         }
                //     }
                // ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
              },
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
        // TODO put in dev mode
        // new CleanWebPackPlugin(),
    ]
}

