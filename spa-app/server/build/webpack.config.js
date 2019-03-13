const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const liveReloadPlugin = require('./liveReloadPlugin');
const utils = require('./utils');
const envs = require('../envs');
const config =require('../config');


// 开发模式（建议仅开发机上true,服务器上均false）
const isDevMode = envs.isLocal;

// 解析路径
const resolve=(filename)=>{
  const baseDir= path.resolve(__dirname,'../../')
  return path.resolve(baseDir,filename);
}
// 导出webpackConfig
module.exports = () => {
  let webpackConfig = {
    mode: isDevMode ? 'development' : 'production',
    target:'web',
    entry: {
      main: resolve('./src/index.js')
    },
    output: {
      path: resolve('./dist'),
      hashDigestLength:7,
      filename: isDevMode ? '[name].js' : '[name]-[chunkhash].js',
      chunkFilename: isDevMode ? '[name].js' : '[name]-[chunkhash].js',
      publicPath: config.staticPrefix
    },
    optimization:{
      moduleIds: 'hashed',
      namedChunks: true,
      runtimeChunk: {
        name: 'manifest'
      },
      splitChunks:{
        chunks:'all',
        maxInitialRequests:5,
        cacheGroups:{
          verdor:{
            test: /node_modules/,
            name: 'verdor',
            priority: 1,
            reuseExistingChunk: true
          }
        }
      },
      minimizer:[
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false,
            },
          },
        }),
        new OptimizeCssAssetsPlugin({
          cssProcessorOptions: { safe: true,discardComments: { removeAll: true } },
        })
      ]
    },
    resolve:{
      extensions: ['.js', '.json', '.vue'],
      alias:{
        assets: resolve('./src/assets'),
      }
    },
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
        },
        {
          test:/\.(png|jpg|gif|woff|ttf|svg)$/,
          loader:'url-loader',
          options:{
            limit:8 * 1024
          }
        }
      ]
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new CleanWebpackPlugin(),
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        ROUTER_PREFIX: JSON.stringify(config.staticPrefix),
      }),
      new HtmlWebpackPlugin({
        template:path.resolve(__dirname,'./index.template.ejs'),
        templateParameters:utils.templateParametersGenerator,
        parameters:{ process:{ env:process.env }}
      })
    ]
  }
  if (!isDevMode) {
    webpackConfig.plugins = webpackConfig.plugins.concat([
      new MiniCssExtractPlugin({
        filename: isDevMode ? '[name].css' : '[name]-[contenthash].css',
      }),
    ]);
  }else{
    webpackConfig.plugins.push(liveReloadPlugin);
  }
  return webpackConfig;
}