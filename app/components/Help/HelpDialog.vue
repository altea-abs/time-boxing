<template>
  <v-dialog v-model="isVisible" max-width="800" max-height="90vh" @keydown.esc="close">
    <v-card class="help-dialog d-flex flex-column" style="height: 90vh;">
      <v-card-title class="d-flex align-center px-6 py-4 flex-shrink-0">
        <v-icon icon="mdi-help-circle" class="mr-2" color="primary" />
        Guida Interattiva
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="close"
        />
      </v-card-title>
      
      <v-card-text class="pa-0 flex-grow-1 overflow-y-auto">
        <v-stepper 
          v-model="currentStep" 
          class="help-stepper"
          :items="stepperItems"
          hide-actions
          flat
        >
          <template #item.1>
            <HelpBrainDump />
          </template>
          
          <template #item.2>
            <HelpTimeboxing />
          </template>
          
          <template #item.3>
            <HelpShortcuts />
          </template>
          
          <template #item.4>
            <HelpNotes />
          </template>
          
          <template #item.5>
            <HelpTips />
          </template>
        </v-stepper>
      </v-card-text>
      
      <v-card-actions class="px-6 py-4 flex-shrink-0">
        <v-btn
          v-if="currentStep > 1"
          variant="outlined"
          @click="previousStep"
          prepend-icon="mdi-chevron-left"
        >
          Precedente
        </v-btn>
        
        <v-spacer />
        
        <div class="step-indicator">
          {{ currentStep }} di {{ totalSteps }}
        </div>
        
        <v-spacer />
        
        <v-btn
          v-if="currentStep < totalSteps"
          color="primary"
          @click="nextStep"
          append-icon="mdi-chevron-right"
        >
          Successivo
        </v-btn>
        
        <v-btn
          v-else
          color="primary"
          variant="elevated"
          @click="close"
          prepend-icon="mdi-check"
        >
          Inizia a usare l'app
        </v-btn>
      </v-card-actions>
      
      <div class="quick-actions flex-shrink-0">
        <v-btn
          variant="text"
          size="small"
          prepend-icon="mdi-github"
          href="https://github.com/altea-abs/time-boxing"
          target="_blank"
        >
          GitHub
        </v-btn>
        <v-btn
          variant="text"
          size="small"
          @click="skipToEnd"
          prepend-icon="mdi-skip-next"
        >
          Salta la guida
        </v-btn>
      </div>
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

// Stepper state
const currentStep = ref(1)
const totalSteps = 5

// Stepper configuration
const stepperItems = [
  {
    title: 'Brain Dump',
    subtitle: 'Scarica i pensieri',
    value: 1
  },
  {
    title: 'Timeboxing',
    subtitle: 'Pianifica il tempo',
    value: 2
  },
  {
    title: 'Scorciatoie',
    subtitle: 'Velocizza il workflow',
    value: 3
  },
  {
    title: 'Note',
    subtitle: 'Rifletti e pianifica',
    value: 4
  },
  {
    title: 'Suggerimenti',
    subtitle: 'Massimizza il successo',
    value: 5
  }
]

// Navigation methods
const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const skipToEnd = () => {
  currentStep.value = totalSteps
}

const close = () => {
  // Reset to first step for next time
  currentStep.value = 1
  emit('update:modelValue', false)
}

// Reset step when dialog opens
watch(isVisible, (newValue) => {
  if (newValue) {
    currentStep.value = 1
  }
})
</script>

<style scoped>
.help-dialog {
  overflow: hidden;
  max-height: 90vh;
}

.help-stepper {
  border: none !important;
  box-shadow: none !important;
}

:deep(.v-stepper) {
  background: transparent;
  box-shadow: none;
}

:deep(.v-stepper-header) {
  background: rgb(var(--v-theme-surface-variant));
  border-radius: 0;
  padding: 1rem 2rem;
  box-shadow: none;
}

:deep(.v-stepper-item) {
  padding: 0.5rem 1rem;
}

:deep(.v-stepper-item__avatar) {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

:deep(.v-stepper-item__avatar.v-stepper-item--complete .v-stepper-item__avatar) {
  background: rgb(var(--v-theme-success));
}

:deep(.v-stepper-window) {
  margin: 0;
  padding: 0;
  min-height: 400px;
  overflow-y: auto;
}

:deep(.v-stepper-window-item) {
  padding: 0;
}

.step-indicator {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  padding: 0.5rem 1rem;
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 20px;
  min-width: 80px;
  text-align: center;
}

.quick-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgba(var(--v-theme-surface-variant), 0.3);
}

@media (max-width: 600px) {
  :deep(.v-stepper-header) {
    padding: 0.5rem 1rem;
  }
  
  :deep(.v-stepper-item) {
    padding: 0.25rem 0.5rem;
  }
  
  :deep(.v-stepper-item__title) {
    font-size: 0.8rem;
  }
  
  :deep(.v-stepper-item__subtitle) {
    font-size: 0.7rem;
  }
  
  .step-indicator {
    font-size: 0.8rem;
    padding: 0.25rem 0.75rem;
    min-width: 60px;
  }
  
  .quick-actions {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
  }
}
</style>