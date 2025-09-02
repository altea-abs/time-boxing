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

### Multi-Store Date-Based System

The application uses specialized Pinia stores with date-based organization and retention policies:

#### 1. `useTasks.ts` - Date-Based Task CRUD Operations
- **Purpose**: Primary task management (create, read, update, delete) organized by date
- **Key Actions**: `addTask(text, dateString?)`, `removeTask(id)`, `updateTask(id, updates)`, `cleanupOldTasks()`
- **Date Organization**: Tasks stored with `date` field, `tasksForCurrentDate` computed property
- **Storage**: localStorage key `braindump-tasks`
- **Retention**: Automatic cleanup of tasks older than `maxDaysRetention`
- **Migration**: Backward compatibility with existing task format

#### 2. `usePriorities.ts` - Date-Based Priority Slot Management  
- **Purpose**: Manages priority slots (1-10, default 5) organized by date
- **Key Structure**: `prioritiesByDate: Record<string, (Task | null)[]>` instead of single array
- **Key Actions**: `add(task)`, `remove(task)`, `removeByIndex(index)`, `cleanupOldPriorities()`
- **Storage**: localStorage key `braindump-priorities`
- **Retention**: Automatic cleanup of priority data older than retention period
- **Migration**: Automatic conversion from old single-array format to date-based format

#### 3. `useTimeSlots.ts` - Multi-Day Time Grid Management with Undo/Redo
- **Purpose**: Dynamic time slot generation with multi-day navigation, blocked slots, and history tracking
- **Navigation Actions**: `goToPreviousDay()`, `goToNextDay()`, `goToToday()`
- **Key Actions**: `generateSlotsForDate(date)`, `assignTaskToSlot()`, `cleanupOldSlots()`
- **Undo/Redo System**: Complete history stack with `undo()`, `redo()`, `canUndo`, `canRedo`
- **History Management**: Tracks slot changes with before/after states, 100-entry limit
- **Conflict Resolution**: Smart overwrite confirmation with swap option for occupied slots
- **Blocked Slots Integration**: Automatically respects configured recurring activities
- **Storage**: localStorage key `braindump-timeslots`
- **Retention Coordination**: Triggers cleanup for all stores when generating slots

#### 4. `useNotes.ts` - Daily Notes with Date Organization
- **Purpose**: Manage daily notes organized by date with retention policy  
- **Key Structure**: `notesByDate: Record<string, DailyNotes>`, `currentNotes` computed
- **Key Actions**: `updateNotes(content, dateString?)`, `clearNotes()`, `cleanupOldNotes()`
- **Storage**: localStorage key `braindump-notes-by-date`
- **Migration**: Automatic migration from old `braindump-notes` to date-based format
- **Retention**: Cleanup notes older than retention period

#### 5. `useSettings.ts` - Configuration Management + Blocked Slots
- **Purpose**: Dynamic configuration override + blocked slots management
- **Configuration Actions**: `updateMaxPriorities()`, `updateTimeGrid()`, `resetToDefaults()`
- **Blocked Slots Actions**: `addBlockedSlot()`, `updateBlockedSlot()`, `removeBlockedSlot()`, `toggleBlockedSlot()`
- **Conflict Detection**: `isTimeSlotBlocked()`, `getBlockingActivity()` for time overlap detection
- **Storage**: localStorage key `braindump-settings`
- **Features**: Real-time updates, multi-tab sync, fallback to .env defaults

### Store Interaction Pattern
Components orchestrate multiple stores for comprehensive data management:

```typescript
const tasksStore = useTasksStore()
const prioritiesStore = usePrioritiesStore()
const notesStore = useNotesStore()
const timeSlotsStore = useTimeSlotsStore()

// Adding a priority requires both stores with date context
const newTask = tasksStore.addTask(text) // Auto-assigns current date
const success = prioritiesStore.add(newTask)
if (success) {
  tasksStore.updateTask(newTask.id, { isPriority: true })
}

// Date navigation triggers coordinated cleanup
timeSlotsStore.goToNextDay() // Triggers cleanup across all stores

// Notes automatically organize by current date
const currentNotes = notesStore.currentNotes // Auto-gets today's notes
```

### Retention System Architecture

The application implements a coordinated retention system across all data types:

