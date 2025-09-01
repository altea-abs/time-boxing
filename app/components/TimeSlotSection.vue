<template>
  <div class="time-slot-section">
    <!-- Header con statistiche -->
    <div class="section-header">
      <div class="title-with-navigation">
        <div class="section-title">
          <h2 class="title-text">Time Slot</h2>
          <p class="date-text">{{ formatDate(currentDate) }}</p>
        </div>
        
        <!-- Date Navigation Controls -->
        <div class="date-navigation">
          <v-btn
            icon="mdi-chevron-left"
            variant="text"
            size="small"
            @click="goToPreviousDay"
            title="Giorno precedente"
          />
          <v-btn
            variant="outlined"
            size="small"
            @click="goToToday"
            :disabled="isToday"
            class="today-btn"
          >
            Oggi
          </v-btn>
          <v-btn
            icon="mdi-chevron-right"
            variant="text"
            size="small"
            @click="goToNextDay"
            title="Giorno successivo"
          />
        </div>
      </div>
      
      <!-- Multi-assign mode indicator -->
      <div v-if="isEffectiveMultiAssignMode" class="multi-assign-indicator">
        <div class="multi-assign-banner">
          <div class="multi-assign-content">
            <span class="multi-assign-text">⚡ MODALITÀ MULTI-ASSEGNAZIONE ATTIVA</span>
            <div class="hotkey-display">
              <span class="hotkey-chip">🎹 Ctrl + Trascina (oppure toggle attivo)</span>
              <span class="touched-counter" v-if="touchedSlots.size > 0">
                {{ touchedSlots.size }} slot selezionati
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-row">
        <v-chip color="primary" variant="outlined" size="small" class="mr-2">
          <v-icon icon="mdi-calendar" class="mr-1" size="small" />
          {{ stats.totalSlots }} slot totali
        </v-chip>
        <v-chip color="success" variant="outlined" size="small" class="mr-2">
          <v-icon icon="mdi-check" class="mr-1" size="small" />
          {{ stats.occupiedSlots }} occupati
        </v-chip>
        <v-chip color="warning" variant="outlined" size="small" class="mr-2">
          <v-icon icon="mdi-star" class="mr-1" size="small" />
          {{ stats.priorityTasksScheduled }} priorità
        </v-chip>
        <v-chip color="info" variant="outlined" size="small" class="mr-2">
          <v-icon icon="mdi-clock" class="mr-1" size="small" />
          {{ stats.totalScheduledTime }}min totali
        </v-chip>
        <v-chip color="purple" variant="outlined" size="small" class="mr-2">
          <v-icon icon="mdi-calendar-clock" class="mr-1" size="small" />
          {{ blockedSlotsCount }} bloccati
        </v-chip>
        
        <!-- Multi-assign toggle button -->
        <button 
          @click="toggleMultiAssignMode"
          class="multi-assign-toggle"
          :class="{ 'multi-assign-toggle--active': isMultiAssignMode }"
          title="Attiva/Disattiva modalità Multi-Assegnazione (oppure tieni Ctrl durante drag)"
        >
          <span class="toggle-icon">⚡</span>
          <span class="toggle-text">Multi-Assign</span>
          <span v-if="isMultiAssignMode" class="toggle-status">ON</span>
          <span v-else class="toggle-status">
            <span class="shortcut-hint">Ctrl+Drag</span>
          </span>
        </button>
      </div>
    </div>

    <!-- Griglia dei time slot -->
    <div class="time-slots-grid">
      <div 
        v-for="slot in todaySlots" 
        :key="slot.id"
        class="time-slot"
        :class="{
          'time-slot--occupied': slot.task,
          'time-slot--available': slot.isAvailable && !slot.task,
          'time-slot--unavailable': !slot.isAvailable,
          'time-slot--blocked': !slot.isAvailable && slot.notes?.startsWith('🔒'),
          'time-slot--priority': slot.task?.isPriority,
          'time-slot--drag-over': dragOverSlotId === slot.id,
          'time-slot--adjacent-available': availableAdjacentSlots.includes(slot.id) && draggedTaskId,
          'time-slot--multi-assign-touched': touchedSlots.has(slot.id) && isEffectiveMultiAssignMode
        }"
        :draggable="slot.task ? 'true' : 'false'"
        @dragstart="slot.task ? handleTaskDragStart($event, slot.task) : undefined"
        @dragend="slot.task ? handleTaskDragEnd : undefined"
        @dragover.prevent="handleDragOver($event, slot)"
        @dragenter="handleDragEnter($event, slot)"
        @dragleave="handleDragLeave($event, slot)"
        @drop="handleDrop($event, slot)"
        @click="handleSlotClick(slot)"
      >
        <!-- Time header -->
        <div class="time-slot__header" :style="{ pointerEvents: 'auto' }">
          <span class="time-slot__time">{{ slot.startTime }}</span>
          <v-btn
            v-if="slot.task"
            icon="mdi-close"
            size="x-small"
            variant="text"
            @click.stop="removeTask(slot)"
          />
        </div>

        <!-- Task content -->
        <div 
          v-if="slot.task" 
          class="time-slot__content"
        >
          <div class="task-title">{{ slot.task.text }}</div>
          <div v-if="slot.task.isPriority" class="priority-badge">
            <v-icon icon="mdi-star" size="small" color="warning" />
          </div>
          <div class="drag-indicator-slot">
            <v-icon icon="mdi-drag" size="small" color="grey" class="drag-hint" />
          </div>
        </div>
        
        <!-- Empty slot placeholder -->
        <div v-else class="time-slot__placeholder">
          <v-icon 
            :icon="slot.notes?.startsWith('🔒') ? 'mdi-calendar-clock' : 'mdi-plus'" 
            size="small" 
            :color="slot.isAvailable ? 'grey' : (slot.notes?.startsWith('🔒') ? 'purple' : 'grey-lighten-2')" 
          />
          <span class="placeholder-text">
            {{ 
              slot.isAvailable 
                ? 'Trascina qui un task' 
                : (slot.notes?.startsWith('🔒') ? slot.notes.replace('🔒 ', '') : 'Non disponibile')
            }}
          </span>
        </div>

        <!-- Notes (skip blocked slots to avoid duplication) -->
        <div v-if="slot.notes && !slot.notes.startsWith('🔒')" class="time-slot__notes">
          <v-icon icon="mdi-note-text" size="small" class="mr-1" />
          {{ slot.notes }}
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="todaySlots.length === 0" class="empty-state">
      <v-icon icon="mdi-calendar-blank" size="64" color="grey" />
      <p class="empty-state__text">Nessun time slot disponibile per oggi</p>
      <v-btn @click="generateSlots" color="primary" variant="outlined">
        Genera time slot
      </v-btn>
    </div>

    <!-- Actions footer -->
    <div class="actions-footer">
      <v-btn
        @click="generateSlots"
        color="primary"
        variant="outlined"
        prepend-icon="mdi-refresh"
        size="small"
      >
        Rigenera slot
      </v-btn>
      <v-btn
        @click="clearAllSlots"
        color="error"
        variant="outlined"
        prepend-icon="mdi-delete-sweep"
        size="small"
        class="ml-2"
      >
        Svuota tutto
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TimeSlot, Task } from '~/types'

