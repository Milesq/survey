export default {
  ssr: false,
  head: {
    titleTemplate: '%s - survey',
    title: 'survey',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
  },
  components: true,
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify',
  ],
  modules: ['@nuxtjs/axios'],
  axios: {
    baseURL:
      process.env.NODE_ENV === 'production'
        ? '/api'
        : 'http://localhost:8080/api',
  },
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
  },
}
