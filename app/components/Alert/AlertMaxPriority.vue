<template>
  <v-alert
    v-if="visible"
    type="error"
    color="error"
    closable
    @click:close="handleClose"
    class="alert-max-priority"
    density="compact"
  >
    Massimo {{ maxPriorities }} priorità selezionabili!
  </v-alert>
</template>

<script setup lang="ts">
import type { AlertProps } from '~/types'

interface AlertMaxPriorityEmits {
  close: []
}

// Use the priorities store to get config values
const prioritiesStore = usePrioritiesStore()
const { maxPriorities } = storeToRefs(prioritiesStore)

const props = withDefaults(defineProps<AlertProps>(), {
  autoHide: true,
  autoHideDelay: 5000
})

const emit = defineEmits<AlertMaxPriorityEmits>()

let timeoutId: NodeJS.Timeout | null = null

const handleClose = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  emit('close')
}

watch(() => props.visible, (newVisible) => {
  if (newVisible && props.autoHide) {
    timeoutId = setTimeout(() => {
      handleClose()
    }, props.autoHideDelay)
  } else if (!newVisible && timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
})

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>

<style scoped>
.alert-max-priority {
  margin-bottom: 1rem;
  border-radius: 8px;
}

.alert-max-priority :deep(.v-alert__content) {
  font-weight: 500;
  font-size: 0.9rem;
}

.alert-max-priority :deep(.v-alert__close .v-btn) {
  color: rgb(var(--v-theme-on-surface-variant)) !important;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.alert-max-priority :deep(.v-alert__close .v-btn:hover) {
  color: rgb(var(--v-theme-on-surface)) !important;
  opacity: 1;
}
</style>