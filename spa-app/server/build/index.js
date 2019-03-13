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
// 包装webpack compiler方法，支持async/await
const webpackAsyncfy = async (method='run',webpackConfig,opts) =>{
  const compiler = webpack(webpackConfig);
  const compilerMethod = util.promisify(compiler[method].bind(compiler));
  let stats=null;
  if(method=='run'){
    stats = await compilerMethod();
  }else{
    stats = await compilerMethod(opts);
  }
  handleStats(stats);
  return stats;
}
const webpackRun = async (webpackConfig)=>{
  return webpackAsyncfy('run',webpackConfig)
}
const webpackWatch= async(webpackConfig,opts={})=>{
  return webpackAsyncfy('watch',webpackConfig,opts)
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