const timeSlotsStore = useTimeSlotsStore()
const { todaySlots, stats, currentDate, availableDates } = storeToRefs(timeSlotsStore)

// Computed for blocked slots count
const blockedSlotsCount = computed(() => {
  return todaySlots.value.filter(slot => !slot.isAvailable && slot.notes?.startsWith('🔒')).length
})

// Computed to check if current date is today
const isToday = computed(() => {
  const today = new Date()
  const current = currentDate.value
  return today.toDateString() === current.toDateString()
})

// Drag & drop state
const isDragOver = ref(false)
const dragOverSlotId = ref<string | null>(null)
const draggedTaskId = ref<string | null>(null)
const availableAdjacentSlots = ref<string[]>([])

// Multi-assign mode state
const isMultiAssignMode = ref(false)
const isCtrlPressed = ref(false)
const touchedSlots = ref<Set<string>>(new Set())

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const handleDragOver = (event: DragEvent, slot: TimeSlot) => {
  event.preventDefault()
  if (slot.isAvailable && !slot.task) {
    event.dataTransfer!.dropEffect = 'copy'
  }
}

const handleDragEnter = (event: DragEvent, slot: TimeSlot) => {
  event.preventDefault()
  
  // Standard drag over behavior
  if (slot.isAvailable && !slot.task) {
    isDragOver.value = true
    dragOverSlotId.value = slot.id
  }
  
  // Multi-assign mode: track all slots touched
  if (isEffectiveMultiAssignMode.value && slot.isAvailable && !slot.task) {
    touchedSlots.value.add(slot.id)
    console.log('👆 Slot touched in multi-assign mode:', slot.startTime, 'Total:', touchedSlots.value.size)
  }
}

