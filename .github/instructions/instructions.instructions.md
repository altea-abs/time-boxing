---
applyTo: '**'
---
# Prompt Progetto: Brain Dump & Timeboxing Daily Planner

## Obiettivo
Crea un'applicazione web single-page per la gestione della produttività giornaliera basata sulla metodologia Brain Dump e Timeboxing. L'app deve digitalizzare un template cartaceo esistente con 3 sezioni principali: Priorità, Brain Dump e Allocazione Temporale.

## Metodologia Brain Dump & Timeboxing

La metodologia prevede 3 fasi sequenziali:

1. **Brain Dump**: Svuotare la mente trasferendo tutti i pensieri, task e idee in una lista
2. **Selezione Priorità**: Identificare e selezionare i 3 task più importanti dalla lista
3. **Allocazione Temporale**: Assegnare le priorità a slot temporali specifici della giornata

## Specifiche Funzionali

### Layout
- **Colonna Sinistra** (mobile: 50%, desktop: 35-40%):
  - Sezione Priorità (top): 3 slot numerati per i task prioritari
  - Sezione Brain Dump (bottom): lista scrollabile con input per aggiungere task
- **Colonna Destra** (mobile: 50%, desktop: 60-65%):
  - Griglia oraria 8:00-20:00 con slot da 30 minuti (24 slot totali)
- **Footer**: Sezione note opzionale

### Flusso Operativo
1. L'utente inserisce tutti i task nel brain dump (solo testo semplice)
2. Seleziona manualmente 3 task come priorità 
3. Trascina le attività nelle priorità negli slot temporali. Quando tutte le priorità solo allocate allora pùo procedere con quelle nel braindump
4. Può aggiungere note alla giornata

### Funzionalità Core
- Aggiunta/rimozione task dal brain dump
- Selezione di massimo 3 priorità con click dal brain dump
- Drag & drop delle attività negli slot temporali
- Un task può occupare più slot consecutivi
- Salvataggio automatico in LocalStorage
- Design minimalista senza distrazioni

## Specifiche Tecniche

### Stack
- **Framework**: Nuxt 4 con TypeScript
- **State Management**: Pinia 
- **UI**: Vuetify 3 (Material Design)
- **Storage**: LocalStorage browser
- **Mode**: SPA (ssr: false)



## Design Guidelines

### Stile Visivo
- **Minimalista**: Niente elementi decorativi superflui
- **Palette**: Colori neutri (grigio/bianco) con accenti per le priorità e preferenz alla dark mode
- **Typography**: Font leggibile, gerarchie chiare
- **Spacing**: Ampio uso di spazio bianco

### Responsive
- Mobile (<768px): Layout 50-50
- Tablet (768-1024px): Layout 45-55  
- Desktop (>1024px): Layout 40-60
- Wide (>1440px): Layout 35-65

## Requisiti Output

Crea un'applicazione Vue/Nuxt completa e funzionante con:
1. Tutte le funzionalità descritte implementate
2. Drag & drop funzionante per l'allocazione temporale
3. Persistenza dati in LocalStorage
4. Design pulito e professionale con Vuetify
5. TypeScript per type safety
6. Codice ben strutturato e commentato

L'applicazione deve essere pronta all'uso, con un'interfaccia intuitiva che segua il flusso metodologico del brain dump → priorità → timeboxing.