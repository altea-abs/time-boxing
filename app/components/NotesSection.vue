<template>
  <div class="notes-section">
    <!-- Header -->
    <div class="section-header">
      <h3 class="section-title">
        <v-icon icon="mdi-notebook" class="mr-2" />
        Note della Giornata
      </h3>
    </div>

    <!-- Notes textarea -->
    <v-textarea
      v-model="notes"
      placeholder="Aggiungi note per la giornata: obiettivi, riflessioni, promemoria..."
      variant="outlined"
      rows="6"
      no-resize
      hide-details
      class="notes-input"
    />

    <!-- Character count and actions -->
    <div class="notes-footer">
      <div class="char-count">
        {{ notes.length }}/1000 caratteri
      </div>
      <div class="notes-actions">
        <v-btn
          v-if="notes.trim()"
          icon="mdi-content-copy"
          size="small"
          variant="text"
          @click="copyNotes"
          title="Copia note"
        />
        <v-btn
          v-if="notes.trim()"
          icon="mdi-delete"
          size="small"
          variant="text"
          color="error"
          @click="clearNotes"
          title="Cancella note"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Use notes store
const notesStore = useNotesStore()

// Get current notes from store
const { currentNotes } = storeToRefs(notesStore)

// Computed property for v-model
const notes = computed({
  get: () => currentNotes.value.content,
  set: (value: string) => {
    notesStore.updateNotes(value)
  }
})

// Actions
const copyNotes = async () => {
  try {
    await navigator.clipboard.writeText(notes.value)
    // You could add a toast notification here if needed
  } catch (err) {
    console.error('Failed to copy notes:', err)
  }
}

const clearNotes = () => {
  notesStore.clearNotes()
}
</script>

<style scoped>
.notes-section {
  margin-top: 1.5rem;
}

.section-header {
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  display: flex;
  align-items: center;
}

.notes-input {
  margin-bottom: 0.5rem;
}

.notes-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
}

.char-count {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface-variant));
  opacity: 0.7;
}

.notes-actions {
  display: flex;
  gap: 0.25rem;
}

:deep(.v-textarea .v-field__input) {
  font-family: inherit;
  line-height: 1.5;
}

:deep(.v-textarea .v-field__field) {
  --v-field-input-padding-top: 12px;
  --v-field-input-padding-bottom: 12px;
}

@media (max-width: 600px) {
  .notes-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .notes-actions {
    align-self: flex-end;
  }
}
</style>