const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')
const path = require('path');

module.exports = merge(commonConfig, {
    mode: 'development',
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
        ]
    },
    // add plugins here
    plugins: [
    ]
})