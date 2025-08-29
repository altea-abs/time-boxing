<template>
  <div class="app">
    <NuxtRouteAnnouncer />
    <header class="app-header">
      <h1>Brain Dump & Timeboxing Planner</h1>
    </header>
    <main class="app-main">
      <div class="left-column">
        <BrainDumpSection @priority-toggled="handlePriorityToggled" />
      </div>
      <div class="right-column">
        <TimeSlotSection />
      </div>
    </main>
  </div>
</template>

<script setup>
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
  background: rgb(var(--v-theme-surface));
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: background-color 0.2s ease;
}

.app-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  color: rgb(var(--v-theme-on-surface));
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
  
  .app-header {
    padding: 1rem;
  }
  
  .app-header h1 {
    font-size: 1.25rem;
  }
}
</style>
