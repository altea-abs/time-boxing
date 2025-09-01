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
      
      <div class="priority-preview">
        <div class="priority-chips">
          <v-chip
            v-for="n in maxPriorities"
            :key="n"
            size="small"
            color="primary"
            variant="outlined"
            class="priority-chip"
          >
            {{ n }}
          </v-chip>
          <div v-if="maxPriorities < 10" class="disabled-chips">
            <v-chip
              v-for="n in (10 - maxPriorities)"
              :key="n + maxPriorities"
              size="small"
              color="grey"
              variant="outlined"
              disabled
              class="priority-chip"
            >
              {{ n + maxPriorities }}
            </v-chip>
          </div>
        </div>
        <div class="priority-info">
          <v-icon icon="mdi-information" size="small" color="info" class="mr-1" />
          <span class="info-text">
            Potrai selezionare fino a <strong>{{ maxPriorities }}</strong> 
            task come priorità per la giornata
          </span>
        </div>
      </div>
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
  flex-direction: column;
  gap: 1rem;
}

.priority-slider {
  margin-bottom: 0.5rem;
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
  justify-content: center;
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

@media (max-width: 600px) {
  .priority-chips {
    justify-content: center;
  }
}
</style>