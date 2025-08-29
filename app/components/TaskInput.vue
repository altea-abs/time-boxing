<template>
  <div class="task-input">
    <v-form @submit.prevent="addTask">
      <v-text-field
        v-model="newTaskText"
        label="Aggiungi un task al brain dump..."
        variant="outlined"
        :disabled="isAdding"
        :loading="isAdding"
        clearable
        @keydown.enter="addTask"
      >
        <template #append-inner>
          <v-btn
            :disabled="!newTaskText.trim() || isAdding"
            icon="mdi-plus"
            size="small"
            variant="text"
            @click="addTask"
          />
        </template>
      </v-text-field>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type { TaskInputEmits } from '~/types'

const emit = defineEmits<TaskInputEmits>()

const newTaskText = ref('')
const isAdding = ref(false)

const addTask = async () => {
  const taskText = newTaskText.value.trim()
  if (!taskText) return

  isAdding.value = true
  
  try {
    emit('taskAdded', taskText)
    newTaskText.value = ''
  } catch (error) {
    console.error('Error adding task:', error)
  } finally {
    isAdding.value = false
  }
}
</script>

<style scoped>
.task-input {
  margin-bottom: 1rem;
}
</style>