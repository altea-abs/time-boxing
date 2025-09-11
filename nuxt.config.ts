// https://nuxt.com/docs/api/configuration/nuxt-config
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Read version from package.json
const packageJson = JSON.parse(readFileSync(resolve('./package.json'), 'utf-8'))

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/test-utils', '@pinia/nuxt'],
  css: ['vuetify/styles'],
  build: {
    transpile: ['vuetify']
  },
  // Disable SSR for GitHub Pages SPA deployment
  ssr: false,
  // GitHub Pages configuration
  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect', 
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap'
        }
      ]
    },
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
      appVersion: packageJson.version,
      maxPriorities: parseInt(process.env.NUXT_MAX_PRIORITIES || '3'),
      alertAutoHideDelay: parseInt(process.env.NUXT_ALERT_AUTO_HIDE_DELAY || '5000'),
      autoSaveEnabled: process.env.NUXT_AUTO_SAVE_ENABLED !== 'false',
      defaultStartHour: parseInt(process.env.NUXT_DEFAULT_START_HOUR || '9'),
      defaultEndHour: parseInt(process.env.NUXT_DEFAULT_END_HOUR || '18'),
      defaultSlotDuration: parseInt(process.env.NUXT_DEFAULT_SLOT_DURATION || '30'),
      maxDaysRetention: parseInt(process.env.NUXT_MAX_DAYS_RETENTION || '7')
    }
  }
})