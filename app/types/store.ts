import type { Task } from './task'

/**
 * Stato del task store
 */
export interface TasksStoreState {
  tasks: Task[]
  currentTask: Task | null
  showMaxPriorityAlert: boolean
}

/**
 * Getters del task store
 */
export interface TasksStoreGetters {
  priorityTasks: Task[]
  nonPriorityTasks: Task[]
  priorityCount: number
  hasMaxPriorities: boolean
}

/**
 * Actions del task store
 */
export interface TasksStoreActions {
  addTask: (taskText: string) => Task
  removeTask: (taskId: string) => boolean
  togglePriority: (task: Task) => boolean
  removePriority: (task: Task) => void
  setCurrentTask: (task: Task | null) => void
  hideMaxPriorityAlert: () => void
  clearAllTasks: () => void
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => boolean
  loadTasks: () => void
  saveTasks: () => void
}

/**
 * Configurazione del localStorage
 */
export interface StorageConfig {
  key: string
  enabled: boolean
  autoSave: boolean
}

/**
 * Evento di storage per sincronizzazione multi-tab
 */
export interface StorageEvent {
  key: string
  oldValue: string | null
  newValue: string | null
  storageArea: Storage
}

/**
 * Filtri per i task
 */
export interface TaskFilters {
  showPriorities?: boolean
  showNonPriorities?: boolean
  searchText?: string
  dateRange?: {
    from: Date
    to: Date
  }
}

/**
 * Ordinamento per i task
 */
export interface TaskSorting {
  field: 'createdAt' | 'text' | 'isPriority'
  direction: 'asc' | 'desc'
}

/**
 * Stato del priority store
 */
export interface PriorityStoreState {
  priorities: (Task | null)[]
  maxPriorities: number
  showMaxAlert: boolean
}

/**
 * Getters del priority store
 */
export interface PriorityStoreGetters {
  priorityCount: number
  hasMaxPriorities: boolean
  availableSlots: number
  isEmpty: boolean
  isFull: boolean
}

/**
 * Actions del priority store
 */
export interface PriorityStoreActions {
  add: (task: Task) => boolean
  remove: (task: Task) => boolean
  removeByIndex: (index: number) => boolean
  clear: () => void
  reorder: (fromIndex: number, toIndex: number) => boolean
  showAlert: () => void
  hideAlert: () => void
}