<script setup lang="ts">
import TodosHeader from '../components/Todos/Header.vue'
import TodosList from '../components/Todos/TodosList.vue'
import AddTodo from '../components/Todos/AddTodo.vue'
import { onMounted, ref, watch, watchEffect } from 'vue'
import { getTodos } from '../utils/todo'
import { getCategories } from '../utils/category'
import TodoSkeletons from '../components/Todos/TodoSkeletons.vue'
import CategorySlider from '../components/CategorySlider.vue'
import { auth } from '../db/index'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import { useCategoriesStore } from './../store/useCategoriesStore'
import { useSlideStore } from './../store/useSlideStore'

import { useDialog } from 'primevue/usedialog'

const toast = useToast()

const dialog = useDialog()

const visible = ref(false)

const loading = ref<boolean>(false)

const user = auth.currentUser

const categories = ref([])

const categoryStore = useCategoriesStore()
const localSelectedCategoryId = ref(categoryStore.selectedCategoryId)

const slideStore = useSlideStore()

const isSlideOpen = ref(slideStore.isSlideOpen)

watch(
  () => slideStore.isSlideOpen,
  (newVal) => {
    isSlideOpen.value = newVal
  }
)

watch(
  () => categoryStore.selectedCategoryId,
  (newVal) => {
    if (newVal !== null) {
      localSelectedCategoryId.value = newVal
      // Menampilkan alert dengan menggunakan PrimeVue Toast atau native alert
      // toast.add({
      //   severity: 'success',
      //   detail: 'Category Selected',
      //   life: 3000,
      // })
    }
  },
  {
    immediate: false,
  }
)

onMounted(async () => {
  loading.value = true
  await getTodos()
  await getCategories()
  loading.value = false
})

const isPopupOpen = ref(false)

const openPopup = () => {
  visible.value = true
}

const closePopup = () => {
  visible.value = false
}

const addTodo = () => {
  // Your logic to add a todo
  visible.value = false
}

const checkCategoriesAndAddTodo = async () => {
  if (categoryStore.categories.length <= 0) {
    toast.add({
      severity: 'info',
      summary: "You don't have any categories, please add one to make a new todo ",
      detail: '',
      life: 3000,
    })
    // Logika selanjutnya
    visible.value = false
  } else if (localSelectedCategoryId.value == null) {
    visible.value = false 
    toast.add({
      severity: 'warn',
      summary: 'Please select a category before adding a todo ',

      detail: '',
      life: 3000,
    })
  } else {
    visible.value = true
  }
}
</script>

<template>
  <div :class="{ 'is-page-slide': isSlideOpen }" class="h-full max-w-[1000px] container mx-auto mt-0 px-7 bg-sky-50">
    <div class="display-name text-center text-gray-700  font-bold">What's Up, {{ user.displayName }}!</div>

    <div class="label-with-margin1  text-transform: uppercase text-xs text-gray-400">Categories</div>

    <!-- <TodosHeader /> -->
    <div class="todos-slide-container">
      <CategorySlider />
    </div>
        <div class="label-with-margin text-transform: uppercase text-xs text-gray-400">Today's Task</div>

    <div v-if="loading">
      <TodoSkeletons />
    </div>

    <div class="todo-list-container update" v-else>
      <TodosList />
    </div>
    <div class="fixed bottom-0 w-full">
      <button @click="checkCategoriesAndAddTodo" class="floating-action-button bg-blue-500 hover:bg-blue-700 text-white font-bold p-0 rounded-full w-12 h-12 flex items-center justify-center shadow-lg cursor-pointer">
        <span class="material-icons">add</span>
      </button>
    </div>
    <div class="fixed">
      <div v-if="isPopupOpen" class="fixed inset-0 bg-white flex items-center justify-center p-4">
        <div class="bg-white rounded-lg p-5 max-w-md mx-auto w-full">
          <AddTodo @close-popup="closePopup" />
        </div>
      </div>
    </div>
    <Dialog
      v-model:visible="visible"
      modal
      :pt="{
        root: 'border-none',
      }"
      class="bg-white h-full w-full"
    >
      <div class="flex items-center justify-center" style="height: 80vh">
        <div class="rounded-lg p-5 max-w-md mx-auto w-full">
          <AddTodo @close-popup="closePopup" />
        </div>
      </div>
      <button @click="closePopup" class="hanging-button fixed border top-5 right-5 bg-white text-gray-600 font-bold p-0 rounded-full w-12 h-12 flex items-center justify-center shadow-sm cursor-pointer">
        <span class="material-icons">close</span>
      </button>
    </Dialog>
    <Toast />
  </div>
</template>
<style lang="scss" scoped>
.display-name {
  padding-top: 60px;
  padding-bottom: 30px;
  text-align: left;
  font-size: 28px;
}

.floating-action-button {
  position: absolute !important;
  bottom: 20px !important;
  right: 50px !important;
  background-color: #007bff; /* Warna biru */
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px; /* Sesuaikan ukuran sesuai kebutuhan */
  height: 50px; /* Sesuaikan ukuran sesuai kebutuhan */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.todo-list-container {
  max-height: calc(100vh - 360px); /* Sesuaikan 120px berdasarkan elemen lain di halaman Anda */
  overflow-y: auto; /* Ini memungkinkan scrolling */
}

.is-page-slide {
  height: 92vh;
  margin-top: 30px;
  border-radius: 25px;
  overflow: hidden;
}
.is-page-back {
  height: 100%;
  background-color: rgb(240 249 255);
}
.label-with-margin  {
  margin-top: -15px;
  padding-bottom: 20px;
}
.label-with-margin1  {
  margin-top: -20px;
  padding-bottom: 15px;
}
</style>
