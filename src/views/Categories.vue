<script setup lang="ts">
import CategoriesList from '../components/Categories/CategoriesList.vue'
import AddCategory from '../components/Categories/AddCategory.vue'
import { onMounted, ref, watch } from 'vue'
import { getCategories } from '../utils/category'
import TodoSkeletons from '../components/Todos/TodoSkeletons.vue'
import { useSlideStore } from './../store/useSlideStore'

import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'

import { useDialog } from 'primevue/usedialog'

const slideStore = useSlideStore()

const isSlideOpen = ref(slideStore.isSlideOpen)

const toast = useToast()

const dialog = useDialog()

const visible = ref(false)

const loading = ref<boolean>(false)

watch(
  () => slideStore.isSlideOpen,
  (newVal) => {
    isSlideOpen.value = newVal
  }
)

onMounted(async () => {
  loading.value = true
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

const addCategory = () => {
  // Your logic to add a todo
  visible.value = false
}
</script>

<template>
  <div :class="isSlideOpen?  'is-page-slide': 'is-page-back'" class=" max-w-[1000px] container mx-auto mt-0 px-7 bg-sky-50">
    <TodoSkeletons v-if="loading" />
    <div v-else class="category-page-container">
      <div class="display-name text-center text-gray-600 text-4xl font-bold">Categories.</div>
      <div class="category-list-container">
              <CategoriesList />
      </div>
    </div>

    <div class="fixed bottom-0 w-full">
      <button @click="openPopup" class="floating-action-button bg-blue-500 hover:bg-blue-700 text-white font-bold p-0 rounded-full w-12 h-12 flex items-center justify-center shadow-lg cursor-pointer">
        <span class="material-icons">add</span>
      </button>
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
          <AddCategory @close-popup="closePopup" />
        </div>
      </div>
      <button @click="closePopup" class="hanging-button fixed border top-5 right-5 bg-white text-gray-600 font-bold p-0 rounded-full w-12 h-12 flex items-center justify-center shadow-sm cursor-pointer">
        <span class="material-icons">close</span>
      </button>
    </Dialog>
    <Toast />
  </div>
</template>

<style scoped>
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

.display-name {
  text-align: center;
  margin-bottom: 50px;
  padding-top: 100px;

}

.is-page-slide {
  height: 92vh;
  margin-top: 30px;
  border-radius: 25px;
  overflow: hidden;
}

.is-page-back {
  height: 100%;
}
/* .category-list-container {
  max-height: calc(100vh - 240px);
  overflow-y: 
} */
</style>
