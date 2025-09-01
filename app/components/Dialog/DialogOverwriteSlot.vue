<template>
  <v-dialog 
    v-model="showDialog" 
    max-width="520" 
    persistent
    @keydown.esc="handleCancel"
    @keydown.enter="handleConfirm"
  >
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">
        <v-icon icon="mdi-alert" color="warning" class="mr-2" />
        Sovrascrivere lo slot?
      </v-card-title>

      <v-card-text class="pb-4">
        <div class="mb-3">
          <p class="mb-1">
            Lo slot <strong>{{ slotTime }}</strong> contiene già:
          </p>
          <v-alert type="info" variant="tonal" class="mb-3">
            <div class="alert-content">
              <v-icon icon="mdi-clipboard-text" size="small" class="mr-1" />
              <span class="font-weight-medium">{{ currentTaskText }}</span>
            </div>
          </v-alert>
          <p class="mb-1">Vuoi sovrascriverlo con:</p>
          <v-alert type="warning" variant="tonal">
            <div class="alert-content">
              <v-icon icon="mdi-swap-horizontal" size="small" class="mr-1" />
              <span class="font-weight-medium">{{ newTaskText }}</span>
            </div>
          </v-alert>
        </div>
        <p class="text-body-2 mb-0">
          L'azione rimuove il task esistente dallo slot e assegna quello nuovo.
        </p>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="handleCancel">Annulla</v-btn>
        <v-btn v-if="canSwap" color="primary" variant="elevated" @click="handleSwap">Scambia</v-btn>
        <v-btn color="warning" variant="elevated" @click="handleConfirm">Sovrascrivi</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  
</template>

<script setup lang="ts">
import type { Task, TimeSlot } from '~/types'

interface Props {
  visible: boolean
  targetSlot: TimeSlot | null
  newTask: Task | null
  canSwap?: boolean
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'swap'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showDialog = computed({
  get: () => props.visible,
  set: (value: boolean) => {
    if (!value) emit('cancel')
  }
})

const slotTime = computed(() => {
  if (!props.targetSlot) return ''
  return `${props.targetSlot.startTime} - ${props.targetSlot.endTime}`
})

const currentTaskText = computed(() => props.targetSlot?.task?.text || '—')
const newTaskText = computed(() => props.newTask?.text || '—')
const canSwap = computed(() => props.canSwap === true)

const handleConfirm = () => emit('confirm')
const handleCancel = () => emit('cancel')
const handleSwap = () => emit('swap')
</script>

<style scoped>
.alert-content {
  display: flex;
  align-items: center;
}
</style>
