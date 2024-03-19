<script setup lang="ts">
import { updateDoc, doc, deleteDoc } from '@firebase/firestore'
import { firestore } from '../../db'
import { useTodosStore } from '../../store/useTodosStore'
import CheckIcon from '../CheckIcon.vue'
import { reactive, ref, computed, onMounted } from 'vue'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useToast } from 'primevue/usetoast'

import { useCategoriesStore } from '../../store/useCategoriesStore'

const categoryStore = useCategoriesStore()

// Reactive state to track swipe state and temporary deletion
const toast = useToast()
const swipeState = reactive(new Map())
const store = useTodosStore()
const startX = ref(0)
const displacements = reactive({})
const isTempDelete = reactive({})
const timeoutIds = reactive(new Map())

const selectedCategoryId = categoryStore.selectedCategoryId
// const selectedCategoryId = ref(null); // Make sure it's a ref

onMounted(() => {
  if (categoryStore.categories.length > 0 && !categoryStore.selectedCategoryId) {
    const firstCategoryId = categoryStore.categories[0].id
    categoryStore.setSelectedCategoryId(firstCategoryId)
  }
})

// Function to handle touch start event
const onTouchStart = (id, event) => {
  startX.value = event.touches[0].clientX
  console.log('startX.value', startX.value)
  if (!(id in displacements)) {
    displacements[id] = 0
  }
}

// Function to handle touch move event
// const onTouchMove = (id, event) => {
//   const touchCurrentX = event.touches[0].clientX;
//   const deltaX = touchCurrentX - startX.value;
//   // Cek apakah perpindahan lebih horizontal daripada vertikal
//   if (Math.abs(deltaX) > Math.abs(event.touches[0].clientY - startY.value)) {
//     event.preventDefault();
//   }
//   displacements[id] = deltaX;
// };

const onTouchMove = (id, event) => {
  // event.preventDefault(); // Komentari atau hapus baris ini
  const touchCurrentX = event.touches[0].clientX
  displacements[id] = touchCurrentX - startX.value
}

// Function to handle touch end event
const onTouchEnd = (id) => {
  const viewportWidth = window.innerWidth
  const thresholdPercentage = 0.25 //25% from screen
  const threshold = viewportWidth * thresholdPercentage

  if (Math.abs(displacements[id]) >= threshold) {
    isTempDelete[id] = true

    const fullWidth = viewportWidth
    displacements[id] = Math.sign(displacements[id]) * fullWidth

    const timeoutId = setTimeout(() => {
      removeTodo(id)
    }, 3000)

    timeoutIds.set(id, timeoutId)
  } else {
    displacements[id] = 0
  }
}

// Function to undo temporary deletion
const undoDelete = (id) => {
  const timeoutId = timeoutIds.get(id)
  clearTimeout(timeoutId)
  isTempDelete[id] = false
  displacements[id] = 0
  timeoutIds.delete(id)
}

const completeTodo = async (id: string, newValue: boolean) => {
  const todoRef = doc(firestore, 'todos', id)
  await updateDoc(todoRef, { completed: newValue })

  const newTodos = store.todos.map((todo) => (todo.id === id ? { ...todo, completed: newValue } : todo))
  store.updateTodos(newTodos)

  const updatedTodo = store.todos.find((todo) => todo.id === id)
  const categoryId = updatedTodo ? updatedTodo.categoryId : null

  if (categoryId) {
    useCategoriesStore().updateCategoryProgress(categoryId)
  }
}

// Function to remove todo item
const removeTodo = (id: string) => {
  const todoRef = doc(firestore, 'todos', id)
  deleteDoc(todoRef)

  const newTodos = store.todos.filter((todo) => todo.id !== id)
  store.updateTodos(newTodos)
  toast.add({
    severity: 'success',
    summary: '',
    detail: 'Task Deleted',
    life: 3000,
  })
}

// Function to handle swipe action on an item
const onSwipeItem = (id: string) => {
  return function (direction, mouseEvent) {
    if (direction === 'left') {
      swipeState.set(id, true)
      setTimeout(() => {
        swipeState.set(id, false)
      }, 1000)
    }
  }
}

