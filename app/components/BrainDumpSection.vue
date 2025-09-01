<template>
  <div class="brain-dump-section">
    <PrioritySection 
      @priority-removed="handlePriorityRemoved"
    />
    
    <div class="brain-dump-container">
      <h2 class="section-title">Brain Dump</h2>
      
      <AlertMaxPriority 
        :visible="showMaxAlert"
        @close="hideAlert"
      />
      
      <TaskInput @task-added="handleTaskAdded" />
    
      <div class="task-list" v-if="tasks.length > 0">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="task-item"
          :class="{ 'task-selected': isTaskPriority(task) }"
          draggable="true"
          @dragstart="handleTaskDragStart($event, task)"
          @click="togglePriority(task)"
        >
          <div class="task-content">
            <v-icon 
              icon="mdi-drag" 
              size="small" 
              color="grey" 
              class="drag-indicator mr-2" 
            />
            <span class="task-text">{{ task.text }}</span>
          </div>
          <button
            @click.stop="removeTask(task.id)"
            class="task-remove-button"
            aria-label="Rimuovi task"
          >
            ×
          </button>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <p>Nessun task nel brain dump.</p>
        <p class="empty-state-hint">Inizia aggiungendo tutti i tuoi pensieri e task!</p>
      </div>
    </div>

    <!-- Sezione note -->
    <NotesSection />
    
    <!-- Dialog di conferma cancellazione -->
    <ConfirmDeleteTask
      :visible="showDeleteConfirm"
      :task="taskToDelete"
      :assignments="taskAssignments"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import type { Task, BrainDumpEmits } from '~/types'

const emit = defineEmits<BrainDumpEmits>()

// Use all stores
const tasksStore = useTasksStore()
const prioritiesStore = usePrioritiesStore()
const timeSlotsStore = useTimeSlotsStore()

// Extract reactive references from stores
const { tasks } = storeToRefs(tasksStore)
const { showMaxAlert } = storeToRefs(prioritiesStore)

// Delete confirmation state
const showDeleteConfirm = ref(false)
const taskToDelete = ref<Task | null>(null)
const taskAssignments = ref<Array<{
  slotId: string
  startTime: string
  endTime: string
}>>([]);

const handleTaskAdded = (taskText: string) => {
  const newTask = tasksStore.addTask(taskText)
  emit('priorityToggled', newTask)
}

const handlePriorityRemoved = (task: Task) => {
  // Rimuovi dalle priorità e aggiorna il task nel task store
  prioritiesStore.remove(task)
  tasksStore.updateTask(task.id, { isPriority: false })
  emit('priorityToggled', task)
}

const removeTask = (taskId: string) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (!task) return
  
  // Check se il task è assegnato a time slots
  const assignments = timeSlotsStore.uniqueAssignedTasks
    .find(assigned => assigned.task.id === taskId)
    ?.slots || []
  
  if (assignments.length > 0) {
    // Task assegnato - richiede conferma
    taskToDelete.value = task
    taskAssignments.value = assignments
    showDeleteConfirm.value = true
  } else {
    // Task non assegnato - cancella direttamente
    performTaskDeletion(task)
  }
}

const confirmDelete = () => {
  if (taskToDelete.value) {
    performTaskDeletion(taskToDelete.value)
  }
  cancelDelete()
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  taskToDelete.value = null
  taskAssignments.value = []
}

const performTaskDeletion = (task: Task) => {
  // Rimuovi dalle priorità se presente
  prioritiesStore.remove(task)
  
  // Rimuovi da tutti i time slots
  timeSlotsStore.removeTaskFromAllSlots(task.id)
  
  // Rimuovi dal task store
  tasksStore.removeTask(task.id)
}

const togglePriority = (task: Task) => {
  if (task.isPriority) {
    // Rimuovi dalle priorità
    const success = prioritiesStore.remove(task)
    if (success) {
      tasksStore.updateTask(task.id, { isPriority: false })
      emit('priorityToggled', task)
    }
  } else {
    // Aggiungi alle priorità
    const success = prioritiesStore.add(task)
    if (success) {
      tasksStore.updateTask(task.id, { isPriority: true })
      emit('priorityToggled', task)
    }
    // L'alert viene gestito automaticamente dal priority store
  }
}

const hideAlert = () => {
  prioritiesStore.hideAlert()
}

// Computed per controllare se un task è priorità
const isTaskPriority = (task: Task) => {
  return prioritiesStore.findTaskById(task.id) !== null
}

const handleTaskDragStart = (event: DragEvent, task: Task) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/json', JSON.stringify(task))
    event.dataTransfer.effectAllowed = 'copy'
    
    console.log('🎯 Dragging task from brain dump:', task.text)
    console.log('🎹 Ctrl key pressed during brain dump drag:', event.ctrlKey || event.metaKey)
    
    // Notify TimeSlotSection about Ctrl+Drag
    if (event.ctrlKey || event.metaKey) {
      const multiAssignEvent = new CustomEvent('ctrlDragStart', {
        detail: { task, ctrlPressed: true }
      })
      window.dispatchEvent(multiAssignEvent)
      console.log('⚡ Ctrl+Drag event dispatched from brain dump')
    }
  }
}
</script>

<style scoped>
.brain-dump-section {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.brain-dump-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.section-title {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.task-list {
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background-color: rgb(var(--v-theme-surface-variant));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
  cursor: grab;
  transition: all 0.2s ease;
  user-select: none;
}

.task-item:active {
  cursor: grabbing;
}

.task-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.drag-indicator {
  opacity: 0.4;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.task-item:hover .drag-indicator {
  opacity: 0.8;
}

.task-item:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.04);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.task-selected {
  background-color: rgba(var(--v-theme-primary), 0.1);
  border-color: rgb(var(--v-theme-primary));
}

.task-selected:hover {
  background-color: rgba(var(--v-theme-primary), 0.15);
}

.task-text {
  flex: 1;
  word-break: break-word;
  color: rgb(var(--v-theme-on-surface));
}

.task-remove-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: rgb(var(--v-theme-on-surface-variant));
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
  line-height: 1;
  transition: color 0.2s ease;
}

.task-remove-button:hover {
  color: rgb(var(--v-theme-error));
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: rgb(var(--v-theme-on-surface-variant));
}

.empty-state-hint {
  font-size: 0.9rem;
  margin-top: 0.5rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .task-list {
    max-height: 300px;
  }
  
  .task-item {
    padding: 0.5rem;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
}
</style>