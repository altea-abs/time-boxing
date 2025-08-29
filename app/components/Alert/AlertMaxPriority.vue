<template>
  <v-alert
    v-if="visible"
    type="error"
    color="error"
    closable
    @click:close="handleClose"
    class="alert-max-priority"
  >
    <template #title>
      <strong>Attenzione!</strong>
    </template>
    Puoi selezionare massimo {{ maxPriorities }} priorità!
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
}

.alert-max-priority :deep(.v-alert__title) {
  margin-bottom: 0.25rem;
}
</style>