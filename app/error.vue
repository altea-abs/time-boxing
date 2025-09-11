<template>
  <v-app>
    <v-app-bar
      color="primary"
      dark
      prominent
      elevation="4"
      class="app-header"
    >
      <template #prepend>
        <div class="header-icon">
          <v-icon icon="mdi-brain" size="32" class="mr-3" />
        </div>
      </template>
      
      <div class="header-content">
        <v-app-bar-title class="header-title">
          <div class="title-main">Brain Dump & Timeboxing</div>
          <div class="title-sub">
            Daily Planner
            <span class="version-badge">v{{ appVersion }}</span>
          </div>
        </v-app-bar-title>
      </div>

      <template #append>
        <div class="header-actions">
          <v-btn
            icon="mdi-github"
            variant="text"
            size="default"
            href="https://github.com/altea-abs/time-boxing"
            target="_blank"
            title="GitHub Repository"
          />
        </div>
      </template>
    </v-app-bar>

    <v-main>
      <div class="error-container">
        <div class="error-content">
          <div class="error-icon">
            <v-icon 
              :icon="errorIcon" 
              size="120" 
              :color="errorColor"
              class="error-icon-animation"
            />
          </div>
          
          <div class="error-details">
            <h1 class="error-title">
              {{ errorTitle }}
            </h1>
            
            <p class="error-message">
              {{ errorDescription }}
            </p>
            
            <div class="error-actions">
              <v-btn
                color="primary"
                size="large"
                variant="elevated"
                @click="goHome"
                class="mr-4"
              >
                <v-icon icon="mdi-home" class="mr-2" />
                Torna alla Home
              </v-btn>
              
              <v-btn
                color="secondary"
                size="large"
                variant="outlined"
                @click="goBack"
              >
                <v-icon icon="mdi-arrow-left" class="mr-2" />
                Indietro
              </v-btn>
            </div>
            
            <div class="error-info" v-if="showDetails">
              <v-divider class="my-4" />
              <h3 class="error-info-title">Dettagli Tecnici</h3>
              <div class="error-code">
                <strong>Codice:</strong> {{ error.statusCode }}
              </div>
              <div class="error-stack" v-if="isDev && error.stack">
                <details>
                  <summary>Stack Trace (Sviluppo)</summary>
                  <pre>{{ error.stack }}</pre>
                </details>
              </div>
            </div>
            
            <div class="error-toggle">
              <v-btn
                variant="text"
                size="small"
                @click="showDetails = !showDetails"
              >
                {{ showDetails ? 'Nascondi' : 'Mostra' }} Dettagli
                <v-icon :icon="showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down'" class="ml-1" />
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

interface Props {
  error: NuxtError
}

const props = defineProps<Props>()

const config = useRuntimeConfig()
const appVersion = ref(config.public.appVersion)
const showDetails = ref(false)
const isDev = process.dev

// Determine error type and styling
const errorType = computed(() => {
  const code = props.error.statusCode
  if (code === 404) return '404'
  if (code >= 500) return '500'
  return 'generic'
})

const errorIcon = computed(() => {
  switch (errorType.value) {
    case '404':
      return 'mdi-map-marker-question'
    case '500':
      return 'mdi-server-network-off'
    default:
      return 'mdi-alert-circle'
  }
})

const errorColor = computed(() => {
  switch (errorType.value) {
    case '404':
      return 'warning'
    case '500':
      return 'error'
    default:
      return 'primary'
  }
})

const errorTitle = computed(() => {
  switch (errorType.value) {
    case '404':
      return 'Pagina Non Trovata'
    case '500':
      return 'Errore del Server'
    default:
      return `Errore ${props.error.statusCode || 'Sconosciuto'}`
  }
})

const errorDescription = computed(() => {
  switch (errorType.value) {
    case '404':
      return 'La pagina che stai cercando non esiste o è stata spostata. Controlla l\'URL o torna alla homepage.'
    case '500':
      return 'Si è verificato un errore interno del server. Stiamo lavorando per risolvere il problema.'
    default:
      return props.error.statusMessage || 'Si è verificato un errore imprevisto. Ti preghiamo di riprovare.'
  }
})

const goHome = () => {
  navigateTo('/')
}

const goBack = () => {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    window.history.back()
  } else {
    navigateTo('/')
  }
}

// Set page meta
useHead({
  title: `${errorTitle.value} - Brain Dump & Timeboxing`,
  meta: [
    { name: 'description', content: errorDescription.value }
  ]
})
</script>

<style scoped>
/* Use the same header styles as app.vue */
.app-header {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%) !important;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.25) !important;
}

.header-icon {
  display: flex;
  align-items: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.header-content {
  flex: 1;
  text-align: center;
}

.header-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.title-main {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.title-sub {
  font-size: 0.875rem;
  font-weight: 400;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 0.75rem;
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

.header-actions {
  display: flex;
  gap: 0.5rem;
}

/* Error page specific styles */
.error-container {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgb(var(--v-theme-background));
}

.error-content {
  max-width: 600px;
  width: 100%;
  text-align: center;
  background: rgb(var(--v-theme-surface));
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}

.error-icon {
  margin-bottom: 2rem;
}

.error-icon-animation {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.error-details {
  margin-bottom: 1rem;
}

.error-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 1rem;
  line-height: 1.2;
}

.error-message {
  font-size: 1.1rem;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-actions {
  margin-bottom: 2rem;
}

.error-info {
  text-align: left;
  background: rgb(var(--v-theme-surface-variant));
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.error-info-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: rgb(var(--v-theme-on-surface));
}

.error-code {
  margin-bottom: 0.5rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  color: rgb(var(--v-theme-on-surface-variant));
}

.error-stack {
  margin-top: 1rem;
}

.error-stack details {
  cursor: pointer;
}

.error-stack summary {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: rgb(var(--v-theme-on-surface));
}

.error-stack pre {
  background: rgba(0,0,0,0.05);
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.8rem;
  line-height: 1.4;
  white-space: pre-wrap;
  color: rgb(var(--v-theme-on-surface-variant));
}

.error-toggle {
  margin-top: 1rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .error-container {
    padding: 1rem;
  }
  
  .error-content {
    padding: 2rem 1.5rem;
  }
  
  .error-title {
    font-size: 2rem;
  }
  
  .error-message {
    font-size: 1rem;
  }
  
  .error-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .error-actions .v-btn {
    width: 100%;
    margin: 0 !important;
  }
  
  .title-main {
    font-size: 1.25rem;
  }
  
  .title-sub {
    font-size: 0.75rem;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .version-badge {
    font-size: 0.625rem;
    padding: 0.0625rem 0.375rem;
  }
  
  .header-icon {
    animation: none;
  }
}

/* Dark theme adjustments */
@media (prefers-color-scheme: dark) {
  .error-stack pre {
    background: rgba(255,255,255,0.05);
  }
}
</style>