// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // Match the React SPA: cookie session on the same origin, no SSR JWT issues.
  ssr: false,

  css: ["~/assets/css/main.css"],

  // HTML navigations to /cases must hit Nuxt, not Origination.
  // API fetches (no text/html Accept) are proxied in server/middleware/dev-api-proxy.ts
  runtimeConfig: {
    public: {
      identityApiUrl: "",
      originationApiUrl: "",
      auditApiUrl: "",
    },
  },

  modules: ["@pinia/nuxt"],
});
