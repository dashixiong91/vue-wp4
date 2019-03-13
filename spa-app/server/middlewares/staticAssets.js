const Router=require('koa-router');
const send = require('koa-send')
const path = require('path');

module.exports=(root,prefix='/')=>{
  let router=new Router({prefix});
  return router.get('*',async (ctx)=>{
    let newpath=ctx.path.replace(prefix,'/');
    if(path.extname(newpath)===''){
      newpath='/index.html';
    }
    return send(ctx, newpath,{
      root,
    })
  }).routes();
}