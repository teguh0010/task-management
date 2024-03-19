<script setup lang="ts">
import { updateDoc, doc, deleteDoc } from '@firebase/firestore'
import { firestore } from '../../db/index'
import { useCategoriesStore } from '../../store/useCategoriesStore'
import CheckIcon from '../CheckIcon.vue'
import { reactive, ref } from 'vue'
import { useToast } from 'primevue/usetoast'

// Reactive state to track swipe state and temporary deletion
const toast = useToast()
const swipeState = reactive(new Map())
const store = useCategoriesStore()
const startX = ref(0)
const displacements = reactive({})
const isTempDelete = reactive({})
const timeoutIds = reactive(new Map()); 


// Function to handle touch start event
const onTouchStart = (id, event) => {
  startX.value = event.touches[0].clientX
  if (!(id in displacements)) {
    displacements[id] = 0
  }
}

const onTouchMove = (id, event) => {
  // event.preventDefault(); // Komentari atau hapus baris ini
  const touchCurrentX = event.touches[0].clientX;
  displacements[id] = touchCurrentX - startX.value;
};

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

// Function to handle touch end event
const onTouchEnd = (id) => {
  const viewportWidth = window.innerWidth;
  const thresholdPercentage = 0.25; //25% from screen
  const threshold = viewportWidth * thresholdPercentage;

  if (Math.abs(displacements[id]) >= threshold) {
    isTempDelete[id] = true; 

    const fullWidth = viewportWidth;
    displacements[id] = Math.sign(displacements[id]) * fullWidth;

    const timeoutId = setTimeout(() => {
      removeCategory(id); 
    }, 3000);

    timeoutIds.set(id, timeoutId);
  } else {
    displacements[id] = 0; 
  }
};


// Function to undo temporary deletion
const undoDelete = (id) => {
  const timeoutId = timeoutIds.get(id);
  clearTimeout(timeoutId);
  isTempDelete[id] = false; 
  displacements[id] = 0; 
  timeoutIds.delete(id); 
};

// Function to update category (Not Done)
const updateCategory = async (id: string) => {
  const categoryRef = doc(firestore, 'categories', id)
  updateDoc(categoryRef, { name: "" })

  const newCategories = store.categories.map((category) =>
    category.id === id ? { ...category, completed: "" } : category
  )
  store.updateCategories(newCategories)
}

// Function to remove category item
const removeCategory = (id: string) => {
  const categoryRef = doc(firestore, 'categories', id)
  deleteDoc(categoryRef)

  const newCategories = store.categories.filter((category) => category.id !== id)
  store.updateCategories(newCategories)
   toast.add({
      severity: 'success',
      summary: "",
      detail: 'Category was deleted',
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
</script>

<template>
<div>
  <div class="slide-container" v-if="store.categories.length > 0">
    <ul >
      <li v-for="category in store.categories" :key="category.id">
        <div
          v-if="isTempDelete[category.id]"
          class="undo-container flex items-center justify-between py-3"
        >
          <span
            class="deleted-text-icon text-gray-400 material-symbols-outlined"
          >
            delete
          </span>
          <span class="deleted-text text-gray-400">The task was deleted</span>
          <button @click="undoDelete(category.id)" class="undo-button rounded-full">Undo</button>
        </div>

        <div
          v-else
          @click="updateCategory(category.id)"
          class="category-item w-full flex items-center mb-2 justify-start  cursor-pointer  rounded-xl py-4 px-4"
          @touchstart="onTouchStart(category.id, $event)"
          @touchmove="onTouchMove(category.id, $event)"
          @touchend="() => onTouchEnd(category.id)"
          :style="{ transform: `translateX(${displacements[category.id] || 0}px)` }"
        >
          
          <div class="flex items-center gap-x-2 ml-5">
            <div
              class="font-medium text-gray-600  relative mx-30 px-30"
            >
              {{ category.name }}
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
  </div>
              <Toast />
</template>

<style lang="scss" scoped>
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
.slide-container {
  /* background: blue; */
  overflow-x: hidden;
  padding-top: 0px;
  overflow-x: hidden;
    padding-top: 0px;
    max-height: calc(100vh - 240px);
    overflow-y: auto;
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
  border: 1px solid rgb(156 163 175);; /* Ganti warna border sesuai kebutuhan */
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

.category-item {
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

</style>
