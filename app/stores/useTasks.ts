import type { Task } from '~/types'

export const useTasksStore = defineStore('tasks', () => {
  // Get runtime config for retention
  const config = useRuntimeConfig()
  
  // State
  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
  const showMaxPriorityAlert = ref(false)

  // Getters
  const allTasks = computed(() => {
    return [...tasks.value].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  })
  
  // Get tasks for current date from timeSlots store
  const tasksForCurrentDate = computed(() => {
    // Get current date from timeSlots store
    const timeSlotsStore = useTimeSlotsStore()
    const currentDate = timeSlotsStore.currentDate
    const currentDateString = currentDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
    
    return tasks.value.filter(task => task.date === currentDateString)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  })
  
  // Get tasks for specific date
  const getTasksForDate = (dateString: string) => {
    return tasks.value.filter(task => task.date === dateString)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }
  
  // Get available dates that have tasks
  const availableTaskDates = computed(() => {
    const dates = new Set<string>()
    tasks.value.forEach(task => dates.add(task.date))
    return Array.from(dates).sort()
  })

  // Actions
  const addTask = (taskText: string, dateString?: string): Task => {
    // Get current date from timeSlots store if not provided
    const timeSlotsStore = useTimeSlotsStore()
    const fallbackDate = new Date().toISOString().split('T')[0] || new Date().toISOString().substring(0, 10)
    let currentDateString: string
    
    if (dateString) {
      currentDateString = dateString
    } else if (timeSlotsStore.currentDate) {
      currentDateString = timeSlotsStore.currentDate.toISOString().split('T')[0]
    } else {
      currentDateString = fallbackDate
    }
    
    const newTask: Task = {
      id: `${currentDateString}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      text: taskText.trim(),
      isPriority: false,
      createdAt: new Date(),
      date: currentDateString
    }
    
    tasks.value.push(newTask)
    saveTasks()
    return newTask
  }

  const removeTask = (taskId: string): boolean => {
    const taskIndex = tasks.value.findIndex(task => task.id === taskId)
    if (taskIndex !== -1) {
      tasks.value.splice(taskIndex, 1)
      saveTasks()
      return true
    }
    return false
  }


  const setCurrentTask = (task: Task | null): void => {
    currentTask.value = task
  }

  const hideMaxPriorityAlert = (): void => {
    showMaxPriorityAlert.value = false
  }

  const clearAllTasks = (): void => {
    tasks.value = []
    currentTask.value = null
    saveTasks()
  }
  
  // Cleanup old tasks based on retention policy
  const cleanupOldTasks = (): void => {
    const maxDays = config.public.maxDaysRetention || 7
    const today = new Date()
    const cutoffDate = new Date(today)
    cutoffDate.setDate(today.getDate() - maxDays)
    
    const cutoffDateString: string = cutoffDate.toISOString().split('T')[0] || cutoffDate.toISOString().substring(0, 10)
    
    // Count tasks to be removed for logging
    const tasksToRemove = tasks.value.filter(task => task.date && task.date < cutoffDateString)
    
    if (tasksToRemove.length > 0) {
      // Remove old tasks
      tasks.value = tasks.value.filter(task => !task.date || task.date >= cutoffDateString)
      
      console.log(`🧹 Cleaned up ${tasksToRemove.length} old tasks older than ${maxDays} days`)
      saveTasks()
    }
  }

  const updateTask = (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): boolean => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      Object.assign(task, updates)
      saveTasks()
      return true
    }
    return false
  }

  // Persistence
  const saveTasks = (): void => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('braindump-tasks', JSON.stringify(tasks.value))
      } catch (error) {
        console.error('Error saving tasks to localStorage:', error)
      }
    }
  }

  const loadTasks = (): void => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('braindump-tasks')
        if (saved) {
          const parsedTasks = JSON.parse(saved)
          const today = new Date().toISOString().split('T')[0]
          
          tasks.value = parsedTasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            // Migration: if task doesn't have date field, use today's date
            date: task.date || today
          }))
          
          // Run cleanup after loading
          cleanupOldTasks()
        }
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error)
        tasks.value = []
      }
    }
  }

  // Initialize on store creation
  if (typeof window !== 'undefined') {
    loadTasks()
  }

  return {
    // State
    tasks: readonly(tasks),
    currentTask: readonly(currentTask),
    showMaxPriorityAlert: readonly(showMaxPriorityAlert),
    
    // Getters
    allTasks,
    tasksForCurrentDate,
    getTasksForDate,
    availableTaskDates,
    
    // Actions
    addTask,
    removeTask,
    setCurrentTask,
    hideMaxPriorityAlert,
    clearAllTasks,
    updateTask,
    cleanupOldTasks,
    loadTasks,
    saveTasks
  }
})

// Auto-refresh when localStorage changes (for multi-tab sync)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'braindump-tasks') {
      const store = useTasksStore()
      store.loadTasks()
    }
  })
}