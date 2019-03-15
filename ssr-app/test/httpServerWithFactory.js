const http = require('http');
const fs = require('fs');
const path = require('path');
const renderer = require('vue-server-renderer').createRenderer({
  template: fs.readFileSync(path.resolve(__dirname, './index.template.html'), 'utf-8'),
});
const createApp = require('./app');


http.createServer(async (req, res) => {
  const context = { url: req.url };
  const app = createApp(context);
  let html = '';
  try {
    html = await renderer.renderToString(app, context);
  } catch (err) {
    html = err.toString();
  }
  res.end(html);
}).listen(8080);