```typescript
// Triggered during time slot generation (most common entry point)
const generateSlotsForDate = (date: Date): void => {
  // Cleanup all stores in coordinated fashion
  cleanupOldSlots()
  tasksStore.cleanupOldTasks()
  prioritiesStore.cleanupOldPriorities()
  notesStore.cleanupOldNotes()
}

// All cleanup functions follow same pattern
const cleanupOld[DataType] = (): void => {
  const maxDays = config.public.maxDaysRetention || 7
  const cutoffDateString = getCutoffDate(maxDays)
  
  // Remove data older than cutoff
  // Log cleanup results
  // Save updated data
}
```

## Configuration System

### Runtime Configuration Flow
```
.env → nuxt.config.ts → useSettings → [usePriorities, useTimeSlots, useTasks, useNotes] → Components
```

**Environment Variables** (`.env`):
- `NUXT_MAX_PRIORITIES=5` (1-10 range, default 5)
- `NUXT_ALERT_AUTO_HIDE_DELAY=5000` (1000-30000ms)
- `NUXT_AUTO_SAVE_ENABLED=true`
- `NUXT_DEFAULT_START_HOUR=9` (6-22 range, default 9)
- `NUXT_DEFAULT_END_HOUR=18` (6-22 range, default 18)  
- `NUXT_DEFAULT_SLOT_DURATION=30` (15/30/45/60min, default 30)
- `NUXT_MAX_DAYS_RETENTION=7` (retention period for all data types)

**Configuration Rules**:
- Components NEVER access `useRuntimeConfig()` directly
- All configuration flows through `useSettings` store first
- Other stores consume settings via `storeToRefs(useSettings())`
- Runtime validation with safe min/max constraints
- Reactive updates when config changes

### Dynamic Settings System
- **Settings Panel**: Modal dialog with Alt+S shortcut, Esc to close
- **Real-time Override**: localStorage overrides .env defaults
- **Multi-tab Sync**: Settings changes sync across browser tabs  
- **Reactive Updates**: UI updates immediately when settings change

**Changing Configuration**:
1. **Via Settings Panel** (Recommended): Alt+S → modify settings → save (immediate effect)
2. **Via .env**: Update values → restart dev server → settings store uses new defaults
3. **Reset to Defaults**: Settings panel "Ripristina Default" button

## Component Architecture

### Main Structure
```
app.vue (with Alt+S settings shortcut and modern header)
├── BrainDumpSection.vue (Left column orchestrator)
│   ├── PrioritySection.vue (Dynamic priority slots 1-10)
│   ├── AlertMaxPriority.vue (Vuetify v-alert)
│   ├── TaskInput.vue (Vuetify v-text-field with + icon)
│   └── NotesSection.vue (Daily notes with copy/clear)
├── TimeSlotSection.vue (Right column - dynamic time grid with undo/redo)
├── Dialog/ (Modal components for confirmations)
│   └── DialogOverwriteSlot.vue (Slot overwrite confirmation with swap option)
└── Settings/ (Modal components - 800px width)
    ├── SettingsDialog.vue (Responsive 2-column layout)
    ├── SettingsPriority.vue (Slider 1-10 with +/- buttons)
    ├── SettingsTimeRange.vue (Start/end hour selects)
    ├── SettingsSlotDuration.vue (15/30/45/60min select)
    └── SettingsBlockedSlots.vue (CRUD interface for recurring activities)
```

### Communication Patterns
- **BrainDumpSection** orchestrates task/priority store interactions with date context
- **TimeSlotSection** handles navigation, blocked slots integration, undo/redo operations, and conflict resolution
- **DialogOverwriteSlot** provides user confirmation for occupied slot drops with swap/overwrite options
- **NotesSection** uses reactive computed properties for seamless date-based note management
- Components use `storeToRefs()` for reactive store values
- Event emission for parent-child communication
- Cross-store synchronization via boolean return values and coordinated cleanup
- Global keyboard event handling for undo/redo shortcuts across the application

## Undo/Redo System Architecture

The application implements a comprehensive undo/redo system specifically for time slot operations:

### History Stack Implementation
```typescript
type SlotChange = { slotId: string; beforeTask: Task | null; afterTask: Task | null }
type HistoryEntry = { label: string; changes: SlotChange[]; at: number }
const historyPast = ref<HistoryEntry[]>([])
const historyFuture = ref<HistoryEntry[]>([])
const historyLimit = 100
```

### Key Operations Tracked
- **Task Assignment**: `assignTaskToSlot()` records before/after states
- **Task Removal**: `removeTaskFromSlot()` and `removeTaskFromAllSlots()` 
- **Bulk Operations**: `clearAllSlots()` tracks multiple slot changes
- **Swap Operations**: Task exchanges between occupied slots

