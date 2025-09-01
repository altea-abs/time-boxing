/**
 * Interfaccia principale per rappresentare un task nel sistema
 */
export interface Task {
  /** ID univoco del task */
  id: string
  
  /** Testo/contenuto del task */
  text: string
  
  /** Indica se il task è contrassegnato come priorità */
  isPriority: boolean
  
  /** Data di creazione del task */
  createdAt: Date
  
  /** Data di riferimento per il task (formato YYYY-MM-DD) */
  date: string
}

/**
 * Interfaccia per creare un nuovo task (senza ID e data di creazione)
 */
export interface CreateTaskInput {
  text: string
  isPriority?: boolean
  date?: string // Se non specificata, usa la data corrente
}

/**
 * Interfaccia per aggiornare un task esistente
 */
export interface UpdateTaskInput {
  text?: string
  isPriority?: boolean
  date?: string
}

/**
 * Statistiche sui task
 */
export interface TaskStats {
  total: number
  priorities: number
  completed: number
}