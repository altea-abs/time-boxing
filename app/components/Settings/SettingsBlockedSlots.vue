<template>
  <div class="settings-blocked-slots">
    <h3 class="section-title">Slot Bloccati</h3>
    <p class="section-description">
      Configura attività ricorrenti che bloccheranno gli slot temporali (es. riunioni, pause pranzo)
    </p>

    <!-- Lista slot bloccati esistenti -->
    <div class="blocked-slots-list" v-if="blockedSlots.length > 0">
      <div
        v-for="slot in blockedSlots"
        :key="slot.id"
        class="blocked-slot-item"
        :class="{ 'disabled': !slot.enabled }"
      >
        <div class="slot-header">
          <div class="slot-info">
            <div class="slot-title">{{ slot.title }}</div>
            <div class="slot-time">{{ slot.startTime }} - {{ slot.endTime }}</div>
            <div class="slot-days">{{ formatDaysOfWeek(slot.daysOfWeek) }}</div>
          </div>
          
          <div class="slot-actions">
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              @click="editSlot(slot)"
              :disabled="!slot.enabled"
            />
            <v-btn
              :icon="slot.enabled ? 'mdi-eye-off' : 'mdi-eye'"
              variant="text"
              size="small"
              @click="toggleSlot(slot.id)"
              :color="slot.enabled ? 'primary' : 'grey'"
            />
            <v-btn
              icon="mdi-delete"
              variant="text"
              size="small"
              color="error"
              @click="removeSlot(slot.id)"
            />
          </div>
        </div>
        
        <div class="slot-color-bar" :style="{ backgroundColor: slot.color || '#9C27B0' }"></div>
        
        <div class="slot-description" v-if="slot.description">
          {{ slot.description }}
        </div>
      </div>
    </div>

    <!-- Messaggio vuoto -->
    <div class="empty-state" v-else>
      <v-icon icon="mdi-calendar-clock" size="48" color="grey-lighten-1" />
      <p>Nessuno slot bloccato configurato</p>
    </div>

    <!-- Bottone aggiungi -->
    <v-btn
      @click="showAddDialog = true"
      color="primary"
      variant="outlined"
      prepend-icon="mdi-plus"
      class="add-button"
    >
      Aggiungi Slot Bloccato
    </v-btn>

    <!-- Dialog per aggiungere/modificare slot -->
    <v-dialog v-model="showAddDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="text-h6">
          {{ editingSlot ? 'Modifica Slot Bloccato' : 'Nuovo Slot Bloccato' }}
        </v-card-title>
        
        <v-card-text>
          <v-form ref="formRef" v-model="formValid">
            <v-text-field
              v-model="formData.title"
              label="Titolo *"
              placeholder="es. Riunione team, Pausa pranzo"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-4"
            />
            
            <div class="time-inputs">
              <v-select
                v-model="formData.startTime"
                :items="timeOptions"
                label="Ora inizio *"
                :rules="[rules.required]"
                variant="outlined"
                class="time-field"
              />
              
              <v-select
                v-model="formData.endTime"
                :items="timeOptions"
                label="Ora fine *"
                :rules="[rules.required, rules.endTimeAfterStart]"
                variant="outlined"
                class="time-field"
              />
            </div>
            
            <div class="days-selection">
              <label class="days-label">Giorni della settimana *</label>
              <div class="days-chips">
                <v-chip
                  v-for="(day, index) in weekDays"
                  :key="index"
                  :color="formData.daysOfWeek.includes(index) ? 'primary' : 'grey-lighten-2'"
                  :variant="formData.daysOfWeek.includes(index) ? 'flat' : 'outlined'"
                  @click="toggleDay(index)"
                  class="day-chip"
                >
                  {{ day.short }}
                </v-chip>
              </div>
            </div>
            
            <v-text-field
              v-model="formData.color"
              label="Colore (opzionale)"
              placeholder="#9C27B0"
              variant="outlined"
              class="mb-4"
            >
              <template #append-inner>
                <input
                  type="color"
                  v-model="formData.color"
                  class="color-picker"
                />
              </template>
            </v-text-field>
            
            <v-textarea
              v-model="formData.description"
              label="Descrizione (opzionale)"
              placeholder="Informazioni aggiuntive su questo slot bloccato"
              variant="outlined"
              rows="3"
            />
          </v-form>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="cancelDialog"
          >
            Annulla
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="saveSlot"
            :disabled="!formValid || formData.daysOfWeek.length === 0"
          >
            {{ editingSlot ? 'Salva' : 'Aggiungi' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { BlockedSlot, CreateBlockedSlotInput, UpdateBlockedSlotInput } from '~/types'

const settingsStore = useSettingsStore()
const timeSlotsStore = useTimeSlotsStore()
const { blockedSlots } = storeToRefs(settingsStore)

// Dialog state
const showAddDialog = ref(false)
const editingSlot = ref<BlockedSlot | null>(null)
const formValid = ref(false)
const formRef = ref()

// Form data
const formData = ref<CreateBlockedSlotInput>({
  title: '',
  startTime: '09:00',
  endTime: '10:00',
  daysOfWeek: [],
  color: '#9C27B0',
  description: ''
})

// Week days
const weekDays = [
  { name: 'Domenica', short: 'Dom' },
  { name: 'Lunedì', short: 'Lun' },
  { name: 'Martedì', short: 'Mar' },
  { name: 'Mercoledì', short: 'Mer' },
  { name: 'Giovedì', short: 'Gio' },
  { name: 'Venerdì', short: 'Ven' },
  { name: 'Sabato', short: 'Sab' }
]

// Time options (15 minute intervals)
const timeOptions = computed(() => {
  const options = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      options.push(timeString)
    }
  }
  return options
})

