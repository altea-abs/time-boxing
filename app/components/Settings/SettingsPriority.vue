<template>
  <div class="settings-priority">
    <div class="setting-label">
      <div class="setting-name">{{ title }}</div>
      <div class="setting-description">{{ description }}</div>
    </div>
    
    <div class="priority-control">
      <v-slider
        :model-value="maxPriorities"
        @update:model-value="updateMaxPriorities"
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
            :disabled="maxPriorities <= 1"
          />
        </template>
        <template v-slot:append>
          <v-btn
            icon="mdi-plus"
            size="small"
            variant="outlined"
            @click="incrementPriorities"
            :disabled="maxPriorities >= 10"
          />
        </template>
      </v-slider>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SettingsPriorityProps {
  title?: string
  description?: string
  maxPriorities: number
}

interface SettingsPriorityEmits {
  (e: 'update:maxPriorities', value: number): void
}

const props = withDefaults(defineProps<SettingsPriorityProps>(), {
  title: 'Numero massimo di priorità',
  description: 'Imposta quante priorità puoi selezionare contemporaneamente'
})

const emit = defineEmits<SettingsPriorityEmits>()

// Event handlers
const updateMaxPriorities = (value: number) => {
  emit('update:maxPriorities', value)
}

const incrementPriorities = () => {
  if (props.maxPriorities < 10) {
    emit('update:maxPriorities', props.maxPriorities + 1)
  }
}

const decrementPriorities = () => {
  if (props.maxPriorities > 1) {
    emit('update:maxPriorities', props.maxPriorities - 1)
  }
}
</script>

<style scoped>
.settings-priority {
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

.priority-control {
  display: flex;
  justify-content: center;
}

.priority-slider {
  min-width: 200px;
  max-width: 300px;
}
</style>