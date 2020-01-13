const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')

module.exports = function override(config, env) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      three$: path.resolve('./src/utils/three.js'),
      '../../../build/three.module.js': path.resolve('./src/utils/three.js')
    }
  }
  config.plugins = [...config.plugins, new BundleAnalyzerPlugin()]
  return config
}
