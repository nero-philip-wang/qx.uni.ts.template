const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

// vue.config.js
module.exports = {
  parallel: true,
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: process.env.NODE_ENV === 'development',
    },
  },
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin(),
      new CopyWebpackPlugin([
        {
          // from: path.join(__dirname, './cloudbase'),
          // to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'cloudbase'),
        },
      ]),
    ],
  },
  transpileDependencies: ['uview-ui'],
}
