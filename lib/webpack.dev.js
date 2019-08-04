const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');

const devConfig = {
  mode: 'development',
  devServer: {
    // contentBase: './dist',
    contentBase: path.join(__dirname, 'dist'),
    /**
     * Note that webpack.HotModuleReplacementPlugin is required to fully enable HMR.
     * If webpack or webpack-dev-server are launched with the --hot option,
     * this plugin will be added automatically,
     * so you may not need to add this to your webpack.config.js.
     */
    hot: true,
    stats: 'errors-only',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: 'cheap-source-map',
};

module.exports = merge(baseConfig, devConfig);
