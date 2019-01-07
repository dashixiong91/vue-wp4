const http=require('http');
const Vue = require('vue');
const fs=require('fs');
const path=require('path');
const renderer = require('vue-server-renderer').createRenderer({
  template:fs.readFileSync(path.resolve(__dirname,'./index.template.html'),'utf-8')
});


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
  res.end(html);
}).listen(8080);