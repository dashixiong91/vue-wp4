const Router=require('koa-router');
const send = require('koa-send')

module.exports=(root,prefix='/')=>{
  let router=new Router({prefix});
  return router.get('*',async (ctx)=>{
    let path=ctx.path.replace(prefix,'/');
    if(/^(\/[\w-]+\/?)*$/.exec(path)||path==='/'){
      path='/index.html';
    }
    return send(ctx, path,{
      root,
    })
  }).routes();
}