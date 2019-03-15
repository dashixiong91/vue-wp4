const webpack = require('webpack');
const util = require('util');
const webpackConfig = require('./webpack.config')();


const logger = console;

// 处理webpack编译输出的信息
const handleStats = (stats) => {
  const info = stats.toJson();
  if (stats.hasErrors()) {
    throw new Error(info.errors.map(infoerr => infoerr.toString()).join('\n'));
  }
  if (stats.hasWarnings()) {
    logger.warn(info.warnings);
  }
  const opts = {
    colors: true,
    assets: true,
    chunks: false,
    chunkModules: false,
    entrypoints: false,
    modules: false,
    maxModules: 5,
  };
  logger.info(stats.toString(Object.assign({}, opts, {
    children: Object.assign({}, opts, { children: false }),
  })));
};
// 包装webpack run方法，支持async/await
const webpackRun = async (config) => {
  const compiler = webpack(config);
  const compilerMethod = util.promisify(compiler.run.bind(compiler));
  const stats = await compilerMethod();
  handleStats(stats);
  return stats;
};
// webpack watch编译
const webpackWatch = (config, opts = {}, callback = () => {}) => {
  const compiler = webpack(config);
  return compiler.watch(opts, (error, stats) => {
    if (error) {
      logger.error(error);
      logger.info('[webpack] build error!!!');
      callback(error, stats);
      return;
    }
    try {
      handleStats(stats);
      logger.info('[webpack] build success!');
    } catch (e) {
      logger.error(e);
      logger.info('[webpack] build error!!!');
      callback(e, stats);
    }
  });
};

module.exports = { webpackRun, webpackWatch };

if (require.main === module) {
  (async () => {
    try {
      await webpackRun(webpackConfig);
      logger.info('[webpack]:build success!');
    } catch (error) {
      logger.error(error);
      logger.info('[webpack]:build error!!!');
      process.exit(1);
    }
  })();
}