const filteredTodos = computed(() => {
  const categoryId = categoryStore.selectedCategoryId // Ensure selectedCategoryId is properly accessed
  if (categoryId) {
    return store.todos.filter((todo) => todo.categoryId === categoryId)
  }
  return store.todos // Return all todos if no category is selected
})

// const filteredTodos = computed(() => {
//   const categoryId = categoryStore.selectedCategoryId.value; // Pastikan mengakses .value untuk reactive ref
//   return store.todos.filter(todo => !categoryId || todo.categoryId === categoryId);
// });
</script>

<template>
  <div>
    <div class="delete-slide-container" v-if="filteredTodos.length > 0">
      <ul class="mt-0">
        <li v-for="todo in filteredTodos" :key="todo.id">
          <div v-if="isTempDelete[todo.id]" class="undo-container flex items-center justify-between py-3">
            <span class="deleted-text-icon text-gray-400 material-symbols-outlined"> delete </span>
            <span class="deleted-text text-gray-400">The task was deleted</span>
            <button @click="undoDelete(todo.id)" class="undo-button rounded-full">Undo</button>
          </div>

          <div v-else @click="completeTodo(todo.id, !todo.completed)" class="todo-item w-full flex items-center mb-2 justify-start cursor-pointer rounded-xl py-4 px-4" @touchstart="onTouchStart(todo.id, $event)" @touchmove="onTouchMove(todo.id, $event)" @touchend="() => onTouchEnd(todo.id)" :style="{ transform: `translateX(${displacements[todo.id] || 0}px)` }">
            <div
              :class="{
                'bg-gray-50 border border-blue-500': !todo.completed,
                'bg-blue-300 border-0': todo.completed,
              }"
              class="flex items-center justify-center border w-6 h-6 rounded-full"
            >
              <CheckIcon class="checkmark" v-if="todo.completed" />
            </div>
            <div class="flex items-center gap-x-2 ml-5">
              <div class="font-medium text-gray-600 relative mx-30 px-30" :class="{ 'strike-through': todo.completed }">
                {{ todo.text }}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="flex items-center justify-center h-full">
      <div class="no-data-container">
        <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-file-6003616-4976679.png?f=webp" alt="No Data" class="no-data-image" />
        <p class="no-data-text">No data available</p>
      </div>
    </div>
    <Toast />
  </div>
</template>

<style>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
@keyframes strikeThrough {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* Style untuk garis animasi */
.strike-through::after {
  content: '';
  position: absolute;
  bottom: 40%;
  left: 0;
  width: 100%;
  height: 1px;
  background: currentColor; /* Menggunakan warna teks elemen */
  animation: strikeThrough 0.5s ease-out forwards; /* Gunakan animasi yang didefinisikan */
}

.swipe-left {
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: translateX(-150px);
}
.delete-slide-container {
  /* background: blue; */
  overflow: hidden;
}

.undo-message {
  color: white;
  background-color: #ff0000; /* Ganti warna latar belakang sesuai kebutuhan */
  padding: 5px 10px;
  border-radius: 5px;
}

.undo-button {
  background-color: #ffffff; /* Ganti warna latar belakang sesuai kebutuhan */
  color: rgb(54, 49, 49); /* Ganti warna teks sesuai kebutuhan */
  border: 1px solid rgb(156 163 175); /* Ganti warna border sesuai kebutuhan */
  padding: 5px 15px;
  border-radius: 25px;
  cursor: pointer;
  text-transform: uppercase;
  animation: undo-slide-in 0.5s ease-in-out forwards;
}

@keyframes undo-slide-in {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.slide-item {
  width: 100%; /* Ensure the sliding component occupies the full width */
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-item.swipe-left {
  transform: translateX(-150px); /* Adjust as needed */
}

.undo-container {
  width: 100%; /* Ensure full width */
  box-sizing: border-box; /* Include padding and border in the element's total width */
}

.todo-item {
  background: #ffffff;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box; /* Include padding and border in the element's total width */
}
.deleted-text {
  font-size: 20px;
}
.deleted-text-icon {
  font-size: 20px;
}
.no-data-text {
  margin-top: 20px;
  font-size: 18px;
  color: #777;
  text-align: center;
}
</style>
