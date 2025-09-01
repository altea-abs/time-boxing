<template>
  <v-dialog v-model="isVisible" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-cog" class="mr-2" color="primary" />
        Impostazioni
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="close"
        />
      </v-card-title>
      
      <v-card-text>
        <div class="settings-content">
          
          <!-- Priority Settings Section -->
          <div class="settings-section">
            <h3 class="settings-section-title">
              <v-icon icon="mdi-star" class="mr-2" color="warning" />
              Gestione Priorità
            </h3>
            
            <div class="setting-item">
              <div class="setting-label">
                <div class="setting-name">Numero massimo di priorità</div>
                <div class="setting-description">
                  Imposta quante priorità puoi selezionare contemporaneamente
                </div>
              </div>
              
              <div class="setting-control">
                <v-slider
                  v-model="localMaxPriorities"
                  :min="1"
                  :max="10"
                  step="1"
                  show-ticks="always"
                  tick-size="4"
                  color="primary"
                  track-color="grey-lighten-3"
                  thumb-label="always"
                  class="priority-slider"
                >
                  <template v-slot:prepend>
                    <v-btn
                      icon="mdi-minus"
                      size="small"
                      variant="outlined"
                      @click="decrementPriorities"
                      :disabled="localMaxPriorities <= 1"
                    />
                  </template>
                  <template v-slot:append>
                    <v-btn
                      icon="mdi-plus"
                      size="small"
                      variant="outlined"
                      @click="incrementPriorities"
                      :disabled="localMaxPriorities >= 10"
                    />
                  </template>
                </v-slider>
                
                <div class="priority-preview">
                  <div class="priority-chips">
                    <v-chip
                      v-for="n in localMaxPriorities"
                      :key="n"
                      size="small"
                      color="primary"
                      variant="outlined"
                      class="priority-chip"
                    >
                      {{ n }}
                    </v-chip>
                    <div v-if="localMaxPriorities < 10" class="disabled-chips">
                      <v-chip
                        v-for="n in (10 - localMaxPriorities)"
                        :key="n + localMaxPriorities"
                        size="small"
                        color="grey"
                        variant="outlined"
                        disabled
                        class="priority-chip"
                      >
                        {{ n + localMaxPriorities }}
                      </v-chip>
                    </div>
                  </div>
                  <div class="priority-info">
                    <v-icon icon="mdi-information" size="small" color="info" class="mr-1" />
                    <span class="info-text">
                      Potrai selezionare fino a <strong>{{ localMaxPriorities }}</strong> 
                      task come priorità per la giornata
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Time Grid Settings Section -->
          <div class="settings-section">
            <h3 class="settings-section-title">
              <v-icon icon="mdi-clock-outline" class="mr-2" color="info" />
              Orari di Lavoro
            </h3>
            
            <div class="setting-item setting-item--stacked">
              <div class="setting-label">
                <div class="setting-name">Orario di inizio e fine</div>
                <div class="setting-description">Quando inizia e finisce la tua giornata lavorativa</div>
              </div>
              <div class="time-controls">
                <div class="time-control-group">
                  <label class="time-label">Inizio</label>
                  <v-select
                    v-model="localStartHour"
                    :items="hourOptions"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="hour-select"
                  />
                </div>
                <div class="time-control-group">
                  <label class="time-label">Fine</label>
                  <v-select
                    v-model="localEndHour"
                    :items="hourOptions.filter(h => h.value > localStartHour)"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="hour-select"
                  />
                </div>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-label">
                <div class="setting-name">Durata slot</div>
                <div class="setting-description">Durata di ogni time slot in minuti</div>
              </div>
              <div class="setting-control">
                <v-select
                  v-model="localSlotDuration"
                  :items="durationOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="duration-select"
                />
              </div>
            </div>
          </div>

          <!-- Preview Section -->
          <div class="settings-section">
            <h3 class="settings-section-title">
              <v-icon icon="mdi-eye" class="mr-2" color="success" />
              Anteprima Configurazione
            </h3>
            
            <v-card variant="outlined" class="preview-card">
              <v-card-text>
                <div class="preview-stats">
                  <div class="preview-stat">
                    <v-icon icon="mdi-star" color="warning" class="mr-1" />
                    <strong>{{ localMaxPriorities }}</strong> priorità massime
                  </div>
                  <div class="preview-stat">
                    <v-icon icon="mdi-clock" color="info" class="mr-1" />
                    <strong>{{ totalSlotsPreview }}</strong> slot al giorno
                  </div>
                  <div class="preview-stat">
                    <v-icon icon="mdi-timelapse" color="success" class="mr-1" />
                    <strong>{{ totalHoursPreview }}</strong> ore lavorative
                  </div>
                </div>
                
                <div class="preview-schedule">
                  <div class="schedule-info">
                    Orario: {{ formatHour(localStartHour) }} - {{ formatHour(localEndHour) }} 
                    (slot da {{ localSlotDuration }}min)
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>
          
        </div>
      </v-card-text>
      
      <v-card-actions>
        <v-btn
          color="grey"
          variant="outlined"
          @click="resetToDefaults"
          prepend-icon="mdi-restore"
        >
          Ripristina Default
        </v-btn>
        <v-spacer />
        <v-btn
          color="grey"
          variant="text"
          @click="close"
        >
          Annulla
        </v-btn>
        <v-btn
          color="primary"
          @click="saveSettings"
          prepend-icon="mdi-content-save"
        >
          Salva Modifiche
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface SettingsDialogProps {
  modelValue: boolean
}