const handleDragLeave = (event: DragEvent, slot: TimeSlot) => {
  event.preventDefault()
  // Check if we're leaving the slot container (not just moving to a child element)
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY
  
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    if (dragOverSlotId.value === slot.id) {
      isDragOver.value = false
      dragOverSlotId.value = null
    }
  }
}

const handleDrop = (event: DragEvent, slot: TimeSlot) => {
  event.preventDefault()
  
  console.log('🎯 Drop initiated on slot:', slot.id, slot.startTime)
  console.log('🎹 Multi-assign mode active:', isMultiAssignMode.value)
  
  const taskData = event.dataTransfer?.getData('application/json')
  console.log('📦 Received task data:', taskData)
  
  if (!taskData) {
    console.warn('❌ No task data received')
    resetDragState()
    return
  }
  
  try {
    const task: Task = JSON.parse(taskData)
    console.log('✅ Parsed task:', task)
    
    if (isEffectiveMultiAssignMode.value && touchedSlots.value.size > 0) {
      // Multi-assign mode: assign to all touched slots
      console.log(`⚡ Multi-assigning to ${touchedSlots.value.size} slots:`, Array.from(touchedSlots.value))
      
      let successCount = 0
      touchedSlots.value.forEach(slotId => {
        const success = timeSlotsStore.assignTaskToSlot(task, slotId)
        if (success) successCount++
      })
      
      // Also assign to the final drop slot if not already in touched slots
      if (!touchedSlots.value.has(slot.id) && slot.isAvailable && !slot.task) {
        const finalSuccess = timeSlotsStore.assignTaskToSlot(task, slot.id)
        if (finalSuccess) successCount++
      }
      
      console.log(`🎉 Multi-assign completed: ${successCount} slots assigned`)
      
    } else {
      // Standard single assignment
      const success = timeSlotsStore.assignTaskToSlot(task, slot.id)
      console.log('🔄 Assignment result:', success)
      
      if (success) {
        console.log(`🎉 Task "${task.text}" successfully assigned to slot ${slot.startTime}`)
      } else {
        console.warn(`❌ Failed to assign task "${task.text}" to slot ${slot.startTime}`)
      }
    }
  } catch (error) {
    console.error('💥 Error parsing dropped task data:', error)
  }
  
  resetDragState()
}

const resetDragState = () => {
  isDragOver.value = false
  dragOverSlotId.value = null
  draggedTaskId.value = null
  availableAdjacentSlots.value = []
  isMultiAssignMode.value = false
  touchedSlots.value.clear()
}

const handleSlotClick = (slot: TimeSlot) => {
  if (slot.task) {
    // TODO: Show task details modal
    console.log('Show task details for:', slot.task)
  } else if (slot.isAvailable) {
    // TODO: Show assign task modal
    console.log('Show assign task modal for slot:', slot.id)
  }
}

const removeTask = (slot: TimeSlot) => {
  if (slot.task) {
    timeSlotsStore.removeTaskFromSlot(slot.id)
  }
}

const generateSlots = () => {
  timeSlotsStore.generateSlotsForDate(currentDate.value)
}

const clearAllSlots = () => {
  timeSlotsStore.clearAllSlots()
}

// Navigation functions
const goToPreviousDay = () => {
  timeSlotsStore.goToPreviousDay()
}

const goToNextDay = () => {
  timeSlotsStore.goToNextDay()
}

const goToToday = () => {
  timeSlotsStore.goToToday()
}

const toggleMultiAssignMode = () => {
  isMultiAssignMode.value = !isMultiAssignMode.value
  touchedSlots.value.clear()
  
  console.log('🎯 Multi-assign mode toggled:', isMultiAssignMode.value ? 'ON' : 'OFF')
  
  if (isMultiAssignMode.value) {
    console.log('⚡ Multi-assign mode is now ACTIVE - drag tasks through multiple slots!')
  } else {
    console.log('🔒 Multi-assign mode is now DISABLED - normal single slot assignment')
  }
}

