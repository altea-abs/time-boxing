# Interfacce TypeScript

Questa cartella contiene tutte le definizioni delle interfacce TypeScript utilizzate nell'applicazione.

## Struttura

### 📁 Tipi Principali

#### `task.ts`
Interfacce relative ai task del brain dump:
- `Task` - Interfaccia principale per un task
- `CreateTaskInput` - Input per creare un nuovo task
- `UpdateTaskInput` - Input per aggiornare un task esistente
- `TaskStats` - Statistiche sui task

#### `store.ts`
Interfacce per la gestione dello stato con Pinia:
- `TasksStoreState` - Stato del store
- `TasksStoreGetters` - Getters computati
- `TasksStoreActions` - Actions disponibili
- `StorageConfig` - Configurazione localStorage
- `TaskFilters` - Filtri per i task
- `TaskSorting` - Ordinamento dei task

#### `components.ts`
Interfacce per i componenti Vue:
- `AlertProps` - Props per gli alert
- `BrainDumpEmits` - Eventi del BrainDumpSection
- `PriorityEmits` - Eventi del PrioritySection
- `TaskInputEmits` - Eventi del TaskInput
- `TaskDragEvent` - Eventi di drag & drop

#### `timeslots.ts`
Interfacce per il sistema di timeboxing (funzionalità future):
- `TimeSlot` - Slot temporale
- `TimeGridConfig` - Configurazione griglia oraria
- `CalendarEvent` - Eventi del calendario
- `TimeboxingStats` - Statistiche timeboxing

### 📁 Indice

#### `index.ts`
File principale che esporta tutte le interfacce. Utilizzare:

```typescript
import type { Task, AlertProps, TimeSlot } from '~/types'
```

## Convenzioni

### Naming
- **Interfacce**: PascalCase (es. `Task`, `AlertProps`)
- **Tipi**: PascalCase (es. `TaskStatus`)
- **Props**: Suffisso `Props` (es. `AlertProps`)
- **Emit**: Suffisso `Emits` (es. `BrainDumpEmits`)

### Documentazione
- Ogni interfaccia ha commenti JSDoc
- Proprietà complesse sono documentate
- Esempi d'uso quando necessari

### Import
- Sempre utilizzare `import type` per le interfacce
- Preferire import dall'index: `~/types` invece di `~/types/task`
- Raggruppare import correlati

## Esempi d'uso

```typescript
// ✅ Corretto
import type { Task, BrainDumpEmits } from '~/types'

// ❌ Evitare
import { Task } from '~/types/task'
import { BrainDumpEmits } from '~/types/components'
```

```typescript
// Utilizzo in un componente
<script setup lang="ts">
import type { Task, TaskInputEmits } from '~/types'

const emit = defineEmits<TaskInputEmits>()

const handleTask = (task: Task) => {
  // logica...
}
</script>
```