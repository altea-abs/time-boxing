export const useSettingsStore = defineStore('settings', () => {
  // Get initial runtime config
  const config = useRuntimeConfig()
  
  // Local state for dynamic settings (overrides runtime config)
  const dynamicMaxPriorities = ref<number | null>(null)
  const dynamicStartHour = ref<number | null>(null)
  const dynamicEndHour = ref<number | null>(null)
  const dynamicSlotDuration = ref<number | null>(null)
  
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
    saveSettings()
    console.log('⚙️ Settings reset to defaults')
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
    saveSettings
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