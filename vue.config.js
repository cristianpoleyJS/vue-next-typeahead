module.exports = {
    productionSourceMap: false,
    css: { extract: false },
    chainWebpack: config => {
        config.module.rule('svg')
            .use('file-loader')
            .loader('url-loader')
            .tap(options => {
                options.limit = 300000
                return options
            })
    }
}
