const Router = require('koa-router');
const send = require('koa-send');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const { createBundleRenderer } = require('vue-server-renderer');
const buildUtils = require('../build/utils');
const envs = require('../envs');

// 静态资源缓存时间
const maxAge = envs.isLocal ? 0 : 2592000;

// 静态渲染（将文档请求重定向到html-webpack-plugin生成的index.html）
/* eslint-disable-next-line */
const staticRender = (root, prefix = '/') => {
  const router = new Router({ prefix });
  return router.get('*', async (ctx, next) => {
    let newpath = ctx.path.replace(prefix, '/');
    if (path.extname(newpath) === '') {
      newpath = '/index.html';
    }
    await send(ctx, newpath, {
      root,
      maxAge,
    });
    return next();
  }).routes();
};
// 按文件类型处理manifest
const handleManifest = (manifest) => {
  const initial = manifest.initial || [];
  return initial.reduce((result, finename) => {
    const ext = path.extname(finename).slice(1);
    /* eslint-disable-next-line */
    result[ext] = result[ext] || [];
    result[ext].push(result.publicPath + finename);
    return result;
  }, manifest);
};
// 创建ejsSsrRender
const createEjsRenderer = () => {
  let manifest = JSON.parse(fs.readFileSync(buildUtils.resolve('./dist/vue-ssr-client-manifest.json'), 'utf-8'));
  manifest = handleManifest(manifest);
  const template = fs.readFileSync(path.resolve(__dirname, '../build/template/index.ssr.ejs'), 'utf-8');
  const renderFun = ejs.compile(template, {});
  return (initialData = {}) => {
    const context = {
      manifest,
      initialData,
    };
    return renderFun(context);
  };
};
let ejsRenderer = envs.isLocal ? null : createEjsRenderer();
// ejs服务端渲染（解析ejs模板，返回ejs.render结果）
const ejsSSRRender = (root, prefix = '/') => {
  const router = new Router({ prefix });
  return router.get('*', async (ctx, next) => {
    const newpath = ctx.path.replace(prefix, '/');
    if (path.extname(newpath) === '') {
      const data = { url: newpath, date: new Date().getTime() };
      if (envs.isLocal) {
        ejsRenderer = createEjsRenderer();
      }
      ctx.body = ejsRenderer(data);
      return next();
    }
    await send(ctx, newpath, {
      root,
      maxAge,
    });
    return next();
  }).routes();
};
// 创建vueSsrRender
const createVueRenderer = () => {
  const clientManifest = JSON.parse(fs.readFileSync(buildUtils.resolve('./dist/vue-ssr-client-manifest.json'), 'utf-8'));
  const template = fs.readFileSync(path.resolve(__dirname, '../build/template/index.ssr.vue.html'), 'utf-8');
  return createBundleRenderer(buildUtils.resolve('./dist/vue-ssr-server-bundle.json'), {
    runInNewContext: false,
    template,
    clientManifest,
  });
};


let vueRenderer = envs.isLocal ? null : createVueRenderer();
// vue服务端渲染（将文档请求交给vue-ssr接管）
/* eslint-disable-next-line */
const vueSSRRender = (root, prefix = '/') => {
  const router = new Router({ prefix });
  return router.get('*', async (ctx, next) => {
    const newpath = ctx.path.replace(prefix, '/');
    if (path.extname(newpath) === '') {
      const context = { url: newpath };
      if (envs.isLocal) {
        vueRenderer = createVueRenderer();
      }
      ctx.body = await vueRenderer.renderToString(context);
      return next();
    }
    await send(ctx, newpath, {
      root,
      maxAge,
    });
    return next();
  }).routes();
};


module.exports = ejsSSRRender;
