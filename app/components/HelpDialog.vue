<template>
  <v-dialog v-model="isVisible" max-width="600" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-help-circle" class="mr-2" color="primary" />
        Come usare l'app
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="close"
        />
      </v-card-title>
      
      <v-card-text>
        <div class="help-content">
          <!-- Brain Dump Section -->
          <div class="help-section">
            <h3>
              <v-icon icon="mdi-brain" class="mr-2" color="primary" />
              Brain Dump
            </h3>
            <p>Aggiungi tutti i tuoi task senza filtri. Clicca sui task per renderli priorità.</p>
            <v-chip size="small" color="primary" variant="outlined" class="mt-2">
              Massimo {{ maxPriorities }} priorità
            </v-chip>
          </div>

          <!-- Timeboxing Section -->
          <div class="help-section">
            <h3>
              <v-icon icon="mdi-clock-outline" class="mr-2" color="primary" />
              Timeboxing
            </h3>
            <p>Trascina i task negli slot temporali per programmare la tua giornata.</p>
            <div class="mt-2">
              <v-chip size="small" color="info" variant="outlined" class="mr-1">
                30min per slot
              </v-chip>
              <v-chip size="small" color="info" variant="outlined">
                {{ totalSlots }} slot disponibili
              </v-chip>
            </div>
          </div>

          <!-- Shortcuts Section -->
          <div class="help-section">
            <h3>
              <v-icon icon="mdi-keyboard" class="mr-2" color="primary" />
              Scorciatoie
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
                <span>Da slot occupato evidenzia slot adiacenti liberi</span>
              </div>
              <div class="shortcut-item">
                <div class="shortcut-keys">
                  <v-icon icon="mdi-toggle-switch" size="small" />
                </div>
                <span>Toggle multi-assegnazione per assegnare a più slot</span>
              </div>
            </div>
          </div>

          <!-- Notes Section -->
          <div class="help-section">
            <h3>
              <v-icon icon="mdi-notebook" class="mr-2" color="primary" />
              Note
            </h3>
            <p>Usa la sezione note per obiettivi, riflessioni e promemoria della giornata.</p>
            <div class="mt-2">
              <v-chip size="small" color="success" variant="outlined" class="mr-1">
                Auto-save
              </v-chip>
              <v-chip size="small" color="success" variant="outlined">
                1000 caratteri max
              </v-chip>
            </div>
          </div>

          <!-- Tips Section -->
          <div class="help-section">
            <h3>
              <v-icon icon="mdi-lightbulb-outline" class="mr-2" color="warning" />
              Suggerimenti
            </h3>
            <v-list density="compact" class="tips-list">
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-check-circle" color="success" size="small" />
                </template>
                <v-list-item-title>Inizia con il Brain Dump: scarica tutti i pensieri</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-check-circle" color="success" size="small" />
                </template>
                <v-list-item-title>Seleziona max {{ maxPriorities }} priorità per la giornata</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-check-circle" color="success" size="small" />
                </template>
                <v-list-item-title>Assegna le priorità negli slot temporali</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-check-circle" color="success" size="small" />
                </template>
                <v-list-item-title>Usa le note per riflettere e pianificare</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </div>
      </v-card-text>
      
      <v-card-actions>
        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-github"
          href="https://github.com/anthropics/claude-code"
          target="_blank"
          size="small"
        >
          GitHub
        </v-btn>
        <v-spacer />
        <v-btn color="primary" @click="close">
          Inizia a usare l'app
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface HelpDialogProps {
  modelValue: boolean
}

interface HelpDialogEmits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<HelpDialogProps>()
const emit = defineEmits<HelpDialogEmits>()

// Reactive visibility
const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Get configuration from stores
const prioritiesStore = usePrioritiesStore()
const timeSlotsStore = useTimeSlotsStore()
const { maxPriorities } = storeToRefs(prioritiesStore)
const { timeSlots } = storeToRefs(timeSlotsStore)

const totalSlots = computed(() => timeSlots.value.length)

const close = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.help-content {
  line-height: 1.6;
}

.help-section {
  margin-bottom: 2rem;
}

.help-section:last-child {
  margin-bottom: 0;
}

.help-section h3 {
  color: rgb(var(--v-theme-primary));
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.help-section p {
  margin-bottom: 0.5rem;
  color: rgb(var(--v-theme-on-surface));
}

.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.shortcut-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background: rgba(var(--v-theme-surface-variant), 0.5);
  border-radius: 6px;
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

.tips-list {
  margin-top: 0.5rem;
  background: rgba(var(--v-theme-success), 0.05);
  border-radius: 8px;
  padding: 0.5rem 0;
}

:deep(.v-list-item-title) {
  font-size: 0.875rem;
  line-height: 1.4;
}

@media (max-width: 600px) {
  .shortcut-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .shortcut-keys {
    min-width: unset;
  }
  
  .help-section h3 {
    font-size: 1rem;
  }
}
</style>