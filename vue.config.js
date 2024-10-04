const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: '/console/',

    pages: {
        index: 'src/views/main.js',
    },

    configureWebpack: {
        name: 'console'
    },

    devServer: {
        proxy: {
          '/': {
            target: 'https://uias-devops.outsrkem.top:30078',
            changeOrigin: true,
            secure: false,
            pathRewrite: {
              '^/uias': '/uias'
            }
          }
        },
        webSocketServer: false,
    },

    productionSourceMap: false,
})
