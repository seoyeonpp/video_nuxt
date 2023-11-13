// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  runtimeConfig: {
    public: {
      baseURL: 'https://mediaplus.co.kr/openApi/v1',
      apiKey: 'f507591002f8fd5a39db1a98fdf68c7b10fd0168b771d3ff244e2812e5cc57a5',
    },
  },
})