### History Management
- **Push History**: `pushHistory(entry)` adds new entries and clears future stack
- **Undo Operation**: `undo()` reverts changes and moves entry to future stack
- **Redo Operation**: `redo()` reapplies changes and moves entry back to past
- **Capacity Management**: Automatically limits to 100 entries to prevent memory issues

### Integration with Components
```typescript
// TimeSlotSection.vue keyboard handlers
const handleKeyDown = (event: KeyboardEvent) => {
  const isCtrlLike = event.ctrlKey || event.metaKey
  if (isCtrlLike && event.key.toLowerCase() === 'z') {
    event.preventDefault()
    if (event.shiftKey) {
      timeSlotsStore.redo() // Ctrl+Shift+Z
    } else {
      timeSlotsStore.undo() // Ctrl+Z
    }
  } else if (isCtrlLike && event.key.toLowerCase() === 'y') {
    timeSlotsStore.redo() // Ctrl+Y
  }
}
```

### UI Controls
- **Undo Button**: Shows when `canUndo` is true, triggers `undo()` action
- **Redo Button**: Shows when `canRedo` is true, triggers `redo()` action
- **Keyboard Shortcuts**: Full support for Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z
- **Visual Feedback**: Button states reflect availability of operations

## TypeScript Organization

### Interface Structure (`/app/types/`)
- `/task.ts` - Core Task interface with date support and CRUD types
- `/notes.ts` - DailyNotes interface, CreateNotesInput, UpdateNotesInput, NotesStats
- `/timeslots.ts` - TimeSlot interfaces, BlockedSlot interfaces, timeboxing features
- `/components.ts` - Component props, emits, events
- `/store.ts` - Store state and action interfaces  
- `/index.ts` - Central export hub for all type definitions

**Import Pattern**:
```typescript
// ✅ Preferred
import type { Task, DailyNotes, BlockedSlot, BrainDumpEmits } from '~/types'

// ❌ Avoid direct file imports
```

## Persistence & Multi-Tab Sync

All stores implement consistent patterns:
- **LocalStorage persistence** with automatic save on mutations
- **Multi-tab synchronization** via storage event listeners  
- **Date object restoration** during JSON parsing (createdAt, updatedAt fields)
- **Migration handling** for backward compatibility when data structures evolve
- **Error handling** with fallback to empty objects/arrays
- **Coordinated cleanup** across all data types based on retention policy

### LocalStorage Keys Used:
- `braindump-tasks` - Task data with date organization
- `braindump-priorities` - Priority data organized by date
- `braindump-timeslots` - Time slot data with multi-day support
- `braindump-notes-by-date` - Notes organized by date (migrated from `braindump-notes`)
- `braindump-settings` - Settings and blocked slots configuration

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

- ✅ **Date-based task management** with CRUD operations and retention policy
- ✅ **Date-based priority system** with configurable limits (1-10, reactive) and automatic cleanup
- ✅ **Multi-day time slots navigation** with Previous/Next/Today controls
- ✅ **Blocked slots system** for recurring activities (meetings, lunch, etc.) with conflict detection
- ✅ **Date-organized notes** with automatic migration and retention cleanup
- ✅ **Coordinated retention system** across all data types (configurable via NUXT_MAX_DAYS_RETENTION)
- ✅ **Runtime configuration** via .env files + dynamic settings panel with blocked slots management
- ✅ **LocalStorage persistence** with multi-tab sync (5 stores) and backward compatibility
- ✅ **Complete TypeScript system** with date-based interfaces and blocked slot types
- ✅ **Settings panel** with blocked slots CRUD interface, real-time preview and validation
- ✅ **Vuetify Material Design** integration with modern header and responsive design
- ✅ **Complete undo/redo system** for time slot operations with keyboard shortcuts
- ✅ **Enhanced conflict resolution** with overwrite confirmation and swap options
- ✅ **Keyboard shortcuts** (Alt+S for settings, Esc to close, Ctrl+Drag for multi-assignment, Ctrl+Z/Y for undo/redo)
- ✅ **Responsive design** (2-column on desktop, single on mobile) with blocked slots integration

## Keyboard Shortcuts & User Interactions

