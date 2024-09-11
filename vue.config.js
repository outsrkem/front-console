const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: '/console/',

    pages: {
        index: 'src/views/main.js',
    },

    configureWebpack: {
        name: '多页面应用'
    },

    devServer: {
        proxy: {
          '/': {
            target: 'http://10.10.10.14:8080',
            changeOrigin: true,
            secure: false,
            pathRewrite: {
              '^/uias': '/uias'
            }
          }
        }
    },

    productionSourceMap: false,
})
