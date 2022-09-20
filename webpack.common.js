const path = require('path');
// this is the plugin that auto regenerates our dist/htmls
const HtmlWebpackPlugin = require('html-webpack-plugin');
// analyzer plugin to help see insights into app
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
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
                test: /\.(scss|css)$/i,
                use: [
                    'style-loader', 'css-loader', 'sass-loader'
                ]
            },
            {
                type: 'javascript/auto',
                test: /\.json$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets'
                        }
                    }
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
                // the i add the end of the test is for case insensitive names
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                type: 'asset/resource',
            },
            {
                test: /\.pdf$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets'
                        }
                    }
                ]
            },
            {
                test: /\.(glb|gltf)$/i,
                type: 'asset/resource',
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
    ]
}