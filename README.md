# 🧠⚡ Brain Dump & Timeboxing Daily Planner

Un'applicazione web moderna per la gestione delle attività quotidiane e la pianificazione temporale, costruita con **Nuxt 4**, **Vue 3**, **TypeScript** e **Vuetify 3**.

![Nuxt 4](https://img.shields.io/badge/Nuxt-4.0.3-00C58E?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vuetify](https://img.shields.io/badge/Vuetify-3.9.5-1867C0?style=for-the-badge&logo=vuetify&logoColor=white)

## 🌟 Caratteristiche Principali

### 🧠 **Brain Dump**
- **Cattura rapida** di tutti i tuoi pensieri e task
- **Sistema di priorità** configurabile (1-10 priorità, default 5)
- **Drag & Drop** intuitivo per riorganizzare
- **Persistenza automatica** con sincronizzazione multi-tab

### ⏰ **Time Slots**
- **Griglia temporale personalizzabile** (orari di lavoro, durata slot)
- **Assegnazione flessibile** task → slot temporali
- **Multi-Assignment** con due modalità:
  - 🔘 **Toggle Button**: Click per attivare/disattivare
  - ⌨️ **Ctrl+Drag**: Tieni Ctrl durante il drag per selezione multipla
- **Slot adiacenti intelligenti** - espandi automaticamente task vicini

### 📊 **Dashboard & Statistiche**
- **Statistiche in tempo reale** (slot totali, occupati, priorità)
- **Visualizzazione task assegnati** con raggruppamento per attività
- **Contatori dinamici** tempo programmato e priorità

### 🎨 **Design & UX**
- **Material Design 3** con Vuetify
- **Dark/Light Mode automatico** basato su preferenze sistema
- **Design responsivo** ottimizzato per mobile e desktop
- **Animazioni fluide** per feedback visivo immediato

## 🚀 Demo Live

🌐 **[Prova l'applicazione qui](https://plongo.github.io/timeboxing/)**

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
│   └── AssignedTasksSection.vue
├── stores/              # Pinia stores per state management
│   ├── useTasks.ts      # CRUD operazioni task
│   ├── usePriorities.ts # Gestione priorità (1-10 slot)
│   └── useTimeSlots.ts  # Gestione time slots e assegnazioni
├── types/               # Definizioni TypeScript
│   ├── task.ts
│   ├── components.ts
│   ├── store.ts
│   └── timeslots.ts
├── plugins/             # Plugin Nuxt
│   └── vuetify.client.ts
└── app.vue             # Componente root
```

### 🏪 Sistema di Store Duale

L'applicazione utilizza un'architettura di store specializzati:

#### 1. **`useTasks.ts`** - Operazioni CRUD
- Gestione primaria dei task (create, read, update, delete)
- Persistenza localStorage con chiave `braindump-tasks`
- Ritorna booleani per successo/fallimento operazioni

#### 2. **`usePriorities.ts`** - Gestione Slot Priorità
- Gestione slot di priorità limitati (configurabili 1-10)
- Logica di business per limiti massimi e validazione
- Alerts automatici quando si raggiunge il limite

#### 3. **`useTimeSlots.ts`** - Timeboxing
- Generazione dinamica slot temporali
- Assegnazione task → slot con supporto multi-assignment
- Statistiche in tempo reale e visualizzazioni

### ⚙️ Sistema di Configurazione

```bash
# File .env per configurazione runtime
NUXT_MAX_PRIORITIES=5              # Numero max priorità (1-10)
NUXT_ALERT_AUTO_HIDE_DELAY=5000    # Durata alert in ms
NUXT_AUTO_SAVE_ENABLED=true        # Auto-save attivo
```

**Flusso di configurazione**: `.env` → `nuxt.config.ts` → `usePrioritiesStore` → Componenti

## 🚀 Installazione e Avvio

### Prerequisiti
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Setup Rapido
```bash
# Clone del repository
git clone https://github.com/plongo/timeboxing.git
cd timeboxing

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

### 3. **Time Slots - Pianificazione**
- Griglia oraria personalizzabile (default 9:00-18:00, slot 30min)
- **Assegnazione Singola**: Drag task → slot
- **Multi-Assignment**: 
  - 🔘 Attiva toggle "Multi-Assign" → drag attraverso più slot
  - ⌨️ Tieni `Ctrl` + drag attraverso slot multipli

### 4. **Visualizzazione Attività**
- Sezione "Task Assegnati" mostra pianificazione giornaliera
- Raggruppamento per task con slot multipli
- Statistiche tempo totale programmato

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

## 📝 License

Questo progetto è distribuito sotto licenza **MIT**. Vedi il file `LICENSE` per dettagli.

## 🙏 Acknowledgments

- **Nuxt Team** per il fantastico meta-framework
- **Vuetify Team** per i componenti Material Design
- **Vue.js Community** per l'ecosistema incredibile

---

<div align="center">

**Costruito con ❤️ usando Nuxt 4 e Vue 3**

[🌐 Demo](https://plongo.github.io/timeboxing/) • [📖 Docs](https://github.com/plongo/timeboxing/wiki) • [🐛 Issues](https://github.com/plongo/timeboxing/issues) • [💬 Discussions](https://github.com/plongo/timeboxing/discussions)

</div>
