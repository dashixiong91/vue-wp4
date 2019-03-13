const path= require('path');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin =require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const nodeExternals = require('webpack-node-externals')
const liveReloadPlugin = require('./plugins/liveReloadPlugin');
const baseConfig = require('./webpack.base.config.js');
const utils = require('./utils');

// 导出webpackConfig
module.exports = () => {
  // 客户端配置
  let clientConfig=merge(baseConfig(),{
    name:'bundle-client',
    target:'web',
    entry: {
      main: utils.resolve('./src/entry-client.js')
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
    plugins:[
      new HtmlWebpackPlugin({
        template:path.resolve(__dirname,'./index.template.ejs'),
        templateParameters:utils.templateParametersGenerator,
        parameters:{ process:{ env:process.env }}
      }),
      // 生成 `vue-ssr-client-manifest.json`。
      new VueSSRClientPlugin()
    ]
  });
  if(utils.isDevMode){
    clientConfig.plugins.push(liveReloadPlugin);
  }
  // 服务端配置
  let serverConfig=merge(baseConfig(),{
    name:'bundle-server',
    target:'node',
    entry: utils.resolve('./src/entry-server.js'),
    output: {
      libraryTarget: 'commonjs2'
    },
    externals: nodeExternals({
      // 不要外置化 webpack 需要处理的依赖模块。
      // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
      // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
      whitelist: /\.css$/
    }),
    plugins: [
      // 输出vue-ssr-server-bundle.json
      new VueSSRServerPlugin(),
    ]
  })
  return [clientConfig,serverConfig];
}