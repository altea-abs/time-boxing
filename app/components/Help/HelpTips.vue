<template>
  <div class="help-step">
    <div class="step-header">
      <v-icon icon="mdi-lightbulb-outline" size="48" color="warning" class="mb-4" />
      <h2>Suggerimenti per il Successo</h2>
    </div>
    
    <div class="step-content">
      <p class="lead-text">
        Segui questi consigli per ottenere il massimo dalla tua esperienza di timeboxing.
      </p>
      
      <div class="tips-workflow">
        <h3>Workflow Consigliato</h3>
        <div class="workflow-steps">
          <div class="workflow-step">
            <div class="step-number">1</div>
            <div class="step-info">
              <h4>Brain Dump Completo</h4>
              <p>Inizia scaricando tutti i pensieri e task dalla tua mente</p>
            </div>
          </div>
          <div class="workflow-step">
            <div class="step-number">2</div>
            <div class="step-info">
              <h4>Seleziona le Priorità</h4>
              <p>Scegli massimo {{ maxPriorities }} task davvero importanti per oggi</p>
            </div>
          </div>
          <div class="workflow-step">
            <div class="step-number">3</div>
            <div class="step-info">
              <h4>Pianifica negli Slot</h4>
              <p>Assegna le priorità agli slot temporali specifici</p>
            </div>
          </div>
          <div class="workflow-step">
            <div class="step-number">4</div>
            <div class="step-info">
              <h4>Scrivi nelle Note</h4>
              <p>Aggiungi obiettivi e riflessioni per completare la pianificazione</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="best-practices">
        <h3>Best Practices</h3>
        <v-list density="compact" class="practices-list">
          <v-list-item>
            <template #prepend>
              <v-icon icon="mdi-check-circle" color="success" size="small" />
            </template>
            <v-list-item-title>Pianifica il giorno la sera prima</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <template #prepend>
              <v-icon icon="mdi-check-circle" color="success" size="small" />
            </template>
            <v-list-item-title>Lascia del tempo libero tra i task importanti</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <template #prepend>
              <v-icon icon="mdi-check-circle" color="success" size="small" />
            </template>
            <v-list-item-title>Rifletti sui risultati alla fine della giornata</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <template #prepend>
              <v-icon icon="mdi-check-circle" color="success" size="small" />
            </template>
            <v-list-item-title>Sii flessibile: adatta il piano se necessario</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
      
      <v-alert 
        type="warning" 
        variant="tonal" 
        class="mt-4"
        icon="mdi-star"
      >
        <strong>Ricorda:</strong> L'obiettivo non è riempire ogni slot, ma avere chiarezza 
        su cosa è davvero importante e dedicargli il tempo necessario.
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

.tips-workflow {
  margin-bottom: 2rem;
}

.tips-workflow h3,
.best-practices h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: rgb(var(--v-theme-on-surface));
}

.workflow-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.workflow-step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(var(--v-theme-primary), 0.05);
  border-radius: 8px;
  text-align: left;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.step-info h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: rgb(var(--v-theme-on-surface));
}

.step-info p {
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.8;
}

.best-practices {
  margin: 2rem 0;
}

.practices-list {
  background: rgba(var(--v-theme-success), 0.05);
  border-radius: 8px;
  padding: 0.5rem 0;
}

:deep(.v-list-item-title) {
  font-size: 0.875rem;
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
  
  .workflow-step {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
  }
  
  .step-info {
    width: 100%;
  }
}
</style>