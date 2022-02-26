module.exports = {
  publicPath: './',
  chainWebpack (config) {
    config.plugin('html').tap(args => {
      args[0].title = '易桌遊'
      return args
    })
  },
  pwa: {
    themeColor: '#c6ebfe',
    manifestOptions: {
      name: '易桌遊 E-TableTopGame',
      short_name: '易桌遊',
      theme_color: '#c6ebfe',
      background_color: '#E8E8E8',
      scope: './',
      start_url: './',
      display: 'standalone',
      icons: [
        {
          src: './img/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: './img/icons/android-chrome-256x256.png',
          sizes: '256x256',
          type: 'image/png'
        }
      ]
    }
  }
}
