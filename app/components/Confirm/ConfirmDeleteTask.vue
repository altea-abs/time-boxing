<template>
  <v-dialog 
    v-model="showDialog" 
    max-width="500" 
    persistent
  >
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">
        <v-icon icon="mdi-alert" color="warning" class="mr-2"></v-icon>
        Conferma cancellazione task
      </v-card-title>
      
      <v-card-text class="pb-4">
        <p class="mb-3">
          Stai per cancellare il task: 
          <strong>"{{ taskText }}"</strong>
        </p>
        
        <div v-if="hasTimeSlotAssignments" class="warning-section">
          <v-alert 
            type="warning" 
            variant="tonal" 
            class="mb-3"
          >
            <div class="alert-content">
              <p class="font-weight-medium mb-2">
                ⚠️ Questo task è assegnato a {{ assignmentCount }} slot temporali:
              </p>
              <ul class="assignment-list">
                <li v-for="assignment in assignments" :key="assignment.slotId">
                  {{ assignment.startTime }} - {{ assignment.endTime }}
                </li>
              </ul>
            </div>
          </v-alert>
          
          <p class="text-body-2 mb-0">
            Se confermi, il task verrà rimosso sia dal brain dump che da tutti gli slot temporali.
          </p>
        </div>
        
        <p v-else class="text-body-2">
          Il task verrà rimosso definitivamente dal brain dump.
        </p>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn 
          variant="text" 
          @click="handleCancel"
        >
          Annulla
        </v-btn>
        <v-btn 
          color="error" 
          variant="elevated"
          @click="handleConfirm"
        >
          {{ hasTimeSlotAssignments ? 'Elimina comunque' : 'Elimina' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Task } from '~/types'

interface Props {
  visible: boolean
  task: Task | null
  assignments: Array<{
    slotId: string
    startTime: string
    endTime: string
  }>
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showDialog = computed({
  get: () => props.visible,
  set: (value: boolean) => {
    if (!value) {
      emit('cancel')
    }
  }
})

const taskText = computed(() => props.task?.text || '')

const hasTimeSlotAssignments = computed(() => 
  props.assignments && props.assignments.length > 0
)

const assignmentCount = computed(() => 
  props.assignments?.length || 0
)

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.warning-section {
  border-left: 4px solid rgb(var(--v-theme-warning));
  padding-left: 1rem;
  margin-left: 0.5rem;
}

.alert-content {
  font-size: 0.9rem;
}

.assignment-list {
  margin: 0;
  padding-left: 1.5rem;
  font-family: 'Roboto Mono', monospace;
  font-size: 0.85rem;
}

.assignment-list li {
  margin-bottom: 0.25rem;
}

.text-h6 {
  color: rgb(var(--v-theme-on-surface));
}
</style>