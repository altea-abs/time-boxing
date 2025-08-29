<template>
  <div class="assigned-tasks-section">
    <!-- Header -->
    <div class="section-header">
      <h3 class="section-title">
        <v-icon icon="mdi-calendar-check" class="mr-2" />
        Task Assegnati ({{ uniqueAssignedTasks.length }} task, {{ totalAssignedSlots }} slot)
      </h3>
    </div>

    <!-- Task assegnati list -->
    <div v-if="uniqueAssignedTasks.length > 0" class="assigned-tasks-list">
      <div
        v-for="taskGroup in uniqueAssignedTasks"
        :key="taskGroup.task.id"
        class="assigned-task-group"
        :class="{ 'assigned-task--priority': taskGroup.task.isPriority }"
      >
        <!-- Task header -->
        <div class="task-header">
          <div class="task-content">
            <div class="task-text">{{ taskGroup.task.text }}</div>
            <div v-if="taskGroup.task.isPriority" class="priority-badge">
              <v-icon icon="mdi-star" size="small" color="warning" />
              <span class="priority-label">Priorità</span>
            </div>
          </div>
          <div class="task-stats">
            <v-chip size="small" variant="outlined" color="primary">
              {{ taskGroup.slots.length }} slot ({{ taskGroup.slots.length * 30 }}min)
            </v-chip>
          </div>
        </div>

        <!-- Time slots list -->
        <div class="time-slots-list">
          <div
            v-for="slot in taskGroup.slots"
            :key="slot.slotId"
            class="time-slot-item"
          >
            <div class="time-info">
              <span class="time-range">{{ slot.startTime }} - {{ slot.endTime }}</span>
            </div>
            <v-btn
              icon="mdi-close"
              size="x-small"
              variant="text"
              color="error"
              @click="removeAssignment(slot.slotId)"
              :title="`Rimuovi slot ${slot.startTime}`"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <v-icon icon="mdi-calendar-outline" size="48" color="grey" />
      <p class="empty-text">Nessun task assegnato</p>
      <p class="empty-hint">Trascina i task negli slot temporali per programmare la tua giornata</p>
    </div>

    <!-- Summary -->
    <div v-if="assignedTasks.length > 0" class="summary">
      <v-chip color="primary" variant="outlined" size="small" class="mr-2">
        <v-icon icon="mdi-clock" class="mr-1" size="small" />
        {{ totalAssignedTime }}min programmati
      </v-chip>
      <v-chip 
        v-if="priorityTasksCount > 0"
        color="warning" 
        variant="outlined" 
        size="small"
      >
        <v-icon icon="mdi-star" class="mr-1" size="small" />
        {{ priorityTasksCount }} priorit{{ priorityTasksCount === 1 ? 'à' : 'à' }}
      </v-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
const timeSlotsStore = useTimeSlotsStore()
const { uniqueAssignedTasks, assignedTasks } = storeToRefs(timeSlotsStore)

// Computed properties for summary
const totalAssignedSlots = computed(() => {
  return assignedTasks.value.length
})

const totalAssignedTime = computed(() => {
  return assignedTasks.value.length * 30 // 30 minuti per slot
})

const priorityTasksCount = computed(() => {
  return uniqueAssignedTasks.value.filter(taskGroup => taskGroup.task.isPriority).length
})

// Actions
const removeAssignment = (slotId: string) => {
  timeSlotsStore.removeTaskFromSlot(slotId)
}
</script>

<style scoped>
.assigned-tasks-section {
  margin-top: 1.5rem;
}

.section-header {
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  display: flex;
  align-items: center;
}

.assigned-tasks-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.assigned-task-group {
  background: rgb(var(--v-theme-surface-variant));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.assigned-task-group:hover {
  background: rgba(var(--v-theme-on-surface), 0.04);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: rgba(var(--v-theme-primary), 0.05);
}

.time-slots-list {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.time-slot-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.5rem;
  background: rgba(var(--v-theme-surface), 0.8);
  border-radius: 4px;
  font-size: 0.8rem;
}

.assigned-task--priority {
  border-left: 3px solid rgb(var(--v-theme-warning));
}

.time-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
  flex-shrink: 0;
}

.time-range {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  line-height: 1.2;
}

.duration {
  font-size: 0.7rem;
  color: rgb(var(--v-theme-on-surface-variant));
  opacity: 0.8;
}

.task-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.task-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.3;
}

.priority-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.priority-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: rgb(var(--v-theme-warning));
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.task-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: rgb(var(--v-theme-on-surface-variant));
}

.empty-text {
  font-size: 1rem;
  font-weight: 500;
  margin: 0.75rem 0 0.5rem 0;
  color: rgb(var(--v-theme-on-surface-variant));
}

.empty-hint {
  font-size: 0.875rem;
  opacity: 0.8;
  line-height: 1.4;
  max-width: 250px;
  margin: 0 auto;
}

.summary {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  justify-content: center;
}

@media (max-width: 600px) {
  .assigned-task-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .time-info {
    flex-direction: row;
    gap: 0.5rem;
    min-width: unset;
  }
  
  .task-content {
    width: 100%;
  }
  
  .task-actions {
    align-self: flex-end;
  }
}
</style>