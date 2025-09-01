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