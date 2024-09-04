// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  ssr: true,
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt"],
  runtimeConfig: {
    public: {
      API_ENDPOINT_BASE_URL: process.env.API_ENDPOINT_BASE_URL,
    },
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  }
});
