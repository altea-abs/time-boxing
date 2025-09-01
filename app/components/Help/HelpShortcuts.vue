<template>
  <div class="help-step">
    <div class="step-header">
      <v-icon icon="mdi-keyboard" size="48" color="primary" class="mb-4" />
      <h2>Scorciatoie da Tastiera</h2>
    </div>
    
    <div class="step-content">
      <p class="lead-text">
        Velocizza il tuo workflow con le scorciatoie da tastiera integrate nell'applicazione.
      </p>
      
      <div class="shortcuts-categories">
        <div class="category">
          <h3>
            <v-icon icon="mdi-cog" class="mr-2" />
            Navigazione
          </h3>
          <div class="shortcuts-list">
            <div class="shortcut-item">
              <div class="shortcut-keys">
                <kbd>Alt</kbd> + <kbd>S</kbd>
              </div>
              <span>Apre/chiude le impostazioni</span>
            </div>
            <div class="shortcut-item">
              <div class="shortcut-keys">
                <kbd>Alt</kbd> + <kbd>H</kbd>
              </div>
              <span>Apre/chiude questa guida</span>
            </div>
            <div class="shortcut-item">
              <div class="shortcut-keys">
                <kbd>Alt</kbd> + <kbd>G</kbd>
              </div>
              <span>Apre il repository GitHub</span>
            </div>
            <div class="shortcut-item">
              <div class="shortcut-keys">
                <kbd>Esc</kbd>
              </div>
              <span>Chiude qualsiasi dialog aperto</span>
            </div>
          </div>
        </div>
        
        <div class="category">
          <h3>
            <v-icon icon="mdi-drag" class="mr-2" />
            Timeboxing
          </h3>
          <div class="shortcuts-list">
            <div class="shortcut-item">
              <div class="shortcut-keys">
                <kbd>Ctrl</kbd> + <kbd>Drag</kbd>
              </div>
              <span>Assegna task a più slot consecutivi</span>
            </div>
            <div class="shortcut-item">
              <div class="shortcut-keys">
                <kbd>Click</kbd>
              </div>
              <span>Aggiungi/rimuovi task dalle priorità</span>
            </div>
            <div class="shortcut-item">
              <div class="shortcut-keys">
                <kbd>Drag</kbd>
              </div>
              <span>Evidenzia slot adiacenti liberi</span>
            </div>
            <div class="shortcut-item">
              <div class="shortcut-keys">
                <v-icon icon="mdi-toggle-switch" size="small" />
              </div>
              <span>Toggle multi-assegnazione</span>
            </div>
          </div>
        </div>
      </div>
      
      <v-alert 
        type="info" 
        variant="tonal" 
        class="mt-4"
        icon="mdi-keyboard-outline"
      >
        <strong>Suggerimento:</strong> Memorizza queste scorciatoie per aumentare 
        significativamente la tua produttività con l'app!
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
  max-width: 600px;
  width: 100%;
}

.lead-text {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: rgb(var(--v-theme-on-surface));
}

.shortcuts-categories {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
}

.category h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: rgb(var(--v-theme-on-surface));
  display: flex;
  align-items: center;
  justify-content: center;
}

.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.shortcut-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 6px;
  text-align: left;
}

.shortcut-keys {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
  min-width: 120px;
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

.shortcut-item span {
  font-size: 0.95rem;
  line-height: 1.4;
  flex: 1;
  margin-left: 1rem;
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
  
  .shortcut-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .shortcut-keys {
    min-width: unset;
  }
  
  .shortcut-item span {
    margin-left: 0;
  }
}
</style>