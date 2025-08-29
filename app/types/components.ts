import type { Task } from './task'

/**
 * Props per il componente AlertMaxPriority
 */
export interface AlertProps {
  visible: boolean
  autoHide?: boolean
  autoHideDelay?: number
}

/**
 * Rappresenta uno slot di priorità (può essere vuoto)
 */
export interface PrioritySlot {
  index: number
  task: Task | null
}

/**
 * Eventi emessi dal componente BrainDumpSection
 */
export interface BrainDumpEmits {
  priorityToggled: [task: Task]
}

/**
 * Eventi emessi dal componente PrioritySection
 */
export interface PriorityEmits {
  priorityRemoved: [task: Task]
}

/**
 * Eventi emessi dal componente TaskInput
 */
export interface TaskInputEmits {
  taskAdded: [task: string]
}

/**
 * Props per il componente TaskInput
 */
export interface TaskInputProps {
  placeholder?: string
  disabled?: boolean
  maxLength?: number
}

/**
 * Stato del componente TaskInput
 */
export interface TaskInputState {
  newTaskText: string
  isAdding: boolean
}

/**
 * Props per il componente PrioritySection
 */
export interface PrioritySectionProps {
  maxPriorities?: number
}

/**
 * Configurazione per il drag and drop
 */
export interface DragDropConfig {
  enabled: boolean
  ghostClass?: string
  chosenClass?: string
}

/**
 * Evento di drag and drop per i task
 */
export interface TaskDragEvent {
  task: Task
  oldIndex: number
  newIndex: number
  from: 'braindump' | 'priorities' | 'timeslots'
  to: 'braindump' | 'priorities' | 'timeslots'
}