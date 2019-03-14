const Router = require('koa-router');
const send = require('koa-send')
const path = require('path');
const fs = require('fs');
const { createBundleRenderer } = require('vue-server-renderer');
const buildUtils = require('../build/utils');
const envs = require('../envs');


// 静态渲染（将文档请求重定向到html-webpack-plugin生成的index.html）
const staticRender = (root, prefix = '/') => {
  let router = new Router({ prefix });
  return router.get('*', async (ctx) => {
    let newpath = ctx.path.replace(prefix, '/');
    if (path.extname(newpath) === '') {
      newpath = '/index.html';
    }
    return send(ctx, newpath, {
      root,
    })
  }).routes();
}
// 创建vueSsrRender
const createRenderer = () => {
  const clientManifest = JSON.parse(fs.readFileSync(buildUtils.resolve('./dist/vue-ssr-client-manifest.json'), 'utf-8'));
  const template=fs.readFileSync(path.resolve(__dirname, '../build/template/index.ssr.html'), 'utf-8');
  return createBundleRenderer(buildUtils.resolve('./dist/vue-ssr-server-bundle.json'), {
      runInNewContext: false,
      template,
      clientManifest
  });
}
let renderer = createRenderer();
// vue服务端渲染（将文档请求交给vue-ssr接管）
const vueSSRRender = (root, prefix = '/') => {
  let router = new Router({ prefix });
  return router.get('*', async (ctx) => {
    let newpath = ctx.path.replace(prefix, '/');
    if (path.extname(newpath) === '') {
      const context = { url: newpath };
      if(envs.isLocal){
        renderer=createRenderer();
      }
      ctx.body = await renderer.renderToString(context)
      return
    }
    return send(ctx, newpath, {
      root,
    })
  }).routes();
}


module.exports = vueSSRRender