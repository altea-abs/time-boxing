<template>
  <div class="help-step">
    <div class="step-header">
      <v-icon icon="mdi-brain" size="48" color="primary" class="mb-4" />
      <h2>Brain Dump</h2>
    </div>
    
    <div class="step-content">
      <p class="lead-text">
        Il primo passo per organizzare la tua giornata è liberare la mente da tutti i pensieri e task.
      </p>
      
      <div class="feature-points">
        <div class="feature-point">
          <v-icon icon="mdi-plus-circle" color="success" class="mr-3" />
          <span>Aggiungi tutti i task che ti vengono in mente, senza filtri</span>
        </div>
        <div class="feature-point">
          <v-icon icon="mdi-star" color="warning" class="mr-3" />
          <span>Clicca sui task per renderli priorità (max {{ maxPriorities }})</span>
        </div>
        <div class="feature-point">
          <v-icon icon="mdi-delete" color="error" class="mr-3" />
          <span>Elimina i task completati o non più rilevanti</span>
        </div>
      </div>
      
      <v-alert 
        type="info" 
        variant="tonal" 
        class="mt-4"
        icon="mdi-lightbulb"
      >
        <strong>Suggerimento:</strong> Non preoccuparti dell'ordine o della priorità inizialmente. 
        L'obiettivo è svuotare la mente da tutti i pensieri e task pendenti.
      </v-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
// Get max priorities from store
const prioritiesStore = usePrioritiesStore()
const { maxPriorities } = storeToRefs(prioritiesStore)
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
}
</style>