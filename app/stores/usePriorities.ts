import type { Task } from '~/types'

export const usePrioritiesStore = defineStore('priorities', () => {
  // Get runtime config directly
  const config = useRuntimeConfig()
  
  // Get max priorities from settings store (allows dynamic updates)
  const settingsStore = useSettingsStore()
  const { maxPriorities } = storeToRefs(settingsStore)

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
  
  // State - now organized by date
  const prioritiesByDate = ref<Record<string, (Task | null)[]>>({})
  const showMaxAlert = ref(false)
  
  // Get current date priorities
  const priorities = computed(() => {
    const timeSlotsStore = useTimeSlotsStore()
    const currentDateString = timeSlotsStore.currentDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
    
    if (!prioritiesByDate.value[currentDateString]) {
      prioritiesByDate.value[currentDateString] = new Array(maxPriorities.value).fill(null)
    }
    
    return prioritiesByDate.value[currentDateString] || new Array(maxPriorities.value).fill(null)
  })
  
  // Watch maxPriorities changes to resize all priorities arrays
  watch(maxPriorities, (newMax, oldMax) => {
    if (newMax !== oldMax) {
      // Resize all existing priority arrays for all dates
      Object.keys(prioritiesByDate.value).forEach(dateString => {
        const currentPriorities = [...prioritiesByDate.value[dateString]]
        
        // Resize array to new max
        if (newMax > currentPriorities.length) {
          // Add empty slots
          prioritiesByDate.value[dateString] = [...currentPriorities, ...new Array(newMax - currentPriorities.length).fill(null)]
        } else {
          // Remove excess slots, keeping only the first newMax items
          prioritiesByDate.value[dateString] = currentPriorities.slice(0, newMax)
        }
      })
      
      savePriorities()
      console.log(`⚙️ All priorities arrays resized from ${oldMax} to ${newMax} slots`)
    }
  }, { immediate: false })

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
    const timeSlotsStore = useTimeSlotsStore()
    const currentDateString = timeSlotsStore.currentDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
    
    prioritiesByDate.value[currentDateString] = new Array(maxPriorities.value).fill(null)
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

  const setAtIndex = (task: Task, index: number): boolean => {
    if (index < 0 || index >= maxPriorities.value) {
      return false
    }

    // Check if task is already in priorities at a different position
    const existingIndex = priorities.value.findIndex(p => p?.id === task.id)
    if (existingIndex !== -1 && existingIndex !== index) {
      // Remove from old position
      priorities.value[existingIndex] = null
    }

    // Set at the specified index
    priorities.value[index] = { ...task }
    savePriorities()
    return true
  }
  
  // Cleanup old priorities based on retention policy
  const cleanupOldPriorities = (): void => {
    const maxDays = config.public.maxDaysRetention
    const today = new Date()
    const cutoffDate = new Date(today)
    cutoffDate.setDate(today.getDate() - maxDays)
    
    const cutoffDateString = cutoffDate.toISOString().split('T')[0]
    
    // Count dates to be removed for logging
    const datesToRemove = Object.keys(prioritiesByDate.value).filter(date => date < cutoffDateString)
    
    if (datesToRemove.length > 0) {
      // Remove old priority dates
      datesToRemove.forEach(date => {
        delete prioritiesByDate.value[date]
      })
      
      console.log(`🧹 Cleaned up priorities for ${datesToRemove.length} old dates older than ${maxDays} days`)
      savePriorities()
    }
  }

  // Persistence
  const savePriorities = (): void => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('braindump-priorities', JSON.stringify(prioritiesByDate.value))
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
          const parsedData = JSON.parse(saved)
          
          // Check if it's the old format (array) or new format (object by date)
          if (Array.isArray(parsedData)) {
            // Migration: convert old format to new format
            const today = new Date().toISOString().split('T')[0]
            prioritiesByDate.value = {
              [today]: parsedData.map((priority: any) => 
                priority ? {
                  ...priority,
                  createdAt: new Date(priority.createdAt),
                  date: priority.date || today // Add date if missing
                } : null
              )
            }
          } else {
            // New format: object with dates as keys
            prioritiesByDate.value = {}
            Object.entries(parsedData).forEach(([dateString, priorities]: [string, any]) => {
              if (Array.isArray(priorities)) {
                prioritiesByDate.value[dateString] = priorities.map((priority: any) =>
                  priority ? {
                    ...priority,
                    createdAt: new Date(priority.createdAt),
                    date: priority.date || dateString
                  } : null
                )
              }
            })
          }
          
          // Run cleanup after loading
          cleanupOldPriorities()
        }
      } catch (error) {
        console.error('Error loading priorities from localStorage:', error)
        prioritiesByDate.value = {}
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
    setAtIndex,
    showAlert,
    hideAlert,
    findTaskById,
    getTaskAtIndex,
    getAllSlots,
    updateTaskInPriorities,
    cleanupOldPriorities,
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