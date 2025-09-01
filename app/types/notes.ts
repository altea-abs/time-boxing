/**
 * Interfaccia per le note giornaliere
 */
export interface DailyNotes {
  /** Data di riferimento per le note (formato YYYY-MM-DD) */
  date: string
  
  /** Contenuto delle note */
  content: string
  
  /** Data di creazione */
  createdAt: Date
  
  /** Data ultima modifica */
  updatedAt: Date
}

/**
 * Interfaccia per la creazione di nuove note
 */
export interface CreateNotesInput {
  content: string
  date?: string // Se non specificata, usa la data corrente
}

/**
 * Interfaccia per l'aggiornamento delle note
 */
export interface UpdateNotesInput {
  content?: string
  date?: string
}

/**
 * Statistiche sulle note
 */
export interface NotesStats {
  totalDays: number
  totalCharacters: number
  averageLength: number
}