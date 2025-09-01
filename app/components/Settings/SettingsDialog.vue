<template>
  <v-dialog v-model="isVisible" max-width="800" @keydown.esc="close">
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
          
          <div class="settings-columns">
            <!-- Left Column: Priority Settings -->
            <div class="settings-column">
              <div class="settings-section">
                <h3 class="settings-section-title">
                  <v-icon icon="mdi-star" class="mr-2" color="warning" />
                  Gestione Priorità
                </h3>
                
                <SettingsPriority
                  :max-priorities="localMaxPriorities"
                  @update:max-priorities="localMaxPriorities = $event"
                />
              </div>
            </div>

            <!-- Right Column: Time Grid Settings -->
            <div class="settings-column">
              <div class="settings-section">
                <h3 class="settings-section-title">
                  <v-icon icon="mdi-clock-outline" class="mr-2" color="info" />
                  Orari di Lavoro
                </h3>
                
                <SettingsTimeRange
                  :start-hour="localStartHour"
                  :end-hour="localEndHour"
                  @update:start-hour="localStartHour = $event"
                  @update:end-hour="localEndHour = $event"
                />

                <SettingsSlotDuration
                  :slot-duration="localSlotDuration"
                  @update:slot-duration="localSlotDuration = $event"
                />
              </div>
            </div>
          </div>

          <!-- Blocked Slots Section (Full Width) -->
          <div class="settings-section">
            <h3 class="settings-section-title">
              <v-icon icon="mdi-calendar-clock" class="mr-2" color="purple" />
              Slot Bloccati
            </h3>
            
            <SettingsBlockedSlots />
          </div>

          <!-- Preview Section (Full Width) -->
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
                  <div class="preview-stat">
                    <v-icon icon="mdi-calendar-clock" color="purple" class="mr-1" />
                    <strong>{{ blockedSlotsCount }}</strong> slot bloccati attivi
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
      
      <v-card-actions class="settings-actions">
        <v-btn
          color="grey"
          variant="outlined"
          @click="resetToDefaults"
          prepend-icon="mdi-restore"
          class="reset-btn"
        >
          Ripristina Default
        </v-btn>
        <div class="action-buttons">
          <v-btn
            color="grey"
            variant="text"
            @click="close"
            class="cancel-btn"
          >
            Annulla
          </v-btn>
          <v-btn
            color="primary"
            @click="saveSettings"
            prepend-icon="mdi-content-save"
            class="save-btn"
          >
            Salva Modifiche
          </v-btn>
        </div>
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
const timeSlotsStore = useTimeSlotsStore()
const settingsStore = useSettingsStore()
const { blockedSlots } = storeToRefs(settingsStore)

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

// Computed for preview
const totalSlotsPreview = computed(() => {
  const totalHours = localEndHour.value - localStartHour.value
  const totalMinutes = totalHours * 60
  return Math.floor(totalMinutes / localSlotDuration.value)
})

const totalHoursPreview = computed(() => {
  return localEndHour.value - localStartHour.value
})

const blockedSlotsCount = computed(() => {
  return blockedSlots.value.filter(slot => slot.enabled).length
})

// Initialize with current values
const initializeSettings = () => {
  // Force reactivity by using nextTick to ensure store is fully initialized
  nextTick(() => {
    const store = useSettingsStore()
    const { maxPriorities, startHour, endHour, slotDuration } = storeToRefs(store)
    
    localMaxPriorities.value = maxPriorities.value
    localStartHour.value = startHour.value
    localEndHour.value = endHour.value
    localSlotDuration.value = slotDuration.value
  })
}

// Watch dialog visibility to initialize
watch(isVisible, (newValue) => {
  if (newValue) {
    initializeSettings()
  }
})

const formatHour = (hour: number): string => {
  return `${hour.toString().padStart(2, '0')}:00`
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
  timeSlotsStore.regenerateCurrentSlots()
  
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

.settings-columns {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.settings-column {
  flex: 1;
  display: flex;
  flex-direction: column;
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

.settings-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

@media (max-width: 768px) {
  .settings-columns {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .settings-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .reset-btn,
  .cancel-btn,
  .save-btn {
    width: 100%;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>