<template>
  <div class="priority-section">
    <h2 class="section-title">{{ priorityLabelText }}</h2>
    <div class="priority-slots">
      <div
        v-for="(priority, index) in priorities"
        :key="index"
        class="priority-slot"
        :class="{ 
          'priority-filled': priority !== null,
          'drag-over': dragOverIndex === index,
          'drag-source': dragSourceIndex === index
        }"
        @dragover.prevent="handleDragOver(index)"
        @dragenter.prevent="handleDragEnter(index)"
        @dragleave="handleDragLeave"
        @drop="handleDrop($event, index)"
      >
        <div class="priority-number">{{ index + 1 }}</div>
        <div class="priority-content">
          <div 
            v-if="priority" 
            class="priority-task"
            draggable="true"
            @dragstart="handleDragStart($event, priority, index)"
            @dragend="handleDragEnd"
          >
            <div class="priority-task-content">
              <v-icon 
                icon="mdi-drag" 
                size="small" 
                color="grey" 
                class="drag-indicator mr-2" 
              />
              <span class="priority-text">{{ priority.text }}</span>
            </div>
            <button
              @click.stop="removePriority(index)"
              class="priority-remove-button"
              aria-label="Rimuovi priorità"
            >
              ×
            </button>
          </div>
          <div v-else class="priority-empty">
            <span class="priority-placeholder">Seleziona un task dal brain dump</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task, PriorityEmits } from '~/types'

const emit = defineEmits<PriorityEmits>()

// Use the priorities store
const prioritiesStore = usePrioritiesStore()
const { priorities, showMaxAlert, priorityLabelText } = storeToRefs(prioritiesStore)

// Drag and drop state
const dragSourceIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const removePriority = (index: number) => {
  const task = priorities.value[index]
  if (task) {
    prioritiesStore.removeByIndex(index)
    emit('priorityRemoved', task)
  }
}

const handleDragStart = (event: DragEvent, task: Task, sourceIndex: number) => {
  if (event.dataTransfer) {
    // Set data for external drops (time slots)
    event.dataTransfer.setData('application/json', JSON.stringify(task))
    event.dataTransfer.effectAllowed = 'copyMove'
    
    // Set source index for internal reordering
    dragSourceIndex.value = sourceIndex
  }
}

const handleDragOver = (index: number) => {
  dragOverIndex.value = index
}

const handleDragEnter = (index: number) => {
  dragOverIndex.value = index
}

const handleDragLeave = () => {
  // Only clear if we're actually leaving the slots area
  setTimeout(() => {
    if (dragOverIndex.value !== null) {
      const isOverSlot = document.querySelector('.priority-slot:hover')
      if (!isOverSlot) {
        dragOverIndex.value = null
      }
    }
  }, 50)
}

const handleDrop = (event: DragEvent, targetIndex: number) => {
  event.preventDefault()
  
  // Handle internal reordering
  if (dragSourceIndex.value !== null && dragSourceIndex.value !== targetIndex) {
    const success = prioritiesStore.reorder(dragSourceIndex.value, targetIndex)
    if (success) {
      console.log(`Priority reordered from ${dragSourceIndex.value + 1} to ${targetIndex + 1}`)
    }
  }
  
  // Reset drag state
  dragSourceIndex.value = null
  dragOverIndex.value = null
}

const handleDragEnd = () => {
  // Reset drag state
  dragSourceIndex.value = null
  dragOverIndex.value = null
}
</script>

<style scoped>
.priority-section {
  margin-bottom: 2rem;
}

.section-title {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.priority-slots {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.priority-slot {
  display: flex;
  align-items: center;
  min-height: 60px;
  border: 2px dashed rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  padding: 0.75rem;
  transition: all 0.2s ease;
}

.priority-slot.drag-over {
  border-color: rgb(var(--v-theme-primary));
  border-style: solid;
  background-color: rgba(var(--v-theme-primary), 0.15);
  transform: scale(1.02);
}

.priority-slot.drag-source {
  opacity: 0.5;
  transform: scale(0.98);
}

.priority-filled {
  border-color: rgb(var(--v-theme-primary));
  border-style: solid;
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.priority-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.9rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.priority-content {
  flex: 1;
}

.priority-task {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: grab;
  user-select: none;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.priority-task:hover {
  background-color: rgba(33, 150, 243, 0.1);
}

.priority-task:active {
  cursor: grabbing;
}

.priority-task-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.drag-indicator {
  opacity: 0.4;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.priority-task:hover .drag-indicator {
  opacity: 0.8;
}

.priority-text {
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
  word-break: break-word;
}

.priority-remove-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: rgb(var(--v-theme-on-surface-variant));
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
  line-height: 1;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.priority-remove-button:hover {
  color: rgb(var(--v-theme-error));
}

.priority-empty {
  color: rgb(var(--v-theme-on-surface-variant));
  font-style: italic;
}

.priority-placeholder {
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .priority-slot {
    min-height: 50px;
    padding: 0.5rem;
  }
  
  .priority-number {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
    margin-right: 0.75rem;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
  
  .priority-placeholder {
    font-size: 0.8rem;
  }
}
</style>