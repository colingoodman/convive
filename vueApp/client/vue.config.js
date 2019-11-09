const path = require('path')

const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [
    'src/**/*.html',
    'src/**/*.vue',
    'node_modules/vuejs-datepicker/dist/vuejs-datepicker.min.js',
  ],
  whitelist: ['vdp-datepicker', 'vdp-datepicker__calendar', 'rtl', 'vdp-datepicker__clear-button', 'vdp-datepicker__calendar-button'],
  whitelistPatterns: [/vdp/g, /rtl/g],
})

module.exports = {
  outputDir: path.resolve(__dirname, '../server/public'),
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('tailwindcss'),
        ],
      },
    },
  },
}
