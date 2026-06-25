<template>
  <v-app>
    <NuxtRouteAnnouncer />
    <v-app-bar
      color="surface-bright"
      theme="dark"
      prominent
      flat
      class="app-header"
    >
      <template #prepend>
        <v-img
          :src="iconSrc"
          alt="Logo"
          width="40"
          height="40"
          class="header-logo mr-3"
        />
      </template>

      <div class="header-content">
        <v-app-bar-title class="header-title">
          <span class="title-main">Brain Dump &amp; Timeboxing</span>
          <span class="version-badge">v{{ appVersion }}</span>
        </v-app-bar-title>
      </div>

      <template #append>
        <div class="header-actions">
          <v-btn
            :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            variant="text"
            size="default"
            @click="toggleTheme"
            :title="isDark ? 'Passa al tema chiaro' : 'Passa al tema scuro'"
          />
          <v-btn
            icon="mdi-cog"
            variant="text"
            size="default"
            @click="showSettings = !showSettings"
            title="Impostazioni (Alt+S)"
          />
          <v-btn
            icon="mdi-github"
            variant="text"
            size="default"
            href="https://github.com/altea-abs/time-boxing"
            target="_blank"
            title="GitHub Repository (Alt+G)"
          />
          <v-btn
            icon="mdi-help-circle-outline"
            variant="text"
            size="default"
            @click="showHelp = !showHelp"
            title="Aiuto (Alt+H)"
          />
        </div>
      </template>
    </v-app-bar>
    
    <!-- Settings Dialog -->
    <SettingsDialog v-model="showSettings" />
    
    <!-- Help Dialog -->
    <HelpDialog v-model="showHelp" />
    <v-main>
      <div class="app-main">
        <div class="left-column">
          <BrainDumpSection @priority-toggled="handlePriorityToggled" />
        </div>
        <div class="right-column">
          <TimeSlotSection />
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { useTheme } from 'vuetify'

const config = useRuntimeConfig()
const showHelp = ref(false)
const showSettings = ref(false)
const appVersion = ref(config.public.appVersion)
const iconSrc = `${config.app.baseURL}icon-white.svg`

// Light/dark theme toggle (persisted; falls back to system preference)
const theme = useTheme()
const isDark = computed(() => theme.global.name.value === 'dark')
const toggleTheme = () => {
  const next = isDark.value ? 'light' : 'dark'
  theme.global.name.value = next
  if (import.meta.client) {
    localStorage.setItem('braindump-theme', next)
  }
}

const handlePriorityToggled = (task) => {
  console.log('Priority toggled for task:', task)
}

// Keyboard shortcuts
onMounted(() => {
  const handleKeydown = (event) => {
    // Alt+S to open settings
    if (event.altKey && event.key.toLowerCase() === 's') {
      event.preventDefault()
      showSettings.value = !showSettings.value
    }
    // Alt+H to open help
    if (event.altKey && event.key.toLowerCase() === 'h') {
      event.preventDefault()
      showHelp.value = !showHelp.value
    }
    // Alt+G to open repository
    if (event.altKey && event.key.toLowerCase() === 'g') {
      event.preventDefault()
      window.open('https://github.com/altea-abs/time-boxing', '_blank')
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  // Cleanup on unmount
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Reset element margins only. Do NOT reset padding globally: Vuetify 4 ships
   its component styles inside an @layer, so an unlayered `* { padding: 0 }`
   would override (and flatten) the padding of every Vuetify chip, button,
   input, etc. The app's own elements set their padding explicitly. */
body,
h1, h2, h3, h4, h5, h6,
p, figure, blockquote, dl, dd,
ul, ol {
  margin: 0;
}

body {
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.5;
  color: rgb(var(--v-theme-on-background));
  background-color: rgb(var(--v-theme-background));
  transition: background-color 0.2s ease, color 0.2s ease;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  /* Flat midnight bar (DESIGN.md navigationBar) — no gradient, no shadow */
  box-shadow: none !important;
}

.header-content {
  flex: 1;
  text-align: center;
}

.header-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.title-main {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  white-space: nowrap;
}

.version-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: none;
  letter-spacing: normal;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.version-badge:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}


.app-main {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.left-column {
  background: rgb(var(--v-theme-surface));
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: background-color 0.2s ease;
}

.right-column {
  background: rgb(var(--v-theme-surface));
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: background-color 0.2s ease;
}

@media (max-width: 768px) {
  .app-main {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  
  .title-main {
    font-size: 1.25rem;
  }

  .version-badge {
    font-size: 0.625rem;
    padding: 0.0625rem 0.375rem;
  }
  
  .header-actions {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
