<template>
  <v-app>
    <NuxtRouteAnnouncer />
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
const config = useRuntimeConfig()
const showHelp = ref(false)
const showSettings = ref(false)
const appVersion = ref(config.public.appVersion)

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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
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
  
  .title-sub {
    font-size: 0.75rem;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .version-badge {
    font-size: 0.625rem;
    padding: 0.0625rem 0.375rem;
  }
  
  .header-actions {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .header-icon {
    animation: none;
  }
}
</style>
