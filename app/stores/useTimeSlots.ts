import type { Task, TimeSlot, TimeGridConfig, TimeSlotDropEvent, TimeboxingStats } from '~/types'

export const useTimeSlotsStore = defineStore('timeSlots', () => {
  // Get runtime config directly
  const config = useRuntimeConfig()
  
  // Get settings from settings store
  const settingsStore = useSettingsStore()
  const { startHour, endHour, slotDuration } = storeToRefs(settingsStore)
  
  // Default time grid configuration (using settings store values)
  const defaultGridConfig: TimeGridConfig = {
    startHour: 9, // 9:00
    endHour: 18, // 18:00
    slotDuration: 30, // 30 minuti
    includedDays: [1, 2, 3, 4, 5] // Lun-Ven
  }
  
  // Dynamic grid config that updates with settings
  const gridConfig = computed((): TimeGridConfig => ({
    startHour: startHour.value,
    endHour: endHour.value,
    slotDuration: slotDuration.value,
    includedDays: [1, 2, 3, 4, 5]
  }))
  
  // State
  const timeSlots = ref<TimeSlot[]>([])
  const currentDate = ref(new Date())
  
  // Getters
  const todaySlots = computed(() => {
    const todayDateString = currentDate.value.toISOString().split('T')[0]
    return timeSlots.value.filter(slot => {
      return slot.id.startsWith(todayDateString)
    })
  })
  
  const availableSlots = computed(() => {
    return todaySlots.value.filter(slot => slot.isAvailable && !slot.task)
  })
  
  const occupiedSlots = computed(() => {
    return todaySlots.value.filter(slot => slot.task !== null)
  })
  
  const stats = computed((): TimeboxingStats => {
    const total = todaySlots.value.length
    const occupied = occupiedSlots.value.length
    const free = total - occupied
    const priorityScheduled = occupiedSlots.value.filter(slot => 
      slot.task?.isPriority
    ).length
    const totalTime = occupied * gridConfig.value.slotDuration
    
    return {
      totalSlots: total,
      occupiedSlots: occupied,
      freeSlots: free,
      priorityTasksScheduled: priorityScheduled,
      totalScheduledTime: totalTime
    }
  })

  const assignedTasks = computed(() => {
    return todaySlots.value
      .filter(slot => slot.task !== null)
      .map(slot => ({
        task: slot.task!,
        slotId: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime
      }))
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  })

  const uniqueAssignedTasks = computed(() => {
    const uniqueTasks = new Map<string, { task: Task, slots: { slotId: string, startTime: string, endTime: string }[] }>()
    
    assignedTasks.value.forEach(assignment => {
      const taskId = assignment.task.id
      if (!uniqueTasks.has(taskId)) {
        uniqueTasks.set(taskId, {
          task: assignment.task,
          slots: []
        })
      }
      uniqueTasks.get(taskId)!.slots.push({
        slotId: assignment.slotId,
        startTime: assignment.startTime,
        endTime: assignment.endTime
      })
    })
    
    return Array.from(uniqueTasks.values())
      .map(item => ({
        ...item,
        slots: item.slots.sort((a, b) => a.startTime.localeCompare(b.startTime))
      }))
  })
  
  // Actions
  const generateSlotsForDate = (date: Date): void => {
    const dateString = date.toISOString().split('T')[0]
    
    // Keep existing slots for other dates and for the current date if they exist
    const existingSlotsForOtherDates = timeSlots.value.filter(slot => 
      !slot.id.startsWith(dateString)
    )
    
    const existingSlotsForCurrentDate = timeSlots.value.filter(slot => 
      slot.id.startsWith(dateString)
    )
    
    // If we already have slots for this date, don't regenerate them
    if (existingSlotsForCurrentDate.length > 0) {
      return
    }
    
    const newSlots: TimeSlot[] = []
    const { startHour: configStartHour, endHour: configEndHour, slotDuration: configSlotDuration } = gridConfig.value
    
    for (let hour = configStartHour; hour < configEndHour; hour++) {
      for (let minute = 0; minute < 60; minute += configSlotDuration) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const endMinute = minute + configSlotDuration
        const actualEndHour = endMinute >= 60 ? hour + 1 : hour
        const actualEndMinute = endMinute >= 60 ? endMinute - 60 : endMinute
        const endTime = `${actualEndHour.toString().padStart(2, '0')}:${actualEndMinute.toString().padStart(2, '0')}`
        
        // Fix the logic error and ensure we don't go past the end hour
        if (actualEndHour <= configEndHour) {
          newSlots.push({
            id: `${dateString}-${startTime}`,
            startTime,
            endTime,
            task: null,
            isAvailable: true
          })
        }
      }
    }
    
    timeSlots.value = [...existingSlotsForOtherDates, ...newSlots]
    saveTimeSlots()
  }
  
  const assignTaskToSlot = (task: Task, slotId: string): boolean => {
    console.log('🏪 Store: assignTaskToSlot called', { task: task.text, slotId })
    
    const slotIndex = timeSlots.value.findIndex(slot => slot.id === slotId)
    console.log('🔍 Found slot index:', slotIndex)
    
    if (slotIndex === -1) {
      console.warn('❌ Slot not found:', slotId)
      return false
    }
    
    const slot = timeSlots.value[slotIndex]
    console.log('📍 Target slot:', { id: slot.id, isAvailable: slot.isAvailable, hasTask: !!slot.task })
    
    if (!slot.isAvailable || slot.task) {
      console.warn('❌ Slot not available or already occupied')
      return false
    }
    
    // Get current priority status from priorities store
    const prioritiesStore = usePrioritiesStore()
    const isPriorityTask = prioritiesStore.findTaskById(task.id) !== null
    
    console.log('⭐ Task priority status:', { taskId: task.id, isPriority: isPriorityTask })
    
    // Assign the task to the target slot with updated priority status
    const newTimeSlots = [...timeSlots.value]
    newTimeSlots[slotIndex] = {
      ...slot,
      task: { 
        ...task,
        isPriority: isPriorityTask  // Update priority status based on current priorities store
      }
    }
    
    console.log('🎯 Task assigned to slot (multiple assignments allowed):', slot.id)
    
    console.log('🔄 Updating timeSlots array with', newTimeSlots.length, 'slots')
    
    // Update reactive array once
    timeSlots.value = newTimeSlots
    
    console.log('✅ TimeSlots updated, saving to localStorage')
    
    // Save to localStorage once
    saveTimeSlots()
    
    console.log('🎉 Assignment completed successfully')
    return true
  }
  
  const removeTaskFromSlot = (slotId: string): boolean => {
    const slotIndex = timeSlots.value.findIndex(slot => slot.id === slotId)
    if (slotIndex === -1) return false
    
    timeSlots.value[slotIndex] = {
      ...timeSlots.value[slotIndex],
      task: null
    }
    
    saveTimeSlots()
    return true
  }
  
  const removeTaskFromAllSlots = (taskId: string): void => {
    timeSlots.value.forEach((slot, index) => {
      if (slot.task?.id === taskId) {
        timeSlots.value[index] = {
          ...slot,
          task: null
        }
      }
    })
    saveTimeSlots()
  }
  
  const moveTask = (event: TimeSlotDropEvent): boolean => {
    const { task, targetSlot, sourceSlot } = event
    
    // Remove from source slot if exists
    if (sourceSlot) {
      removeTaskFromSlot(sourceSlot.id)
    }
    
    // Assign to target slot
    return assignTaskToSlot(task, targetSlot.id)
  }
  
  const findSlotById = (slotId: string): TimeSlot | null => {
    return timeSlots.value.find(slot => slot.id === slotId) || null
  }
  
  const findSlotByTask = (taskId: string): TimeSlot | null => {
    return timeSlots.value.find(slot => slot.task?.id === taskId) || null
  }
  
  const setSlotAvailability = (slotId: string, available: boolean): boolean => {
    const slotIndex = timeSlots.value.findIndex(slot => slot.id === slotId)
    if (slotIndex === -1) return false
    
    timeSlots.value[slotIndex] = {
      ...timeSlots.value[slotIndex],
      isAvailable: available
    }
    
    saveTimeSlots()
    return true
  }
  
  const updateSlotNotes = (slotId: string, notes: string): boolean => {
    const slotIndex = timeSlots.value.findIndex(slot => slot.id === slotId)
    if (slotIndex === -1) return false
    
    timeSlots.value[slotIndex] = {
      ...timeSlots.value[slotIndex],
      notes
    }
    
    saveTimeSlots()
    return true
  }
  
  const clearAllSlots = (): void => {
    timeSlots.value = timeSlots.value.map(slot => ({
      ...slot,
      task: null
    }))
    saveTimeSlots()
  }
  
  const setCurrentDate = (date: Date): void => {
    currentDate.value = date
    generateSlotsForDate(date)
  }
  
  const regenerateCurrentSlots = (): void => {
    // Clear existing slots for current date to force regeneration
    const dateString = currentDate.value.toISOString().split('T')[0]
    timeSlots.value = timeSlots.value.filter(slot => !slot.id.startsWith(dateString))
    
    // Generate new slots with updated configuration
    generateSlotsForDate(currentDate.value)
  }

  const getAdjacentSlots = (slotId: string): { before: TimeSlot | null, after: TimeSlot | null } => {
    const currentSlotIndex = todaySlots.value.findIndex(slot => slot.id === slotId)
    if (currentSlotIndex === -1) return { before: null, after: null }

    const beforeSlot = currentSlotIndex > 0 ? todaySlots.value[currentSlotIndex - 1] : null
    const afterSlot = currentSlotIndex < todaySlots.value.length - 1 ? todaySlots.value[currentSlotIndex + 1] : null

    return { before: beforeSlot, after: afterSlot }
  }

  const getAvailableAdjacentSlots = (taskId: string): TimeSlot[] => {
    // Find all slots occupied by this task
    const taskSlots = todaySlots.value.filter(slot => slot.task?.id === taskId)
    const adjacentSlots: Set<string> = new Set()

    // For each slot occupied by the task, check adjacent slots
    taskSlots.forEach(taskSlot => {
      const { before, after } = getAdjacentSlots(taskSlot.id)
      
      // Add adjacent slots that are available and not already occupied by this task
      if (before && before.isAvailable && !before.task) {
        adjacentSlots.add(before.id)
      }
      if (after && after.isAvailable && !after.task) {
        adjacentSlots.add(after.id)
      }
    })

    return todaySlots.value.filter(slot => adjacentSlots.has(slot.id))
  }
  
  // Persistence
  const saveTimeSlots = (): void => {
    if (typeof window !== 'undefined') {
      try {
        const dataToSave = {
          timeSlots: timeSlots.value,
          currentDate: currentDate.value.toISOString(),
          gridConfig: gridConfig.value
        }
        localStorage.setItem('braindump-timeslots', JSON.stringify(dataToSave))
      } catch (error) {
        console.error('Error saving time slots to localStorage:', error)
      }
    }
  }
  
  const loadTimeSlots = (): void => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('braindump-timeslots')
        if (saved) {
          const parsedData = JSON.parse(saved)
          
          if (parsedData.timeSlots) {
            timeSlots.value = parsedData.timeSlots.map((slot: any) => ({
              ...slot,
              task: slot.task ? {
                ...slot.task,
                createdAt: new Date(slot.task.createdAt)
              } : null
            }))
          }
          
          if (parsedData.currentDate) {
            currentDate.value = new Date(parsedData.currentDate)
          }
          
          if (parsedData.gridConfig) {
            gridConfig.value = { ...defaultGridConfig, ...parsedData.gridConfig }
          }
        }
        
        // Only generate slots if we don't have any for the current date
        const dateString = currentDate.value.toISOString().split('T')[0]
        const hasCurrentDateSlots = timeSlots.value.some(slot => 
          slot.id.startsWith(dateString)
        )
        
        if (!hasCurrentDateSlots) {
          generateSlotsForDate(currentDate.value)
        }
        
      } catch (error) {
        console.error('Error loading time slots from localStorage:', error)
        generateSlotsForDate(currentDate.value)
      }
    }
  }
  
  // Initialize on store creation
  if (typeof window !== 'undefined') {
    loadTimeSlots()
  } else {
    generateSlotsForDate(currentDate.value)
  }
  
  return {
    // State (readonly)
    timeSlots: readonly(timeSlots),
    currentDate: readonly(currentDate),
    gridConfig: readonly(gridConfig),
    
    // Getters
    todaySlots,
    availableSlots,
    occupiedSlots,
    assignedTasks,
    uniqueAssignedTasks,
    stats,
    
    // Actions
    generateSlotsForDate,
    assignTaskToSlot,
    removeTaskFromSlot,
    removeTaskFromAllSlots,
    moveTask,
    findSlotById,
    findSlotByTask,
    setSlotAvailability,
    updateSlotNotes,
    clearAllSlots,
    setCurrentDate,
    regenerateCurrentSlots,
    getAdjacentSlots,
    getAvailableAdjacentSlots,
    saveTimeSlots,
    loadTimeSlots
  }
})

// Auto-refresh quando localStorage cambia (per multi-tab sync)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'braindump-timeslots') {
      const store = useTimeSlotsStore()
      store.loadTimeSlots()
    }
  })
}