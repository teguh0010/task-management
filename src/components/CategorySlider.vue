<script setup lang="ts">
import { ref, onMounted, watch, watchEffect } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import SwiperCore, { Pagination, Navigation } from 'swiper';
import { firestore } from '../db/index';
import { doc, updateDoc } from "firebase/firestore";
import { useCategoriesStore } from '../store/useCategoriesStore';
import { useTodosStore } from '../store/useTodosStore'; // Asumsikan Anda punya ini

SwiperCore.use([Pagination, Navigation]);
const slidesPerView = ref(1.5);
const spaceBetween = ref(20);

const store = useCategoriesStore();
const todosStore = useTodosStore(); 
const progressBarWidth = ref({});

const categoryTaskCounts = ref({});

const updateCategoryTaskCounts = () => {
  store.categories.forEach(category => {
    const categoryTodos = todosStore.todos.filter(todo => todo.categoryId === category.id);
    categoryTaskCounts.value[category.id] = categoryTodos.length;
  });
};

onMounted(() => {
  updateCategoryTaskCounts();
  store.categories.forEach(category => {
    calculateCompletion(category.id);
  });
});

watch([() => store.categories, () => todosStore.todos], () => {
  updateCategoryTaskCounts();
  store.categories.forEach(category => {
    calculateCompletion(category.id);
  });
}, { deep: true });


const calculateCompletion = async (categoryId) => {
  const categoryTodos = todosStore.todos.filter(todo => todo.categoryId === categoryId);
  const completedTodos = categoryTodos.filter(todo => todo.completed).length;
  const progress = categoryTodos.length > 0 ? (completedTodos / categoryTodos.length) * 100 : 0;
  progressBarWidth.value[categoryId] = progress;
};

onMounted(() => {
  store.categories.forEach(category => {
    calculateCompletion(category.id);
  });
});

watch(() => store.categories, (newCategories) => {
  newCategories.forEach(category => {
    calculateCompletion(category.id);
  });
}, { deep: true });

const onSlideClick = (categoryId: string) => {
  store.setSelectedCategoryId(categoryId)
}
</script>


<template>
  <swiper class="my-swiper"  :slides-per-view="store.categories.length > 1 ? 1.7 : 1" :centered-slides="false" :space-between="20" :grab-cursor="true">
    <swiper-slide v-for="category in store.categories" :key="category.id" class="my-slide">
      <div class="slider-item-content ">
        <div  class="pb-0 text-transform: capitalize text-xs text-gray-400" style="cursor: pointer">
            {{ categoryTaskCounts[category.id] || 0 }} tasks
        </div>
        <div @click="onSlideClick(category.id)" class=" text-gray-700 pb-2 text-lg font-semibold text-transform: capitalize" style="cursor: pointer">
          {{ category.name }}
        </div>
        <div class="w-full slider-container">
        <div class="w-full bg-gray-300 rounded-full h-1 custom-progressbar">
          <div class="bg-blue-600 h-1 rounded-full" :style="{ width: `${progressBarWidth[category.id] || 0}%` }"></div>
        </div>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</template>


<style lang="scss" scoped>
/* Global or Component level styles without SCSS nesting */
.my-swiper {
  padding-bottom: 40px;
}
.my-slide {
  width: 65%;
  display: flex;
  justify-content: center;
  height: 100px;
  align-items: center;
  border: 2px solid white;
  border-radius: 25px; 
  background-color: #ffffff;
  box-shadow: 0 8px 16px rgba(0, 0, 255, 0.02), 0 4px 8px rgba(0, 0, 255, 0.01);
}

.my-slide:nth-child(2n) {
  width: 40%;
}

.my-slide:nth-child(3n) {
  width: 20%;
}
.slider-item-content {
      width: 100%;
    padding: 20px;
}
.slider-container {
  padding-top: 10px;
}

</style>
