const path = require('path')
function resolve(dir) { return path.join(__dirname, dir) }
module.exports = {
    chainWebpack: config => {
        // 路径别名配置
        config.resolve.alias
            .set('@$', resolve('src'))
    },
    css: {
      loaderOptions: {
        // 给所有sass共享全局变量
        sass: {
          prependData: `@import "@/assets/css/color.scss";`
        }
      }
    },
    devServer: {
      disableHostCheck: true,
      port: 8080,
      allowedHosts: [
          'http://106.13.48.20:9099'
      ],
      https: false, // https:{type:Boolean}
      open: true, //配置自动启动浏览器
      hotOnly: false, // 热更新
      proxy: {
          "/center": {
              target: "http://106.13.48.20:9099",
              changeOrigin: true,
              pathRewrite: {
                  '^/center': '/center'
              }
          },
      }
  }
}