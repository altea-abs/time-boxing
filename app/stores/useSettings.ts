import type { BlockedSlot, CreateBlockedSlotInput, UpdateBlockedSlotInput } from '~/types'

export const useSettingsStore = defineStore('settings', () => {
  // Get initial runtime config
  const config = useRuntimeConfig()
  
  // Local state for dynamic settings (overrides runtime config)
  const dynamicMaxPriorities = ref<number | null>(null)
  const dynamicStartHour = ref<number | null>(null)
  const dynamicEndHour = ref<number | null>(null)
  const dynamicSlotDuration = ref<number | null>(null)
  
  // State for blocked slots
  const blockedSlots = ref<BlockedSlot[]>([])
  
  // Computed values that use dynamic values when available, fallback to config
  const maxPriorities = computed(() => {
    const value = dynamicMaxPriorities.value ?? config.public.maxPriorities
    return Math.max(1, Math.min(10, value))
  })
  
  const startHour = computed(() => {
    return dynamicStartHour.value ?? config.public.defaultStartHour
  })
  
  const endHour = computed(() => {
    return dynamicEndHour.value ?? config.public.defaultEndHour
  })
  
  const slotDuration = computed(() => {
    return dynamicSlotDuration.value ?? config.public.defaultSlotDuration
  })
  
  // Actions
  const updateMaxPriorities = (value: number): void => {
    const validValue = Math.max(1, Math.min(10, value))
    dynamicMaxPriorities.value = validValue
    saveSettings()
    console.log('⚙️ Max priorities updated to:', validValue)
  }
  
  const updateTimeGrid = (newConfig: {
    startHour?: number
    endHour?: number
    slotDuration?: number
  }): void => {
    if (newConfig.startHour !== undefined) {
      dynamicStartHour.value = newConfig.startHour
    }
    if (newConfig.endHour !== undefined) {
      dynamicEndHour.value = newConfig.endHour
    }
    if (newConfig.slotDuration !== undefined) {
      dynamicSlotDuration.value = newConfig.slotDuration
    }
    saveSettings()
    console.log('⚙️ Time grid settings updated:', newConfig)
  }
  
  const resetToDefaults = (): void => {
    dynamicMaxPriorities.value = null
    dynamicStartHour.value = null
    dynamicEndHour.value = null
    dynamicSlotDuration.value = null
    blockedSlots.value = []
    saveSettings()
    console.log('⚙️ Settings reset to defaults')
  }
  
  // Blocked slots management
  const addBlockedSlot = (input: CreateBlockedSlotInput): BlockedSlot => {
    const newSlot: BlockedSlot = {
      id: `blocked-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      ...input,
      enabled: true,
      createdAt: new Date()
    }
    
    blockedSlots.value.push(newSlot)
    saveSettings()
    console.log('⚙️ Blocked slot added:', newSlot.title)
    return newSlot
  }
  
  const updateBlockedSlot = (id: string, updates: UpdateBlockedSlotInput): boolean => {
    const index = blockedSlots.value.findIndex(slot => slot.id === id)
    if (index === -1) return false
    
    blockedSlots.value[index] = {
      ...blockedSlots.value[index],
      ...updates
    }
    
    saveSettings()
    console.log('⚙️ Blocked slot updated:', id)
    return true
  }
  
  const removeBlockedSlot = (id: string): boolean => {
    const index = blockedSlots.value.findIndex(slot => slot.id === id)
    if (index === -1) return false
    
    blockedSlots.value.splice(index, 1)
    saveSettings()
    console.log('⚙️ Blocked slot removed:', id)
    return true
  }
  
  const toggleBlockedSlot = (id: string): boolean => {
    const slot = blockedSlots.value.find(slot => slot.id === id)
    if (!slot) return false
    
    slot.enabled = !slot.enabled
    saveSettings()
    console.log('⚙️ Blocked slot toggled:', id, slot.enabled)
    return true
  }
  
  const getBlockedSlotsForDay = (dayOfWeek: number): BlockedSlot[] => {
    return blockedSlots.value.filter(slot => 
      slot.enabled && slot.daysOfWeek.includes(dayOfWeek)
    )
  }
  
  const isTimeSlotBlocked = (dayOfWeek: number, startTime: string, endTime: string): boolean => {
    const dayBlockedSlots = getBlockedSlotsForDay(dayOfWeek)
    
    return dayBlockedSlots.some(blockedSlot => {
      // Check if there's any overlap between the time slot and blocked slot
      const slotStart = timeStringToMinutes(startTime)
      const slotEnd = timeStringToMinutes(endTime)
      const blockedStart = timeStringToMinutes(blockedSlot.startTime)
      const blockedEnd = timeStringToMinutes(blockedSlot.endTime)
      
      // Check for any overlap
      return slotStart < blockedEnd && slotEnd > blockedStart
    })
  }
  
  const getBlockingActivity = (dayOfWeek: number, startTime: string, endTime: string): BlockedSlot | null => {
    const dayBlockedSlots = getBlockedSlotsForDay(dayOfWeek)
    
    return dayBlockedSlots.find(blockedSlot => {
      // Check if there's any overlap between the time slot and blocked slot
      const slotStart = timeStringToMinutes(startTime)
      const slotEnd = timeStringToMinutes(endTime)
      const blockedStart = timeStringToMinutes(blockedSlot.startTime)
      const blockedEnd = timeStringToMinutes(blockedSlot.endTime)
      
      // Check for any overlap
      return slotStart < blockedEnd && slotEnd > blockedStart
    }) || null
  }
  
  // Helper function to convert time string (HH:MM) to minutes since midnight
  const timeStringToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number)
    return hours * 60 + minutes
  }
  
  // Persistence
  const saveSettings = (): void => {
    if (typeof window !== 'undefined') {
      try {
        const settingsData = {
          maxPriorities: dynamicMaxPriorities.value,
          startHour: dynamicStartHour.value,
          endHour: dynamicEndHour.value,
          slotDuration: dynamicSlotDuration.value,
          blockedSlots: blockedSlots.value.map(slot => ({
            ...slot,
            createdAt: slot.createdAt.toISOString()
          })),
          lastUpdated: new Date().toISOString()
        }
        localStorage.setItem('braindump-settings', JSON.stringify(settingsData))
        console.log('💾 Settings saved to localStorage')
      } catch (error) {
        console.error('Error saving settings to localStorage:', error)
      }
    }
  }
  
  const loadSettings = (): void => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('braindump-settings')
        if (saved) {
          const parsedSettings = JSON.parse(saved)
          
          if (parsedSettings.maxPriorities !== undefined) {
            dynamicMaxPriorities.value = parsedSettings.maxPriorities
          }
          if (parsedSettings.startHour !== undefined) {
            dynamicStartHour.value = parsedSettings.startHour
          }
          if (parsedSettings.endHour !== undefined) {
            dynamicEndHour.value = parsedSettings.endHour
          }
          if (parsedSettings.slotDuration !== undefined) {
            dynamicSlotDuration.value = parsedSettings.slotDuration
          }
          if (parsedSettings.blockedSlots && Array.isArray(parsedSettings.blockedSlots)) {
            blockedSlots.value = parsedSettings.blockedSlots.map((slot: any) => ({
              ...slot,
              createdAt: new Date(slot.createdAt)
            }))
          }
          
          console.log('📂 Settings loaded from localStorage:', parsedSettings)
        }
      } catch (error) {
        console.error('Error loading settings from localStorage:', error)
        resetToDefaults()
      }
    }
  }
  
  // Initialize on store creation
  if (typeof window !== 'undefined') {
    loadSettings()
  }
  
  return {
    // Computed settings (readonly)
    maxPriorities: readonly(maxPriorities),
    startHour: readonly(startHour),
    endHour: readonly(endHour),
    slotDuration: readonly(slotDuration),
    blockedSlots: readonly(blockedSlots),
    
    // Raw dynamic values (for settings dialog)
    dynamicMaxPriorities: readonly(dynamicMaxPriorities),
    dynamicStartHour: readonly(dynamicStartHour),
    dynamicEndHour: readonly(dynamicEndHour),
    dynamicSlotDuration: readonly(dynamicSlotDuration),
    
    // Actions
    updateMaxPriorities,
    updateTimeGrid,
    resetToDefaults,
    loadSettings,
    saveSettings,
    
    // Blocked slots actions
    addBlockedSlot,
    updateBlockedSlot,
    removeBlockedSlot,
    toggleBlockedSlot,
    getBlockedSlotsForDay,
    isTimeSlotBlocked,
    getBlockingActivity
  }
})

// Auto-refresh quando localStorage cambia (per multi-tab sync)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'braindump-settings') {
      const store = useSettingsStore()
      store.loadSettings()
    }
  })
}