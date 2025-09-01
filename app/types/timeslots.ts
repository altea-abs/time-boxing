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

/**
 * Slot bloccato ricorrente
 */
export interface BlockedSlot {
  /** ID univoco dello slot bloccato */
  id: string
  
  /** Titolo/nome dell'attività ricorrente */
  title: string
  
  /** Ora di inizio (formato HH:MM) */
  startTime: string
  
  /** Ora di fine (formato HH:MM) */
  endTime: string
  
  /** Giorni della settimana (0=Domenica, 1=Lunedì, ..., 6=Sabato) */
  daysOfWeek: number[]
  
  /** Colore di visualizzazione (hex) */
  color?: string
  
  /** Descrizione opzionale */
  description?: string
  
  /** Se attivo/disattivo */
  enabled: boolean
  
  /** Data di creazione */
  createdAt: Date
}

/**
 * Input per creare uno slot bloccato
 */
export interface CreateBlockedSlotInput {
  title: string
  startTime: string
  endTime: string
  daysOfWeek: number[]
  color?: string
  description?: string
}

/**
 * Input per aggiornare uno slot bloccato
 */
export interface UpdateBlockedSlotInput {
  title?: string
  startTime?: string
  endTime?: string
  daysOfWeek?: number[]
  color?: string
  description?: string
  enabled?: boolean
}