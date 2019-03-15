const LiveReloadPlugin = require('webpack-livereload-plugin');

const liveReloadPlugin = new LiveReloadPlugin({ appendScriptTag: true, hostname: 'localhost', protocol: 'http' });

module.exports = liveReloadPlugin;
