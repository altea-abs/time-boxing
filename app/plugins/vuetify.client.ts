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
    theme: {
      defaultTheme: getSystemTheme(),
      themes: {
        light: {
          colors: {
            primary: '#1976d2',
            secondary: '#757575',
            accent: '#82B1FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
            surface: '#FFFFFF',
            'surface-variant': '#F5F5F5',
            'on-surface': '#212121',
            'on-surface-variant': '#757575',
          },
        },
        dark: {
          colors: {
            primary: '#2196F3',
            secondary: '#424242',
            accent: '#82B1FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
            surface: '#121212',
            'surface-variant': '#1E1E1E',
            'on-surface': '#FFFFFF',
            'on-surface-variant': '#AAAAAA',
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