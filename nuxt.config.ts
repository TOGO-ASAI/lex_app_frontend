// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: true,
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      API_ENDPOINT_BASE_URL: process.env.API_ENDPOINT_BASE_URL,
    },
  },
})
