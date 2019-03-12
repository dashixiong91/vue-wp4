const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

// 开发模式（建议仅开发机上true,服务器上均false）
// const isDevMode = process.env.NODE_ENV !== 'production'
const isDevMode = false;
module.exports = () => {
  let config = {
    mode: isDevMode ? 'development' : 'production',
    entry: {
      main: path.resolve('./src/index.js')
    },
    output: {
      path: path.resolve('./dist'),
      filename: isDevMode ? '[name].js' : '[name]-[chunkhash].js',
      chunkFilename: isDevMode ? '[name].js' : '[name]-[chunkhash].js',
      publicPath: ''
    },
    target:'web',
    module: {
      rules: [
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [
            { loader: isDevMode ? 'vue-style-loader':MiniCssExtractPlugin.loader  },
            { loader: 'css-loader', options: { importLoaders: 1 } },
            { loader: 'postcss-loader' },
          ],
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            { loader: isDevMode ? 'vue-style-loader':MiniCssExtractPlugin.loader },
            { loader: 'css-loader', options: { importLoaders: 2 } },
            { loader: 'postcss-loader' },
            { loader: 'sass-loader' },
          ]
        }
      ]
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new CleanWebpackPlugin(),
      new VueLoaderPlugin()
    ]
  }
  if (!isDevMode) {
    config.plugins.push(new MiniCssExtractPlugin({
      filename: isDevMode ? '[name].css' : '[name]-[contenthash].css',
    }))
  }
  return config;
}