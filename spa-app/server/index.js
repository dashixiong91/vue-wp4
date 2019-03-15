const Koa = require('koa');
const path = require('path');
const webpackConfig = require('./build/webpack.config')();
const { webpackWatch } = require('./build');
const envs = require('./envs');
const staticAssets = require('./middlewares/staticAssets');
const httpLogger = require('./middlewares/httpLogger');
const errorHandler = require('./middlewares/errorHandler');
const config = require('./config');


const logger = console;

const runWebpackWatch = () => {
  webpackWatch(webpackConfig);
};
const runHttpServer = async () => {
  const PORT = process.env.PORT || 8081;
  const app = new Koa();
  app.use(errorHandler);
  app.use(httpLogger);
  app.use(staticAssets(path.resolve(__dirname, '../dist/'), config.staticPrefix));
  app.listen(PORT, () => {
    logger.log(`[app] server is listening at http://localhost:${PORT}`);
  });
  app.on('error', (error, ctx) => {
    logger.error('[app] Unhandled error:', error, ctx);
  });
};
(async () => {
  if (envs.isLocal) {
    runWebpackWatch();
  }
  await runHttpServer();
})();
