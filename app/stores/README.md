# Stores Pinia

Questa cartella contiene tutti gli store di gestione dello stato utilizzando Pinia con Composition API.

## 📁 Store Disponibili

### 🎯 `useTasks.ts` - Gestione Task
Store principale per gestire tutti i task del brain dump.

**State:**
- `tasks` - Array di tutti i task
- `currentTask` - Task correntemente selezionato
- `showMaxPriorityAlert` - Stato alert massimo priorità

**Getters:**
- `allTasks` - Tutti i task ordinati per data di creazione

**Actions:**
- `addTask(taskText)` - Aggiunge nuovo task
- `removeTask(taskId)` - Rimuove task per ID
- `updateTask(taskId, updates)` - Aggiorna task esistente
- `setCurrentTask(task)` - Imposta task corrente
- `clearAllTasks()` - Rimuove tutti i task
- `loadTasks()` - Carica da localStorage
- `saveTasks()` - Salva in localStorage

### ⭐ `usePriorities.ts` - Gestione Priorità
Store dedicato per gestire le 3 priorità principali.

**State:**
- `priorities` - Array di 3 slot (Task | null)
- `maxPriorities` - Numero massimo di priorità (3)
- `showMaxAlert` - Stato alert limite raggiunto

**Getters:**
- `priorityCount` - Numero di priorità selezionate
- `hasMaxPriorities` - Se ha raggiunto il limite
- `availableSlots` - Slot disponibili rimasti
- `isEmpty` - Se non ha priorità
- `isFull` - Se ha raggiunto il limite
- `priorityTasks` - Array di task prioritari (senza null)

**Actions:**
- `add(task)` - Aggiunge task alle priorità ✅
- `remove(task)` - Rimuove task dalle priorità ✅
- `removeByIndex(index)` - Rimuove per indice
- `clear()` - Rimuove tutte le priorità
- `reorder(from, to)` - Riordina priorità
- `showAlert()` - Mostra alert limite
- `hideAlert()` - Nasconde alert

**Metodi Utility:**
- `findTaskById(taskId)` - Trova task per ID
- `getTaskAtIndex(index)` - Ottieni task per indice
- `getAllSlots()` - Ottieni tutti gli slot
- `updateTaskInPriorities(task)` - Aggiorna task esistente

## 🔄 Sincronizzazione

### Multi-tab Sync
Entrambi gli store si sincronizzano automaticamente tra tab utilizzando:
- **localStorage** per la persistenza
- **storage events** per il sync multi-tab

### Persistenza
- **Tasks**: `localStorage.braindump-tasks`
- **Priorities**: `localStorage.braindump-priorities`

## 💡 Esempi d'uso

### Utilizzo Base negli Store
```typescript
// In un componente
<script setup>
const tasksStore = useTasksStore()
const prioritiesStore = usePrioritiesStore()

const { tasks } = storeToRefs(tasksStore)
const { priorities, priorityCount } = storeToRefs(prioritiesStore)

// Aggiungere task
const newTask = tasksStore.addTask("Nuovo task")

// Aggiungere alle priorità
const success = prioritiesStore.add(newTask)
if (success) {
  tasksStore.updateTask(newTask.id, { isPriority: true })
}

// Rimuovere dalle priorità
prioritiesStore.remove(task)
tasksStore.updateTask(task.id, { isPriority: false })
</script>
```

### Gestione Priorità
```typescript
// Controllare se un task è priorità
const isTaskPriority = (task: Task) => {
  return prioritiesStore.findTaskById(task.id) !== null
}

// Toggle priorità
const togglePriority = (task: Task) => {
  if (isTaskPriority(task)) {
    prioritiesStore.remove(task)
    tasksStore.updateTask(task.id, { isPriority: false })
  } else {
    const success = prioritiesStore.add(task)
    if (success) {
      tasksStore.updateTask(task.id, { isPriority: true })
    }
  }
}
```

## 🏗 Architettura

### Separazione delle Responsabilità
- **useTasks**: Gestisce il CRUD base dei task
- **usePriorities**: Gestisce logica specifica delle 3 priorità
- **Componenti**: Orchestrano la comunicazione tra store

### Vantaggi
1. **Modularity**: Ogni store ha responsabilità specifiche
2. **Type Safety**: TypeScript completo
3. **Reattività**: Vue reactivity system
4. **Persistenza**: localStorage automatico
5. **Multi-tab**: Sincronizzazione automatica
6. **Performance**: Computed properties ottimizzate

## 🎯 Metodi Richiesti

Come richiesto, lo store delle priorità implementa:

### ✅ `add(task: Task): boolean`
- Aggiunge un task alle priorità
- Ritorna `true` se successo, `false` se limite raggiunto
- Gestisce automaticamente l'alert se necessario

### ✅ `remove(task: Task): boolean`  
- Rimuove un task dalle priorità
- Ritorna `true` se task trovato e rimosso
- Mantiene l'ordine degli slot rimanenti