const path=require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports={
  mode:'development',
  entry:{
    main:path.resolve('./src/index.js')
  },
  output:{

  },
  module:{
    rules:[
      {
        test:/\.vue$/,
        loader:'vue-loader'
      },
      // 它会应用到普通的 `.js` 文件
      // 以及 `.vue` 文件中的 `<script>` 块
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      // 它会应用到普通的 `.scss` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins:[
    new VueLoaderPlugin()
  ]
}