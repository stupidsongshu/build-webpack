const glob = require('glob');
const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const projectRoot = process.cwd();

// 多页应用设置
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];

  /**
   * entryPaths:
   * [
   * '/Users/squirrel/practice/webpack/src/index/index.js',
   * '/Users/squirrel/practice/webpack/src/search/index.js'
   * ]
   */
  const entryPaths = glob.sync(path.join(projectRoot, './src/*/index.js'));

  Object.keys(entryPaths).forEach((index) => {
    const entryPath = entryPaths[index];
    const match = entryPath.match(/src\/(.*)\/index\.js/);
    const entryName = match && match[1];
    if (!entryName) return;

    entry[entryName] = entryPath;
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(projectRoot, `./src/${entryName}/index.html`),
        filename: `${entryName}.html`, // default index.html
        chunks: ['vendors', 'commons', entryName],
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false,
        },
      }),
    );
  });

  return {
    entry,
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry,
  output: {
    path: path.join(projectRoot, './dist'),
    filename: '[name]_[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          // 'eslint-loader'
        ],
      },
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({
                  /**
                   * Replace Autoprefixer browsers option to Browserslist config.
                   * Use browserslist key in package.json or .browserslistrc file.
                   *
                   * Using browsers option cause some error. Browserslist config
                   * can be used for Babel, Autoprefixer, postcss-normalize and other tools.
                   *
                   * If you really need to use option, rename it to overrideBrowserslist.
                   *
                   * Learn more at:
                   * https://github.com/browserslist/browserslist#readme
                   * https://twitter.com/browserslist
                   */
                  // browsers: ['last 2 version', '>1%', 'ios 7'],
                  overrideBrowserslist: ['last 2 version', '>1%', 'ios 7'],
                }),
              ],
            },
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75,
              remPrecision: 8,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          // {
          //   loader: 'url-loader',
          //   options: {
          //     limit: 10240
          //   }
          // }
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        // use: 'file-loader'
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    // 避免构建前每次都要手动删除dist，使用clean-webpack-plugin默认会删除output指定的输出目录
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    function errorPlugin() {
      // compiler 在每次构建结束后会触发 done 这 个 hook
      this.hooks.done.tap('done', (stats) => {
        if (
          stats.compilation.errors
          && stats.compilation.errors.length
          && process.argv.indexOf('--watch') === -1) {
          console.log('build error*********'); // eslint-disable-line
          process.exit(1);
        }
      });
    },
  ].concat(htmlWebpackPlugins),
  stats: 'errors-only',
};
