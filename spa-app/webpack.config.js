const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          include: [ path.resolve('./src') ],
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          include: /node_modules/,
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
      new VueLoaderPlugin()
    ]
  }
  if (!isDevMode) {
    config.plugins.push(new MiniCssExtractPlugin({
      filename: isDevMode ? '[name].js' : '[name]-[contenthash].js',
    }))
  }
  return config;
}