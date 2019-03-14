const Koa = require('koa');
const path = require('path');
const webpackConfig = require('./build/webpack.config')();
const { webpackWatch } = require('./build');
const envs = require('./envs');
const staticAssets = require('./middlewares/staticAssets');
const config = require('./config');


const logger=console;

const runWebpackWatch = ()=>{
  webpackWatch(webpackConfig)
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
    runWebpackWatch();
  }
  await runHttpServer();
})()


