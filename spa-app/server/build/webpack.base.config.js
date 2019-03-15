const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const utils = require('./utils');
const config = require('../config');

// 导出webpackConfig
module.exports = (isServer = false) => {
  const webpackConfig = {
    mode: utils.isDevMode ? 'development' : 'production',
    entry: {},
    output: {
      path: utils.resolve('./dist'),
      hashDigestLength: 7,
      filename: utils.isDevMode ? '[name].js' : '[name]-[chunkhash].js',
      chunkFilename: utils.isDevMode ? '[name].js' : '[name]-[chunkhash].js',
      publicPath: config.staticPrefix,
    },
    resolve: {
      extensions: ['.js', '.json', '.vue'],
      alias: {
        assets: utils.resolve('./src/assets'),
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          loader: 'vue-loader',
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: [
            { loader: (utils.isDevMode || isServer) ? 'vue-style-loader' : MiniCssExtractPlugin.loader },
            { loader: 'css-loader', options: { importLoaders: 1 } },
            { loader: 'postcss-loader' },
          ],
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            { loader: (utils.isDevMode || isServer) ? 'vue-style-loader' : MiniCssExtractPlugin.loader },
            { loader: 'css-loader', options: { importLoaders: 2 } },
            { loader: 'postcss-loader' },
            { loader: 'sass-loader' },
          ],
        },
        {
          test: /\.(png|jpg|gif|woff|ttf|svg)$/,
          loader: 'url-loader',
          options: {
            limit: 8 * 1024,
          },
        },
      ],
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new CleanWebpackPlugin(),
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        ROUTER_PREFIX: JSON.stringify(config.staticPrefix),
      }),
    ],
  };

  return webpackConfig;
};
