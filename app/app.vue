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
          <div class="title-sub">Daily Planner</div>
        </v-app-bar-title>
      </div>

      <template #append>
        <div class="header-actions">
          <v-btn
            icon="mdi-github"
            variant="text"
            size="small"
            href="https://github.com/altea-abs/time-boxing"
            target="_blank"
            title="GitHub Repository"
          />
          <v-btn
            icon="mdi-help-circle-outline"
            variant="text"
            size="small"
            @click="showHelp = !showHelp"
            title="Aiuto"
          />
        </div>
      </template>
    </v-app-bar>
    
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
const showHelp = ref(false)

const handlePriorityToggled = (task) => {
  console.log('Priority toggled for task:', task)
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
