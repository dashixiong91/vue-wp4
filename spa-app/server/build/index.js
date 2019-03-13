const webpack = require('webpack');
const webpackConfig = require('./webpack.config')();
const util = require('util');

const logger=console;

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
    chunkModules:false,
    entrypoints: false,
    modules:false,
    maxModules: 5,
  };
  logger.info(stats.toString(Object.assign({}, opts, {
    children: Object.assign({}, opts, { children: false }),
  })));
};
// 包装webpack run方法，支持async/await
const webpackRun = async (webpackConfig,opts) =>{
  const compiler = webpack(webpackConfig);
  const compilerMethod = util.promisify(compiler.run.bind(compiler));
  let stats=await compilerMethod();
  handleStats(stats);
  return stats;
}

const webpackWatch= async(webpackConfig,opts={},callback=()=>{})=>{
  const compiler = webpack(webpackConfig);
  return compiler.watch(opts,(error,stats)=>{
    if(error){
      logger.error(error);
      logger.info('[webpack]:build error!!!')
      callback(error,stats);
      return;
    }
    try{
      handleStats(stats);
      logger.info('[webpack]:build success!');
    }catch(e){
      logger.error(e);
      logger.info('[webpack]:build error!!!')
      callback(e,stats);
    }
  })
}

module.exports={ webpackRun, webpackWatch }

if(require.main === module){
  webpackRun(webpackConfig)
  .then(()=>{
    logger.info('[webpack]:build success!')
  })
  .catch((error)=>{
    logger.info('[webpack]:build error!!!')
    logger.error(error);
    process.exit(1);
  })
}