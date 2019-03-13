exports.templateParametersGenerator = function (compilation, assets, options) {
  let parameters = options.parameters||{}
  return {
    compilation: compilation,
    webpack: compilation.getStats().toJson(),
    webpackConfig: compilation.options,
    htmlWebpackPlugin: {
      files: assets,
      options: options
    },
    ...parameters
  };
}