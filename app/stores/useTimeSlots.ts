import type { Task, TimeSlot, TimeGridConfig, TimeSlotDropEvent, TimeboxingStats } from '~/types'

export const useTimeSlotsStore = defineStore('timeSlots', () => {
  // Get runtime config directly
  const config = useRuntimeConfig()
  
  // Get settings from settings store
  const settingsStore = useSettingsStore()
  const { startHour, endHour, slotDuration } = storeToRefs(settingsStore)
  
  // Available dates for navigation
  const availableDates = ref<string[]>([])
  
  // Note: Grid config is managed by settings store, no default needed here
  
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

  // --- Undo/Redo History ---
  type SlotChange = { slotId: string; beforeTask: Task | null; afterTask: Task | null }
  type HistoryEntry = { label: string; changes: SlotChange[]; at: number }
  const historyPast = ref<HistoryEntry[]>([])
  const historyFuture = ref<HistoryEntry[]>([])
  const historyLimit = 100

  const canUndo = computed(() => historyPast.value.length > 0)
  const canRedo = computed(() => historyFuture.value.length > 0)

  const pushHistory = (entry: HistoryEntry) => {
    if (entry.changes.length === 0) return
    historyPast.value.push(entry)
    if (historyPast.value.length > historyLimit) historyPast.value.shift()
    // Any new action invalidates redo stack
    historyFuture.value = []
  }

  const applySlotTask = (slotId: string, task: Task | null): boolean => {
    const index = timeSlots.value.findIndex(s => s.id === slotId)
    if (index === -1) return false
    const slot = timeSlots.value[index]
    timeSlots.value[index] = { ...slot, task }
    return true
  }

  const applyChanges = (changes: SlotChange[], direction: 'undo' | 'redo') => {
    const tasksToApply = direction === 'undo' ? 'beforeTask' : 'afterTask'
    let any = false
    changes.forEach(ch => {
      const ok = applySlotTask(ch.slotId, ch[tasksToApply])
      if (ok) any = true
    })
    if (any) saveTimeSlots()
  }

  const undo = (): boolean => {
    if (!canUndo.value) return false
    const entry = historyPast.value.pop()!
    applyChanges(entry.changes, 'undo')
    historyFuture.value.push(entry)
    return true
  }

  const redo = (): boolean => {
    if (!canRedo.value) return false
    const entry = historyFuture.value.pop()!
    applyChanges(entry.changes, 'redo')
    historyPast.value.push(entry)
    return true
  }
  
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
    
    // Run cleanup for all stores before generating new slots
    cleanupOldSlots()
    
    // Also cleanup tasks, priorities, and notes
    const tasksStore = useTasksStore()
    const prioritiesStore = usePrioritiesStore()
    const notesStore = useNotesStore()
    tasksStore.cleanupOldTasks()
    prioritiesStore.cleanupOldPriorities()
    notesStore.cleanupOldNotes()
    
    // Keep existing slots for other dates and for the current date if they exist
    const existingSlotsForOtherDates = timeSlots.value.filter(slot => 
      !slot.id.startsWith(dateString)
    )
    
    const existingSlotsForCurrentDate = timeSlots.value.filter(slot => 
      slot.id.startsWith(dateString)
    )
    
    // If we already have slots for this date, don't regenerate them
    if (existingSlotsForCurrentDate.length > 0) {
      updateAvailableDates()
      return
    }
    
    // Get settings store to check for blocked slots
    const settingsStore = useSettingsStore()
    const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.
    
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
          // Check if this time slot is blocked by any recurring blocked slot
          const blockingActivity = settingsStore.getBlockingActivity(dayOfWeek, startTime, endTime)
          const isBlocked = blockingActivity !== null
          
          newSlots.push({
            id: `${dateString}-${startTime}`,
            startTime,
            endTime,
            task: null,
            isAvailable: !isBlocked, // Make slot unavailable if it's blocked
            notes: blockingActivity ? `🔒 ${blockingActivity.title}` : undefined
          })
        }
      }
    }
    
    timeSlots.value = [...existingSlotsForOtherDates, ...newSlots]
    saveTimeSlots()
    updateAvailableDates()
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

    // Record history
    pushHistory({
      label: 'assign',
      at: Date.now(),
      changes: [{ slotId, beforeTask: null, afterTask: newTimeSlots[slotIndex].task! }]
    })
    
    console.log('🎉 Assignment completed successfully')
    return true
  }
  
  const removeTaskFromSlot = (slotId: string): boolean => {
    const slotIndex = timeSlots.value.findIndex(slot => slot.id === slotId)
    if (slotIndex === -1) return false
    const before = timeSlots.value[slotIndex].task
    
    timeSlots.value[slotIndex] = {
      ...timeSlots.value[slotIndex],
      task: null
    }
    
    saveTimeSlots()
    if (before) {
      pushHistory({
        label: 'remove',
        at: Date.now(),
        changes: [{ slotId, beforeTask: before, afterTask: null }]
      })
    }
    return true
  }
  
  const removeTaskFromAllSlots = (taskId: string): void => {
    const changes: SlotChange[] = []
    timeSlots.value.forEach((slot, index) => {
      if (slot.task?.id === taskId) {
        changes.push({ slotId: slot.id, beforeTask: slot.task, afterTask: null })
        timeSlots.value[index] = { ...slot, task: null }
      }
    })
    saveTimeSlots()
    if (changes.length) {
      pushHistory({ label: 'remove_all', at: Date.now(), changes })
    }
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
    const changes: SlotChange[] = []
    timeSlots.value = timeSlots.value.map(slot => {
      if (slot.task) {
        changes.push({ slotId: slot.id, beforeTask: slot.task, afterTask: null })
      }
      return { ...slot, task: null }
    })
    saveTimeSlots()
    if (changes.length) {
      pushHistory({ label: 'clear_all', at: Date.now(), changes })
    }
  }
  
  const setCurrentDate = (date: Date): void => {
    currentDate.value = date
    generateSlotsForDate(date)
    updateAvailableDates()
  }
  
  // Navigation functions
  const goToPreviousDay = (): void => {
    const newDate = new Date(currentDate.value)
    newDate.setDate(newDate.getDate() - 1)
    setCurrentDate(newDate)
  }
  
  const goToNextDay = (): void => {
    const newDate = new Date(currentDate.value)
    newDate.setDate(newDate.getDate() + 1)
    setCurrentDate(newDate)
  }
  
  const goToToday = (): void => {
    setCurrentDate(new Date())
  }
  
  // Update available dates for navigation
  const updateAvailableDates = (): void => {
    const dates = new Set<string>()
    
    // Add current date
    dates.add(currentDate.value.toISOString().split('T')[0])
    
    // Add dates from existing slots
    timeSlots.value.forEach(slot => {
      const dateMatch = slot.id.match(/^(\d{4}-\d{2}-\d{2})/)
      if (dateMatch) {
        dates.add(dateMatch[1])
      }
    })
    
    availableDates.value = Array.from(dates).sort()
  }
  
  // Cleanup old slots based on retention policy
  const cleanupOldSlots = (): void => {
    const maxDays = config.public.maxDaysRetention
    const today = new Date()
    const cutoffDate = new Date(today)
    cutoffDate.setDate(today.getDate() - maxDays)
    
    const cutoffDateString = cutoffDate.toISOString().split('T')[0]
    
    // Count slots to be removed for logging
    const slotsToRemove = timeSlots.value.filter(slot => {
      const dateMatch = slot.id.match(/^(\d{4}-\d{2}-\d{2})/)
      if (dateMatch) {
        return dateMatch[1] < cutoffDateString
      }
      return false
    })
    
    if (slotsToRemove.length > 0) {
      // Remove old slots
      timeSlots.value = timeSlots.value.filter(slot => {
        const dateMatch = slot.id.match(/^(\d{4}-\d{2}-\d{2})/)
        if (dateMatch) {
          return dateMatch[1] >= cutoffDateString
        }
        return true
      })
      
      console.log(`🧹 Cleaned up ${slotsToRemove.length} old slots older than ${maxDays} days`)
      saveTimeSlots()
      updateAvailableDates()
    }
  }
  
  const regenerateCurrentSlots = (): void => {
    // Clear existing slots for current date to force regeneration
    const dateString = currentDate.value.toISOString().split('T')[0]
    timeSlots.value = timeSlots.value.filter(slot => !slot.id.startsWith(dateString))
    
    // Generate new slots with updated configuration
    generateSlotsForDate(currentDate.value)
  }
  
  const updateSlotsWithBlockedStatus = (): void => {
    // Update existing slots based on current blocked slots configuration
    const settingsStore = useSettingsStore()
    const date = currentDate.value
    const dayOfWeek = date.getDay()
    
    timeSlots.value = timeSlots.value.map(slot => {
      // Only update slots for current date
      if (slot.id.startsWith(date.toISOString().split('T')[0])) {
        const blockingActivity = settingsStore.getBlockingActivity(dayOfWeek, slot.startTime, slot.endTime)
        const isBlocked = blockingActivity !== null
        
        return {
          ...slot,
          isAvailable: !isBlocked && !slot.task, // Don't make unavailable if it has a task
          notes: blockingActivity ? `🔒 ${blockingActivity.title}` : (slot.notes?.startsWith('🔒') ? undefined : slot.notes)
        }
      }
      
      return slot
    })
    
    saveTimeSlots()
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
        // Always ensure currentDate is set first
        if (!currentDate.value) {
          currentDate.value = new Date()
        }
        
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
          
          // Note: gridConfig is computed from settings store, so no need to restore it
          // The settings store handles its own persistence
        }
        
        // Only generate slots if we don't have any for the current date
        const dateString = currentDate.value.toISOString().split('T')[0]
        const hasCurrentDateSlots = timeSlots.value.some(slot => 
          slot.id.startsWith(dateString)
        )
        
        if (!hasCurrentDateSlots) {
          generateSlotsForDate(currentDate.value)
        } else {
          // Update available dates from loaded data
          updateAvailableDates()
        }
        
      } catch (error) {
        console.error('Error loading time slots from localStorage:', error)
        // Ensure currentDate is set even on error
        if (!currentDate.value) {
          currentDate.value = new Date()
        }
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
    availableDates: readonly(availableDates),
    
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
    updateSlotsWithBlockedStatus,
    getAdjacentSlots,
    getAvailableAdjacentSlots,
    saveTimeSlots,
    loadTimeSlots,
    // History
    undo,
    redo,
    canUndo,
    canRedo,
    
    // Navigation actions
    goToPreviousDay,
    goToNextDay,
    goToToday,
    cleanupOldSlots,
    updateAvailableDates
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
