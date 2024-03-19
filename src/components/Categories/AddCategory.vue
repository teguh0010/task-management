<script setup lang="ts">
import { User } from '@firebase/auth'
import { addDoc } from '@firebase/firestore'
import { uuidv4 } from '@firebase/util'
import { ref, defineEmits } from 'vue'
import { auth, categoriesRef } from '../../db'
import { Category, useCategoriesStore } from '../../store/useCategoriesStore'
import { getCategories } from '../../utils/category'
import { useToast } from 'primevue/usetoast'

const categoryName = ref('')

const toast = useToast()

const emit = defineEmits(['close-popup'])

const store = useCategoriesStore()

const name = ref<string>('')

const addCategory = async () => {
  emit('close-popup')
  if (!name.value) return

  const newCategory: Pick<Category, 'name' | 'userId' | 'createdAt'> = {
    name: name.value,
    userId: (auth.currentUser as User).uid,
    createdAt: new Date(),
  }

  // Reset fields
  categoryName.value = ''

  const newCategories = [{ id: uuidv4(), ...newCategory }, ...store.categories]

  store.updateCategories(newCategories)

  toast.add({
    severity: 'success',
    summary: '',
    detail: 'Category Added',
    life: 3000,
  })

  await addDoc(categoriesRef, newCategory)
  await getCategories()
}

//baru
</script>

<template>
  <div>
    <input type="text" placeholder="Add new category" class="border border-none focus:border-none focus:ring-0 focus:outline-none text-gray-500 p-2 w-full mb-4 text-lg" style="font-size: 24px" @keyup.enter="addCategory" v-model="name" />
    <button class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full" @click="addCategory">Add Category</button>
  </div>
  <Toast />
</template>
