// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/test-utils', '@pinia/nuxt'],
  css: ['vuetify/styles'],
  build: {
    transpile: ['vuetify']
  },
  // GitHub Pages configuration
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    buildAssetsDir: 'assets/'
  },
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  runtimeConfig: {
    // Server-side runtime config (private)
    // Placeholder per future configurazioni server
    
    // Public runtime config (exposed to client)
    public: {
      maxPriorities: parseInt(process.env.NUXT_MAX_PRIORITIES || '5'),
      alertAutoHideDelay: parseInt(process.env.NUXT_ALERT_AUTO_HIDE_DELAY || '5000'),
      autoSaveEnabled: process.env.NUXT_AUTO_SAVE_ENABLED !== 'false'
    }
  }
})