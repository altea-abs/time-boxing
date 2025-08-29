import type { Task, CreateTaskInput, UpdateTaskInput } from '~/types'

export const useTasksStore = defineStore('tasks', () => {
  // State
  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
  const showMaxPriorityAlert = ref(false)

  // Getters
  const allTasks = computed(() => {
    return [...tasks.value].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  })

  // Actions
  const addTask = (taskText: string): Task => {
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText.trim(),
      isPriority: false,
      createdAt: new Date()
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
          tasks.value = parsedTasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt)
          }))
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
    
    // Actions
    addTask,
    removeTask,
    setCurrentTask,
    hideMaxPriorityAlert,
    clearAllTasks,
    updateTask,
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