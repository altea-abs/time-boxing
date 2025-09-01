<template>
  <div class="help-step">
    <div class="step-header">
      <v-icon icon="mdi-clock-outline" size="48" color="primary" class="mb-4" />
      <h2>Timeboxing</h2>
    </div>
    
    <div class="step-content">
      <p class="lead-text">
        Trasforma le tue priorità in una pianificazione concreta trascinandole negli slot temporali.
      </p>
      
      <div class="feature-points">
        <div class="feature-point">
          <v-icon icon="mdi-drag" color="info" class="mr-3" />
          <span>Trascina i task prioritari negli slot temporali</span>
        </div>
        <div class="feature-point">
          <v-icon icon="mdi-clock" color="success" class="mr-3" />
          <span>Ogni slot dura 30 minuti per default</span>
        </div>
        <div class="feature-point">
          <v-icon icon="mdi-calendar-today" color="warning" class="mr-3" />
          <span>{{ totalSlots }} slot disponibili per la giornata</span>
        </div>
      </div>
      
      <div class="demo-section">
        <h3>Interazioni avanzate</h3>
        <div class="interaction-list">
          <div class="interaction-item">
            <div class="shortcut-keys">
              <kbd>Ctrl</kbd> + <kbd>Drag</kbd>
            </div>
            <span>Assegna a più slot consecutivi</span>
          </div>
          <div class="interaction-item">
            <div class="shortcut-keys">
              <v-icon icon="mdi-toggle-switch" size="small" />
            </div>
            <span>Abilita multi-assegnazione</span>
          </div>
        </div>
      </div>
      
      <v-alert 
        type="success" 
        variant="tonal" 
        class="mt-4"
        icon="mdi-calendar-check"
      >
        <strong>Obiettivo:</strong> Assegna tutte le tue priorità agli slot temporali 
        per avere una giornata completamente pianificata.
      </v-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
// Get time slots data from store
const timeSlotsStore = useTimeSlotsStore()
const { timeSlots } = storeToRefs(timeSlotsStore)

const totalSlots = computed(() => timeSlots.value.length)
</script>

<style scoped>
.help-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  min-height: 400px;
}

.step-header {
  margin-bottom: 2rem;
}

.step-header h2 {
  font-size: 2rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  margin: 0;
}

.step-content {
  max-width: 500px;
  width: 100%;
}

.lead-text {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: rgb(var(--v-theme-on-surface));
}

.feature-points {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.feature-point {
  display: flex;
  align-items: center;
  text-align: left;
  padding: 1rem;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 8px;
}

.feature-point span {
  font-size: 0.95rem;
  line-height: 1.4;
}

.demo-section {
  margin: 2rem 0;
}

.demo-section h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: rgb(var(--v-theme-on-surface));
}

.interaction-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.interaction-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 6px;
}

.shortcut-keys {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
  min-width: 100px;
}

.shortcut-keys kbd {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
  padding: 0.125rem 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

@media (max-width: 600px) {
  .help-step {
    padding: 1rem;
  }
  
  .step-header h2 {
    font-size: 1.5rem;
  }
  
  .lead-text {
    font-size: 1rem;
  }
  
  .interaction-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>