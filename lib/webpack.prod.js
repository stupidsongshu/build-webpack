const cssnano = require('cssnano');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');

const prodConfig = {
  mode: 'production',
  plugins: [
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
          global: 'ReactDOM',
        },
      ],
    }),
  ],
  optimization: {
    /**
     * 1. 基础库分离: 使用 html-webpack- externals-plugin, 将 react、react-dom 基础包通过 cdn 引入，不打入 bundle 中
     * 2. 公共脚本分离: 使用 Webpack4 内置的 SplitChunksPlugin (替代 CommonsChunkPlugin 插件)
     */
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        // vendors: {
        //   test: /(react|react-dom)/,
        //   // 注意：name 指定的值需在 html-webpack-plugin 参数 chunks 中引入后才能在页面中生效
        //   name: 'vendors',
        //   /**
        //    * chunks 参数说明:
        //    * async 异步引⼊的库进⾏分离(默认)
        //    * initial 同步引⼊的库进行分离
        //    * all 所有引⼊的库进⾏分离(推荐)
        //    */
        //   chunks: 'all'
        // },
        commons: {
          name: 'commons',
          minChunks: 2,
          chunks: 'all',
        },
      },
    },
  },
};

module.exports = merge(baseConfig, prodConfig);
