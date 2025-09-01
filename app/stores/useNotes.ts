import type { DailyNotes } from '~/types'

export const useNotesStore = defineStore('notes', () => {
  // Get runtime config for retention
  const config = useRuntimeConfig()
  
  // State - organized by date
  const notesByDate = ref<Record<string, DailyNotes>>({})
  
  // Get current date notes
  const currentNotes = computed(() => {
    const timeSlotsStore = useTimeSlotsStore()
    const currentDateString = timeSlotsStore.currentDate.toISOString().split('T')[0]
    
    if (!notesByDate.value[currentDateString]) {
      notesByDate.value[currentDateString] = {
        date: currentDateString,
        content: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
    
    return notesByDate.value[currentDateString]
  })
  
  // Get notes for specific date
  const getNotesForDate = (dateString: string): DailyNotes => {
    if (!notesByDate.value[dateString]) {
      notesByDate.value[dateString] = {
        date: dateString,
        content: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
    return notesByDate.value[dateString]
  }
  
  // Get available dates that have notes
  const availableNoteDates = computed(() => {
    const dates = Object.keys(notesByDate.value).filter(date => 
      notesByDate.value[date].content.trim().length > 0
    )
    return dates.sort()
  })
  
  // Statistics
  const notesStats = computed(() => {
    const notesWithContent = Object.values(notesByDate.value).filter(note => 
      note.content.trim().length > 0
    )
    
    const totalCharacters = notesWithContent.reduce((sum, note) => 
      sum + note.content.length, 0
    )
    
    return {
      totalDays: notesWithContent.length,
      totalCharacters,
      averageLength: notesWithContent.length > 0 ? Math.round(totalCharacters / notesWithContent.length) : 0
    }
  })
  
  // Actions
  const updateNotes = (content: string, dateString?: string): DailyNotes => {
    const timeSlotsStore = useTimeSlotsStore()
    const targetDate = dateString ?? timeSlotsStore.currentDate.toISOString().split('T')[0]
    
    if (!notesByDate.value[targetDate]) {
      notesByDate.value[targetDate] = {
        date: targetDate,
        content: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
    
    const notes = notesByDate.value[targetDate]
    const wasEmpty = notes.content.trim().length === 0
    
    notes.content = content
    notes.updatedAt = new Date()
    
    // If this is the first content, update createdAt
    if (wasEmpty && content.trim().length > 0) {
      notes.createdAt = new Date()
    }
    
    saveNotes()
    return notes
  }
  
  const clearNotes = (dateString?: string): void => {
    const timeSlotsStore = useTimeSlotsStore()
    const targetDate = dateString ?? timeSlotsStore.currentDate.toISOString().split('T')[0]
    
    if (notesByDate.value[targetDate]) {
      notesByDate.value[targetDate].content = ''
      notesByDate.value[targetDate].updatedAt = new Date()
      saveNotes()
    }
  }
  
  const deleteNotesForDate = (dateString: string): boolean => {
    if (notesByDate.value[dateString]) {
      delete notesByDate.value[dateString]
      saveNotes()
      return true
    }
    return false
  }
  
  // Cleanup old notes based on retention policy
  const cleanupOldNotes = (): void => {
    const maxDays = config.public.maxDaysRetention || 7
    const today = new Date()
    const cutoffDate = new Date(today)
    cutoffDate.setDate(today.getDate() - maxDays)
    
    const cutoffDateString: string = cutoffDate.toISOString().split('T')[0] || cutoffDate.toISOString().substring(0, 10)
    
    // Count dates to be removed for logging
    const datesToRemove = Object.keys(notesByDate.value).filter(date => date < cutoffDateString)
    
    if (datesToRemove.length > 0) {
      // Remove old notes
      datesToRemove.forEach(date => {
        delete notesByDate.value[date]
      })
      
      console.log(`🧹 Cleaned up notes for ${datesToRemove.length} old dates older than ${maxDays} days`)
      saveNotes()
    }
  }
  
  // Persistence
  const saveNotes = (): void => {
    if (typeof window !== 'undefined') {
      try {
        const notesData = Object.fromEntries(
          Object.entries(notesByDate.value).map(([date, notes]) => [
            date,
            {
              ...notes,
              createdAt: notes.createdAt.toISOString(),
              updatedAt: notes.updatedAt.toISOString()
            }
          ])
        )
        localStorage.setItem('braindump-notes-by-date', JSON.stringify(notesData))
        console.log('💾 Notes saved to localStorage')
      } catch (error) {
        console.error('Error saving notes to localStorage:', error)
      }
    }
  }
  
  const loadNotes = (): void => {
    if (typeof window !== 'undefined') {
      try {
        // Try to load new format first
        const savedByDate = localStorage.getItem('braindump-notes-by-date')
        if (savedByDate) {
          const parsedData = JSON.parse(savedByDate)
          
          notesByDate.value = Object.fromEntries(
            Object.entries(parsedData).map(([date, notes]: [string, any]) => [
              date,
              {
                ...notes,
                createdAt: new Date(notes.createdAt),
                updatedAt: new Date(notes.updatedAt)
              }
            ])
          )
        } else {
          // Migration: check for old format
          const savedOld = localStorage.getItem('braindump-notes')
          if (savedOld && savedOld.trim()) {
            // Migrate old format to new format using today's date
            const today = new Date().toISOString().split('T')[0]
            notesByDate.value = {
              [today]: {
                date: today,
                content: savedOld,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            }
            
            // Save in new format and remove old
            saveNotes()
            localStorage.removeItem('braindump-notes')
            console.log('📂 Migrated old notes format to date-based format')
          }
        }
        
        // Run cleanup after loading
        cleanupOldNotes()
        
        console.log('📂 Notes loaded from localStorage')
      } catch (error) {
        console.error('Error loading notes from localStorage:', error)
        notesByDate.value = {}
      }
    }
  }
  
  // Initialize on store creation
  if (typeof window !== 'undefined') {
    loadNotes()
  }
  
  return {
    // State (readonly)
    notesByDate: readonly(notesByDate),
    currentNotes: readonly(currentNotes),
    
    // Getters
    getNotesForDate,
    availableNoteDates,
    notesStats,
    
    // Actions
    updateNotes,
    clearNotes,
    deleteNotesForDate,
    cleanupOldNotes,
    loadNotes,
    saveNotes
  }
})

// Auto-refresh when localStorage changes (for multi-tab sync)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'braindump-notes-by-date') {
      const store = useNotesStore()
      store.loadNotes()
    }
  })
}