interface SettingsDialogEmits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<SettingsDialogProps>()
const emit = defineEmits<SettingsDialogEmits>()

// Stores
const prioritiesStore = usePrioritiesStore()
const timeSlotsStore = useTimeSlotsStore()

// Reactive visibility
const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Local state for settings
const localMaxPriorities = ref(5)
const localStartHour = ref(9)
const localEndHour = ref(18)
const localSlotDuration = ref(30)

// Options for selects
const hourOptions = computed(() => {
  const options = []
  for (let hour = 6; hour <= 22; hour++) {
    options.push({
      title: formatHour(hour),
      value: hour
    })
  }
  return options
})

const durationOptions = [
  { title: '15 minuti', value: 15 },
  { title: '30 minuti', value: 30 },
  { title: '45 minuti', value: 45 },
  { title: '60 minuti', value: 60 }
]

// Computed for preview
const totalSlotsPreview = computed(() => {
  const totalHours = localEndHour.value - localStartHour.value
  const totalMinutes = totalHours * 60
  return Math.floor(totalMinutes / localSlotDuration.value)
})

const totalHoursPreview = computed(() => {
  return localEndHour.value - localStartHour.value
})

// Initialize with current values
const initializeSettings = () => {
  // Get current settings from settings store
  const settingsStore = useSettingsStore()
  const { maxPriorities, startHour, endHour, slotDuration } = storeToRefs(settingsStore)
  
  localMaxPriorities.value = maxPriorities.value
  localStartHour.value = startHour.value
  localEndHour.value = endHour.value
  localSlotDuration.value = slotDuration.value
}

// Watch dialog visibility to initialize
watch(isVisible, (newValue) => {
  if (newValue) {
    initializeSettings()
  }
})

// Helper functions
const formatHour = (hour: number): string => {
  return `${hour.toString().padStart(2, '0')}:00`
}

const incrementPriorities = () => {
  if (localMaxPriorities.value < 10) {
    localMaxPriorities.value++
  }
}

const decrementPriorities = () => {
  if (localMaxPriorities.value > 1) {
    localMaxPriorities.value--
  }
}

const resetToDefaults = () => {
  localMaxPriorities.value = 5
  localStartHour.value = 9
  localEndHour.value = 18
  localSlotDuration.value = 30
}

const saveSettings = () => {
  // Use the settings store for all updates
  const settingsStore = useSettingsStore()
  
  // Update max priorities
  settingsStore.updateMaxPriorities(localMaxPriorities.value)
  
  // Update time grid configuration
  settingsStore.updateTimeGrid({
    startHour: localStartHour.value,
    endHour: localEndHour.value,
    slotDuration: localSlotDuration.value
  })
  
  // Regenerate time slots with new configuration
  timeSlotsStore.generateSlotsForDate(new Date())
  
  close()
  
  // Show success notification
  console.log('⚙️ Settings saved successfully:', {
    maxPriorities: localMaxPriorities.value,
    startHour: localStartHour.value,
    endHour: localEndHour.value,
    slotDuration: localSlotDuration.value
  })
}

const close = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.settings-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.settings-section-title {
  color: rgb(var(--v-theme-primary));
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(var(--v-theme-surface-variant), 0.5);
  border-radius: 8px;
}

.setting-label {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.setting-name {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.setting-description {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface-variant));
  line-height: 1.4;
}

.setting-control {
  flex-shrink: 0;
  min-width: 200px;
}

.setting-item--stacked {
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
}

.setting-item--stacked .setting-label {
  flex: none;
}

.time-controls {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  max-width: 320px;
}

.time-control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 120px;
}

.time-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface-variant));
}

.priority-slider {
  margin-bottom: 1rem;
}

.priority-preview {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.priority-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.priority-chip {
  min-width: 32px;
}

.disabled-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  opacity: 0.4;
}

.priority-info {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background: rgba(var(--v-theme-info), 0.1);
  border-radius: 6px;
  border-left: 3px solid rgb(var(--v-theme-info));
}

.info-text {
  font-size: 0.875rem;
  line-height: 1.4;
}

.hour-select,
.duration-select {
  min-width: 120px;
}

.preview-card {
  background: rgba(var(--v-theme-success), 0.05);
  border-color: rgba(var(--v-theme-success), 0.2);
}

.preview-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.preview-stat {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
}

.schedule-info {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface-variant));
  text-align: center;
  padding: 0.5rem;
  background: rgba(var(--v-theme-surface), 0.8);
  border-radius: 4px;
}

@media (max-width: 600px) {
  .setting-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .setting-control {
    min-width: unset;
  }
  
  .priority-chips {
    justify-content: center;
  }
  
  .time-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .time-control-group {
    min-width: unset;
  }
}
</style>