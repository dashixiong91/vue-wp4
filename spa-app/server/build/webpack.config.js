// const path = require('path');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const nodeExternals = require('webpack-node-externals');
const liveReloadPlugin = require('./plugins/liveReloadPlugin');
const baseConfig = require('./webpack.base.config.js');
const utils = require('./utils');

// 导出webpackConfig
module.exports = () => {
  // 客户端配置
  const clientConfig = merge(baseConfig(), {
    name: 'bundle-client',
    target: 'web',
    entry: {
      main: utils.resolve('./src/entry-client.js'),
    },
    optimization: {
      moduleIds: 'hashed',
      namedChunks: true,
      runtimeChunk: {
        name: 'manifest',
      },
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 5,
        cacheGroups: {
          verdor: {
            test: /node_modules/,
            name: 'verdor',
            priority: 1,
            reuseExistingChunk: true,
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false,
            },
            compress: {
              pure_funcs: ['console.info', 'console.log'],
            },
          },
        }),
        new OptimizeCssAssetsPlugin({
          cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
        }),
      ],
    },
    plugins: [
      /* new HtmlWebpackPlugin({
        template:path.resolve(__dirname,'./template/index.hw.ejs'),
        templateParameters:utils.templateParametersGenerator,
        parameters:{ process:{ env:process.env }}
      }), */
      // 生成 `vue-ssr-client-manifest.json`。
      new VueSSRClientPlugin(),
    ],
  });
  if (utils.isDevMode) {
    clientConfig.plugins.push(liveReloadPlugin);
  } else {
    // TODO:抽取css暂时不能在vue-ssr状态使用，官方说明只要是提供vue-ssr-client-manifest.json的情况下是ok的，待解决
    clientConfig.plugins = clientConfig.plugins.concat([
      new MiniCssExtractPlugin({
        filename: utils.isDevMode ? '[name].css' : '[name]-[contenthash].css',
      }),
    ]);
  }
  // 服务端配置
  const serverConfig = merge(baseConfig(true), {
    name: 'bundle-server',
    target: 'node',
    entry: utils.resolve('./src/entry-server.js'),
    output: {
      libraryTarget: 'commonjs2',
    },
    // https://webpack.js.org/configuration/externals/#function
    // https://github.com/liady/webpack-node-externals
    // 外置化应用程序依赖模块。可以使服务器构建速度更快，
    // 并生成较小的 bundle 文件。
    externals: nodeExternals({
      // 不要外置化 webpack 需要处理的依赖模块。
      // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
      // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
      whitelist: /\.css$/,
    }),
    plugins: [
      // 输出vue-ssr-server-bundle.json
      new VueSSRServerPlugin(),
    ],
  });
  return [clientConfig, serverConfig];
};