### Global Shortcuts
- **`Alt+S`**: Open/close settings dialog
- **`Alt+H`**: Open/close help dialog
- **`Alt+G`**: Open GitHub repository in new tab
- **`Esc`**: Close any open modal/dialog
- **`Ctrl+Drag`**: Multi-assignment in time slots
- **`Ctrl/Cmd+Z`**: Undo last time slot operation
- **`Ctrl/Cmd+Y`**: Redo time slot operation
- **`Ctrl/Cmd+Shift+Z`**: Alternative redo shortcut

### Settings Dialog Features
- **Modal Width**: 800px (increased from 500px for better layout)
- **Responsive Layout**: 2 columns on desktop, single column on mobile
- **Button Layout**: Reset left-aligned, Cancel/Save right-aligned on desktop
- **Real-time Preview**: Shows statistics updated as you change settings
- **Form Validation**: All inputs have min/max constraints with safe defaults

### Notes Section Features
- **Auto-save**: Changes persist automatically to localStorage
- **Copy Button**: One-click copy all notes to clipboard
- **Clear Button**: Clear all notes with single click
- **Persistent Storage**: Multi-tab synchronization

### Drag & Drop Enhancements  
- **Entire Slot Draggable**: Fixed issue where users selected text instead of dragging
- **Priority Sync**: Tasks dragged to time slots maintain priority status with star indicator
- **Multi-slot Support**: Tasks can be assigned to multiple time slots
- **Blocked Slot Integration**: Drag & drop respects blocked slots with visual feedback
- **Conflict Resolution**: Automatic confirmation dialogs for occupied slot drops
- **Smart Swap Option**: Swap tasks between slots when dragging from existing assignment

### Data Migration & Backward Compatibility
- **Automatic migrations** when upgrading from single-data to date-based organization
- **Graceful fallbacks** for missing date fields in existing data
- **Preservation of existing data** during schema upgrades
- **Logging** of migration and cleanup operations for debugging

The architecture provides clear separation of concerns, type safety, reactive configuration management, and comprehensive data organization suitable for a productivity/timeboxing application with multi-day support and automatic data retention.

## Git Commit Guidelines

This project uses **Conventional Commits** for standardized commit messages. 

### IMPORTANT: Automatic Commits Required
**Claude MUST commit changes automatically after completing any coding task using Conventional Commits format.** Never ask the user to commit - always commit immediately after making changes.

### Commit Message Format
```
<type>[optional scope]: <description>

[optional body - max 100 chars per line]

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Commit Types
- **feat**: ✨ New feature
- **fix**: 🐛 Bug fix  
- **docs**: 📚 Documentation changes
- **style**: 💎 Code style changes (formatting, etc.)
- **refactor**: 📦 Code refactoring
- **perf**: 🚀 Performance improvements
- **test**: 🚨 Adding or updating tests
- **build**: 🛠 Build system or dependency changes
- **ci**: ⚙️ CI/CD configuration changes
- **chore**: ♻️ Other maintenance tasks
- **revert**: 🗑 Revert previous commit
- **wip**: 🚧 Work in progress (for development)

### Automatic Commit Process
1. **Check Status**: Run `git status` and `git diff` to understand changes
2. **Stage Files**: Add relevant files with `git add`
3. **Commit**: Use heredoc format with proper line length (max 100 chars)
4. **Include Footer**: Always add Claude Code attribution footer

### Commit Command Template
```bash
git commit -m "$(cat <<'EOF'
<type>(<scope>): <description>

<body with details about the changes>
- Feature 1 implemented
- Bug 2 fixed
- Component 3 refactored

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Examples
```bash
feat(ui): add modern header with help dialog and animations
fix(layout): resolve Vuetify layout injection error
docs(claude): update commit guidelines for automatic commits
refactor(components): extract HelpDialog into dedicated component
```

### Tools Available
- `npm run commit` - Interactive commit with Commitizen (for manual use)
- Pre-commit hooks automatically run lint and typecheck
- CommitLint validates all commit messages

**Remember: Always commit automatically - never skip this step!**

## Development Guidelines

### IMPORTANT: Feature Implementation Policy
**Claude MUST implement ONLY the specific features explicitly requested by the user.** Never add additional features, enhancements, or "nice-to-have" functionality without explicit user request.

#### Core Principles:
1. **Exact Requirements Only**: Implement exactly what the user asks for, nothing more
2. **No Assumptions**: Don't assume the user wants related or complementary features
3. **No Proactive Additions**: Don't add features "while you're at it" or "for completeness"
4. **Ask Before Expanding**: If a feature seems incomplete, ask the user before adding anything

