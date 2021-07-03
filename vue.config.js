const path = require('path')

//
module.exports = {
  //配置开发时相关信息
  devServer: {
    //端口号
    port: 8000,
    //开放静态资源
    contentBase: path.join(__dirname, 'public'),
  },
  //配置webpack相关信息
  configureWebpack: {
    // 解析
    resolve: {
      // 配置路径别名
      alias: {
        '@v': path.resolve(__dirname, 'src/views'),
        '@c': path.resolve(__dirname, 'src/components'),
        '@u': path.resolve(__dirname, 'src/utils'),
        '@g': path.resolve(__dirname, 'src/config'),
      }
    }
  }

}