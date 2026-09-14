// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  // Match the React SPA: cookie session on the same origin, no SSR JWT issues.
  ssr: false,
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      identityApiUrl: "",
      originationApiUrl: "",
    },
  },
  nitro: {
    devProxy: {
      "/auth": { target: "http://localhost:5250", changeOrigin: true },
      "/cases": { target: "http://localhost:5135", changeOrigin: true },
      "/hubs": { target: "http://localhost:5290", changeOrigin: true, ws: true },
    },
  },
});
