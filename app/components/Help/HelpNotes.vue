<template>
  <div class="help-step">
    <div class="step-header">
      <v-icon icon="mdi-notebook" size="48" color="primary" class="mb-4" />
      <h2>Note Giornaliere</h2>
    </div>
    
    <div class="step-content">
      <p class="lead-text">
        Usa la sezione note per catturare obiettivi, riflessioni e promemoria della tua giornata.
      </p>
      
      <div class="feature-points">
        <div class="feature-point">
          <v-icon icon="mdi-content-save-auto" color="success" class="mr-3" />
          <span>Le note si salvano automaticamente mentre scrivi</span>
        </div>
        <div class="feature-point">
          <v-icon icon="mdi-content-copy" color="info" class="mr-3" />
          <span>Copia facilmente tutto il contenuto con un click</span>
        </div>
        <div class="feature-point">
          <v-icon icon="mdi-trash-can" color="warning" class="mr-3" />
          <span>Pulisci rapidamente tutte le note quando necessario</span>
        </div>
        <div class="feature-point">
          <v-icon icon="mdi-format-text" color="secondary" class="mr-3" />
          <span>Massimo 1000 caratteri per mantenere le note concise</span>
        </div>
      </div>
      
      <div class="use-cases">
        <h3>Idee per l'uso</h3>
        <div class="use-case-list">
          <v-chip variant="outlined" color="primary" class="ma-1">Obiettivi del giorno</v-chip>
          <v-chip variant="outlined" color="primary" class="ma-1">Priorità importanti</v-chip>
          <v-chip variant="outlined" color="primary" class="ma-1">Idee creative</v-chip>
          <v-chip variant="outlined" color="primary" class="ma-1">Promemoria urgenti</v-chip>
          <v-chip variant="outlined" color="primary" class="ma-1">Riflessioni serali</v-chip>
          <v-chip variant="outlined" color="primary" class="ma-1">Prossimi passi</v-chip>
        </div>
      </div>
      
      <v-alert 
        type="success" 
        variant="tonal" 
        class="mt-4"
        icon="mdi-lightbulb-on"
      >
        <strong>Consiglio:</strong> Usa le note all'inizio della giornata per definire 
        gli obiettivi e alla fine per riflettere sui risultati ottenuti.
      </v-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
// No specific logic needed for this component
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

.use-cases {
  margin: 2rem 0;
}

.use-cases h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: rgb(var(--v-theme-on-surface));
}

.use-case-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
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