// Validation rules
const rules = {
  required: (value: string) => !!value || 'Campo obbligatorio',
  endTimeAfterStart: (value: string) => {
    const startMinutes = timeStringToMinutes(formData.value.startTime)
    const endMinutes = timeStringToMinutes(value)
    return endMinutes > startMinutes || "L'ora di fine deve essere successiva all'ora di inizio"
  }
}

// Helper function
const timeStringToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number)
  return hours * 60 + minutes
}

const formatDaysOfWeek = (daysOfWeek: number[]): string => {
  if (daysOfWeek.length === 7) return 'Tutti i giorni'
  if (daysOfWeek.length === 0) return 'Nessun giorno'
  
  const dayNames = daysOfWeek
    .sort((a, b) => a - b)
    .map(day => weekDays[day].short)
  
  return dayNames.join(', ')
}

const toggleDay = (dayIndex: number) => {
  const index = formData.value.daysOfWeek.indexOf(dayIndex)
  if (index > -1) {
    formData.value.daysOfWeek.splice(index, 1)
  } else {
    formData.value.daysOfWeek.push(dayIndex)
  }
}

const editSlot = (slot: BlockedSlot) => {
  editingSlot.value = slot
  formData.value = {
    title: slot.title,
    startTime: slot.startTime,
    endTime: slot.endTime,
    daysOfWeek: [...slot.daysOfWeek],
    color: slot.color || '#9C27B0',
    description: slot.description || ''
  }
  showAddDialog.value = true
}

const toggleSlot = (slotId: string) => {
  settingsStore.toggleBlockedSlot(slotId)
  // Update existing time slots to reflect the change
  timeSlotsStore.updateSlotsWithBlockedStatus()
}

const removeSlot = (slotId: string) => {
  if (confirm('Sei sicuro di voler eliminare questo slot bloccato?')) {
    settingsStore.removeBlockedSlot(slotId)
    // Update existing time slots to reflect the change
    timeSlotsStore.updateSlotsWithBlockedStatus()
  }
}

const saveSlot = () => {
  if (editingSlot.value) {
    // Update existing slot
    const updates: UpdateBlockedSlotInput = {
      title: formData.value.title,
      startTime: formData.value.startTime,
      endTime: formData.value.endTime,
      daysOfWeek: formData.value.daysOfWeek,
      color: formData.value.color,
      description: formData.value.description
    }
    settingsStore.updateBlockedSlot(editingSlot.value.id, updates)
  } else {
    // Add new slot
    settingsStore.addBlockedSlot(formData.value)
  }
  
  // Update existing time slots to reflect the changes
  timeSlotsStore.updateSlotsWithBlockedStatus()
  
  cancelDialog()
}

const cancelDialog = () => {
  showAddDialog.value = false
  editingSlot.value = null
  formData.value = {
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    daysOfWeek: [],
    color: '#9C27B0',
    description: ''
  }
  if (formRef.value) {
    formRef.value.reset()
  }
}
</script>

<style scoped>
.settings-blocked-slots {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin: 0;
}

.section-description {
  color: rgb(var(--v-theme-on-surface-variant));
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
}

.blocked-slots-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.blocked-slot-item {
  background: rgb(var(--v-theme-surface-variant));
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.blocked-slot-item.disabled {
  opacity: 0.6;
}

.slot-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  padding-bottom: 0.5rem;
}

.slot-info {
  flex: 1;
}

.slot-title {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 0.25rem;
}

.slot-time {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-primary));
  font-family: 'Roboto Mono', monospace;
  margin-bottom: 0.25rem;
}

.slot-days {
  font-size: 0.8rem;
  color: rgb(var(--v-theme-on-surface-variant));
}

.slot-actions {
  display: flex;
  gap: 0.25rem;
}

.slot-color-bar {
  height: 4px;
  width: 100%;
}

.slot-description {
  padding: 0.5rem 1rem 1rem;
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface-variant));
  font-style: italic;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: rgb(var(--v-theme-on-surface-variant));
}

.empty-state p {
  margin: 1rem 0 0 0;
  font-size: 0.9rem;
}

.add-button {
  align-self: flex-start;
}

.time-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.time-field {
  margin-bottom: 0 !important;
}

.days-selection {
  margin-bottom: 1rem;
}

.days-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 0.5rem;
}

.days-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.day-chip {
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-picker {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background: none;
}

@media (max-width: 600px) {
  .time-inputs {
    grid-template-columns: 1fr;
  }
  
  .slot-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .slot-actions {
    align-self: flex-end;
  }
}
</style>