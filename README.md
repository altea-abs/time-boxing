# 🧠⚡ Brain Dump & Timeboxing Daily Planner

Un'applicazione web moderna per la gestione delle attività quotidiane e la pianificazione temporale, costruita con **Nuxt 4**, **Vue 3**, **TypeScript** e **Vuetify 3**.

<div align="center">

## 🚀 Demo Live

### 🌐 **[► Prova l'applicazione qui ◄](https://altea-abs.github.io/time-boxing/)**

*Testa subito tutte le funzionalità direttamente nel browser - nessuna installazione richiesta!*

---

</div>

![Nuxt 4](https://img.shields.io/badge/Nuxt-4.0.3-00C58E?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vuetify](https://img.shields.io/badge/Vuetify-3.9.5-1867C0?style=for-the-badge&logo=vuetify&logoColor=white)

## 🌟 Caratteristiche Principali

### 🧠 **Brain Dump**
- **Cattura rapida** di tutti i tuoi pensieri e task
- **Sistema di priorità** configurabile (1-10 priorità, default 5)
- **Drag & Drop** intuitivo per riorganizzare
- **Organizzazione per data** - tasks e priorità organizzati per giorno
- **Persistenza automatica** con sincronizzazione multi-tab
- **Sistema di retention** configurabile per cleanup automatico dati vecchi
- **Sezione Note** per riflessioni giornaliere con organizzazione per data

### ⏰ **Time Slots**
- **Griglia temporale personalizzabile** (orari di lavoro, durata slot)
- **Navigazione multi-giorno** con frecce precedente/successivo e scorciatoia `Alt+T`
- **Slot bloccati** configurabili per attività ricorrenti (riunioni, pranzo, ecc.)
- **Assegnazione flessibile** task → slot temporali con visualizzazione attività bloccate
- **Multi-Assignment** con due modalità:
  - 🔘 **Toggle Button**: Click per attivare/disattivare
  - ⌨️ **Ctrl+Drag**: Tieni Ctrl durante il drag per selezione multipla
- **Slot adiacenti intelligenti** - espandi automaticamente task vicini
- **Sistema di retention** - dati vecchi rimossi automaticamente dopo N giorni

### 📊 **Dashboard & Statistiche**
- **Statistiche in tempo reale** (slot totali, occupati, priorità, slot bloccati)
- **Visualizzazione task assegnati** con raggruppamento per attività
- **Contatori dinamici** tempo programmato e priorità
- **Statistiche note** (giorni totali, caratteri, lunghezza media)

### ⚙️ **Pannello Impostazioni**
- **Configurazione dinamica** numero priorità (1-10)
- **Orari di lavoro personalizzabili** (inizio/fine giornata)
- **Durata slot configurabile** (15/30/45/60 minuti)
- **Gestione slot bloccati** - crea, modifica, elimina attività ricorrenti
- **Configurazione retention** - imposta giorni di mantenimento dati
- **Anteprima in tempo reale** delle modifiche
- **Shortcut keyboard**: `Alt+S` per aprire, `Esc` per chiudere

### 🎨 **Design & UX**
- **Material Design 3** con Vuetify
- **Dark/Light Mode automatico** basato su preferenze sistema
- **Design responsivo** ottimizzato per mobile e desktop
- **Animazioni fluide** per feedback visivo immediato
- **Header modernizzato** con gradient e animazioni


## 🛠 Tecnologie Utilizzate

| Tecnologia | Versione | Ruolo |
|------------|----------|--------|
| **Nuxt** | 4.0.3 | Meta-framework Vue con SSR/SSG |
| **Vue** | 3.x | Framework JavaScript reattivo |
| **TypeScript** | 5.x | Type safety e migliore DX |
| **Vuetify** | 3.9.5 | Componenti Material Design |
| **Pinia** | 3.0.3 | State management moderno |
| **Vite** | - | Build tool veloce |

## 🏗 Architettura del Progetto

### 📁 Struttura Directory
```
app/
├── components/           # Componenti Vue riutilizzabili
│   ├── BrainDumpSection.vue
│   ├── TimeSlotSection.vue
│   ├── PrioritySection.vue
│   ├── NotesSection.vue
│   └── Settings/         # Componenti pannello impostazioni
│       ├── SettingsDialog.vue
│       ├── SettingsPriority.vue
│       ├── SettingsTimeRange.vue
│       └── SettingsSlotDuration.vue
├── stores/              # Pinia stores per state management
│   ├── useTasks.ts      # CRUD operazioni task con organizzazione per data
│   ├── usePriorities.ts # Gestione priorità (1-10 slot) per data
│   ├── useTimeSlots.ts  # Gestione time slots, assegnazioni e navigazione multi-giorno
│   ├── useNotes.ts      # Gestione note giornaliere con retention
│   └── useSettings.ts   # Configurazione dinamica e gestione slot bloccati
├── types/               # Definizioni TypeScript
│   ├── task.ts          # Interfacce task con supporto date
│   ├── notes.ts         # Interfacce note giornaliere
│   ├── timeslots.ts     # Interfacce time slots e slot bloccati
│   ├── components.ts
│   └── store.ts
├── plugins/             # Plugin Nuxt
│   └── vuetify.client.ts
└── app.vue             # Componente root
```

### 🏪 Sistema Multi-Store Specializzato

L'applicazione utilizza un'architettura di store specializzati con organizzazione per data:

#### 1. **`useTasks.ts`** - Operazioni CRUD Task
- Gestione primaria dei task (create, read, update, delete)
- **Organizzazione per data**: `tasksForCurrentDate` computed property
- **Sistema retention**: cleanup automatico task vecchi
- Persistenza localStorage con chiave `braindump-tasks`

#### 2. **`usePriorities.ts`** - Gestione Slot Priorità per Data
- Gestione slot priorità organizzati per data (`prioritiesByDate`)
- **Retention system**: cleanup priorità vecchie automatico
- Migrazione automatica da formato singolo a formato per data
- Alerts automatici quando si raggiunge il limite

#### 3. **`useTimeSlots.ts`** - Timeboxing Multi-Giorno
- Generazione dinamica slot temporali con navigazione giorni
- **Navigazione multi-giorno**: `goToPreviousDay`, `goToNextDay`, `goToToday`
- **Integrazione slot bloccati**: rispetta attività ricorrenti configurate
- **Sistema retention**: cleanup coordinato di tutti i store
- Assegnazione task → slot con supporto multi-assignment

#### 4. **`useNotes.ts`** - Note Giornaliere
- **Organizzazione per data**: `notesByDate` con computed `currentNotes`
- **Migrazione automatica**: da formato singolo a organizzazione per data
- **Sistema retention**: cleanup note vecchie automatico
- Persistenza localStorage con chiave `braindump-notes-by-date`

#### 5. **`useSettings.ts`** - Configurazione Dinamica e Slot Bloccati
- Override runtime dei valori di configurazione
- **Gestione slot bloccati**: CRUD per attività ricorrenti
- **Rilevamento conflitti**: `isTimeSlotBlocked`, `getBlockingActivity`  
- Persistenza localStorage delle impostazioni personalizzate

### ⚙️ Sistema di Configurazione

```bash
# File .env per configurazione runtime
NUXT_MAX_PRIORITIES=5              # Numero max priorità (1-10)
NUXT_ALERT_AUTO_HIDE_DELAY=5000    # Durata alert in ms
NUXT_AUTO_SAVE_ENABLED=true        # Auto-save attivo
NUXT_DEFAULT_START_HOUR=9          # Orario inizio giornata
NUXT_DEFAULT_END_HOUR=18           # Orario fine giornata
NUXT_DEFAULT_SLOT_DURATION=30      # Durata slot in minuti
NUXT_MAX_DAYS_RETENTION=7          # Giorni retention per cleanup automatico
```

**Flusso di configurazione**: `.env` → `nuxt.config.ts` → `useSettings` → Stores → Componenti

**Configurazione dinamica**: Il pannello impostazioni permette di sovrascrivere i valori di default in tempo reale, con persistenza localStorage e sincronizzazione multi-tab.

## 🚀 Installazione e Avvio

### Prerequisiti
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Setup Rapido
```bash
# Clone del repository
git clone https://github.com/altea-abs/time-boxing.git
cd time-boxing

# Installazione dipendenze
npm install

# Avvio sviluppo
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:3000`

### 📋 Comandi Disponibili
```bash
npm run dev          # Server sviluppo con hot-reload
npm run build        # Build produzione
npm run preview      # Anteprima build produzione
npm run generate     # Generazione sito statico per GitHub Pages
npm run lint         # Linting codice
npm run typecheck    # Controllo tipi TypeScript
```

## 🎯 Guida Utilizzo

### 1. **Brain Dump - Cattura Pensieri**
- Scrivi qualsiasi task o pensiero nell'input
- Click su task per aggiungerlo alle priorità
- Trascina per riordinare o assegnare a time slot

### 2. **Gestione Priorità**  
- Sistema configurabile (default 5 slot priorità)
- Drag & drop per riorganizzare
- Alert automatico al raggiungimento limite

### 3. **Time Slots - Pianificazione Multi-Giorno**
- Griglia oraria personalizzabile (default 9:00-18:00, slot 30min)
- **Navigazione giorni**: Usa frecce ← → o scorciatoia `Alt+T` per andare a oggi
- **Slot bloccati**: Visualizza automaticamente attività ricorrenti configurate
- **Assegnazione Singola**: Drag task → slot disponibile
- **Multi-Assignment**: 
  - 🔘 Attiva toggle "Multi-Assign" → drag attraverso più slot
  - ⌨️ Tieni `Ctrl` + drag attraverso slot multipli

### 4. **Note Giornaliere per Data**
- Sezione dedicata per riflessioni e promemoria organizzate per giorno
- **Auto-organizzazione**: Note automaticamente associate al giorno corrente
- **Migrazione automatica**: Note esistenti migrate al nuovo sistema
- Persistenza automatica con localStorage e cleanup automatico dati vecchi
- Funzioni copia/cancella per gestione veloce

### 5. **Pannello Impostazioni** (`Alt+S`)
- **Priorità**: Configura numero massimo (1-10)
- **Orari**: Personalizza inizio/fine giornata lavorativa  
- **Slot**: Scegli durata (15/30/45/60 minuti)
- **Slot Bloccati**: Gestisci attività ricorrenti (riunioni, pranzi, ecc.)
  - Crea slot con titolo, orario, giorni della settimana, colore
  - Modifica/elimina slot esistenti
  - Abilita/disabilita slot temporaneamente
- **Retention**: Configura giorni di mantenimento dati (predefinito da .env)
- **Anteprima**: Visualizza statistiche aggiornate in tempo reale
- **Layout responsivo**: Due colonne su desktop, singola su mobile

### ⌨️ **Keyboard Shortcuts**
- **`Alt+S`**: Apri/chiudi pannello impostazioni
- **`Alt+T`**: Vai a oggi nei time slot
- **`Alt+H`**: Apri/chiudi guida interattiva
- **`Alt+G`**: Apri repository GitHub
- **`Esc`**: Chiudi modali aperti
- **`Ctrl+Drag`**: Multi-assegnazione task su time slots

## 🔧 Personalizzazione

### Configurazione Time Grid
```typescript
// Default in useTimeSlots.ts
const defaultGridConfig = {
  startHour: 9,        // Inizio giornata
  endHour: 18,         // Fine giornata  
  slotDuration: 30,    // Durata slot in minuti
  includedDays: [1,2,3,4,5] // Giorni lavorativi
}
```

### Temi e Styling
- **Auto Dark/Light Mode** basato su preferenze sistema
- **Vuetify Material Design** con token di colore personalizzabili
- **CSS custom properties** per temi personalizzati

## 🤝 Contribuire

1. **Fork** il repository
2. Crea branch feature: `git checkout -b feature/amazing-feature`
3. Commit modifiche: `git commit -m 'Add amazing feature'`  
4. Push branch: `git push origin feature/amazing-feature`
5. Apri **Pull Request**

### 🛠 Guidelines Sviluppo
- **TypeScript strict mode** per type safety
- **Composition API** per logica componenti
- **Pinia stores** per state management
- **Vuetify components** per UI consistency
- **Conventional Commits** per messaggi git standardizzati

### 📝 Conventional Commits

Questo progetto usa **Conventional Commits** per messaggi git standardizzati e changelog automatico.

#### Comandi Disponibili
```bash
npm run commit        # Commit interattivo con Commitizen
npm run commit:retry  # Riprova ultimo commit fallito
git commit -m "..."   # Commit normale (validato da CommitLint)
```

#### Formato Commit
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Tipi Disponibili
- **feat**: ✨ Nuova funzionalità
- **fix**: 🐛 Correzione bug
- **docs**: 📚 Solo documentazione
- **style**: 💎 Modifiche stilistiche
- **refactor**: 📦 Refactoring codice
- **perf**: 🚀 Miglioramenti performance
- **test**: 🚨 Test aggiunti/modificati
- **build**: 🛠 Build system/dipendenze
- **ci**: ⚙️ Configurazione CI/CD
- **chore**: ♻️ Maintenance generale
- **revert**: 🗑 Ripristino commit precedente

#### Esempi
```bash
feat(auth): add user login functionality
fix(ui): resolve button alignment issue
docs(readme): update installation instructions
chore(deps): upgrade Nuxt to v4.0.3
```

## 📝 License

Questo progetto è distribuito sotto licenza **MIT**. Vedi il file `LICENSE` per dettagli.

## 🙏 Acknowledgments

- **Nuxt Team** per il fantastico meta-framework
- **Vuetify Team** per i componenti Material Design
- **Vue.js Community** per l'ecosistema incredibile

---

<div align="center">

**Costruito con ❤️ usando Nuxt 4 e Vue 3**

[🌐 Demo](https://altea-abs.github.io/time-boxing/) • [📖 Docs](https://github.com/altea-abs/time-boxing/wiki) • [🐛 Issues](https://github.com/altea-abs/time-boxing/issues) • [💬 Discussions](https://github.com/altea-abs/time-boxing/discussions)

</div>
