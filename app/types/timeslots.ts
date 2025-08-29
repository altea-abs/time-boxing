import type { Task } from './task'

/**
 * Slot temporale per il timeboxing
 */
export interface TimeSlot {
  /** ID univoco dello slot */
  id: string
  
  /** Ora di inizio (formato HH:MM) */
  startTime: string
  
  /** Ora di fine (formato HH:MM) */
  endTime: string
  
  /** Task assegnato a questo slot (opzionale) */
  task: Task | null
  
  /** Indica se lo slot è disponibile */
  isAvailable: boolean
  
  /** Note per lo slot */
  notes?: string
}

/**
 * Configurazione della griglia oraria
 */
export interface TimeGridConfig {
  /** Ora di inizio della giornata */
  startHour: number
  
  /** Ora di fine della giornata */
  endHour: number
  
  /** Durata di ogni slot in minuti */
  slotDuration: number
  
  /** Giorni della settimana inclusi */
  includedDays: number[]
}

/**
 * Evento di drop su slot temporale
 */
export interface TimeSlotDropEvent {
  task: Task
  targetSlot: TimeSlot
  sourceSlot?: TimeSlot
}

/**
 * Statistiche del timeboxing
 */
export interface TimeboxingStats {
  totalSlots: number
  occupiedSlots: number
  freeSlots: number
  priorityTasksScheduled: number
  totalScheduledTime: number // in minuti
}

/**
 * Configurazione del calendario
 */
export interface CalendarConfig {
  view: 'day' | 'week'
  currentDate: Date
  timeGrid: TimeGridConfig
}

/**
 * Evento del calendario
 */
export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  task?: Task
  color?: string
}