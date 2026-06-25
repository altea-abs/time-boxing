import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin((nuxtApp) => {
  // Detect system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light' // fallback
  }

  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    display: {
      mobileBreakpoint: 'sm',
    },
    theme: {
      defaultTheme: getSystemTheme(),
      themes: {
        dark: {
          dark: true,
          colors: {
            // Canvas — deep midnight void
            'background': '#081928',
            // Surface tonal layers
            'surface': '#071d30',
            'surface-bright': '#0d2540',
            'surface-variant': '#0a1e30',
            'on-surface-variant': '#8faac8',
            // Primary — Green Rio Grande pulse
            'primary': '#b2d600',
            'primary-darken-1': '#8fa800',
            'on-primary': '#081928',
            'primary-container': '#cdf332',
            'on-primary-container': '#081928',
            // Secondary
            'secondary': '#8faac8',
            'on-secondary': '#081928',
            'secondary-container': '#163558',
            'on-secondary-container': '#d4e4f9',
            // Tertiary — purple/lavender for informational alerts
            'tertiary': '#9b74c4',
            'on-tertiary': '#ffffff',
            'tertiary-container': '#3b2558',
            'on-tertiary-container': '#e8d9f8',
            // Semantic colors
            'error': '#cf6679',
            'error-container': '#8b2533',
            'on-error': '#ffffff',
            'on-error-container': '#ffd9de',
            'success': '#b2d600',
            'success-container': '#3a4400',
            'info': '#7b9fc2',
            'warning': '#e6a817',
            // Text — never pure white (DESIGN.md rule)
            'on-surface': '#d4e4f9',
            'on-background': '#d4e4f9',
            // Ghost border fallback (15% opacity in usage)
            'outline-variant': '#2a4a65',
            'outline': '#3a5a78',
            // Navigation & sidebar
            'navigationBar': '#081928',
            'sidebar': '#07192b',
          },
        },
        light: {
          dark: false,
          colors: {
            'background': '#f4f6f9',
            'surface': '#ffffff',
            'primary': '#b2d600',
            'on-primary': '#081928',
            'primary-container': '#cdf332',
            'on-primary-container': '#1a2000',
            'secondary': '#526070',
            'on-secondary': '#ffffff',
            'error': '#ba1a1a',
            'error-container': '#ffdad6',
            'success': '#386a20',
            'info': '#2196F3',
            'warning': '#e6a817',
            'on-surface': '#181c20',
            'outline': '#72787e',
            'outline-variant': '#c1c7ce',
            'navigationBar': '#f6f6f6',
            'sidebar': '#ffffff',
          },
        },
      },
    },
    defaults: {
      VBtn: {
        color: 'primary',
      },
      VTextField: {
        color: 'primary',
      },
      VAlert: {
        color: 'primary',
      },
    },
  })

  // Listen for system theme changes
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleThemeChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light'
      vuetify.theme.global.name.value = newTheme
    }

    // Use the modern API if available, fallback to deprecated addListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleThemeChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleThemeChange)
    }

    // Cleanup on app unmount
    nuxtApp.hook('app:beforeUnmount', () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleThemeChange)
      } else {
        mediaQuery.removeListener(handleThemeChange)
      }
    })
  }

  nuxtApp.vueApp.use(vuetify)
})