const http=require('http');
const Vue = require('vue');
const renderer = require('vue-server-renderer').createRenderer();


http.createServer(async (req,res)=>{
  const app = new Vue({
    data: {
      url: req.url
    },
    template: `<div>访问的 URL 是： {{ url }}</div>`
  });
  let html='';
  try{
    html = await renderer.renderToString(app);
  }catch (err){
    html = err.toString();
  }
    res.end(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
    <meta charset="utf-8"/>
    <title>ssr-demo1</title>
    </head>
    <body>${html}</body>
  </html>
`);
}).listen(8080);