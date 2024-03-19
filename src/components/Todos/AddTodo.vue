<script setup lang="ts">
import { User } from '@firebase/auth'
import { addDoc } from '@firebase/firestore'
import { uuidv4 } from '@firebase/util'
import { ref, defineEmits } from 'vue'
import { auth, todosRef } from '../../db'
import { Todo, useTodosStore } from '../../store/useTodosStore'
import { getTodos } from '../../utils/todo'
import { useToast } from 'primevue/usetoast'

import { useCategoriesStore } from '../../store/useCategoriesStore'

const toast = useToast()

const categoryStore = useCategoriesStore()

const emit = defineEmits(['close-popup'])

const store = useTodosStore()

const text = ref<string>('')

const addTodo = async () => {
  emit('close-popup')
  if (!text.value) return

  const newTodo: Pick<Todo, 'text' | 'completed' | 'userId' | 'createdAt' | 'categoryId'> = {
    text: text.value,
    completed: false,
    userId: (auth.currentUser as User).uid,
    categoryId: categoryStore.selectedCategoryId, // Link to the category document
    createdAt: new Date(),
  }

  text.value = ''

  const newTodos = [{ id: uuidv4(), ...newTodo }, ...store.todos]

  store.updateTodos(newTodos)

  await addDoc(todosRef, newTodo)
  toast.add({
    severity: 'success',
    summary: '',
    detail: 'Task Added',
    life: 3000,
  })
  await getTodos()
}
</script>

<template>
  <div>
    <input type="text" placeholder="Add new todo" class="border border-none focus:border-none focus:ring-0 focus:outline-none text-gray-500 p-2 w-full mb-4 text-lg" style="font-size: 24px" @keyup.enter="addTodo" v-model="text" />
    <button class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full" @click="addTodo">Add Task</button>
    <Toast />
  </div>
</template>