const handleTaskDragStart = (event: DragEvent, task: Task) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/json', JSON.stringify(task))
    event.dataTransfer.effectAllowed = 'copy'
    
    // Set dragged task and find available adjacent slots
    draggedTaskId.value = task.id
    const adjacent = timeSlotsStore.getAvailableAdjacentSlots(task.id)
    availableAdjacentSlots.value = adjacent.map(slot => slot.id)
    
    // Clear touched slots if in multi-assign mode
    if (isEffectiveMultiAssignMode.value) {
      touchedSlots.value.clear()
      console.log('⚡ Multi-assign mode is ACTIVE - tracking slots')
    }
    
    console.log('🎯 Dragging task from slot:', task.text)
    console.log('🔍 Available adjacent slots:', availableAdjacentSlots.value.length)
    console.log('🎹 Multi-assign mode:', isMultiAssignMode.value ? 'ON' : 'OFF')
  }
}

const handleTaskDragEnd = () => {
  // Reset drag state when drag operation ends
  draggedTaskId.value = null
  availableAdjacentSlots.value = []
  isMultiAssignMode.value = false
  touchedSlots.value.clear()
  console.log('🏁 Drag operation ended, reset adjacent slots highlighting')
}

// Keyboard listeners for Ctrl+Drag
const handleKeyDown = (event: KeyboardEvent) => {
  if ((event.key === 'Control' || event.key === 'Meta') && !isCtrlPressed.value) {
    isCtrlPressed.value = true
    console.log('🎹 Ctrl key pressed - ready for multi-assign on next drag')
  }
}

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.key === 'Control' || event.key === 'Meta') {
    isCtrlPressed.value = false
    console.log('🎹 Ctrl key released')
  }
}

// Computed property for effective multi-assign mode
const isEffectiveMultiAssignMode = computed(() => {
  return isMultiAssignMode.value || isCtrlPressed.value
})

// Handle Ctrl+Drag from brain dump
const handleCtrlDragStart = (event: CustomEvent) => {
  console.log('🎯 Ctrl+Drag event received from brain dump:', event.detail)
  touchedSlots.value.clear()
  console.log('⚡ Temporary multi-assign mode activated via Ctrl+Drag')
}

// Reset multi-assign mode when drag ends
const handleDragEndGlobal = () => {
  console.log('🏁 Drag ended - resetting temporary states')
  touchedSlots.value.clear()
}

// Add/remove event listeners
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('ctrlDragStart', handleCtrlDragStart as EventListener)
  window.addEventListener('dragend', handleDragEndGlobal)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  window.removeEventListener('ctrlDragStart', handleCtrlDragStart as EventListener)
  window.removeEventListener('dragend', handleDragEndGlobal)
})
</script>

<style scoped>
.time-slot-section {
  padding: 1rem;
  height: 100%;
}

.section-header {
  margin-bottom: 1.5rem;
}

.title-with-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.section-title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.title-text {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0;
  color: rgb(var(--v-theme-on-surface));
}

.date-text {
  font-size: 0.875rem;
  font-weight: 400;
  margin: 0.25rem 0 0 0;
  color: rgb(var(--v-theme-on-surface-variant));
}

