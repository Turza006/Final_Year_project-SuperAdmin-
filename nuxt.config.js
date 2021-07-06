import colors from 'vuetify/es5/util/colors'
require('dotenv').config()

export default {
  // Target: https://go.nuxtjs.dev/config-target
  ssr: false,
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - b2bServiceNet',
    title: 'Super Admin Panel',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/notifier.js' },
    { src: '~/plugins/localStorage.js' },
    { src: '~/plugins/dialog.js' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/apollo'
  ],

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: process.env.SERVER_BASE_URL
      }
    }
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#FF4E00',
          accent: '#1BA098',
          secondary: '#DEB992',
          info: '#487AFA',
          warning: '#FAB162',
          error: '#ef0d50',
          success: '#4ECB4A',
          drawer_color: '#2d333d'
        },
        dark: {
          primary: '#FF4E00',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          drawer_color: '#2d333d'
        }
      }
    }
  },
  env: {
    SERVER_BASE_URL: process.env.SERVER_BASE_URL,
    IMAGE_BASE_URL: process.env.IMAGE_BASE_URL,
    ICON_IMAGE_BASE_URL: process.env.ICON_IMAGE_BASE_URL,
    THUMBNAIL_IMAGE_BASE_URL: process.env.THUMBNAIL_IMAGE_BASE_URL,
    APP_COOKIE_NAME: process.env.APP_COOKIE_NAME
  },
  server: {
    // host: '192.168.0.147',
    port: 5001
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
