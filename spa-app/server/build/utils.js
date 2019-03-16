const path = require('path');
// 开发模式
exports.isDevMode = process.env.NODE_ENV !== 'production';
// 解析路径
exports.resolve = (filename) => {
  const baseDir = path.resolve(__dirname, '../../');
  return path.resolve(baseDir, filename);
};
// html模板变量生成器
exports.templateParametersGenerator = (compilation, assets, options) => {
  const parameters = options.parameters || {};
  return {
    compilation,
    webpack: compilation.getStats().toJson(),
    webpackConfig: compilation.options,
    htmlWebpackPlugin: {
      files: assets,
      options,
    },
    ...parameters,
  };
};