#### Examples:
- ✅ **User asks**: "Add setting to change number of priorities"  
  **Correct**: Add only priority number control
- ❌ **Wrong**: Add priority control + time settings + other configurations

- ✅ **User asks**: "Fix the drag and drop issue"  
  **Correct**: Fix only the specific drag and drop problem
- ❌ **Wrong**: Fix drag + add new drag features + improve UI

#### When in Doubt:
- Implement the minimum viable solution
- Ask the user if they want additional features
- Focus on the specific problem mentioned
- Avoid feature creep and scope expansion

**This ensures focused development and prevents unwanted complexity.**

### IMPORTANT: Incremental Development and Commits
**Claude MUST develop and commit features incrementally using atomic commits.** Never bundle multiple features or components in a single commit, even if they're related.

#### Incremental Development Principles:
1. **One Feature Per Commit**: Each commit should contain exactly one logical change
2. **Atomic Commits**: Each commit should be self-contained and functional
3. **Sequential Implementation**: Build features step-by-step, committing each step
4. **Clear Commit Messages**: Each commit message should reflect the single change made

#### Implementation Process:
1. **Break Down Tasks**: Divide complex features into smaller, independent components
2. **Implement Incrementally**: Code one component at a time
3. **Commit Immediately**: Commit each component as soon as it's complete
4. **Test Each Step**: Ensure each commit works before moving to the next

#### Example - Settings Panel Request:
**User Request**: "Add settings panel to change number of priorities"

**✅ Correct Incremental Approach:**
1. `feat(ui): add settings button to header` - Add settings icon and click handler
2. `feat(components): create basic SettingsDialog component` - Create modal structure
3. `feat(settings): add priority number control to dialog` - Add slider/input for priorities
4. `feat(stores): create useSettings store for dynamic config` - Add settings persistence
5. `fix(priorities): integrate settings store with priorities` - Connect stores

**❌ Wrong Monolithic Approach:**
1. `feat(settings): add comprehensive settings panel with dynamic configuration` - Everything in one commit

#### Benefits:
- **Clear History**: Easy to understand what changed when
- **Easy Debugging**: Pinpoint exactly which change caused issues
- **Better Reviews**: Each change can be reviewed independently
- **Rollback Safety**: Can revert specific features without affecting others
- **Conventional Commits**: Proper semantic versioning and changelog generation

#### When Working on Multiple Related Changes:
- Still commit each logical piece separately
- Use consistent commit message prefixes to show relationship
- Maintain functional state after each commit
- Test thoroughly between commits

**This ensures clean git history and professional development practices.**

## Component Organization and Naming

### Folder Structure and Naming Conventions
When organizing components in folders, follow these strict naming conventions:

#### Component Naming Rules:
1. **Folder Name Prefix**: Component files MUST start with the folder name
2. **PascalCase**: Use PascalCase for both folder and component names
3. **Descriptive Names**: Use clear, descriptive names for functionality

#### Examples:
```
// ✅ CORRECT Naming
app/components/Settings/SettingsDialog.vue
app/components/Settings/SettingsPriority.vue  
app/components/Settings/SettingsTimeRange.vue
app/components/Alert/AlertMaxPriority.vue
app/components/Task/TaskInput.vue

// ❌ WRONG Naming  
app/components/Settings/PrioritySettings.vue  // Missing Settings prefix
app/components/Settings/Dialog.vue           // Missing Settings prefix
app/components/Alert/MaxPriority.vue         // Missing Alert prefix
```

#### Import Behavior:
- **Nuxt Auto-Import**: Uses the filename only, NOT the folder structure
- `Settings/SettingsDialog.vue` → Import as `<SettingsDialog>`
- `Settings/SettingsPriority.vue` → Import as `<SettingsPriority>`  
- `Alert/AlertMaxPriority.vue` → Import as `<AlertMaxPriority>`

#### Benefits:
- **Clear Organization**: Folder structure groups related components
- **Unique Names**: Prefix prevents naming conflicts
- **Easy Identification**: Component name indicates its category/purpose
- **Consistent Structure**: All components follow same pattern

#### When Creating New Components:
1. **Identify Category**: Determine which folder/category it belongs to
2. **Use Prefix**: Start filename with folder name (e.g., Settings → Settings*)
3. **Descriptive Suffix**: Add clear description of functionality
4. **PascalCase**: Maintain consistent casing throughout

**This ensures consistent, organized, and conflict-free component structure.**