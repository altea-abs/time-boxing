# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Build for production
npm run preview      # Preview production build
npm run generate     # Generate static site
```

## Core Architecture

This is a **Brain Dump & Timeboxing** application built with **Nuxt 4**, **Vue 3**, **TypeScript**, **Pinia**, and **Vuetify 3** using Material Design with dark theme default.

### Tech Stack
- **Nuxt 4** (v4.0.3) - Meta-framework with auto-imports and file-based routing
- **Pinia** (v3.0.3) - State management with Composition API
- **Vuetify 3** (v3.9.5) - Material Design components with MDI icons
- **TypeScript** - Complete type safety across the application

## State Management Architecture

### Dual Store System

The application uses two specialized Pinia stores that work together:

#### 1. `useTasks.ts` - Task CRUD Operations
- **Purpose**: Primary task management (create, read, update, delete)
- **Key Actions**: `addTask(text)`, `removeTask(id)`, `updateTask(id, updates)`
- **Storage**: localStorage key `braindump-tasks`
- **Returns**: Meaningful booleans for success/failure

#### 2. `usePriorities.ts` - Priority Slot Management  
- **Purpose**: Manages limited priority slots (configurable 1-10, default 5)
- **Key Actions**: `add(task)`, `remove(task)`, `removeByIndex(index)`
- **Storage**: localStorage key `braindump-priorities`
- **Business Logic**: Handles max priority limits, validation, alerts

### Store Interaction Pattern
Components orchestrate both stores for priority management:

```typescript
const tasksStore = useTasksStore()
const prioritiesStore = usePrioritiesStore()

// Adding a priority requires both stores
const newTask = tasksStore.addTask(text)
const success = prioritiesStore.add(newTask)
if (success) {
  tasksStore.updateTask(newTask.id, { isPriority: true })
}
```

## Configuration System

### Runtime Configuration Flow
```
.env → nuxt.config.ts → usePrioritiesStore → Components
```

**Environment Variables** (`.env`):
- `NUXT_MAX_PRIORITIES=5` (1-10 range, default 5)
- `NUXT_ALERT_AUTO_HIDE_DELAY=5000` (1000-30000ms)
- `NUXT_AUTO_SAVE_ENABLED=true`

**Configuration Rules**:
- Components NEVER access `useRuntimeConfig()` directly
- All configuration flows through `usePrioritiesStore`
- Runtime validation with safe min/max constraints
- Reactive updates when config changes

**Changing Configuration**:
1. Update `.env` values
2. Restart dev server (`npm run dev`)
3. Store automatically reflects new config with validation
4. UI updates reactively

## Component Architecture

### Main Structure
```
app.vue
├── BrainDumpSection.vue (Orchestrator)
│   ├── PrioritySection.vue (Shows 3+ priority slots)
│   ├── AlertMaxPriority.vue (Vuetify v-alert)
│   └── TaskInput.vue (Vuetify v-text-field with + icon)
```

### Communication Patterns
- **BrainDumpSection** orchestrates store interactions
- Components use `storeToRefs()` for reactive store values
- Event emission for parent-child communication
- Cross-store synchronization via boolean return values

## TypeScript Organization

### Interface Structure (`/app/types/`)
- `/task.ts` - Core Task interface and CRUD types
- `/components.ts` - Component props, emits, events
- `/store.ts` - Store state and action interfaces  
- `/timeslots.ts` - Future timeboxing features
- `/index.ts` - Central export hub

**Import Pattern**:
```typescript
// ✅ Preferred
import type { Task, BrainDumpEmits } from '~/types'

// ❌ Avoid direct file imports
```

## Persistence & Multi-Tab Sync

Both stores implement:
- **LocalStorage persistence** with automatic save on mutations
- **Multi-tab synchronization** via storage event listeners
- **Error handling** with fallback to empty arrays
- **Date object restoration** during JSON parsing

## Key Development Patterns

### Working with Stores
```typescript
// ✅ Proper reactive store usage
const store = usePrioritiesStore()
const { priorities, maxPriorities } = storeToRefs(store)
const success = store.add(task)

// ❌ Avoid direct state mutation
store.priorities[0] = newTask
```

### Adding New Features
1. **Types First**: Define interfaces in `/app/types/`
2. **Store Actions**: Add to appropriate store with boolean returns
3. **Component Integration**: Use `storeToRefs()` and emit patterns
4. **Configuration**: Follow `.env` → `nuxt.config.ts` → store flow

### Vuetify Components
- Import components explicitly: `import { VAlert, VBtn } from 'vuetify/components'`
- Use MDI icons: `icon="mdi-plus"`
- Dark theme enabled by default in plugin configuration

## Current Implementation Status

- ✅ Task management with CRUD operations
- ✅ Priority system with configurable limits
- ✅ Runtime configuration via .env files
- ✅ LocalStorage persistence with multi-tab sync
- ✅ Vuetify Material Design integration
- ✅ Complete TypeScript type system
- 🔄 Future: Timeboxing/scheduling features

The architecture provides clear separation of concerns, type safety, and reactive configuration management suitable for a productivity/timeboxing application.