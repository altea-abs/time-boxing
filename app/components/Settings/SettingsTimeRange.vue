<template>
  <div class="settings-time-range">
    <div class="setting-label">
      <div class="setting-name">{{ title }}</div>
      <div class="setting-description">{{ description }}</div>
    </div>
    
    <div class="time-controls">
      <div class="time-control-group">
        <label class="time-label">Inizio</label>
        <v-select
          :model-value="startHour"
          @update:model-value="updateStartHour"
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
          :model-value="endHour"
          @update:model-value="updateEndHour"
          :items="endHourOptions"
          variant="outlined"
          density="compact"
          hide-details
          class="hour-select"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SettingsTimeRangeProps {
  title?: string
  description?: string
  startHour: number
  endHour: number
}

interface SettingsTimeRangeEmits {
  (e: 'update:startHour', value: number): void
  (e: 'update:endHour', value: number): void
}

const props = withDefaults(defineProps<SettingsTimeRangeProps>(), {
  title: 'Orario di inizio e fine',
  description: 'Quando inizia e finisce la tua giornata lavorativa'
})

const emit = defineEmits<SettingsTimeRangeEmits>()

// Generate hour options (6:00 to 22:00)
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

// End hour options (must be greater than start hour)
const endHourOptions = computed(() => {
  return hourOptions.value.filter(option => option.value > props.startHour)
})

// Helper function to format hour
const formatHour = (hour: number): string => {
  return `${hour.toString().padStart(2, '0')}:00`
}

// Event handlers
const updateStartHour = (value: number) => {
  emit('update:startHour', value)
}

const updateEndHour = (value: number) => {
  emit('update:endHour', value)
}
</script>

<style scoped>
.settings-time-range {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: rgba(var(--v-theme-surface-variant), 0.5);
  border-radius: 8px;
}

.setting-label {
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

.hour-select {
  min-width: 120px;
}

@media (max-width: 600px) {
  .time-controls {
    flex-direction: column;
    gap: 1rem;
    max-width: none;
  }
  
  .time-control-group {
    min-width: unset;
  }
}
</style>