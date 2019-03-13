const Koa = require('koa');
const path = require('path');
const webpackConfig = require('./build/webpack.config')();
const {webpackWatch} = require('./build');
const envs = require('./envs');
const staticAssets = require('./middlewares/staticAssets');
const config = require('./config');


const logger=console;

const runWebpackWatch = async ()=>{
  try{
    await webpackWatch(webpackConfig);
    logger.info('[webpack]:build success!')
  }catch(error){
    logger.info('[webpack]:build error!!!')
    logger.error(error);
  }
}
const runHttpServer = async ()=>{
  const PORT = process.env.PORT || 8081;
  const app=new Koa();
  app.use(staticAssets(path.resolve(__dirname,'../dist/'),config.staticPrefix));
  app.listen(PORT);
  logger.log(`[koa]:server is listening at http://localhost:${PORT}`);
}
(async ()=>{
  if(envs.isLocal){
    await runWebpackWatch();
  }
  await runHttpServer();
})()


