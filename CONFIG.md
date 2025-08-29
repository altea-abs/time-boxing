# Configurazione Brain Dump & Timeboxing

## 🔧 Configurazione Runtime

L'applicazione utilizza il **runtime config** di Nuxt per gestire configurazioni dinamiche tramite variabili d'ambiente.

### 📁 File `.env`

```bash
# Numero massimo di priorità selezionabili
NUXT_MAX_PRIORITIES=5

# Durata auto-hide per gli alert (millisecondi)
NUXT_ALERT_AUTO_HIDE_DELAY=5000

# Abilitare il salvataggio automatico
NUXT_AUTO_SAVE_ENABLED=true
```

### ⚙️ Valori di Default

| Variabile | Default | Min | Max | Descrizione |
|-----------|---------|-----|-----|-------------|
| `NUXT_MAX_PRIORITIES` | `5` | `1` | `10` | Numero massimo priorità |
| `NUXT_ALERT_AUTO_HIDE_DELAY` | `5000` | `1000` | `30000` | Durata alert (ms) |
| `NUXT_AUTO_SAVE_ENABLED` | `true` | - | - | Auto-save attivo |

## 🏗 Architettura

### 📦 Flusso della Configurazione

```
.env → nuxt.config.ts → usePrioritiesStore → Componenti
```

1. **`.env`** - Variabili d'ambiente
2. **`nuxt.config.ts`** - Runtime config con validazione
3. **`usePrioritiesStore`** - Store che legge config e la espone ai componenti
4. **Componenti** - Leggono solo dallo store

### 🎯 Store-Centralized Config

La configurazione è **centralizzata nello store** `usePrioritiesStore`:

```typescript
// ✅ Corretto - Componenti leggono dallo store
const prioritiesStore = usePrioritiesStore()
const { maxPriorities, priorityLabelText } = storeToRefs(prioritiesStore)

// ❌ Evitare - Accesso diretto alla config
const config = useRuntimeConfig() // Solo per lo store!
```

## 📊 Valori Esposti dallo Store

### 🔗 Configurazione Reattiva

```typescript
// Valori configurabili
maxPriorities: Ref<number>          // Numero max priorità
alertAutoHideDelay: Ref<number>     // Durata alert
priorityLabelText: Ref<string>      // "Priorità (5 max)"

// Getters derivati
priorityCount: Ref<number>          // Priorità correnti
isFull: Ref<boolean>               // Se raggiunte il max
availableSlots: Ref<number>        // Slot rimasti
```

### 🎨 Esempio Utilizzo nei Componenti

```vue
<template>
  <h2>{{ priorityLabelText }}</h2>
  <p>Selezionate: {{ priorityCount }}/{{ maxPriorities }}</p>
  <div v-if="isFull">Limite raggiunto!</div>
</template>

<script setup>
const store = usePrioritiesStore()
const { 
  maxPriorities, 
  priorityLabelText, 
  priorityCount,
  isFull 
} = storeToRefs(store)
</script>
```

## 🔄 Aggiornamento Runtime

### 📝 Per Cambiare la Configurazione:

1. **Modifica `.env`**:
   ```bash
   NUXT_MAX_PRIORITIES=7  # Da 5 a 7 priorità
   ```

2. **Riavvia il server**:
   ```bash
   npm run dev
   ```

3. **Automaticamente**:
   - Lo store si aggiorna
   - I componenti si ri-renderizzano
   - LocalStorage si adatta al nuovo limite
   - L'UI mostra "Priorità (7 max)"

## 🧪 Testing

### ✅ Come Testare:

1. **Cambia `.env`**: `NUXT_MAX_PRIORITIES=3`
2. **Riavvia**: `npm run dev`  
3. **Verifica**:
   - Header mostra "Priorità (3 max)"
   - Alert mostra "massimo 3 priorità"
   - Funzionalità rispetta il nuovo limite

### 🔍 Debug Info

In modalità development, puoi leggere i valori di configurazione direttamente dallo store:

```typescript
const prioritiesStore = usePrioritiesStore()
console.log({
  maxPriorities: prioritiesStore.maxPriorities,
  alertAutoHideDelay: prioritiesStore.alertAutoHideDelay,
  // Altri valori...
})
```

## 🚨 Validazione

### ⚡ Validazione Automatica

La configurazione include validazione automatica:

```typescript
// maxPriorities: min 1, max 10
// alertAutoHideDelay: min 1s, max 30s
// autoSaveEnabled: boolean conversion
```

### ❌ Valori Non Validi

Se `.env` contiene valori non validi, vengono utilizzati i default sicuri:

```bash
NUXT_MAX_PRIORITIES=99  # → diventa 10 (max)
NUXT_MAX_PRIORITIES=0   # → diventa 1 (min)
NUXT_ALERT_AUTO_HIDE_DELAY=100 # → diventa 1000 (min)
```

## 🎯 Vantaggi dell'Architettura

1. **📡 Reactive**: Cambio configurazione = aggiornamento automatico UI
2. **🔒 Centralized**: Un solo punto di accesso (store)
3. **✅ Validated**: Valori sempre sicuri e validi
4. **🔄 Persistent**: LocalStorage si adatta automaticamente
5. **🧪 Testable**: Facile test di configurazioni diverse
6. **📱 Consistent**: Tutti i componenti usano stessi valori