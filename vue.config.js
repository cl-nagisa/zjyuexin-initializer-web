const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const defaultSettings = require('./src/settings.js') // 工程默认配置文件
const argv = process.argv

rewriteEnv()

module.exports = defineConfig({
  // 设置静态资源的引用路径。设置后，css、js、img、font等文件会被统一打包到 /dist/static/ 目录下
  assetsDir: 'static',
  // 关闭生产环境下的 source map 以便提高生产环境的打包速度
  productionSourceMap: false,
  devServer: {
    // 启动本地开发环境时，默认打开浏览器
    open: true,
    // 启动本地开发环境时，默认用本地的ip地址打开
    host: 'localhost',
    // 设置所有接口请求头参数
    headers: { 'Access-Control-Allow-Origin': '*' },
    // 设置API代理，以便解决接口跨域问题
    proxy: {}
  },
  configureWebpack: {
    // 关闭 source map，以便提高打包编译速度
    devtool: false,
    // 设置浏览器标题
    name: defaultSettings.title,
    // 设置快捷路径
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack: config => {
    // 配置 svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
})

function resolve (dir) {
  return path.join(__dirname, dir)
}

// 根据启动或打包命令中的入参，覆盖.env中的环境变量
function rewriteEnv () {
  argv.forEach(item => {
    if (item.includes('--') && item.includes('=')) {
      const envName = getArgv(item)
      if (process.env[`VUE_APP_${envName.key}`] !== undefined) {
        process.env[`VUE_APP_${envName.key}`] = envName.value
      }
    }
  })
}

// 解析命令行中的入参名
function getArgv (query) {
  const key = query.substring(2, query.indexOf('='))
  const value = query.substring(query.indexOf('=') + 1)
  return { key, value }
}
