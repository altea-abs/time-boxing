<template>
  <div class="settings-slot-duration">
    <div class="setting-label">
      <div class="setting-name">{{ title }}</div>
      <div class="setting-description">{{ description }}</div>
    </div>
    
    <div class="duration-control">
      <v-select
        :model-value="slotDuration"
        @update:model-value="updateSlotDuration"
        :items="durationOptions"
        variant="outlined"
        density="compact"
        hide-details
        class="duration-select"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface SettingsSlotDurationProps {
  title?: string
  description?: string
  slotDuration: number
}

interface SettingsSlotDurationEmits {
  (e: 'update:slotDuration', value: number): void
}

withDefaults(defineProps<SettingsSlotDurationProps>(), {
  title: 'Durata slot',
  description: 'Durata di ogni time slot in minuti'
})

const emit = defineEmits<SettingsSlotDurationEmits>()

// Duration options
const durationOptions = [
  { title: '15 minuti', value: 15 },
  { title: '30 minuti', value: 30 },
  { title: '45 minuti', value: 45 },
  { title: '60 minuti', value: 60 }
]

// Event handler
const updateSlotDuration = (value: number) => {
  emit('update:slotDuration', value)
}
</script>

<style scoped>
.settings-slot-duration {
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
  text-align: center;
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

.duration-control {
  display: flex;
  justify-content: center;
}

.duration-select {
  min-width: 180px;
  max-width: 200px;
}
</style>