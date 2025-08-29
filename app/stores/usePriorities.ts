import type { Task } from '~/types'

export const usePrioritiesStore = defineStore('priorities', () => {
  // Get runtime config directly
  const config = useRuntimeConfig()
  
  // Configuration values with validation
  const maxPriorities = computed(() => {
    const value = config.public.maxPriorities
    // Validazione: minimo 1, massimo 10
    return Math.max(1, Math.min(10, value))
  })

  const alertAutoHideDelay = computed(() => {
    const value = config.public.alertAutoHideDelay
    // Validazione: minimo 1 secondo, massimo 30 secondi
    return Math.max(1000, Math.min(30000, value))
  })

  const autoSaveEnabled = computed(() => {
    return config.public.autoSaveEnabled
  })

  const priorityLabelText = computed(() => {
    return `Priorità (${maxPriorities.value} max)`
  })
  
  // State
  const priorities = ref<(Task | null)[]>(new Array(maxPriorities.value).fill(null))
  const showMaxAlert = ref(false)

  // Getters
  const priorityCount = computed(() => {
    return priorities.value.filter(p => p !== null).length
  })

  const hasMaxPriorities = computed(() => {
    return priorityCount.value >= maxPriorities.value
  })

  const availableSlots = computed(() => {
    return maxPriorities.value - priorityCount.value
  })

  const isEmpty = computed(() => {
    return priorityCount.value === 0
  })

  const isFull = computed(() => {
    return priorityCount.value >= maxPriorities.value
  })

  const priorityTasks = computed(() => {
    return priorities.value.filter(p => p !== null) as Task[]
  })

  // Actions
  const add = (task: Task): boolean => {
    // Verifica se il task è già nelle priorità
    const existingIndex = priorities.value.findIndex(p => p?.id === task.id)
    if (existingIndex !== -1) {
      return false // Task già presente
    }

    // Verifica se ci sono slot disponibili
    if (isFull.value) {
      showAlert()
      return false
    }

    // Trova il primo slot vuoto
    const emptyIndex = priorities.value.findIndex(p => p === null)
    if (emptyIndex !== -1) {
      priorities.value[emptyIndex] = { ...task }
      savePriorities()
      return true
    }

    return false
  }

  const remove = (task: Task): boolean => {
    const index = priorities.value.findIndex(p => p?.id === task.id)
    if (index !== -1) {
      return removeByIndex(index)
    }
    return false
  }

  const removeByIndex = (index: number): boolean => {
    if (index >= 0 && index < priorities.value.length && priorities.value[index] !== null) {
      priorities.value[index] = null
      savePriorities()
      return true
    }
    return false
  }

  const clear = (): void => {
    priorities.value = new Array(maxPriorities.value).fill(null)
    savePriorities()
  }

  const reorder = (fromIndex: number, toIndex: number): boolean => {
    if (
      fromIndex >= 0 && fromIndex < priorities.value.length &&
      toIndex >= 0 && toIndex < priorities.value.length &&
      fromIndex !== toIndex
    ) {
      const temp = priorities.value[fromIndex]
      priorities.value[fromIndex] = priorities.value[toIndex]
      priorities.value[toIndex] = temp
      savePriorities()
      return true
    }
    return false
  }

  const showAlert = (): void => {
    showMaxAlert.value = true
    // Auto-hide con delay configurabile
    setTimeout(() => {
      hideAlert()
    }, alertAutoHideDelay.value)
  }

  const hideAlert = (): void => {
    showMaxAlert.value = false
  }

  const findTaskById = (taskId: string): Task | null => {
    const found = priorities.value.find(p => p?.id === taskId)
    return found || null
  }

  const getTaskAtIndex = (index: number): Task | null => {
    if (index >= 0 && index < priorities.value.length) {
      return priorities.value[index] || null
    }
    return null
  }

  const getAllSlots = (): (Task | null)[] => {
    return [...priorities.value]
  }

  const updateTaskInPriorities = (updatedTask: Task): boolean => {
    const index = priorities.value.findIndex(p => p?.id === updatedTask.id)
    if (index !== -1) {
      priorities.value[index] = { ...updatedTask }
      savePriorities()
      return true
    }
    return false
  }

  // Persistence
  const savePriorities = (): void => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('braindump-priorities', JSON.stringify(priorities.value))
      } catch (error) {
        console.error('Error saving priorities to localStorage:', error)
      }
    }
  }

  const loadPriorities = (): void => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('braindump-priorities')
        if (saved) {
          const parsedPriorities = JSON.parse(saved)
          // Assicurarsi che sia sempre un array di lunghezza corretta
          priorities.value = new Array(maxPriorities.value).fill(null)
          parsedPriorities.forEach((priority: any, index: number) => {
            if (index < maxPriorities.value && priority) {
              priorities.value[index] = {
                ...priority,
                createdAt: new Date(priority.createdAt)
              }
            }
          })
        }
      } catch (error) {
        console.error('Error loading priorities from localStorage:', error)
        priorities.value = new Array(maxPriorities.value).fill(null)
      }
    }
  }

  // Initialize on store creation
  if (typeof window !== 'undefined') {
    loadPriorities()
  }

  return {
    // State (readonly)
    priorities: readonly(priorities),
    showMaxAlert: readonly(showMaxAlert),
    
    // Configuration values (exposed from store)
    maxPriorities: readonly(maxPriorities),
    alertAutoHideDelay: readonly(alertAutoHideDelay),
    priorityLabelText: readonly(priorityLabelText),
    
    // Getters
    priorityCount,
    hasMaxPriorities,
    availableSlots,
    isEmpty,
    isFull,
    priorityTasks,
    
    // Actions
    add,
    remove,
    removeByIndex,
    clear,
    reorder,
    showAlert,
    hideAlert,
    findTaskById,
    getTaskAtIndex,
    getAllSlots,
    updateTaskInPriorities,
    loadPriorities,
    savePriorities
  }
})

// Auto-refresh quando localStorage cambia (per multi-tab sync)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'braindump-priorities') {
      const store = usePrioritiesStore()
      store.loadPriorities()
    }
  })
}