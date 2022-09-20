// analyzer plugin to help see insights into app
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')

module.exports = merge(commonConfig, {
    mode: 'production',
    // setting up loaders
    module: {
        // the rules area for each file type loader
        rules: [
        ]
    },
    // add plugins here
    plugins: [
        new BundleAnalyzerPlugin(),
    ]
})