.date-navigation {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.today-btn {
  min-width: 60px;
}

.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.time-slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.time-slot {
  background: rgb(var(--v-theme-surface-variant));
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 0.75rem;
  min-height: 80px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.time-slot:hover {
  border-color: rgba(var(--v-theme-primary), 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.time-slot--available {
  border-color: rgba(var(--v-theme-success), 0.2);
  background: rgba(var(--v-theme-success), 0.05);
}

.time-slot--occupied {
  border-color: rgba(var(--v-theme-primary), 0.3);
  background: rgba(var(--v-theme-primary), 0.08);
}

.time-slot--unavailable {
  border-color: rgba(var(--v-theme-error), 0.2);
  background: rgba(var(--v-theme-error), 0.05);
  opacity: 0.6;
  cursor: not-allowed;
}

.time-slot--blocked {
  border-color: rgba(var(--v-theme-purple), 0.4) !important;
  background: rgba(var(--v-theme-purple), 0.08) !important;
  opacity: 0.8;
  cursor: not-allowed;
  position: relative;
}

.time-slot--blocked::before {
  content: '';
  position: absolute;
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  background: rgba(var(--v-theme-purple), 0.8);
  border-radius: 50%;
}

.time-slot--blocked .placeholder-text {
  color: rgba(var(--v-theme-purple), 1) !important;
  font-weight: 500;
}

.time-slot--priority {
  border-color: rgba(var(--v-theme-warning), 0.4);
  background: rgba(var(--v-theme-warning), 0.1);
}

.time-slot--drag-over {
  border-color: rgba(var(--v-theme-primary), 0.6) !important;
  background: rgba(var(--v-theme-primary), 0.15) !important;
  transform: scale(1.02);
  box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.3);
}

.time-slot--adjacent-available {
  border-color: rgba(var(--v-theme-success), 0.5) !important;
  background: rgba(var(--v-theme-success), 0.08) !important;
  box-shadow: 0 2px 8px rgba(var(--v-theme-success), 0.2);
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(var(--v-theme-success), 0.2);
  }
  50% {
    box-shadow: 0 4px 16px rgba(var(--v-theme-success), 0.4);
  }
}

.time-slot--multi-assign-touched {
  border-color: rgba(var(--v-theme-info), 0.6) !important;
  background: rgba(var(--v-theme-info), 0.12) !important;
  transform: scale(1.02);
  animation: pulse-blue 1.5s infinite;
}

@keyframes pulse-blue {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(var(--v-theme-info), 0.3);
  }
  50% {
    box-shadow: 0 4px 16px rgba(var(--v-theme-info), 0.5);
  }
}

/* Multi-assign indicator styles */
.multi-assign-indicator {
  margin-bottom: 1rem;
  animation: slideInFromTop 0.3s ease-out;
}

@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.multi-assign-banner {
  background: linear-gradient(135deg, #2196F3, #1976D2);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #FFC107;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }
  50% {
    box-shadow: 0 6px 20px rgba(33, 150, 243, 0.5);
  }
}

.multi-assign-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.multi-assign-text {
  font-weight: 700;
  font-size: 1.1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.hotkey-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.hotkey-chip {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.touched-counter {
  font-size: 0.75rem;
  background: rgba(255, 193, 7, 0.9);
  color: #000;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
}

/* Multi-assign toggle button */
.multi-assign-toggle {
  background: rgba(var(--v-theme-surface), 0.9);
  border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 20px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface-variant));
}

.multi-assign-toggle:hover {
  background: rgba(var(--v-theme-primary), 0.1);
  border-color: rgba(var(--v-theme-primary), 0.3);
  transform: translateY(-1px);
}

.multi-assign-toggle--active {
  background: linear-gradient(135deg, #2196F3, #1976D2);
  border-color: #1976D2;
  color: white;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  animation: pulse-active 2s infinite;
}

@keyframes pulse-active {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }
  50% {
    box-shadow: 0 6px 20px rgba(33, 150, 243, 0.5);
  }
}

.toggle-icon {
  font-size: 1rem;
}

.toggle-text {
  font-weight: 600;
}

.toggle-status {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.15rem 0.4rem;
  border-radius: 8px;
  font-size: 0.65rem;
  font-weight: 700;
}

.multi-assign-toggle--active .toggle-status {
  background: rgba(255, 255, 255, 0.3);
  color: #FFC107;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.shortcut-hint {
  font-size: 0.6rem;
  opacity: 0.8;
}

.key {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 3px;
  padding: 0.1rem 0.3rem;
  font-size: 0.65rem;
  font-family: monospace;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.time-slot__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.time-slot__time {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

.time-slot__content {
  position: relative;
  user-select: none;
  transition: transform 0.2s ease;
  pointer-events: none; /* Prevent child elements from interfering with drag */
}

.time-slot--occupied {
  cursor: grab;
}

.time-slot--occupied:active {
  cursor: grabbing;
}

.time-slot--occupied:hover .time-slot__content {
  transform: translateY(-1px);
}

.drag-indicator-slot {
  position: absolute;
  top: 2px;
  right: 2px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.time-slot--occupied:hover .drag-indicator-slot {
  opacity: 0.6;
}

.drag-hint {
  font-size: 0.7rem;
}

.task-title {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.2;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 0.25rem;
}

.priority-badge {
  position: absolute;
  top: -4px;
  right: -4px;
}

.time-slot__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  opacity: 0.6;
  min-height: 40px;
}

.placeholder-text {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: rgb(var(--v-theme-on-surface-variant));
}

.time-slot__notes {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface-variant));
  display: flex;
  align-items: center;
  font-style: italic;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: rgb(var(--v-theme-on-surface-variant));
}

.empty-state__text {
  margin: 1rem 0;
  font-size: 1rem;
}

.actions-footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

@media (max-width: 600px) {
  .time-slots-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-row {
    justify-content: center;
  }
  
  .actions-footer {
    justify-content: center;
  }
  
  .title-with-navigation {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
  
  .title-text {
    font-size: 1.1rem;
  }
  
  .date-navigation {
    justify-content: center;
  }
}
</style>